# 📖 Panduan Lengkap BrewOps Coffee Shop SaaS

**Versi:** 1.0.0  
**Tanggal:** 28 Mei 2026  
**Platform:** Multi-tenant SaaS untuk Manajemen Coffee Shop

---

## 📋 Daftar Isi

1. [Pengenalan Sistem](#pengenalan-sistem)
2. [Arsitektur & Teknologi](#arsitektur--teknologi)
3. [Fitur Utama](#fitur-utama)
4. [Panduan Penggunaan](#panduan-penggunaan)
5. [Integrasi & API](#integrasi--api)
6. [Database Schema](#database-schema)
7. [Keamanan](#keamanan)
8. [Deployment](#deployment)

---

## 🎯 Pengenalan Sistem

### Apa itu BrewOps?

BrewOps adalah platform **SaaS (Software as a Service)** berbasis cloud yang dirancang khusus untuk manajemen coffee shop modern. Platform ini menyediakan solusi lengkap mulai dari Point of Sale (POS), manajemen inventori, penjadwalan staff, hingga prediksi penjualan berbasis AI.

### Keunggulan Utama

✅ **Multi-tenant Architecture** - Satu sistem untuk banyak coffee shop  
✅ **Real-time Analytics** - Dashboard live dengan data terkini  
✅ **AI-Powered Predictions** - Prediksi penjualan & stok otomatis  
✅ **Mobile-Friendly** - Responsive di semua perangkat  
✅ **Offline Fallback** - Tetap berjalan tanpa koneksi database  
✅ **Role-Based Access** - Kontrol akses berdasarkan peran  
✅ **QR Code Menu** - Menu online untuk pelanggan

---

## 🏗️ Arsitektur & Teknologi

### Tech Stack

#### Frontend
- **Next.js 16.2.6** - React framework dengan App Router
- **React 19.2.4** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library (500+ icons)
- **Recharts 3.8.1** - Chart & visualization library

#### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma 7.8.0** - ORM untuk database
- **PostgreSQL** - Relational database
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing

#### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Prisma Studio** - Database GUI


### Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │    Tablet    │      │
│  │   Desktop    │  │    Phone     │  │    Device    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Next.js App Router (React 19)              │   │
│  │  • Server Components  • Client Components            │   │
│  │  • Streaming SSR      • Suspense Boundaries          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   MIDDLEWARE LAYER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • Authentication Check  • Role-Based Access Control │   │
│  │  • Session Validation    • Route Protection          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API LAYER                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js API Routes (Serverless)              │   │
│  │  /api/auth/*     /api/pos/*      /api/inventory/*   │   │
│  │  /api/staff/*    /api/customers/* /api/dashboard/*  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  • Authentication Logic  • AI Prediction Engine      │   │
│  │  • Order Processing      • Inventory Management      │   │
│  │  • Staff Scheduling      • Analytics Calculation     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Prisma ORM                              │   │
│  │  • Type-safe queries  • Migration management         │   │
│  │  • Connection pooling • Transaction support          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                     │   │
│  │  • Multi-tenant data  • ACID compliance              │   │
│  │  • Relational integrity • Backup & recovery          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```


---

## 🎨 Fitur Utama

### 1. 🏠 Landing Page (Homepage)

**URL:** `/`

**Fitur:**
- ✨ **Hero Section** dengan animasi smooth
- 📊 **Feature Showcase** - 6 fitur utama dengan hover effects
- 💡 **Benefits Section** - Keuntungan menggunakan BrewOps
- ⭐ **Testimonials** - Review dari 3 customer
- 💰 **Pricing Plans** - 3 tier pricing (Starter, Professional, Enterprise)
- 🎭 **Interactive Navigation** - Smooth scroll ke sections
- 📱 **Mobile Menu** - Hamburger menu untuk mobile

**Animasi:**
- Floating particles background
- 3D parallax card effect
- Staggered entrance animations
- Hover lift effects
- Gradient text animations

**SEO Optimized:**
- Meta tags lengkap
- Open Graph tags
- Twitter Cards
- JSON-LD structured data
- Sitemap.xml
- Robots.txt

---

### 2. 🔐 Authentication System

#### A. Register (Pendaftaran)

**URL:** `/register`

**Fitur:**
- Pendaftaran coffee shop baru
- Otomatis membuat tenant & owner account
- Validasi slug unik untuk URL
- Password hashing dengan bcryptjs
- Auto-login setelah registrasi

**Form Fields:**
- Shop Name (nama coffee shop)
- Shop Slug (URL identifier, contoh: `brewops`)
- Owner Name (nama pemilik)
- Owner Email (email login)
- Owner Password (min 6 karakter)

**Proses:**
1. User mengisi form registrasi
2. System validasi data (email unik, slug unik)
3. Password di-hash dengan bcrypt
4. Buat tenant baru di database
5. Buat user owner dengan role OWNER
6. Generate JWT token
7. Set cookie session
8. Redirect ke dashboard


#### B. Login (Masuk)

**URL:** `/login`

**Fitur:**
- Login dengan email & password
- JWT token generation
- Session management dengan cookies
- Remember me functionality
- Error handling yang jelas

**Form Fields:**
- Email
- Password

**Proses:**
1. User input email & password
2. System cari user di database
3. Verify password dengan bcrypt.compare()
4. Generate JWT token dengan payload:
   - userId
   - tenantId
   - email
   - name
   - role
   - tenantSlug
5. Set cookie `session_token` (httpOnly)
6. Redirect ke dashboard

**Demo Credentials:**
```
Email: owner@brewops.com
Password: password123
```

#### C. Logout (Keluar)

**URL:** `/api/auth/logout` (POST)

**Proses:**
1. Clear session cookie
2. Return success response
3. Redirect ke login page

---

### 3. 📊 Dashboard (Panel Kontrol)

**URL:** `/dashboard`

**Role Access:** OWNER, MANAGER, STAFF (terbatas)

#### A. Dashboard Overview

**Fitur Utama:**
- 📈 **Real-time Statistics**
  - Total Revenue (hari ini)
  - Total Orders (hari ini)
  - Active Customers
  - Low Stock Alerts

- 📊 **Charts & Visualizations**
  - Sales Trend (7 hari terakhir) - Area Chart
  - Hourly Sales (24 jam) - Bar Chart
  - Product Sales Distribution - Pie Chart
  - Top Selling Products - List

- 🤖 **AI Insights**
  - Sales Forecast (7 hari ke depan)
  - Inventory Runout Predictions
  - Recommended Actions

- 🔔 **Notifications**
  - Low stock alerts
  - System notifications
  - Important updates

**Data Sources:**
- Orders (real-time)
- Products (catalog)
- Ingredients (inventory)
- Customers (loyalty)


#### B. Point of Sale (POS)

**URL:** `/dashboard/pos`

**Role Access:** OWNER, MANAGER, STAFF

**Fitur Lengkap:**

1. **Product Catalog**
   - Grid view dengan gambar produk
   - Filter by category (Espresso, Latte, Pastries, dll)
   - Search by product name
   - Quick add to cart

2. **Shopping Cart**
   - Add/remove items
   - Adjust quantity (+/-)
   - Product modifiers (Size, Milk Type, Extras)
   - Real-time price calculation
   - Subtotal, tax, total display

3. **Customer Selection**
   - Search customer by name/phone
   - Quick add new customer
   - Loyalty points display
   - Apply loyalty discount

4. **Payment Processing**
   - Multiple payment methods:
     - 💵 Cash
     - 💳 Credit Card
     - 📱 Digital Wallet (GoPay, OVO, Dana)
     - 🔄 Split Payment
   - Change calculation (untuk cash)
   - Payment reference ID

5. **Order Management**
   - Generate order number (#0001, #0002, dst)
   - Print receipt
   - Order history
   - Order status tracking

6. **Inventory Deduction**
   - Otomatis kurangi stok ingredient
   - Contoh: Order Latte → kurangi Coffee Beans, Milk
   - Support modifiers (Extra Shot → kurangi Coffee Beans lebih banyak)

**Workflow POS:**
```
1. Staff pilih produk → Add to cart
2. Adjust quantity & modifiers
3. Pilih customer (optional)
4. Review cart & total
5. Pilih payment method
6. Process payment
7. Generate receipt
8. Print (optional)
9. Inventory auto-deducted
10. Order saved to database
```


#### C. Inventory Management

**URL:** `/dashboard/inventory`

**Role Access:** OWNER, MANAGER

**Fitur:**

1. **Ingredient List**
   - Nama ingredient
   - SKU (Stock Keeping Unit)
   - Current stock
   - Unit (kg, liter, pcs)
   - Cost per unit
   - Supplier info
   - Stock status (Low/Balanced)

2. **Stock Alerts**
   - 🔴 Critical: Stock < 20% dari reorder point
   - 🟡 Low: Stock < 50% dari reorder point
   - 🟢 Balanced: Stock sufficient

3. **Stock Adjustment**
   - Manual adjustment (+/-)
   - Reason tracking (Restock, Waste, Adjustment)
   - Inventory log history
   - User tracking (who adjusted)

4. **Supplier Management**
   - Supplier list
   - Contact information
   - Order history
   - Quick reorder

5. **Inventory Logs**
   - Timestamp
   - Type (PURCHASE, USAGE, ADJUSTMENT, WASTE)
   - Quantity change
   - User who made change
   - Reason/notes

**Workflow Inventory:**
```
1. View ingredient list
2. Check stock levels
3. Identify low stock items
4. Click "Adjust Stock"
5. Enter adjustment amount (+/-)
6. Add reason
7. Submit
8. System logs the change
9. Stock updated in real-time
```

**Auto Deduction:**
- Setiap order di POS otomatis kurangi stok
- Contoh: 1 Latte = -18g Coffee Beans, -200ml Milk
- Support recipe-based deduction


#### D. Customer Management

**URL:** `/dashboard/customers`

**Role Access:** OWNER, MANAGER

**Fitur:**

1. **Customer Database**
   - Full name
   - Email address
   - Phone number
   - Loyalty points
   - Total orders
   - Total spent
   - Join date

2. **Loyalty Program**
   - Earn points per purchase
   - Point calculation: $1 = 10 points
   - Redeem points for discounts
   - Point history tracking

3. **Customer Actions**
   - Add new customer
   - Edit customer info
   - View order history
   - Send notifications (future)

4. **Customer Analytics**
   - Top customers by spending
   - Frequent buyers
   - Customer lifetime value
   - Retention rate

**Add Customer Form:**
- Name (required)
- Email (optional)
- Phone (optional)
- Initial loyalty points (default: 0)

---

#### E. Staff Management

**URL:** `/dashboard/staff`

**Role Access:** OWNER, MANAGER

**Fitur:**

1. **Staff List**
   - Staff name
   - Email
   - Role (OWNER/MANAGER/STAFF)
   - Current shift status
   - Total hours worked
   - Performance metrics

2. **Shift Management**
   - Clock In/Clock Out
   - Active shift tracking
   - Shift history
   - Hours calculation
   - Break time tracking

3. **Performance Tracking**
   - Orders handled
   - Sales generated
   - Average order value
   - Customer satisfaction

4. **Role-Based Access**
   - OWNER: Full access
   - MANAGER: All except settings
   - STAFF: POS only

**Clock In/Out Workflow:**
```
1. Staff login
2. Go to Staff page
3. Click "Clock In"
4. System records start time
5. Staff works (handle orders)
6. Click "Clock Out"
7. System calculates hours
8. Shift saved to database
```


#### F. AI Predictions

**URL:** `/dashboard/predictions`

**Role Access:** OWNER, MANAGER

**Fitur AI:**

1. **Sales Forecast**
   - Prediksi 7 hari ke depan
   - Based on historical data
   - Trend analysis
   - Confidence level
   - Chart visualization

2. **Inventory Runout Prediction**
   - Prediksi kapan stok habis
   - Based on usage rate
   - Days until runout
   - Recommended reorder date
   - Quantity to order

3. **AI Insights**
   - Peak hours identification
   - Best selling products
   - Slow moving items
   - Seasonal trends
   - Optimization recommendations

**AI Engine Logic:**
```javascript
// Sales Forecast
- Analyze last 30 days sales
- Calculate daily average
- Apply trend multiplier
- Add seasonal factor
- Generate 7-day forecast

// Inventory Runout
- Calculate daily usage rate
- Current stock / daily usage = days left
- If days < 7: Alert
- Suggest reorder quantity
```

**Contoh Output:**
```
Sales Forecast:
- Tomorrow: $1,250 (↑ 15%)
- Day 2: $1,180 (↓ 5%)
- Day 3: $1,350 (↑ 14%)

Inventory Alert:
- Coffee Beans: 3 days left
- Milk: 5 days left
- Reorder now to avoid stockout
```

---

#### G. Reports & Analytics

**URL:** `/dashboard/reports`

**Role Access:** OWNER, MANAGER

**Fitur:**

1. **Sales Reports**
   - Daily sales summary
   - Weekly comparison
   - Monthly trends
   - Year-over-year growth

2. **Product Performance**
   - Best sellers
   - Worst performers
   - Category breakdown
   - Profit margins

3. **Financial Reports**
   - Revenue by payment method
   - Cash vs Digital
   - Refunds & discounts
   - Net profit calculation

4. **Export Options**
   - PDF export
   - Excel export
   - CSV export
   - Email reports

5. **Date Range Filter**
   - Today
   - Yesterday
   - Last 7 days
   - Last 30 days
   - Custom range


#### H. Settings

**URL:** `/dashboard/settings`

**Role Access:** OWNER only

**Fitur:**

1. **Shop Settings**
   - Shop name
   - Address
   - Phone number
   - Tax rate (%)
   - Currency
   - Operating hours

2. **Payment Configuration**
   - Enable/disable payment methods
   - Digital wallet integration
   - Payment gateway settings
   - Transaction fees

3. **User Management**
   - Add staff accounts
   - Edit roles
   - Deactivate users
   - Password reset

4. **System Settings**
   - Language preference
   - Timezone
   - Date format
   - Currency format

5. **Backup & Export**
   - Database backup
   - Export all data
   - Import data
   - Restore from backup

---

### 4. 📱 Online Menu (Customer-Facing)

**URL:** `/menu/[tenantSlug]`

**Contoh:** `/menu/brewops`

**Akses:** Public (tidak perlu login)

**Fitur:**

1. **QR Code Menu**
   - Scan QR → Langsung ke menu
   - No app installation needed
   - Mobile-optimized

2. **Product Catalog**
   - Gambar produk
   - Nama & deskripsi
   - Harga
   - Category filter
   - Search function

3. **Shopping Cart**
   - Add to cart
   - Adjust quantity
   - View total
   - Table number input

4. **Mobile Ordering**
   - Order dari meja
   - Submit ke POS queue
   - Get order number
   - Pay at counter

5. **Promo Banner**
   - Special deals
   - Time-based offers
   - Seasonal promotions

**Workflow Customer:**
```
1. Scan QR code di meja
2. Browse menu
3. Add items to cart
4. Enter table number
5. Submit order
6. Get ticket number
7. Wait for order
8. Pay at counter/cashier
9. Collect order
```

**Benefits:**
- Reduce wait time
- Contactless ordering
- Accurate orders
- Better customer experience
- Staff focus on preparation


---

## 🔌 Integrasi & API

### API Endpoints

#### Authentication APIs

**1. Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "shopName": "My Coffee Shop",
  "shopSlug": "mycoffee",
  "ownerName": "John Doe",
  "ownerEmail": "john@example.com",
  "ownerPassword": "password123"
}

Response 200:
{
  "message": "Registration successful",
  "tenant": { ... },
  "user": { ... }
}
```

**2. Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "message": "Login successful",
  "user": {
    "id": "user-123",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "OWNER"
  },
  "tenant": {
    "id": "tenant-123",
    "name": "My Coffee Shop",
    "slug": "mycoffee"
  }
}

Set-Cookie: session_token=<JWT_TOKEN>; HttpOnly; Path=/
```

**3. Logout**
```http
POST /api/auth/logout

Response 200:
{
  "message": "Logged out successfully"
}
```

**4. Get Current User**
```http
GET /api/auth/me
Cookie: session_token=<JWT_TOKEN>

Response 200:
{
  "user": { ... },
  "tenant": { ... }
}
```


#### Dashboard APIs

**5. Get Dashboard Stats**
```http
GET /api/dashboard/stats
Cookie: session_token=<JWT_TOKEN>

Response 200:
{
  "todayRevenue": 1250.50,
  "todayOrders": 45,
  "activeCustomers": 120,
  "lowStockCount": 3,
  "salesTrend": [...],
  "hourlySales": [...],
  "topProducts": [...],
  "aiInsights": [...],
  "forecast": [...]
}
```

#### POS APIs

**6. Get Products**
```http
GET /api/pos/products
Cookie: session_token=<JWT_TOKEN>

Response 200:
[
  {
    "id": "prod-1",
    "name": "Caffe Latte",
    "price": 4.50,
    "category": "Latte",
    "imageUrl": "...",
    "modifiers": [...]
  },
  ...
]
```

**7. Create Order**
```http
POST /api/pos/orders
Cookie: session_token=<JWT_TOKEN>
Content-Type: application/json

{
  "customerId": "cust-123",
  "cartItems": [
    {
      "id": "prod-1",
      "name": "Caffe Latte",
      "price": 4.50,
      "quantity": 2,
      "selectedModifiers": [
        { "name": "Large", "priceAdjustment": 0.50 }
      ]
    }
  ],
  "paymentMethod": "CASH",
  "discountAmount": 0,
  "tableNumber": "Table #5",
  "source": "POS"
}

Response 200:
{
  "order": {
    "id": "order-123",
    "orderNumber": "#0045",
    "totalAmount": 10.80,
    "status": "COMPLETED"
  }
}
```

**8. Get Orders**
```http
GET /api/pos/orders
Cookie: session_token=<JWT_TOKEN>

Response 200:
[
  {
    "id": "order-123",
    "orderNumber": "#0045",
    "totalAmount": 10.80,
    "status": "COMPLETED",
    "createdAt": "2026-05-28T10:30:00Z",
    "items": [...],
    "customer": {...}
  },
  ...
]
```


#### Inventory APIs

**9. Get Ingredients**
```http
GET /api/inventory
Cookie: session_token=<JWT_TOKEN>

Response 200:
[
  {
    "id": "ing-1",
    "name": "Coffee Beans (Arabica)",
    "sku": "CB-001",
    "currentStock": 5000,
    "unit": "g",
    "costPerUnit": 0.05,
    "reorderPoint": 2000,
    "supplier": {...}
  },
  ...
]
```

**10. Adjust Stock**
```http
POST /api/inventory
Cookie: session_token=<JWT_TOKEN>
Content-Type: application/json

{
  "ingredientId": "ing-1",
  "adjustmentAmount": 1000,
  "reason": "Restock from supplier"
}

Response 200:
{
  "ingredient": {
    "id": "ing-1",
    "currentStock": 6000
  },
  "log": {...}
}
```

#### Customer APIs

**11. Get Customers**
```http
GET /api/customers
Cookie: session_token=<JWT_TOKEN>

Response 200:
[
  {
    "id": "cust-1",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "+1234567890",
    "loyaltyPoints": 250
  },
  ...
]
```

**12. Add Customer**
```http
POST /api/customers
Cookie: session_token=<JWT_TOKEN>
Content-Type: application/json

{
  "name": "Bob Smith",
  "email": "bob@example.com",
  "phone": "+0987654321"
}

Response 200:
{
  "customer": {
    "id": "cust-2",
    "name": "Bob Smith",
    "loyaltyPoints": 0
  }
}
```


#### Staff APIs

**13. Get Shifts**
```http
GET /api/staff
Cookie: session_token=<JWT_TOKEN>

Response 200:
[
  {
    "id": "shift-1",
    "userId": "user-123",
    "staff": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "startTime": "2026-05-28T08:00:00Z",
    "endTime": "2026-05-28T16:00:00Z",
    "status": "COMPLETED",
    "hoursWorked": 8,
    "ordersHandled": 45,
    "salesGenerated": 450.00
  },
  ...
]
```

**14. Clock In/Out**
```http
POST /api/staff
Cookie: session_token=<JWT_TOKEN>
Content-Type: application/json

{
  "action": "CLOCK_IN"
}

Response 200:
{
  "shift": {
    "id": "shift-2",
    "status": "ACTIVE",
    "startTime": "2026-05-28T10:00:00Z"
  }
}
```

#### Supplier APIs

**15. Get Suppliers**
```http
GET /api/suppliers
Cookie: session_token=<JWT_TOKEN>

Response 200:
[
  {
    "id": "sup-1",
    "name": "Premium Coffee Imports",
    "contactName": "Mike Wilson",
    "email": "mike@premiumcoffee.com",
    "phone": "+1122334455",
    "address": "123 Coffee St, Seattle"
  },
  ...
]
```

**16. Add Supplier**
```http
POST /api/suppliers
Cookie: session_token=<JWT_TOKEN>
Content-Type: application/json

{
  "name": "Fresh Dairy Co.",
  "contactName": "Sarah Lee",
  "email": "sarah@freshdairy.com",
  "phone": "+5544332211",
  "address": "456 Milk Ave, Portland"
}

Response 200:
{
  "supplier": {...}
}
```


### Authentication Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    { email, password }
       ↓
┌─────────────────────────────┐
│   Authentication API        │
│                             │
│  1. Validate credentials    │
│  2. Hash password check     │
│  3. Generate JWT token      │
│  4. Set httpOnly cookie     │
└──────┬──────────────────────┘
       │
       │ 2. Response + Cookie
       │    Set-Cookie: session_token=<JWT>
       ↓
┌─────────────┐
│   Client    │
│  (Logged In)│
└──────┬──────┘
       │
       │ 3. GET /api/dashboard/stats
       │    Cookie: session_token=<JWT>
       ↓
┌─────────────────────────────┐
│   Middleware                │
│                             │
│  1. Extract cookie          │
│  2. Verify JWT signature    │
│  3. Decode payload          │
│  4. Check expiration        │
└──────┬──────────────────────┘
       │
       │ 4. Authenticated Request
       │    { userId, tenantId, role }
       ↓
┌─────────────────────────────┐
│   API Handler               │
│                             │
│  1. Get tenant data         │
│  2. Check role permissions  │
│  3. Process request         │
│  4. Return response         │
└──────┬──────────────────────┘
       │
       │ 5. Response with data
       ↓
┌─────────────┐
│   Client    │
└─────────────┘
```

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "user-123",
    "tenantId": "tenant-456",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "OWNER",
    "tenantSlug": "mycoffee",
    "iat": 1716883200,
    "exp": 1717488000
  },
  "signature": "..."
}
```

**Token Expiry:** 7 days  
**Storage:** httpOnly cookie (XSS protection)  
**Secret:** Environment variable `JWT_SECRET`


---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│     Tenant      │
│─────────────────│
│ id (PK)         │
│ name            │
│ slug (unique)   │
│ address         │
│ phone           │
│ taxRate         │
│ currency        │
│ paymentConfig   │
└────────┬────────┘
         │
         │ 1:N
         ↓
┌─────────────────┐       ┌─────────────────┐
│      User       │       │    Customer     │
│─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │
│ tenantId (FK)   │       │ tenantId (FK)   │
│ email (unique)  │       │ name            │
│ passwordHash    │       │ email           │
│ name            │       │ phone           │
│ role            │       │ loyaltyPoints   │
└────────┬────────┘       └────────┬────────┘
         │                         │
         │ 1:N                     │ 1:N
         ↓                         ↓
┌─────────────────┐       ┌─────────────────┐
│     Shift       │       │     Order       │
│─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │
│ tenantId (FK)   │       │ tenantId (FK)   │
│ userId (FK)     │       │ userId (FK)     │
│ startTime       │       │ customerId (FK) │
│ endTime         │       │ orderNumber     │
│ status          │       │ totalAmount     │
│ hoursWorked     │       │ taxAmount       │
│ ordersHandled   │       │ discountAmount  │
│ salesGenerated  │       │ paymentMethod   │
└─────────────────┘       │ status          │
                          │ tableNumber     │
                          │ source          │
                          └────────┬────────┘
                                   │
                                   │ 1:N
                                   ↓
                          ┌─────────────────┐
                          │   OrderItem     │
                          │─────────────────│
                          │ id (PK)         │
                          │ orderId (FK)    │
                          │ productId (FK)  │
                          │ quantity        │
                          │ unitPrice       │
                          │ totalPrice      │
                          │ modifiers       │
                          └─────────────────┘
```


```
┌─────────────────┐       ┌─────────────────┐
│    Product      │       │   Supplier      │
│─────────────────│       │─────────────────│
│ id (PK)         │       │ id (PK)         │
│ tenantId (FK)   │       │ tenantId (FK)   │
│ name            │       │ name            │
│ description     │       │ contactName     │
│ price           │       │ email           │
│ category        │       │ phone           │
│ imageUrl        │       │ address         │
│ active          │       └────────┬────────┘
└────────┬────────┘                │
         │                         │ 1:N
         │ 1:N                     ↓
         ↓                ┌─────────────────┐
┌─────────────────┐       │   Ingredient    │
│    Modifier     │       │─────────────────│
│─────────────────│       │ id (PK)         │
│ id (PK)         │       │ tenantId (FK)   │
│ productId (FK)  │       │ supplierId (FK) │
│ name            │       │ name            │
│ type            │       │ sku             │
└────────┬────────┘       │ unit            │
         │                │ currentStock    │
         │ 1:N            │ reorderPoint    │
         ↓                │ costPerUnit     │
┌─────────────────┐       └────────┬────────┘
│ ModifierOption  │                │
│─────────────────│                │ 1:N
│ id (PK)         │                ↓
│ modifierId (FK) │       ┌─────────────────┐
│ name            │       │  InventoryLog   │
│ priceAdjustment │       │─────────────────│
└─────────────────┘       │ id (PK)         │
                          │ tenantId (FK)   │
                          │ ingredientId(FK)│
                          │ userId (FK)     │
                          │ type            │
                          │ quantity        │
                          │ reason          │
                          │ timestamp       │
                          └─────────────────┘
```

### Database Tables

#### 1. Tenant
```sql
CREATE TABLE "Tenant" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "address" TEXT,
  "phone" TEXT,
  "taxRate" DECIMAL(5,4) DEFAULT 0.08,
  "currency" TEXT DEFAULT 'USD',
  "paymentConfig" JSONB,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```


#### 2. User
```sql
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT REFERENCES "Tenant"("id"),
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT CHECK (role IN ('OWNER', 'MANAGER', 'STAFF')),
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

#### 3. Customer
```sql
CREATE TABLE "Customer" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT REFERENCES "Tenant"("id"),
  "name" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT,
  "loyaltyPoints" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

#### 4. Product
```sql
CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT REFERENCES "Tenant"("id"),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10,2) NOT NULL,
  "category" TEXT NOT NULL,
  "imageUrl" TEXT,
  "active" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

#### 5. Order
```sql
CREATE TABLE "Order" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT REFERENCES "Tenant"("id"),
  "userId" TEXT REFERENCES "User"("id"),
  "customerId" TEXT REFERENCES "Customer"("id"),
  "orderNumber" TEXT NOT NULL,
  "totalAmount" DECIMAL(10,2) NOT NULL,
  "taxAmount" DECIMAL(10,2) DEFAULT 0,
  "discountAmount" DECIMAL(10,2) DEFAULT 0,
  "paymentMethod" TEXT NOT NULL,
  "status" TEXT DEFAULT 'COMPLETED',
  "tableNumber" TEXT,
  "source" TEXT DEFAULT 'POS',
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

#### 6. OrderItem
```sql
CREATE TABLE "OrderItem" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT REFERENCES "Order"("id"),
  "productId" TEXT REFERENCES "Product"("id"),
  "quantity" INTEGER NOT NULL,
  "unitPrice" DECIMAL(10,2) NOT NULL,
  "totalPrice" DECIMAL(10,2) NOT NULL,
  "modifiers" JSONB
);
```


#### 7. Ingredient
```sql
CREATE TABLE "Ingredient" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT REFERENCES "Tenant"("id"),
  "supplierId" TEXT REFERENCES "Supplier"("id"),
  "name" TEXT NOT NULL,
  "sku" TEXT NOT NULL,
  "unit" TEXT NOT NULL,
  "currentStock" DECIMAL(10,2) NOT NULL,
  "reorderPoint" DECIMAL(10,2) NOT NULL,
  "costPerUnit" DECIMAL(10,4) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

#### 8. InventoryLog
```sql
CREATE TABLE "InventoryLog" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT REFERENCES "Tenant"("id"),
  "ingredientId" TEXT REFERENCES "Ingredient"("id"),
  "userId" TEXT REFERENCES "User"("id"),
  "type" TEXT CHECK (type IN ('PURCHASE', 'USAGE', 'ADJUSTMENT', 'WASTE')),
  "quantity" DECIMAL(10,2) NOT NULL,
  "reason" TEXT,
  "timestamp" TIMESTAMP DEFAULT NOW()
);
```

#### 9. Shift
```sql
CREATE TABLE "Shift" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT REFERENCES "Tenant"("id"),
  "userId" TEXT REFERENCES "User"("id"),
  "startTime" TIMESTAMP NOT NULL,
  "endTime" TIMESTAMP,
  "status" TEXT CHECK (status IN ('ACTIVE', 'COMPLETED')),
  "hoursWorked" DECIMAL(5,2),
  "ordersHandled" INTEGER DEFAULT 0,
  "salesGenerated" DECIMAL(10,2) DEFAULT 0
);
```

#### 10. Supplier
```sql
CREATE TABLE "Supplier" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT REFERENCES "Tenant"("id"),
  "name" TEXT NOT NULL,
  "contactName" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

### Indexes untuk Performance

```sql
-- User lookup
CREATE INDEX idx_user_email ON "User"("email");
CREATE INDEX idx_user_tenant ON "User"("tenantId");

-- Order queries
CREATE INDEX idx_order_tenant ON "Order"("tenantId");
CREATE INDEX idx_order_created ON "Order"("createdAt");
CREATE INDEX idx_order_customer ON "Order"("customerId");

-- Product queries
CREATE INDEX idx_product_tenant ON "Product"("tenantId");
CREATE INDEX idx_product_category ON "Product"("category");

-- Inventory queries
CREATE INDEX idx_ingredient_tenant ON "Ingredient"("tenantId");
CREATE INDEX idx_inventory_log_ingredient ON "InventoryLog"("ingredientId");
```


---

## 🔒 Keamanan

### 1. Authentication Security

**Password Hashing:**
- Menggunakan `bcryptjs` dengan salt rounds 10
- Password tidak pernah disimpan plain text
- Hash verification saat login

```javascript
// Register
const passwordHash = await bcrypt.hash(password, 10);

// Login
const isValid = await bcrypt.compare(password, user.passwordHash);
```

**JWT Token:**
- Signed dengan secret key (environment variable)
- Expiry: 7 days
- Payload contains: userId, tenantId, role
- Stored in httpOnly cookie (XSS protection)

**Session Management:**
- Cookie-based sessions
- httpOnly flag (prevent JavaScript access)
- Secure flag (HTTPS only in production)
- SameSite: Lax (CSRF protection)

### 2. Authorization (RBAC)

**Role Hierarchy:**
```
OWNER (Full Access)
  ├─ All dashboard features
  ├─ Settings management
  ├─ User management
  └─ Financial reports

MANAGER (Limited Access)
  ├─ POS operations
  ├─ Inventory management
  ├─ Staff management
  └─ Reports (view only)

STAFF (Minimal Access)
  ├─ POS operations only
  ├─ Clock in/out
  └─ View own shifts
```

**Middleware Protection:**
```javascript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const session = decodeJWTPayload(token);
  
  // Check role for admin pages
  if (isStaff && isAdminOnlyPage) {
    return redirect('/dashboard/pos');
  }
}
```

**API Route Protection:**
```javascript
// All API routes use authenticateRequest()
const { error, session } = await authenticateRequest(request);
if (error) return error;

// Check permissions
if (session.role === 'STAFF' && requiresAdmin) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```


### 3. Data Security

**Multi-tenant Isolation:**
- Setiap query filtered by `tenantId`
- Tenant tidak bisa akses data tenant lain
- Database-level isolation

```javascript
// Example: Get orders for current tenant only
const orders = await prisma.order.findMany({
  where: { tenantId: session.tenantId }
});
```

**SQL Injection Prevention:**
- Prisma ORM dengan parameterized queries
- No raw SQL queries
- Type-safe database access

**XSS Prevention:**
- React automatic escaping
- No dangerouslySetInnerHTML
- Content Security Policy headers

**CSRF Protection:**
- SameSite cookie attribute
- Origin validation
- Token-based requests

### 4. Environment Variables

**Required Variables:**
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Authentication
JWT_SECRET="your-super-secret-key-min-32-chars"

# Server
PORT=3000
NODE_ENV=production
```

**Security Best Practices:**
- Never commit `.env` to git
- Use strong JWT_SECRET (min 32 characters)
- Rotate secrets regularly
- Use different secrets per environment

### 5. Rate Limiting (Recommended)

**Future Implementation:**
```javascript
// Limit login attempts
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Limit API requests
const RATE_LIMIT = 100; // requests per minute
```

### 6. Audit Logging

**Tracked Actions:**
- User login/logout
- Order creation
- Inventory adjustments
- Staff clock in/out
- Settings changes

**Log Structure:**
```javascript
{
  timestamp: "2026-05-28T10:30:00Z",
  userId: "user-123",
  tenantId: "tenant-456",
  action: "INVENTORY_ADJUSTMENT",
  details: { ingredientId, amount, reason },
  ipAddress: "192.168.1.1"
}
```


---

## 🚀 Deployment

### Prerequisites

1. **Node.js** 18+ installed
2. **PostgreSQL** 14+ database
3. **npm** or **yarn** package manager
4. **Git** for version control

### Local Development Setup

**1. Clone Repository**
```bash
git clone <repository-url>
cd WebsCoffeshop
```

**2. Install Dependencies**
```bash
npm install
```

**3. Setup Environment Variables**
```bash
# Create .env file
cp .env.example .env

# Edit .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/brewops"
JWT_SECRET="your-secret-key-min-32-characters"
PORT=3000
```

**4. Setup Database**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data
npx prisma db seed
```

**5. Run Development Server**
```bash
npm run dev
```

**6. Access Application**
```
http://localhost:3000
```

**Demo Login:**
```
Email: owner@brewops.com
Password: password123
```

### Production Deployment

#### Option 1: Vercel (Recommended)

**1. Install Vercel CLI**
```bash
npm install -g vercel
```

**2. Login to Vercel**
```bash
vercel login
```

**3. Deploy**
```bash
vercel --prod
```

**4. Set Environment Variables**
```bash
vercel env add DATABASE_URL
vercel env add JWT_SECRET
```

**5. Configure Database**
- Use Vercel Postgres or external PostgreSQL
- Run migrations: `npx prisma migrate deploy`


#### Option 2: Docker Deployment

**1. Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**2. Create docker-compose.yml**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/brewops
      - JWT_SECRET=your-secret-key
    depends_on:
      - db

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=brewops
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**3. Build and Run**
```bash
docker-compose up -d
```

#### Option 3: VPS Deployment (Ubuntu)

**1. Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2
```

**2. Setup PostgreSQL**
```bash
sudo -u postgres psql

CREATE DATABASE brewops;
CREATE USER brewops_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE brewops TO brewops_user;
\q
```

**3. Clone and Setup**
```bash
git clone <repository-url>
cd WebsCoffeshop
npm install
npx prisma generate
npx prisma migrate deploy
```

**4. Start with PM2**
```bash
pm2 start npm --name "brewops" -- start
pm2 save
pm2 startup
```

**5. Setup Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**6. SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```


### Database Backup & Restore

**Backup Database**
```bash
# PostgreSQL backup
pg_dump -U postgres -d brewops > backup_$(date +%Y%m%d).sql

# With compression
pg_dump -U postgres -d brewops | gzip > backup_$(date +%Y%m%d).sql.gz
```

**Restore Database**
```bash
# Restore from backup
psql -U postgres -d brewops < backup_20260528.sql

# From compressed backup
gunzip -c backup_20260528.sql.gz | psql -U postgres -d brewops
```

**Automated Backup (Cron)**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * pg_dump -U postgres -d brewops | gzip > /backups/brewops_$(date +\%Y\%m\%d).sql.gz
```

### Monitoring & Maintenance

**1. Application Monitoring**
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs brewops

# Restart application
pm2 restart brewops
```

**2. Database Monitoring**
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('brewops'));

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Active connections
SELECT count(*) FROM pg_stat_activity;
```

**3. Performance Optimization**
```sql
-- Analyze tables
ANALYZE;

-- Vacuum database
VACUUM ANALYZE;

-- Reindex
REINDEX DATABASE brewops;
```

### Troubleshooting

**Common Issues:**

**1. Database Connection Error**
```
Error: Can't reach database server
```
**Solution:**
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check firewall rules
- Test connection: `psql $DATABASE_URL`

**2. JWT Token Invalid**
```
Error: Invalid session
```
**Solution:**
- Check JWT_SECRET matches
- Clear browser cookies
- Re-login

**3. Port Already in Use**
```
Error: Port 3000 is already in use
```
**Solution:**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

