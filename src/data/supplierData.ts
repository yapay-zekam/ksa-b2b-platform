/* ─── KPIs by period ─── */
export const supplierKpiByPeriod = {
  Today:  { sales: 48320,    prevSales: 41200,  orders: 64,   prevOrders: 55,  products: 847, pending: 18 },
  Week:   { sales: 284650,   prevSales: 241000, orders: 387,  prevOrders: 321, products: 847, pending: 34 },
  Month:  { sales: 1284750,  prevSales: 1098200,orders: 1742, prevOrders: 1493,products: 847, pending: 82 },
  Year:   { sales: 10842000, prevSales: 9100000,orders: 18640,prevOrders: 15800,products: 847, pending: 124 },
};

/* ─── Weekly sales bar chart (last 12 weeks) ─── */
export const supplierSalesTrend = [
  { week: 'W1',  sales: 68200,  orders: 92,  returns: 4 },
  { week: 'W2',  sales: 74500,  orders: 101, returns: 3 },
  { week: 'W3',  sales: 61800,  orders: 83,  returns: 6 },
  { week: 'W4',  sales: 88300,  orders: 118, returns: 2 },
  { week: 'W5',  sales: 79600,  orders: 107, returns: 5 },
  { week: 'W6',  sales: 95100,  orders: 128, returns: 3 },
  { week: 'W7',  sales: 102400, orders: 138, returns: 4 },
  { week: 'W8',  sales: 91700,  orders: 123, returns: 7 },
  { week: 'W9',  sales: 118300, orders: 159, returns: 2 },
  { week: 'W10', sales: 108900, orders: 146, returns: 5 },
  { week: 'W11', sales: 124600, orders: 167, returns: 3 },
  { week: 'W12', sales: 131200, orders: 176, returns: 4 },
];

/* ─── Daily revenue (last 14 days) ─── */
export const supplierDailyRevenue = [
  { day: '28 Mar', revenue: 38200 },
  { day: '29 Mar', revenue: 42100 },
  { day: '30 Mar', revenue: 35800 },
  { day: '31 Mar', revenue: 47300 },
  { day: '01 Apr', revenue: 52600 },
  { day: '02 Apr', revenue: 44900 },
  { day: '03 Apr', revenue: 39200 },
  { day: '04 Apr', revenue: 58100 },
  { day: '05 Apr', revenue: 61400 },
  { day: '06 Apr', revenue: 53700 },
  { day: '07 Apr', revenue: 67800 },
  { day: '08 Apr', revenue: 72300 },
  { day: '09 Apr', revenue: 64500 },
  { day: '10 Apr', revenue: 78900 },
];

/* ─── Order status donut ─── */
export const orderStatusData = [
  { name: 'Delivered',  value: 1284, color: '#3D005E' },
  { name: 'Processing', value: 287,  color: '#9d1fff' },
  { name: 'Pending',    value: 124,  color: '#FFD680' },
  { name: 'Cancelled',  value: 47,   color: '#ef4444' },
];

/* ─── Recent orders ─── */
export type OrderStatus = 'Delivered' | 'Processing' | 'Pending' | 'Cancelled' | 'Shipped';

export interface SupplierOrder {
  id: string;
  product: string;
  category: string;
  image: string;
  merchantName: string;
  branchName: string;
  merchantLogo: string;
  merchantColor: string;
  qty: number;
  amount: number;
  status: OrderStatus;
  date: string;
  deliveryDays: string;
}

