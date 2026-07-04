/**
 * sanitizeImage — Ré-encodage canvas côté navigateur AVANT upload.
 *
 * POURQUOI ?
 * Certaines images (notamment les PNG générés par IA : C2PA, chunks zTXt
 * "Raw profile type iptc", CRC d'ancillary chunks non conformes) sont AFFICHÉES
 * par les navigateurs (décodeurs tolérants) mais REFUSÉES par libpng/GD côté
 * serveur (décodeur strict) → erreur "Unable to decode input" (HTTP 500).
 *
 * Le serveur (LWS mutualisé) n'a PAS Imagick : on ne peut pas compter sur un
 * driver plus tolérant. La parade : redessiner l'image dans un <canvas> puis
 * réexporter via toBlob(). Le navigateur ré-encode des octets PROPRES, sans
 * métadonnées C2PA/IPTC ni CRC douteux → GD/Intervention les décode sans souci.
 *
 * Bonus : on borne la dimension max (poids), on respecte l'orientation EXIF
 * (createImageBitmap { imageOrientation: 'from-image' }), et on choisit
 * JPEG (poids) ou PNG (si transparence requise).
 *
 * Robustesse : si quoi que ce soit échoue (format que le navigateur ne sait pas
 * décoder, canvas vide, toBlob null…), on RENVOIE LE FICHIER ORIGINAL et on
 * laisse le backend gérer (qui doit répondre 422 propre, pas 500).
 *
 * Autonome : aucune dépendance externe. Utilisable tel quel dans Nuxt 3/4
 * (côté client uniquement — protégé par un garde `import.meta.client`).
 */

export interface SanitizeImageOptions {
  /** Côté le plus long maximal en pixels. Au-delà, downscale proportionnel. Défaut 1600. */
  maxDimension?: number
  /** Qualité JPEG/WebP (0–1). Défaut 0.85. */
  quality?: number
  /**
   * Format de sortie forcé. Par défaut 'auto' :
   *  - PNG en entrée AVEC alpha détecté → conserve PNG (préserve transparence)
   *  - sinon → JPEG (poids).
   */
  outputFormat?: 'auto' | 'image/jpeg' | 'image/png' | 'image/webp'
  /**
   * Couleur de fond appliquée quand on aplatit vers un format SANS alpha (JPEG).
   * Évite le fond noir là où il y avait de la transparence. Défaut '#ffffff'.
   */
  background?: string
  /** Types MIME à NE PAS toucher (déjà sûrs ou non rasterisables). Défaut: SVG, GIF (anim). */
  passthroughTypes?: string[]
}

const DEFAULTS: Required<SanitizeImageOptions> = {
  maxDimension: 1600,
  quality: 0.85,
  outputFormat: 'auto',
  background: '#ffffff',
  // SVG = vectoriel (toBlob le rasterise et perd le scalable) ; GIF = peut être animé
  // (canvas n'exporte qu'une frame). On les laisse passer tels quels.
  passthroughTypes: ['image/svg+xml', 'image/gif'],
}

/**
 * Ré-encode un File image en un NOUVEAU File "propre" via <canvas>.
 * Ne lève jamais : en cas d'échec, retourne le File d'origine.
 */
export async function sanitizeImage(
  file: File,
  options: SanitizeImageOptions = {},
): Promise<File> {
  // Garde SSR : aucune API canvas/DOM hors navigateur.
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file
  }

  const opts = { ...DEFAULTS, ...options }

  // Pas une image, ou type à laisser passer → on ne touche pas.
  if (!file.type.startsWith('image/') || opts.passthroughTypes.includes(file.type)) {
    return file
  }

  try {
    // 1) Décodage. createImageBitmap est le chemin rapide et respecte l'EXIF
    //    via imageOrientation:'from-image' (orientation cuite dans les pixels).
    const bitmap = await decodeToBitmap(file)
    if (!bitmap) return file

    const srcW = bitmap.width
    const srcH = bitmap.height
    if (!srcW || !srcH) {
      closeBitmap(bitmap)
      return file
    }

    // 2) Calcul des dimensions cibles (downscale proportionnel, jamais d'upscale).
    const scale = Math.min(1, opts.maxDimension / Math.max(srcW, srcH))
    const dstW = Math.max(1, Math.round(srcW * scale))
    const dstH = Math.max(1, Math.round(srcH * scale))

    // 3) Choix du format de sortie.
    //    'auto' : on garde PNG seulement si l'entrée est PNG ET contient
    //    réellement de l'alpha non opaque (sinon JPEG, bien plus léger).
    let outType: 'image/jpeg' | 'image/png' | 'image/webp'
    if (opts.outputFormat === 'auto') {
      const inputIsPng = file.type === 'image/png'
      outType = inputIsPng && hasAlpha(bitmap, dstW, dstH) ? 'image/png' : 'image/jpeg'
    } else {
      outType = opts.outputFormat
    }

    // 4) Dessin sur canvas. JPEG = pas d'alpha → on pré-remplit le fond.
    const blob = await drawAndEncode(bitmap, dstW, dstH, outType, opts.quality, opts.background)
    closeBitmap(bitmap)

    if (!blob || blob.size === 0) return file

    // 5) Nom cohérent : extension alignée sur le type réel de sortie.
    const newName = renameForType(file.name, outType)

    return new File([blob], newName, {
      type: outType,
      lastModified: Date.now(),
    })
  } catch {
    // Le navigateur ne sait pas décoder, ou une API a échoué → fallback original.
    return file
  }
}

