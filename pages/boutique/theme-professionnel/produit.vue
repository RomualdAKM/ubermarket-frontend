<template>
  <div class="min-h-screen bg-white">
    <!-- En-tête -->
    <header class="border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="bg-gray-900 w-8 h-8" />
            <span class="ml-3 text-xl font-medium text-gray-900"
              >Boutique Pro</span
            >
          </div>

          <!-- Navigation desktop -->
          <nav class="hidden md:flex space-x-8">
            <a href="#" class="text-gray-600 hover:text-gray-900">Accueil</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">Produits</a>
            <a href="#" class="text-gray-600 hover:text-gray-900"
              >Collections</a
            >
            <a href="#" class="text-gray-600 hover:text-gray-900">À propos</a>
            <a href="#" class="text-gray-600 hover:text-gray-900">Contact</a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center">
            <button class="p-2 text-gray-600 hover:text-gray-900">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
            <button class="p-2 text-gray-600 hover:text-gray-900 ml-2 relative">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                ></path>
              </svg>
              <span
                class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary"
                >3</span
              >
            </button>
            <button class="ml-4 md:hidden text-gray-600">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Navigation breadcrumb -->
        <nav class="flex mb-8" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-2">
            <li>
              <a href="#" class="text-gray-500 hover:text-gray-700">Accueil</a>
            </li>
            <li>
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </li>
            <li>
              <a href="#" class="text-gray-500 hover:text-gray-700">Produits</a>
            </li>
            <li>
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </li>
            <li>
              <span class="text-gray-900">Équipement professionnel</span>
            </li>
          </ol>
        </nav>

        <div class="flex flex-col md:flex-row">
          <!-- Galerie d'images -->
        <div class="flex mr-4">
          <div class="flex items-center">
            <div class="mr-4">
              <img
                src="https://placehold.co/60x60"
                alt="Image placeholder 1"
                class="mb-4 w-16 h-16 sm:w-20 sm:h-20"
              />
              <img
                src="https://placehold.co/60x60"
                alt="Image placeholder 2"
                class="mb-4 w-16 h-16 sm:w-20 sm:h-20"
              />
              <img
                src="https://placehold.co/60x60"
                alt="Image placeholder 3"
                class="mb-4 w-16 h-16 sm:w-20 sm:h-20"
              />
              <img
                src="https://placehold.co/60x60"
                alt="Image placeholder 4"
                class="w-16 h-16 sm:w-20 sm:h-20"
              />
            </div>

            <div>
              <!-- Image principale -->
              <img
                src="https://placehold.co/600x400"
                alt="Image principale"
                class="w-full h-auto sm:max-w-lg"
              />
            </div>
          </div>
        </div>

          <!-- Informations produit -->
          <div class="md:w-1/2">
            <div class="border-b border-gray-200 pb-6">
              <h2 class="mt-4 text-3xl font-medium text-gray-900">249,00 €</h2>
              <h1 class="text-2xl font-medium text-gray-900">
                Équipement professionnel de haute performance
              </h1>
              <p class="mt-4 text-gray-600">
                Équipement professionnel de haute performance conçu pour les
                environnements de travail exigeants. Construction robuste avec
                des matériaux de qualité supérieure.
              </p>
              <div class="mt-2 flex items-center">
                <div class="flex">
                  <svg
                    class="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <svg
                    class="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <svg
                    class="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <svg
                    class="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                  <svg
                    class="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
                <span class="ml-2 text-gray-600">4.8 (128 avis)</span>
              </div>
             
            </div>

            <div class="border-b border-gray-200 py-6">
              <h2 class="text-lg font-medium text-gray-900">Options</h2>
              <div class="mt-4">
                <div class="flex items-center">
                  <span class="text-gray-700 mr-4">Couleur:</span>
                  <div class="flex space-x-2">
                    <button
                      class="w-8 h-8 bg-gray-900 border-2 border-gray-900"
                    ></button>
                    <button
                      class="w-8 h-8 bg-blue-600 border-2 border-blue-600"
                    ></button>
                    <button
                      class="w-8 h-8 bg-red-600 border-2 border-red-600"
                    ></button>
                  </div>
                </div>
                <div class="mt-4">
                  <span class="text-gray-700 mr-4">Quantité:</span>
                  <div class="inline-flex items-center border border-gray-300">
                    <button class="px-3 py-2 text-gray-600 hover:bg-gray-100">
                      -
                    </button>
                    <span class="px-4 py-2 border-l border-r border-gray-300"
                      >1</span
                    >
                    <button class="px-3 py-2 text-gray-600 hover:bg-gray-100">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="py-6">
              <div
                class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0"
              >
                <button
                  class="flex-1 px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800"
                >
                  Ajouter au panier
                </button>
                <button
                  class="flex-1 px-6 py-3 border border-gray-300 text-gray-900 font-medium hover:bg-gray-50"
                >
                  Acheter maintenant
                </button>
              </div>
              <div class="mt-4">
                <button
                  class="w-full px-6 py-3 border border-gray-300 text-gray-900 font-medium hover:bg-gray-50 flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                  Ajouter à la liste d'envies
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Section pour les avis des clients -->
<div class="mt-10">
  <h2 class="text-2xl font-medium text-gray-900 mb-6">Avis des clients</h2>
  <div class="space-y-4">
    <!-- Avis client 1 -->
    <div class="bg-white p-6">
      <div class="flex items-center mb-4">
       
        <div>
          <p class="text-gray-700 font-medium">Jean Dupont</p>
          <div class="flex items-center">
            <svg
              class="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>
            <svg
              class="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>
            <svg
              class="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>
            <svg
              class="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>
            <svg
              class="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      <p class="text-gray-600 mt-2">
        "Excellent produit, très satisfait de ma commande !"
      </p>
    </div>


  </div>
