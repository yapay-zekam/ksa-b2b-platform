/* ─── KPIs by period ─── */
export const supplierReportKpi = {
  'This Month': {
    revenue: 1284750, revChange: +17.3,
    avgOrder: 736.50,  avgChange: +5.2,
    pending: 124,      pendChange: -8.1,
    returns: 3.4,      retChange: -0.8,
    totalOrders: 1742, visitors: 18640, orderRate: 10.36,
  },
  'Last Quarter': {
    revenue: 3672400, revChange: +12.1,
    avgOrder: 698.20,  avgChange: +2.9,
    pending: 312,      pendChange: +4.6,
    returns: 4.1,      retChange: +0.5,
    totalOrders: 5261, visitors: 51420, orderRate: 10.23,
  },
  'Yearly': {
    revenue: 10842000, revChange: +22.8,
    avgOrder: 748.90,  avgChange: +8.4,
    pending: 847,      pendChange: -3.2,
    returns: 3.7,      retChange: -1.1,
    totalOrders: 14480, visitors: 148200, orderRate: 9.77,
  },
};

/* ─── Daily statistics table for April 2025 ─── */
export interface StatRow {
  date: string;
  visitors: number;
  followers: number;
  placedOrders: number;
  boughtItems: number;
  orderPct: number;
  revenue: number;
}

export const dailyStats: StatRow[] = [
  { date: '01.04.2025', visitors: 47,  followers: 3, placedOrders: 22, boughtItems: 145, orderPct: 46.81, revenue: 3450.00  },
  { date: '02.04.2025', visitors: 189, followers: 9, placedOrders: 7,  boughtItems: 312, orderPct: 3.70,  revenue: 2780.00  },
  { date: '03.04.2025', visitors: 72,  followers: 1, placedOrders: 19, boughtItems: 89,  orderPct: 26.39, revenue: 1920.00  },
  { date: '04.04.2025', visitors: 215, followers: 6, placedOrders: 3,  boughtItems: 256, orderPct: 1.40,  revenue: 4600.00  },
  { date: '05.04.2025', visitors: 134, followers: 4, placedOrders: 28, boughtItems: 378, orderPct: 20.90, revenue: 945.00   },
  { date: '06.04.2025', visitors: 58,  followers: 8, placedOrders: 14, boughtItems: 223, orderPct: 24.14, revenue: 5300.00  },
  { date: '07.04.2025', visitors: 123, followers: 7, placedOrders: 15, boughtItems: 237, orderPct: 12.20, revenue: 1250.00  },
  { date: '08.04.2025', visitors: 312, followers: 3, placedOrders: 7,  boughtItems: 145, orderPct: 2.24,  revenue: 3450.00  },
  { date: '09.04.2025', visitors: 215, followers: 9, placedOrders: 22, boughtItems: 312, orderPct: 10.23, revenue: 2780.00  },
  { date: '10.04.2025', visitors: 89,  followers: 1, placedOrders: 3,  boughtItems: 89,  orderPct: 3.37,  revenue: 4320.00  },
  { date: '11.04.2025', visitors: 402, followers: 5, placedOrders: 29, boughtItems: 376, orderPct: 7.21,  revenue: 5600.00  },
  { date: '12.04.2025', visitors: 56,  followers: 2, placedOrders: 11, boughtItems: 215, orderPct: 19.64, revenue: 850.00   },
  { date: '13.04.2025', visitors: 257, followers: 4, placedOrders: 32, boughtItems: 568, orderPct: 12.45, revenue: 7688.00  },
  { date: '14.04.2025', visitors: 193, followers: 6, placedOrders: 18, boughtItems: 284, orderPct: 9.33,  revenue: 3120.00  },
  { date: '15.04.2025', visitors: 311, followers: 8, placedOrders: 41, boughtItems: 492, orderPct: 13.18, revenue: 6840.00  },
  { date: '16.04.2025', visitors: 142, followers: 2, placedOrders: 12, boughtItems: 178, orderPct: 8.45,  revenue: 2100.00  },
  { date: '17.04.2025', visitors: 278, followers: 5, placedOrders: 26, boughtItems: 342, orderPct: 9.35,  revenue: 4290.00  },
  { date: '18.04.2025', visitors: 95,  followers: 3, placedOrders: 8,  boughtItems: 112, orderPct: 8.42,  revenue: 1340.00  },
  { date: '19.04.2025', visitors: 421, followers: 7, placedOrders: 35, boughtItems: 520, orderPct: 8.31,  revenue: 7250.00  },
  { date: '20.04.2025', visitors: 187, followers: 4, placedOrders: 21, boughtItems: 265, orderPct: 11.23, revenue: 3560.00  },
  { date: '21.04.2025', visitors: 340, followers: 9, placedOrders: 43, boughtItems: 601, orderPct: 12.65, revenue: 8100.00  },
  { date: '22.04.2025', visitors: 108, followers: 2, placedOrders: 9,  boughtItems: 134, orderPct: 8.33,  revenue: 1680.00  },
  { date: '23.04.2025', visitors: 264, followers: 6, placedOrders: 31, boughtItems: 387, orderPct: 11.74, revenue: 5200.00  },
  { date: '24.04.2025', visitors: 178, followers: 3, placedOrders: 17, boughtItems: 223, orderPct: 9.55,  revenue: 2870.00  },
  { date: '25.04.2025', visitors: 392, followers: 8, placedOrders: 48, boughtItems: 614, orderPct: 12.24, revenue: 9120.00  },
  { date: '26.04.2025', visitors: 213, followers: 4, placedOrders: 24, boughtItems: 301, orderPct: 11.27, revenue: 4050.00  },
  { date: '27.04.2025', visitors: 156, followers: 5, placedOrders: 14, boughtItems: 198, orderPct: 8.97,  revenue: 2340.00  },
  { date: '28.04.2025', visitors: 447, followers: 11,placedOrders: 52, boughtItems: 683, orderPct: 11.63, revenue: 9860.00  },
  { date: '29.04.2025', visitors: 289, followers: 7, placedOrders: 33, boughtItems: 421, orderPct: 11.42, revenue: 5580.00  },
  { date: '30.04.2025', visitors: 362, followers: 9, placedOrders: 44, boughtItems: 558, orderPct: 12.15, revenue: 7450.00  },
];

