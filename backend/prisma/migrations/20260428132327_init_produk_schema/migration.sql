-- CreateTable
CREATE TABLE "Kategori_Produk" (
    "id_kategori" TEXT NOT NULL,
    "nama_kategori" TEXT NOT NULL,

    CONSTRAINT "Kategori_Produk_pkey" PRIMARY KEY ("id_kategori")
);

-- CreateTable
CREATE TABLE "Produk" (
    "id_produk" TEXT NOT NULL,
    "id_user_seller" TEXT NOT NULL,
    "id_kategori" TEXT NOT NULL,
    "nama_produk" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL,
    "status_produk" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("id_produk")
);

-- CreateTable
CREATE TABLE "Produk_Foto" (
    "id_foto" TEXT NOT NULL,
    "id_produk" TEXT NOT NULL,
    "url_foto" TEXT NOT NULL,

    CONSTRAINT "Produk_Foto_pkey" PRIMARY KEY ("id_foto")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id_wishlist" TEXT NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_produk" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id_wishlist")
);

-- CreateTable
CREATE TABLE "Alamat" (
    "id_alamat" TEXT NOT NULL,
    "id_user" INTEGER NOT NULL,
    "nama_penerima" TEXT NOT NULL,
    "nomor_hp" TEXT NOT NULL,
    "alamat_lengkap" TEXT NOT NULL,

    CONSTRAINT "Alamat_pkey" PRIMARY KEY ("id_alamat")
);

-- AddForeignKey
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "Kategori_Produk"("id_kategori") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produk_Foto" ADD CONSTRAINT "Produk_Foto_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "Produk"("id_produk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "Produk"("id_produk") ON DELETE CASCADE ON UPDATE CASCADE;
