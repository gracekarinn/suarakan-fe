"use client";

import React, { useState, useEffect } from "react";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { AdminReport } from "../interface";
import { sanitizeString, maskName } from "./utils";

export default function AdminReportSection() {
    const [reports, setReports] = useState<AdminReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:3000/api/v1/reports');
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                
                const data = await response.json();
                setReports(data);
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
                                <th className="px-4 py-3 border">Tanggal Pelaporan</th>
                                <th className="px-4 py-3 border text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? (
                                reports.map((report: AdminReport, index: number) => (
                                    <tr key={report.reportid} className="hover:bg-orange-50">
                                        <td className="px-4 py-2 text-center border">{index + 1}</td>
                                        <td className="px-4 py-2 border">{maskName(report.reporterfullname)}</td>
                                        <td className="px-4 py-2 border text-sm text-gray-700 max-w-xs">
                                            <div className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                                {report.incidentdescription
                                                    ? sanitizeString(report.incidentdescription)
                                                    : "-"}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-center border">{report.createdat}</td>
                                        <td className="px-4 py-2 text-center border space-x-2">
                                            <Link href={`/admin/report/${report.reportid}`}>
                                                <button className="p-2 bg-yellow-300 hover:bg-yellow-200 rounded">
                                                    <Eye size={16} />
                                                </button>
                                            </Link>
                                            <Link href={`/admin/update/${report.reportid}`}>
                                                <button className="p-2 bg-yellow-300 hover:bg-blue-200 rounded">
                                                    <Pencil size={16} />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
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