/* ─── Sales growth area chart ─── */
export const salesGrowthData = [
  { month: 'Nov',  revenue: 620000,  orders: 842 },
  { month: 'Dec',  revenue: 710000,  orders: 960 },
  { month: 'Jan',  revenue: 680000,  orders: 920 },
  { month: 'Feb',  revenue: 830000,  orders: 1127 },
  { month: 'Mar',  revenue: 940000,  orders: 1276 },
  { month: 'Apr',  revenue: 1100000, orders: 1493 },
  { month: 'May',  revenue: 1284750, orders: 1742 },
];

/* ─── Top selling products horizontal bar ─── */
export const topSellingProducts = [
  { name: 'Almarai Fresh Milk 2L',     revenue: 84200,  units: 8420 },
  { name: 'Golden Chicken 1.2kg',      revenue: 122800, units: 6140 },
  { name: 'Saha Lutein Eggs 15pcs',    revenue: 107600, units: 5380 },
  { name: 'Puck Cream Cheese 500g',    revenue: 77885,  units: 4210 },
  { name: 'Barakat Frozen Vegs 2.5kg', revenue: 72732,  units: 3640 },
];

/* ─── Regional sales pie chart ─── */
export const regionalSales = [
  { region: 'Riyadh',  revenue: 512300, pct: 39.9, color: '#3D005E' },
  { region: 'Jeddah',  revenue: 321800, pct: 25.0, color: '#9d1fff' },
  { region: 'Dammam',  revenue: 218600, pct: 17.0, color: '#FFD680' },
  { region: 'Makkah',  revenue: 153800, pct: 12.0, color: '#c084fc' },
  { region: 'Madinah', revenue:  78250, pct: 6.1,  color: '#e9d5ff' },
];

