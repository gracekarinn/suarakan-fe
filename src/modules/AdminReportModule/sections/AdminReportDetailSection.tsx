"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminReport } from "../interface";
import { maskName } from "./utils";
import { ArrowLeft, Send, CheckCircle, AlertTriangle, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

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

interface ExtendedReportData {
  report: AdminReport;
  updateId: number | null;
}

export default function AdminReportDetailSection({ reportId }: AdminReportDetailSectionProps) {
  const router = useRouter();
  const [reportData, setReportData] = useState<ExtendedReportData | null>(null);
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
        
        const mappedReport: ExtendedReportData = {
          report: {
            ...data.report,
            status: data.update?.status ?? "received",
            remarks: data.update?.remarks ?? "",
            proof: data.update?.proof ?? "",
            updatedat: data.update?.updatedat ?? null,
          },
          updateId: data.update?.updateid ?? null,
        };

        setReportData(mappedReport);
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
    if (!reportData || reportData.report.status?.toLowerCase() !== "received" || !reportData.report.authority) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-orange-700 mb-4" />
          <p className="text-gray-600 font-medium">Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-1">{error}</span>
          </div>
          <div className="mt-4 text-sm">
            <p>Beberapa kemungkinan solusi:</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Periksa koneksi internet Anda</li>
              <li>Pastikan endpoint API sudah benar</li>
              <li>Coba login kembali untuk mendapatkan token baru</li>
              <li>Pastikan ID yang digunakan valid</li>
            </ul>
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.push("/admin/report")}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Laporan
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!reportData) {
    return (
      <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center">
        <AlertTriangle className="h-16 w-16 text-orange-600 mb-4" />
        <p className="text-xl font-medium text-gray-700 mb-4">Data tidak ditemukan</p>
        <button
          onClick={() => router.push("/admin/report")}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Daftar Laporan
        </button>
      </div>
    );
  }

  const report = reportData.report;
  const isStatusReceived = report.status?.toLowerCase() === "received";
  
  const getStatusColorClass = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch(status.toLowerCase()) {
      case "received":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/admin/report" className="flex items-center mr-4">
            <ArrowLeft className="h-5 w-5 mr-1 text-orange-700" />
            <span className="text-orange-700">Kembali ke daftar laporan</span>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-orange-700">
          Detail Laporan #{report.reportid}
        </h1>
      </div>
      
      {sendSuccess === false && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <strong className="font-bold">Gagal!</strong>
            <span className="block sm:inline ml-1">Gagal mengirim laporan ke instansi terkait. Silakan coba lagi nanti.</span>
          </div>
        </div>
      )}

      <div className="space-y-6 max-w-4xl">
        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Tindakan Cepat</h2>
          <div className="flex gap-3">
            <button
              onClick={handleSendToAuthority}
              disabled={!isStatusReceived || sending || !report.authority}
              className={`flex items-center px-4 py-2 rounded-md text-white ${
                isStatusReceived && report.authority
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Kirim ke {report.authority || "Instansi Terkait"}
                </>
              )}
            </button>
            
            <button
              onClick={() => router.push(reportData.updateId ? `/admin/update/${reportData.updateId}` : `/admin/update/${report.reportid}`)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Update Status Laporan
            </button>
          </div>
        </div>

        {/* Informasi Laporan */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-orange-700 mb-4 flex items-center">
            <div className="bg-orange-100 p-2 rounded-full mr-2">
              <AlertTriangle className="h-5 w-5 text-orange-700" />
            </div>
            Informasi Laporan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">ID Laporan:</label>
              <p className="bg-gray-100 rounded px-3 py-2 font-medium">{report.reportid}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Tanggal Pelaporan:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{formatDate(report.createdat)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Tanggal Update:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{formatDate(report.updatedat)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Status:</label>
              <p className={`rounded px-3 py-2 font-medium ${getStatusColorClass(report.status)}`}>
                {report.status || "Received"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Instansi Terkait:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.authority || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Catatan:</label>
              <p className="bg-gray-100 rounded px-3 py-2 whitespace-pre-wrap">{report.remarks || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">Link Bukti:</label>
              {report.proof ? (
                <a href={report.proof} target="_blank" rel="noreferrer" className="text-blue-600 underline block bg-gray-100 rounded px-3 py-2 flex items-center">
                  {report.proof}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              ) : (
                <p className="bg-gray-100 rounded px-3 py-2">Tidak tersedia</p>
              )}
            </div>
          </div>
        </div>

        {/* Informasi Pelapor */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            Informasi Pelapor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Nama Pelapor:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{maskName(report.reporterfullname)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">ID Pelapor:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.reporterid}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Alamat Pelapor:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.reporteraddress || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">No. Telepon Pelapor:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.reporterphonenum || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Hubungan dengan Korban:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.reporterrelationship || "-"}</p>
            </div>
          </div>
        </div>

        {/* Informasi Korban */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
            <div className="bg-green-100 p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            Informasi Korban
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Nama Korban:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.victimfullname || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Tempat Lahir:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.victimplaceofbirth || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Tanggal Lahir:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.victimdateofbirth || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Jenis Kelamin:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.victimsex || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Email:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.victimemail || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">No. Telepon:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.victimphonenum || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Pekerjaan:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.victimoccupation || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Tingkat Pendidikan:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.victimeducationlevel || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Status Pernikahan:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.victimmarriagestatus || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">NIK:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.victimnik || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">Alamat:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.victimaddress || "-"}</p>
            </div>
          </div>
        </div>

        {/* Informasi Terlapor */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-red-700 mb-4 flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-700">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
            </div>
            Informasi Terlapor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Nama Terlapor:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.accusedfullname || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Jenis Kelamin:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.accusedsex || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">No. Telepon:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.accusedphonenum || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Pekerjaan:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.accusedoccupation || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Hubungan dengan Korban:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.accusedrelationship || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">Alamat:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.accusedaddress || "-"}</p>
            </div>
          </div>
        </div>

        {/* Informasi Insiden */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
            <div className="bg-purple-100 p-2 rounded-full mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-700">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            Informasi Insiden
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">Deskripsi Insiden:</label>
              <p className="bg-gray-100 rounded px-3 py-2 whitespace-pre-wrap min-h-24">{report.incidentdescription || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Lokasi Insiden:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.incidentlocation || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Waktu Insiden:</label>
              <p className="bg-gray-100 rounded px-3 py-2">{report.incidenttime || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">Bukti Insiden:</label>
              {report.incidentproof ? (
                <a href={report.incidentproof} target="_blank" rel="noreferrer" className="text-blue-600 underline block bg-gray-100 rounded px-3 py-2 flex items-center">
                  {report.incidentproof}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              ) : (
                <p className="bg-gray-100 rounded px-3 py-2">Tidak tersedia</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">Kebutuhan Korban:</label>
              <p className="bg-gray-100 rounded px-3 py-2 whitespace-pre-wrap">{report.incidentvictimneeds || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && sendSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-xl font-bold text-green-700">Berhasil Mengirim Laporan</h3>
            </div>
            <p className="mb-6">
              Laporan telah berhasil dikirim ke <span className="font-medium">{report.authority}</span>. Jangan lupa untuk memperbarui status laporan secara manual.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Tutup
              </button>
              <button
                onClick={() => router.push(reportData.updateId ? `/admin/update/${reportData.updateId}` : `/admin/update/${report.reportid}`)}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}