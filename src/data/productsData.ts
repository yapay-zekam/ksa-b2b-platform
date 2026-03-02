export type BadgeType = 'NEW' | 'SALE' | 'BEST SELLER' | 'LIMITED' | null;

export interface Supplier {
  name: string;
  logo: string;
  color: string;
}

export interface SupplierOffer {
  id: string;
  name: string;
  logo: string;
  color: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  deliveryDays: string;
  stock: number;
  minOrder: number;
  isBestPrice?: boolean;
  isVerified?: boolean;
}

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  available: boolean;
}

export interface NutritionRow {
  label: string;
  per100g: string;
  perServing: string;
}

export interface ProductDetail {
  id: string;
  title: string;
  brand: string;
  category: string;
  badge: BadgeType;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number | null;
  unit: string;
  sku: string;
  barcode: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  supplierOffers: SupplierOffer[];
  nutritionInfo: NutritionRow[];
  certifications: string[];
  countryOfOrigin: string;
  shelfLife: string;
  storageConditions: string;
  allergens: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number | null;
  badge: BadgeType;
  suppliers: Supplier[];
  brand: string;
  unit: string;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
  count: number;
}

const SUPPLIERS = {
  miyad:   { name: 'Miyad International Food Company', logo: 'MI', color: '#3D005E' },
  tamimi:  { name: 'Tamimi Markets',                   logo: 'TM', color: '#C8102E' },
  jazira:  { name: 'Al Jazira Supermarkets',           logo: 'AJ', color: '#006E33' },
  almarai: { name: 'Almarai Co.',                      logo: 'AM', color: '#00873E' },
  puck:    { name: 'Puck Arabia',                      logo: 'PK', color: '#E8A000' },
  sadafco: { name: 'Sadafco',                          logo: 'SD', color: '#003087' },
  nada:    { name: 'Nada Dairy',                       logo: 'ND', color: '#EE3124' },
  saudia:  { name: 'Saudia Foods',                     logo: 'SF', color: '#006400' },
};