/* ─── Top merchants ─── */
export const topMerchantsReport = [
  { rank: 1, name: 'Al Noor Cafe',      logo: 'AN', color: '#3D005E', revenue: 184300, orders: 312, city: 'Riyadh',  change: +18.4 },
  { rank: 2, name: 'Sultana Kitchen',   logo: 'SK', color: '#C8102E', revenue: 142600, orders: 248, city: 'Jeddah',  change: +9.1  },
  { rank: 3, name: 'Pearl Restaurant',  logo: 'PR', color: '#006E33', revenue: 118900, orders: 201, city: 'Dammam',  change: +5.6  },
  { rank: 4, name: 'Bloom Café',        logo: 'BC', color: '#E8A000', revenue: 94200,  orders: 167, city: 'Riyadh',  change: +22.3 },
  { rank: 5, name: 'Green Bites',       logo: 'GB', color: '#00873E', revenue: 78500,  orders: 143, city: 'Jeddah',  change: -3.2  },
  { rank: 6, name: 'Urban Grill',       logo: 'UG', color: '#EE3124', revenue: 61200,  orders: 112, city: 'Makkah',  change: +7.8  },
  { rank: 7, name: 'Café de Medina',    logo: 'CM', color: '#006400', revenue: 48700,  orders: 89,  city: 'Madinah', change: +11.2 },
  { rank: 8, name: 'The Atrium',        logo: 'TA', color: '#003087', revenue: 42800,  orders: 78,  city: 'Riyadh',  change: +4.3  },
];

/* ─── Order history table ─── */
export type ReportOrderStatus = 'Delivered' | 'Processing' | 'Pending' | 'Cancelled' | 'Shipped';
export interface OrderHistoryRow {
  id: string;
  date: string;
  merchant: string;
  merchantLogo: string;
  merchantColor: string;
  city: string;
  product: string;
  qty: number;
  amount: number;
  status: ReportOrderStatus;
}

