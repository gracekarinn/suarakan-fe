"use client";

import React, { useState } from "react";
import { Eye } from "lucide-react";
import Link from "next/link";
import { adminReports as initialReports } from "../constant";
import { AdminReport } from "../interface";
import { maskName } from "./utils";

export default function AdminReportSection() {
    const [reports, setReports] = useState<AdminReport[]>(initialReports);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingUpdate, setPendingUpdate] = useState<{
        reportId: string;
        newStatus: NonNullable<AdminReport["status"]>;
    } | null>(null);

const handleStatusChange = (
    reportId: string,
    newStatus: NonNullable<AdminReport["status"]>
) => {
    setPendingUpdate({ reportId, newStatus });
    setIsModalOpen(true);
};

const confirmUpdate = () => {
    if (pendingUpdate) {
        setReports((prevReports) =>
            prevReports.map((report) =>
            report.reportId === pendingUpdate.reportId
                ? { ...report, status: pendingUpdate.newStatus }
                : report
            )
        );
    }
    setIsModalOpen(false);
    setPendingUpdate(null);
};

const cancelUpdate = () => {
    setIsModalOpen(false);
    setPendingUpdate(null);
};

    return (
        <div className="min-h-screen bg-white px-8 py-6">
        <div className="flex items-center mb-6">
            <div className="flex-1">
            <h1 className="text-3xl font-bold text-orange-700 text-center">
                Laporan Kekerasan Seksual
            </h1>
            </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-orange-100 text-orange-800 text-sm font-semibold">
                <tr>
                <th className="px-4 py-3 border">No.</th>
                <th className="px-4 py-3 border">Pelapor</th>
                <th className="px-4 py-3 border text-left">Incident</th>
                <th className="px-4 py-3 border">Tanggal Pelaporan</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Lihat Detail</th>
                </tr>
            </thead>
            <tbody>
                {reports.map((report, index) => (
                <tr key={report.reportId} className="hover:bg-orange-50">
                    <td className="px-4 py-2 text-center border">
                    {index + 1}.
                    </td>
                    <td className="px-4 py-2 text-center border">
                    {maskName(report.reporterId)}
                    </td>
                    <td className="px-4 py-2 border text-sm text-gray-700">
                    {report.description.length > 50
                        ? report.description.slice(0, 50) + "..."
                        : report.description}
                    </td>
                    <td className="px-4 py-2 text-center border">
                    {report.createdAt}
                    </td>
                    <td className="px-4 py-2 text-center border">
                    <select
                        value={report.status}
                        onChange={(e) =>
                        handleStatusChange(
                            report.reportId,
                            e.target.value as NonNullable<AdminReport["status"]>
                        )
                        }
                        className="px-2 py-1 rounded font-semibold text-sm border"
                    >
                        <option value="received">Received</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    </td>
                    <td className="px-4 py-2 border text-center">
                    <Link href={`/admin/report/${report.reportId}`}>
                        <button className="p-2 rounded bg-yellow-300 hover:bg-yellow-200 flex items-center gap-1">
                        <Eye size={16} />
                        <span>Lihat Detail</span>
                        </button>
                    </Link>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={cancelUpdate}
            ></div>
            <div className="bg-white rounded p-6 z-10 max-w-sm mx-auto">
                <h2 className="text-xl font-bold mb-4">Konfirmasi Update</h2>
                <p className="mb-4">
                Apakah Anda yakin ingin mengupdate status laporan ini?
                </p>
                <div className="flex justify-end space-x-4">
                <button
                    onClick={confirmUpdate}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Ya
                </button>
                <button
                    onClick={cancelUpdate}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
