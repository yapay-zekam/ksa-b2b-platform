import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  SquaresFour,
  Package,
  Truck,
  ShoppingCart,
  Warehouse,
  CreditCard,
  Invoice,
  ChartBar,
  ChartLine,
  Users,
  Storefront,
  ArrowSquareOut,
  List,
  CaretDown,
  Table,
  Gauge,
  Stack,
  Tag,
  Star,
  Buildings,
  Money,
  Handshake,
  PlusCircle,
  UserCircle,
  Headset,
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface SubItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: SubItem[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const merchantNav: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard',  href: '/merchant/dashboard',  icon: SquaresFour },
      { label: 'Products',   href: '/merchant/products',   icon: Package },
      { label: 'Suppliers',  href: '/merchant/suppliers',  icon: Truck },
      { label: 'Orders',     href: '/merchant/orders',     icon: ShoppingCart },
      { label: 'Inventory',  href: '/merchant/inventory',  icon: Warehouse },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Payments', href: '/merchant/payments', icon: CreditCard },
      { label: 'Invoices',  href: '/merchant/invoices',  icon: Invoice },
    ],
  },
  {
    title: 'Insights',
    items: [
      {
        label: 'Reports',
        href: '/merchant/reports',
        icon: ChartBar,
        children: [
          { label: 'Statistics',            href: '/merchant/reports?tab=statistics' },
          { label: 'Monitoring',            href: '/merchant/reports?tab=monitoring' },
          { label: 'Available Quantities',  href: '/merchant/reports?tab=quantities' },
          { label: 'Best Categories',       href: '/merchant/reports?tab=categories' },
          { label: 'Most Purchased',        href: '/merchant/reports?tab=purchased' },
          { label: 'Best Suppliers',        href: '/merchant/reports?tab=suppliers' },
          { label: 'Best Brands',           href: '/merchant/reports?tab=brands' },
          { label: 'Best Branches',         href: '/merchant/reports?tab=branches' },
          { label: 'Payment Distribution',  href: '/merchant/reports?tab=payments' },
        ],
      },
      { label: 'Analytics',   href: '/merchant/analytics',  icon: ChartLine },
    ],
  },
  {
    title: 'User Management',
    items: [
      { label: 'Users and Branches', href: '/merchant/users', icon: Users },
    ],
  },
];

const supplierNav: NavSection[] = [
  {
    items: [
      { label: 'Dashboard', href: '/supplier/dashboard', icon: SquaresFour },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Add Product', href: '/supplier/add-product', icon: PlusCircle },
      { label: 'My Products', href: '/supplier/products',    icon: Package },
      { label: 'Inventory',   href: '/supplier/inventory',   icon: Warehouse },
    ],
  },
  {
    title: 'Sales',
    items: [
      { label: 'Orders',   href: '/supplier/orders',   icon: ShoppingCart },
      { label: 'Payments', href: '/supplier/payments', icon: CreditCard },
      { label: 'Invoices', href: '/supplier/invoices', icon: Invoice },
    ],
  },
  {
    title: 'Insights',
    items: [
      {
        label: 'Reports',
        href: '/supplier/reports',
        icon: ChartBar,
        children: [
          { label: 'Statistics',       href: '/supplier/reports' },
          { label: 'Sales Monitoring', href: '/supplier/sales-monitoring' },
          { label: 'Best Categories',      href: '/supplier/reports?tab=categories' },
          { label: 'Top Merchants',        href: '/supplier/reports?tab=merchants' },
          { label: 'Payment Distribution', href: '/supplier/reports?tab=payments' },
        ],
      },
      { label: 'Analytics', href: '/supplier/analytics', icon: ChartLine },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile',     href: '/supplier/profile',    icon: UserCircle },
      { label: 'Storefront',  href: '/supplier/storefront', icon: Storefront },
      { label: 'Users',       href: '/supplier/users',      icon: Users },
      { label: 'Support',     href: '/supplier/support',    icon: Headset },
    ],
  },
];

/* Icon map for sub-items */
const SUB_ICONS: Record<string, React.ElementType> = {
  Statistics:             Table,
  Monitoring:             Gauge,
  'Available Quantities': Stack,
  'Best Categories':      Tag,
  'Most Purchased':       Star,
  'Best Suppliers':       Truck,
  'Best Brands':          Star,
  'Best Branches':        Buildings,
  'Payment Distribution': Money,
  'Sales Monitoring':     Gauge,
  'Top Merchants':        Handshake,
};

interface SidebarProps {
  role: 'merchant' | 'supplier';
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ role, collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navSections = role === 'merchant' ? merchantNav : supplierNav;

