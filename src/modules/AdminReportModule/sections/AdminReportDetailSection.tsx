"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminReport } from "../interface";
import { maskName } from "./utils";
import Link from "next/link";

const BE_URL = "https://kelompok-3-suarakan-be.pkpl.cs.ui.ac.id"

const formatDate = (isoString: string | null | undefined): string => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

interface ExtendedReportData {
  report: AdminReport;
  updateId: number | null;
}

export default function AdminReportDetailSection() {
  const params = useParams();
  const reportId = params.id as string;
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

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return "bg-[#9AC4F8]/20 text-[#6A4C93] border-[#9AC4F8]";
    
    switch(status.toLowerCase()) {
      case "received":
        return "bg-[#9AC4F8]/20 text-[#6A4C93] border-[#9AC4F8]";
      case "processing":
        return "bg-[#FFC107]/20 text-[#E65100] border-[#FFC107]";
      case "completed":
        return "bg-[#4CAF50]/20 text-[#2E7D32] border-[#4CAF50]";
      case "rejected":
        return "bg-[#FFCAD4]/20 text-[#D32F2F] border-[#FFCAD4]";
      default:
        return "bg-[#9AC4F8]/20 text-[#6A4C93] border-[#9AC4F8]";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4FC] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#FFCAD4]/30 border-t-[#6A4C93] animate-spin"></div>
            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-transparent border-b-[#9AC4F8] animate-spin animation-delay-150"></div>
          </div>
          <p className="text-[#1A1A2E]/70 font-medium">Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F4FC] p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm relative mb-6" role="alert">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-red-100">
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-medium">Terjadi Kesalahan</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
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
              className="bg-[#6A4C93] hover:bg-[#6A4C93]/90 text-white px-4 py-2 rounded-lg flex items-center shadow-md transform hover:-translate-y-0.5 transition-all"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Kembali ke Daftar Laporan
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!reportData) {
    return (
      <div className="min-h-screen bg-[#F8F4FC] p-8 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-[#FFCAD4]/20 flex items-center justify-center rounded-full mb-4">
          <svg className="w-8 h-8 text-[#6A4C93]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-xl font-medium text-[#1A1A2E] mb-4">Data tidak ditemukan</p>
        <button
          onClick={() => router.push("/admin/report")}
          className="bg-[#6A4C93] hover:bg-[#6A4C93]/90 text-white px-4 py-2 rounded-lg flex items-center shadow-md transform hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Kembali ke Daftar Laporan
        </button>
      </div>
    );
  }

  const report = reportData.report;
  const isStatusReceived = report.status?.toLowerCase() === "received";

  return (
    <div className="min-h-screen bg-[#F8F4FC] px-4 md:px-8 py-6 relative">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-[#FFCAD4]/10 -z-10"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-[#9AC4F8]/10 -z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-[#6A4C93]/10 -z-10"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Link href="/admin/report" className="flex items-center">
          <div className="p-2 bg-white rounded-full shadow-md mr-2 text-[#6A4C93]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[#6A4C93] font-medium">Kembali ke daftar laporan</span>
        </Link>
        
        <h1 className="text-xl md:text-2xl font-bold text-[#6A4C93] flex items-center">
          Detail Laporan #{report.reportid}
          <span className="text-[#FFCAD4] text-sm ml-2">♥</span>
        </h1>
      </div>
      
      {sendSuccess === false && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm mb-6" role="alert">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 mr-3 flex items-center justify-center rounded-full bg-red-100">
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p>Gagal mengirim laporan ke instansi terkait. Silakan coba lagi nanti.</p>
          </div>
        </div>
      )}

      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-white border border-[#9AC4F8]/20 rounded-xl shadow-md p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFCAD4]/5 rounded-bl-full"></div>
          
          <h2 className="text-lg font-semibold text-[#6A4C93] mb-3 flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#FFCAD4] mr-2"></span>
            Tindakan Cepat
          </h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSendToAuthority}
              disabled={!isStatusReceived || sending || !report.authority}
              className={`flex items-center px-4 py-2 rounded-lg text-white transition-all shadow-md transform hover:-translate-y-0.5 ${
                isStatusReceived && report.authority
                  ? "bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                  : "bg-[#9AC4F8]/40 cursor-not-allowed"
              }`}
            >
              {sending ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Mengirim...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Kirim ke {report.authority || "Instansi Terkait"}
                </>
              )}
            </button>
            
            <button
              onClick={() => router.push(reportData.updateId ? `/admin/update/${reportData.updateId}` : `/admin/update/${report.reportid}`)}
              className="bg-[#6A4C93] hover:bg-[#6A4C93]/90 text-white px-4 py-2 rounded-lg flex items-center shadow-md transform hover:-translate-y-0.5 transition-all"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Update Status Laporan
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#9AC4F8]/20 rounded-xl shadow-md p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCAD4]/5 rounded-bl-full"></div>
          
          <h2 className="text-xl font-semibold text-[#6A4C93] mb-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-[#6A4C93]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Informasi Laporan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">ID Laporan:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2 font-medium">{report.reportid}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Tanggal Pelaporan:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{formatDate(report.createdat)}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Tanggal Update:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{formatDate(report.updatedat)}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Status:</label>
              <p className={`rounded-lg px-3 py-2 font-medium ${getStatusBadge(report.status)} border`}>
                {report.status || "Received"}
              </p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Instansi Terkait:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.authority || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Catatan:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2 whitespace-pre-wrap">{report.remarks || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Link Bukti:</label>
              {report.proof ? (
                <a href={report.proof} target="_blank" rel="noreferrer" className="text-[#6A4C93] underline block bg-[#F8F4FC] rounded-lg px-3 py-2 flex items-center">
                  {report.proof}
                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ) : (
                <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">Tidak tersedia</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#9AC4F8]/20 rounded-xl shadow-md p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCAD4]/5 rounded-bl-full"></div>
          
          <h2 className="text-xl font-semibold text-[#6A4C93] mb-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-[#6A4C93]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Informasi Pelapor
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Nama Pelapor:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{maskName(report.reporterfullname)}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">ID Pelapor:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.reporterid}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Alamat Pelapor:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.reporteraddress || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">No. Telepon Pelapor:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.reporterphonenum || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Hubungan dengan Korban:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.reporterrelationship || "-"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#9AC4F8]/20 rounded-xl shadow-md p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCAD4]/5 rounded-bl-full"></div>
          
          <h2 className="text-xl font-semibold text-[#6A4C93] mb-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-[#6A4C93]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Informasi Korban
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Nama Korban:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.victimfullname || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Tempat Lahir:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.victimplaceofbirth || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Tanggal Lahir:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.victimdateofbirth || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Jenis Kelamin:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.victimsex || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Email:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.victimemail || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">No. Telepon:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.victimphonenum || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Pekerjaan:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.victimoccupation || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Tingkat Pendidikan:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.victimeducationlevel || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Status Pernikahan:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.victimmarriagestatus || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">NIK:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.victimnik || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Alamat:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.victimaddress || "-"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#9AC4F8]/20 rounded-xl shadow-md p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCAD4]/5 rounded-bl-full"></div>
          
          <h2 className="text-xl font-semibold text-[#6A4C93] mb-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-[#6A4C93]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11L18 14M12 11L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Informasi Terlapor
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Nama Terlapor:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.accusedfullname || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Jenis Kelamin:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.accusedsex || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">No. Telepon:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.accusedphonenum || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Pekerjaan:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.accusedoccupation || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Hubungan dengan Korban:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.accusedrelationship || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Alamat:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.accusedaddress || "-"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#9AC4F8]/20 rounded-xl shadow-md p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCAD4]/5 rounded-bl-full"></div>
          
          <h2 className="text-xl font-semibold text-[#6A4C93] mb-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-[#6A4C93]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12H2M22 12L18 8M22 12L18 16M16 8C16 6.4087 15.3679 4.88258 14.2426 3.75736C13.1174 2.63214 11.5913 2 10 2C8.4087 2 6.88258 2.63214 5.75736 3.75736C4.63214 4.88258 4 6.4087 4 8M8 16C8 17.5913 8.63214 19.1174 9.75736 20.2426C10.8826 21.3679 12.4087 22 14 22C15.5913 22 17.1174 21.3679 18.2426 20.2426C19.3679 19.1174 20 17.5913 20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Informasi Insiden
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Deskripsi Insiden:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2 whitespace-pre-wrap min-h-24">{report.incidentdescription || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Lokasi Insiden:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.incidentlocation || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Waktu Insiden:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">{report.incidenttime || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Bukti Insiden:</label>
              {report.incidentproof ? (
                <a href={report.incidentproof} target="_blank" rel="noreferrer" className="text-[#6A4C93] underline block bg-[#F8F4FC] rounded-lg px-3 py-2 flex items-center">
                  {report.incidentproof}
                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ) : (
                <p className="bg-[#F8F4FC] rounded-lg px-3 py-2">Tidak tersedia</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-[#1A1A2E]/60 block mb-1">Kebutuhan Korban:</label>
              <p className="bg-[#F8F4FC] rounded-lg px-3 py-2 whitespace-pre-wrap">{report.incidentvictimneeds || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      {showPopup && sendSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFCAD4]/5 rounded-bl-full"></div>
            
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-[#4CAF50]/20 flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-[#4CAF50]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#4CAF50]">Berhasil Mengirim Laporan</h3>
            </div>
            
            <p className="mb-6 text-[#1A1A2E]/80">
              Laporan telah berhasil dikirim ke <span className="font-medium">{report.authority}</span>. Jangan lupa untuk memperbarui status laporan secara manual.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-[#9AC4F8]/20 text-[#6A4C93] rounded-lg hover:bg-[#9AC4F8]/40 transition-all"
              >
                Tutup
              </button>
              <button
                onClick={() => router.push(reportData.updateId ? `/admin/update/${reportData.updateId}` : `/admin/update/${report.reportid}`)}
                className="px-4 py-2 bg-[#6A4C93] text-white rounded-lg hover:bg-[#6A4C93]/90 transition-all flex items-center"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}