/* ─── Master Product List (catalog cards) ─── */
export const products: Product[] = [
  {
    id: '1',
    title: 'Almarai Fresh Full Fat Milk – 2L',
    category: 'Dairy',
    image: '/product-images/milk-2.png',
    rating: 4.8,
    reviewCount: 2341,
    price: 10.0,
    originalPrice: 12.5,
    badge: 'BEST SELLER',
    suppliers: [SUPPLIERS.almarai, SUPPLIERS.tamimi, SUPPLIERS.jazira, SUPPLIERS.sadafco, SUPPLIERS.miyad],
    brand: 'Almarai',
    unit: '2L Carton',
  },
  {
    id: '2',
    title: 'Rana Frozen Chicken Whole – 1.5kg',
    category: 'Poultry',
    image: '/product-images/whole-chicken.png',
    rating: 4.5,
    reviewCount: 987,
    price: 26.75,
    originalPrice: 31.0,
    badge: 'SALE',
    suppliers: [SUPPLIERS.miyad, SUPPLIERS.jazira, SUPPLIERS.tamimi],
    brand: 'Rana',
    unit: '1.5 kg',
  },
  {
    id: '3',
    title: 'Puck Cream Cheese Spreadable – 500g',
    category: 'Dairy',
    image: '/product-images/puck-cream-cheese.png',
    rating: 4.7,
    reviewCount: 1523,
    price: 18.5,
    originalPrice: 22.0,
    badge: 'NEW',
    suppliers: [SUPPLIERS.puck, SUPPLIERS.tamimi, SUPPLIERS.almarai, SUPPLIERS.sadafco],
    brand: 'Puck',
    unit: '500 g',
  },
  {
    id: '4',
    title: 'Aqua Panna Still Mineral Water – 12×500ml',
    category: 'Beverages',
    image: '/product-images/water-6.png',
    rating: 4.6,
    reviewCount: 743,
    price: 22.0,
    originalPrice: null,
    badge: null,
    suppliers: [SUPPLIERS.jazira, SUPPLIERS.tamimi],
    brand: 'Aqua Panna',
    unit: '12 × 500 ml',
  },
  {
    id: '5',
    title: 'Kiri Portion Cheese Squares – 200g',
    category: 'Dairy',
    image: '/product-images/cheese-200g.png',
    rating: 4.4,
    reviewCount: 612,
    price: 15.25,
    originalPrice: 18.0,
    badge: 'SALE',
    suppliers: [SUPPLIERS.miyad, SUPPLIERS.sadafco, SUPPLIERS.nada, SUPPLIERS.jazira, SUPPLIERS.puck],
    brand: 'Kiri',
    unit: '200 g Pack',
  },
  {
    id: '6',
    title: 'Red Apple Fresh Premium Grade A – 1kg',
    category: 'Fruits',
    image: '/product-images/apple.png',
    rating: 4.3,
    reviewCount: 418,
    price: 8.5,
    originalPrice: null,
    badge: 'NEW',
    suppliers: [SUPPLIERS.jazira, SUPPLIERS.tamimi, SUPPLIERS.miyad],
    brand: 'Fresh Farms',
    unit: '1 kg',
  },
  {
    id: '7',
    title: 'Nada Long Life UHT Full Fat Milk – 1L × 12',
    category: 'Dairy',
    image: '/product-images/milk-nada.png',
    rating: 4.9,
    reviewCount: 3102,
    price: 45.0,
    originalPrice: 55.0,
    badge: 'BEST SELLER',
    suppliers: [SUPPLIERS.nada, SUPPLIERS.almarai, SUPPLIERS.tamimi, SUPPLIERS.sadafco],
    brand: 'Nada',
    unit: '12 × 1L',
  },
  {
    id: '8',
    title: 'Barakat Frozen Mixed Vegetables – 2.5kg',
    category: 'Frozen',
    image: '/product-images/frozen-vegtables.png',
    rating: 4.2,
    reviewCount: 289,
    price: 19.99,
    originalPrice: 24.5,
    badge: null,
    suppliers: [SUPPLIERS.miyad, SUPPLIERS.jazira],
    brand: 'Barakat',
    unit: '2.5 kg Bag',
  },
  {
    id: '9',
    title: 'Saudia Long Life Juice Orange – 1L × 6',
    category: 'Beverages',
    image: '/product-images/orange-juice.png',
    rating: 4.5,
    reviewCount: 876,
    price: 28.0,
    originalPrice: 33.0,
    badge: 'SALE',
    suppliers: [SUPPLIERS.saudia, SUPPLIERS.tamimi, SUPPLIERS.jazira, SUPPLIERS.almarai],
    brand: 'Saudia',
    unit: '6 × 1L',
  },
  {
    id: '10',
    title: 'Puck Natural Mozzarella Cheese Slices – 400g',
    category: 'Dairy',
    image: '/product-images/puck-mozzarella.png',
    rating: 4.6,
    reviewCount: 1240,
    price: 21.5,
    originalPrice: 26.0,
    badge: 'LIMITED',
    suppliers: [SUPPLIERS.puck, SUPPLIERS.miyad, SUPPLIERS.sadafco],
    brand: 'Puck',
    unit: '400 g Pack',
  },
  {
    id: '11',
    title: 'Saha Selenium Eggs AA Grade – 15 Pieces',
    category: 'Eggs',
    image: '/product-images/product-11.png',
    rating: 4.1,
    reviewCount: 543,
    price: 52.0,
    originalPrice: 62.0,
    badge: 'NEW',
    suppliers: [SUPPLIERS.sadafco, SUPPLIERS.tamimi, SUPPLIERS.jazira, SUPPLIERS.miyad, SUPPLIERS.nada],
    brand: 'Saha',
    unit: '15 Pieces',
  },
  {
    id: '12',
    title: 'Barilla Pipetta Pasta – 500g',
    category: 'Pasta',
    image: '/product-images/pasta-9.png',
    rating: 4.0,
    reviewCount: 198,
    price: 12.75,
    originalPrice: null,
    badge: null,
    suppliers: [SUPPLIERS.jazira, SUPPLIERS.miyad, SUPPLIERS.tamimi],
    brand: 'Pasta',
    unit: '500 g',
  },
  {
    id: '13',
    title: 'Seama Premium Seafood – 100g',
    category: 'Seafood',
    image: '/product-images/fish.png',
    rating: 4.0,
    reviewCount: 198,
    price: 10.75,
    originalPrice: null,
    badge: null,
    suppliers: [SUPPLIERS.jazira, SUPPLIERS.miyad, SUPPLIERS.tamimi, SUPPLIERS.almarai],
    brand: 'Seama',
    unit: '100 g',
  },
];

