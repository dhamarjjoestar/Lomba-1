# Panduan Desain: Tipografi & Palet Warna (Design System Reference)

Dokumen ini merupakan referensi resmi untuk standar visual proyek **SILICA2CON / GEOCEDS** (Evidence-Based Decision Support System Transformasi Residu Geothermal Dieng). Semua halaman, komponen antarmuka, dan modal wajib mengacu pada kesatuan tipografi tunggal dan rumpun palet warna bernuansa hijau berikut agar tampilan konsisten, identik, dan harmonis.

---

## 1. Standar Tipografi Tunggal (Unified Typography)

Seluruh proyek distandardisasi menggunakan **1 tipe font utama (single font type)** untuk semua hierarki teks (judul `h1`-`h6`, body teks, label, form kontrol, navigasi, hingga tombol).

- **Font Family Utama**: `'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Penyedia / Lisensi**: Google Fonts (Open Font License / OFL)
- **Karakteristik Desain**:
  - Geometris modern namun ergonomis dengan keterbacaan tinggi (*high legibility*) pada ukuran micro-copy (*11px - 13px*) maupun display headline (*24px - 40px*).
  - Skala ketebalan yang digunakan:
    - `Light` (300)
    - `Regular` (400)
    - `Medium` (500)
    - `SemiBold` (600)
    - `Bold` (700)
    - `ExtraBold / Black` (800)
- **Penyetaraan Elemen**:
  - Kelas utility `.font-serif` telah disinkronkan langsung ke `Plus Jakarta Sans` sehingga tidak ada jenis huruf serif asing yang tampil berbeda di halaman alur evaluasi maupun bagian lainnya.
  - Untuk angka data tabular teknis, notasi rumus stoikiometri, dan kode status provenance digunakan font monospace terintegrasi dengan font-family bawaan sistem dan JetBrains Mono yang serasi.

---

## 2. Palet Warna Rumpun Hijau (Harmonized Green Color Palette)

Sesuai filosofi proyek yang berfokus pada **keberlanjutan lingkungan (sustainability), ekonomi sirkular, dan material hijau (green construction materials)**, warna aksen dan sistem visual utama menggunakan spektrum warna yang setipe dengan hijau: **Emerald Green**, **Teal Green**, dan **Forest/Mint Accents**.

### A. Hijau Utama (Primary Emerald & Forest Green)
Digunakan untuk aksi utama (CTA), brand identity, batas aktif, indikator positif, dan judul penekanan.

| Nama Warna | Kode Hex | Kelas Tailwind | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| **Emerald 900** | `#064e3b` | `text-emerald-900`, `bg-emerald-900` | Header kontras tinggi, teks kartu prioritas |
| **Emerald 800** | `#065f46` | `text-emerald-800`, `bg-emerald-800` | Judul sub-seksi, label data valid |
| **Emerald 700** | `#047857` | `text-emerald-700`, `bg-emerald-700` | Nilai data positif, tombol primer aktif |
| **Emerald 600** | `#059669` | `bg-emerald-600`, `text-emerald-600` | Badge nomor langkah, tombol unduh & navigasi |
| **Emerald 500** | `#10b981` | `text-emerald-500`, `stroke-[#10b981]` | Garis alur diagram S-curve, seleksi teks antarmuka |
| **Emerald 400** | `#34d399` | `bg-emerald-400`, `border-emerald-400` | Hover scrollbar thumb, hover border kartu |
| **Emerald 200** | `#a7f3d0` | `border-emerald-200`, `bg-emerald-200` | Konektor diagram alur, scrollbar thumb |
| **Emerald 50** | `#ecfdf5` | `bg-emerald-50`, `bg-emerald-50/90` | Background kartu aktif, pill badge alur |

### B. Hijau Penunjang (Teal Green Accents)
Digunakan sebagai aksen diferensiasi sekunder agar tetap selaras dengan rumpun hijau tanpa monoton.

| Nama Warna | Kode Hex | Kelas Tailwind | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| **Teal 800** | `#115e59` | `text-teal-800` | Label Engine 02 (Evidence Engine) |
| **Teal 700** | `#0f766e` | `text-teal-700` | Badge Halaman Metopen, Status 2 Provenance |
| **Teal 600** | `#0d9488` | `text-teal-600` | Ikon metodologi & validasi sains |
| **Teal 100** | `#ccfbf1` | `bg-teal-100` | Background ikon metodologi & evidence card |
| **Teal 50** | `#f0fdf4` | `bg-teal-50` | Latar belakang modul interaktif sekunder |

### C. Latar Belakang Kanvas (Canvas & Botanical Background)
Latar belakang kanvas diagram alur menggunakan gradasi radial berbasis nuansa hijau mint lembut:

- **Radial Gradient 1 & 3**: `rgba(209, 250, 229, 0.75)` (Emerald 100 tint)
- **Radial Gradient 2 & 4**: `rgba(236, 253, 245, 0.90)` (Emerald 50 tint)
- **Aksen Botanik SVG**: Daun organik transparan `#A4C8A8` dengan outline daun `#75AB7B`.

### D. Warna Netral & Peringatan Fungsional
- **Latar Netral**: `bg-slate-50` (#F8FAFC) dan `bg-white` (#FFFFFF) dengan border lembut `border-slate-200` (#E2E8F0).
- **Teks Netral**: `text-slate-900` (#0F172A) untuk heading dan `text-slate-600` (#475569) untuk body copy.
- **Warna Status Fungsional Teknis (SNI Standard)**:
  - Hijau (`emerald-700`): Mutu B (Lolos SNI)
  - Amber (`amber-600`): Mutu C / Evaluasi Bersyarat
  - Rose (`rose-600`): Mutu D / Data Gap Kritis

---

## 3. Cara Penggunaan dalam Komponen Baru

1. **Selalu gunakan font sans bawaan**: Jangan menambahkan kelas `font-serif` atau font pihak ketiga lain. Cukup gunakan `font-sans` atau biarkan mewarisi font `body` (`Plus Jakarta Sans`).
2. **Gunakan rumpun hijau untuk elemen interaktif**:
   - Badge dan status info: `bg-emerald-50 text-emerald-800 border-emerald-200` atau `bg-teal-50 text-teal-800 border-teal-200`.
   - Tombol aktif / CTA: `bg-emerald-600 hover:bg-emerald-700 text-white`.
   - Highlight teks dan grafik: `text-emerald-700` dan `stroke-emerald-500`.
3. **Dokumen ini disimpan di**:
   - `/DESIGN_SYSTEM.md` (Dokumentasi lengkap standar font dan palet warna proyek).
