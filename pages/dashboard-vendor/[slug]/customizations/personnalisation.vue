<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">Personnaliser la boutique</h1>
      <p class="text-gray-600">Personnalisez l'apparence et le contenu de votre boutique</p>
    </div>

    <!-- Navigation par onglets -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button 
          @click="activeTab = 'themes'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'themes' 
              ? 'border-secondary text-secondary' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Thèmes
        </button>
        <button 
          @click="activeTab = 'accueil'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'accueil' 
              ? 'border-secondary text-secondary' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Page d'accueil
        </button>
        <button 
          @click="activeTab = 'apropos'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'apropos' 
              ? 'border-secondary text-secondary' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          À propos
        </button>
       
        <button 
          @click="activeTab = 'cgu'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'cgu' 
              ? 'border-secondary text-secondary' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          CGU
        </button>
        <button 
          @click="activeTab = 'cgv'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'cgv' 
              ? 'border-secondary text-secondary' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          CGV
        </button>
        <button 
          @click="activeTab = 'pied'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'pied' 
              ? 'border-secondary text-secondary' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Pied de page
        </button>
        <!-- Ajout de l'onglet Couleurs -->
        <button 
          @click="activeTab = 'couleurs'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'couleurs' 
              ? 'border-secondary text-secondary' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          Couleurs
        </button>
        <button 
          @click="activeTab = 'police'"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            activeTab === 'police' 
              ? 'border-secondary text-secondary' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          police
        </button>
      </nav>
    </div>

    <!-- Contenu selon l'onglet actif -->
    <div class="bg-white p-6 border-t border-gray-200 mb-6">
      <!-- Onglet Thèmes -->
      <div v-if="activeTab === 'themes'">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Choisissez un thème</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Thème gratuit -->
          <div 
            @click="selectTheme('gratuit')"
            :class="[
              'border-2 p-4 cursor-pointer',
              selectedTheme === 'gratuit' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center">
              <div class="flex items-center h-5">
                <input
                  id="theme-gratuit"
                  name="theme"
                  type="radio"
                  class="h-4 w-4 text-primary focus:ring-secondary"
                  :checked="selectedTheme === 'gratuit'"
                  @change="selectTheme('gratuit')"
                />
              </div>
              <label for="theme-gratuit" class="ml-3 block text-sm font-medium text-gray-700">
                Thème gratuit
              </label>
            </div>
            <div class="mt-4 bg-gray-100 border border-gray-300 rounded-md w-full h-40 flex items-center justify-center">
              <span class="text-gray-500">Aperçu du thème gratuit</span>
            </div>
            <p class="mt-2 text-sm text-gray-500">Thème par défaut de votre boutique</p>
          </div>
          
          <!-- Thèmes payants -->
          <div 
            v-for="theme in paidThemes" 
            :key="theme.id"
            @click="selectTheme(theme.id)"
            :class="[
              'border-2 p-4 cursor-pointer',
              selectedTheme === theme.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex items-center h-5">
                  <input
                    :id="`theme-${theme.id}`"
                    name="theme"
                    type="radio"
                    class="h-4 w-4 text-primary focus:ring-secondary"
                    :checked="selectedTheme === theme.id"
                    @change="selectTheme(theme.id)"
                  />
                </div>
                <label :for="`theme-${theme.id}`" class="ml-3 block text-sm font-medium text-gray-700">
                  {{ theme.name }}
                </label>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ theme.price }} €</span>
            </div>
            <div class="mt-4 bg-gray-100 border border-gray-300 rounded-md w-full h-40 flex items-center justify-center">
              <span class="text-gray-500">Aperçu du thème {{ theme.name }}</span>
            </div>
            <p class="mt-2 text-sm text-gray-500">{{ theme.description }}</p>
          </div>
        </div>
      </div>

      <!-- Onglet Page d'accueil -->
      <div v-if="activeTab === 'accueil'">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Page d'accueil</h2>
          <!-- <div class="flex items-center">
            <span class="mr-2 text-sm text-gray-700">Afficher la section</span>
            <button
              @click="sectionVisibility.homepage = !sectionVisibility.homepage"
              :class="[
                sectionVisibility.homepage ? 'bg-primary' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2'
              ]"
              role="switch"
              :aria-checked="sectionVisibility.homepage"
            >
              <span
                :class="[
                  sectionVisibility.homepage ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform bg-white shadow ring-0 transition duration-200 ease-in-out'
                ]"
              />
            </button>
          </div> -->
        </div>
        
        <!-- Bannière -->
        <div class="border-b border-gray-200 pb-6 mb-6">
          <h3 class="text-md font-medium text-gray-900 mb-3">Bannière</h3>
          
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- Carrousel d'images -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Images</label>
              <div class="grid grid-cols-3 gap-2">
                <div
                  v-for="(image, index) in homepageBanner.images"
                  :key="index"
                  class="relative group"
                >
                  <div class="bg-gray-100 border border-gray-300 w-full aspect-video flex items-center justify-center">
                    <img
                      v-if="image.preview"
                      :src="image.preview"
                      alt="Aperçu de l'image"
                      class="w-full h-full object-cover"
                    />
                    <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <button
                    type="button"
                    @click="removeBannerImage(index)"
                    class="absolute top-1 right-1 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <div
                  v-if="homepageBanner.images.length < 5"
                  class="border-2 border-dashed border-gray-300 aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
                  @click="triggerBannerImageUpload"
                >
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  <span class="mt-1 text-xs text-gray-500">Ajouter</span>
                  <input
                    ref="bannerImageInput"
                    type="file"
                    multiple
                    accept="image/png, image/jpeg"
                    class="sr-only"
                    @change="handleBannerImageUpload"
                  />
                </div>
              </div>
            </div>
            
            <!-- Textes et couleur -->
            <div class="space-y-4">
              <div>
                <label for="banner-title" class="block text-sm font-medium text-gray-700 mb-1">
                  Texte principal 
                </label>
                <input
                  type="text"
                  id="banner-title"
                  v-model="homepageBanner.title"
                  maxlength="100"
                   class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                />
                <div class="text-right text-sm text-gray-500 mt-1">
                  {{ homepageBanner.title.length }}/100
                </div>
              </div>
              
              <div>
                <label for="banner-subtitle" class="block text-sm font-medium text-gray-700 mb-1">
                  Texte secondaire 
                </label>
                <textarea
                  id="banner-subtitle"
                  v-model="homepageBanner.subtitle"
                  rows="2"
                  maxlength="200"
                   class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                ></textarea>
                <div class="text-right text-sm text-gray-500 mt-1">
                  {{ homepageBanner.subtitle.length }}/200
                </div>
              </div>
              

            </div>
          </div>
        </div>
        
        <!-- Section produits -->
        <div>
          <h3 class="text-md font-medium text-gray-900 mb-3">Section produits</h3>
          
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label for="products-per-page" class="block text-sm font-medium text-gray-700 mb-1">
                Produits par page
              </label>
              <select
                id="products-per-page"
                v-model="homepageProducts.perPage"
                 class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              >
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="18">18</option>
                <option value="24">24</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglet À propos -->
      <div v-if="activeTab === 'apropos'">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Page À propos</h2>
          <!-- <div class="flex items-center">
            <span class="mr-2 text-sm text-gray-700">Afficher la section</span>
            <button
              @click="sectionVisibility.about = !sectionVisibility.about"
              :class="[
                sectionVisibility.about ? 'bg-primary' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2'
              ]"
              role="switch"
              :aria-checked="sectionVisibility.about"
            >
              <span
                :class="[
                  sectionVisibility.about ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform bg-white shadow ring-0 transition duration-200 ease-in-out'
                ]"
              />
            </button>
          </div> -->
        </div>
        
        <div class="space-y-6">
          <div>
            <label for="about-text" class="block text-sm font-medium text-gray-700 mb-1">
              Texte 
            </label>
            <textarea
              id="about-text"
              v-model="aboutPage.text"
              rows="5"
              maxlength="5000"
               class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Décrivez votre entreprise, votre mission, vos valeurs..."
            ></textarea>
            <div class="text-right text-sm text-gray-500 mt-1">
              {{ aboutPage.text.length }}/5000
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Image (max 2 Mo)</label>
            <div class="flex items-start">
              <div class="bg-gray-100 border border-gray-300 rounded-md w-32 h-32 flex items-center justify-center">
                <img
                  v-if="aboutPage.image.preview"
                  :src="aboutPage.image.preview"
                  alt="Aperçu de l'image"
                  class="w-full h-full object-cover"
                />
                <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <button
                  type="button"
                  @click="triggerAboutImageUpload"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Changer
                </button>
                <input
                  ref="aboutImageInput"
                  type="file"
                  accept="image/png, image/jpeg"
                  class="sr-only"
                  @change="handleAboutImageUpload"
                />
                <p class="mt-2 text-xs text-gray-500">PNG, JPEG jusqu'à 2MB</p>
              </div>
            </div>
          </div>
          
          
          <!-- <div>
            <button
              @click="duplicateAboutSection"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Dupliquer la section
            </button>
          </div> -->
        </div>
      </div>


      <!-- Onglet CGU -->
      <div v-if="activeTab === 'cgu'">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Page CGU</h2>
          <!-- <div class="flex items-center">
            <span class="mr-2 text-sm text-gray-700">Afficher la section</span>
            <button
              @click="sectionVisibility.terms = !sectionVisibility.terms"
              :class="[
                sectionVisibility.terms ? 'bg-primary' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2'
              ]"
              role="switch"
              :aria-checked="sectionVisibility.terms"
            >
              <span
                :class="[
                  sectionVisibility.terms ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform bg-white shadow ring-0 transition duration-200 ease-in-out'
                ]"
              />
            </button>
          </div> -->
        </div>
        
        <div>
          <label for="terms-text" class="block text-sm font-medium text-gray-700 mb-1">
            Texte des conditions générales d'utilisation
          </label>
          <textarea
            id="terms-text"
            v-model="termsPage.text"
            rows="15"
            maxlength="5000"
             class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
            placeholder="Saisissez ici les conditions générales d'utilisation de votre boutique..."
          ></textarea>
          <div class="text-right text-sm text-gray-500 mt-1">
            {{ termsPage.text.length }}/5000
          </div>
        </div>
      </div>

      <!-- Onglet CGV -->
      <div v-if="activeTab === 'cgv'">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Page CGV</h2>
        </div>
        
        <div>
          <label for="sales-terms-text" class="block text-sm font-medium text-gray-700 mb-1">
            Texte des conditions générales de vente
          </label>
          <textarea
            id="sales-terms-text"
            v-model="salesTermsPage.text"
            rows="15"
            maxlength="5000"
             class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
            placeholder="Saisissez ici les conditions générales de vente de votre boutique..."
          ></textarea>
          <div class="text-right text-sm text-gray-500 mt-1">
            {{ salesTermsPage.text.length }}/5000
          </div>
        </div>
      </div>

      <!-- Onglet Pied de page -->
      <div v-if="activeTab === 'pied'">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Pied de page</h2>
          <!-- <div class="flex items-center">
            <span class="mr-2 text-sm text-gray-700">Afficher la section</span>
            <button
              @click="sectionVisibility.footer = !sectionVisibility.footer"
              :class="[
                sectionVisibility.footer ? 'bg-primary' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2'
              ]"
              role="switch"
              :aria-checked="sectionVisibility.footer"
            >
              <span
                :class="[
                  sectionVisibility.footer ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform bg-white shadow ring-0 transition duration-200 ease-in-out'
                ]"
              />
            </button>
          </div> -->
        </div>
        
        <div class="space-y-6">
          <div>
            <label for="footer-text" class="block text-sm font-medium text-gray-700 mb-1">
              Texte 
            </label>
            <textarea
              id="footer-text"
              v-model="footer.text"
              rows="3"
              maxlength="500"
               class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
              placeholder="Texte à afficher dans le pied de page..."
            ></textarea>
            <div class="text-right text-sm text-gray-500 mt-1">
              {{ footer.text.length }}/500
            </div>
          </div>
          
          <div>
            <h3 class="text-md font-medium text-gray-900 mb-3">Liens vers les réseaux sociaux</h3>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="social-facebook" class="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  id="social-facebook"
                  v-model="footer.socialLinks.facebook"
                   class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="https://facebook.com/votre-page"
                />
              </div>
              
              <div>
                <label for="social-instagram" class="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  id="social-instagram"
                  v-model="footer.socialLinks.instagram"
                   class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="https://instagram.com/votre-compte"
                />
              </div>
              
              <div>
                <label for="social-twitter" class="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="text"
                  id="social-twitter"
                  v-model="footer.socialLinks.twitter"
                   class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="https://twitter.com/votre-compte"
                />
              </div>
              
              <div>
                <label for="social-linkedin" class="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn
                </label>
                <input
                  type="text"
                  id="social-linkedin"
                  v-model="footer.socialLinks.linkedin"
                   class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
                  placeholder="https://linkedin.com/company/votre-entreprise"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglet Couleurs -->
      <div v-if="activeTab === 'couleurs'">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Couleurs personnalisées</h2>
        
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="primary-color" class="block text-sm font-medium text-gray-700 mb-1">
              Couleur primaire
            </label>
            <div class="flex items-center">
              <input
                type="color"
                id="primary-color"
                v-model="customColors.primary"
                class="w-10 h-10 border border-gray-300 cursor-pointer"
              />
              <span class="ml-3 text-sm text-gray-700">{{ customColors.primary }}</span>
            </div>
          </div>
          
          <div>
            <label for="secondary-color" class="block text-sm font-medium text-gray-700 mb-1">
              Couleur secondaire
            </label>
            <div class="flex items-center">
              <input
                type="color"
                id="secondary-color"
                v-model="customColors.secondary"
                class="w-10 h-10 border border-gray-300 cursor-pointer"
              />
              <span class="ml-3 text-sm text-gray-700">{{ customColors.secondary }}</span>
            </div>
          </div>
          
          <div>
            <label for="background-color" class="block text-sm font-medium text-gray-700 mb-1">
              Couleur de fond
            </label>
            <div class="flex items-center">
              <input
                type="color"
                id="background-color"
                v-model="customColors.background"
                class="w-10 h-10 border border-gray-300 cursor-pointer"
              />
              <span class="ml-3 text-sm text-gray-700">{{ customColors.background }}</span>
            </div>
          </div>
          
          <div>
            <label for="text-color" class="block text-sm font-medium text-gray-700 mb-1">
              Couleur du texte
            </label>
            <div class="flex items-center">
              <input
                type="color"
                id="text-color"
                v-model="customColors.text"
                class="w-10 h-10 border border-gray-300 cursor-pointer"
              />
              <span class="ml-3 text-sm text-gray-700">{{ customColors.text }}</span>
            </div>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t border-gray-200">
          <h3 class="text-md font-medium text-gray-900 mb-3">Couleurs prédéfinies</h3>
          <div class="grid grid-cols-2 gap-4">
            <div 
              @click="setPredefinedColors('default')"
              class="border border-gray-200 p-4 cursor-pointer hover:border-gray-300"
            >
              <div class="flex items-center">
                <div class="w-4 h-4 bg-orange-600 mr-2"></div>
                <div class="w-4 h-4 bg-indigo-600 mr-2"></div>
                <span class="text-sm text-gray-700">Par défaut</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">#e56a19, #5b6ac5</p>
            </div>
            
            <div 
              @click="setPredefinedColors('blue')"
              class="border border-gray-200 p-4 cursor-pointer hover:border-gray-300"
            >
              <div class="flex items-center">
                <div class="w-4 h-4 bg-blue-600 mr-2"></div>
                <div class="w-4 h-4 bg-teal-600 mr-2"></div>
                <span class="text-sm text-gray-700">Bleu</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">#2563eb, #0d9488</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="activeTab === 'police'">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Police d'écriture</h2>
        
        <div class="grid grid-cols-1 gap-6">
          <div>
            <label for="font-family" class="block text-sm font-medium text-gray-700 mb-1">
              Famille de police
            </label>
            <select
              id="font-family"
              v-model="customFonts.family"
              class="mt-1 block w-full px-3 py-2 border-0 border-b-2 border-gray-300 placeholder-gray-300 placeholder:italic text-gray-900 focus:outline-none focus:ring-0 focus:border-primary transition-colors duration-200"
            >
              <option value="sans-serif">Sans Serif (par défaut)</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'Open Sans', sans-serif">Open Sans</option>
              <option value="'Lato', sans-serif">Lato</option>
              <option value="'Montserrat', sans-serif">Montserrat</option>
            </select>
          </div>
          
          
          <div class="pt-4">
            <h3 class="text-md font-medium text-gray-900 mb-3">Aperçu</h3>
            <div 
              class="p-4 border border-gray-200 rounded-md"
              :style="{
                fontFamily: customFonts.family,
                fontSize: getFontSizeValue(customFonts.size),
                fontWeight: customFonts.weight
              }"
            >
              <p class="mb-2">Aperçu du texte avec la police sélectionnée</p>
              <p class="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="flex justify-end">
      <button type="button" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        Annuler
      </button>
      <button 
        @click="saveCustomization"
        :disabled="isSavingCustomizations"
        type="button" 
        :class="[
          'ml-3 px-4 py-2 text-white text-sm font-medium',
          isSavingCustomizations 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-primary hover:bg-secondary cursor-pointer'
        ]"
      >
        <span v-if="isSavingCustomizations" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Enregistrement...
        </span>
        <span v-else>Enregistrer</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const { shops, currentShop } = useShops()
