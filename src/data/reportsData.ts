/* ─── Spending trend (daily, 30 days) ─── */
export const spendingTrend = [
  { date: '01 Apr', spend: 18200, orders: 24, items: 820 },
  { date: '02 Apr', spend: 21500, orders: 29, items: 1050 },
  { date: '03 Apr', spend: 15800, orders: 18, items: 640 },
  { date: '04 Apr', spend: 27300, orders: 35, items: 1380 },
  { date: '05 Apr', spend: 24100, orders: 31, items: 1200 },
  { date: '06 Apr', spend: 19600, orders: 26, items: 940 },
  { date: '07 Apr', spend: 22400, orders: 30, items: 1100 },  // week 1
  { date: '08 Apr', spend: 31200, orders: 42, items: 1620 },
  { date: '09 Apr', spend: 28900, orders: 38, items: 1490 },
  { date: '10 Apr', spend: 35600, orders: 47, items: 1850 },
  { date: '11 Apr', spend: 26700, orders: 33, items: 1310 },
  { date: '12 Apr', spend: 29800, orders: 39, items: 1530 },
  { date: '13 Apr', spend: 33400, orders: 44, items: 1720 },
  { date: '14 Apr', spend: 38100, orders: 51, items: 2010 },  // week 2
  { date: '15 Apr', spend: 41200, orders: 55, items: 2180 },
  { date: '16 Apr', spend: 44800, orders: 60, items: 2350 },
  { date: '17 Apr', spend: 39500, orders: 52, items: 2050 },
  { date: '18 Apr', spend: 47300, orders: 63, items: 2480 },
  { date: '19 Apr', spend: 43100, orders: 57, items: 2250 },
  { date: '20 Apr', spend: 51600, orders: 68, items: 2710 },
  { date: '21 Apr', spend: 48200, orders: 64, items: 2530 },  // week 3
  { date: '22 Apr', spend: 52900, orders: 70, items: 2780 },
  { date: '23 Apr', spend: 46400, orders: 61, items: 2420 },
  { date: '24 Apr', spend: 55800, orders: 74, items: 2930 },
  { date: '25 Apr', spend: 49700, orders: 66, items: 2600 },
  { date: '26 Apr', spend: 58300, orders: 77, items: 3060 },
  { date: '27 Apr', spend: 53100, orders: 70, items: 2790 },
  { date: '28 Apr', spend: 61400, orders: 81, items: 3240 },  // week 4
  { date: '29 Apr', spend: 57200, orders: 75, items: 3010 },
  { date: '30 Apr', spend: 64800, orders: 86, items: 3400 },
];

export const spendingWeekly = [
  { date: 'Week 1', spend: 148900, orders: 193, items: 7130 },
  { date: 'Week 2', spend: 224700, orders: 294, items: 11520 },
  { date: 'Week 3', spend: 329300, orders: 435, items: 17790 },
  { date: 'Week 4', spend: 394600, orders: 517, items: 20900 },
];

/* ─── Category breakdown ─── */
export const categoryBreakdown = [
  { name: 'Dairy & Eggs',    value: 312400, pct: 28.4, color: '#3D005E' },
  { name: 'Poultry & Meat',  value: 231600, pct: 21.0, color: '#9d1fff' },
  { name: 'Frozen Foods',    value: 176800, pct: 16.1, color: '#FFD680' },
  { name: 'Beverages',       value: 143200, pct: 13.0, color: '#d1b3ff' },
  { name: 'Vegetables',      value: 98700,  pct:  8.9, color: '#7c00d4' },
  { name: 'Fruits',          value: 72300,  pct:  6.6, color: '#f5c842' },
  { name: 'Grains & Rice',   value: 38900,  pct:  3.5, color: '#2a0042' },
  { name: 'Other',           value: 27100,  pct:  2.5, color: '#d1b3ff' },
];

/* ─── Statistics table rows ─── */
export const statisticsRows = [
  { date: '07.04.2025', orders: 6,  items: 600,  expense: 1000,  avgPct: 3.49  },
  { date: '08.04.2025', orders: 3,  items: 1500, expense: 2000,  avgPct: 6.97  },
  { date: '09.04.2025', orders: 5,  items: 3700, expense: 3000,  avgPct: 10.46 },
  { date: '10.04.2025', orders: 7,  items: 2500, expense: 4000,  avgPct: 13.94 },
  { date: '11.04.2025', orders: 5,  items: 500,  expense: 5000,  avgPct: 17.43 },
  { date: '12.04.2025', orders: 4,  items: 600,  expense: 6000,  avgPct: 20.91 },
  { date: '13.04.2025', orders: 8,  items: 568,  expense: 7688,  avgPct: 26.80 },
];

