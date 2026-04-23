<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar desktop -->
    <aside
      class="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30"
    >
      <!-- Header sidebar -->
      <div class="h-16 flex items-center gap-3 px-5 border-b border-gray-200 flex-shrink-0">
        <div class="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-900 truncate">Espace Affilié</p>
          <p class="text-xs text-emerald-600 font-medium">Uber-Market</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <div class="space-y-1">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            class="affiliate-link group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            :class="'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'"
          >
            <span class="w-5 h-5 flex items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors" v-html="item.icon"></span>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>
      </nav>

      <!-- Footer sidebar -->
      <div class="p-3 border-t border-gray-200">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
          </svg>
          <span>Se déconnecter</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex flex-col flex-1 lg:ml-64 min-h-screen">
      <!-- Top bar -->
      <header class="h-16 bg-white border-b border-gray-200 flex-shrink-0 sticky top-0 z-20">
        <div class="h-full flex items-center justify-between px-4 lg:px-6">
          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = true"
            class="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
          </button>

          <div class="hidden lg:flex items-center gap-3">
            <h1 class="text-lg font-semibold text-gray-900">{{ user?.name || 'Affilié' }}</h1>
            <span
              v-if="user?.referral_code"
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"/>
              </svg>
              {{ user.referral_code }}
            </span>
          </div>

          <!-- User info -->
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block lg:hidden">
              <p class="text-sm font-medium text-gray-900">{{ user?.name || 'Affilié' }}</p>
              <p class="text-xs text-emerald-600 font-medium" v-if="user?.referral_code">{{ user.referral_code }}</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center">
              <span class="text-white text-sm font-semibold">{{ getUserInitials() }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <div class="p-4 lg:p-6 pb-24 lg:pb-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- Mobile sidebar overlay -->
    <Teleport to="body">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 lg:hidden">
        <div class="fixed inset-0 bg-black/50" @click="mobileMenuOpen = false"></div>
        <aside class="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col">
          <!-- Header -->
          <div class="h-16 flex items-center justify-between px-5 border-b border-gray-200 flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/>
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-900">Espace Affilié</span>
            </div>
            <button @click="mobileMenuOpen = false" class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Nav -->
          <nav class="flex-1 overflow-y-auto py-4 px-3">
            <div class="space-y-1">
              <NuxtLink
                v-for="item in menuItems"
                :key="item.to"
                :to="item.to"
                class="affiliate-link group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
                @click="mobileMenuOpen = false"
              >
                <span class="w-5 h-5 flex items-center justify-center text-gray-400 group-hover:text-emerald-500 transition-colors" v-html="item.icon"></span>
                <span>{{ item.label }}</span>
              </NuxtLink>
            </div>
          </nav>

          <!-- Logout -->
          <div class="p-3 border-t border-gray-200">
            <button
              @click="handleLogout"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
              </svg>
              <span>Se déconnecter</span>
            </button>
          </div>
        </aside>
      </div>
    </Teleport>

    <!-- Bottom bar mobile -->
    <nav class="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40">
      <div class="flex items-center justify-around h-16">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="affiliate-bottom-link flex flex-col items-center justify-center gap-1 px-2 py-1 min-w-0 flex-1 text-gray-400 hover:text-emerald-600 transition-colors"
        >
          <span class="w-5 h-5 flex items-center justify-center" v-html="item.icon"></span>
          <span class="text-[10px] font-medium truncate">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { user, logout } = useAuth()
const router = useRouter()

const mobileMenuOpen = ref(false)

// Auth guard: vérifier que l'utilisateur est un affilié commercial
onMounted(() => {
  if (!user.value || user.value.referral_type !== 'commercial') {
    router.push('/')
  }
})

const getUserInitials = () => {
  if (!user.value?.name) return 'A'
  const words = user.value.name.trim().split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return user.value.name.substring(0, 2).toUpperCase()
}

const handleLogout = async () => {
  mobileMenuOpen.value = false
  await logout()
  router.push('/connexion-affilie')
}

// Icons SVG pour le menu
const icons = {
  dashboard: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"/></svg>',
  users: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/></svg>',
  wallet: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1 0 6h3.75A2.25 2.25 0 0 0 21 13.5V12Zm0 0V9.75a2.25 2.25 0 0 0-2.25-2.25h-13.5A2.25 2.25 0 0 0 3 9.75v4.5A2.25 2.25 0 0 0 5.25 16.5h13.5A2.25 2.25 0 0 0 21 14.25V12ZM3 9.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v2.25"/></svg>'
}

const menuItems = [
  { label: 'Tableau de bord', to: '/dashboard-affiliate', icon: icons.dashboard },
  { label: 'Mes vendeurs', to: '/dashboard-affiliate/vendeurs', icon: icons.users },
  { label: 'Retraits', to: '/dashboard-affiliate/retraits', icon: icons.wallet }
]
</script>

<style scoped>
.affiliate-link.router-link-active,
.affiliate-link.router-link-exact-active {
  background-color: #ecfdf5;
  color: #047857;
}

.affiliate-link.router-link-active span:first-child,
.affiliate-link.router-link-exact-active span:first-child {
  color: #059669;
}

.affiliate-bottom-link.router-link-active,
.affiliate-bottom-link.router-link-exact-active {
  color: #059669;
}

nav::-webkit-scrollbar {
  width: 4px;
}
nav::-webkit-scrollbar-track {
  background: transparent;
}
nav::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}
nav::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
