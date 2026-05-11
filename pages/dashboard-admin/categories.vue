<template>
  <div>
    <NuxtLayout name="dashboard-admin">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestion des catégories</h1>
          <p class="text-sm text-gray-500 mt-1">Gérez les catégories et sous-catégories de produits</p>
        </div>
        <button
          @click="openCategoryModal()"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Ajouter une catégorie
        </button>
      </div>

      <!-- Toast -->
      <Transition name="fade">
        <div v-if="toast.show" :class="['fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium', toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200']">
          {{ toast.message }}
        </div>
      </Transition>

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span class="ml-3 text-gray-500">Chargement...</span>
      </div>

      <!-- Empty state -->
      <div v-else-if="categories.length === 0" class="text-center py-20">
        <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Aucune catégorie pour le moment</h3>
        <p class="mt-2 text-sm text-gray-500">Commencez par ajouter votre première catégorie.</p>
        <button
          @click="openCategoryModal()"
          class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          Ajouter une catégorie
        </button>
      </div>

      <!-- Categories list -->
      <div v-else class="space-y-3">
        <div
          v-for="category in categories"
          :key="category.id"
          class="bg-white border border-gray-200 rounded-xl overflow-hidden"
        >
          <!-- Category header -->
          <div class="flex items-center justify-between px-5 py-4">
            <button
              @click="toggleExpand(category.id)"
              class="flex items-center gap-3 flex-1 text-left"
            >
              <svg
                class="w-4 h-4 text-gray-400 transition-transform"
                :class="{ 'rotate-90': expandedCategories.includes(category.id) }"
                fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/>
              </svg>
              <span class="font-semibold text-gray-900">{{ category.name }}</span>
              <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {{ category.subcategories?.length || 0 }} sous-catégorie{{ (category.subcategories?.length || 0) !== 1 ? 's' : '' }}
              </span>
            </button>
            <div class="flex items-center gap-2">
              <button
                @click="openCategoryModal(category)"
                class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Modifier"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"/>
                </svg>
              </button>
              <button
                @click="openDeleteModal('category', category)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Subcategories -->
          <div v-if="expandedCategories.includes(category.id)" class="border-t border-gray-100 bg-gray-50 px-5 py-3">
            <div v-if="!category.subcategories || category.subcategories.length === 0" class="text-sm text-gray-400 py-2">
              Aucune sous-catégorie
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="sub in category.subcategories"
                :key="sub.id"
                class="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 border border-gray-100"
              >
                <span class="text-sm text-gray-700">{{ sub.name }}</span>
                <div class="flex items-center gap-1">
                  <button
                    @click="openSubcategoryModal(sub, category)"
                    class="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Modifier"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"/>
                    </svg>
                  </button>
                  <button
                    @click="openDeleteModal('subcategory', sub)"
                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Supprimer"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <button
              @click="openSubcategoryModal(null, category)"
              class="mt-3 inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
              </svg>
              Ajouter une sous-catégorie
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Catégorie -->
      <Teleport to="body">
        <div v-if="categoryModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="categoryModal.show = false"></div>
          <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              {{ categoryModal.editing ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
            </h3>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom de la catégorie</label>
              <input
                v-model="categoryModal.name"
                type="text"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Ex: Électronique"
                @keyup.enter="saveCategory"
              />
            </div>
            <div class="flex justify-end gap-3">
              <button
                @click="categoryModal.show = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                @click="saveCategory"
                :disabled="saving || !categoryModal.name.trim()"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Modal Sous-catégorie -->
      <Teleport to="body">
        <div v-if="subcategoryModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="subcategoryModal.show = false"></div>
          <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              {{ subcategoryModal.editing ? 'Modifier la sous-catégorie' : 'Nouvelle sous-catégorie' }}
            </h3>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Catégorie parente</label>
              <select
                v-model="subcategoryModal.categoryId"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                :disabled="subcategoryModal.editing"
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Nom de la sous-catégorie</label>
              <input
                v-model="subcategoryModal.name"
                type="text"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Ex: Smartphones"
                @keyup.enter="saveSubcategory"
              />
            </div>
            <div class="flex justify-end gap-3">
              <button
                @click="subcategoryModal.show = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                @click="saveSubcategory"
                :disabled="saving || !subcategoryModal.name.trim()"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Modal Suppression -->
      <Teleport to="body">
        <div v-if="deleteModal.show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="deleteModal.show = false"></div>
          <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
                <p class="text-sm text-gray-500">
                  Voulez-vous vraiment supprimer {{ deleteModal.type === 'category' ? 'la catégorie' : 'la sous-catégorie' }}
                  <strong>« {{ deleteModal.item?.name }} »</strong> ?
                </p>
              </div>
            </div>
            <p v-if="deleteModal.error" class="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {{ deleteModal.error }}
            </p>
            <div class="flex justify-end gap-3">
              <button
                @click="deleteModal.show = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                @click="confirmDelete"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ saving ? 'Suppression...' : 'Supprimer' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({ layout: false })

const { fetchCategories, createCategory, updateCategory, deleteCategory, createSubcategory, updateSubcategory, deleteSubcategory } = useAdminDashboard()

interface Subcategory {
  id: number
  name: string
  category_id: number
}

interface Category {
  id: number
  name: string
  subcategories?: Subcategory[]
}

const categories = ref<Category[]>([])
const loading = ref(true)
const saving = ref(false)
const expandedCategories = ref<number[]>([])

// Toast
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

// Category modal
const categoryModal = ref({ show: false, editing: false, id: 0, name: '' })
const openCategoryModal = (category?: Category) => {
  if (category) {
    categoryModal.value = { show: true, editing: true, id: category.id, name: category.name }
  } else {
    categoryModal.value = { show: true, editing: false, id: 0, name: '' }
  }
}

// Subcategory modal
const subcategoryModal = ref({ show: false, editing: false, id: 0, name: '', categoryId: 0 })
const openSubcategoryModal = (sub: Subcategory | null, category: Category) => {
  if (sub) {
    subcategoryModal.value = { show: true, editing: true, id: sub.id, name: sub.name, categoryId: category.id }
  } else {
    subcategoryModal.value = { show: true, editing: false, id: 0, name: '', categoryId: category.id }
  }
}

// Delete modal
const deleteModal = ref({ show: false, type: '' as 'category' | 'subcategory', item: null as any, error: '' })
const openDeleteModal = (type: 'category' | 'subcategory', item: any) => {
  deleteModal.value = { show: true, type, item, error: '' }
}

// Toggle expand
const toggleExpand = (id: number) => {
  const idx = expandedCategories.value.indexOf(id)
  if (idx >= 0) {
    expandedCategories.value.splice(idx, 1)
  } else {
    expandedCategories.value.push(id)
  }
}

// Load categories
const loadCategories = async () => {
  try {
    loading.value = true
    const data = await fetchCategories()
    categories.value = data.categories || data.data || data || []
  } catch (e: any) {
    showToast(e.message || 'Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

// Save category
const saveCategory = async () => {
  if (!categoryModal.value.name.trim() || saving.value) return
  saving.value = true
  try {
    if (categoryModal.value.editing) {
      await updateCategory(categoryModal.value.id, { name: categoryModal.value.name.trim() })
      showToast('Catégorie modifiée avec succès')
    } else {
      await createCategory({ name: categoryModal.value.name.trim() })
      showToast('Catégorie créée avec succès')
    }
    categoryModal.value.show = false
    await loadCategories()
  } catch (e: any) {
    showToast(e.message || 'Erreur lors de l\'enregistrement', 'error')
  } finally {
    saving.value = false
  }
}

// Save subcategory
const saveSubcategory = async () => {
  if (!subcategoryModal.value.name.trim() || saving.value) return
  saving.value = true
  try {
    if (subcategoryModal.value.editing) {
      await updateSubcategory(subcategoryModal.value.id, { name: subcategoryModal.value.name.trim() })
      showToast('Sous-catégorie modifiée avec succès')
    } else {
      await createSubcategory({ name: subcategoryModal.value.name.trim(), category_id: subcategoryModal.value.categoryId })
      showToast('Sous-catégorie créée avec succès')
    }
    subcategoryModal.value.show = false
    await loadCategories()
  } catch (e: any) {
    showToast(e.message || 'Erreur lors de l\'enregistrement', 'error')
  } finally {
    saving.value = false
  }
}

// Confirm delete
const confirmDelete = async () => {
  if (saving.value) return
  saving.value = true
  deleteModal.value.error = ''
  try {
    if (deleteModal.value.type === 'category') {
      await deleteCategory(deleteModal.value.item.id)
      showToast('Catégorie supprimée avec succès')
    } else {
      await deleteSubcategory(deleteModal.value.item.id)
      showToast('Sous-catégorie supprimée avec succès')
    }
    deleteModal.value.show = false
    await loadCategories()
  } catch (e: any) {
    deleteModal.value.error = e.message || 'Erreur lors de la suppression'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