/* ─── Full Product Detail records ─── */
export const productDetails: Record<string, ProductDetail> = {
  '1': {
    id: '1',
    title: 'Almarai Fresh Full Fat Milk',
    brand: 'Almarai',
    category: 'Dairy',
    badge: 'BEST SELLER',
    rating: 4.8,
    reviewCount: 2341,
    price: 10.0,
    originalPrice: 12.5,
    unit: '2L Carton',
    sku: 'ALM-FFM-2L',
    barcode: '6281037021030',
    description:
      'Almarai Full Fat 100% Fresh Dairy Milk is a rich source of protein that energizes the body and supports bone health. Prepared without preservatives and artificial milk powder. Enjoy the pure, fresh taste of nature in every glass. Ideal for cafes, restaurants, and food service operations requiring premium-grade fresh milk.',
    images: [
      '/product-images/milk-2.png',
      '/product-images/milk-2.png',
      '/product-images/milk-2.png',
      '/product-images/milk-2.png',
    ],
    variants: [
      { id: 'v1', label: '500 ml', price: 3.5,  available: true  },
      { id: 'v2', label: '1 L',    price: 6.25, available: true  },
      { id: 'v3', label: '2 L',    price: 10.0, available: true  },
      { id: 'v4', label: '4 L',    price: 18.5, available: false },
    ],
    supplierOffers: [
      {
        id: 'so1',
        name: 'Miyad International Food Company',
        logo: 'MI',
        color: '#3D005E',
        rating: 4.9,
        reviewCount: 1204,
        price: 10.0,
        originalPrice: 12.5,
        deliveryDays: '1–2 Days',
        stock: 2400,
        minOrder: 12,
        isBestPrice: true,
        isVerified: true,
      },
      {
        id: 'so2',
        name: 'Tamimi Markets',
        logo: 'TM',
        color: '#C8102E',
        rating: 4.7,
        reviewCount: 892,
        price: 10.75,
        deliveryDays: '2–3 Days',
        stock: 860,
        minOrder: 6,
        isVerified: true,
      },
      {
        id: 'so3',
        name: 'Al Jazira Supermarkets',
        logo: 'AJ',
        color: '#006E33',
        rating: 4.5,
        reviewCount: 541,
        price: 11.0,
        deliveryDays: '3–4 Days',
        stock: 320,
        minOrder: 12,
        isVerified: false,
      },
      {
        id: 'so4',
        name: 'Sadafco',
        logo: 'SD',
        color: '#003087',
        rating: 4.6,
        reviewCount: 310,
        price: 12.0,
        originalPrice: 13.5,
        deliveryDays: '2–4 Days',
        stock: 1200,
        minOrder: 24,
        isVerified: true,
      },
    ],
    nutritionInfo: [
      { label: 'Energy',          per100g: '63 kcal',  perServing: '126 kcal' },
      { label: 'Total Fat',       per100g: '3.50 g',   perServing: '7.00 g'   },
      { label: 'Saturated Fat',   per100g: '2.20 g',   perServing: '4.40 g'   },
      { label: 'Trans Fat',       per100g: '0 g',      perServing: '0 g'      },
      { label: 'Cholesterol',     per100g: '13 mg',    perServing: '26 mg'    },
      { label: 'Sodium',          per100g: '44 mg',    perServing: '88 mg'    },
      { label: 'Total Carbs',     per100g: '4.80 g',   perServing: '9.60 g'   },
      { label: 'Sugars',          per100g: '4.80 g',   perServing: '9.60 g'   },
      { label: 'Protein',         per100g: '3.20 g',   perServing: '6.40 g'   },
      { label: 'Vitamin A',       per100g: '28.00%',   perServing: '56.00%'   },
      { label: 'Vitamin D',       per100g: '21.00%',   perServing: '42.00%'   },
      { label: 'Calcium',         per100g: '29.00%',   perServing: '58.00%'   },
    ],
    certifications: ['SFDA Approved', 'Halal Certified', 'ISO 22000', 'HACCP'],
    countryOfOrigin: 'Saudi Arabia',
    shelfLife: '10 days from production date',
    storageConditions: 'Store at 2–4°C. Once opened, consume within 24 hours.',
    allergens: 'Contains Milk.',
  },
};