export const orderHistory: OrderHistoryRow[] = [
  { id: '#ORD-8821', date: '13 Apr 2025', merchant: 'Al Noor Cafe',     merchantLogo: 'AN', merchantColor: '#3D005E', city: 'Riyadh',  product: 'Almarai Fresh Milk 2L × 120',    qty: 120, amount: 1200.00,  status: 'Delivered'  },
  { id: '#ORD-8820', date: '13 Apr 2025', merchant: 'Sultana Kitchen',  merchantLogo: 'SK', merchantColor: '#C8102E', city: 'Jeddah',  product: 'Saha Lutein Eggs 15pcs × 200',   qty: 200, amount: 5800.00,  status: 'Processing' },
  { id: '#ORD-8819', date: '12 Apr 2025', merchant: 'Pearl Restaurant', merchantLogo: 'PR', merchantColor: '#006E33', city: 'Dammam',  product: 'Golden Chicken 1.2kg × 80',      qty: 80,  amount: 9200.00,  status: 'Shipped'    },
  { id: '#ORD-8818', date: '12 Apr 2025', merchant: 'Bloom Café',       merchantLogo: 'BC', merchantColor: '#E8A000', city: 'Riyadh',  product: 'Puck Cream Cheese 500g × 60',    qty: 60,  amount: 1110.00,  status: 'Pending'    },
  { id: '#ORD-8817', date: '11 Apr 2025', merchant: 'Green Bites',      merchantLogo: 'GB', merchantColor: '#00873E', city: 'Jeddah',  product: 'Barakat Frozen Vegs 2.5kg × 150',qty: 150, amount: 2998.00,  status: 'Delivered'  },
  { id: '#ORD-8816', date: '11 Apr 2025', merchant: 'Urban Grill',      merchantLogo: 'UG', merchantColor: '#EE3124', city: 'Makkah',  product: 'Nada UHT Milk 12×1L × 24',       qty: 24,  amount: 1080.00,  status: 'Cancelled'  },
  { id: '#ORD-8815', date: '10 Apr 2025', merchant: 'The Atrium',       merchantLogo: 'TA', merchantColor: '#003087', city: 'Riyadh',  product: 'Aqua Panna Water 12×500ml × 96', qty: 96,  amount: 2112.00,  status: 'Delivered'  },
  { id: '#ORD-8814', date: '10 Apr 2025', merchant: 'Café de Medina',   merchantLogo: 'CM', merchantColor: '#006400', city: 'Madinah', product: 'Kiri Cheese Squares 200g × 48',   qty: 48,  amount: 732.00,   status: 'Processing' },
  { id: '#ORD-8813', date: '09 Apr 2025', merchant: 'Al Noor Cafe',     merchantLogo: 'AN', merchantColor: '#3D005E', city: 'Riyadh',  product: 'Almarai Fresh Milk 2L × 90',     qty: 90,  amount: 900.00,   status: 'Delivered'  },
  { id: '#ORD-8812', date: '09 Apr 2025', merchant: 'Sultana Kitchen',  merchantLogo: 'SK', merchantColor: '#C8102E', city: 'Jeddah',  product: 'Golden Chicken 1.2kg × 50',      qty: 50,  amount: 5750.00,  status: 'Delivered'  },
  { id: '#ORD-8811', date: '08 Apr 2025', merchant: 'Pearl Restaurant', merchantLogo: 'PR', merchantColor: '#006E33', city: 'Dammam',  product: 'Puck Cream Cheese 500g × 40',    qty: 40,  amount: 740.00,   status: 'Shipped'    },
  { id: '#ORD-8810', date: '08 Apr 2025', merchant: 'Bloom Café',       merchantLogo: 'BC', merchantColor: '#E8A000', city: 'Riyadh',  product: 'Saha Lutein Eggs 15pcs × 100',   qty: 100, amount: 2900.00,  status: 'Delivered'  },
];

/* ─── Low stock products (Monitoring) ─── */
export interface LowStockProduct {
  id: string;
  name: string;
  image: string;
  brand: string;
  categoryPath: string;
  stock: number;
  minStock: number;
}

export const lowStockProducts: LowStockProduct[] = [
  { id: '#UGR001', name: 'Almarai Fresh Milk Full Fat 2.5 L - Sample Long Text', image: '/product-images/milk-2.png', brand: 'Almarai', categoryPath: 'Dairy >> Milk and Laban',                       stock: 62, minStock: 100 },
  { id: '#HTD032', name: 'Rabea Black Tea - Express - 100 Tea Bags',              image: '/product-images/tea.png', brand: 'Alricei', categoryPath: 'Food >> Rice and Pasta >> Rice',                    stock: 17, minStock: 80  },
  { id: '#PAS001', name: 'Al-joud Fettuccine - 450 G',                           image: '/product-images/pasta-3.png', brand: 'Al Joud', categoryPath: 'Food >> Rice and Pasta >> Pasta',                   stock: 54, minStock: 80  },
  { id: '#UGR002', name: 'Rabea Black Tea - Express - 100 Tea Bags',              image: '/product-images/tea.png', brand: 'Rabea',   categoryPath: 'Beverages >> Hot Drinks >> Tea and Coffee >> Tea', stock: 33, minStock: 100 },
  { id: '#UGR003', name: 'White Rice - 1 Kg',                                    image: '/product-images/pasta-4.png', brand: 'Alricei', categoryPath: 'Food >> Rice and Pasta >> Rice',                    stock: 6,  minStock: 80  },
  { id: '#UGR004', name: 'Goody Pasta - 500 G',                                  image: '/product-images/pasta-7.png', brand: 'Goody',   categoryPath: 'Food >> Rice and Pasta >> Pasta',                   stock: 25, minStock: 80  },
];

