"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminReport } from "../interface";
import { maskName } from "./utils";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL ?? "http://localhost:3000";

const formatDate = (isoString: string | null | undefined): string => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

interface AdminReportDetailSectionProps {
  reportId: string;
}

export default function AdminReportDetailSection({ reportId }: AdminReportDetailSectionProps) {
  const router = useRouter();
  const [reportData, setReportData] = useState<AdminReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Token tidak ditemukan.");

        const res = await fetch(`${BE_URL}/api/v1/reports/${reportId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("access_token");
            throw new Error("Akses ditolak. Silakan login kembali.");
          }
          throw new Error(`Gagal fetch laporan: ${res.status}`);
        }

        const data = await res.json();
        const mapped = {
          ...data.report,
          status: data.update?.status ?? "received",
          remarks: data.update?.remarks ?? "",
          proof: data.update?.proof ?? "",
          updatedat: data.update?.updatedat ?? null,
        };

        setReportData(mapped);
        setError(null);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [reportId]);

  const handleSendToAuthority = async () => {
    if (!reportData || reportData.status?.toLowerCase() !== "received" || !reportData.authority) {
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token tidak ditemukan.");

      await new Promise(resolve => setTimeout(resolve, 1000));

      setSendSuccess(true);
      setShowPopup(true);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan saat mengirim laporan.");
      setSendSuccess(false);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="p-10 text-center">Memuat data...</p>;
  if (error) return <p className="p-10 text-red-600 text-center">{error}</p>;
  if (!reportData) return <p className="p-10 text-center">Data tidak ditemukan</p>;

  const isStatusReceived = reportData.status?.toLowerCase() === "received";

  return (
    <div className="min-h-screen bg-white p-6 relative">
      <h1 className="text-2xl font-bold text-orange-700 mb-6">Detail Laporan</h1>

      <div className="space-y-8 max-w-4xl">
        {/* Informasi Laporan */}
        <div className="bg-orange-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-orange-700 mb-4">Informasi Laporan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">ID Laporan:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.reportid}</p>
            </div>
            <div>
              <label className="font-medium">Tanggal Pelaporan:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{formatDate(reportData.createdat)}</p>
            </div>
            <div>
              <label className="font-medium">Tanggal Update:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{formatDate(reportData.updatedat)}</p>
            </div>
            <div>
              <label className="font-medium">Status:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.status}</p>
            </div>
            <div className="flex flex-col">
              <label className="font-medium">Instansi Terkait:</label>
              <div className="flex items-center gap-2">
                <p className="bg-gray-100 rounded px-3 py-2 flex-grow">{reportData.authority || "-"}</p>
                <button
                  onClick={handleSendToAuthority}
                  disabled={!isStatusReceived || sending || !reportData.authority}
                  className={`px-3 py-2 rounded text-white whitespace-nowrap ${
                    isStatusReceived && reportData.authority
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {sending ? "Mengirim..." : "Kirim ke Authority"}
                </button>
              </div>
            </div>
            <div>
              <label className="font-medium">Catatan:</label>
              <p className="bg-gray-100 rounded px-3 py-2 whitespace-pre-wrap">{reportData.remarks || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="font-medium">Link Bukti:</label>
              {reportData.proof ? (
                <a href={reportData.proof} target="_blank" rel="noreferrer" className="text-blue-600 underline block bg-gray-100 rounded px-3 py-2">
                  {reportData.proof}
                </a>
              ) : (
                <p className="bg-gray-100 rounded px-3 py-2">Tidak tersedia</p>
              )}
            </div>
          </div>
        </div>

        {/* Informasi Pelapor */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Informasi Pelapor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Nama Pelapor:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{maskName(reportData.reporterfullname)}</p>
            </div>
            <div>
              <label className="font-medium">ID Pelapor:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.reporterid}</p>
            </div>
            <div>
              <label className="font-medium">Alamat Pelapor:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.reporteraddress || "-"}</p>
            </div>
            <div>
              <label className="font-medium">No. Telepon Pelapor:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.reporterphonenum || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Hubungan dengan Korban:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.reporterrelationship || "-"}</p>
            </div>
          </div>
        </div>

        {/* Informasi Korban */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Informasi Korban</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Nama Korban:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.victimfullname || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Tempat Lahir:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.victimplaceofbirth || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Tanggal Lahir:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.victimdateofbirth || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Jenis Kelamin:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.victimsex || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Email:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.victimemail || "-"}</p>
            </div>
            <div>
              <label className="font-medium">No. Telepon:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.victimphonenum || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Pekerjaan:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.victimoccupation || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Tingkat Pendidikan:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.victimeducationlevel || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Status Pernikahan:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.victimmarriagestatus || "-"}</p>
            </div>
            <div>
              <label className="font-medium">NIK:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.victimnik || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="font-medium">Alamat:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.victimaddress || "-"}</p>
            </div>
          </div>
        </div>

        {/* Informasi Terlapor */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Informasi Terlapor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Nama Terlapor:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.accusedfullname || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Jenis Kelamin:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.accusedsex || "-"}</p>
            </div>
            <div>
              <label className="font-medium">No. Telepon:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.accusedphonenum || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Pekerjaan:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.accusedoccupation || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Hubungan dengan Korban:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.accusedrelationship || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="font-medium">Alamat:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.accusedaddress || "-"}</p>
            </div>
          </div>
        </div>

        {/* Informasi Insiden */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Informasi Insiden</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="font-medium">Deskripsi Insiden:</label>
              <p className="bg-gray-100 rounded px-3 py-2 whitespace-pre-wrap">{reportData.incidentdescription || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Lokasi Insiden:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.incidentlocation || "-"}</p>
            </div>
            <div>
              <label className="font-medium">Waktu Insiden:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{reportData.incidenttime || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="font-medium">Bukti Insiden:</label>
              {reportData.incidentproof ? (
                <a href={reportData.incidentproof} target="_blank" rel="noreferrer" className="text-blue-600 underline block bg-gray-100 rounded px-3 py-2">
                  {reportData.incidentproof}
                </a>
              ) : (
                <p className="bg-gray-100 rounded px-3 py-2">Tidak tersedia</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="font-medium">Kebutuhan Korban:</label>
              <p className="bg-gray-100 rounded px-3 py-2 whitespace-pre-wrap">{reportData.incidentvictimneeds || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && sendSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-green-700 mb-4">Berhasil Mengirim Laporan</h3>
            <p className="mb-6">
              Laporan telah berhasil dikirim ke {reportData.authority}. Jangan lupa untuk memperbarui status laporan secara manual.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Tutup
              </button>
              <button
                onClick={() => router.push(`/admin/update/${reportData.reportid}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message for failed send */}
      {sendSuccess === false && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          Gagal mengirim laporan. Silakan coba lagi nanti.
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => router.push("/admin/report")}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          Kembali ke Daftar Laporan
        </button>
      </div>
    </div>
  );
}