# Arah Desain Portfolio Gema Pradana

## Pendekatan Alternatif

### Nama Tema: GemaOS ’95

**Intro singkat:** Desktop Windows 95 yang playful, pixelated, dan sengaja terasa seperti komputer keluarga tahun 1995, tetapi berisi pencapaian performance marketing masa kini.
**Probability:** 0.07

### Nama Tema: Soft Editorial

**Intro singkat:** Portfolio modern bergaya editorial dengan ruang putih, tipografi besar, dan ritme seperti majalah kreatif. Fokusnya adalah kejelasan cerita dan kualitas studi kasus.
**Probability:** 0.03

### Nama Tema: Dual Desktop Time Machine

**Intro singkat:** Satu identitas portfolio yang hidup dalam dua desktop: GemaOS ’95 sebagai arsip nostalgia dan Gema 2026 sebagai workstation modern yang dapat dijelajahi.
**Probability:** 0.08

## Pendekatan Terpilih: Dual Desktop Time Machine

### Design Movement

Digital skeuomorphism dan Y2K desktop futurism yang dipertemukan dengan editorial portfolio modern. Mode lama terasa seperti software yang bisa disentuh; mode baru terasa seperti ruang kerja digital yang tenang, luas, dan berorientasi pada karya.

### Core Principles

1. **Portfolio sebagai tempat yang dijelajahi:** informasi tidak disusun sebagai landing page generik, tetapi ditemukan melalui ikon, jendela, dock, sticky note, dan project cards.
2. **Dua era, satu karakter:** detail visual berubah drastis saat mode berganti, tetapi suara Gema, data pencapaian, dan struktur cerita tetap konsisten.
3. **Bukti sebelum klaim:** setiap headline besar didukung angka, channel, brand, atau konteks kerja yang jelas.
4. **Interaksi sebagai navigasi:** klik, drag, hover, unlock, dan switch mode memberi feedback cepat tanpa menghalangi akses ke konten inti.

### Color Philosophy

Mode ’95 menggunakan teal desktop, cobalt title bars, off-white panels, dan aksen lime/red sebagai bahasa visual software lawas. Mode 2026 menggunakan midnight ink, pearl fog, graphite, dan electric lime sebagai penanda fokus. Warna lime menjadi jembatan antar-era: di ’95 ia terasa seperti phosphor monitor; di 2026 ia menjadi highlight data dan tombol aksi.

### Layout Paradigm

Mode ’95 adalah desktop fixed-height dengan ikon yang tersebar dan jendela yang dapat dipindahkan; konten hidup dalam panel kecil seperti sistem operasi. Mode 2026 adalah desktop canvas responsif dengan clock lock screen, icon cluster, right-side media player, bottom dock, dan modal windows. Pada layar kecil, kedua mode berubah menjadi stacked desktop surface agar tidak kehilangan keterbacaan.

### Signature Elements

- Tombol switch **GemaOS ’95 ↔ Gema 2026** yang selalu terlihat, bergaya system update/back-to-’95.
- Badge kecil bergaya status bar yang mengubah metrik CV menjadi data hidup: **ROAS 12×**, **GMV 2B**, **250M IDR/mo**.
- Window chrome dan icon numeration yang menjadi sistem navigasi, bukan dekorasi semata.

### Interaction Philosophy

Interaksi harus terasa langsung dan reversible. Ikon membuka panel; panel bisa ditutup tanpa menghilangkan konteks; mode switch menyimpan state dan memberi transisi singkat. Dragging tersedia di desktop, tetapi semua konten utama juga dapat diakses lewat keyboard dan tap di mobile.

### Animation

Mode ’95 memakai boot progress, blink cursor, title-bar focus, dan jendela yang masuk dengan snap 120–180ms. Mode 2026 memakai unlock fade, clock tick yang halus, dock lift, floating icon drift, dan particle-like grain yang sangat ringan. Animasi tidak boleh mengorbankan teks: `prefers-reduced-motion` mematikan drift, parallax, dan transition yang tidak esensial.

### Typography System

Mode ’95 menggunakan **Press Start 2P** untuk boot/status dan **VT323** untuk isi terminal atau label kecil, dengan Arial/Helvetica sebagai fallback panel agar tetap mudah dibaca. Mode 2026 menggunakan **DM Sans** untuk body/UI dan **Space Grotesk** untuk headline/metrik. Headline modern besar tetapi tidak memenuhi seluruh viewport; angka performa memakai tabular numerals untuk rasa dashboard.

### Brand Essence

**Gema Pradana adalah performance marketer yang mengubah budget digital menjadi pertumbuhan yang terukur, disajikan dalam portfolio yang bisa dijelajahi lintas era.**

Personality: **eksperimental, terukur, hangat.**

### Brand Voice

Headline terdengar tegas tetapi tidak bombastis. CTA berbentuk ajakan eksplorasi yang konkret, bukan filler korporat.

Contoh headline: **“Budget masuk sebagai angka. Keluar sebagai momentum.”**

Contoh CTA: **“Buka case files → lihat apa yang bergerak.”**

### Wordmark & Logo

Wordmark terdiri dari `GEMA` dalam bentuk monospaced pixel untuk mode ’95 dan versi condensed geometric untuk 2026. Mark-nya adalah simbol **G** berbentuk bracket terbuka dengan satu pixel/terminal dot di sudut kanan bawah, sehingga terbaca sebagai inisial sekaligus prompt aktif.

### Signature Brand Color

**Signal Lime — #C8FF3D.** Warna ini terasa seperti highlight marker di panel Windows lama sekaligus aksen data modern. Ia dipakai hemat untuk status, metrik, dan perpindahan mode agar tetap ownable.

## Keputusan Implementasi

Mode ’95 dan mode 2026 akan hidup dalam satu halaman React, dengan `localStorage` menyimpan mode terakhir. Konten portfolio akan dibuka sebagai panel yang sama-sama accessible: Work, About, What I Do, Resume, CV Runner, Music, Contact, dan switch mode. Fungsi permainan/arcade dari situs gemacave lama tidak akan dipindahkan ke project baru ini kecuali diminta lagi; fokus iterasi ini adalah dua pengalaman portfolio yang terinspirasi referensi.

## Style Decisions

- Legacy mode uses **GemaOS ’95** consistently across the boot screen, lock screen, desktop chrome, screensaver, taskbar, and transition copy.
- Gema 2026 leads with an editorial evidence desk: the shared bracket-G mark, a proof-led headline, and concrete ROAS / GMV / budget metrics appear before ambient calendar, weather, and clock details.
- The bracket-G mark is the shared identity anchor: pixel-terminal in GemaOS ’95 and geometric/status-led in Gema 2026, with Signal Lime reserved for focused identity and action states.
- Modern mode must use the cyberpunk wallpaper as atmospheric depth only; graphite surfaces, pearl text, and Signal Lime proof markers carry the primary identity.
- The first unlocked 2026 view must foreground at least three concrete performance proofs before ambient widgets, with the GEMA mark visible on the lock screen and menubar.
- Reference interactions are translated into Gema’s own system: Start menu and named OS shortcuts for ’95; side navigation, expandable case-study evidence, and a playlist utility for 2026.