/* ─── Never sold products (Monitoring) ─── */
export const neverSoldProducts: LowStockProduct[] = [
  { id: '#MMM057', name: 'Juhayna Fresh Milk Full Fat 2.5 L', image: '/product-images/juhayna-milk-1,5.png', brand: 'Juhayna', categoryPath: 'Dairy >> Milk and Laban >> Fresh Milk', stock: 500, minStock: 0 },
];

/* ─── Empty categories (Monitoring) ─── */
export const emptyCategories = [
  'Dairy >> Milk and Laban',
  'Fresh >> Fruits and Vegetables >> Vegetables',
  'Beverage >> Energy Drinks',
];

/* ══════════════════════════════════════════════════════
   PERIOD-BASED DATA  ('Today' | 'Week' | 'Month' | 'Year')
══════════════════════════════════════════════════════ */
export type SupplierPeriod = 'Today' | 'Week' | 'Month' | 'Year';

/* ─── KPIs by new period ─── */
export const supplierKpiByPeriod: Record<SupplierPeriod, {
  revenue: number; revChange: number;
  avgOrder: number; avgChange: number;
  pending: number;  pendChange: number;
  returns: number;  retChange: number;
  totalOrders: number; visitors: number; orderRate: number;
}> = {
  Today: { revenue: 42300,    revChange: +8.2,  avgOrder: 712.50, avgChange: +2.1,  pending: 18,  pendChange: -12.5, returns: 2.8, retChange: -0.4, totalOrders: 59,    visitors: 842,    orderRate: 7.01  },
  Week:  { revenue: 284750,   revChange: +13.4, avgOrder: 728.80, avgChange: +3.8,  pending: 47,  pendChange: -5.3,  returns: 3.1, retChange: -0.6, totalOrders: 391,   visitors: 4280,   orderRate: 9.13  },
  Month: { revenue: 1284750,  revChange: +17.3, avgOrder: 736.50, avgChange: +5.2,  pending: 124, pendChange: -8.1,  returns: 3.4, retChange: -0.8, totalOrders: 1742,  visitors: 18640,  orderRate: 10.36 },
  Year:  { revenue: 10842000, revChange: +22.8, avgOrder: 748.90, avgChange: +8.4,  pending: 847, pendChange: -3.2,  returns: 3.7, retChange: -1.1, totalOrders: 14480, visitors: 148200, orderRate: 9.77  },
};

/* ─── Sales Growth by period ─── */
export const salesGrowthByPeriod: Record<SupplierPeriod, Array<{ month: string; revenue: number; orders: number }>> = {
  Today: [
    { month: '08:00', revenue: 3200,  orders: 4  },
    { month: '10:00', revenue: 6800,  orders: 9  },
    { month: '12:00', revenue: 12400, orders: 17 },
    { month: '14:00', revenue: 18900, orders: 26 },
    { month: '16:00', revenue: 28600, orders: 40 },
    { month: '18:00', revenue: 36100, orders: 51 },
    { month: '20:00', revenue: 42300, orders: 59 },
  ],
  Week: [
    { month: 'Mon', revenue: 32400,  orders: 44 },
    { month: 'Tue', revenue: 41800,  orders: 57 },
    { month: 'Wed', revenue: 38200,  orders: 52 },
    { month: 'Thu', revenue: 52600,  orders: 72 },
    { month: 'Fri', revenue: 47300,  orders: 65 },
    { month: 'Sat', revenue: 31900,  orders: 43 },
    { month: 'Sun', revenue: 40550,  orders: 58 },
  ],
  Month: salesGrowthData,
  Year: [
    { month: 'Jan', revenue: 720000,  orders: 978  },
    { month: 'Feb', revenue: 810000,  orders: 1099 },
    { month: 'Mar', revenue: 892000,  orders: 1211 },
    { month: 'Apr', revenue: 948000,  orders: 1287 },
    { month: 'May', revenue: 1024000, orders: 1390 },
    { month: 'Jun', revenue: 1100000, orders: 1493 },
    { month: 'Jul', revenue: 1284750, orders: 1742 },
    { month: 'Aug', revenue: 1340000, orders: 1820 },
    { month: 'Sep', revenue: 1102000, orders: 1496 },
    { month: 'Oct', revenue: 1248000, orders: 1694 },
    { month: 'Nov', revenue: 982000,  orders: 1332 },
    { month: 'Dec', revenue: 1190000, orders: 1616 },
  ],
};