const { 
  customizations, 
  isLoading: isLoadingCustomizations, 
  isSaving: isSavingCustomizations, 
  fetchCustomizationsByShopId, 
  saveCustomization: saveCustomizationAPI 
} = useCustomization()

// Recuperer l'ID de la boutique depuis le slug
const shopSlug = route.params.slug as string
const shopId = computed(() => currentShop.value?.id)

// Onglet actif
const activeTab = ref('accueil') // Démarrer directement sur Page d'accueil

// Thème sélectionné
const selectedTheme = ref('gratuit')

// Thèmes payants
const paidThemes = ref([
  { id: 'premium1', name: 'Thème Premium 1', price: '29', description: 'Design moderne et élégant' },
  { id: 'premium2', name: 'Thème Premium 2', price: '39', description: 'Design épuré et professionnel' },
  { id: 'premium3', name: 'Thème Premium 3', price: '49', description: 'Design coloré et dynamique' }
])

// Page d'accueil - Bannière
const homepageBanner = reactive({
  images: [] as Array<{ file: File | null; preview: string }>,
  title: '',
  subtitle: '',
  color: '#FFFFFF'
})

// Page d'accueil - Produits
const homepageProducts = reactive({
  display: 'grid',
  perPage: '12'
})

// Page À propos
const aboutPage = reactive({
  text: '',
  image: { file: null as File | null, preview: '' },
  cta: ''
})

