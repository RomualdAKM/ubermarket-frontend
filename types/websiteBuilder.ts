// Types pour le Website Builder

import type { PageSection, BlockType, BlockTemplate, BlockDefinition, BlockContent, BlockStyle } from '~/composables/useWebsiteBuilder'

// Définition des templates de blocs disponibles
export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'hero',
    name: 'Section Hero',
    icon: 'heroicons:rectangle-group',
    description: 'Section d\'en-tête avec titre, sous-titre et bouton d\'action',
    templates: [
      {
        id: 'centered-clean',
        name: 'Centré épuré',
        defaultContent: {
          title: 'Titre principal',
          subtitle: 'Sous-titre de votre offre',
          button: {
            text: 'ACHETER MAINTENANT',
            url: '#',
            style: 'primary'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1024px',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          padding: { top: 80, bottom: 80 }
        }
      },
      {
        id: 'hero-with-image',
        name: 'Avec image de fond',
        defaultContent: {
          title: 'Titre accrocheur',
          subtitle: 'Décrivez votre offre en quelques mots',
          button: {
            text: 'EN SAVOIR PLUS',
            url: '#',
            style: 'primary'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1024px',
          backgroundColor: '#1f2937',
          textColor: '#ffffff',
          padding: { top: 120, bottom: 120 },
          backgroundImage: '',
          backgroundOverlay: 0.5
        }
      },
      {
        id: 'hero-split',
        name: 'Deux colonnes',
        defaultContent: {
          title: 'Titre principal',
          subtitle: 'Description détaillée de votre offre ou service',
          button: {
            text: 'DÉCOUVRIR',
            url: '#',
            style: 'primary'
          },
          image: ''
        },
        defaultStyle: {
          alignment: 'left',
          maxWidth: '1280px',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          padding: { top: 60, bottom: 60 }
        }
      }
    ]
  },
  {
    type: 'features',
    name: 'Caractéristiques',
    icon: 'heroicons:sparkles',
    description: 'Liste de fonctionnalités ou avantages',
    templates: [
      {
        id: 'features-grid',
        name: 'Grille 3 colonnes',
        defaultContent: {
          title: 'Nos avantages',
          subtitle: 'Pourquoi nous choisir ?',
          items: [
            { icon: '🚀', title: 'Rapide', description: 'Livraison express' },
            { icon: '🔒', title: 'Sécurisé', description: 'Paiement 100% sécurisé' },
            { icon: '💯', title: 'Qualité', description: 'Produits garantis' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1280px',
          backgroundColor: '#f9fafb',
          textColor: '#111827',
          padding: { top: 60, bottom: 60 }
        }
      },
      {
        id: 'features-list',
        name: 'Liste verticale',
        defaultContent: {
          title: 'Ce que nous offrons',
          items: [
            { icon: '✓', title: 'Avantage 1', description: 'Description de l\'avantage' },
            { icon: '✓', title: 'Avantage 2', description: 'Description de l\'avantage' },
            { icon: '✓', title: 'Avantage 3', description: 'Description de l\'avantage' }
          ]
        },
        defaultStyle: {
          alignment: 'left',
          maxWidth: '800px',
          backgroundColor: '#ffffff',
          textColor: '#374151',
          padding: { top: 40, bottom: 40 }
        }
      }
    ]
  },
  {
    type: 'testimonials',
    name: 'Témoignages',
    icon: 'heroicons:chat-bubble-left-right',
    description: 'Avis et témoignages clients',
    templates: [
      {
        id: 'testimonials-cards',
        name: 'Cartes témoignages',
        defaultContent: {
          title: 'Ce que disent nos clients',
          items: [
            { 
              name: 'Jean Dupont', 
              role: 'Client',
              text: 'Excellent service, je recommande !',
              avatar: ''
            },
            { 
              name: 'Marie Martin', 
              role: 'Entrepreneuse',
              text: 'Produits de qualité, livraison rapide.',
              avatar: ''
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1280px',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          padding: { top: 60, bottom: 60 }
        }
      },
      {
        id: 'testimonials-single',
        name: 'Témoignage unique',
        defaultContent: {
          name: 'Nom du client',
          role: 'Titre / Entreprise',
          text: 'Citation ou témoignage du client ici...',
          avatar: ''
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '800px',
          backgroundColor: '#f3f4f6',
          textColor: '#1f2937',
          padding: { top: 60, bottom: 60 }
        }
      }
    ]
  },
  {
    type: 'pricing',
    name: 'Tarification',
    icon: 'heroicons:currency-euro',
    description: 'Tableau de prix ou offres',
    templates: [
      {
        id: 'pricing-simple',
        name: 'Prix simple',
        defaultContent: {
          title: 'Notre offre',
          price: '99€',
          period: '/mois',
          description: 'Tout ce dont vous avez besoin',
          features: [
            'Fonctionnalité 1',
            'Fonctionnalité 2',
            'Fonctionnalité 3'
          ],
          button: {
            text: 'COMMANDER',
            url: '#'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          padding: { top: 40, bottom: 40 }
        }
      },
      {
        id: 'pricing-comparison',
        name: 'Comparaison de plans',
        defaultContent: {
          title: 'Nos offres',
          plans: [
            {
              name: 'Starter',
              price: '29€',
              period: '/mois',
              features: ['Feature 1', 'Feature 2'],
              highlighted: false
            },
            {
              name: 'Pro',
              price: '79€',
              period: '/mois',
              features: ['Feature 1', 'Feature 2', 'Feature 3'],
              highlighted: true
            },
            {
              name: 'Enterprise',
              price: '199€',
              period: '/mois',
              features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
              highlighted: false
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1280px',
          backgroundColor: '#f9fafb',
          textColor: '#111827',
          padding: { top: 60, bottom: 60 }
        }
      }
    ]
  },
  {
    type: 'cta',
    name: 'Appel à l\'action',
    icon: 'heroicons:cursor-arrow-rays',
    description: 'Section d\'incitation à l\'action',
    templates: [
      {
        id: 'cta-centered',
        name: 'CTA centré',
        defaultContent: {
          title: 'Prêt à commencer ?',
          subtitle: 'Rejoignez des milliers de clients satisfaits',
          button: {
            text: 'COMMENCER MAINTENANT',
            url: '#',
            style: 'primary'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '800px',
          backgroundColor: '#10b981',
          textColor: '#ffffff',
          padding: { top: 60, bottom: 60 }
        }
      },
      {
        id: 'cta-with-email',
        name: 'CTA avec email',
        defaultContent: {
          title: 'Restez informé',
          subtitle: 'Inscrivez-vous à notre newsletter',
          placeholder: 'Votre email',
          button: {
            text: 'S\'INSCRIRE',
            style: 'primary'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '600px',
          backgroundColor: '#1f2937',
          textColor: '#ffffff',
          padding: { top: 40, bottom: 40 }
        }
      }
    ]
  },
  {
    type: 'text',
    name: 'Texte',
    icon: 'heroicons:document-text',
    description: 'Bloc de texte libre',
    templates: [
      {
        id: 'text-simple',
        name: 'Texte simple',
        defaultContent: {
          content: '<p>Votre texte ici...</p>'
        },
        defaultStyle: {
          alignment: 'left',
          maxWidth: '800px',
          backgroundColor: '#ffffff',
          textColor: '#374151',
          padding: { top: 40, bottom: 40 }
        }
      },
      {
        id: 'text-with-title',
        name: 'Texte avec titre',
        defaultContent: {
          title: 'Titre de la section',
          content: '<p>Votre contenu texte ici. Vous pouvez ajouter plusieurs paragraphes.</p>'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundColor: '#ffffff',
          textColor: '#374151',
          padding: { top: 50, bottom: 50 }
        }
      }
    ]
  },
  {
    type: 'image',
    name: 'Image',
    icon: 'heroicons:photo',
    description: 'Image avec options de mise en forme',
    templates: [
      {
        id: 'image-full',
        name: 'Pleine largeur',
        defaultContent: {
          src: '',
          alt: 'Description de l\'image',
          caption: ''
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '100%',
          backgroundColor: 'transparent',
          textColor: '#6b7280',
          padding: { top: 20, bottom: 20 }
        }
      },
      {
        id: 'image-contained',
        name: 'Contenue',
        defaultContent: {
          src: '',
          alt: 'Description de l\'image',
          caption: ''
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '800px',
          backgroundColor: 'transparent',
          textColor: '#6b7280',
          padding: { top: 40, bottom: 40 }
        }
      }
    ]
  },
  {
    type: 'gallery',
    name: 'Galerie',
    icon: 'heroicons:squares-2x2',
    description: 'Galerie d\'images',
    templates: [
      {
        id: 'gallery-grid',
        name: 'Grille',
        defaultContent: {
          images: [],
          columns: 3
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1280px',
          backgroundColor: '#ffffff',
          textColor: '#374151',
          padding: { top: 40, bottom: 40 }
        }
      }
    ]
  },
  {
    type: 'video',
    name: 'Vidéo',
    icon: 'heroicons:play-circle',
    description: 'Vidéo YouTube ou Vimeo',
    templates: [
      {
        id: 'video-embed',
        name: 'Vidéo intégrée',
        defaultContent: {
          url: '',
          title: '',
          autoplay: false
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          padding: { top: 40, bottom: 40 }
        }
      }
    ]
  },
  {
    type: 'faq',
    name: 'FAQ',
    icon: 'heroicons:question-mark-circle',
    description: 'Questions fréquentes',
    templates: [
      {
        id: 'faq-accordion',
        name: 'Accordéon',
        defaultContent: {
          title: 'Questions fréquentes',
          items: [
            { question: 'Question 1 ?', answer: 'Réponse à la question 1.' },
            { question: 'Question 2 ?', answer: 'Réponse à la question 2.' },
            { question: 'Question 3 ?', answer: 'Réponse à la question 3.' }
          ]
        },
        defaultStyle: {
          alignment: 'left',
          maxWidth: '800px',
          backgroundColor: '#ffffff',
          textColor: '#374151',
          padding: { top: 60, bottom: 60 }
        }
      }
    ]
  },
  {
    type: 'contact',
    name: 'Contact',
    icon: 'heroicons:envelope',
    description: 'Formulaire ou informations de contact',
    templates: [
      {
        id: 'contact-info',
        name: 'Informations de contact',
        defaultContent: {
          title: 'Contactez-nous',
          email: 'contact@exemple.com',
          phone: '+33 1 23 45 67 89',
          address: '123 Rue Exemple, 75000 Paris'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '600px',
          backgroundColor: '#f9fafb',
          textColor: '#374151',
          padding: { top: 60, bottom: 60 }
        }
      }
    ]
  },
  {
    type: 'countdown',
    name: 'Compte à rebours',
    icon: 'heroicons:clock',
    description: 'Minuteur pour offres limitées',
    templates: [
      {
        id: 'countdown-simple',
        name: 'Compte à rebours',
        defaultContent: {
          title: 'Offre limitée !',
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          subtitle: 'Ne manquez pas cette occasion'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '600px',
          backgroundColor: '#ef4444',
          textColor: '#ffffff',
          padding: { top: 40, bottom: 40 }
        }
      }
    ]
  },
  {
    type: 'social',
    name: 'Réseaux sociaux',
    icon: 'heroicons:share',
    description: 'Liens vers vos réseaux sociaux',
    templates: [
      {
        id: 'social-icons',
        name: 'Icônes',
        defaultContent: {
          title: 'Suivez-nous',
          links: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: '',
            tiktok: '',
            linkedin: ''
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '600px',
          backgroundColor: '#ffffff',
          textColor: '#374151',
          padding: { top: 40, bottom: 40 }
        }
      }
    ]
  },
  {
    type: 'spacer',
    name: 'Espacement',
    icon: 'heroicons:arrows-up-down',
    description: 'Espace vertical',
    templates: [
      {
        id: 'spacer-small',
        name: 'Petit',
        defaultContent: {},
        defaultStyle: {
          alignment: 'center',
          maxWidth: '100%',
          backgroundColor: 'transparent',
          textColor: 'transparent',
          padding: { top: 20, bottom: 20 }
        }
      },
      {
        id: 'spacer-large',
        name: 'Grand',
        defaultContent: {},
        defaultStyle: {
          alignment: 'center',
          maxWidth: '100%',
          backgroundColor: 'transparent',
          textColor: 'transparent',
          padding: { top: 60, bottom: 60 }
        }
      }
    ]
  },
  {
    type: 'divider',
    name: 'Séparateur',
    icon: 'heroicons:minus',
    description: 'Ligne de séparation',
    templates: [
      {
        id: 'divider-line',
        name: 'Ligne simple',
        defaultContent: {
          style: 'solid',
          width: '100%',
          color: '#e5e7eb'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1280px',
          backgroundColor: 'transparent',
          textColor: 'transparent',
          padding: { top: 20, bottom: 20 }
        }
      }
    ]
  }
]

// Helper pour obtenir un bloc par type
export const getBlockDefinition = (type: BlockType): BlockDefinition | undefined => {
  return BLOCK_DEFINITIONS.find(b => b.type === type)
}

// Helper pour obtenir un template par type et id
export const getBlockTemplate = (type: BlockType, templateId: string): BlockTemplate | undefined => {
  const block = getBlockDefinition(type)
  return block?.templates.find(t => t.id === templateId)
}

// Export des types depuis le composable
export type { 
  PageSection, 
  BlockType, 
  BlockTemplate, 
  BlockDefinition, 
  BlockContent, 
  BlockStyle,
  WebsitePage,
  PageSettings
} from '~/composables/useWebsiteBuilder'
