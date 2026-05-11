<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar desktop -->
    <aside
      class="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30"
    >
      <!-- Header sidebar -->
      <div class="h-16 flex items-center gap-3 px-5 border-b border-gray-200 flex-shrink-0">
        <div class="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-900 truncate">Administration</p>
          <p class="text-xs text-indigo-600 font-medium">Uber-Market</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 px-3">
        <div class="space-y-1">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            class="admin-link group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
            :class="'text-gray-600 hover:text-indigo-700 hover:bg-indigo-50'"
          >
            <span class="w-5 h-5 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 transition-colors" v-html="item.icon"></span>
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

          <div class="hidden lg:block">
            <h1 class="text-lg font-semibold text-gray-900">Panneau d'administration</h1>
          </div>

          <!-- User info -->
          <div class="flex items-center gap-3">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-medium text-gray-900">{{ user?.name || 'Admin' }}</p>
              <p class="text-xs text-gray-500">Super administrateur</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
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
              <div class="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
              </div>
              <span class="text-sm font-semibold text-gray-900">Administration</span>
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
                class="admin-link group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-gray-600 hover:text-indigo-700 hover:bg-indigo-50"
                @click="mobileMenuOpen = false"
              >
                <span class="w-5 h-5 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 transition-colors" v-html="item.icon"></span>
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
          v-for="item in bottomBarItems"
          :key="item.to"
          :to="item.to"
          class="admin-bottom-link flex flex-col items-center justify-center gap-1 px-2 py-1 min-w-0 flex-1 text-gray-400 hover:text-indigo-600 transition-colors"
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

// Auth guard: vérifier rôle super_admin
onMounted(() => {
  if (!user.value || user.value.role !== 'super_admin') {
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
  router.push('/connexion-vendeur')
}

// Icons SVG pour le menu
const icons = {
  dashboard: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>',
  shops: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/></svg>',
  users: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/></svg>',
  orders: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/></svg>',
  withdrawals: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"/></svg>',
  affiliates: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"/></svg>',
  categories: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z"/></svg>',
  couriers: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>'
}

const menuItems = [
  { label: 'Tableau de bord', to: '/dashboard-admin', icon: icons.dashboard },
  { label: 'Boutiques', to: '/dashboard-admin/boutiques', icon: icons.shops },
  { label: 'Utilisateurs', to: '/dashboard-admin/utilisateurs', icon: icons.users },
  { label: 'Livreurs', to: '/dashboard-admin/livreurs', icon: icons.couriers },
  { label: 'Commandes', to: '/dashboard-admin/commandes', icon: icons.orders },
  { label: 'Retraits', to: '/dashboard-admin/retraits', icon: icons.withdrawals },
  { label: 'Catégories', to: '/dashboard-admin/categories', icon: icons.categories },
  { label: 'Affiliés', to: '/dashboard-admin/affilies', icon: icons.affiliates }
]

// Bottom bar: mêmes items mais limités pour l'espace mobile
const bottomBarItems = [
  { label: 'Accueil', to: '/dashboard-admin', icon: icons.dashboard },
  { label: 'Boutiques', to: '/dashboard-admin/boutiques', icon: icons.shops },
  { label: 'Utilisateurs', to: '/dashboard-admin/utilisateurs', icon: icons.users },
  { label: 'Commandes', to: '/dashboard-admin/commandes', icon: icons.orders },
  { label: 'Retraits', to: '/dashboard-admin/retraits', icon: icons.withdrawals },
  { label: 'Catégories', to: '/dashboard-admin/categories', icon: icons.categories }
]
</script>

<style scoped>
.admin-link.router-link-active,
.admin-link.router-link-exact-active {
  background-color: #eef2ff;
  color: #4338ca;
}

.admin-link.router-link-active span:first-child,
.admin-link.router-link-exact-active span:first-child {
  color: #6366f1;
}

.admin-bottom-link.router-link-active,
.admin-bottom-link.router-link-exact-active {
  color: #6366f1;
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