// Témoignages
const testimonials = ref([
  { name: '', text: '', image: { file: null as File | null, preview: '' } }
])

const testimonialsPage = reactive({
  cta: ''
})

// Page CGU
const termsPage = reactive({
  text: ''
})

// Page CGV
const salesTermsPage = reactive({
  text: ''
})

// Pied de page
const footer = reactive({
  text: '',
  socialLinks: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  }
})

// Gestion de la visibilité des sections
const sectionVisibility = reactive({
  homepage: true,
  about: true,
  testimonials: true,
  terms: true,
  footer: true
})

// Ajout de la gestion des couleurs personnalisées
const customColors = reactive({
  primary: '#e56a19',
  secondary: '#5b6ac5',
  background: '#ffffff',
  text: '#000000'
})

// Ajout de la gestion des polices personnalisées
const customFonts = reactive({
  family: 'sans-serif',
  size: 'medium',
  weight: 'normal'
})

// Références pour les inputs de fichiers
const bannerImageInput = ref<HTMLInputElement | null>(null)
const aboutImageInput = ref<HTMLInputElement | null>(null)

// Fonctions pour gérer les thèmes
const selectTheme = (themeId: string) => {
  selectedTheme.value = themeId
}

// Fonctions pour gérer les images de la bannière
const triggerBannerImageUpload = () => {
  if (bannerImageInput.value) {
    bannerImageInput.value.click()
  }
}

const handleBannerImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files && homepageBanner.images.length < 5) {
    // Limiter à 5 images maximum
    const remainingSlots = 5 - homepageBanner.images.length
    const filesToAdd = Array.from(files).slice(0, remainingSlots)
    
    for (const file of filesToAdd) {
      // Vérifier la taille du fichier (max 5 Mo)
      if (file.size > 5 * 1024 * 1024) {
        alert(`L'image ${file.name} est trop volumineuse. Taille maximale : 5 Mo.`)
        continue
      }
      
      // Vérifier le type de fichier
      if (!file.type.match('image/png') && !file.type.match('image/jpeg')) {
        alert(`Format de fichier non supporté pour ${file.name}. Formats acceptés : PNG, JPEG.`)
        continue
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        homepageBanner.images.push({
          file,
          preview: e.target?.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }
}

const removeBannerImage = (index: number) => {
  homepageBanner.images.splice(index, 1)
}

// Fonctions pour gérer l'image de la page À propos
const triggerAboutImageUpload = () => {
  if (aboutImageInput.value) {
    aboutImageInput.value.click()
  }
}

const handleAboutImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // Vérifier la taille du fichier (max 2 Mo)
    if (file.size > 2 * 1024 * 1024) {
      alert('L\'image est trop volumineuse. Taille maximale : 2 Mo.')
      return
    }
    
    // Vérifier le type de fichier
    if (!file.type.match('image/png') && !file.type.match('image/jpeg')) {
      alert('Format de fichier non supporté. Formats acceptés : PNG, JPEG.')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      aboutPage.image.preview = e.target?.result as string
      aboutPage.image.file = file
    }
    reader.readAsDataURL(file)
  }
}

// Fonction pour dupliquer la section À propos
const duplicateAboutSection = () => {
  // Dans une vraie application, cela créerait une nouvelle section
  alert('Section dupliquée. Dans une vraie application, cela créerait une nouvelle section.')
}

// Charger les customizations au montage de la page
onMounted(async () => {
  console.log('🔍 Débogage onMounted:')
  console.log('  - shopSlug:', shopSlug)
  console.log('  - shops.value:', shops.value)
  console.log('  - currentShop:', currentShop.value)
  console.log('  - shopId:', shopId.value)
  
  // Attendre que les boutiques soient chargées si nécessaire
  if (!shops.value || shops.value.length === 0) {
    console.log('⏳ Chargement des boutiques...')
    const { fetchShops } = useShops()
    await fetchShops()
    console.log('  - Boutiques après fetch:', shops.value)
  }
  
  // Vérifier que shopId existe après le chargement
  if (shopId.value) {
    console.log('✅ ShopId trouvé:', shopId.value)
    await fetchCustomizationsByShopId(shopId.value)
    
    // Pré-remplir les champs avec les données existantes
    if (customizations.value.home) {
      const home = customizations.value.home
      
      // Banner
      if (home.banner) {
        homepageBanner.title = home.banner.title || ''
        homepageBanner.subtitle = home.banner.subtitle || ''
        
        // Charger les images existantes (en tant que previews)
        if (home.banner.images && home.banner.images.length > 0) {
          const config = useRuntimeConfig()
          const backendUrl = config.public.apiBase.replace('/api', '')
          
          homepageBanner.images = home.banner.images.map((imagePath: string) => ({
            file: null,
            preview: `${backendUrl}/storage/${imagePath}`
          }))
        }
      }
      
      // Couleurs
      if (home.colors) {
        customColors.primary = home.colors.primary
        customColors.secondary = home.colors.secondary
        customColors.background = home.colors.background
        customColors.text = home.colors.text
      }
      
      // Polices
      if (home.fonts) {
        customFonts.family = home.fonts.family
        customFonts.size = home.fonts.size
        customFonts.weight = home.fonts.weight
      }
      
      // Visibilité des sections
      if (home.sections_visibility) {
        sectionVisibility.homepage = home.sections_visibility.products ?? true
      }
    }
    
    // Charger les données "À propos" si elles existent
    if (customizations.value.about) {
      const about = customizations.value.about
      
      aboutPage.text = about.text || ''
      
      // Charger l'image existante si elle existe
      if (about.image) {
        const config = useRuntimeConfig()
        const backendUrl = config.public.apiBase.replace('/api', '')
        aboutPage.image.preview = `${backendUrl}/storage/${about.image}`
        aboutPage.image.file = null
      }
    }
    
    // Charger les données "CGU" si elles existent
    if (customizations.value.terms) {
      termsPage.text = customizations.value.terms.text || ''
    }
    
    // Charger les données "CGV" si elles existent
    if (customizations.value.sales_terms) {
      salesTermsPage.text = customizations.value.sales_terms.text || ''
    }
    
    // Charger les données du pied de page si elles existent
    if (customizations.value.footer) {
      const footerData = customizations.value.footer
      
      footer.text = footerData.text || ''
      
      if (footerData.socialLinks) {
        footer.socialLinks.facebook = footerData.socialLinks.facebook || ''
        footer.socialLinks.instagram = footerData.socialLinks.instagram || ''
        footer.socialLinks.twitter = footerData.socialLinks.twitter || ''
        footer.socialLinks.linkedin = footerData.socialLinks.linkedin || ''
      }
    }
  } else {
    console.error('❌ Impossible de trouver l\'ID de la boutique:', {
      shopSlug,
      shops: shops.value?.map(s => ({ id: s.id, name: s.name, subdomain: s.subdomain }))
    })
  }
})


// Fonction pour enregistrer la personnalisation
const saveCustomization = async () => {
  if (!shopId.value) {
    alert('❌ Impossible de trouver l\'ID de la boutique')
    return
  }

  try {
    // Récupérer les images déjà uploadées (celles qui n'ont pas de file)
    const existingImages = homepageBanner.images
      .filter(img => img.file === null && img.preview.includes('/storage/'))
      .map(img => img.preview.replace(/.*\/storage\//, '')) // Extraire juste le chemin
    
    // Préparer le contenu pour la page d'accueil
    const homeContent = {
      banner: {
        images: existingImages, // Conserver les images existantes
        title: homepageBanner.title,
        subtitle: homepageBanner.subtitle,
        overlay_opacity: 0.5
      },
      colors: {
        primary: customColors.primary,
        secondary: customColors.secondary,
        background: customColors.background,
        text: customColors.text
      },
      fonts: {
        family: customFonts.family,
        size: customFonts.size,
        weight: customFonts.weight
      },
      sections_visibility: {
        products: sectionVisibility.homepage,
        categories: true
      }
    }

    // Préparer les fichiers d'images du banner (nouvelles images uniquement)
    const bannerFiles = homepageBanner.images
      .map(img => img.file)
      .filter((file): file is File => file !== null)

    // Sauvegarder via l'API
    const success = await saveCustomizationAPI(
      shopId.value,
      'home',
      homeContent,
      { banner_images: bannerFiles }
    )

    // Sauvegarder la page "À propos" si elle contient du texte
    if (aboutPage.text.trim()) {
      const aboutContent = {
        text: aboutPage.text
      }
      
      // Si une nouvelle image a été uploadée
      const aboutFiles = aboutPage.image.file ? { about_image: aboutPage.image.file } : {}
      
      await saveCustomizationAPI(
        shopId.value,
        'about',
        aboutContent,
        aboutFiles
      )
    }
    
    // Sauvegarder la page "CGU" si elle contient du texte
    if (termsPage.text.trim()) {
      const termsContent = {
        text: termsPage.text
      }
      
      await saveCustomizationAPI(
        shopId.value,
        'terms',
        termsContent,
        {}
      )
    }
    
    // Sauvegarder la page "CGV" si elle contient du texte
    if (salesTermsPage.text.trim()) {
      const salesTermsContent = {
        text: salesTermsPage.text
      }
      
      await saveCustomizationAPI(
        shopId.value,
        'sales_terms',
        salesTermsContent,
        {}
      )
    }
    
    // Sauvegarder les données du pied de page
    const footerContent = {
      text: footer.text,
      socialLinks: {
        facebook: footer.socialLinks.facebook,
        instagram: footer.socialLinks.instagram,
        twitter: footer.socialLinks.twitter,
        linkedin: footer.socialLinks.linkedin
      }
    }
    
    await saveCustomizationAPI(
      shopId.value,
      'footer',
      footerContent,
      {}
    )

    if (success) {
      alert('Personnalisation enregistrée avec succès !')
    } else {
      alert('Erreur lors de l\'enregistrement')
    }
  } catch (error: any) {
    console.error('Erreur lors de l\'enregistrement:', error)
    alert(`Erreur: ${error.message || 'Une erreur est survenue'}`)
  }
}

// Fonction pour définir des couleurs prédéfinies
const setPredefinedColors = (preset: 'default' | 'blue') => {
  if (preset === 'default') {
    customColors.primary = '#e56a19'
    customColors.secondary = '#5b6ac5'
  } else if (preset === 'blue') {
    customColors.primary = '#2563eb'
    customColors.secondary = '#0d9488'
  }
}

// Fonction pour calculer la taille de police
const getFontSizeValue = (size: string) => {
  if (size === 'small') {
    return '14px'
  } else if (size === 'medium') {
    return '16px'
  } else if (size === 'large') {
    return '18px'
  }
  return '16px'
}

</script>