/* ─── Top selling products by period ─── */
export const topSellingByPeriod: Record<SupplierPeriod, Array<{ name: string; revenue: number; units: number }>> = {
  Today: [
    { name: 'Golden Chicken 1.2kg',      revenue: 12280,  units: 614  },
    { name: 'Almarai Fresh Milk 2L',     revenue: 8420,   units: 842  },
    { name: 'Saha Lutein Eggs 15pcs',    revenue: 7600,   units: 380  },
    { name: 'Puck Cream Cheese 500g',    revenue: 6100,   units: 305  },
    { name: 'Barakat Frozen Vegs 2.5kg', revenue: 5200,   units: 260  },
  ],
  Week: [
    { name: 'Golden Chicken 1.2kg',      revenue: 42800,  units: 2140 },
    { name: 'Saha Lutein Eggs 15pcs',    revenue: 37600,  units: 1880 },
    { name: 'Almarai Fresh Milk 2L',     revenue: 29400,  units: 2940 },
    { name: 'Barakat Frozen Vegs 2.5kg', revenue: 25200,  units: 1260 },
    { name: 'Puck Cream Cheese 500g',    revenue: 21900,  units: 1095 },
  ],
  Month: topSellingProducts,
  Year: [
    { name: 'Golden Chicken 1.2kg',      revenue: 1228000, units: 61400 },
    { name: 'Almarai Fresh Milk 2L',     revenue: 942000,  units: 94200 },
    { name: 'Saha Lutein Eggs 15pcs',    revenue: 876000,  units: 43800 },
    { name: 'Puck Cream Cheese 500g',    revenue: 698000,  units: 34900 },
    { name: 'Barakat Frozen Vegs 2.5kg', revenue: 527000,  units: 26350 },
  ],
};

/* ─── Regional sales by period ─── */
export const regionalSalesByPeriod: Record<SupplierPeriod, Array<{ region: string; revenue: number; pct: number; color: string }>> = {
  Today: [
    { region: 'Riyadh',  revenue: 16800, pct: 39.7, color: '#3D005E' },
    { region: 'Jeddah',  revenue: 10600, pct: 25.1, color: '#9d1fff' },
    { region: 'Dammam',  revenue: 7200,  pct: 17.0, color: '#FFD680' },
    { region: 'Makkah',  revenue: 5100,  pct: 12.1, color: '#c084fc' },
    { region: 'Madinah', revenue: 2600,  pct: 6.1,  color: '#e9d5ff' },
  ],
  Week: [
    { region: 'Riyadh',  revenue: 113600, pct: 39.9, color: '#3D005E' },
    { region: 'Jeddah',  revenue: 71200,  pct: 25.0, color: '#9d1fff' },
    { region: 'Dammam',  revenue: 48400,  pct: 17.0, color: '#FFD680' },
    { region: 'Makkah',  revenue: 34200,  pct: 12.0, color: '#c084fc' },
    { region: 'Madinah', revenue: 17350,  pct: 6.1,  color: '#e9d5ff' },
  ],
  Month: regionalSales,
  Year: [
    { region: 'Riyadh',  revenue: 4326000, pct: 39.9, color: '#3D005E' },
    { region: 'Jeddah',  revenue: 2710500, pct: 25.0, color: '#9d1fff' },
    { region: 'Dammam',  revenue: 1843140, pct: 17.0, color: '#FFD680' },
    { region: 'Makkah',  revenue: 1301040, pct: 12.0, color: '#c084fc' },
    { region: 'Madinah', revenue: 661320,  pct: 6.1,  color: '#e9d5ff' },
  ],
};

