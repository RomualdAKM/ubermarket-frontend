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
      // === OFFRE UNIQUE ===
      {
        id: 'pricing-single',
        name: 'Offre Unique',
        preview: 'single',
        defaultContent: {
          layout: 'single',
          badge: 'OFFRE SPÉCIALE',
          title: 'Formule Tout Inclus',
          price: '49',
          currency: '€',
          period: '/mois',
          description: 'Tout ce dont vous avez besoin pour réussir',
          features: [
            'Accès complet à la plateforme',
            'Support prioritaire 24/7',
            'Mises à jour automatiques',
            'Stockage illimité',
            'Exports illimités'
          ],
          button: { text: 'Commencer maintenant', url: '#' },
          guarantee: 'Satisfait ou remboursé 30 jours'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '450px',
          backgroundColor: '#ffffff',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === TROIS FORMULES (CLASSIQUE) ===
      {
        id: 'pricing-three-tiers',
        name: 'Trois Formules',
        preview: 'three-tiers',
        defaultContent: {
          layout: 'tiers',
          title: 'Choisissez votre formule',
          subtitle: 'Sans engagement, annulez à tout moment',
          showToggle: false,
          plans: [
            {
              name: 'Starter',
              description: 'Pour démarrer',
              price: '19',
              currency: '€',
              period: '/mois',
              features: [
                { text: '1 utilisateur', included: true },
                { text: '5 projets', included: true },
                { text: 'Support email', included: true },
                { text: 'Fonctions avancées', included: false },
                { text: 'API Access', included: false }
              ],
              highlighted: false,
              button: { text: 'Démarrer', url: '#', style: 'outline' }
            },
            {
              name: 'Pro',
              description: 'Le plus populaire',
              price: '49',
              currency: '€',
              period: '/mois',
              features: [
                { text: '5 utilisateurs', included: true },
                { text: 'Projets illimités', included: true },
                { text: 'Support prioritaire', included: true },
                { text: 'Fonctions avancées', included: true },
                { text: 'API Access', included: true }
              ],
              highlighted: true,
              badge: 'POPULAIRE',
              button: { text: 'Choisir Pro', url: '#', style: 'primary' }
            },
            {
              name: 'Enterprise',
              description: 'Pour les grandes équipes',
              price: '149',
              currency: '€',
              period: '/mois',
              features: [
                { text: 'Utilisateurs illimités', included: true },
                { text: 'Projets illimités', included: true },
                { text: 'Support dédié 24/7', included: true },
                { text: 'Fonctions avancées', included: true },
                { text: 'API + Webhooks', included: true }
              ],
              highlighted: false,
              button: { text: 'Contacter', url: '#', style: 'outline' }
            }
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
      
      // === DEUX COLONNES ===
      {
        id: 'pricing-two-columns',
        name: 'Deux Colonnes',
        preview: 'two-columns',
        defaultContent: {
          layout: 'two-columns',
          title: 'Simple et transparent',
          subtitle: 'Pas de frais cachés',
          plans: [
            {
              name: 'Gratuit',
              description: 'Pour tester',
              price: '0',
              currency: '€',
              period: '',
              features: ['1 projet', 'Fonctions de base', 'Support communauté'],
              button: { text: 'Commencer gratuit', url: '#', style: 'outline' }
            },
            {
              name: 'Premium',
              description: 'Pour grandir',
              price: '29',
              currency: '€',
              period: '/mois',
              features: ['Projets illimités', 'Toutes les fonctions', 'Support prioritaire', 'Export PDF'],
              highlighted: true,
              badge: 'RECOMMANDÉ',
              button: { text: 'Passer Premium', url: '#', style: 'primary' }
            }
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
      
      // === TABLEAU COMPARATIF ===
      {
        id: 'pricing-table',
        name: 'Tableau Comparatif',
        preview: 'table',
        defaultContent: {
          layout: 'table',
          title: 'Comparez nos offres',
          subtitle: 'Trouvez la formule adaptée à vos besoins',
          features: [
            { name: 'Utilisateurs', starter: '1', pro: '10', enterprise: 'Illimité' },
            { name: 'Stockage', starter: '5 GB', pro: '100 GB', enterprise: 'Illimité' },
            { name: 'Projets', starter: '3', pro: '50', enterprise: 'Illimité' },
            { name: 'Support', starter: 'Email', pro: 'Prioritaire', enterprise: 'Dédié 24/7' },
            { name: 'API', starter: false, pro: true, enterprise: true },
            { name: 'SSO', starter: false, pro: false, enterprise: true }
          ],
          plans: [
            { name: 'Starter', price: '19', currency: '€', period: '/mois', button: { text: 'Choisir', url: '#' } },
            { name: 'Pro', price: '49', currency: '€', period: '/mois', highlighted: true, badge: 'POPULAIRE', button: { text: 'Choisir', url: '#' } },
            { name: 'Enterprise', price: '149', currency: '€', period: '/mois', button: { text: 'Contacter', url: '#' } }
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
      
      // === CARTES MINIMALISTES ===
      {
        id: 'pricing-minimal',
        name: 'Minimaliste',
        preview: 'minimal',
        defaultContent: {
          layout: 'minimal',
          title: 'Tarifs simples',
          plans: [
            { name: 'Basic', price: '9', currency: '€', period: '/mois', description: 'Essentiel', button: { text: 'Choisir', url: '#' } },
            { name: 'Pro', price: '29', currency: '€', period: '/mois', description: 'Avancé', highlighted: true, button: { text: 'Choisir', url: '#' } },
            { name: 'Team', price: '79', currency: '€', period: '/mois', description: 'Équipe', button: { text: 'Choisir', url: '#' } }
          ]
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1000px',
          backgroundColor: '#fafafa',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === AVEC TOGGLE MENSUEL/ANNUEL ===
      {
        id: 'pricing-toggle',
        name: 'Avec Toggle',
        preview: 'toggle',
        defaultContent: {
          layout: 'toggle',
          title: 'Tarifs flexibles',
          subtitle: 'Économisez 20% avec le paiement annuel',
          showToggle: true,
          billingPeriod: 'monthly',
          discount: 20,
          plans: [
            {
              name: 'Starter',
              monthlyPrice: '19',
              yearlyPrice: '182',
              currency: '€',
              features: ['5 projets', 'Support email', '10 GB stockage'],
              button: { text: 'Démarrer', url: '#' }
            },
            {
              name: 'Business',
              monthlyPrice: '49',
              yearlyPrice: '470',
              currency: '€',
              features: ['Projets illimités', 'Support prioritaire', '100 GB stockage', 'API Access'],
              highlighted: true,
              badge: 'MEILLEURE OFFRE',
              button: { text: 'Choisir', url: '#' }
            },
            {
              name: 'Enterprise',
              monthlyPrice: '99',
              yearlyPrice: '950',
              currency: '€',
              features: ['Tout illimité', 'Support dédié', 'Stockage illimité', 'SSO & SAML'],
              button: { text: 'Contacter', url: '#' }
            }
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
      
      // === FOCUS POPULAIRE ===
      {
        id: 'pricing-highlighted',
        name: 'Focus Populaire',
        preview: 'highlighted',
        defaultContent: {
          layout: 'highlighted',
          title: 'L\'offre préférée de nos clients',
          mainPlan: {
            name: 'Pro',
            badge: 'BEST-SELLER',
            price: '49',
            currency: '€',
            period: '/mois',
            description: 'Parfait pour les professionnels et petites équipes',
            features: [
              'Projets illimités',
              'Jusqu\'à 10 utilisateurs',
              'Support prioritaire',
              'Toutes les intégrations',
              'Rapports avancés',
              'API complète'
            ],
            button: { text: 'Commencer l\'essai gratuit', url: '#' },
            guarantee: '14 jours d\'essai gratuit'
          },
          otherPlansText: 'Voir toutes les formules',
          otherPlansUrl: '#pricing'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '600px',
          backgroundColor: '#fafafa',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === GRADIENT MODERNE ===
      {
        id: 'pricing-gradient',
        name: 'Gradient Moderne',
        preview: 'gradient',
        defaultContent: {
          layout: 'gradient',
          title: 'Investissez dans votre croissance',
          subtitle: 'Des outils puissants à prix abordable',
          plans: [
            {
              name: 'Starter',
              price: '29',
              currency: '€',
              period: '/mois',
              features: ['Fonctions essentielles', '5 utilisateurs', 'Support standard'],
              button: { text: 'Démarrer', url: '#' }
            },
            {
              name: 'Scale',
              price: '79',
              currency: '€',
              period: '/mois',
              features: ['Toutes les fonctions', '25 utilisateurs', 'Support prioritaire', 'Analytics avancés'],
              highlighted: true,
              button: { text: 'Choisir Scale', url: '#' }
            }
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
      },
      
      // === DARK MODE ===
      {
        id: 'pricing-dark',
        name: 'Dark Mode',
        preview: 'dark',
        defaultContent: {
          layout: 'dark',
          title: 'Plans & Pricing',
          subtitle: 'Start free, upgrade when ready',
          plans: [
            {
              name: 'Free',
              price: '0',
              currency: '€',
              period: '',
              features: ['1 project', 'Basic features', 'Community support'],
              button: { text: 'Get Started', url: '#' }
            },
            {
              name: 'Pro',
              price: '39',
              currency: '€',
              period: '/mo',
              features: ['Unlimited projects', 'All features', 'Priority support', 'API access'],
              highlighted: true,
              badge: 'POPULAR',
              button: { text: 'Go Pro', url: '#' }
            },
            {
              name: 'Team',
              price: '99',
              currency: '€',
              period: '/mo',
              features: ['Everything in Pro', 'Team collaboration', 'Admin dashboard', 'SSO'],
              button: { text: 'Contact Sales', url: '#' }
            }
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
      
      // === ENTERPRISE / B2B ===
      {
        id: 'pricing-enterprise',
        name: 'Enterprise',
        preview: 'enterprise',
        defaultContent: {
          layout: 'enterprise',
          badge: 'ENTREPRISE',
          title: 'Solution sur mesure',
          description: 'Pour les grandes organisations avec des besoins spécifiques',
          features: [
            'Déploiement dédié',
            'SLA garanti 99.99%',
            'Support dédié 24/7',
            'Intégrations personnalisées',
            'Formation équipe',
            'Audit de sécurité'
          ],
          contact: {
            title: 'Parlons de vos besoins',
            description: 'Notre équipe vous accompagne dans la mise en place',
            button: { text: 'Demander un devis', url: '#' },
            phone: '+33 1 23 45 67 89'
          },
          logos: [],
          logosTitle: 'Ils nous font confiance'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1000px',
          backgroundColor: '#fafafa',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === LIFETIME DEAL ===
      {
        id: 'pricing-lifetime',
        name: 'Lifetime Deal',
        preview: 'lifetime',
        defaultContent: {
          layout: 'lifetime',
          badge: 'OFFRE LIMITÉE',
          title: 'Accès à vie',
          subtitle: 'Payez une fois, utilisez pour toujours',
          originalPrice: '999',
          price: '299',
          currency: '€',
          discount: '70%',
          features: [
            'Accès à vie à toutes les fonctions',
            'Toutes les futures mises à jour',
            'Support prioritaire',
            'Pas de frais récurrents'
          ],
          button: { text: 'Obtenir l\'accès à vie', url: '#' },
          spotsLeft: 47,
          guarantee: 'Garantie satisfait ou remboursé 60 jours'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '550px',
          backgroundColor: '#fef3c7',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
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
      // === SIMPLE CENTRÉ ===
      {
        id: 'cta-simple',
        name: 'Simple',
        preview: 'simple',
        defaultContent: {
          layout: 'simple',
          title: 'Prêt à transformer votre activité ?',
          subtitle: 'Rejoignez des milliers d\'entreprises qui nous font confiance',
          button: { text: 'Commencer gratuitement', url: '#', style: 'primary' }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '700px',
          backgroundColor: '#171717',
          textColor: '#fafafa',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === GRADIENT MODERNE ===
      {
        id: 'cta-gradient',
        name: 'Gradient',
        preview: 'gradient',
        defaultContent: {
          layout: 'gradient',
          title: 'Propulsez votre croissance',
          subtitle: 'Des outils puissants pour des résultats exceptionnels',
          button: { text: 'Démarrer l\'essai gratuit', url: '#', style: 'white' },
          secondaryButton: { text: 'Voir la démo', url: '#', style: 'outline-white' }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '900px',
          backgroundType: 'gradient',
          backgroundGradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          textColor: '#ffffff',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === NEWSLETTER ===
      {
        id: 'cta-newsletter',
        name: 'Newsletter',
        preview: 'newsletter',
        defaultContent: {
          layout: 'newsletter',
          title: 'Restez informé',
          subtitle: 'Recevez nos conseils exclusifs et nos dernières actualités',
          placeholder: 'Entrez votre email',
          button: { text: 'S\'abonner', style: 'primary' },
          privacyText: 'En vous inscrivant, vous acceptez notre politique de confidentialité'
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '550px',
          backgroundColor: '#fafafa',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === BANDEAU PROMOTIONNEL ===
      {
        id: 'cta-banner',
        name: 'Bandeau Promo',
        preview: 'banner',
        defaultContent: {
          layout: 'banner',
          icon: 'gift',
          title: 'Offre de lancement',
          subtitle: '-30% sur votre première commande avec le code WELCOME30',
          button: { text: 'En profiter', url: '#', style: 'white' },
          dismissible: true
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '100%',
          backgroundColor: '#0a0a0a',
          textColor: '#fafafa',
          backgroundType: 'color',
          verticalSpacing: 'small',
          horizontalSpacing: 'medium'
        }
      },
      
      // === SPLIT AVEC IMAGE ===
      {
        id: 'cta-split-image',
        name: 'Split Image',
        preview: 'split-image',
        defaultContent: {
          layout: 'split',
          title: 'Découvrez notre solution',
          subtitle: 'Une plateforme complète pour gérer votre activité de A à Z. Simplifiez vos processus et gagnez du temps.',
          image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
          imagePosition: 'right',
          button: { text: 'Découvrir', url: '#', style: 'primary' },
          secondaryButton: { text: 'En savoir plus', url: '#', style: 'outline' },
          features: ['Facile à utiliser', 'Support 24/7', 'Sécurisé']
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
      
      // === AVEC COMPTE À REBOURS ===
      {
        id: 'cta-countdown',
        name: 'Compte à rebours',
        preview: 'countdown',
        defaultContent: {
          layout: 'countdown',
          badge: 'OFFRE LIMITÉE',
          title: 'Profitez de notre offre exclusive',
          subtitle: 'Cette promotion se termine bientôt',
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          button: { text: 'J\'en profite maintenant', url: '#', style: 'primary' }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '700px',
          backgroundColor: '#fef2f2',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === MINIMALISTE ===
      {
        id: 'cta-minimal',
        name: 'Minimaliste',
        preview: 'minimal',
        defaultContent: {
          layout: 'minimal',
          title: 'Commencez maintenant',
          button: { text: 'Démarrer →', url: '#', style: 'link' }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '500px',
          backgroundColor: 'transparent',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'medium',
          horizontalSpacing: 'medium'
        }
      },
      
      // === DEUX BOUTONS ===
      {
        id: 'cta-dual-buttons',
        name: 'Deux Actions',
        preview: 'dual-buttons',
        defaultContent: {
          layout: 'dual',
          title: 'Prêt à vous lancer ?',
          subtitle: 'Choisissez comment vous souhaitez démarrer',
          primaryButton: { text: 'Créer un compte', url: '#', style: 'primary' },
          secondaryButton: { text: 'Voir la démo', url: '#', style: 'outline' }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '600px',
          backgroundColor: '#f5f5f5',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === CARTE FLOTTANTE ===
      {
        id: 'cta-floating-card',
        name: 'Carte Flottante',
        preview: 'floating-card',
        defaultContent: {
          layout: 'card',
          icon: 'rocket',
          title: 'Lancez-vous dès aujourd\'hui',
          subtitle: 'Pas de carte de crédit requise. Annulez à tout moment.',
          button: { text: 'Commencer gratuitement', url: '#', style: 'primary' },
          features: ['14 jours d\'essai gratuit', 'Pas d\'engagement', 'Support inclus']
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '500px',
          backgroundColor: '#f8fafc',
          textColor: '#171717',
          backgroundType: 'color',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === FULL IMAGE BACKGROUND ===
      {
        id: 'cta-image-bg',
        name: 'Image de Fond',
        preview: 'image-bg',
        defaultContent: {
          layout: 'image-bg',
          title: 'Rejoignez l\'aventure',
          subtitle: 'Des milliers de professionnels nous font déjà confiance',
          button: { text: 'Nous rejoindre', url: '#', style: 'white' }
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '100%',
          backgroundType: 'image',
          backgroundImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920',
          backgroundOverlay: 70,
          textColor: '#ffffff',
          verticalSpacing: 'large',
          horizontalSpacing: 'medium'
        }
      },
      
      // === AVEC SOCIAL PROOF ===
      {
        id: 'cta-social-proof',
        name: 'Social Proof',
        preview: 'social-proof',
        defaultContent: {
          layout: 'social-proof',
          title: 'Rejoignez notre communauté',
          subtitle: 'Des milliers d\'entreprises grandissent avec nous',
          stats: [
            { value: '10K+', label: 'Utilisateurs' },
            { value: '98%', label: 'Satisfaction' },
            { value: '24/7', label: 'Support' }
          ],
          button: { text: 'Rejoindre maintenant', url: '#', style: 'primary' },
          avatars: [],
          avatarsText: '+2,500 personnes cette semaine'
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
      
      // === APP DOWNLOAD ===
      {
        id: 'cta-app-download',
        name: 'Télécharger App',
        preview: 'app-download',
        defaultContent: {
          layout: 'app-download',
          title: 'Disponible sur mobile',
          subtitle: 'Téléchargez notre application et emportez vos projets partout',
          appStoreUrl: '#',
          playStoreUrl: '#',
          qrCode: '',
          mockupImage: ''
        },
        defaultStyle: {
          alignment: 'center',
          maxWidth: '1000px',
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
    type: 'text',
    name: 'Texte',
    icon: 'heroicons:document-text',
    description: 'Contenu textuel',
    templates: [
      {
        id: 'text-paragraph',
        name: 'Paragraphe',
        preview: 'paragraph',
        defaultContent: { layout: 'paragraph', content: 'Votre contenu textuel ici. Rédigez un paragraphe clair et engageant.' },
        defaultStyle: { alignment: 'left', maxWidth: '700px', backgroundColor: '#ffffff', textColor: '#404040', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'text-heading',
        name: 'Avec titre',
        preview: 'heading',
        defaultContent: { layout: 'heading', title: 'Titre de section', content: 'Développez votre message avec un contenu structuré.' },
        defaultStyle: { alignment: 'center', maxWidth: '800px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'text-quote',
        name: 'Citation',
        preview: 'quote',
        defaultContent: { layout: 'quote', content: 'Une citation inspirante qui résonne avec votre audience.', author: 'Auteur' },
        defaultStyle: { alignment: 'center', maxWidth: '600px', backgroundColor: '#fafafa', textColor: '#525252', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'text-two-columns',
        name: 'Deux colonnes',
        preview: 'columns',
        defaultContent: { layout: 'two-columns', title: 'Notre histoire', leftContent: 'Première partie du texte.', rightContent: 'Deuxième partie du texte.' },
        defaultStyle: { alignment: 'center', maxWidth: '1000px', backgroundColor: '#ffffff', textColor: '#404040', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'text-highlight',
        name: 'Mise en avant',
        preview: 'highlight',
        defaultContent: { layout: 'highlight', title: 'Information importante', content: 'Message clé pour vos visiteurs.', icon: 'info' },
        defaultStyle: { alignment: 'center', maxWidth: '700px', backgroundColor: '#eff6ff', textColor: '#1e40af', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'text-numbered-list',
        name: 'Liste numérotée',
        preview: 'numbered',
        defaultContent: { layout: 'numbered', title: 'Notre processus', items: [{ title: 'Étape 1', description: 'Description.' }, { title: 'Étape 2', description: 'Description.' }, { title: 'Étape 3', description: 'Description.' }] },
        defaultStyle: { alignment: 'left', maxWidth: '800px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'text-dropcap',
        name: 'Lettrine',
        preview: 'dropcap',
        defaultContent: { layout: 'dropcap', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.' },
        defaultStyle: { alignment: 'left', maxWidth: '700px', backgroundColor: '#ffffff', textColor: '#404040', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'text-pullquote',
        name: 'Citation en exergue',
        preview: 'pullquote',
        defaultContent: { layout: 'pullquote', content: 'Citation mise en valeur.', sideContent: 'Texte contextuel autour.' },
        defaultStyle: { alignment: 'center', maxWidth: '900px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'text-article',
        name: 'Style article',
        preview: 'article',
        defaultContent: { layout: 'article', category: 'ACTUALITÉS', title: 'Titre de l\'article', date: '15 janvier 2024', content: 'Contenu de l\'article.', author: 'Jean Dupont' },
        defaultStyle: { alignment: 'center', maxWidth: '750px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 80, bottom: 80 } }
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
        defaultContent: { layout: 'full', src: '', alt: 'Description de l\'image' },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: 'transparent', textColor: '#737373', padding: { top: 0, bottom: 0 } }
      },
      {
        id: 'image-contained',
        name: 'Contenue',
        preview: 'contained',
        defaultContent: { layout: 'contained', src: '', alt: 'Description de l\'image' },
        defaultStyle: { alignment: 'center', maxWidth: '800px', backgroundColor: 'transparent', textColor: '#737373', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'image-caption',
        name: 'Avec légende',
        preview: 'caption',
        defaultContent: { layout: 'caption', src: '', alt: 'Description', caption: 'Légende de l\'image' },
        defaultStyle: { alignment: 'center', maxWidth: '700px', backgroundColor: '#ffffff', textColor: '#525252', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'image-parallax',
        name: 'Parallax',
        preview: 'parallax',
        defaultContent: { layout: 'parallax', src: '', alt: 'Image parallax', height: 400, overlayText: '' },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: '#0a0a0a', textColor: '#ffffff', padding: { top: 0, bottom: 0 } }
      },
      {
        id: 'image-comparison',
        name: 'Avant/Après',
        preview: 'comparison',
        defaultContent: { layout: 'comparison', beforeImage: '', afterImage: '', beforeLabel: 'Avant', afterLabel: 'Après' },
        defaultStyle: { alignment: 'center', maxWidth: '800px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'image-split-text',
        name: 'Image + Texte',
        preview: 'split-text',
        defaultContent: { layout: 'split-text', src: '', alt: 'Image', title: 'Titre', content: 'Description.', imagePosition: 'left' },
        defaultStyle: { alignment: 'center', maxWidth: '1100px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'image-rounded',
        name: 'Arrondie',
        preview: 'rounded',
        defaultContent: { layout: 'rounded', src: '', alt: 'Image arrondie', borderRadius: 24 },
        defaultStyle: { alignment: 'center', maxWidth: '600px', backgroundColor: '#fafafa', textColor: '#525252', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'image-framed',
        name: 'Encadrée',
        preview: 'framed',
        defaultContent: { layout: 'framed', src: '', alt: 'Image encadrée', frameColor: '#262626', frameWidth: 8 },
        defaultStyle: { alignment: 'center', maxWidth: '700px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 60, bottom: 60 } }
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
        preview: 'grid',
        defaultContent: { layout: 'grid', images: [], columns: 3, gap: 16 },
        defaultStyle: { alignment: 'center', maxWidth: '1100px', backgroundColor: '#ffffff', textColor: '#404040', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'gallery-masonry',
        name: 'Masonry',
        preview: 'masonry',
        defaultContent: { layout: 'masonry', images: [], columns: 3 },
        defaultStyle: { alignment: 'center', maxWidth: '1200px', backgroundColor: '#fafafa', textColor: '#404040', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'gallery-carousel',
        name: 'Carousel',
        preview: 'carousel',
        defaultContent: { layout: 'carousel', images: [], autoplay: true, interval: 4000 },
        defaultStyle: { alignment: 'center', maxWidth: '1000px', backgroundColor: '#0a0a0a', textColor: '#ffffff', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'gallery-lightbox',
        name: 'Lightbox',
        preview: 'lightbox',
        defaultContent: { layout: 'lightbox', title: 'Notre galerie', images: [], columns: 4 },
        defaultStyle: { alignment: 'center', maxWidth: '1200px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'gallery-featured',
        name: 'Image vedette',
        preview: 'featured',
        defaultContent: { layout: 'featured', images: [], featuredIndex: 0 },
        defaultStyle: { alignment: 'center', maxWidth: '1100px', backgroundColor: '#ffffff', textColor: '#404040', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'gallery-justified',
        name: 'Justifiée',
        preview: 'justified',
        defaultContent: { layout: 'justified', images: [], rowHeight: 200 },
        defaultStyle: { alignment: 'center', maxWidth: '1200px', backgroundColor: '#f5f5f5', textColor: '#404040', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'gallery-hover',
        name: 'Infos au survol',
        preview: 'hover',
        defaultContent: { layout: 'hover', images: [], columns: 3 },
        defaultStyle: { alignment: 'center', maxWidth: '1100px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'gallery-filmstrip',
        name: 'Pellicule',
        preview: 'filmstrip',
        defaultContent: { layout: 'filmstrip', images: [], mainIndex: 0 },
        defaultStyle: { alignment: 'center', maxWidth: '900px', backgroundColor: '#171717', textColor: '#ffffff', padding: { top: 60, bottom: 60 } }
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
        defaultContent: { layout: 'centered', url: '', title: '' },
        defaultStyle: { alignment: 'center', maxWidth: '900px', backgroundColor: '#0a0a0a', textColor: '#ffffff', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'video-description',
        name: 'Avec description',
        preview: 'description',
        defaultContent: { layout: 'description', url: '', title: 'Titre de la vidéo', description: 'Description de la vidéo' },
        defaultStyle: { alignment: 'center', maxWidth: '800px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'video-hero',
        name: 'Hero vidéo',
        preview: 'hero',
        defaultContent: { layout: 'hero', url: '', title: 'Découvrez notre univers', subtitle: 'Une expérience unique', overlayOpacity: 40 },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: '#0a0a0a', textColor: '#ffffff', padding: { top: 0, bottom: 0 } }
      },
      {
        id: 'video-split',
        name: 'Vidéo + Texte',
        preview: 'split',
        defaultContent: { layout: 'split', url: '', title: 'Notre histoire', content: 'Découvrez notre parcours.', videoPosition: 'left' },
        defaultStyle: { alignment: 'center', maxWidth: '1100px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'video-modal',
        name: 'Bouton lecture',
        preview: 'modal',
        defaultContent: { layout: 'modal', url: '', thumbnail: '', title: 'Voir la vidéo', buttonText: 'Lire la vidéo' },
        defaultStyle: { alignment: 'center', maxWidth: '800px', backgroundColor: '#f5f5f5', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'video-grid',
        name: 'Grille vidéos',
        preview: 'grid',
        defaultContent: { layout: 'grid', title: 'Nos vidéos', videos: [{ url: '', title: 'Vidéo 1', thumbnail: '' }, { url: '', title: 'Vidéo 2', thumbnail: '' }, { url: '', title: 'Vidéo 3', thumbnail: '' }] },
        defaultStyle: { alignment: 'center', maxWidth: '1100px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 80, bottom: 80 } }
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
        defaultContent: { layout: 'accordion', title: 'Questions fréquentes', items: [{ question: 'Comment ça fonctionne ?', answer: 'Explication claire.' }, { question: 'Quels sont les délais ?', answer: 'Information sur les délais.' }, { question: 'Comment vous contacter ?', answer: 'Nos coordonnées.' }] },
        defaultStyle: { alignment: 'left', maxWidth: '800px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'faq-columns',
        name: 'Deux colonnes',
        preview: 'columns',
        defaultContent: { layout: 'columns', title: 'Besoin d\'aide ?', subtitle: 'Trouvez vos réponses', items: [{ question: 'Question 1 ?', answer: 'Réponse.' }, { question: 'Question 2 ?', answer: 'Réponse.' }, { question: 'Question 3 ?', answer: 'Réponse.' }, { question: 'Question 4 ?', answer: 'Réponse.' }] },
        defaultStyle: { alignment: 'center', maxWidth: '1000px', backgroundColor: '#fafafa', textColor: '#404040', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'faq-tabs',
        name: 'Onglets',
        preview: 'tabs',
        defaultContent: { layout: 'tabs', title: 'Centre d\'aide', categories: [{ name: 'Général', items: [{ question: 'Question 1 ?', answer: 'Réponse.' }] }, { name: 'Paiement', items: [{ question: 'Moyens de paiement ?', answer: 'CB, PayPal...' }] }] },
        defaultStyle: { alignment: 'center', maxWidth: '900px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'faq-search',
        name: 'Recherche',
        preview: 'search',
        defaultContent: { layout: 'search', title: 'Comment pouvons-nous vous aider ?', placeholder: 'Rechercher...', items: [{ question: 'Comment créer un compte ?', answer: 'Cliquez sur S\'inscrire.' }, { question: 'Comment modifier mon profil ?', answer: 'Accédez aux paramètres.' }] },
        defaultStyle: { alignment: 'center', maxWidth: '800px', backgroundColor: '#f5f5f5', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'faq-side',
        name: 'Côte à côte',
        preview: 'side',
        defaultContent: { layout: 'side', title: 'FAQ', subtitle: 'Tout ce que vous devez savoir', image: '', items: [{ question: 'Pourquoi nous choisir ?', answer: 'Notre expertise.' }, { question: 'Délai de réponse ?', answer: 'Sous 24h.' }] },
        defaultStyle: { alignment: 'center', maxWidth: '1100px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'faq-minimal',
        name: 'Minimal',
        preview: 'minimal',
        defaultContent: { layout: 'minimal', items: [{ question: 'Question ?', answer: 'Réponse.' }, { question: 'Autre question ?', answer: 'Autre réponse.' }] },
        defaultStyle: { alignment: 'left', maxWidth: '700px', backgroundColor: '#ffffff', textColor: '#404040', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'faq-cards',
        name: 'Cartes',
        preview: 'cards',
        defaultContent: { layout: 'cards', title: 'Questions fréquentes', items: [{ question: 'Livraison', answer: 'Livraison gratuite dès 50\u20ac.', icon: 'truck' }, { question: 'Retours', answer: 'Retours gratuits sous 30j.', icon: 'refresh' }, { question: 'Support', answer: 'Support 7j/7.', icon: 'headphones' }, { question: 'Sécurité', answer: 'Paiement 100% sécurisé.', icon: 'shield' }] },
        defaultStyle: { alignment: 'center', maxWidth: '1000px', backgroundColor: '#f5f5f5', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'faq-numbered',
        name: 'Numérotée',
        preview: 'numbered',
        defaultContent: { layout: 'numbered', title: 'Top 5 questions', items: [{ question: 'Comment commander ?', answer: 'Ajoutez au panier.' }, { question: 'Quels délais ?', answer: '2-5 jours.' }, { question: 'Modifier commande ?', answer: 'Oui, dans l\'heure.' }, { question: 'Suivi commande ?', answer: 'Via email.' }, { question: 'Retours ?', answer: 'Sous 30 jours.' }] },
        defaultStyle: { alignment: 'center', maxWidth: '800px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 80, bottom: 80 } }
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
        defaultContent: { layout: 'simple', title: 'Contactez-nous', email: 'contact@exemple.com', phone: '+33 1 23 45 67 89' },
        defaultStyle: { alignment: 'center', maxWidth: '500px', backgroundColor: '#ffffff', textColor: '#404040', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'contact-detailed',
        name: 'Détaillé',
        preview: 'detailed',
        defaultContent: { layout: 'detailed', title: 'Nous contacter', subtitle: 'Notre équipe est à votre disposition', email: 'contact@exemple.com', phone: '+33 1 23 45 67 89', address: '123 Rue Exemple, 75001 Paris', hours: 'Lun-Ven : 9h-18h' },
        defaultStyle: { alignment: 'center', maxWidth: '700px', backgroundColor: '#f5f5f5', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'contact-split',
        name: 'Deux colonnes',
        preview: 'split',
        defaultContent: { layout: 'split', title: 'Écrivez-nous', subtitle: 'Réponse sous 24h', email: 'contact@exemple.com', phone: '+33 1 23 45 67 89', address: 'Paris, France', image: '' },
        defaultStyle: { alignment: 'center', maxWidth: '1100px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'contact-cards',
        name: 'Cartes',
        preview: 'cards',
        defaultContent: { layout: 'cards', title: 'Comment nous joindre', cards: [{ icon: 'mail', title: 'Email', value: 'contact@exemple.com', description: 'Réponse sous 24h' }, { icon: 'phone', title: 'Téléphone', value: '+33 1 23 45 67 89', description: 'Lun-Ven 9h-18h' }, { icon: 'location', title: 'Adresse', value: 'Paris, France', description: 'Sur rendez-vous' }] },
        defaultStyle: { alignment: 'center', maxWidth: '1000px', backgroundColor: '#fafafa', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'contact-form',
        name: 'Avec formulaire',
        preview: 'form',
        defaultContent: { layout: 'form', title: 'Envoyez-nous un message', subtitle: 'Remplissez le formulaire', fields: ['name', 'email', 'subject', 'message'], buttonText: 'Envoyer', email: 'contact@exemple.com' },
        defaultStyle: { alignment: 'center', maxWidth: '600px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'contact-map',
        name: 'Avec carte',
        preview: 'map',
        defaultContent: { layout: 'map', title: 'Où nous trouver', address: '123 Rue Exemple, 75001 Paris', email: 'contact@exemple.com', phone: '+33 1 23 45 67 89', mapEmbed: '' },
        defaultStyle: { alignment: 'center', maxWidth: '1100px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'contact-minimal',
        name: 'Minimal',
        preview: 'minimal',
        defaultContent: { layout: 'minimal', email: 'hello@exemple.com' },
        defaultStyle: { alignment: 'center', maxWidth: '400px', backgroundColor: '#171717', textColor: '#ffffff', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'contact-social',
        name: 'Avec réseaux',
        preview: 'social',
        defaultContent: { layout: 'social', title: 'Restons en contact', email: 'contact@exemple.com', phone: '+33 1 23 45 67 89', socials: { facebook: '', instagram: '', twitter: '', linkedin: '' } },
        defaultStyle: { alignment: 'center', maxWidth: '600px', backgroundColor: '#f5f5f5', textColor: '#262626', padding: { top: 80, bottom: 80 } }
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
        defaultContent: { layout: 'urgent', title: 'Offre limitée', endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), subtitle: 'Ne manquez pas cette opportunité' },
        defaultStyle: { alignment: 'center', maxWidth: '600px', backgroundColor: '#dc2626', textColor: '#ffffff', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'countdown-elegant',
        name: 'Élégant',
        preview: 'elegant',
        defaultContent: { layout: 'elegant', title: 'Bientôt disponible', endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
        defaultStyle: { alignment: 'center', maxWidth: '500px', backgroundColor: '#171717', textColor: '#fafafa', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'countdown-launch',
        name: 'Lancement',
        preview: 'launch',
        defaultContent: { layout: 'launch', title: 'Lancement imminent', subtitle: 'Soyez prêt', endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), buttonText: 'Me notifier', buttonUrl: '#' },
        defaultStyle: { alignment: 'center', maxWidth: '700px', backgroundColor: '#0f172a', textColor: '#ffffff', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'countdown-event',
        name: 'Événement',
        preview: 'event',
        defaultContent: { layout: 'event', title: 'Save the date', eventName: 'Conférence annuelle', endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), location: 'Paris, France' },
        defaultStyle: { alignment: 'center', maxWidth: '800px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 80, bottom: 80 } }
      },
      {
        id: 'countdown-promo',
        name: 'Promo',
        preview: 'promo',
        defaultContent: { layout: 'promo', badge: '-50%', title: 'Soldes flash', endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), buttonText: 'Profiter maintenant', buttonUrl: '#' },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: '#7c3aed', textColor: '#ffffff', padding: { top: 30, bottom: 30 } }
      },
      {
        id: 'countdown-minimal',
        name: 'Minimal',
        preview: 'minimal',
        defaultContent: { layout: 'minimal', endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
        defaultStyle: { alignment: 'center', maxWidth: '400px', backgroundColor: 'transparent', textColor: '#262626', padding: { top: 40, bottom: 40 } }
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
        id: 'social-centered',
        name: 'Icônes centrées',
        preview: 'centered',
        defaultContent: { layout: 'centered', title: 'Suivez-nous', links: { facebook: '', instagram: '', twitter: '', youtube: '', linkedin: '' } },
        defaultStyle: { alignment: 'center', maxWidth: '400px', backgroundColor: '#ffffff', textColor: '#525252', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'social-footer',
        name: 'Style footer',
        preview: 'footer',
        defaultContent: { layout: 'footer', links: { facebook: '', instagram: '', twitter: '', linkedin: '' } },
        defaultStyle: { alignment: 'center', maxWidth: '300px', backgroundColor: '#171717', textColor: '#a3a3a3', padding: { top: 30, bottom: 30 } }
      },
      {
        id: 'social-colored',
        name: 'Couleurs marques',
        preview: 'colored',
        defaultContent: { layout: 'colored', title: 'Rejoignez notre communauté', links: { facebook: '', instagram: '', twitter: '', youtube: '', tiktok: '' } },
        defaultStyle: { alignment: 'center', maxWidth: '500px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'social-buttons',
        name: 'Boutons',
        preview: 'buttons',
        defaultContent: { layout: 'buttons', title: 'Retrouvez-nous sur', links: { facebook: '', instagram: '', twitter: '', linkedin: '' } },
        defaultStyle: { alignment: 'center', maxWidth: '600px', backgroundColor: '#f5f5f5', textColor: '#262626', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'social-stats',
        name: 'Avec stats',
        preview: 'stats',
        defaultContent: { layout: 'stats', title: 'Notre communauté', stats: [{ platform: 'instagram', followers: '50K', url: '' }, { platform: 'twitter', followers: '25K', url: '' }, { platform: 'youtube', followers: '100K', url: '' }] },
        defaultStyle: { alignment: 'center', maxWidth: '800px', backgroundColor: '#ffffff', textColor: '#262626', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'social-cta',
        name: 'Avec CTA',
        preview: 'cta',
        defaultContent: { layout: 'cta', title: 'Ne manquez rien', subtitle: 'Suivez-nous pour les actualités', links: { facebook: '', instagram: '', twitter: '' }, buttonText: 'S\'abonner', buttonUrl: '#' },
        defaultStyle: { alignment: 'center', maxWidth: '600px', backgroundColor: '#0a0a0a', textColor: '#ffffff', padding: { top: 80, bottom: 80 } }
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
        name: 'Petit (40px)',
        preview: 'small',
        defaultContent: { layout: 'small', height: 40 },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: 'transparent', textColor: 'transparent', padding: { top: 20, bottom: 20 } }
      },
      {
        id: 'spacer-medium',
        name: 'Moyen (80px)',
        preview: 'medium',
        defaultContent: { layout: 'medium', height: 80 },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: 'transparent', textColor: 'transparent', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'spacer-large',
        name: 'Grand (120px)',
        preview: 'large',
        defaultContent: { layout: 'large', height: 120 },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: 'transparent', textColor: 'transparent', padding: { top: 60, bottom: 60 } }
      },
      {
        id: 'spacer-responsive',
        name: 'Responsive',
        preview: 'responsive',
        defaultContent: { layout: 'responsive', desktopHeight: 100, mobileHeight: 50 },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: 'transparent', textColor: 'transparent', padding: { top: 0, bottom: 0 } }
      },
      {
        id: 'spacer-colored',
        name: 'Coloré',
        preview: 'colored',
        defaultContent: { layout: 'colored', height: 60 },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: '#f5f5f5', textColor: 'transparent', padding: { top: 30, bottom: 30 } }
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
        defaultContent: { layout: 'line', width: '100%', thickness: 1, color: '#e5e5e5' },
        defaultStyle: { alignment: 'center', maxWidth: '1200px', backgroundColor: 'transparent', textColor: 'transparent', padding: { top: 20, bottom: 20 } }
      },
      {
        id: 'divider-short',
        name: 'Courte centrée',
        preview: 'short',
        defaultContent: { layout: 'short', width: '80px', thickness: 3, color: '#171717' },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: 'transparent', textColor: 'transparent', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'divider-gradient',
        name: 'Dégradé',
        preview: 'gradient',
        defaultContent: { layout: 'gradient', width: '60%', gradientFrom: '#3b82f6', gradientTo: '#8b5cf6' },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: 'transparent', textColor: 'transparent', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'divider-dots',
        name: 'Points',
        preview: 'dots',
        defaultContent: { layout: 'dots', count: 3, color: '#262626' },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: 'transparent', textColor: 'transparent', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'divider-icon',
        name: 'Avec icône',
        preview: 'icon',
        defaultContent: { layout: 'icon', icon: 'star', lineColor: '#e5e5e5', iconColor: '#262626' },
        defaultStyle: { alignment: 'center', maxWidth: '600px', backgroundColor: 'transparent', textColor: 'transparent', padding: { top: 40, bottom: 40 } }
      },
      {
        id: 'divider-wave',
        name: 'Vague',
        preview: 'wave',
        defaultContent: { layout: 'wave', color: '#f5f5f5', flip: false },
        defaultStyle: { alignment: 'center', maxWidth: '100%', backgroundColor: 'transparent', textColor: 'transparent', padding: { top: 0, bottom: 0 } }
      },
      {
        id: 'divider-dashed',
        name: 'Pointillés',
        preview: 'dashed',
        defaultContent: { layout: 'dashed', width: '100%', color: '#d4d4d4' },
        defaultStyle: { alignment: 'center', maxWidth: '800px', backgroundColor: 'transparent', textColor: 'transparent', padding: { top: 30, bottom: 30 } }
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
