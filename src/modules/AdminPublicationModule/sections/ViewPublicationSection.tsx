"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { adminpublications } from "../constant";
import { AdminPublication } from "../interface";

const ViewPublicationSection = () => {
  const params = useParams();
  const { id } = params;
  const pub: AdminPublication | undefined = adminpublications.find(
    (p) => p.id === Number(id)
  );

  if (!pub) {
    return <div className="p-6">Publikasi tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">
          Detail Publikasi Kasus Kekerasan Seksual
        </h1>
        <Link href="/admin/publication">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-md">
            ← Kembali ke Dashboard
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-orange-100 text-orange-800 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3 border text-left w-1/4">Kolom</th>
              <th className="px-4 py-3 border text-left">Isi</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="hover:bg-orange-50">
              <td className="px-4 py-3 border font-medium bg-gray-50">Judul</td>
              <td className="px-4 py-3 border">{pub.title}</td>
            </tr>
            <tr className="hover:bg-orange-50">
              <td className="px-4 py-3 border font-medium bg-gray-50">Deskripsi</td>
              <td className="px-4 py-3 border">{pub.description}</td>
            </tr>
            <tr className="hover:bg-orange-50">
              <td className="px-4 py-3 border font-medium bg-gray-50">Tanggal Dibuat</td>
              <td className="px-4 py-3 border">{pub.createdAt}</td>
            </tr>
            <tr className="hover:bg-orange-50">
              <td className="px-4 py-3 border font-medium bg-gray-50">Tanggal Diedit</td>
              <td className="px-4 py-3 border">{pub.updatedAt ?? "-"}</td>
            </tr>
            <tr className="hover:bg-orange-50">
              <td className="px-4 py-3 border font-medium bg-gray-50">File Publikasi</td>
              <td className="px-4 py-3 border">
                <a
                  href={pub.fileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Lihat File
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPublicationSection;
