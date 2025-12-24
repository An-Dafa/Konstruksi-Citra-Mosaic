# Photo Mosaic Berbasis Aljabar Linier dan Geometri

Program ini merupakan implementasi sistem pembentukan citra photo mosaic dengan memanfaatkan konsep-konsep Aljabar Linier dan Geometri. Citra target dibentuk kembali menggunakan kumpulan citra dataset sebagai elemen penyusun, di mana setiap bagian citra direpresentasikan dan diproses secara matematis dalam ruang vektor warna RGB.

Program ini dikembangkan sebagai bagian dari tugas mata kuliah Aljabar Linier dan Geometri.

## 📌 Deskripsi Singkat

Sistem bekerja dengan membagi citra target ke dalam blok-blok kecil, kemudian setiap blok dipetakan ke citra dataset yang memiliki karakteristik warna paling mendekati. Proses pencocokan dilakukan menggunakan jarak Euclidean antar vektor warna, dan kualitas hasil ditingkatkan dengan transformasi linier warna.

Hasil akhirnya berupa citra mosaic baru yang secara global menyerupai citra target, namun secara lokal sepenuhnya tersusun dari citra dataset.

## 🧮 Konsep Aljabar Linier dan Geometri yang Digunakan

Beberapa konsep utama yang digunakan dalam program ini antara lain:
1. Representasi warna RGB sebagai vektor dalam ruang Euclidean ℝ³
2. Perhitungan jarak Euclidean untuk mengukur kemiripan warna
3. Aproksimasi vektor menggunakan metode nearest neighbor
4. Transformasi linier warna menggunakan skala per kanal RGB
5. Diskretisasi spasial citra menggunakan grid blok
6. Konsep-konsep tersebut diterapkan secara langsung dalam proses pembentukan citra mosaic.

## ⚙️ Cara Kerja Program (Garis Besar)

1. Pengguna mengunggah satu citra target.
2.  Pengguna mengunggah kumpulan citra dataset (file atau folder).
3. Setiap citra dataset diubah ukurannya dan direpresentasikan sebagai vektor warna RGB.
4. Citra target dibagi menjadi blok-blok kecil.
5. Untuk setiap blok, dicari citra dataset dengan jarak Euclidean terkecil.
6. Dilakukan transformasi linier warna untuk menyesuaikan warna citra dataset.
7. Citra mosaic disusun pada canvas dan ditampilkan ke pengguna.

## 🖥️ Teknologi yang Digunakan
1. HTML
2. JavaScript
3. Canvas API (HTML5)

## ⚙️ Cara Menjalankan Program
1. Clone repository ini dengan
```
git clone https://github.com/An-Dafa/Konstruksi-Citra-Mosaic.git
```
2. Masuk ke folder image-mosaic-algeo
```
cd image-mosaic-algeo
```
3. Jalankan dengan
```
node server.js
```
