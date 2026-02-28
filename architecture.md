# Technical Architecture

## Stack
- **Frontend:** React with Vite (TypeScript).
- **Styling:** Tailwind CSS + shadcn/ui.
- **Database/Auth:** Supabase.
- **Icons:** Phosphor Icons (via Lucide or dedicated library).
- **Deployment:** Vercel.

## Directory Structure
- `/src/pages/merchant`: Dashboard, Catalog, ProductDetail, Cart, Reports.
- `/src/pages/supplier`: Dashboard, AddProduct, Inventory, Reports.
- `/src/components/shared`: Sidebar, Topbar, AI-Sidebar, ProductCard.
- `/src/hooks`: Data fetching and state management.
- `/src/lib`: Supabase client configuration.