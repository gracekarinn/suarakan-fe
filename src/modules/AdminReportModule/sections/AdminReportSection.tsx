"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminReport } from "../interface";
import { sanitizeString, maskName } from "./utils";


const BE_URL = "https://kelompok-3-suarakan-be.pkpl.cs.ui.ac.id"

const formatDate = (isoString: string | null | undefined): string => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const pad = (n: number) => n.toString().padStart(2, "0");

  const dd = pad(date.getDate());
  const mm = pad(date.getMonth() + 1);
  const yyyy = date.getFullYear();
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
};

interface ExtendedReportData {
  report: AdminReport;
  updateId: number | null;
}

export default function AdminReportSection() {
  const [reportsData, setReportsData] = useState<ExtendedReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Token tidak ditemukan.");

        const response = await fetch(`${BE_URL}/api/v1/reports`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("access_token");
            throw new Error("Akses ditolak. Silakan login kembali.");
          }
          throw new Error(`Error: ${response.status}`);
        }

        const rawData = await response.json();
        const mappedData: ExtendedReportData[] = rawData.map((item: any) => ({
          report: {
            ...item.report,
            status: item.update?.status || "received",
            remarks: item.update?.remarks || "",
            proof: item.update?.proof || "",
          },
          updateId: item.update?.updateid || null,
        }));

        setReportsData(mappedData);
        setError(null);
      } catch (err) {
        setError(`Gagal mengambil data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    localStorage.removeItem("is_logged_in");
    router.push("/auth/login");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { bg: string; text: string; border: string } } = {
      received: { bg: "bg-[#9AC4F8]/20", text: "text-[#6A4C93]", border: "border-[#9AC4F8]" },
      processing: { bg: "bg-[#FFC107]/20", text: "text-[#E65100]", border: "border-[#FFC107]" },
      completed: { bg: "bg-[#4CAF50]/20", text: "text-[#2E7D32]", border: "border-[#4CAF50]" },
      rejected: { bg: "bg-[#FFCAD4]/20", text: "text-[#D32F2F]", border: "border-[#FFCAD4]" },
      resolved: { bg: "bg-[#4CAF50]/20", text: "text-[#2E7D32]", border: "border-[#4CAF50]" }
    };

    const style = statusMap[status.toLowerCase()] || statusMap.received;

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${style.bg} ${style.text} ${style.border} border font-medium whitespace-nowrap`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F4FC] w-full relative">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-[#FFCAD4]/10 -z-10 hidden md:block"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-[#9AC4F8]/10 -z-10 hidden md:block"></div>
      <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-[#6A4C93]/10 -z-10 hidden md:block"></div>
      
      {/* Main Content */}
      <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="inline-block w-3 h-3 rounded-full bg-[#FFCAD4] mr-2"></span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#9AC4F8] mr-2"></span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#6A4C93]"></span>
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#6A4C93] flex items-center">
            Laporan Kekerasan Seksual
            <span className="text-[#FFCAD4] text-sm ml-2">♥</span>
          </h1>
          <p className="text-sm md:text-base text-[#1A1A2E]/70 mt-2">
            Kelola dan pantau semua laporan yang masuk
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12 bg-white rounded-xl shadow-md">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-[#FFCAD4]/30 border-t-[#6A4C93] animate-spin"></div>
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-transparent border-b-[#9AC4F8] animate-spin animation-delay-150"></div>
            </div>
            <p className="ml-4 text-[#1A1A2E]/70">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 md:px-6 py-4 rounded-xl shadow-sm relative" role="alert">
            <div className="flex items-center">
              <div className="w-8 h-8 flex-shrink-0 mr-3 flex items-center justify-center rounded-full bg-red-100">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="font-medium">Terjadi Kesalahan</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden relative">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFCAD4]/5 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#9AC4F8]/5 rounded-tr-full"></div>
            
            <div className="relative p-4 md:p-6 overflow-auto">
              {reportsData.length > 0 ? (
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#9AC4F8]/40 scrollbar-track-transparent">
                  <table className="w-full min-w-full border-separate border-spacing-0">
                    <thead className="bg-[#F8F4FC]">
                      <tr>
                        <th className="sticky top-0 z-10 px-3 py-3.5 text-left text-sm font-semibold text-[#6A4C93] bg-[#F8F4FC] border-b border-[#9AC4F8]/20 first:rounded-tl-lg">
                          <div className="flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFCAD4] mr-2"></span>
                            No.
                          </div>
                        </th>
                        <th className="sticky top-0 z-10 px-3 py-3.5 text-left text-sm font-semibold text-[#6A4C93] bg-[#F8F4FC] border-b border-[#9AC4F8]/20">
                          <div className="flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6A4C93] mr-2"></span>
                            Nama Pelapor
                          </div>
                        </th>
                        <th className="sticky top-0 z-10 px-3 py-3.5 text-left text-sm font-semibold text-[#6A4C93] bg-[#F8F4FC] border-b border-[#9AC4F8]/20 min-w-[200px]">
                          <div className="flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#9AC4F8] mr-2"></span>
                            Deskripsi Insiden
                          </div>
                        </th>
                        <th className="sticky top-0 z-10 px-3 py-3.5 text-left text-sm font-semibold text-[#6A4C93] bg-[#F8F4FC] border-b border-[#9AC4F8]/20">
                          <div className="flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFCAD4] mr-2"></span>
                            Status
                          </div>
                        </th>
                        <th className="sticky top-0 z-10 px-3 py-3.5 text-left text-sm font-semibold text-[#6A4C93] bg-[#F8F4FC] border-b border-[#9AC4F8]/20">
                          <div className="flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6A4C93] mr-2"></span>
                            Laporan Dibuat
                          </div>
                        </th>
                        <th className="sticky top-0 z-10 px-3 py-3.5 text-left text-sm font-semibold text-[#6A4C93] bg-[#F8F4FC] border-b border-[#9AC4F8]/20">
                          <div className="flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#9AC4F8] mr-2"></span>
                            Laporan Diperbarui
                          </div>
                        </th>
                        <th className="sticky top-0 z-10 px-3 py-3.5 text-center text-sm font-semibold text-[#6A4C93] bg-[#F8F4FC] border-b border-[#9AC4F8]/20 last:rounded-tr-lg">
                          <div className="flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFCAD4] mr-2"></span>
                            Aksi
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportsData.map((reportData, index) => {
                        const report = reportData.report;
                        return (
                          <tr 
                            key={report.reportid ?? `report-${index}`} 
                            className="hover:bg-[#F8F4FC]/80 transition-colors"
                          >
                            <td className="whitespace-nowrap py-3 pl-3 pr-1 text-sm border-b border-[#9AC4F8]/10 text-[#1A1A2E]/80">
                              {index + 1}
                            </td>
                            <td className="whitespace-nowrap py-3 px-3 text-sm border-b border-[#9AC4F8]/10 font-medium text-[#1A1A2E]">
                              {maskName(report.reporterfullname)}
                            </td>
                            <td className="py-3 px-3 text-sm border-b border-[#9AC4F8]/10 text-[#1A1A2E]/80 max-w-xs">
                              <div className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                {report.incidentdescription
                                  ? sanitizeString(report.incidentdescription)
                                  : "-"}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-sm border-b border-[#9AC4F8]/10">
                              {getStatusBadge(report.status || "received")}
                            </td>
                            <td className="whitespace-nowrap py-3 px-3 text-sm border-b border-[#9AC4F8]/10 text-[#1A1A2E]/70">
                              {formatDate(report.createdat)}
                            </td>
                            <td className="whitespace-nowrap py-3 px-3 text-sm border-b border-[#9AC4F8]/10 text-[#1A1A2E]/70">
                              {formatDate(report.updatedat || null)}
                            </td>
                            <td className="py-3 px-3 text-sm border-b border-[#9AC4F8]/10 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <Link href={`/admin/report/${report.reportid}`}>
                                  <div className="p-2 bg-[#9AC4F8]/20 hover:bg-[#9AC4F8]/40 rounded-full text-[#6A4C93] transition-colors">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1 12S5 4 12 4 23 12 23 12 19 20 12 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                </Link>
                                <Link href={reportData.updateId ? `/admin/update/${reportData.updateId}` : `/admin/update/${report.reportid}`}>
                                  <div className="p-2 bg-[#FFCAD4]/20 hover:bg-[#FFCAD4]/40 rounded-full text-[#6A4C93] transition-colors">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center py-12">
                  <div className="w-16 h-16 bg-[#FFCAD4]/20 flex items-center justify-center rounded-full mb-3">
                    <svg className="w-6 h-6 text-[#6A4C93]/40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5C15 5.53043 14.7893 6.03914 14.4142 6.41421C14.0391 6.78929 13.5304 7 13 7H11C10.4696 7 9.96086 6.78929 9.58579 6.41421C9.21071 6.03914 9 5.53043 9 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="font-medium">Tidak ada laporan yang tersedia</p>
                  <p className="text-sm mt-1">Belum ada laporan yang dapat ditampilkan saat ini</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
