"use client";
import { adminpublications } from "../constant";
import { AdminPublication } from "../interface";
import { Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

export default function AdminPublicationSection() {
  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">
          Dashboard Publikasi Kasus Kekerasan Seksual
        </h1>
        <button className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300">
          + Buat Publikasi
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-orange-100 text-orange-800 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3 border">No.</th>
              <th className="px-4 py-3 border text-left">Judul</th>
              <th className="px-4 py-3 border text-left">Deskripsi</th>
              <th className="px-4 py-3 border">Tanggal Edit</th>
              <th className="px-4 py-3 border">Tanggal Buat</th>
              <th className="px-4 py-3 border">Link</th>
              <th className="px-4 py-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {adminpublications.map((pub, index) => (
              <tr key={pub.id} className="hover:bg-orange-50">
                <td className="px-4 py-2 text-center border">{index + 1}.</td>
                <td className="px-4 py-2 border font-medium">{pub.title}</td>
                <td className="px-4 py-2 border text-sm text-gray-700">
                  {pub.description.length > 50
                    ? pub.description.slice(0, 50) + "..."
                    : pub.description}
                </td>
                <td className="px-4 py-2 border text-center">
                  {pub.updatedAt ?? "-"}
                </td>
                <td className="px-4 py-2 border text-center">{pub.createdAt}</td>
                <td className="px-4 py-2 border text-center">
                  <a
                    href={pub.fileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open
                  </a>
                </td>
                <td className="px-4 py-2 border text-center space-x-2">
                  <Link href={`/admin/publication/${pub.id}`}>
                    <button className="p-2 rounded bg-yellow-300 hover:bg-yellow-200">
                      <Eye size={16} />
                    </button>
                  </Link>
                  <Link href={`/admin/publication/edit/${pub.id}`}>
                    <button className="p-2 rounded bg-yellow-300 hover:bg-yellow-200">
                      <Pencil size={16} />
                    </button>
                  </Link>
                  <button className="p-2 rounded bg-yellow-300 hover:bg-yellow-200">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
