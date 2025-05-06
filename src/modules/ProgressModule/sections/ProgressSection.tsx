"use client";

import { useEffect, useState, useCallback } from "react";
import { ReportUpdate, StatusType } from "../interface";
import Link from "next/link";
import { formatDate, getStatusColor, canEditReport, canDeleteReport, deleteReport } from "./utils";

const BE_URL = "https://kelompok-3-suarakan-be.pkpl.cs.ui.ac.id"

export default function ProgressSection() {
  const [reports, setReports] = useState<ReportUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");
  
  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [reportToDelete, setReportToDelete] = useState<number | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError("");
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

      const data = await response.json();
      setReports(data);
    } catch (err: unknown) {
      setError(`Gagal mengambil data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const confirmDelete = (reportId: number) => {
    setReportToDelete(reportId);
    setShowConfirmModal(true);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setReportToDelete(null);
  };

  const handleDelete = async () => {
    if (reportToDelete === null) return;
    
    setIsDeleting(true);
    setDeleteError("");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Token tidak ditemukan.");

      await deleteReport({ reportId: reportToDelete, token });
      fetchReports();
      setShowConfirmModal(false);
      setReportToDelete(null);
    } catch (err: unknown) {
      setDeleteError(`Gagal menghapus laporan: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error("Error deleting report:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const ActionButtons = ({ report, onConfirmDelete }: { report: ReportUpdate, onConfirmDelete: (reportId: number) => void }) => {
    const status = report.update.status as StatusType;
    const reportId = report.report.reportid;
    
    return (
      <div className="flex mt-4 gap-2">
        <Link 
          href={`/report/${reportId}`} 
          className="px-3 py-2 bg-[#6A4C93] text-white rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow hover:shadow-md transform hover:-translate-y-0.5 text-sm font-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Lihat Detail
        </Link>

        {canEditReport(status) && (
          <Link 
            href={`/report/edit/${reportId}`} 
            className="px-3 py-2 bg-[#9AC4F8] text-[#1A1A2E] rounded-lg hover:bg-[#9AC4F8]/90 transition-all shadow hover:shadow-md transform hover:-translate-y-0.5 text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </Link>
        )}

        {canDeleteReport(status) && (
          <button 
            onClick={() => onConfirmDelete(reportId)}
            className="px-3 py-2 bg-[#FFCAD4] text-[#1A1A2E] rounded-lg hover:bg-[#FFCAD4]/90 transition-all shadow hover:shadow-md transform hover:-translate-y-0.5 text-sm font-medium flex items-center disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            disabled={isDeleting}
          >
            <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Hapus
          </button>
        )}
      </div>
    );
  };

  const StatusBadge = ({ status }: { status: StatusType }) => {
    const getCustomStatusColor = (status: StatusType) => {
      switch (status) {
        case "Received":
          return "bg-[#9AC4F8]/20 text-[#6A4C93] border border-[#9AC4F8]/50";
        case "Processing":
          return "bg-[#FFCAD4]/20 text-[#6A4C93] border border-[#FFCAD4]/50";
        case "Completed":
          return "bg-green-100 text-green-800 border border-green-200";
        case "Rejected":
          return "bg-red-100 text-red-800 border border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border border-gray-200";
      }
    };

    const formatStatusText = (status: StatusType) => {
      switch (status) {
        case "Received": return "Terkirim";
        case "Processing": return "Dalam Proses";
        case "Completed": return "Selesai";
        case "Rejected": return "Ditolak";
        default: return status || "Tidak Ada Status";
      }
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCustomStatusColor(status)} flex items-center`}>
        <span className="w-2 h-2 rounded-full bg-current mr-1.5"></span>
        {formatStatusText(status)}
      </span>
    );
  };

  const ConfirmationModal = () => {
    if (!showConfirmModal) return null;
    
    return (
      <>
        <div 
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
          onClick={cancelDelete}
        >
          <div 
            className="bg-white rounded-xl p-6 shadow-lg max-w-md w-11/12 mx-auto relative z-50 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#FFCAD4]/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#6A4C93]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#6A4C93] mb-2">Konfirmasi Penghapusan</h3>
              <p className="text-[#1A1A2E]/80">Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={cancelDelete}
                className="px-5 py-2 bg-gray-200 text-[#1A1A2E] rounded-lg hover:bg-gray-300 transition-all shadow hover:shadow-md font-medium flex-1 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-[#FFCAD4] text-[#1A1A2E] rounded-lg hover:bg-[#FFCAD4]/80 transition-all shadow hover:shadow-md font-medium flex-1 flex items-center justify-center cursor-pointer"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#1A1A2E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menghapus...
                  </>
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-[#F8F4FC]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-[#6A4C93]/20"></div>
          <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-t-[#6A4C93] animate-spin"></div>
        </div>
        <p className="mt-4 text-[#6A4C93] font-medium">Memuat laporan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F8F4FC] p-8 rounded-lg">
        <div className="text-center p-6 bg-[#FFCAD4]/10 rounded-xl border border-[#FFCAD4]/30 text-[#1A1A2E] my-4 max-w-md mx-auto">
          <svg className="w-12 h-12 mx-auto mb-4 text-[#FFCAD4]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p className="mb-4">{error}</p>
          <button 
            onClick={fetchReports}
            className="px-6 py-2 bg-[#6A4C93] text-white rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center mx-auto"
          >
            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-[#F8F4FC] p-8 rounded-lg">
        <div className="text-center p-8 bg-white rounded-xl shadow-md border border-[#9AC4F8]/20 my-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-[#6A4C93]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <p className="text-[#1A1A2E] mb-6">Belum ada laporan yang dibuat.</p>
          <Link href="/report/create" className="group bg-[#6A4C93] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden inline-block">
            <span className="relative z-10 flex items-center">
              Buat Laporan Baru
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 bg-[#F8F4FC]">
      <ConfirmationModal />
      
      <div className="container mx-auto">
        {deleteError && (
          <div className="text-center p-4 bg-[#FFCAD4]/20 rounded-lg border border-[#FFCAD4]/50 text-[#1A1A2E] mb-6 max-w-md mx-auto">
            <p className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 text-[#FFCAD4]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {deleteError}
            </p>
          </div>
        )}

        <div className="flex items-center mb-3">
          <span className="inline-block w-3 h-3 rounded-full bg-[#FFCAD4] mr-2"></span>
          <span className="inline-block w-2 h-2 rounded-full bg-[#9AC4F8] mr-2"></span>
          <span className="inline-block w-1 h-1 rounded-full bg-[#6A4C93]"></span>
        </div>
        
        <h2 className="text-3xl font-bold text-[#6A4C93] mb-6">
          Pelacakan Laporan
        </h2>
        
        <div className="w-24 h-1 bg-[#9AC4F8] mb-8 relative rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-[#FFCAD4]"></div>
        </div>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          style={{ contain: 'content' }} 
        >
          {reports.map((reportUpdate) => {
            const report = reportUpdate.report;
            const update = reportUpdate.update;
            const status = update.status as StatusType;
            
            return (
              <div 
                key={report.reportid} 
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-[#9AC4F8]/10 hover:border-[#9AC4F8]/30 group relative overflow-hidden mb-2"
              >
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#FFCAD4]/10 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#9AC4F8]/5 rounded-tl-[50%] transform group-hover:scale-110 transition-transform duration-300"></div>
                
                <div className="flex justify-between items-start mb-4 relative">
                  <div>
                    <h3 className="font-semibold text-lg text-[#6A4C93]">
                      Korban: {report.victimfullname || "Tidak Ada Nama Korban"}
                    </h3>
                    <h4 className="font-medium text-[#1A1A2E]/90">
                      Pelaku: {report.accusedfullname || "Tidak Ada Nama Pelaku"}
                    </h4>
                  </div>
                  <StatusBadge status={status} />
                </div>
                
                <div className="space-y-3 flex-grow relative">
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#FFCAD4]/20 rounded-full mt-0.5 text-[#6A4C93] group-hover:bg-[#FFCAD4]/40 transition-all">
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <span className="text-[#1A1A2E]/60 text-sm">Dibuat pada:</span>
                      <p className="text-[#1A1A2E]/80">{formatDate(report.createdat)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#FFCAD4]/20 rounded-full mt-0.5 text-[#6A4C93] group-hover:bg-[#FFCAD4]/40 transition-all">
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <span className="text-[#1A1A2E]/60 text-sm">Status diperbarui pada:</span>
                      <p className="text-[#1A1A2E]/80">{formatDate(update.updatedat)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#FFCAD4]/20 rounded-full mt-0.5 text-[#6A4C93] group-hover:bg-[#FFCAD4]/40 transition-all">
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <span className="text-[#1A1A2E]/60 text-sm">Keterangan:</span>
                      <p className="text-[#1A1A2E]/80">{update.remarks || "-"}</p>
                    </div>
                  </div>

                  {update.proof && update.proof !== "" && (
                    <div className="flex items-start">
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#FFCAD4]/20 rounded-full mt-0.5 text-[#6A4C93] group-hover:bg-[#FFCAD4]/40 transition-all">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                      </div>
                      <div className="ml-3 overflow-hidden">
                        <span className="text-[#1A1A2E]/60 text-sm">Bukti:</span>
                        <a 
                          href={update.proof} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#6A4C93] hover:text-[#9AC4F8] transition-colors break-all hover:underline block text-sm"
                        >
                          {update.proof}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <ActionButtons 
                  report={reportUpdate} 
                  onConfirmDelete={confirmDelete} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}