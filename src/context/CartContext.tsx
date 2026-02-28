import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';

export interface CartItem {
  productId: string;
  productTitle: string;
  productImage: string;
  supplierId: string;
  supplierName: string;
  supplierLogo: string;
  supplierColor: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  unit: string;
  deliveryDays: string;
  promoNote?: string;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string, supplierId: string) => void;
  updateQty: (productId: string, supplierId: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

/* ── Seed items so checkout looks great on first load ── */
const SEED_ITEMS: CartItem[] = [
  {
    productId: '1',
    productTitle: 'Almarai Fresh Milk Full Fat – 2L',
    productImage: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&h=200&fit=crop',
    supplierId: 'so1',
    supplierName: 'Miyad International Food Industry Company',
    supplierLogo: 'MI',
    supplierColor: '#3D005E',
    price: 10.0,
    originalPrice: 12.5,
    quantity: 1,
    unit: '2L Carton',
    deliveryDays: 'Same day delivery',
    promoNote: 'Buy 1 more of the same product the other one is free!',
  },
  {
    productId: '11-b',
    productTitle: 'Saha Lutein Eggs Grade AA – 15 Pieces',
    productImage: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=200&h=200&fit=crop',
    supplierId: 'so1',
    supplierName: 'Miyad International Food Industry Company',
    supplierLogo: 'MI',
    supplierColor: '#3D005E',
    price: 500.0,
    originalPrice: 600.0,
    quantity: 50,
    unit: 'Box',
    deliveryDays: 'Same day delivery',
    promoNote: 'Limited time offer: Buy 2 get 1 free!',
  },
  {
    productId: '11-c',
    productTitle: 'Golden Chicken Whole Fresh Big Size – 1200G',
    productImage: 'https://images.unsplash.com/photo-1604503468506-a8da13d11d36?w=200&h=200&fit=crop',
    supplierId: 'so1',
    supplierName: 'Miyad International Food Industry Company',
    supplierLogo: 'MI',
    supplierColor: '#3D005E',
    price: 10000.0,
    quantity: 12,
    unit: '1.2 kg',
    deliveryDays: 'Same day delivery',
  },
  {
    productId: '3',
    productTitle: 'Almarai Cheese Slices Cheddar – 40G',
    productImage: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&h=200&fit=crop',
    supplierId: 'so-hadi',
    supplierName: 'Hadi Food and Drink Trading Co.',
    supplierLogo: 'HF',
    supplierColor: '#C8102E',
    price: 30.0,
    originalPrice: 38.85,
    quantity: 3,
    unit: '10 Slices',
    deliveryDays: 'Deliver on Sunday',
    promoNote: 'Limited time offer: Buy 2 get 1 free!',
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(SEED_ITEMS);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback(
    (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      setItems((prev) => {
        const key = `${newItem.productId}-${newItem.supplierId}`;
        const exists = prev.find(
          (i) => `${i.productId}-${i.supplierId}` === key
        );
        if (exists) {
          return prev.map((i) =>
            `${i.productId}-${i.supplierId}` === key
              ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) }
              : i
          );
        }
        return [...prev, { ...newItem, quantity: newItem.quantity ?? 1 }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((productId: string, supplierId: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.supplierId === supplierId)
      )
    );
  }, []);

  const updateQty = useCallback(
    (productId: string, supplierId: string, qty: number) => {
      if (qty < 1) return;
      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId && i.supplierId === supplierId
            ? { ...i, quantity: qty }
            : i
        )
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        openCart,
        closeCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
