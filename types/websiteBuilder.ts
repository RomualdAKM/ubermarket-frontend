// Types pour le Website Builder

import type { PageSection, BlockType, BlockTemplate, BlockDefinition, BlockContent, BlockStyle } from '~/composables/useWebsiteBuilder'

// Définition des templates de blocs disponibles
export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'hero',
    name: 'Hero',
    icon: 'heroicons:rectangle-group',
    description: 'Section d\'en-tête principale',
    templates: [
      // === TEMPLATES CENTRÉS ===
      {
        id: 'hero-minimal',
        name: 'Minimaliste',
        preview: 'minimal',
        defaultContent: {
          title: 'Simplicité élégante',
          subtitle: 'Une approche épurée pour un impact maximal',
          button: {
            text: 'Découvrir',
            url: '#',
            style: 'primary'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '720px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      {
        id: 'hero-bold',
        name: 'Impact',
        preview: 'bold',
        defaultContent: {
          title: 'FAITES LA DIFFÉRENCE',
          subtitle: 'Osez vous démarquer avec une présence remarquable',
          button: {
            text: 'COMMENCER',
            url: '#',
            style: 'primary',
            color: '#ffffff',
            textColor: '#0a0a0a'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundColor: '#0a0a0a',
          textColor: '#fafafa',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        },
        defaultTypography: {
          titleSize: 'xlarge',
          titleWeight: '800',
          titleLetterSpacing: 'wide',
          titleTransform: 'uppercase'
        }
      },
      {
        id: 'hero-gradient-animated',
        name: 'Gradient Animé',
        preview: 'gradient-animated',
        defaultContent: {
          title: 'Innovation Continue',
          subtitle: 'Transformez vos idées en réalité',
          button: {
            text: 'Explorer',
            url: '#',
            style: 'outline',
            color: 'transparent',
            textColor: '#ffffff'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '800px',
          backgroundType: 'gradient',
          backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          textColor: '#ffffff',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      {
        id: 'hero-editorial',
        name: 'Éditorial',
        preview: 'editorial',
        defaultContent: {
          title: 'L\'Art de Créer',
          subtitle: 'Une vision unique pour des projets d\'exception',
          badge: 'NOUVEAU',
          button: {
            text: 'Lire la suite',
            url: '#',
            style: 'link'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1000px',
          backgroundColor: '#fafafa',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'large'
        },
        defaultTypography: {
          titleFont: 'playfair',
          titleSize: 'xlarge',
          titleWeight: '600',
          titleLineHeight: 'tight'
        }
      },
      
      // === TEMPLATES AVEC IMAGE ===
      {
        id: 'hero-image-overlay',
        name: 'Image + Overlay',
        preview: 'image-overlay',
        defaultContent: {
          title: 'Explorez l\'Impossible',
          subtitle: 'Repoussez les limites de votre imagination',
          button: {
            text: 'Découvrir',
            url: '#',
            style: 'primary',
            color: '#ffffff',
            textColor: '#0a0a0a'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundType: 'image',
          backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920',
          backgroundOverlay: 60,
          textColor: '#ffffff',
          height: 'large',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      {
        id: 'hero-split-image',
        name: 'Split Image',
        preview: 'split-image',
        defaultContent: {
          layout: 'split',
          title: 'Votre Succès Commence Ici',
          subtitle: 'Nous combinons expertise et innovation pour transformer vos ambitions en réalisations concrètes.',
          image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
          imagePosition: 'right',
          button: {
            text: 'En savoir plus',
            url: '#',
            style: 'primary'
          },
          secondaryButton: {
            text: 'Nous contacter',
            url: '#contact',
            style: 'outline'
          }
        },
        defaultStyle: {
          alignment: 'left',
          maxWidth: '1400px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'none',
          horizontalSpacing: 'none'
        }
      },
      {
        id: 'hero-product-showcase',
        name: 'Produit Vedette',
        preview: 'product-showcase',
        defaultContent: {
          layout: 'product',
          badge: 'BEST-SELLER',
          title: 'Le Produit Révolutionnaire',
          subtitle: 'Découvrez ce qui fait de nous le choix numéro 1',
          price: '149\u20ac',
          originalPrice: '199\u20ac',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
          features: ['Livraison gratuite', 'Garantie 2 ans', 'Retours faciles'],
          button: {
            text: 'Ajouter au panier',
            url: '#',
            style: 'primary'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1200px',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === TEMPLATES SLIDER ===
      {
        id: 'hero-slider',
        name: 'Slider',
        preview: 'slider',
        defaultContent: {
          layout: 'slider',
          autoplay: true,
          autoplaySpeed: 5000,
          showArrows: true,
          showDots: true,
          slides: [
            {
              title: 'Slide 1 - Innovation',
              subtitle: 'Découvrez nos dernières nouveautés',
              image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920',
              button: { text: 'Découvrir', url: '#' }
            },
            {
              title: 'Slide 2 - Qualité',
              subtitle: 'L\'excellence à chaque étape',
              image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920',
              button: { text: 'Voir plus', url: '#' }
            },
            {
              title: 'Slide 3 - Service',
              subtitle: 'Un accompagnement personnalisé',
              image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920',
              button: { text: 'Contacter', url: '#' }
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '100%',
          backgroundType: 'image',
          backgroundOverlay: 50,
          textColor: '#ffffff',
          height: 'large',
          verticalSpacing: 'none',
          horizontalSpacing: 'none'
        }
      },
      {
        id: 'hero-slider-minimal',
        name: 'Slider Minimaliste',
        preview: 'slider-minimal',
        defaultContent: {
          layout: 'slider',
          autoplay: true,
          autoplaySpeed: 4000,
          showArrows: false,
          showDots: true,
          transition: 'fade',
          slides: [
            {
              title: 'Première Offre',
              subtitle: 'Profitez de -30% sur la collection',
              backgroundColor: '#0a0a0a'
            },
            {
              title: 'Deuxième Offre',
              subtitle: 'Livraison gratuite dès 50\u20ac',
              backgroundColor: '#1e3a5f'
            },
            {
              title: 'Troisième Offre',
              subtitle: 'Nouveautés disponibles',
              backgroundColor: '#3d1f5c'
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '100%',
          backgroundColor: '#0a0a0a',
          textColor: '#ffffff',
          backgroundType: 'color',
          height: 'medium',
          verticalSpacing: 'none',
          horizontalSpacing: 'medium'
        }
      },
      {
        id: 'hero-slider-cards',
        name: 'Slider Cartes',
        preview: 'slider-cards',
        defaultContent: {
          layout: 'slider-cards',
          title: 'Nos Collections',
          autoplay: false,
          showArrows: true,
          cards: [
            {
              title: 'Collection Été',
              subtitle: 'À partir de 29\u20ac',
              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
              url: '#'
            },
            {
              title: 'Collection Hiver',
              subtitle: 'À partir de 49\u20ac',
              image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600',
              url: '#'
            },
            {
              title: 'Accessoires',
              subtitle: 'À partir de 15\u20ac',
              image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
              url: '#'
            },
            {
              title: 'Nouveautés',
              subtitle: 'Découvrir',
              image: 'https://images.unsplash.com/photo-1491553895911-0055uj989e7a?w=600',
              url: '#'
            }
          ]
        },
        defaultStyle: {
          alignment: 'left',
          maxWidth: '1400px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === TEMPLATES AVANCÉS ===
      {
        id: 'hero-video-background',
        name: 'Vidéo Background',
        preview: 'video-bg',
        defaultContent: {
          layout: 'video',
          title: 'Vivez l\'Expérience',
          subtitle: 'Une immersion totale dans notre univers',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoPoster: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920',
          button: {
            text: 'En savoir plus',
            url: '#',
            style: 'outline',
            color: 'transparent',
            textColor: '#ffffff'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundType: 'video',
          backgroundOverlay: 50,
          textColor: '#ffffff',
          height: 'full',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      {
        id: 'hero-stats',
        name: 'Héro + Stats',
        preview: 'stats',
        defaultContent: {
          title: 'Ils Nous Font Confiance',
          subtitle: 'Des résultats qui parlent d\'eux-mêmes',
          stats: [
            { value: '10K+', label: 'Clients satisfaits' },
            { value: '50M\u20ac', label: 'De ventes' },
            { value: '99%', label: 'Satisfaction' },
            { value: '24/7', label: 'Support' }
          ],
          button: {
            text: 'Rejoindre',
            url: '#',
            style: 'primary'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1100px',
          backgroundColor: '#0f172a',
          textColor: '#f8fafc',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      {
        id: 'hero-dual-cta',
        name: 'Double Action',
        preview: 'dual-cta',
        defaultContent: {
          title: 'Créez Votre Espace',
          subtitle: 'Choisissez votre voie vers le succès',
          leftCta: {
            icon: 'store',
            title: 'Pour les Vendeurs',
            description: 'Lancez votre boutique en quelques clics',
            button: { text: 'Commencer à vendre', url: '#' }
          },
          rightCta: {
            icon: 'shopping',
            title: 'Pour les Acheteurs',
            description: 'Découvrez des produits uniques',
            button: { text: 'Explorer', url: '#' }
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1200px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      {
        id: 'hero-countdown',
        name: 'Lancement',
        preview: 'countdown',
        defaultContent: {
          badge: 'COMING SOON',
          title: 'Quelque Chose d\'Incroyable Arrive',
          subtitle: 'Soyez les premiers informés',
          launchDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          showCountdown: true,
          emailCapture: true,
          placeholder: 'Votre email',
          button: {
            text: 'Me notifier',
            url: '#',
            style: 'primary'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '700px',
          backgroundType: 'gradient',
          backgroundGradient: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
          textColor: '#ffffff',
          height: 'large',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      }
    ]
  },
  {
    type: 'features',
    name: 'Caractéristiques',
    icon: 'heroicons:sparkles',
    description: 'Présentation des avantages',
    templates: [
      {
        id: 'features-grid-3',
        name: 'Grille moderne',
        preview: 'grid',
        defaultContent: {
          title: 'Pourquoi nous choisir',
          subtitle: 'Des avantages qui font la différence',
          items: [
            { icon: 'zap', title: 'Rapide', description: 'Performance optimisée pour une expérience fluide' },
            { icon: 'shield', title: 'Sécurisé', description: 'Protection avancée de vos données' },
            { icon: 'star', title: 'Premium', description: 'Qualité professionnelle garantie' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1100px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          padding: { top: 80, bottom: 80 }
        }
      },
      {
        id: 'features-cards',
        name: 'Cartes flottantes',
        preview: 'cards',
        defaultContent: {
          title: 'Nos services',
          items: [
            { icon: 'box', title: 'Service 1', description: 'Description concise du premier service' },
            { icon: 'layers', title: 'Service 2', description: 'Description concise du deuxième service' },
            { icon: 'globe', title: 'Service 3', description: 'Description concise du troisième service' },
            { icon: 'settings', title: 'Service 4', description: 'Description concise du quatrième service' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1200px',
          backgroundColor: '#f5f5f5',
          textColor: '#262626',
          padding: { top: 80, bottom: 80 }
        }
      },
      {
        id: 'features-list-check',
        name: 'Liste épurée',
        preview: 'list',
        defaultContent: {
          title: 'Ce qui est inclus',
          items: [
            { icon: 'check', title: 'Fonctionnalité essentielle', description: 'Description détaillée' },
            { icon: 'check', title: 'Support prioritaire', description: 'Assistance dédiée 24/7' },
            { icon: 'check', title: 'Mises à jour gratuites', description: 'Évolutions continues' }
          ]
        },
        defaultStyle: {
          alignment: 'left',
          maxWidth: '700px',
          backgroundColor: '#ffffff',
          textColor: '#404040',
          padding: { top: 60, bottom: 60 }
        }
      },
      {
        id: 'features-icons-row',
        name: 'Icônes en ligne',
        preview: 'icons',
        defaultContent: {
          items: [
            { icon: 'truck', title: 'Livraison express', description: '' },
            { icon: 'refresh', title: 'Retours gratuits', description: '' },
            { icon: 'lock', title: 'Paiement sécurisé', description: '' },
            { icon: 'headphones', title: 'Support 24/7', description: '' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1000px',
          backgroundColor: '#fafafa',
          textColor: '#525252',
          padding: { top: 40, bottom: 40 }
        }
      }
    ]
  },
  {
    type: 'testimonials',
    name: 'Témoignages',
    icon: 'heroicons:chat-bubble-left-right',
    description: 'Avis clients',
    templates: [
      {
        id: 'testimonials-cards-3',
        name: 'Cartes élégantes',
        preview: 'cards',
        defaultContent: {
          title: 'Ils nous font confiance',
          items: [
            { 
              name: 'Marie Laurent', 
              role: 'Directrice Marketing',
              text: 'Une expérience exceptionnelle. Le professionnalisme et la qualité sont au rendez-vous.',
              avatar: ''
            },
            { 
              name: 'Thomas Dubois', 
              role: 'Entrepreneur',
              text: 'Service impeccable et résultats au-delà de mes attentes. Je recommande vivement.',
              avatar: ''
            },
            { 
              name: 'Sophie Martin', 
              role: 'Designer',
              text: 'La qualité et l\'attention aux détails font toute la différence.',
              avatar: ''
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1200px',
          backgroundColor: '#ffffff',
          textColor: '#262626',
          padding: { top: 80, bottom: 80 }
        }
      },
      {
        id: 'testimonials-quote',
        name: 'Citation centrale',
        preview: 'quote',
        defaultContent: {
          title: '',
          items: [
            {
              name: 'Jean-Pierre Moreau',
              role: 'CEO, Entreprise XYZ',
              text: 'Une collaboration remarquable qui a transformé notre vision en réalité. L\'expertise et le dévouement de l\'équipe ont été déterminants.',
              avatar: ''
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '800px',
          backgroundColor: '#fafafa',
          textColor: '#171717',
          padding: { top: 100, bottom: 100 }
        }
      },
      {
        id: 'testimonials-minimal',
        name: 'Minimaliste',
        preview: 'minimal',
        defaultContent: {
          items: [
            { 
              name: 'Client satisfait', 
              role: '',
              text: 'Excellent service.',
              avatar: ''
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '600px',
          backgroundColor: '#0a0a0a',
          textColor: '#e5e5e5',
          padding: { top: 60, bottom: 60 }
        }
      }
    ]
  },
  {
    type: 'pricing',
    name: 'Tarification',
    icon: 'heroicons:currency-euro',
    description: 'Présentation des prix',
    templates: [
      {
        id: 'pricing-single',
        name: 'Offre unique',
        preview: 'single',
        defaultContent: {
          title: 'Notre offre',
          price: '49',
          currency: '€',
          period: '/mois',
          description: 'Tout ce dont vous avez besoin',
          features: [
            'Accès complet',
            'Support prioritaire',
            'Mises à jour incluses'
          ],
          button: {
            text: 'Commencer',
            url: '#'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          padding: { top: 60, bottom: 60 }
        }
      },
      {
        id: 'pricing-three-tiers',
        name: 'Trois formules',
        preview: 'tiers',
        defaultContent: {
          title: 'Choisissez votre formule',
          subtitle: 'Sans engagement, annulez à tout moment',
          plans: [
            {
              name: 'Starter',
              price: '19',
              currency: '€',
              period: '/mois',
              features: ['Fonctionnalité A', 'Fonctionnalité B'],
              highlighted: false,
              button: { text: 'Choisir', url: '#' }
            },
            {
              name: 'Pro',
              price: '49',
              currency: '€',
              period: '/mois',
              features: ['Tout de Starter', 'Fonctionnalité C', 'Fonctionnalité D'],
              highlighted: true,
              badge: 'Populaire',
              button: { text: 'Choisir', url: '#' }
            },
            {
              name: 'Enterprise',
              price: '99',
              currency: '€',
              period: '/mois',
              features: ['Tout de Pro', 'Fonctionnalité E', 'Support dédié'],
              highlighted: false,
              button: { text: 'Contacter', url: '#' }
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1100px',
          backgroundColor: '#fafafa',
          textColor: '#171717',
          padding: { top: 80, bottom: 80 }
        }
      },
      {
        id: 'pricing-comparison',
        name: 'Comparatif',
        preview: 'comparison',
        defaultContent: {
          title: 'Comparez nos offres',
          plans: [
            {
              name: 'Gratuit',
              price: '0',
              currency: '€',
              period: '',
              features: ['1 projet', 'Support email'],
              highlighted: false
            },
            {
              name: 'Premium',
              price: '29',
              currency: '€',
              period: '/mois',
              features: ['Projets illimités', 'Support prioritaire', 'Fonctionnalités avancées'],
              highlighted: true
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundColor: '#ffffff',
          textColor: '#262626',
          padding: { top: 80, bottom: 80 }
        }
      }
    ]
  },
  {
    type: 'cta',
    name: 'Appel à l\'action',
    icon: 'heroicons:cursor-arrow-rays',
    description: 'Incitation à l\'action',
    templates: [
      {
        id: 'cta-simple',
        name: 'Simple',
        preview: 'simple',
        defaultContent: {
          title: 'Prêt à commencer ?',
          subtitle: '',
          button: {
            text: 'Démarrer maintenant',
            url: '#',
            style: 'primary'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '600px',
          backgroundColor: '#171717',
          textColor: '#fafafa',
          padding: { top: 60, bottom: 60 }
        }
      },
      {
        id: 'cta-gradient',
        name: 'Dégradé',
        preview: 'gradient',
        defaultContent: {
          title: 'Rejoignez-nous',
          subtitle: 'Plus de 10 000 clients satisfaits',
          button: {
            text: 'S\'inscrire gratuitement',
            url: '#',
            style: 'white'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '800px',
          backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          textColor: '#ffffff',
          padding: { top: 80, bottom: 80 }
        }
      },
      {
        id: 'cta-newsletter',
        name: 'Newsletter',
        preview: 'newsletter',
        defaultContent: {
          title: 'Restez informé',
          subtitle: 'Recevez nos dernières actualités',
          placeholder: 'Votre email',
          button: {
            text: 'S\'abonner',
            style: 'primary'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '500px',
          backgroundColor: '#f5f5f5',
          textColor: '#262626',
          padding: { top: 60, bottom: 60 }
        }
      },
      {
        id: 'cta-banner',
        name: 'Bandeau',
        preview: 'banner',
        defaultContent: {
          title: 'Offre limitée',
          subtitle: '-20% avec le code PROMO20',
          button: {
            text: 'En profiter',
            url: '#',
            style: 'outline'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '100%',
          backgroundColor: '#0a0a0a',
          textColor: '#fafafa',
          padding: { top: 30, bottom: 30 }
        }
      }
    ]
  },
  {
    type: 'text',
    name: 'Texte',
    icon: 'heroicons:document-text',
    description: 'Contenu textuel',
    templates: [
      {
        id: 'text-paragraph',
        name: 'Paragraphe',
        preview: 'paragraph',
        defaultContent: {
          content: 'Votre contenu textuel ici. Rédigez un paragraphe clair et engageant pour vos visiteurs.'
        },
        defaultStyle: {
          alignment: 'left',
          maxWidth: '700px',
          backgroundColor: '#ffffff',
          textColor: '#404040',
          padding: { top: 40, bottom: 40 }
        }
      },
      {
        id: 'text-with-heading',
        name: 'Avec titre',
        preview: 'heading',
        defaultContent: {
          title: 'Titre de section',
          content: 'Développez votre message avec un contenu structuré et professionnel.'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '800px',
          backgroundColor: '#ffffff',
          textColor: '#262626',
          padding: { top: 60, bottom: 60 }
        }
      },
      {
        id: 'text-quote',
        name: 'Citation',
        preview: 'quote',
        defaultContent: {
          content: 'Une citation inspirante ou un message clé qui résonne avec votre audience.',
          author: 'Auteur'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '600px',
          backgroundColor: '#fafafa',
          textColor: '#525252',
          padding: { top: 60, bottom: 60 }
        }
      }
    ]
  },
  {
    type: 'image',
    name: 'Image',
    icon: 'heroicons:photo',
    description: 'Image avec options',
    templates: [
      {
        id: 'image-full-width',
        name: 'Pleine largeur',
        preview: 'full',
        defaultContent: {
          src: '',
          alt: 'Description de l\'image',
          caption: ''
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '100%',
          backgroundColor: 'transparent',
          textColor: '#737373',
          padding: { top: 0, bottom: 0 }
        }
      },
      {
        id: 'image-contained',
        name: 'Contenue',
        preview: 'contained',
        defaultContent: {
          src: '',
          alt: 'Description de l\'image',
          caption: ''
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '800px',
          backgroundColor: 'transparent',
          textColor: '#737373',
          padding: { top: 40, bottom: 40 }
        }
      },
      {
        id: 'image-with-caption',
        name: 'Avec légende',
        preview: 'caption',
        defaultContent: {
          src: '',
          alt: 'Description de l\'image',
          caption: 'Légende de l\'image'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '700px',
          backgroundColor: '#ffffff',
          textColor: '#525252',
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
        id: 'gallery-grid-3',
        name: 'Grille 3 colonnes',
        preview: 'grid3',
        defaultContent: {
          images: [],
          columns: 3
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1100px',
          backgroundColor: '#ffffff',
          textColor: '#404040',
          padding: { top: 40, bottom: 40 }
        }
      },
      {
        id: 'gallery-masonry',
        name: 'Masonry',
        preview: 'masonry',
        defaultContent: {
          images: [],
          columns: 3
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1200px',
          backgroundColor: '#fafafa',
          textColor: '#404040',
          padding: { top: 60, bottom: 60 }
        }
      }
    ]
  },
  {
    type: 'video',
    name: 'Vidéo',
    icon: 'heroicons:play-circle',
    description: 'Vidéo intégrée',
    templates: [
      {
        id: 'video-centered',
        name: 'Centrée',
        preview: 'centered',
        defaultContent: {
          url: '',
          title: '',
          autoplay: false
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundColor: '#0a0a0a',
          textColor: '#ffffff',
          padding: { top: 60, bottom: 60 }
        }
      },
      {
        id: 'video-with-description',
        name: 'Avec description',
        preview: 'description',
        defaultContent: {
          url: '',
          title: 'Titre de la vidéo',
          description: 'Description de la vidéo',
          autoplay: false
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '800px',
          backgroundColor: '#ffffff',
          textColor: '#262626',
          padding: { top: 60, bottom: 60 }
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
        preview: 'accordion',
        defaultContent: {
          title: 'Questions fréquentes',
          items: [
            { question: 'Comment ça fonctionne ?', answer: 'Explication claire et détaillée du fonctionnement.' },
            { question: 'Quels sont les délais ?', answer: 'Information sur les délais de livraison ou de traitement.' },
            { question: 'Comment vous contacter ?', answer: 'Nos coordonnées et moyens de contact disponibles.' }
          ]
        },
        defaultStyle: {
          alignment: 'left',
          maxWidth: '800px',
          backgroundColor: '#ffffff',
          textColor: '#262626',
          padding: { top: 80, bottom: 80 }
        }
      },
      {
        id: 'faq-two-columns',
        name: 'Deux colonnes',
        preview: 'columns',
        defaultContent: {
          title: 'Besoin d\'aide ?',
          subtitle: 'Trouvez rapidement vos réponses',
          items: [
            { question: 'Question 1 ?', answer: 'Réponse concise.' },
            { question: 'Question 2 ?', answer: 'Réponse concise.' },
            { question: 'Question 3 ?', answer: 'Réponse concise.' },
            { question: 'Question 4 ?', answer: 'Réponse concise.' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1000px',
          backgroundColor: '#fafafa',
          textColor: '#404040',
          padding: { top: 80, bottom: 80 }
        }
      }
    ]
  },
  {
    type: 'contact',
    name: 'Contact',
    icon: 'heroicons:envelope',
    description: 'Informations de contact',
    templates: [
      {
        id: 'contact-simple',
        name: 'Simple',
        preview: 'simple',
        defaultContent: {
          title: 'Contactez-nous',
          email: 'contact@exemple.com',
          phone: '+33 1 23 45 67 89',
          address: ''
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '500px',
          backgroundColor: '#ffffff',
          textColor: '#404040',
          padding: { top: 60, bottom: 60 }
        }
      },
      {
        id: 'contact-detailed',
        name: 'Détaillé',
        preview: 'detailed',
        defaultContent: {
          title: 'Nous contacter',
          subtitle: 'Notre équipe est à votre disposition',
          email: 'contact@exemple.com',
          phone: '+33 1 23 45 67 89',
          address: '123 Rue Exemple, 75001 Paris',
          hours: 'Lun-Ven : 9h-18h'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '700px',
          backgroundColor: '#f5f5f5',
          textColor: '#262626',
          padding: { top: 80, bottom: 80 }
        }
      }
    ]
  },
  {
    type: 'countdown',
    name: 'Compte à rebours',
    icon: 'heroicons:clock',
    description: 'Minuteur',
    templates: [
      {
        id: 'countdown-urgent',
        name: 'Urgence',
        preview: 'urgent',
        defaultContent: {
          title: 'Offre limitée',
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          subtitle: 'Ne manquez pas cette opportunité'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '600px',
          backgroundColor: '#dc2626',
          textColor: '#ffffff',
          padding: { top: 40, bottom: 40 }
        }
      },
      {
        id: 'countdown-elegant',
        name: 'Élégant',
        preview: 'elegant',
        defaultContent: {
          title: 'Bientôt disponible',
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          subtitle: ''
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '500px',
          backgroundColor: '#171717',
          textColor: '#fafafa',
          padding: { top: 60, bottom: 60 }
        }
      }
    ]
  },
  {
    type: 'social',
    name: 'Réseaux sociaux',
    icon: 'heroicons:share',
    description: 'Liens sociaux',
    templates: [
      {
        id: 'social-icons-centered',
        name: 'Icônes centrées',
        preview: 'centered',
        defaultContent: {
          title: 'Suivez-nous',
          links: {
            facebook: '',
            instagram: '',
            twitter: '',
            youtube: '',
            linkedin: ''
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '400px',
          backgroundColor: '#ffffff',
          textColor: '#525252',
          padding: { top: 40, bottom: 40 }
        }
      },
      {
        id: 'social-footer',
        name: 'Style footer',
        preview: 'footer',
        defaultContent: {
          links: {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: ''
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '300px',
          backgroundColor: '#171717',
          textColor: '#a3a3a3',
          padding: { top: 30, bottom: 30 }
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
        preview: 'small',
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
        id: 'spacer-medium',
        name: 'Moyen',
        preview: 'medium',
        defaultContent: {},
        defaultStyle: {
          alignment: 'center',
          maxWidth: '100%',
          backgroundColor: 'transparent',
          textColor: 'transparent',
          padding: { top: 40, bottom: 40 }
        }
      },
      {
        id: 'spacer-large',
        name: 'Grand',
        preview: 'large',
        defaultContent: {},
        defaultStyle: {
          alignment: 'center',
          maxWidth: '100%',
          backgroundColor: 'transparent',
          textColor: 'transparent',
          padding: { top: 80, bottom: 80 }
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
        name: 'Ligne fine',
        preview: 'line',
        defaultContent: {
          style: 'solid',
          width: '100%',
          color: '#e5e5e5'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1200px',
          backgroundColor: 'transparent',
          textColor: 'transparent',
          padding: { top: 20, bottom: 20 }
        }
      },
      {
        id: 'divider-short',
        name: 'Courte centrée',
        preview: 'short',
        defaultContent: {
          style: 'solid',
          width: '80px',
          color: '#171717'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '100%',
          backgroundColor: 'transparent',
          textColor: 'transparent',
          padding: { top: 40, bottom: 40 }
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
