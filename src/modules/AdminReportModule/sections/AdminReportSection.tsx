"use client";

import React, { useState, useEffect } from "react";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { AdminReport } from "../interface";
import { sanitizeString, maskName } from "./utils";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL;

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

export default function UpdateReportSection() {
  const [reportsData, setReportsData] = useState<ExtendedReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <h1 className="text-3xl font-bold text-orange-700 text-center mb-6">
        Laporan Kekerasan Seksual
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-orange-100 text-orange-800 text-sm font-semibold">
              <tr>
                <th className="px-4 py-3 border">No.</th>
                <th className="px-4 py-3 border text-left">Nama Pelapor</th>
                <th className="px-4 py-3 border text-left">Deskripsi Insiden</th>
                <th className="px-4 py-3 border">Waktu Pembuatan Laporan</th>
                <th className="px-4 py-3 border">Terakhir Diperbarui</th>
                <th className="px-4 py-3 border text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.length > 0 ? (
                reportsData.map((reportData, index) => {
                  const report = reportData.report;
                  return (
                    <tr key={report.reportid ?? `report-${index}`} className="hover:bg-orange-50">
                      <td className="px-4 py-2 text-center border">{index + 1}</td>
                      <td className="px-4 py-2 border">{maskName(report.reporterfullname)}</td>
                      <td className="px-4 py-2 border text-sm text-gray-700 max-w-xs">
                        <div className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                          {report.incidentdescription
                            ? sanitizeString(report.incidentdescription)
                            : "-"}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center border">{formatDate(report.createdat)}</td>
                      <td className="px-4 py-2 text-center border">{formatDate(report.updatedat || null)}</td>
                      <td className="px-4 py-2 text-center border space-x-2">
                        <Link href={`/admin/report/${report.reportid}`}>
                          <button className="p-2 bg-yellow-300 hover:bg-yellow-200 rounded">
                            <Eye size={16} />
                          </button>
                        </Link>
                        <Link href={reportData.updateId ? `/admin/update/${reportData.updateId}` : `/admin/update/${report.reportid}`}>
                          <button className="p-2 bg-yellow-300 hover:bg-blue-200 rounded">
                            <Pencil size={16} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    Tidak ada laporan yang tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}