export const recentSupplierOrders: SupplierOrder[] = [
  { id: '#ORD-8821', product: 'Almarai Fresh Milk Full Fat – 2L', category: 'Dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&h=80&fit=crop', merchantName: 'Al Noor Cafe', branchName: 'Main Kitchen – Riyadh', merchantLogo: 'AN', merchantColor: '#3D005E', qty: 120, amount: 1200,  status: 'Delivered',  date: '13 Apr 2025', deliveryDays: 'Delivered' },
  { id: '#ORD-8820', product: 'Saha Lutein Eggs AA – 15 pcs',    category: 'Eggs',  image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=80&h=80&fit=crop', merchantName: 'Sultana Kitchen', branchName: 'Branch – Jeddah',         merchantLogo: 'SK', merchantColor: '#C8102E', qty: 200, amount: 5800,  status: 'Processing', date: '13 Apr 2025', deliveryDays: '1–2 Days' },
  { id: '#ORD-8819', product: 'Golden Chicken Whole – 1.2kg',    category: 'Poultry',image: 'https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=80&h=80&fit=crop', merchantName: 'Pearl Restaurant', branchName: 'Branch – Al Khobar',    merchantLogo: 'PR', merchantColor: '#006E33', qty: 80,  amount: 9200,  status: 'Shipped',    date: '12 Apr 2025', deliveryDays: 'Same day' },
  { id: '#ORD-8818', product: 'Puck Cream Cheese – 500g',        category: 'Dairy', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=80&h=80&fit=crop', merchantName: 'Bloom Café',      branchName: 'Main Kitchen – Riyadh', merchantLogo: 'BC', merchantColor: '#E8A000', qty: 60,  amount: 1110,  status: 'Pending',    date: '12 Apr 2025', deliveryDays: '2–3 Days' },
  { id: '#ORD-8817', product: 'Barakat Frozen Vegs – 2.5kg',     category: 'Frozen',image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop', merchantName: 'Green Bites',    branchName: 'Branch – Dammam',       merchantLogo: 'GB', merchantColor: '#00873E', qty: 150, amount: 2998,  status: 'Delivered',  date: '11 Apr 2025', deliveryDays: 'Delivered' },
  { id: '#ORD-8816', product: 'Nada UHT Milk 1L × 12',           category: 'Dairy', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&h=80&fit=crop', merchantName: 'Urban Grill',     branchName: 'Branch – Riyadh North', merchantLogo: 'UG', merchantColor: '#EE3124', qty: 24,  amount: 1080,  status: 'Cancelled',  date: '11 Apr 2025', deliveryDays: '—' },
  { id: '#ORD-8815', product: 'Aqua Panna Water 12×500ml',       category: 'Beverages',image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=80&h=80&fit=crop', merchantName: 'The Atrium',     branchName: 'Main Kitchen – Riyadh', merchantLogo: 'TA', merchantColor: '#003087', qty: 96,  amount: 2112,  status: 'Delivered',  date: '10 Apr 2025', deliveryDays: 'Delivered' },
  { id: '#ORD-8814', product: 'Kiri Cheese Squares – 200g',      category: 'Dairy', image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=80&h=80&fit=crop', merchantName: 'Café de Medina', branchName: 'Branch – Madinah',       merchantLogo: 'CM', merchantColor: '#006400', qty: 48,  amount: 732,   status: 'Processing', date: '10 Apr 2025', deliveryDays: '1–2 Days' },
];

/* ─── Top merchants ─── */
export const topMerchants = [
  { rank: 1, name: 'Al Noor Cafe',     logo: 'AN', color: '#3D005E', revenue: 184300, orders: 312, avgOrder: 590.7, trend: +18.4 },
  { rank: 2, name: 'Sultana Kitchen',  logo: 'SK', color: '#C8102E', revenue: 142600, orders: 248, avgOrder: 575.0, trend: +9.1  },
  { rank: 3, name: 'Pearl Restaurant', logo: 'PR', color: '#006E33', revenue: 118900, orders: 201, avgOrder: 591.5, trend: +5.6  },
  { rank: 4, name: 'Bloom Café',       logo: 'BC', color: '#E8A000', revenue: 94200,  orders: 167, avgOrder: 564.1, trend: +22.3 },
  { rank: 5, name: 'Green Bites',      logo: 'GB', color: '#00873E', revenue: 78500,  orders: 143, avgOrder: 548.9, trend: -3.2  },
];

/* ─── Top selling products ─── */
export const topProducts = [
  { rank: 1, name: 'Almarai Fresh Milk 2L',    category: 'Dairy',    unitsSold: 8420, revenue: 84200,  trend: +12.1 },
  { rank: 2, name: 'Golden Chicken 1.2kg',     category: 'Poultry',  unitsSold: 6140, revenue: 122800, trend: +8.4  },
  { rank: 3, name: 'Saha Lutein Eggs 15pcs',   category: 'Eggs',     unitsSold: 5380, revenue: 107600, trend: +15.6 },
  { rank: 4, name: 'Puck Cream Cheese 500g',   category: 'Dairy',    unitsSold: 4210, revenue: 77885,  trend: +4.2  },
  { rank: 5, name: 'Barakat Frozen Vegs 2.5kg',category: 'Frozen',   unitsSold: 3640, revenue: 72732,  trend: -1.8  },
  { rank: 6, name: 'Nada UHT Milk 12×1L',      category: 'Dairy',    unitsSold: 2890, revenue: 130050, trend: +7.9  },
];

/* ─── Inventory alerts ─── */
export const inventoryAlerts = [
  { product: 'Almarai Fresh Milk 2L',    stock: 340,  minStock: 500,  severity: 'low'      as const },
  { product: 'Barakat Frozen Vegs 2.5kg',stock: 82,   minStock: 200,  severity: 'medium'   as const },
  { product: 'Saha Lutein Eggs 15pcs',   stock: 24,   minStock: 150,  severity: 'critical' as const },
];

/* ─── Order status by period (for donut chart) ─── */
export const orderStatusByPeriod: Record<string, Array<{ name: string; value: number; color: string }>> = {
  Today: [
    { name: 'Delivered',  value: 42,    color: '#3D005E' },
    { name: 'Processing', value: 18,    color: '#9d1fff' },
    { name: 'Pending',    value: 12,    color: '#FFD680' },
    { name: 'Cancelled',  value: 5,     color: '#ef4444' },
  ],
  Week: [
    { name: 'Delivered',  value: 287,   color: '#3D005E' },
    { name: 'Processing', value: 64,    color: '#9d1fff' },
    { name: 'Pending',    value: 31,    color: '#FFD680' },
    { name: 'Cancelled',  value: 12,    color: '#ef4444' },
  ],
  Month: orderStatusData,
  Year: [
    { name: 'Delivered',  value: 14820, color: '#3D005E' },
    { name: 'Processing', value: 2140,  color: '#9d1fff' },
    { name: 'Pending',    value: 840,   color: '#FFD680' },
    { name: 'Cancelled',  value: 380,   color: '#ef4444' },
  ],
};

/* ─── Period-specific sales trend (for bar chart) ─── */
export const salesTrendByPeriod: Record<string, Array<{ week: string; sales: number; orders: number }>> = {
  Today: [
    { week: '08:00', sales: 3200,  orders: 4  },
    { week: '09:00', sales: 5800,  orders: 8  },
    { week: '10:00', sales: 8100,  orders: 11 },
    { week: '11:00', sales: 12400, orders: 17 },
    { week: '12:00', sales: 9800,  orders: 13 },
    { week: '13:00', sales: 7200,  orders: 10 },
    { week: '14:00', sales: 11600, orders: 16 },
    { week: '15:00', sales: 13400, orders: 18 },
    { week: '16:00', sales: 10200, orders: 14 },
    { week: '17:00', sales: 8700,  orders: 12 },
  ],
  Week: [
    { week: 'Mon', sales: 38200, orders: 52 },
    { week: 'Tue', sales: 42100, orders: 57 },
    { week: 'Wed', sales: 35800, orders: 48 },
    { week: 'Thu', sales: 47300, orders: 64 },
    { week: 'Fri', sales: 52600, orders: 71 },
    { week: 'Sat', sales: 44900, orders: 61 },
    { week: 'Sun', sales: 39200, orders: 53 },
  ],
  Month: supplierSalesTrend,
  Year: [
    { week: 'Jan', sales: 680000,  orders: 918  },
    { week: 'Feb', sales: 720000,  orders: 972  },
    { week: 'Mar', sales: 810000,  orders: 1094 },
    { week: 'Apr', sales: 930000,  orders: 1256 },
    { week: 'May', sales: 870000,  orders: 1175 },
    { week: 'Jun', sales: 950000,  orders: 1283 },
    { week: 'Jul', sales: 1020000, orders: 1377 },
    { week: 'Aug', sales: 980000,  orders: 1323 },
    { week: 'Sep', sales: 1100000, orders: 1485 },
    { week: 'Oct', sales: 1060000, orders: 1431 },
    { week: 'Nov', sales: 1180000, orders: 1593 },
    { week: 'Dec', sales: 1284750, orders: 1734 },
  ],
};

/* ─── Period-specific revenue trend (for area chart) ─── */
export const revenueByPeriod: Record<string, Array<{ day: string; revenue: number }>> = {
  Today: [
    { day: '08:00', revenue: 3200  },
    { day: '09:00', revenue: 5800  },
    { day: '10:00', revenue: 8100  },
    { day: '11:00', revenue: 12400 },
    { day: '12:00', revenue: 9800  },
    { day: '13:00', revenue: 7200  },
    { day: '14:00', revenue: 11600 },
    { day: '15:00', revenue: 13400 },
    { day: '16:00', revenue: 10200 },
    { day: '17:00', revenue: 8700  },
  ],
  Week: [
    { day: 'Mon', revenue: 38200 },
    { day: 'Tue', revenue: 42100 },
    { day: 'Wed', revenue: 35800 },
    { day: 'Thu', revenue: 47300 },
    { day: 'Fri', revenue: 52600 },
    { day: 'Sat', revenue: 44900 },
    { day: 'Sun', revenue: 39200 },
  ],
  Month: supplierDailyRevenue,
  Year: [
    { day: 'Jan', revenue: 680000  },
    { day: 'Feb', revenue: 720000  },
    { day: 'Mar', revenue: 810000  },
    { day: 'Apr', revenue: 930000  },
    { day: 'May', revenue: 870000  },
    { day: 'Jun', revenue: 950000  },
    { day: 'Jul', revenue: 1020000 },
    { day: 'Aug', revenue: 980000  },
    { day: 'Sep', revenue: 1100000 },
    { day: 'Oct', revenue: 1060000 },
    { day: 'Nov', revenue: 1180000 },
    { day: 'Dec', revenue: 1284750 },
  ],
};
