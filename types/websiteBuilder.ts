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
          backgroundType: 'color',
          backgroundColor: '#0a0a0a',
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
      // === GRILLES CLASSIQUES ===
      {
        id: 'features-grid-3',
        name: 'Grille 3 colonnes',
        preview: 'grid-3',
        defaultContent: {
          title: 'Pourquoi nous choisir',
          subtitle: 'Des avantages qui font la différence',
          columns: 3,
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
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      {
        id: 'features-grid-4',
        name: 'Grille 4 colonnes',
        preview: 'grid-4',
        defaultContent: {
          title: 'Nos services',
          subtitle: '',
          columns: 4,
          items: [
            { icon: 'box', title: 'Service 1', description: 'Description concise' },
            { icon: 'layers', title: 'Service 2', description: 'Description concise' },
            { icon: 'globe', title: 'Service 3', description: 'Description concise' },
            { icon: 'settings', title: 'Service 4', description: 'Description concise' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1200px',
          backgroundColor: '#fafafa',
          textColor: '#262626',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === BENTO GRID (Style Apple) ===
      {
        id: 'features-bento',
        name: 'Bento Grid',
        preview: 'bento',
        defaultContent: {
          layout: 'bento',
          title: 'Tout ce dont vous avez besoin',
          items: [
            { icon: 'zap', title: 'Performance', description: 'Des temps de chargement ultra-rapides', size: 'large', image: '' },
            { icon: 'shield', title: 'Sécurité', description: 'Protection de niveau entreprise', size: 'medium' },
            { icon: 'refresh', title: 'Mises à jour', description: 'Améliorations continues', size: 'medium' },
            { icon: 'star', title: 'Support', description: 'Assistance 24/7', size: 'small' },
            { icon: 'globe', title: 'Global', description: 'Disponible partout', size: 'small' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1200px',
          backgroundColor: '#0a0a0a',
          textColor: '#fafafa',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === CARTES AVEC EFFETS ===
      {
        id: 'features-cards-hover',
        name: 'Cartes Hover',
        preview: 'cards-hover',
        defaultContent: {
          title: 'Ce qui nous distingue',
          subtitle: 'Survolez pour en savoir plus',
          items: [
            { icon: 'zap', title: 'Rapidité', description: 'Livré en 24h maximum', hoverDescription: 'Notre réseau logistique permet une livraison express partout en France.' },
            { icon: 'shield', title: 'Garantie', description: 'Satisfait ou remboursé', hoverDescription: 'Retournez tout article dans les 30 jours pour un remboursement complet.' },
            { icon: 'headphones', title: 'Support', description: 'Toujours disponible', hoverDescription: 'Équipe dédiée joignable par chat, email ou téléphone 24/7.' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1100px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      {
        id: 'features-cards-gradient',
        name: 'Cartes Gradient',
        preview: 'cards-gradient',
        defaultContent: {
          title: 'Nos avantages',
          items: [
            { icon: 'zap', title: 'Performance', description: 'Optimisé pour la vitesse', gradient: 'from-blue-500 to-cyan-500' },
            { icon: 'shield', title: 'Sécurité', description: 'Protection maximale', gradient: 'from-purple-500 to-pink-500' },
            { icon: 'star', title: 'Qualité', description: 'Excellence garantie', gradient: 'from-orange-500 to-red-500' }
          ]
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
      
      // === TIMELINE / PROCESS ===
      {
        id: 'features-timeline',
        name: 'Timeline Verticale',
        preview: 'timeline',
        defaultContent: {
          layout: 'timeline',
          title: 'Comment ça marche',
          subtitle: 'Un processus simple en quelques étapes',
          items: [
            { step: 1, title: 'Inscription', description: 'Créez votre compte en quelques secondes' },
            { step: 2, title: 'Configuration', description: 'Personnalisez votre espace selon vos besoins' },
            { step: 3, title: 'Lancement', description: 'Publiez et commencez à vendre immédiatement' },
            { step: 4, title: 'Croissance', description: 'Analysez et optimisez vos performances' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '800px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      {
        id: 'features-process-horizontal',
        name: 'Process Horizontal',
        preview: 'process',
        defaultContent: {
          layout: 'process',
          title: 'Votre parcours',
          items: [
            { step: 1, title: 'Découvrez', description: 'Explorez notre catalogue', icon: 'search' },
            { step: 2, title: 'Sélectionnez', description: 'Choisissez vos produits', icon: 'check' },
            { step: 3, title: 'Commandez', description: 'Validez en un clic', icon: 'box' },
            { step: 4, title: 'Recevez', description: 'Livraison rapide', icon: 'truck' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1200px',
          backgroundColor: '#fafafa',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === COMPARATIF ===
      {
        id: 'features-comparison',
        name: 'Comparatif',
        preview: 'comparison',
        defaultContent: {
          layout: 'comparison',
          title: 'Pourquoi nous choisir',
          subtitle: 'La différence est claire',
          leftColumn: {
            title: 'Les autres',
            type: 'negative',
            items: [
              'Frais cachés',
              'Support limité',
              'Fonctionnalités basiques',
              'Mises à jour payantes'
            ]
          },
          rightColumn: {
            title: 'Notre solution',
            type: 'positive',
            items: [
              'Tarification transparente',
              'Support 24/7 inclus',
              'Toutes les fonctionnalités',
              'Mises à jour gratuites'
            ]
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === STATS + FEATURES ===
      {
        id: 'features-stats',
        name: 'Stats & Features',
        preview: 'stats',
        defaultContent: {
          layout: 'stats',
          title: 'Des résultats qui parlent',
          stats: [
            { value: '99.9%', label: 'Uptime garanti' },
            { value: '< 100ms', label: 'Temps de réponse' },
            { value: '10M+', label: 'Utilisateurs actifs' },
            { value: '150+', label: 'Pays desservis' }
          ],
          features: [
            { icon: 'zap', title: 'Ultra-rapide', description: 'Infrastructure optimisée' },
            { icon: 'shield', title: 'Sécurisé', description: 'Chiffrement de bout en bout' }
          ]
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
      
      // === ALTERNATING (Zigzag) ===
      {
        id: 'features-alternating',
        name: 'Alterné Image/Texte',
        preview: 'alternating',
        defaultContent: {
          layout: 'alternating',
          items: [
            {
              title: 'Fonctionnalité puissante',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
              image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600',
              button: { text: 'En savoir plus', url: '#' }
            },
            {
              title: 'Interface intuitive',
              description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
              image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
              button: { text: 'Découvrir', url: '#' }
            },
            {
              title: 'Support dédié',
              description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.',
              image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600',
              button: { text: 'Contacter', url: '#' }
            }
          ]
        },
        defaultStyle: {
          alignment: 'left',
          maxWidth: '1200px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === FEATURE SHOWCASE ===
      {
        id: 'features-showcase',
        name: 'Feature Vedette',
        preview: 'showcase',
        defaultContent: {
          layout: 'showcase',
          badge: 'NOUVEAU',
          title: 'La fonctionnalité qui change tout',
          description: 'Découvrez notre dernière innovation qui va révolutionner votre façon de travailler. Une interface repensée, des performances améliorées.',
          image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
          features: [
            'Intégration native',
            'Performance x10',
            'Sécurité renforcée'
          ],
          button: { text: 'Essayer maintenant', url: '#' }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1100px',
          backgroundColor: '#fafafa',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === LISTES COMPACTES ===
      {
        id: 'features-checklist',
        name: 'Checklist',
        preview: 'checklist',
        defaultContent: {
          title: 'Tout est inclus',
          subtitle: 'Pas de frais cachés, tout est compris',
          columns: 2,
          items: [
            'Accès illimité',
            'Support prioritaire',
            'Mises à jour automatiques',
            'Sauvegarde quotidienne',
            'API complète',
            'Documentation détaillée',
            'Formation incluse',
            'Certificat SSL'
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '800px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'medium',
          horizontalSpacing: 'medium'
        }
      },
      {
        id: 'features-icons-row',
        name: 'Icônes en ligne',
        preview: 'icons-row',
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
          backgroundType: 'color',
          verticalSpacing: 'small',
          horizontalSpacing: 'medium'
        }
      },
      
      // === TABS FEATURES ===
      {
        id: 'features-tabs',
        name: 'Onglets',
        preview: 'tabs',
        defaultContent: {
          layout: 'tabs',
          title: 'Explorer nos fonctionnalités',
          tabs: [
            {
              id: 'tab1',
              label: 'Performance',
              icon: 'zap',
              title: 'Vitesse incomparable',
              description: 'Notre infrastructure est optimisée pour offrir les meilleures performances du marché.',
              image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600',
              features: ['CDN global', 'Cache intelligent', 'Compression automatique']
            },
            {
              id: 'tab2',
              label: 'Sécurité',
              icon: 'shield',
              title: 'Protection maximale',
              description: 'Vos données sont protégées par les standards de sécurité les plus stricts.',
              image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600',
              features: ['Chiffrement AES-256', 'Authentification 2FA', 'Audit de sécurité']
            },
            {
              id: 'tab3',
              label: 'Intégrations',
              icon: 'layers',
              title: 'Connecté à tout',
              description: 'Intégrez facilement avec vos outils préférés grâce à notre API.',
              image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
              features: ['API REST', 'Webhooks', '500+ intégrations']
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1100px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === CENTERED MINIMAL ===
      {
        id: 'features-centered',
        name: 'Centré Minimal',
        preview: 'centered',
        defaultContent: {
          title: 'Simple. Puissant. Efficace.',
          description: 'Tout ce dont vous avez besoin, rien de superflu.',
          items: [
            { icon: 'zap', title: 'Rapide', description: 'Performance optimale' },
            { icon: 'shield', title: 'Sûr', description: 'Sécurité intégrée' },
            { icon: 'star', title: 'Pro', description: 'Qualité premium' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundColor: '#0a0a0a',
          textColor: '#fafafa',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === ICON LARGE ===
      {
        id: 'features-icons-large',
        name: 'Grandes Icônes',
        preview: 'icons-large',
        defaultContent: {
          title: 'Pourquoi nous',
          items: [
            { icon: 'truck', title: 'Livraison', description: 'Express en 24h dans toute la France' },
            { icon: 'refresh', title: 'Retours', description: '30 jours pour changer d\'avis' },
            { icon: 'headphones', title: 'Support', description: 'Équipe dédiée disponible 24/7' }
          ]
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
      }
    ]
  },
  {
    type: 'testimonials',
    name: 'Témoignages',
    icon: 'heroicons:chat-bubble-left-right',
    description: 'Avis clients',
    templates: [
      // === CARTES CLASSIQUES ===
      {
        id: 'testimonials-cards-3',
        name: 'Cartes 3 colonnes',
        preview: 'cards-3',
        defaultContent: {
          layout: 'cards',
          title: 'Ils nous font confiance',
          subtitle: 'D\u00e9couvrez ce que nos clients disent de nous',
          items: [
            { 
              name: 'Marie Laurent', 
              role: 'Directrice Marketing',
              company: 'TechCorp',
              text: 'Une exp\u00e9rience exceptionnelle. Le professionnalisme et la qualit\u00e9 sont au rendez-vous.',
              avatar: '',
              rating: 5
            },
            { 
              name: 'Thomas Dubois', 
              role: 'Entrepreneur',
              company: 'StartupXYZ',
              text: 'Service impeccable et r\u00e9sultats au-del\u00e0 de mes attentes. Je recommande vivement.',
              avatar: '',
              rating: 5
            },
            { 
              name: 'Sophie Martin', 
              role: 'Designer',
              company: 'Studio Creative',
              text: 'La qualit\u00e9 et l\'attention aux d\u00e9tails font toute la diff\u00e9rence.',
              avatar: '',
              rating: 5
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1200px',
          backgroundColor: '#ffffff',
          textColor: '#262626',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
        
      // === CITATION CENTRALE ===
      {
        id: 'testimonials-quote-large',
        name: 'Citation Highlight',
        preview: 'quote-large',
        defaultContent: {
          layout: 'quote',
          items: [
            {
              name: 'Jean-Pierre Moreau',
              role: 'CEO',
              company: 'Entreprise Leader',
              text: 'Une collaboration remarquable qui a transform\u00e9 notre vision en r\u00e9alit\u00e9. L\'expertise et le d\u00e9vouement de l\'\u00e9quipe ont \u00e9t\u00e9 d\u00e9terminants dans notre succ\u00e8s.',
              avatar: '',
              logo: ''
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundColor: '#fafafa',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
        
      // === CAROUSEL/SLIDER ===
      {
        id: 'testimonials-carousel',
        name: 'Carousel',
        preview: 'carousel',
        defaultContent: {
          layout: 'carousel',
          title: 'Ce que disent nos clients',
          autoplay: true,
          autoplaySpeed: 5000,
          showArrows: true,
          showDots: true,
          items: [
            { 
              name: 'Alice Dupont', 
              role: 'Product Manager',
              company: 'InnoTech',
              text: 'Un partenaire de confiance. Leur r\u00e9activit\u00e9 et leur expertise technique sont impressionnantes.',
              avatar: '',
              rating: 5
            },
            { 
              name: 'Marc Bernard', 
              role: 'CTO',
              company: 'DataFlow',
              text: 'La meilleure d\u00e9cision que nous ayons prise. R\u00e9sultats concrets et mesurables.',
              avatar: '',
              rating: 5
            },
            { 
              name: 'Claire Petit', 
              role: 'Fondatrice',
              company: 'EcoStart',
              text: 'Une \u00e9quipe passionn\u00e9e qui comprend vraiment les enjeux business.',
              avatar: '',
              rating: 5
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '800px',
          backgroundColor: '#0f172a',
          textColor: '#f8fafc',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
        
      // === MUR DE T\u00c9MOIGNAGES (Masonry) ===
      {
        id: 'testimonials-wall',
        name: 'Mur Social',
        preview: 'wall',
        defaultContent: {
          layout: 'wall',
          title: 'La voix de nos clients',
          columns: 3,
          items: [
            { name: 'Client 1', text: 'Excellent produit !', rating: 5 },
            { name: 'Client 2', text: 'Service client au top. R\u00e9ponse rapide et efficace.', rating: 5 },
            { name: 'Client 3', text: 'Je recommande les yeux ferm\u00e9s.', rating: 5 },
            { name: 'Client 4', text: 'Tr\u00e8s satisfait de mon achat. La qualit\u00e9 est l\u00e0.', rating: 4 },
            { name: 'Client 5', text: 'Livraison ultra rapide !', rating: 5 },
            { name: 'Client 6', text: 'Rapport qualit\u00e9-prix imbattable.', rating: 5 }
          ]
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
        
      // === AVEC LOGOS ENTREPRISES ===
      {
        id: 'testimonials-logos',
        name: 'Avec Logos',
        preview: 'logos',
        defaultContent: {
          layout: 'logos',
          title: 'Ils travaillent avec nous',
          showLogos: true,
          items: [
            { 
              name: 'Responsable Achats', 
              company: 'Grande Entreprise',
              text: 'Partenariat strat\u00e9gique qui a d\u00e9pass\u00e9 toutes nos attentes.',
              logo: ''
            },
            { 
              name: 'Directeur Digital', 
              company: 'Groupe M\u00e9dia',
              text: 'Une expertise rare et un accompagnement de qualit\u00e9.',
              logo: ''
            },
            { 
              name: 'CEO', 
              company: 'Startup Innovante',
              text: 'Le partenaire id\u00e9al pour acc\u00e9l\u00e9rer notre croissance.',
              logo: ''
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1100px',
          backgroundColor: '#fafafa',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
        
      // === AVEC VID\u00c9O ===
      {
        id: 'testimonials-video',
        name: 'T\u00e9moignage Vid\u00e9o',
        preview: 'video',
        defaultContent: {
          layout: 'video',
          title: 'T\u00e9moignage client',
          videoUrl: '',
          videoThumbnail: '',
          name: 'Client Satisfait',
          role: 'Directeur G\u00e9n\u00e9ral',
          company: 'Entreprise Partenaire',
          quote: 'D\u00e9couvrez pourquoi nous avons choisi cette solution...'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1000px',
          backgroundColor: '#0a0a0a',
          textColor: '#fafafa',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
        
      // === MINIMAL DARK ===
      {
        id: 'testimonials-minimal-dark',
        name: 'Minimal Dark',
        preview: 'minimal-dark',
        defaultContent: {
          layout: 'minimal',
          items: [
            { 
              name: 'Client V\u00e9rifi\u00e9', 
              text: 'Simple, efficace, indispensable.',
              rating: 5
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '700px',
          backgroundColor: '#0a0a0a',
          textColor: '#e5e5e5',
          backgroundType: 'color',
          verticalSpacing: 'medium',
          horizontalSpacing: 'medium'
        }
      },
        
      // === SPLIT AVEC IMAGE ===
      {
        id: 'testimonials-split',
        name: 'Split Image',
        preview: 'split',
        defaultContent: {
          layout: 'split',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600',
          imagePosition: 'left',
          name: 'Alexandre Martin',
          role: 'Directeur Commercial',
          company: 'Solutions Pro',
          text: 'Cette collaboration a transform\u00e9 notre approche client. Les r\u00e9sultats parlent d\'eux-m\u00eames : +45% de satisfaction client en 6 mois.',
          stats: [
            { value: '+45%', label: 'Satisfaction' },
            { value: '2x', label: 'Conversions' }
          ]
        },
        defaultStyle: {
          alignment: 'left',
          maxWidth: '1200px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
        
      // === AVEC NOTATION ===
      {
        id: 'testimonials-rating',
        name: 'Avec Notation',
        preview: 'rating',
        defaultContent: {
          layout: 'rating',
          title: 'Avis v\u00e9rifi\u00e9s',
          averageRating: 4.9,
          totalReviews: 2847,
          items: [
            { name: 'Julie R.', text: 'Parfait ! Exactement ce qu\'il me fallait.', rating: 5, date: '2024-01-15' },
            { name: 'Pierre M.', text: 'Tr\u00e8s bonne qualit\u00e9, je recommande.', rating: 5, date: '2024-01-10' },
            { name: 'Marie L.', text: 'Service client r\u00e9actif et produit conforme.', rating: 4, date: '2024-01-08' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
        
      // === TWITTER/SOCIAL STYLE ===
      {
        id: 'testimonials-tweets',
        name: 'Style Twitter',
        preview: 'tweets',
        defaultContent: {
          layout: 'tweets',
          title: 'Ce qu\'ils disent sur les r\u00e9seaux',
          items: [
            { 
              name: 'Sarah Tech', 
              username: '@sarahtech',
              text: 'Enfin un service qui tient ses promesses ! Impressionn\u00e9e par la qualit\u00e9.',
              avatar: '',
              platform: 'twitter'
            },
            { 
              name: 'Marc Digital', 
              username: '@marcdigital',
              text: 'Apr\u00e8s 6 mois d\'utilisation, je ne peux plus m\'en passer. Bravo !',
              avatar: '',
              platform: 'twitter'
            },
            { 
              name: 'Emma Business', 
              username: '@emmabiz',
              text: 'ROI positif d\u00e8s le premier mois. Merci \u00e0 toute l\'\u00e9quipe !',
              avatar: '',
              platform: 'twitter'
            }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1100px',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
        
      // === AVATAR GRID ===
      {
        id: 'testimonials-avatars',
        name: 'Grille Avatars',
        preview: 'avatars',
        defaultContent: {
          layout: 'avatars',
          title: 'Rejoignez plus de 10 000 clients satisfaits',
          subtitle: 'Des professionnels comme vous nous font confiance',
          avatarCount: 12,
          items: [
            { name: 'A. Martin', avatar: '' },
            { name: 'S. Dubois', avatar: '' },
            { name: 'L. Bernard', avatar: '' },
            { name: 'M. Petit', avatar: '' },
            { name: 'C. Leroy', avatar: '' },
            { name: 'P. Moreau', avatar: '' }
          ],
          cta: {
            text: 'Voir tous les avis',
            url: '#'
          }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundColor: '#0f172a',
          textColor: '#f8fafc',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
        
      // === FEATURED SINGLE ===
      {
        id: 'testimonials-featured',
        name: 'T\u00e9moignage Vedette',
        preview: 'featured',
        defaultContent: {
          layout: 'featured',
          badge: 'T\u00c9MOIGNAGE DU MOIS',
          name: 'Nicolas Fontaine',
          role: 'CEO & Fondateur',
          company: 'NextGen Solutions',
          text: 'Ce partenariat a litt\u00e9ralement transform\u00e9 notre entreprise. En 12 mois, nous avons tripl\u00e9 notre chiffre d\'affaires gr\u00e2ce \u00e0 leur accompagnement strat\u00e9gique et leur expertise technique.',
          image: '',
          metrics: [
            { value: '3x', label: 'Croissance CA' },
            { value: '150%', label: 'ROI' },
            { value: '12', label: 'Mois' }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1000px',
          backgroundType: 'gradient',
          backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          textColor: '#ffffff',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
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
