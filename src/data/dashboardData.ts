export const orderTrendData = [
  { date: '30 Nov', orders: 220, spend: 85000 },
  { date: '2 Dec', orders: 410, spend: 142000 },
  { date: '4 Dec', orders: 280, spend: 96000 },
  { date: '6 Dec', orders: 520, spend: 198000 },
  { date: '8 Dec', orders: 340, spend: 118000 },
  { date: '10 Dec', orders: 480, spend: 175000 },
  { date: '12 Dec', orders: 390, spend: 140000 },
  { date: '14 Dec', orders: 600, spend: 225000 },
  { date: '16 Dec', orders: 518, spend: 192000 },
  { date: '18 Dec', orders: 460, spend: 168000 },
  { date: '20 Dec', orders: 530, spend: 210000 },
  { date: '22 Dec', orders: 470, spend: 180000 },
  { date: '24 Dec', orders: 380, spend: 145000 },
  { date: '26 Dec', orders: 310, spend: 115000 },
  { date: '28 Dec', orders: 420, spend: 158000 },
];

export const stockStatusData = [
  { name: 'In Stock', value: 225, color: '#3D005E' },
  { name: 'Low Stock', value: 205, color: '#9d1fff' },
  { name: 'Out of Stock', value: 70, color: '#d1b3ff' },
  { name: 'New Orders', value: 165, color: '#FFD680' },
];

export const ordersByBranchData = [
  { branch: 'Chn - Suwaldi', orders: 123, target: 150 },
  { branch: 'Chn - Rewdah', orders: 72, target: 100 },
  { branch: 'Tiko - King Fahad', orders: 315, target: 350 },
  { branch: 'UlB - Almafi', orders: 22, target: 50 },
  { branch: 'Sons - Hittin', orders: 43, target: 60 },
  { branch: 'Chn - Wadi Laban', orders: 89, target: 110 },
  { branch: 'UlB - Almalaz', orders: 8, target: 30 },
  { branch: 'Tiko - Sanafa', orders: 94, target: 120 },
  { branch: 'Chn - Suwaldi', orders: 76, target: 150 },
];

export const recentOrders = [
  {
    id: '#EQASSU',
    product: 'Frozen Chicken 1 Kilo',
    amount: 20,
    total: 1200,
    date: '11-29-2023',
    status: 'Pending',
    branch: 'Chn - Rawdah',
    supplier: 'Tamimi Markets',
  },
  {
    id: '#FFSMJ0',
    product: 'Frozen Mixed Vegetables 2.5 Kilos',
    amount: 45,
    total: 2450,
    date: '11-29-2023',
    status: 'Delivered',
    branch: 'Tiko - King Fahad',
    supplier: 'Al Jazira Supermarkets',
  },
  {
    id: '#EQASLU',
    product: 'Frozen Chicken 1 Kilo',
    amount: 20,
    total: 1200,
    date: '11-29-2023',
    status: 'Cancelled',
    branch: 'Chn - Rawdah',
    supplier: 'Tamimi Markets',
  },
  {
    id: '#EQASSU',
    product: 'Frozen Chicken 1 Kilo',
    amount: 20,
    total: 1200,
    date: '11-29-2023',
    status: 'Pending',
    branch: 'Chn - Rawdah',
    supplier: 'Tamimi Markets',
  },
  {
    id: '#FFSMJ0',
    product: 'Frozen Mixed Vegetables 2.5 Kilos',
    amount: 45,
    total: 2450,
    date: '11-29-2023',
    status: 'Delivered',
    branch: 'Tiko - King Fahad',
    supplier: 'Al Jazira Supermarkets',
  },
];

export const topSuppliers = [
  { name: 'Tamimi Markets', orders: 842, logo: 'T', color: '#3D005E' },
  { name: 'Dole', orders: 610, logo: 'D', color: '#0052A5' },
  { name: 'Al Jazira', orders: 528, logo: 'AJ', color: '#008000' },
  { name: 'Panda', orders: 412, logo: 'P', color: '#FF0000' },
  { name: 'Carrefour', orders: 398, logo: 'C', color: '#004A97' },
  { name: 'Almarai', orders: 287, logo: 'AM', color: '#00873E' },
];

/* ─── Merchant KPI by period ─── */
export const merchantKpiByPeriod: Record<string, {
  orders: string; spend: string; avg: string;
  ordersSub: string; spendSub: string; avgSub: string;
  ordersChange: { value: string; positive: boolean };
  spendChange:  { value: string; positive: boolean };
  avgChange:    { value: string; positive: boolean };
}> = {
  Today: {
    orders: '847',            spend: '239,218 SAR',      avg: '282.43 SAR',
    ordersSub: '8 branches · today',
    spendSub:  'vs 214,320 SAR yesterday',
    avgSub:    'per order average',
    ordersChange: { value: '12%', positive: true  },
    spendChange:  { value: '11%', positive: true  },
    avgChange:    { value: '3%',  positive: true  },
  },
  Week: {
    orders: '3,218',          spend: '912,340 SAR',      avg: '283.52 SAR',
    ordersSub: '8 branches · this week',
    spendSub:  'vs 774,720 SAR last week',
    avgSub:    'per order average',
    ordersChange: { value: '24%', positive: true  },
    spendChange:  { value: '18%', positive: true  },
    avgChange:    { value: '5%',  positive: true  },
  },
  Month: {
    orders: '13,526',         spend: '3,827,455 SAR',    avg: '282.97 SAR',
    ordersSub: '8 branches · this month',
    spendSub:  'vs 7,356,652 SAR last month',
    avgSub:    'per order average',
    ordersChange: { value: '100%', positive: true  },
    spendChange:  { value: '48%',  positive: false },
    avgChange:    { value: '12%',  positive: false },
  },
  Year: {
    orders: '142,800',        spend: '40,421,320 SAR',   avg: '283.06 SAR',
    ordersSub: '8 branches · this year',
    spendSub:  'vs 31,548,000 SAR last year',
    avgSub:    'per order average',
    ordersChange: { value: '32%', positive: true  },
    spendChange:  { value: '28%', positive: true  },
    avgChange:    { value: '11%', positive: true  },
  },
};

