// modules/homepagemodules/sections/constant.ts

import { IHomepageContent } from "./interface";

export const homepageContent: IHomepageContent = {
  heroSection: {
    title: "Suara Anda, Perubahan Nyata",
    subtitle:
      "Platform pengaduan bagi korban pelecehan seksual di lingkungan Universitas Indonesia. Laporkan kasus, pantau perkembangan penanganan oleh Satgas PPKS, dan akses publikasi transparan terkait solusi.",
    buttonText: "Laporkan",
    image: "/hero-image.jpg",
  },
  whySuarakanSection: {
    heading: "Mengapa SUARAKAN?",
    description:
      "Berakar pada keadilan, kami menyediakan platform aman untuk melawan pelecehan seksual dan memperkuat suara menuju lingkungan yang lebih aman",
    features: [
      {
        title: "AMAN & RAHASIA",
        description: "Data pelapor dan korban dienkripsi untuk melindungi privasi",
      },
      {
        title: "PEMANTAUAN",
        description: "Pantau status laporan secara mudah dan cepat",
      },
      {
        title: "TRANSPARANSI",
        description:
          "Akses publikasi resmi tentang perkembangan kasus dan upaya penyelesaian",
      },
      {
        title: "DUKUNGAN",
        description:
          "Laporan dapat diajukan ke beberapa pihak berwajib sekaligus",
      },
    ],
  },
};
