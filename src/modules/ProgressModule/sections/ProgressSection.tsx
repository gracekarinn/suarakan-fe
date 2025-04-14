"use client";

import React, { useState } from "react";
import { ReportUpdate } from "../interface";
import { MOCK_UPDATES } from "../constant";
import { Edit, Trash } from "lucide-react";

const ProgressSection: React.FC = () => {
  const [updates] = useState<ReportUpdate[]>(MOCK_UPDATES);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
  };

  const handleDeleteClick = (id: number) => {
    setPendingDeleteId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDeleteId !== null) {
    }
    setIsModalOpen(false);
    setPendingDeleteId(null);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setPendingDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-orange-700">Riwayat Pelaporan</h1>
      </div>

      {/* Tabel Progress */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="min-w-full">
          {/* Table Head */}
          <thead className="bg-orange-100 text-orange-800 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3 border">No Laporan</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Terakhir Diperbarui</th>
              <th className="px-4 py-3 border">Catatan</th>
              <th className="px-4 py-3 border">Bukti Penanganan</th>
              <th className="px-4 py-3 border">Aksi</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {updates.map((item) => (
              <tr key={item.updateId} className="hover:bg-orange-50">
                <td className="px-4 py-2 text-center border">{item.reportId}</td>
                <td className="px-4 py-2 text-center border">
                  <span
                    className={
                      "px-3 py-1 rounded text-white text-sm font-medium " +
                      (item.status === "Received"
                        ? "bg-blue-500"
                        : item.status === "Processing"
                        ? "bg-yellow-500"
                        : item.status === "Completed"
                        ? "bg-green-500"
                        : "bg-red-500")
                    }
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center border">
                  {new Date(item.updatedAt).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-2 border text-sm text-gray-700">
                  {item.remarks || "-"}
                </td>
                <td className="px-4 py-2 text-center border">
                  {item.proof ? (
                    <a
                      href={item.proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Lihat Bukti
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2 text-center border">
                  <button
                    className="mr-2 p-2 rounded bg-yellow-300 hover:bg-yellow-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleEdit(item.updateId)}
                    disabled={item.status !== "Received"}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="p-2 rounded bg-yellow-300 hover:bg-yellow-200 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDeleteClick(item.updateId)}
                    disabled={item.status !== "Received"}
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={cancelDelete}
          ></div>
          <div className="bg-white rounded p-6 z-10 max-w-sm w-full mx-auto">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p className="mb-4">Apakah Anda yakin ingin menghapus laporan ini?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Ya
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressSection;
