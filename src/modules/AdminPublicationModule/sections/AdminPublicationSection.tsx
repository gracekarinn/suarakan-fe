"use client";
import { usePublicationContext } from "@/context/PublicationContext";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminPublicationSection() {
  const { publications, deletePublication } = usePublicationContext();
  const router = useRouter();

  // State to control the modal visibility and the publication to delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publicationToDelete, setPublicationToDelete] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setPublicationToDelete(id);
    setIsModalOpen(true); // Open the modal to confirm delete
  };

  const confirmDelete = () => {
    if (publicationToDelete !== null) {
      deletePublication(publicationToDelete);
      setIsModalOpen(false); // Close the modal after deleting
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false); // Close the modal without deleting
  };

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">
          Dashboard Publikasi Kasus Kekerasan Seksual
        </h1>
        <Link href="/admin/publication/create">
          <button className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300">
            + Buat Publikasi
          </button>
        </Link>
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
            {publications.map((pub, index) => (
              <tr key={pub.id} className="hover:bg-orange-50">
                <td className="px-4 py-2 text-center border">{index + 1}.</td>
                <td className="px-4 py-2 border font-medium">{pub.title}</td>
                <td className="px-4 py-2 border text-sm text-gray-700 max-w-xs">
                  <div className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                    {pub.description}
                  </div>
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
                  <button
                    onClick={() => handleDelete(pub.id)}
                    className="p-2 rounded bg-yellow-300 hover:bg-yellow-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for delete confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-orange-700 mb-4">Konfirmasi Penghapusan</h3>
            <p className="mb-6">Apakah kamu yakin ingin menghapus publikasi ini?</p>
            <div className="flex justify-between">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
              >
                Ya, Hapus
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
