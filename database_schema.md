# Database Schema

## Tables
1. [cite_start]**users:** id, email, role (merchant/supplier), business_name. [cite: 2, 26, 31]
2. [cite_start]**products_master:** id, title, category, image_url, description, brand, rating. [cite: 56, 75]
3. [cite_start]**supplier_products:** id, product_id (FK), supplier_id (FK), sale_price, original_price, stock_amount, delivery_days. [cite: 153, 59]
4. [cite_start]**orders:** id, customer_id (FK), total_amount, status (pending/completed), created_at. [cite: 89, 94]
5. [cite_start]**branches:** id, merchant_id (FK), name, region. [cite: 13, 110]