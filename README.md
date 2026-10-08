# Website Asrama IPB Sukasari

Website profil Asrama IPB Sukasari (React + Vite + Tailwind) dengan backend **Firebase**
(Firestore, Storage, Authentication) dan panel admin.

## Menjalankan

```bash
npm install
npm run dev      # dev server
npm run build    # build produksi (output: dist/)
npm run preview  # preview hasil build
npm run lint     # eslint
```

## Struktur Backend (Firebase)

Project Firebase: `asrama-ipb-sukasari`. Konfigurasi ada di `src/firebase.js`.

### Collection Firestore

| Collection            | Isi                                                                 |
| --------------------- | ------------------------------------------------------------------- |
| `berita`              | Berita/artikel. Field: `title`, `kategori`, `content` (Markdown), `imageUrl`, `date` (Timestamp), `author`, `published`, `createdAt` |
| `alumni`              | Pesan "Kata Alumni". Field: `name`, `role`, `quote`, `image`, `order`, `approved`, `source`, `createdAt` |
| `siteImages`          | Pemetaan gambar website -> URL Firebase Storage (`url`, `path`)     |
| `admins`              | Fallback admin opsional (doc ID = email, `{ active: true }`)         |
| `users`               | Data anggota asrama. **Admin ditandai field `isAdmin: true`**        |
| `bakalCalonPenghuni`  | Data pendaftar OPREC (sudah ada sebelumnya)                         |

### Utilitas

- `src/utils/berita.js` — CRUD berita
- `src/utils/alumni.js` — CRUD & moderasi alumni
- `src/utils/images.js` — registri gambar (aset lokal + override Firebase)
- `src/utils/storage.js` — upload ke Firebase Storage
- `src/utils/markdown.js` — konversi HTML <-> Markdown
- `src/utils/admin.js` — pengecekan hak akses admin (gerbang UI)

## Panel Admin (`/admin`)

Akses `/admin` hanya untuk **anggota asrama** yang login dengan Google.

Halaman admin:

- `/admin/dashboard` — ringkasan
- `/admin/berita` — daftar berita, `/admin/berita/baru` untuk menulis berita
  (rich text editor yang menyimpan konten dalam **format Markdown**)
- `/admin/alumni` — kelola & setujui pesan alumni
- `/admin/admins` — kelola admin; kandidat diambil dari collection `users`
- `/admin/respons` — data pendaftar OPREC

### Menambahkan anggota asrama sebagai admin

Admin web ditandai dengan field **`isAdmin: true`** pada dokumen di collection
`users`. Karena Security Rules memakai field ini, pengaturan sepenuhnya dari
Firestore (tanpa daftar statis di kode).

- Admin pertama: buka Firestore Console → collection `users` → dokumen
  pengguna (doc ID = UID Firebase Auth) → tambahkan field `isAdmin` = `true`.
- Admin berikutnya: lewat halaman **`/admin/admins`** — pilih anggota dari
data `users`, klik "Jadikan Admin" (menulis field `isAdmin`).

> Halaman Kelola Admin juga butuh data `users`; pastikan rules sudah di-deploy
> agar admin boleh membacanya.

Email yang belum terdaftar otomatis ditolak saat login, dan walaupun bisa memaksa
masuk ke UI, **tidak akan bisa membaca/menulis data** karena diblokir Security Rules.

## Gambar Website (Firebase Storage)

Gambar awalnya dibundel di `src/assets/img` dan `public/`. Sekarang gambar
diselesaikan lewat registri di `src/utils/images.js`:

- Default memakai aset lokal (fallback).
- Jika ada dokumen di collection `siteImages` (key = path relatif), URL Firebase
  akan dipakai.

### Unggah semua gambar ke Firebase (sekali)

```bash
# autentikasi salah satu:
gcloud auth application-default login
# atau: export GOOGLE_APPLICATION_CREDENTIALS="/path/service-account.json"

npm run upload:images
```

Skrip `scripts/upload-site-images.mjs` akan mengunggah semua aset ke Storage dan
mendaftarkannya ke `siteImages`. Setelah itu aset lokal boleh dihapus untuk
mengecilkan bundle (fallback akan otomatis memakai URL Firebase).

## Firebase Rules

File rules:

- `firestore.rules`
- `storage.rules`

Deploy setelah login Firebase CLI:

```bash
firebase deploy --only firestore:rules,storage
```

### Otorisasi (keamanan)

Pengecekan admin **tidak** hanya di frontend. Security Rules menegakkannya di
server lewat fungsi `isAdmin()`, yang mengecek field `users/<uid>.isAdmin == true`
(atau fallback dokumen `admins/<email>`). Akibatnya:

- `berita`, `siteImages`: boleh dibaca publik, **ditulis hanya admin**.
- `alumni`: publik hanya membaca yang `approved = true`; pengajuan anonim hanya
  boleh membuat dokumen dengan `approved = false` & `source = "submission"`.
- `bakalCalonPenghuni` (data pribadi pendaftar): **hanya admin** yang boleh membaca.
- Storage: folder `berita/**` & `site/**` hanya admin; `oprec/**` perlu login;
  `alumni/**` admin atau unggahan gambar < 5MB.

`src/utils/admin.js` hanya untuk gerbang UI (menentukan tampil atau tidak), bukan
pengaman utama.
