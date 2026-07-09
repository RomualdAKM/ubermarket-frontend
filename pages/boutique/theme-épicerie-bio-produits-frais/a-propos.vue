<template>
  <!--
    pages/boutique/theme-organic/a-propos.vue
    ──────────────────────────────────────────
    Page "À propos" du thème Organic.

    Contenu affiché (depuis customizations.about) :
      - Titre et texte principal (éditable dans personnalisation.vue)
      - Image principale
      - Valeurs / engagements (3 cartes)
      - Équipe (photos + noms si configurés)
      - Statistiques (nombre de produits, clients, années)
      - CTA vers les produits

    Toutes les données proviennent de props.customizations.about
    et props.shop — aucune donnée codée en dur.
  -->
  <div class="min-h-screen bg-white" :style="{ fontFamily }">
    <HeaderOrganic :shop="shop" :primaryColor="primaryColor" :cartCount="0" />

    <main>

      <!-- ══════════════════════════════════════════════════
           HERO À PROPOS
           ══════════════════════════════════════════════════ -->
      <section class="relative overflow-hidden py-20 md:py-28"
        :style="{ background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 100%)` }">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span class="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            :style="{ backgroundColor: primaryColor + '20', color: primaryColor }">
            Notre histoire
          </span>
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {{ aboutTitle || `À propos de ${shop?.name}` }}
          </h1>
          <p class="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {{ aboutSubtitle || shop?.description || 'Découvrez notre histoire et nos engagements.' }}
          </p>
        </div>
        <!-- Décoration organique -->
        <div class="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2 opacity-5"
          :style="{ backgroundColor: primaryColor }"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/2 opacity-5"
          :style="{ backgroundColor: primaryColor }"></div>
      </section>

      <!-- ══════════════════════════════════════════════════
           HISTOIRE + IMAGE
           ══════════════════════════════════════════════════ -->
      <section class="py-16 md:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid md:grid-cols-2 gap-12 xl:gap-20 items-center">

            <!-- Texte -->
            <div class="order-2 md:order-1">
              <span class="section-tag">Qui sommes-nous</span>
              <h2 class="section-title mt-3 mb-5">{{ aboutText1Title || 'Notre mission' }}</h2>
              <div class="text-gray-600 text-base leading-relaxed space-y-4 whitespace-pre-line">
                {{ aboutText || shop?.description || 'Renseignez votre histoire dans les paramètres de personnalisation.' }}
              </div>

              <!-- Points forts -->
              <div class="mt-8 space-y-3">
                <div v-for="point in keyPoints" :key="point"
                  class="flex items-start gap-3">
                  <span class="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                    :style="{ backgroundColor: primaryColor + '20' }">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      :style="{ color: primaryColor }">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  <p class="text-sm text-gray-700">{{ point }}</p>
                </div>
              </div>
            </div>

            <!-- Image principale -->
            <div class="order-1 md:order-2 relative">
              <div v-if="aboutImage"
                class="rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                <img :src="aboutImage" :alt="`À propos de ${shop?.name}`"
                  class="w-full h-full object-cover select-none"
                  @contextmenu.prevent @dragstart.prevent draggable="false"/>
              </div>
              <div v-else
                class="rounded-2xl aspect-[4/3] flex items-center justify-center text-8xl shadow-inner border border-gray-100"
                :style="{ backgroundColor: primaryColor + '10' }">
                🌿
              </div>
              <!-- Carte flottante statistique -->
              <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <p class="text-2xl font-bold" :style="{ color: primaryColor }">
                  {{ shop?.products?.length || 0 }}+
                </p>
                <p class="text-xs text-gray-500 mt-0.5">Produits disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           NOS VALEURS / ENGAGEMENTS
           ══════════════════════════════════════════════════ -->
      <section class="py-16 md:py-24"
        :style="{ backgroundColor: primaryColor + '08' }">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <span class="section-tag">Ce qui nous anime</span>
            <h2 class="section-title mt-3">Nos engagements</h2>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="value in engagements" :key="value.title"
              class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
                :style="{ backgroundColor: primaryColor + '15' }">
                {{ value.icon }}
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">{{ value.title }}</h3>
              <p class="text-sm text-gray-600 leading-relaxed">{{ value.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           STATISTIQUES BOUTIQUE
           ══════════════════════════════════════════════════ -->
      <section class="py-16 md:py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div v-for="stat in shopStats" :key="stat.label">
              <p class="text-3xl md:text-4xl font-bold" :style="{ color: primaryColor }">
                {{ stat.value }}
              </p>
              <p class="text-sm text-gray-500 mt-2">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           ÉQUIPE (si configurée dans customizations)
           ══════════════════════════════════════════════════ -->
      <section v-if="teamMembers.length > 0" class="py-16 md:py-24 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <span class="section-tag">Les personnes derrière</span>
            <h2 class="section-title mt-3">Notre équipe</h2>
          </div>
          <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div v-for="member in teamMembers" :key="member.name"
              class="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
              <div class="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4"
                :style="{ backgroundColor: primaryColor + '20' }">
                <img v-if="member.photo" :src="getImageUrl(member.photo)"
                  :alt="member.name" class="w-full h-full object-cover"/>
                <div v-else class="w-full h-full flex items-center justify-center text-2xl font-bold"
                  :style="{ color: primaryColor }">
                  {{ member.name?.[0] }}
                </div>
              </div>
              <h3 class="font-semibold text-gray-900">{{ member.name }}</h3>
              <p class="text-xs text-gray-500 mt-1">{{ member.role }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════
           CTA VERS LES PRODUITS
           ══════════════════════════════════════════════════ -->
      <section class="py-16 md:py-20 text-white text-center"
        :style="{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }">
        <div class="max-w-2xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold mb-4">Prêt à découvrir nos produits ?</h2>
          <p class="text-white/80 mb-8">
            Des produits sélectionnés avec soin, pour vous et votre famille.
          </p>
          <NuxtLink :to="`/boutique/${shop?.subdomain}/produits`"
            class="inline-block px-8 py-3.5 bg-white font-bold text-sm rounded-full
                   hover:shadow-xl transition-all hover:scale-105"
            :style="{ color: primaryColor }">
            Voir nos produits →
          </NuxtLink>
        </div>
      </section>
    </main>

    <FooterOrganic :shop="shop" :primaryColor="primaryColor"
      :footerText="footerText" :socialLinks="socialLinks"/>
  </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import HeaderOrganic from '@/components/theme_organic/HeaderOrganic.vue'
    import FooterOrganic from '@/components/theme_organic/FooterOrganic.vue'

    definePageMeta({ layout: false })

    interface Props { shop?: any; customizations?: any }
    const props  = defineProps<Props>()
    const config = useRuntimeConfig()

    // ── Couleurs / polices ────────────────────────────────────────────
    const primaryColor = computed(() => props.customizations?.home?.colors?.primary || '#2d9b5c')
    const fontFamily   = computed(() => props.customizations?.home?.fonts?.family    || 'sans-serif')
    const footerText   = computed(() => props.customizations?.footer?.text || `© ${new Date().getFullYear()} ${props.shop?.name}`)
    const socialLinks  = computed(() => props.customizations?.footer?.socialLinks || {})

    // ── Contenu À propos depuis customizations.about ─────────────────
    const aboutTitle    = computed(() => props.customizations?.about?.title    || '')
    const aboutSubtitle = computed(() => props.customizations?.about?.subtitle || '')
    const aboutText     = computed(() => props.customizations?.about?.text     || '')
    const aboutText1Title = computed(() => props.customizations?.about?.section1_title || 'Notre mission')
    const aboutImage    = computed(() => {
    const img = props.customizations?.about?.image
    return img ? getImageUrl(img) : ''
    })

    // ── Points forts (liste de strings depuis customizations) ─────────
    const keyPoints = computed((): string[] =>
    props.customizations?.about?.key_points || [
        '100% naturel et sans produits chimiques',
        'Sélection rigoureuse de nos producteurs',
        'Livraison rapide et emballage éco-responsable',
    ]
    )

    // ── Engagements / valeurs (3 cartes) ─────────────────────────────
    const engagements = computed(() =>
    props.customizations?.about?.engagements || [
        { icon: '🌿', title: 'Produits naturels', text: 'Nous sélectionnons uniquement des produits naturels, sans additifs ni conservateurs chimiques.' },
        { icon: '🚜', title: 'Producteurs locaux', text: 'Nous travaillons directement avec des producteurs locaux pour garantir fraîcheur et traçabilité.' },
        { icon: '♻️', title: 'Éco-responsable', text: 'Nos emballages sont recyclables et nous limitons notre empreinte carbone à chaque étape.' },
    ]
    )

    // ── Membres de l'équipe (optionnel) ──────────────────────────────
    const teamMembers = computed(() => props.customizations?.about?.team || [])

    // ── Statistiques boutique ─────────────────────────────────────────
    const shopStats = computed(() => [
    { value: `${props.shop?.products?.length || 0}+`, label: 'Produits disponibles' },
    { value: `${props.customizations?.about?.stats?.clients || 500}+`, label: 'Clients satisfaits' },
    { value: `${props.customizations?.about?.stats?.years   || 2}+`,   label: 'Années d\'expérience' },
    { value: `${props.customizations?.about?.stats?.orders  || 1000}+`, label: 'Commandes livrées' },
    ])

    // ── Helper image ──────────────────────────────────────────────────
    const getImageUrl = (path: string): string => {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `${config.public.apiBase.replace('/api', '')}/storage/${path}`
    }
</script>

<style scoped>
    /* ── Typographie sections ── */
    .section-tag {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: v-bind(primaryColor);
    }
    .section-title {
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    color: #111827;
    line-height: 1.2;
    }
    /* ── Protection images ── */
    img { -webkit-user-drag: none; user-select: none; -webkit-user-select: none; }
</style>