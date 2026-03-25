/**
 * Supprime les balises HTML d'une chaîne de caractères.
 */
export const stripHtml = (html: string): string => {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, '')
}

/**
 * Tronque une chaîne de caractères à une longueur donnée.
 */
export const truncate = (text: string, length: number, suffix: string = '...'): string => {
  if (!text || text.length <= length) return text
  return text.substring(0, length).trim() + suffix
}

/**
 * Nettoie et tronque une description HTML pour l'affichage en texte brut.
 */
export const getCleanDescription = (html: string, length: number = 160): string => {
  const plainText = stripHtml(html)
  return truncate(plainText, length)
}
