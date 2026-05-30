<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-white text-sm font-bold">A</span>
            </div>
            <span class="font-semibold text-gray-900">Dashboard Affilié</span>
          </div>
          <nav class="hidden md:flex items-center gap-1">
            <NuxtLink to="/dashboard-affiliate"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path === '/dashboard-affiliate' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'">
              Tableau de bord
            </NuxtLink>
            <NuxtLink to="/dashboard-affiliate/vendeurs"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path.includes('vendeurs') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'">
              Mes vendeurs
            </NuxtLink>
            <NuxtLink to="/dashboard-affiliate/retraits"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path.includes('retraits') ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'">
              Retraits
            </NuxtLink>
          </nav>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 hidden sm:block">{{ affiliate?.first_name }}</span>
            <button @click="handleLogout"
              class="text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const config = useRuntimeConfig()

const affiliate = ref<any>(null)

onMounted(() => {
  const token = localStorage.getItem('affiliate_token')
  const data = localStorage.getItem('affiliate_data')
  if (!token) {
    router.push('/connexion-affilie')
    return
  }
  if (data) affiliate.value = JSON.parse(data)
})

const handleLogout = async () => {
  const token = localStorage.getItem('affiliate_token')
  if (token) {
    await fetch(`${config.public.apiBase}/affiliate/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    })
  }
  localStorage.removeItem('affiliate_token')
  localStorage.removeItem('affiliate_data')
  router.push('/connexion-affilie')
}
</script>