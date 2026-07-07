# ☕ BrewOps Coffee Shop SaaS Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/noval-abdillah/brew-ops)
[![Next.js Version](https://img.shields.io/badge/next.js-v16.2.6-black?style=flat-squared&logo=next.js)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/react-v19.2.4-blue?style=flat-squared&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind_css-v4.0.0-38bdf8?style=flat-squared&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/prisma-v6.16.2-2d3748?style=flat-squared&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-squared)](#license)

## 📝 Deskripsi
**BrewOps** adalah platform *Multi-Tenant SaaS (Software as a Service)* berskala enterprise yang dirancang khusus untuk manajemen operasional coffee shop modern dan bisnis kafe. Platform ini memfasilitasi pemilik kafe, manajer, dan barista dengan menyediakan sistem Point of Sale (POS) cerdas, pemantauan inventori bahan baku secara real-time, pencatatan kehadiran staf, serta analisis prediksi penjualan berbasis AI lokal. Platform ini dirancang untuk menyelesaikan inefisiensi pencatatan manual serta pemborosan inventori bahan baku (waste management).

---

## 🚀 Fitur Utama
*   **🛒 POS Terminal Cerdas:** Terminal kasir responsif dengan kustomisasi produk (modifiers), keranjang belanja, integrasi diskon loyalitas, serta pemrosesan pembayaran multi-metode (Cash, Card, QR, Split Bill).
*   **📦 Manajemen Inventori & Resep:** Pengurangan stok bahan baku secara otomatis (real-time) pasca transaksi berdasarkan konfigurasi resep produk dan modifikator, lengkap dengan sistem peringatan stok kritis (*low stock alert*).
*   **👥 Kehadiran & Shift Barista:** Sistem *Clock-In* & *Clock-Out* cepat untuk barista guna menghitung total durasi jam kerja secara akurat.
*   **🔮 Prediksi AI Lokal:** Algoritma regresi pergerakan 30 hari untuk memproyeksikan estimasi pendapatan 7 hari ke depan serta estimasi waktu habisnya stok bahan baku.
*   **📱 Menu Online QR Mandiri:** Catalog menu publik berbasis QR code meja agar pelanggan dapat memesan langsung dari tempat duduk tanpa antre.
*   **📊 Laporan Penjualan & Margin:** Panel ekspor laporan penjualan berformat CSV dan pelacakan margin profit operasional (Gross Sales, Cost Overhead, Net Margin).

---

## 🖼️ Demo / Screenshot
<!-- Tautan demo & visualisasi asset -->
*   **Aplikasi Utama:** `http://localhost:3000/`
*   **POS Terminal:** `/dashboard/pos`
*   **Menu Pelanggan:** `/menu/brewops`

*Placeholder asset visual:*
```
[ Halaman Login Terminal Kasir ] -> [ Panel Dashboard & KPI AI ] -> [ Terminal POS Kasir ]
```

---

## 🛠️ Tech Stack
*   **Core Framework:** Next.js v16.2.6 (App Router)
*   **UI Library:** React v19.2.4 & Lucide Icons
*   **Styling:** Tailwind CSS v4.0.0 (Premium glassmorphism effects)
*   **Database ORM:** Prisma v6.16.2 (PostgreSQL client)
*   **State Management & Chart:** Recharts v3.8.1 (Data visualizer)
*   **Otentikasi:** JSON Web Tokens (JWT) & bcryptjs hashing

---

## 📦 Instalasi

### Prasyarat
*   Node.js v18.x atau v20.x
*   npm / yarn
*   PostgreSQL Database (opsional untuk mode produksi)

### Langkah-langkah
1.  **Clone Repositori:**
    ```bash
    git clone https://github.com/noval-abdillah/brew-ops.git
    cd brew-ops
    ```

2.  **Instalasi Dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment:**
    Salin file `.env.example` ke `.env` lokal:
    ```bash
    cp .env.example .env
    ```

4.  **Generasi Prisma Client:**
    ```bash
    npx prisma generate
    ```

---

## 💻 Cara Penggunaan (Usage)

### Menjalankan Server Lokal (Development)
Untuk menjalankan server dengan database in-memory local fallback (tanpa koneksi PostgreSQL):
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

### Akun Demo Pengujian (Offline Fallback Mode)
Gunakan kredensial ini untuk menguji hak akses peran (*Role-Based Access Control*):
*   **Elena (Owner):** `owner@brewops.com` (password: `password123`)
*   **Jordan (Barista):** `staff@brewops.com` (password: `password123`)

---

## ⚙️ Konfigurasi
Buat file `.env` di root direktori dengan parameter berikut:
```env
# URL koneksi database PostgreSQL (wajib di produksi)
DATABASE_URL="postgresql://user:password@localhost:5432/brewops"

# Token keamanan JWT
JWT_SECRET="brewops-super-secret-key-change-in-production"

# Port server lokal
PORT=3000
```

---

## 📁 Struktur Folder
```
brew-ops/
├── prisma/               # Skema database & file seeding
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── app/              # Next.js App Router Pages & API Routes
│   │   ├── api/          # REST API endpoints (Auth, POS, Inventory)
│   │   ├── dashboard/    # Panel kontrol kasir & manajer
│   │   ├── menu/         # Halaman scan QR menu publik
│   │   └── page.tsx      # Landing page utama
│   ├── lib/              # Modul utilitas & algoritma prediksi AI
│   └── middleware.ts     # Route guard otentikasi sesi JWT
└── package.json
```

---

## 🤝 Kontribusi
1. Fork repositori ini.
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`).
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`).
4. Push ke branch (`git push origin feature/AmazingFeature`).
5. Buat Pull Request baru.

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah lisensi MIT. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

---

## 📧 Kontak & Credit
*   **Maintainer:** noval-abdillah (santetgan123@gmail.com)
*   **Repository:** [https://github.com/noval-abdillah/brew-ops](https://github.com/noval-abdillah/brew-ops)