/* ─── Top merchants by period ─── */
export const topMerchantsByPeriod: Record<SupplierPeriod, Array<{ rank: number; name: string; logo: string; color: string; revenue: number; orders: number; city: string; change: number }>> = {
  Today: [
    { rank: 1, name: 'Al Noor Cafe',     logo: 'AN', color: '#3D005E', revenue: 6300, orders: 11, city: 'Riyadh',  change: +14.2 },
    { rank: 2, name: 'Bloom Café',       logo: 'BC', color: '#E8A000', revenue: 5100, orders: 8,  city: 'Riyadh',  change: +22.3 },
    { rank: 3, name: 'Pearl Restaurant', logo: 'PR', color: '#006E33', revenue: 4200, orders: 7,  city: 'Dammam',  change: +5.6  },
    { rank: 4, name: 'Sultana Kitchen',  logo: 'SK', color: '#C8102E', revenue: 3800, orders: 6,  city: 'Jeddah',  change: +9.1  },
    { rank: 5, name: 'Green Bites',      logo: 'GB', color: '#00873E', revenue: 2900, orders: 5,  city: 'Jeddah',  change: -3.2  },
    { rank: 6, name: 'Urban Grill',      logo: 'UG', color: '#EE3124', revenue: 2100, orders: 4,  city: 'Makkah',  change: +7.8  },
  ],
  Week: [
    { rank: 1, name: 'Al Noor Cafe',     logo: 'AN', color: '#3D005E', revenue: 43100, orders: 73, city: 'Riyadh',  change: +18.4 },
    { rank: 2, name: 'Sultana Kitchen',  logo: 'SK', color: '#C8102E', revenue: 33400, orders: 57, city: 'Jeddah',  change: +9.1  },
    { rank: 3, name: 'Pearl Restaurant', logo: 'PR', color: '#006E33', revenue: 27800, orders: 47, city: 'Dammam',  change: +5.6  },
    { rank: 4, name: 'Bloom Café',       logo: 'BC', color: '#E8A000', revenue: 22100, orders: 39, city: 'Riyadh',  change: +22.3 },
    { rank: 5, name: 'Green Bites',      logo: 'GB', color: '#00873E', revenue: 18400, orders: 33, city: 'Jeddah',  change: -3.2  },
    { rank: 6, name: 'The Atrium',       logo: 'TA', color: '#003087', revenue: 10020, orders: 18, city: 'Riyadh',  change: +4.3  },
  ],
  Month: topMerchantsReport.slice(0, 6),
  Year: [
    { rank: 1, name: 'Sultana Kitchen',  logo: 'SK', color: '#C8102E', revenue: 1421000, orders: 2480, city: 'Jeddah',  change: +12.3 },
    { rank: 2, name: 'Al Noor Cafe',     logo: 'AN', color: '#3D005E', revenue: 1284000, orders: 2184, city: 'Riyadh',  change: +18.4 },
    { rank: 3, name: 'Pearl Restaurant', logo: 'PR', color: '#006E33', revenue: 987000,  orders: 1674, city: 'Dammam',  change: +5.6  },
    { rank: 4, name: 'Bloom Café',       logo: 'BC', color: '#E8A000', revenue: 841000,  orders: 1432, city: 'Riyadh',  change: +22.3 },
    { rank: 5, name: 'Green Bites',      logo: 'GB', color: '#00873E', revenue: 612000,  orders: 1040, city: 'Jeddah',  change: -3.2  },
    { rank: 6, name: 'The Atrium',       logo: 'TA', color: '#003087', revenue: 482000,  orders: 820,  city: 'Riyadh',  change: +4.3  },
  ],
};
