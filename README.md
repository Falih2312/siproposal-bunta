# SiProposal — Kecamatan Bunta

Aplikasi pengajuan, pelacakan privat, dan rekapitulasi usulan pelimpahan sebagian kewenangan Bupati kepada Camat Bunta berdasarkan **Peraturan Bupati Banggai Nomor 1 Tahun 2026**.

## Struktur Berkas
- `index.html` — Antarmuka utama (Portal Pengusul, Formulir Pengajuan, Katalog 22 Urusan, dan Dasbor Admin Kecamatan).
- `app.js` — Logika aplikasi, koneksi Supabase, rekapitulasi per Desa & Urusan, serta pelacakan privat berbasis ID acak (`ab8`).
- `tailwind-config.js` — Konfigurasi tema Tailwind CSS.
- `netlify.toml` — Konfigurasi deploy Netlify dan header Content Security Policy (CSP).

## Catatan Deploy
1. Pastikan seluruh berkas di atas berada di folder utama (*root*) repositori GitHub `Falih2312/siproposal-bunta`.
2. Netlify akan otomatis mem-publish perubahan dari branch `main`.
