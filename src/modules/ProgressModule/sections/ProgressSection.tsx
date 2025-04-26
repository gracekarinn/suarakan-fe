"use client";

import { useEffect, useState } from "react";
import { ReportUpdate, StatusType } from "../interface";
import Link from "next/link";
import { formatDate, getStatusColor, canEditReport, canDeleteReport, deleteReport } from "./utils";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL ?? "http://localhost:3000";

export default function ProgressSection() {
  const [reports, setReports] = useState<ReportUpdate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>("");

  const fetchReports = async () => {
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
      if (!token) throw new Error("Token tidak ditemukan.");

      await deleteReport({ reportId, token });
      fetchReports(); 
    } catch (err: unknown) {
      setDeleteError(`Gagal menghapus laporan: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error("Error deleting report:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const ActionButtons = ({ report, onDelete }: { report: ReportUpdate, onDelete: (reportId: number) => void }) => {
    const status = report.update.status as StatusType;
    const reportId = report.report.reportid;
    
    return (
      <div className="flex mt-4 gap-2">
        <Link href={`/report/${reportId}`} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Lihat Detail
        </Link>

        {canEditReport(status) && (
          <Link href={`/report/edit/${reportId}`} className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
            Edit
          </Link>
        )}

        {canDeleteReport(status) && (
          <button 
            onClick={() => onDelete(reportId)}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
            disabled={isDeleting}
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg text-red-600 my-4">
        <p>{error}</p>
        <button 
          onClick={fetchReports}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg my-4">
        <p className="text-gray-600">Belum ada laporan yang dibuat.</p>
        <Link href="/reporter/create" className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Buat Laporan Baru
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {deleteError && (
        <div className="text-center p-4 bg-red-50 rounded-lg text-red-600 mb-4">
          <p>{deleteError}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((reportUpdate) => {
          const report = reportUpdate.report;
          const update = reportUpdate.update;
          const status = update.status as StatusType;
          
          return (
            <div key={report.reportid} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="">
                  <h3 className="font-semibold text-lg">
                    Korban: {report.victimfullname || "Tidak Ada Nama Korban"}
                  </h3>
                  <h3 className="font-semibold text-lg">
                    Pelaku : {report.accusedfullname || "Tidak Ada Nama Pelaku"}
                  </h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                  {status || "Tidak Ada Status"}
                </span>
              </div>
              
              <div className="space-y-2 flex-grow">
                <div>
                  <span className="text-gray-600 text-sm">Dibuat pada:</span>
                  <p>{formatDate(report.createdat)}</p>
                </div>
                
                <div>
                  <span className="text-gray-600 text-sm">Status diperbarui pada:</span>
                  <p>{formatDate(update.updatedat)}</p>
                </div>

                <div>
                  <span className="text-gray-600 text-sm">Keterangan:</span>
                  <p>{update.remarks || "-"}</p>
                </div>

                <div>
                  <span className="text-gray-600 text-sm">Bukti:</span>
                  {update.proof && update.proof !== "" ? (
                    <a 
                      href={update.proof} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {update.proof}
                    </a>
                  ) : (
                    <p>-</p>
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
  );
}