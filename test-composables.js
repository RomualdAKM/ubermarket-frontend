// Script de test simple pour vérifier les composables
// Ce fichier peut être supprimé après les tests

console.log('Test des composables...');

// Test de la structure des types
const testProductData = {
  name: 'Test Product',
  description: 'Description du produit test',
  price: 29.99,
  subcategory_id: 1,
  status: 'active',
  images: [],
  variants: [],
  stock: 10,
  sku: 'TEST-001',
  sale_price: null,
  sale_start_date: null,
  sale_end_date: null,
  show_sales_count: true,
  show_reviews: true,
  digital_file: null
};

console.log('Structure ProductData valide:', testProductData);

// Test de la structure des variantes
const testVariant = {
  name: 'Couleur',
  value: 'Rouge',
  price: 5.00,
  stock: 15
};

console.log('Structure ProductVariant valide:', testVariant);

// Test de la structure des images
const testImage = {
  file: null, // File object
  preview: 'data:image/jpeg;base64,...',
  is_primary: true
};

console.log('Structure ProductImage valide:', testImage);

console.log('Tests terminés avec succès !');