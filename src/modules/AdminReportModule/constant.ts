import { AdminReport } from "./interface";

export const adminReports: AdminReport[] = [
  {
    id: 1,
    reporter: "A*** S****",
    description:
      "Laporan kekerasan terjadi di gedung A, perlu tindakan segera dari pihak keamanan.",
    reportDate: "2025-01-15",
    status: "received",
    updatedAt: "2025-01-20",
  },
  {
    id: 2,
    reporter: "S*** N****",
    description:
      "Kekerasan seksual di area parkir, laporan membutuhkan investigasi lebih lanjut.",
    reportDate: "2025-02-02",
    status: "processing",
  },
  {
    id: 3,
    reporter: "B*** A****",
    description:
      "Insiden minor terjadi pada ruangan kelas, menunggu validasi dan tindak lanjut.",
    reportDate: "2025-02-10",
    status: "completed",
    updatedAt: "2025-02-15",
  },
  {
    id: 4,
    reporter: "R*** M******",
    description:
      "Laporan kekerasan di asrama mahasiswa, diperlukan penanganan yang urgent.",
    reportDate: "2025-03-05",
    status: "received",
    updatedAt: "2025-03-06",
  },
  {
    id: 5,
    reporter: "D*** K*********",
    description:
      "Insiden tidak diungkap karena adanya intimidasi, perlu pendampingan korban.",
    reportDate: "2025-03-20",
    status: "rejected",
  },
];