/** Ré-encode une liste de fichiers (en parallèle). Chaque échec retombe sur l'original. */
export async function sanitizeImages(
  files: File[],
  options: SanitizeImageOptions = {},
): Promise<File[]> {
  return Promise.all(files.map((f) => sanitizeImage(f, options)))
}

// ──────────────────────────────────────────────────────────────────────────
// Helpers internes
// ──────────────────────────────────────────────────────────────────────────

type Bitmap = ImageBitmap | HTMLImageElement

/** Décodage : createImageBitmap (rapide, EXIF) avec repli sur <img>+onload. */
async function decodeToBitmap(file: File): Promise<Bitmap | null> {
  // Chemin préféré : createImageBitmap respecte l'orientation EXIF.
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // certains navigateurs/ formats échouent ici → on tente <img>.
    }
  }
  return await decodeViaImageElement(file)
}

/** Repli : <img> + objectURL. Navigateurs modernes appliquent aussi l'EXIF par défaut. */
function decodeViaImageElement(file: File): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(null)
    }
    img.src = url
  })
}

function bitmapWidth(b: Bitmap): number {
  return b instanceof HTMLImageElement ? b.naturalWidth : b.width
}
function bitmapHeight(b: Bitmap): number {
  return b instanceof HTMLImageElement ? b.naturalHeight : b.height
}

function closeBitmap(b: Bitmap): void {
  if (typeof ImageBitmap !== 'undefined' && b instanceof ImageBitmap) b.close()
}

/** Crée un canvas (OffscreenCanvas si dispo, sinon <canvas> DOM). */
function makeCanvas(w: number, h: number): {
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null
  toBlob: (type: string, quality: number) => Promise<Blob | null>
} {
  // OffscreenCanvas évite d'attacher un élément au DOM (plus rapide / worker-safe).
  if (typeof OffscreenCanvas !== 'undefined') {
    const oc = new OffscreenCanvas(w, h)
    const ctx = oc.getContext('2d', { alpha: true })
    return {
      ctx,
      toBlob: (type, quality) => oc.convertToBlob({ type, quality }),
    }
  }
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d', { alpha: true })
  return {
    ctx,
    toBlob: (type, quality) =>
      new Promise((resolve) => c.toBlob((b) => resolve(b), type, quality)),
  }
}

/** Dessine le bitmap (downscalé) puis encode en Blob du type voulu. */
async function drawAndEncode(
  bitmap: Bitmap,
  dstW: number,
  dstH: number,
  outType: 'image/jpeg' | 'image/png' | 'image/webp',
  quality: number,
  background: string,
): Promise<Blob | null> {
  const { ctx, toBlob } = makeCanvas(dstW, dstH)
  if (!ctx) return null

  // Lissage de qualité au downscale.
  ;(ctx as CanvasRenderingContext2D).imageSmoothingEnabled = true
  ;(ctx as CanvasRenderingContext2D).imageSmoothingQuality = 'high'

  // JPEG n'a pas d'alpha : on aplatit sur un fond pour éviter le noir.
  if (outType === 'image/jpeg') {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, dstW, dstH)
  }

  // drawImage accepte ImageBitmap et HTMLImageElement.
  ctx.drawImage(bitmap as CanvasImageSource, 0, 0, dstW, dstH)

  let blob = await toBlob(outType, quality)

  // Certains environnements n'encodent pas le WebP/JPEG demandé → repli PNG (toujours supporté).
  if (!blob && outType !== 'image/png') {
    blob = await toBlob('image/png', quality)
  }
  return blob
}

/**
 * Détecte la présence d'alpha non opaque en échantillonnant le bitmap réduit.
 * Évite de conserver un PNG lourd alors que l'image est en réalité opaque.
 * Sur le moindre doute (lecture de pixels impossible/taintée) → true (on garde PNG, sûr).
 */
function hasAlpha(bitmap: Bitmap, w: number, h: number): boolean {
  try {
    // Échantillon réduit pour rester rapide même sur grosses images.
    const sw = Math.max(1, Math.min(w, 64))
    const sh = Math.max(1, Math.min(h, 64))
    const c = document.createElement('canvas')
    c.width = sw
    c.height = sh
    const ctx = c.getContext('2d', { alpha: true })
    if (!ctx) return true
    ctx.drawImage(bitmap as CanvasImageSource, 0, 0, sw, sh)
    const data = ctx.getImageData(0, 0, sw, sh).data
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) return true
    }
    return false
  } catch {
    return true
  }
}

/** Renomme le fichier avec l'extension alignée sur le type de sortie. */
function renameForType(name: string, type: 'image/jpeg' | 'image/png' | 'image/webp'): string {
  const ext = type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg'
  const base = name.replace(/\.[^./\\]+$/, '') || 'image'
  return `${base}.${ext}`
}
