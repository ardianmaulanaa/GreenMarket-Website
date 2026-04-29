-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateTable
CREATE TABLE "Alamat" (
    "id_alamat"      SERIAL NOT NULL,
    "id_user"        INTEGER NOT NULL,
    "nama_penerima"  TEXT NOT NULL,
    "nomor_hp"       TEXT NOT NULL,
    "alamat_lengkap" TEXT NOT NULL,

    CONSTRAINT "Alamat_pkey" PRIMARY KEY ("id_alamat")
);

-- AddForeignKey
ALTER TABLE "Alamat" ADD CONSTRAINT "Alamat_id_user_fkey"
    FOREIGN KEY ("id_user") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;