/* ─── Order trend by period ─── */
export const orderTrendByPeriod: Record<string, Array<{ date: string; orders: number; spend: number }>> = {
  Today: [
    { date: '08:00', orders: 32,   spend: 9200   },
    { date: '09:00', orders: 58,   spend: 16800  },
    { date: '10:00', orders: 81,   spend: 23400  },
    { date: '11:00', orders: 124,  spend: 35900  },
    { date: '12:00', orders: 98,   spend: 28400  },
    { date: '13:00', orders: 72,   spend: 20900  },
    { date: '14:00', orders: 116,  spend: 33600  },
    { date: '15:00', orders: 134,  spend: 38800  },
    { date: '16:00', orders: 102,  spend: 29500  },
    { date: '17:00', orders: 87,   spend: 25200  },
  ],
  Week: [
    { date: 'Mon', orders: 1820, spend: 512000 },
    { date: 'Tue', orders: 2140, spend: 603000 },
    { date: 'Wed', orders: 1580, spend: 445000 },
    { date: 'Thu', orders: 2430, spend: 685000 },
    { date: 'Fri', orders: 2810, spend: 792000 },
    { date: 'Sat', orders: 2250, spend: 634000 },
    { date: 'Sun', orders: 1960, spend: 552000 },
  ],
  Month: orderTrendData,
  Year: [
    { date: 'Jan', orders: 10200,  spend: 2890000  },
    { date: 'Feb', orders: 9800,   spend: 2774000  },
    { date: 'Mar', orders: 11400,  spend: 3226000  },
    { date: 'Apr', orders: 13100,  spend: 3708000  },
    { date: 'May', orders: 12600,  spend: 3565000  },
    { date: 'Jun', orders: 14200,  spend: 4021000  },
    { date: 'Jul', orders: 13800,  spend: 3906000  },
    { date: 'Aug', orders: 12900,  spend: 3651000  },
    { date: 'Sep', orders: 15100,  spend: 4276000  },
    { date: 'Oct', orders: 14600,  spend: 4133000  },
    { date: 'Nov', orders: 16200,  spend: 4588000  },
    { date: 'Dec', orders: 14900,  spend: 4218000  },
  ],
};

/* ─── Stock status by period ─── */
export const stockStatusByPeriod: Record<string, Array<{ name: string; value: number; color: string }>> = {
  Today: [
    { name: 'In Stock',     value: 218, color: '#3D005E' },
    { name: 'Low Stock',    value: 198, color: '#9d1fff' },
    { name: 'Out of Stock', value: 84,  color: '#d1b3ff' },
    { name: 'New Orders',   value: 142, color: '#FFD680' },
  ],
  Week: [
    { name: 'In Stock',     value: 231, color: '#3D005E' },
    { name: 'Low Stock',    value: 187, color: '#9d1fff' },
    { name: 'Out of Stock', value: 62,  color: '#d1b3ff' },
    { name: 'New Orders',   value: 185, color: '#FFD680' },
  ],
  Month: stockStatusData,
  Year: [
    { name: 'In Stock',     value: 248, color: '#3D005E' },
    { name: 'Low Stock',    value: 172, color: '#9d1fff' },
    { name: 'Out of Stock', value: 55,  color: '#d1b3ff' },
    { name: 'New Orders',   value: 210, color: '#FFD680' },
  ],
};

export const supplierTrackingStats = [
  { name: 'Tamimi Markets', logo: 'TM', color: '#3D005E', totalOrders: 395, totalSpend: 1482.55, canceled: 52, orderTrend: 24, spendTrend: -12 },
  { name: 'Dole', logo: 'DO', color: '#0052A5', totalOrders: 280, totalSpend: 1050.20, canceled: 35, orderTrend: 18, spendTrend: -8 },
  { name: 'Al Jazira', logo: 'AJ', color: '#006E33', totalOrders: 210, totalSpend: 850.00, canceled: 22, orderTrend: 12, spendTrend: 5 },
  { name: 'Panda', logo: 'PA', color: '#CC0000', totalOrders: 165, totalSpend: 620.50, canceled: 18, orderTrend: -5, spendTrend: -15 },
  { name: 'Carrefour', logo: 'CA', color: '#004A97', totalOrders: 142, totalSpend: 540.75, canceled: 12, orderTrend: 8, spendTrend: 3 },
  { name: 'Almarai', logo: 'AM', color: '#00873E', totalOrders: 98, totalSpend: 380.30, canceled: 8, orderTrend: -3, spendTrend: -20 },
];
