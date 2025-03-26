import { KategoriProps } from "./interface";

export const categories: KategoriProps[] = [
  {
    id: 1,
    name: "Pelaporan",
    subcategories: [
      { id: 101, name: "Buat Laporan" },
      { id: 102, name: "Cek Status Laporan" },
    ],
  },
  {
    id: 2,
    name: "Manajemen Laporan",
    subcategories: [
      { id: 201, name: "Lihat Progress (Admin)" },
      { id: 202, name: "Proses ke Komnas (Admin)" },
      { id: 203, name: "Update Progress ke User (Admin)" },
    ],
  },
  {
    id: 3,
    name: "Publikasi",
    subcategories: [
      { id: 301, name: "Buat Artikel" },
      { id: 302, name: "Kelola Artikel" },
    ],
  },
];