/* Helper — get detail or build one from the short product */
export function getProductDetail(id: string): ProductDetail | null {
  if (productDetails[id]) return productDetails[id];
  const p = products.find((x) => x.id === id);
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    brand: p.brand,
    category: p.category,
    badge: p.badge,
    rating: p.rating,
    reviewCount: p.reviewCount,
    price: p.price,
    originalPrice: p.originalPrice,
    unit: p.unit,
    sku: `SKU-${p.id.padStart(4, '0')}`,
    barcode: `628${p.id.padStart(10, '0')}`,
    description: `Premium quality ${p.title} sourced from verified Saudi and international suppliers. Ideal for cafes, restaurants, and food-service businesses looking for consistent quality at competitive B2B pricing.`,
    images: [
      p.image,
      '/product-images/whole-chicken-5.png',
      '/product-images/whole-chicken-2.png',
      '/product-images/whole-chicken-3.png',
    ],
    variants: [
      { id: 'v1', label: p.unit,      price: p.price,               available: true  },
      { id: 'v2', label: 'Pack × 6',  price: p.price * 5.5,         available: true  },
      { id: 'v3', label: 'Case × 12', price: p.price * 10.5,        available: true  },
      { id: 'v4', label: 'Pallet',    price: p.price * 120,         available: false },
    ],
    supplierOffers: p.suppliers.map((s, i) => ({
      id: `so${i + 1}`,
      name: s.name,
      logo: s.logo,
      color: s.color,
      rating: parseFloat((4.3 + Math.random() * 0.6).toFixed(1)),
      reviewCount: 200 + Math.floor(Math.random() * 800),
      price: parseFloat((p.price + i * 0.75).toFixed(2)),
      originalPrice: i === 0 && p.originalPrice ? p.originalPrice : undefined,
      deliveryDays: ['1–2 Days', '2–3 Days', '3–4 Days', '4–5 Days'][Math.min(i, 3)],
      stock: [2400, 860, 320, 1200, 540][Math.min(i, 4)],
      minOrder: [12, 6, 12, 24, 6][Math.min(i, 4)],
      isBestPrice: i === 0,
      isVerified: i < 3,
    })),
    nutritionInfo: [
      { label: 'Energy',        per100g: '250 kcal', perServing: '375 kcal' },
      { label: 'Total Fat',     per100g: '10.0 g',   perServing: '15.0 g'   },
      { label: 'Saturated Fat', per100g: '4.5 g',    perServing: '6.8 g'    },
      { label: 'Sodium',        per100g: '380 mg',   perServing: '570 mg'   },
      { label: 'Total Carbs',   per100g: '30.0 g',   perServing: '45.0 g'   },
      { label: 'Protein',       per100g: '8.0 g',    perServing: '12.0 g'   },
    ],
    certifications: ['SFDA Approved', 'Halal Certified'],
    countryOfOrigin: 'Saudi Arabia',
    shelfLife: '12 months from production date',
    storageConditions: 'Store in a cool, dry place below 25°C.',
    allergens: 'May contain traces of dairy, soy, or gluten.',
  };
}

export const categories: Category[] = [
  { id: 'all',        label: 'All',           emoji: '🛒', count: 1240 },
  { id: 'dairy',      label: 'Dairy',         emoji: '🥛', count: 312  },
  { id: 'poultry',    label: 'Poultry',       emoji: '🍗', count: 198  },
  { id: 'meat',       label: 'Meat',          emoji: '🥩', count: 145  },
  { id: 'seafood',    label: 'Seafood',       emoji: '🐟', count: 87   },
  { id: 'beverages',  label: 'Beverages',     emoji: '🧃', count: 204  },
  { id: 'frozen',     label: 'Frozen',        emoji: '🧊', count: 163  },
  { id: 'fruits',     label: 'Fruits',        emoji: '🍎', count: 92   },
  { id: 'vegetables', label: 'Vegetables',    emoji: '🥦', count: 118  },
  { id: 'bakery',     label: 'Bakery',        emoji: '🍞', count: 76   },
  { id: 'spices',     label: 'Spices',        emoji: '🌶️', count: 134 },
  { id: 'oils',       label: 'Oils & Fats',   emoji: '🫒', count: 89   },
  { id: 'grains',     label: 'Grains & Rice', emoji: '🌾', count: 67   },
  { id: 'snacks',     label: 'Snacks',        emoji: '🍪', count: 211  },
  { id: 'cleaning',   label: 'Cleaning',      emoji: '🧹', count: 55   },
  { id: 'packaging',  label: 'Packaging',     emoji: '📦', count: 43   },
];
