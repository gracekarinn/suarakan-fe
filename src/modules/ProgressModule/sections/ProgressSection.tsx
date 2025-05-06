"use client";

import { useEffect, useState } from "react";
import { ReportUpdate, StatusType } from "../interface";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate, getStatusColor, canEditReport, canDeleteReport, deleteReport } from "./utils";

const BE_URL = "https://kelompok-3-suarakan-be.pkpl.cs.ui.ac.id"

export default function ProgressSection() {
  const [reports, setReports] = useState<ReportUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState<boolean>(false);
  
  const router = useRouter();

  const fetchReports = async () => {  
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setShowSessionExpiredModal(true);
        throw new Error("Token tidak ditemukan.");
      }

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
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_id");
          localStorage.removeItem("user_role");
          localStorage.removeItem("is_logged_in");
          setShowSessionExpiredModal(true);
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setReports(data);
    } catch (err: unknown) {
      setError(`Gagal mengambil data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (reportId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
      return;
    }

    setIsDeleting(true);
    setDeleteError("");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setShowSessionExpiredModal(true);
        throw new Error("Token tidak ditemukan.");
      }

      await deleteReport({ reportId, token });
      fetchReports(); 
    } catch (err: unknown) {
      if (err instanceof Error && (
        err.message.includes("401") || 
        err.message.includes("403") || 
        err.message.includes("unauthorized") || 
        err.message.includes("forbidden")
      )) {
        setShowSessionExpiredModal(true);
      } else {
        setDeleteError(`Gagal menghapus laporan: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
      console.error("Error deleting report:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRedirectToLogin = () => {
    router.push("/auth/login");
  };

  const ActionButtons = ({ report, onDelete }: { report: ReportUpdate, onDelete: (reportId: number) => void }) => {
    const status = report.update.status as StatusType;
    const reportId = report.report.reportid;
    
    return (
      <div className="flex mt-4 gap-3">

        <Link 
          href={`/report/${reportId}`} 
          className="group bg-[#6A4C93] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 relative overflow-hidden flex-1 text-center"
        >
          <span className="relative z-10">Lihat Detail</span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </Link>


        {canEditReport(status) && (
          <Link 
            href={`/report/edit/${reportId}`} 
            className="group bg-transparent border-2 border-[#9AC4F8] text-[#6A4C93] font-medium py-2 px-4 rounded-lg hover:bg-[#9AC4F8]/10 transition-all flex-1 flex items-center justify-center"
          >
            <span className="relative z-10 inline-flex items-center justify-center">
              Edit
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </span>
          </Link>
        )}

        {canDeleteReport(status) && (
          <button 
            onClick={() => onDelete(reportId)}
            disabled={isDeleting}
            className="group bg-transparent border-2 border-[#FFCAD4] text-[#6A4C93] font-medium py-2 px-4 rounded-lg hover:bg-[#FFCAD4]/10 transition-all flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 inline-flex items-center justify-center">
              {isDeleting ? "Menghapus..." : "Hapus"}
              {!isDeleting && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </span>
          </button>
        )}
      </div>
    );
  };

  const getStatusTag = (status: StatusType) => {
    const colorClasses = getStatusColor(status);

    let customColorClass;
    if (colorClasses.includes('blue')) {
      customColorClass = 'bg-[#FFCAD4]/20 text-[#6A4C93]';
    } else if (colorClasses.includes('yellow')) {
      customColorClass = 'bg-[#9AC4F8]/30 text-[#6A4C93]';
    } else if (colorClasses.includes('green')) {
      customColorClass = 'bg-[#6A4C93]/20 text-[#6A4C93]';
    } else if (colorClasses.includes('red')) {
      customColorClass = 'bg-[#FFCAD4]/40 text-[#6A4C93]';
    } else {
      customColorClass = 'bg-gray-200 text-[#1A1A2E]/70';
    }
    
    return `px-3 py-1 rounded-full text-xs font-medium ${customColorClass}`;
  };

  const SessionExpiredModal = () => {
    if (!showSessionExpiredModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl border border-[#6A4C93]/10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center border border-[#FFCAD4]/30">
              <svg className="w-8 h-8 text-[#6A4C93]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-[#6A4C93] text-center mb-4">Sesi Anda Telah Berakhir</h2>
          
          <p className="text-center text-[#1A1A2E]/70 mb-6">
            Untuk menjaga keamanan, sesi Anda telah berakhir. Silakan login kembali untuk melanjutkan.
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={handleRedirectToLogin}
              className="group bg-[#6A4C93] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                Login Kembali
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-[#6A4C93] animate-spin mb-4"></div>
              <p className="text-[#6A4C93] font-medium">Memuat laporan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-white py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#6A4C93]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#6A4C93] mb-4">Terjadi Kesalahan</h2>
              <p className="text-[#1A1A2E]/70 mb-6">{error}</p>
              
              <button 
                onClick={fetchReports}
                className="group bg-[#6A4C93] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Coba Lagi
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="min-h-screen w-full bg-white py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-md p-8 md:p-12 border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#9AC4F8]/20 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#6A4C93]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#6A4C93] mb-4">Belum Ada Laporan</h2>
              <p className="text-[#1A1A2E]/70 mb-6">Anda belum membuat laporan apapun. Mulai buat laporan untuk melacak progressnya.</p>
              
              <Link href="/reporter/create" 
                className="group bg-[#6A4C93] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 relative overflow-hidden inline-block"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Buat Laporan Baru
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SessionExpiredModal />
      
      <div className="min-h-screen w-full bg-white py-12 px-4">
        <div className="container mx-auto">
          <div className="mb-10 text-center relative">
            <div className="flex mb-4 justify-center">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FFCAD4] mx-1"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#9AC4F8] mx-1"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#6A4C93] mx-1"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#FFCAD4] mx-1"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#9AC4F8] mx-1"></span>
            </div>
            
            <span className="text-[#FFCAD4] text-sm font-semibold uppercase tracking-wider mb-2 border-[#FFCAD4]/30 border px-4 py-1 rounded-full inline-block bg-white shadow-sm">
              Pelacakan
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#6A4C93] mt-4 mb-4 text-center relative">
              Pantau Progres Laporan Anda
              <div className="absolute -right-8 top-0 flex items-center opacity-70">
                <span className="text-[#FFCAD4] text-xl">♥</span>
              </div>
            </h2>
            
            <div className="w-24 h-1 bg-[#9AC4F8] mb-6 relative rounded-full overflow-hidden mx-auto">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-[#FFCAD4]"></div>
            </div>
            
            <p className="text-[#1A1A2E] text-lg max-w-2xl text-center mx-auto">
              Pantau semua laporan yang telah Anda laporkan, beserta status terkininya.
            </p>
          </div>

          {deleteError && (
            <div className="max-w-3xl mx-auto mb-8">
              <div className="p-4 bg-[#FFCAD4]/20 rounded-xl border border-[#FFCAD4]/30 text-[#6A4C93]">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-[#FFCAD4]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{deleteError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((reportUpdate) => {
              const report = reportUpdate.report;
              const update = reportUpdate.update;
              const status = update.status as StatusType;
              
              return (
                <div key={report.reportid} className="bg-[#6A4C93]/3 rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-[#6A4C93]/10 hover:border-[#6A4C93]/20 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFCAD4]/10 rounded-bl-xl transform rotate-6 group-hover:rotate-0 transition-transform duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#9AC4F8]/10 rounded-tr-xl transform -rotate-6 group-hover:rotate-0 transition-transform duration-300"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mb-4 group-hover:bg-[#FFCAD4]/30 transition-all border border-[#FFCAD4]/30">
                      <svg className="w-6 h-6 text-[#6A4C93]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className={getStatusTag(status)}>
                      {status || "Belum Ada Status"}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <h3 className="text-[#6A4C93] text-xl font-semibold border-b border-[#6A4C93]/10 pb-2 mb-2 flex items-center">
                      Informasi Laporan
                      <span className="w-2 h-2 rounded-full bg-[#FFCAD4] ml-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    </h3>
                    
                    <div className="grid grid-cols-[120px_1fr] gap-1">
                      <span className="text-[#1A1A2E]/70 font-medium">Korban:</span>
                      <span className="font-semibold text-[#6A4C93]">{report.victimfullname || "Tidak Ada Nama"}</span>
                      
                      <span className="text-[#1A1A2E]/70 font-medium">Pelaku:</span>
                      <span className="font-semibold text-[#6A4C93]">{report.accusedfullname || "Tidak Ada Nama"}</span>
                      
                      <span className="text-[#1A1A2E]/70 font-medium">Dibuat pada:</span>
                      <span>{formatDate(report.createdat)}</span>
                      
                      <span className="text-[#1A1A2E]/70 font-medium">Diperbarui:</span>
                      <span>{formatDate(update.updatedat)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <h4 className="text-[#6A4C93] font-medium mb-1">Keterangan:</h4>
                      <p className="text-[#1A1A2E]/90 bg-white p-3 rounded-lg border border-[#6A4C93]/10">
                        {update.remarks || "-"}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-[#6A4C93] font-medium mb-1">Bukti:</h4>
                      {update.proof && update.proof !== "" ? (
                        <a 
                          href={update.proof} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#9AC4F8] hover:text-[#6A4C93] transition-colors hover:underline break-all block bg-white p-3 rounded-lg border border-[#6A4C93]/10"
                        >
                          {update.proof}
                        </a>
                      ) : (
                        <p className="text-[#1A1A2E]/70 bg-white p-3 rounded-lg border border-[#6A4C93]/10">-</p>
                      )}
                    </div>
                  </div>
                  
                  <ActionButtons 
                    report={reportUpdate} 
                    onDelete={handleDelete} 
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}