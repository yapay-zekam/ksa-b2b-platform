export interface CatalogProduct {
  id: string;
  name: string;
  barcode: string;
  brand: string;
  size: string;
  category: string;
  subCategory: string;
  image: string;
  suggestedRetailPrice: number;
}

export const masterCatalog: CatalogProduct[] = [
  /* ── Fresh Milk ─────────────────────────────────── */
  { id: 'mc-001', name: 'Almarai Fresh Milk Full Fat 1 L',         barcode: '8533333333456', brand: 'Almarai',      size: '1 L',     category: 'Dairy',     subCategory: 'Fresh Milk',       image: '/product-images/milk-1.png', suggestedRetailPrice: 7.50  },
  { id: 'mc-002', name: 'Almarai Fresh Milk Full Fat 2 L',         barcode: '8522222222345', brand: 'Almarai',      size: '2 L',     category: 'Dairy',     subCategory: 'Fresh Milk',       image: '/product-images/milk-2.png', suggestedRetailPrice: 13.00 },
  { id: 'mc-003', name: 'Almarai Fresh Milk Full Fat 2.85 L',      barcode: '8544444444567', brand: 'Almarai',      size: '2.85 L',  category: 'Dairy',     subCategory: 'Fresh Milk',       image: '/product-images/milk-2,85.png', suggestedRetailPrice: 17.50 },
  { id: 'mc-004', name: 'Almarai Fresh Milk Full Fat 180 ML',      barcode: '8555555555678', brand: 'Almarai',      size: '180 ML',  category: 'Dairy',     subCategory: 'Fresh Milk',       image: '/product-images/milk-180.png', suggestedRetailPrice: 3.75  },
  { id: 'mc-005', name: 'Nada Fresh Milk Full Cream 2 L',          barcode: '7643434343333', brand: 'Nada',         size: '2 L',     category: 'Dairy',     subCategory: 'Fresh Milk',       image: '/product-images/milk-nada.png', suggestedRetailPrice: 11.50 },
  { id: 'mc-006', name: 'Juhayna Fresh Milk Full Cream 1.5 L',     barcode: '6477777777880', brand: 'Juhayna',      size: '1.5 L',   category: 'Dairy',     subCategory: 'Fresh Milk',       image: '/product-images/juhayna-milk-1,5.png', suggestedRetailPrice: 10.00 },
  { id: 'mc-007', name: 'Al Safi Fresh Milk Full Fat 2.9 L',       barcode: '4677889966543', brand: 'Al Safi',      size: '2.9 L',   category: 'Dairy',     subCategory: 'Fresh Milk',       image: '/product-images/milk-alsafi.png', suggestedRetailPrice: 18.00 },
  { id: 'mc-008', name: 'Sadafco Full Cream UHT Milk 1 L',         barcode: '6302345678902', brand: 'Sadafco',      size: '1 L',     category: 'Dairy',     subCategory: 'UHT Milk',         image: '/product-images/laban-2,85.png', suggestedRetailPrice: 5.75  },
  { id: 'mc-009', name: 'Almarai Long Life Full Cream Milk 1 L',   barcode: '6301234567891', brand: 'Almarai',      size: '1 L',     category: 'Dairy',     subCategory: 'UHT Milk',         image: '/product-images/milk-almarai-lowfat.png', suggestedRetailPrice: 6.50  },
  { id: 'mc-010', name: 'Nada UHT Full Cream Milk 200 ML',         barcode: '6300123456780', brand: 'Nada',         size: '200 ML',  category: 'Dairy',     subCategory: 'UHT Milk',         image: '/product-images/milk-1.png', suggestedRetailPrice: 3.25  },
  /* ── Eggs ───────────────────────────────────────── */
  { id: 'mc-011', name: 'Saha Lutein Enriched Eggs AA Grade 15 Pieces',     barcode: '6281234567890', brand: 'Saha',         size: '15 pcs',  category: 'Eggs',      subCategory: 'Fresh Eggs',       image: '/product-images/eggs.png', suggestedRetailPrice: 28.50 },
  { id: 'mc-012', name: 'Bayader White Eggs Large Grade A 30 Pieces',       barcode: '6289876543210', brand: 'Bayader',      size: '30 pcs',  category: 'Eggs',      subCategory: 'Fresh Eggs',       image: '/product-images/product-11.png', suggestedRetailPrice: 42.00 },
  /* ── Poultry ────────────────────────────────────── */
  { id: 'mc-013', name: 'Golden Chicken Whole Chilled 1200g',      barcode: '6284321098765', brand: 'Golden Chicken', size: '1.2 kg', category: 'Poultry',   subCategory: 'Whole Chicken',    image: '/product-images/whole-chicken.png', suggestedRetailPrice: 24.95 },
  { id: 'mc-014', name: 'Fakieh Frozen Chicken Breast Fillet 1 kg',         barcode: '6283456789012', brand: 'Fakieh',       size: '1 kg',    category: 'Poultry',   subCategory: 'Chicken Fillet',   image: 'https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=300&h=300&fit=crop', suggestedRetailPrice: 32.00 },
  { id: 'mc-015', name: 'Tanmiah Fresh Chicken Thighs Boneless 900g',       barcode: '6285678012345', brand: 'Tanmiah',      size: '900 g',   category: 'Poultry',   subCategory: 'Chicken Parts',    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=300&h=300&fit=crop', suggestedRetailPrice: 29.50 },
  /* ── Cheese ─────────────────────────────────────── */
  { id: 'mc-016', name: 'Puck Processed Cream Cheese Jar 500g',    barcode: '6285678901234', brand: 'Puck',         size: '500 g',   category: 'Dairy',     subCategory: 'Cheese',           image: '/product-images/puck-cream-cheese.png', suggestedRetailPrice: 19.50 },
  { id: 'mc-017', name: 'Kiri Soft Cheese Squares 16 Portions 280g',        barcode: '6286789012345', brand: 'Kiri',         size: '280 g',   category: 'Dairy',     subCategory: 'Cheese',           image: '/product-images/cheese-200g.png', suggestedRetailPrice: 16.75 },
  { id: 'mc-018', name: 'Almarai White Cheese Full Fat Salted 500g',        barcode: '6287890123456', brand: 'Almarai',      size: '500 g',   category: 'Dairy',     subCategory: 'Cheese',           image: '/product-images/puck-mozzarella.png', suggestedRetailPrice: 14.25 },
  /* ── Frozen ─────────────────────────────────────── */
  { id: 'mc-019', name: 'Barakat Frozen Mixed Vegetables Premium Blend 2.5 kg',       barcode: '6291234567891', brand: 'Barakat',      size: '2.5 kg',  category: 'Frozen',    subCategory: 'Frozen Vegetables',image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop', suggestedRetailPrice: 22.50 },
  { id: 'mc-020', name: 'Sunbulah Frozen French Fries Straight Cut 2 kg',   barcode: '6292234567892', brand: 'Sunbulah',     size: '2 kg',    category: 'Frozen',    subCategory: 'Frozen Potatoes',  image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=300&fit=crop', suggestedRetailPrice: 18.75 },
  /* ── Beverages ──────────────────────────────────── */
  { id: 'mc-021', name: 'Almarai Orange Juice No Pulp 1 L',        barcode: '6292345678902', brand: 'Almarai',      size: '1 L',     category: 'Beverages', subCategory: 'Juice',            image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop', suggestedRetailPrice: 9.75  },
  { id: 'mc-022', name: 'Rani Float Orange Drink With Fruit Bits 240 ML',   barcode: '6293456789013', brand: 'Rani',         size: '240 ML',  category: 'Beverages', subCategory: 'Juice',            image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=300&h=300&fit=crop', suggestedRetailPrice: 3.00  },
  { id: 'mc-023', name: 'Aqua Panna Natural Mineral Water 500 ML', barcode: '6294567890124', brand: 'Aqua Panna',   size: '500 ML',  category: 'Beverages', subCategory: 'Water',            image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=300&h=300&fit=crop', suggestedRetailPrice: 2.50  },
  { id: 'mc-024', name: 'Vimto Concentrated Fruit Drink 750 ML',   barcode: '6295567890125', brand: 'Vimto',        size: '750 ML',  category: 'Beverages', subCategory: 'Concentrate',      image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=300&h=300&fit=crop', suggestedRetailPrice: 14.00 },
  /* ── Condiments & Oils ──────────────────────────── */
  { id: 'mc-025', name: 'Afia Pure Sunflower Cooking Oil 1.5 L',   barcode: '6297890123457', brand: 'Afia',         size: '1.5 L',   category: 'Condiments', subCategory: 'Cooking Oil',      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop', suggestedRetailPrice: 16.50 },
  { id: 'mc-026', name: 'Heinz Tomato Ketchup 570g',                barcode: '6298901234568', brand: 'Heinz',        size: '570 g',   category: 'Condiments', subCategory: 'Sauces',           image: 'https://images.unsplash.com/photo-1611871729987-c2399f3abb51?w=300&h=300&fit=crop', suggestedRetailPrice: 11.25 },
  { id: 'mc-027', name: 'Goody Corn Oil Premium Quality 1.5 L',    barcode: '6299012345679', brand: 'Goody',        size: '1.5 L',   category: 'Condiments', subCategory: 'Cooking Oil',      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop', suggestedRetailPrice: 14.75 },
  /* ── Bakery ─────────────────────────────────────── */
  { id: 'mc-028', name: 'Sunbulah All Purpose Wheat Flour 5 kg',   barcode: '6295678901235', brand: 'Sunbulah',     size: '5 kg',    category: 'Bakery',    subCategory: 'Flour',            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop', suggestedRetailPrice: 18.00 },
  { id: 'mc-029', name: 'Americana Croissant with Chocolate Filling 6 Pieces',        barcode: '6296789012346', brand: 'Americana',    size: '6 pcs',   category: 'Bakery',    subCategory: 'Pastry',           image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=300&fit=crop', suggestedRetailPrice: 12.50 },
  { id: 'mc-030', name: 'L Usine Sliced White Sandwich Bread 600g',         barcode: '6297789012347', brand: "L'usine",      size: '600 g',   category: 'Bakery',    subCategory: 'Bread',            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop', suggestedRetailPrice: 7.25  },
];

/* Pre-seeded "already added" inventory entries */
export interface InventoryEntry {
  product: CatalogProduct;
  salePrice: number;
  originalPrice: number;
  stock: number;
  sku: string;
  deliveryDate: string;
  addedAt: string;
  status: 'active' | 'low_stock' | 'out_of_stock';
}

export const seedInventory: InventoryEntry[] = [
  { product: masterCatalog[1],  salePrice: 12.00, originalPrice: 13.00, stock: 500, sku: 'ALM0000000123', deliveryDate: '2–3 Days', addedAt: '10 Apr 2025', status: 'active'    },
  { product: masterCatalog[12], salePrice: 22.50, originalPrice: 24.95, stock: 18,  sku: 'GCH0000000456', deliveryDate: '1 Day',    addedAt: '09 Apr 2025', status: 'low_stock'    },
  { product: masterCatalog[15], salePrice: 18.75, originalPrice: 19.50, stock: 150, sku: 'PUC0000000789', deliveryDate: '2–3 Days', addedAt: '08 Apr 2025', status: 'active'    },
  { product: masterCatalog[10], salePrice: 26.50, originalPrice: 28.50, stock: 24,  sku: 'SAH0000001012', deliveryDate: '1 Day',    addedAt: '07 Apr 2025', status: 'low_stock' },
];