/* ─── Top suppliers ─── */
export const topSuppliers = [
  { rank: 1, name: 'Miyad International Food Company',  logo: 'MI', color: '#3D005E', spend: 312400, orders: 842, avgOrder: 370.8, trend: +12.4 },
  { rank: 2, name: 'Tamimi Markets',                    logo: 'TM', color: '#C8102E', spend: 241600, orders: 634, avgOrder: 381.1, trend: +5.2  },
  { rank: 3, name: 'Al Jazira Supermarkets',            logo: 'AJ', color: '#006E33', spend: 198300, orders: 528, avgOrder: 375.6, trend: -2.1  },
  { rank: 4, name: 'Almarai Co.',                       logo: 'AM', color: '#00873E', spend: 154700, orders: 412, avgOrder: 375.5, trend: +8.7  },
  { rank: 5, name: 'Sadafco',                           logo: 'SD', color: '#003087', spend: 98200,  orders: 287, avgOrder: 342.2, trend: +3.3  },
  { rank: 6, name: 'Nada Dairy',                        logo: 'ND', color: '#EE3124', spend: 76400,  orders: 198, avgOrder: 385.9, trend: -1.8  },
  { rank: 7, name: 'Saudia Foods',                      logo: 'SF', color: '#006400', spend: 54800,  orders: 156, avgOrder: 351.3, trend: +6.1  },
  { rank: 8, name: 'Puck Arabia',                        logo: 'PK', color: '#E8A000', spend: 43900,  orders: 124, avgOrder: 354.0, trend: +15.2 },
  { rank: 9, name: 'Albaik Foods',                       logo: 'AB', color: '#8B0000', spend: 32100,  orders: 97,  avgOrder: 331.0, trend: +4.5  },
  { rank: 10, name: 'Sunbulah Group',                    logo: 'SG', color: '#4a0072', spend: 21800,  orders: 68,  avgOrder: 320.6, trend: -0.9  },
];

/* ─── Low stock alerts ─── */
export const lowStockAlerts = [
  { product: 'Almarai Fresh Full Fat Milk – 2L',         category: 'Dairy',    stock: 12,  reorderPoint: 50,  lastOrdered: '3 days ago',  severity: 'critical' as const, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=56&h=56&fit=crop' },
  { product: 'Puck Cream Cheese Spreadable – 500g',      category: 'Dairy',    stock: 28,  reorderPoint: 60,  lastOrdered: '5 days ago',  severity: 'low'      as const, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=56&h=56&fit=crop' },
  { product: 'Rana Frozen Chicken Whole – 1.5kg',        category: 'Poultry',  stock: 8,   reorderPoint: 30,  lastOrdered: '2 days ago',  severity: 'critical' as const, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=56&h=56&fit=crop' },
  { product: 'Barakat Frozen Mixed Vegetables – 2.5kg',  category: 'Frozen',   stock: 35,  reorderPoint: 80,  lastOrdered: '7 days ago',  severity: 'low'      as const, image: 'https://images.unsplash.com/photo-1576181256399-834e3ef79b65?w=56&h=56&fit=crop' },
  { product: 'Saudia Long Life Juice Orange – 1L × 6',   category: 'Beverages',stock: 15,  reorderPoint: 40,  lastOrdered: '4 days ago',  severity: 'medium'   as const, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=56&h=56&fit=crop' },
  { product: 'Nada Long Life UHT Full Fat Milk – 12×1L', category: 'Dairy',    stock: 22,  reorderPoint: 48,  lastOrdered: '6 days ago',  severity: 'medium'   as const, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=56&h=56&fit=crop' },
];

/* ─── Summary KPIs for different periods ─── */
export const kpiByPeriod = {
  Today:  { spending: 64800,   prevSpending: 57200,  orders: 86,  prevOrders: 75,  items: 3400 },
  Week:   { spending: 394600,  prevSpending: 329300, orders: 517, prevOrders: 435, items: 20900 },
  Month:  { spending: 1101500, prevSpending: 948200, orders: 1439,prevOrders: 1245,items: 52220 },
  Year:   { spending: 8342000, prevSpending: 6910000,orders: 9840,prevOrders: 8200,items: 394800 },
};
