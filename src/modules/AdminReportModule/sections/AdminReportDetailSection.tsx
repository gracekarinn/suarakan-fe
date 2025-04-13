"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminReports } from "../constant";
import { AdminReport } from "../interface";

interface AdminReportDetailSectionProps {
reportId: string;
}

export default function AdminReportDetailSection({
reportId,
}: AdminReportDetailSectionProps) {
const router = useRouter();

const [reportData, setReportData] = useState<AdminReport | null>(null);
const [isSent, setIsSent] = useState(false);
const [isModalOpen, setIsModalOpen] = useState(false);

useEffect(() => {
    console.log("Mencari data dengan reportId:", reportId);
    const foundReport = adminReports.find((r) => r.reportId === reportId);
    console.log("Ditemukan:", foundReport);
    if (foundReport) {
    setReportData(foundReport);
    }
}, [reportId]);

if (!reportData) {
    return (
    <div className="min-h-screen bg-white p-6 md:p-10">
        <p>Data laporan tidak ditemukan.</p>
    </div>
    );
}

const handleSend = () => {
    if (!reportData.authority) {
    alert("Laporan belum memiliki innformasi instansi berwenang yang dituju.");
    return;
    }
    setIsModalOpen(true);
};

const confirmSend = () => {
    setIsSent(true);
    setIsModalOpen(false);
};

const cancelSend = () => {
    setIsModalOpen(false);
};

const goBack = () => {
    router.push("/admin/report");
};

return (
    <div className="min-h-screen bg-white p-6 md:p-10">
    <h1 className="text-2xl md:text-3xl font-bold text-[#3B3A3A] mb-4">
        Detail Laporan
    </h1>

    <div className="space-y-4 max-w-xl">
        {/* ID Laporan */}
        <div>
        <label className="block text-sm font-medium text-gray-700">
            ID Laporan
        </label>
        <input
            type="text"
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
            value={reportData.reportId}
        />
        </div>

        {/* Pelapor */}
        <div>
        <label className="block text-sm font-medium text-gray-700">
            Pelapor
        </label>
        <input
            type="text"
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
            value={reportData.reporterId}
        />
        </div>

        {/* Tanggal Dibuat */}
        <div>
        <label className="block text-sm font-medium text-gray-700">
            Tanggal Dibuat
        </label>
        <input
            type="text"
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
            value={reportData.createdAt}
        />
        </div>

        {/* Tanggal Update */}
        <div>
        <label className="block text-sm font-medium text-gray-700">
            Tanggal Update
        </label>
        <input
            type="text"
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
            value={reportData.updatedAt || "-"}
        />
        </div>

        {/* Bukti */}
        <div>
        <label className="block text-sm font-medium text-gray-700">
            Bukti
        </label>
        <input
            type="text"
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
            value={reportData.proofId}
        />
        </div>

        {/* Deskripsi */}
        <div>
        <label className="block text-sm font-medium text-gray-700">
            Deskripsi
        </label>
        <textarea
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
            rows={3}
            value={reportData.description}
        />
        </div>

        {/* Korban */}
        <div>
        <label className="block text-sm font-medium text-gray-700">
            Korban
        </label>
        <input
            type="text"
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
            value={reportData.victimId}
        />
        </div>

        {/* Pelaku */}
        <div>
        <label className="block text-sm font-medium text-gray-700">
            Pelaku
        </label>
        <input
            type="text"
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100"
            value={reportData.accusedId}
        />
        </div>

        {/* Otoritas dan Tombol Kirim */}
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingin dilaporkan ke mana?
        </label>
        <div className="flex items-center space-x-2">
            <input
            type="text"
            readOnly
            className="block w-full rounded-md border-gray-300 bg-gray-100"
            value={reportData.authority}
            />
            <button
            onClick={handleSend}
            disabled={isSent}
            className={`px-3 py-2 rounded font-semibold text-white ${
                isSent
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-500"
            }`}
            >
            {isSent ? "Terkirim" : "Kirim"}
            </button>
        </div>
        </div>
    </div>

    {/* Tombol Kembali ke Beranda */}
    <div className="mt-8">
        <button
        onClick={goBack}
        className="px-4 py-2 rounded font-semibold text-white bg-gray-500 hover:bg-gray-400"
        >
        Kembali ke Beranda
        </button>
    </div>

    {/* Modal Konfirmasi */}
    {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Overlay */}
        <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={cancelSend}
        />
        {/* Konten Modal */}
        <div className="relative bg-white rounded shadow-lg p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-bold mb-4">Konfirmasi Pengiriman</h2>
            <p className="mb-6">
            Apakah Anda yakin ingin mengirim laporan ke otoritas "
            {reportData.authority}"?
            </p>
            <div className="flex justify-end space-x-3">
            <button
                onClick={confirmSend}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
            >
                Ya
            </button>
            <button
                onClick={cancelSend}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
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