  /* track which expandable items are open */
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleOpen = (href: string) => {
    setOpenItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const isParentActive = (item: NavItem) =>
    location.pathname === item.href ||
    location.pathname.startsWith(item.href + '/') ||
    (item.children?.some((c) => location.pathname === c.href.split('?')[0]) ?? false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out',
        'bg-[#3D005E]',
        collapsed ? 'w-[68px]' : 'w-[220px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-white/10 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5 flex-1 min-w-0 overflow-hidden">
            <img src="/logo-white.png" alt="Logo" style={{ width: '120px', height: '28px' }} className="object-contain" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white shrink-0',
            collapsed && 'mx-auto'
          )}
        >
          <List size={18} />
        </button>
      </div>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 pt-3 pb-1">
          <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">
            {role === 'merchant' ? 'Merchant Panel' : 'Supplier Panel'}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title} className="mb-2">
            {!collapsed && section.title && (
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/50">
                {section.title}
              </p>
            )}

            {section.items.map((item) => {
              const Icon = item.icon;
              const active  = isParentActive(item);
              const hasKids = !!(item.children?.length);
              const isOpen  = openItems.includes(item.href);

              return (
                <div key={item.href}>
                  {/* Parent item */}
                  {hasKids ? (
                    /* Expandable — clicking toggles sub-menu AND navigates */
                    <button
                      onClick={() => toggleOpen(item.href)}
                      className={cn(
                        'w-full flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                        'text-white/80 hover:text-white hover:bg-white/10',
                        active && 'bg-white/15 text-white',
                        collapsed && 'mx-auto justify-center'
                      )}
                      title={collapsed ? item.label : undefined}
                      style={{ width: collapsed ? 'calc(100% - 16px)' : 'calc(100% - 16px)' }}
                    >
                      <Icon
                        size={18}
                        weight="light"
                        className={cn('shrink-0', active ? 'text-white' : 'text-white/80')}
                      />
                      {!collapsed && (
                        <>
                          <span className="truncate whitespace-nowrap flex-1 text-left">{item.label}</span>
                          <CaretDown
                            size={12}
                            className={cn(
                              'shrink-0 transition-transform duration-200',
                              isOpen ? 'rotate-0' : '-rotate-90',
                              active ? 'text-white/80' : 'text-white/80'
                            )}
                          />
                        </>
                      )}
                    </button>
                  ) : (
                    <NavLink
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                        'text-white/80 hover:text-white hover:bg-white/10',
                        active && 'bg-white/15 text-white'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon
                        size={18}
                        weight="light"
                        className={cn('shrink-0', active ? 'text-white' : 'text-white/80')}
                      />
                      {!collapsed && (
                        <span className="truncate whitespace-nowrap">{item.label}</span>
                      )}
                      {active && !collapsed && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
                      )}
                    </NavLink>
                  )}

                  {/* Sub-items */}
                  {hasKids && !collapsed && isOpen && (
                    <div className="ml-4 mr-2 mt-0.5 mb-1 border-l border-white/10 pl-2 space-y-0.5">
                      {item.children!.map((child) => {
                        const SubIcon = SUB_ICONS[child.label] ?? Tag;
                        const childPath = child.href.split('?')[0];
                        const isChildActive = location.pathname === childPath && location.search.includes(child.href.split('?')[1] ?? '');
                        return (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            className={cn(
                              'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                              'text-white/70 hover:text-white hover:bg-white/8',
                              isChildActive && 'bg-white/10 text-white'
                            )}
                          >
                            <SubIcon size={13} weight="light" className="shrink-0 text-white/60" />
                            <span className="truncate">{child.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Upgrade Plan Card */}
      {!collapsed && (
        <div className="px-3 pb-3 pt-3 border-t border-white/10">
          <div className="rounded-2xl bg-white/10 border border-white/20 p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-gold-400/20 flex items-center justify-center shrink-0">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.5 1L8.09 4.58L12 5.07L9.25 7.74L9.93 11.63L6.5 9.77L3.07 11.63L3.75 7.74L1 5.07L4.91 4.58L6.5 1Z" fill="#FFD680" stroke="#FFD680" strokeWidth="0.8" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[11px] font-semibold text-white/80 leading-tight">Upgrade your plan</p>
            </div>
            <p className="text-[10px] text-white/50 mb-3 leading-relaxed">
              Upgrade to unlock AI insights
            </p>
            <button className="w-full py-2 rounded-xl bg-gold-400 text-brand-900 text-xs font-bold hover:bg-gold-300 transition-colors tracking-wide">
              Upgrade Plan
            </button>
          </div>
        </div>
      )}

      {/* Switch Panel */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10">
          <NavLink
            to={role === 'merchant' ? '/supplier/dashboard' : '/merchant/dashboard'}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <ArrowSquareOut size={14} weight="light" />
            Switch to {role === 'merchant' ? 'Supplier' : 'Merchant'} Panel
          </NavLink>
        </div>
      )}
    </aside>
  );
}