</div>
      </div>
      
    </main>




    <!-- Pied de page -->
    <footer class="bg-gray-100 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center">
              <div class="bg-gray-900 w-6 h-6" />
              <span class="ml-2 text-lg font-medium text-gray-900"
                >Boutique Pro</span
              >
            </div>
            <p class="mt-4 text-gray-600 text-sm">
              Solutions professionnelles de qualité supérieure pour votre
              activité.
            </p>
          </div>
          <div>
            <h3
              class="text-sm font-medium text-gray-900 uppercase tracking-wider"
            >
              Produits
            </h3>
            <ul class="mt-4 space-y-2">
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm"
                  >Nouveautés</a
                >
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm"
                  >Best-sellers</a
                >
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm"
                  >Promotions</a
                >
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm"
                  >Collections</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h3
              class="text-sm font-medium text-gray-900 uppercase tracking-wider"
            >
              Support
            </h3>
            <ul class="mt-4 space-y-2">
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm"
                  >Contact</a
                >
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm"
                  >FAQ</a
                >
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm"
                  >Livraison</a
                >
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm"
                  >Retours</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h3
              class="text-sm font-medium text-gray-900 uppercase tracking-wider"
            >
              Contact
            </h3>
            <ul class="mt-4 space-y-2">
              <li class="text-gray-600 text-sm">contact@boutiquepro.com</li>
              <li class="text-gray-600 text-sm">+33 1 23 45 67 89</li>
              <li class="text-gray-600 text-sm">Du lundi au vendredi</li>
              <li class="text-gray-600 text-sm">9h - 18h</li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-200 text-center">
          <p class="text-gray-600 text-sm">
            &copy; 2023 Boutique Pro. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});
</script>

<style scoped>
.bg-primary {
  background-color: #e56a19;
}

.hover\:bg-secondary:hover {
  background-color: #5b6ac5;
}

.text-primary {
  color: #e56a19;
}

.hover\:text-secondary:hover {
  color: #5b6ac5;
}
</style>