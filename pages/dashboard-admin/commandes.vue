<template>
  <div>
    <NuxtLayout name="dashboard-admin">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Gestion des commandes</h1>
        <p class="text-sm text-gray-500 mt-1">Consultez et suivez toutes les commandes de la plateforme</p>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">En attente</p>
              <p class="text-xl font-bold text-gray-900">{{ stats.pending ?? 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Confirmées</p>
              <p class="text-xl font-bold text-gray-900">{{ stats.confirmed ?? 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Expédiées</p>
              <p class="text-xl font-bold text-gray-900">{{ stats.shipped ?? 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Livrées</p>
              <p class="text-xl font-bold text-gray-900">{{ stats.delivered ?? 0 }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
            </div>
            <div>
              <p class="text-xs text-gray-500 font-medium">Annulées</p>
              <p class="text-xl font-bold text-gray-900">{{ stats.cancelled ?? 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center gap-3">
          <!-- Search -->
          <div class="flex-1">
            <input
              v-model="searchQuery"
              @input="debouncedSearch"
              type="text"
              placeholder="Rechercher par référence, client, boutique..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <!-- Status -->
          <select
            v-model="selectedStatus"
            @change="loadOrders(1)"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
          <!-- Date from -->
          <input
            v-model="dateFrom"
            @change="loadOrders(1)"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Date début"
          />
          <!-- Date to -->
          <input
            v-model="dateTo"
            @change="loadOrders(1)"
            type="date"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Date fin"
          />
          <!-- Reset -->
          <button
            v-if="searchQuery || selectedStatus || dateFrom || dateTo"
            @click="resetFilters"
            class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <!-- Loading -->
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-flex items-center gap-2 text-gray-500">
            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Chargement...</span>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="orders.length === 0" class="p-8 text-center">
          <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/></svg>
          <p class="text-gray-500 text-sm">Aucune commande trouvée</p>
        </div>

        <!-- Table content -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Réf commande</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Client</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Boutique</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Montant</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th class="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="order in orders"
                :key="order.id"
                class="hover:bg-gray-50 transition-colors cursor-pointer"
                @click="openDetailModal(order)"
              >
                <td class="px-4 py-3">
                  <span class="font-medium text-indigo-600">{{ order.reference || order.order_number || `#${order.id}` }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="text-gray-900">{{ order.user?.name || order.customer_name || '—' }}</span>
                </td>
                <td class="px-4 py-3 text-gray-600">
                  {{ order.shop?.name || order.shop_name || '—' }}
                </td>
                <td class="px-4 py-3">
                  <span class="font-semibold text-gray-900">{{ formatCurrency(order.total || order.total_amount || 0) }}</span>
                </td>
                <td class="px-4 py-3">
                  <span :class="statusBadgeClass(order.order_status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ statusLabel(order.order_status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-gray-500">
                  {{ formatDate(order.created_at) }}
                </td>
                <td class="px-4 py-3">
                  <button
                    @click.stop="openDetailModal(order)"
                    class="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    Voir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.lastPage > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <p class="text-sm text-gray-500">
            Page {{ pagination.currentPage }} sur {{ pagination.lastPage }}
          </p>
          <div class="flex items-center gap-2">
            <button
              @click="loadOrders(pagination.currentPage - 1)"
              :disabled="pagination.currentPage <= 1"
              class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            <button
              @click="loadOrders(pagination.currentPage + 1)"
              :disabled="pagination.currentPage >= pagination.lastPage"
              class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <Teleport to="body">
        <div v-if="showDetailModal && selectedOrder" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="closeDetailModal"></div>
          <div class="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Modal header -->
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Commande {{ selectedOrder.reference || selectedOrder.order_number || `#${selectedOrder.id}` }}
                </h3>
                <p class="text-sm text-gray-500 mt-0.5">{{ formatDate(selectedOrder.created_at) }}</p>
              </div>
              <div class="flex items-center gap-3">
                <span :class="statusBadgeClass(selectedOrder.order_status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ statusLabel(selectedOrder.order_status) }}
                </span>
                <button @click="closeDetailModal" class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            <!-- Modal body -->
            <div class="px-6 py-4 space-y-6">
              <!-- Client info -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>
                  Informations client
                </h4>
                <div class="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                  <p><span class="text-gray-500">Nom :</span> <span class="font-medium text-gray-900">{{ selectedOrder.user?.name || selectedOrder.customer_name || '—' }}</span></p>
                  <p><span class="text-gray-500">Email :</span> <span class="text-gray-900">{{ selectedOrder.user?.email || selectedOrder.customer_email || '—' }}</span></p>
                  <p><span class="text-gray-500">Téléphone :</span> <span class="text-gray-900">{{ selectedOrder.user?.phone || selectedOrder.customer_phone || selectedOrder.phone || '—' }}</span></p>
                </div>
              </div>

              <!-- Shop info -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/></svg>
                  Boutique
                </h4>
                <div class="bg-gray-50 rounded-lg p-3 text-sm">
                  <p><span class="text-gray-500">Nom :</span> <span class="font-medium text-gray-900">{{ selectedOrder.shop?.name || selectedOrder.shop_name || '—' }}</span></p>
                </div>
              </div>

              <!-- Items list -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/></svg>
                  Articles commandés
                </h4>
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                  <table class="w-full text-sm" v-if="orderItems.length > 0">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="text-left px-3 py-2 font-medium text-gray-600">Produit</th>
                        <th class="text-center px-3 py-2 font-medium text-gray-600">Qté</th>
                        <th class="text-right px-3 py-2 font-medium text-gray-600">Prix</th>
                        <th class="text-right px-3 py-2 font-medium text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr v-for="(item, idx) in orderItems" :key="idx">
                        <td class="px-3 py-2 text-gray-900">{{ item.product?.name || item.product_name || item.name || '—' }}</td>
                        <td class="px-3 py-2 text-center text-gray-600">{{ item.quantity || 1 }}</td>
                        <td class="px-3 py-2 text-right text-gray-600">{{ formatCurrency(item.price || item.unit_price || 0) }}</td>
                        <td class="px-3 py-2 text-right font-medium text-gray-900">{{ formatCurrency((item.price || item.unit_price || 0) * (item.quantity || 1)) }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="p-4 text-center text-sm text-gray-400">
                    Aucun article disponible
                  </div>
                </div>
              </div>

              <!-- Totals -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-500">Sous-total</span>
                    <span class="text-gray-900">{{ formatCurrency(selectedOrder.subtotal || selectedOrder.sub_total || computedSubtotal) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-500">Livraison</span>
                    <span class="text-gray-900">{{ formatCurrency(selectedOrder.delivery_fee || selectedOrder.shipping_cost || 0) }}</span>
                  </div>
                  <div class="flex justify-between pt-2 border-t border-gray-200">
                    <span class="font-semibold text-gray-900">Total</span>
                    <span class="font-bold text-gray-900">{{ formatCurrency(selectedOrder.total || selectedOrder.total_amount || 0) }}</span>
                  </div>
                </div>
              </div>

              <!-- Payment status -->
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/></svg>
                  Paiement
                </h4>
                <div class="bg-gray-50 rounded-lg p-3 text-sm">
                  <p>
                    <span class="text-gray-500">Statut :</span>
                    <span
                      :class="selectedOrder.payment_status === 'paid' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'"
                      class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ paymentStatusLabel(selectedOrder.payment_status) }}
                    </span>
                  </p>
                  <p v-if="selectedOrder.payment_method" class="mt-1">
                    <span class="text-gray-500">Méthode :</span>
                    <span class="text-gray-900 ml-1">{{ selectedOrder.payment_method }}</span>
                  </p>
                </div>
              </div>

              <!-- Delivery info -->
              <div v-if="selectedOrder.delivery_address || selectedOrder.address || selectedOrder.delivery">
                <h4 class="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
                  Livraison
                </h4>
                <div class="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                  <p v-if="selectedOrder.delivery_address || selectedOrder.address">
                    <span class="text-gray-500">Adresse :</span>
                    <span class="text-gray-900 ml-1">{{ selectedOrder.delivery_address || selectedOrder.address }}</span>
                  </p>
                  <p v-if="selectedOrder.delivery?.courier?.name">
                    <span class="text-gray-500">Livreur :</span>
                    <span class="text-gray-900 ml-1">{{ selectedOrder.delivery.courier.name }}</span>
                  </p>
                  <p v-if="selectedOrder.delivery?.status">
                    <span class="text-gray-500">Statut livraison :</span>
                    <span class="text-gray-900 ml-1">{{ selectedOrder.delivery.status }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Toast notification -->
      <Teleport to="body">
        <Transition name="toast">
          <div v-if="toast.show" class="fixed top-4 right-4 z-[110] max-w-sm">
            <div :class="toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'" class="rounded-lg border px-4 py-3 shadow-lg">
              <p class="text-sm font-medium">{{ toast.message }}</p>
            </div>
          </div>
        </Transition>
      </Teleport>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

definePageMeta({
  layout: false
})

const { fetchOrders, fetchOrderStats, fetchAdminStats } = useAdminDashboard()

// State
const loading = ref(true)
const orders = ref<any[]>([])
const searchQuery = ref('')
const selectedStatus = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const selectedOrder = ref<any>(null)
const showDetailModal = ref(false)

const stats = reactive({
  pending: 0,
  confirmed: 0,
  shipped: 0,
  delivered: 0,
  cancelled: 0
})

const pagination = reactive({
  currentPage: 1,
  lastPage: 1
})

// Toast
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.show = true
  toast.message = message
  toast.type = type
  setTimeout(() => { toast.show = false }, 3000)
}

// Debounce search
let searchTimeout: ReturnType<typeof setTimeout> | null = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadOrders(1)
  }, 400)
}

// Format helpers
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

const formatDate = (date: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const statusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const paymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    paid: 'Payé',
    pending: 'En attente',
    failed: 'Échoué',
    refunded: 'Remboursé'
  }
  return labels[status] || status || 'Non renseigné'
}

// Computed
const orderItems = computed(() => {
  if (!selectedOrder.value) return []
  return selectedOrder.value.items || selectedOrder.value.order_items || []
})

const computedSubtotal = computed(() => {
  return orderItems.value.reduce((sum: number, item: any) => {
    return sum + (item.price || item.unit_price || 0) * (item.quantity || 1)
  }, 0)
})

// Data loading
const loadStats = async () => {
  try {
    const data = await fetchAdminStats()
    if (data?.stats?.orders?.by_status) {
      const byStatus = data.stats.orders.by_status
      stats.pending = byStatus.pending ?? 0
      stats.confirmed = byStatus.confirmed ?? 0
      stats.shipped = byStatus.shipped ?? 0
      stats.delivered = byStatus.delivered ?? 0
      stats.cancelled = byStatus.cancelled ?? 0
    }
  } catch (e: any) {
    console.error('Erreur chargement stats commandes:', e)
  }
}

const loadOrders = async (page: number = 1) => {
  loading.value = true
  try {
    const params: any = { page }
    if (searchQuery.value) params.search = searchQuery.value
    if (selectedStatus.value) params.status = selectedStatus.value
    if (dateFrom.value) params.date_from = dateFrom.value
    if (dateTo.value) params.date_to = dateTo.value

    const data = await fetchOrders(params)
    const paginated = data.orders || data
    orders.value = paginated.data || []
    pagination.currentPage = paginated.current_page || page
    pagination.lastPage = paginated.last_page || 1
  } catch (e: any) {
    showToast('Erreur lors du chargement des commandes', 'error')
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  loadOrders(1)
}

// Detail modal
const openDetailModal = (order: any) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}

// Init
onMounted(async () => {
  await Promise.all([loadStats(), loadOrders()])
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
