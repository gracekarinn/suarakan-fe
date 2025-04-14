"use client";

import React from "react";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { adminReports } from "../constant";
import { AdminReport } from "../interface";

export default function AdminReportSection() {
  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <h1 className="text-3xl font-bold text-orange-700 text-center mb-6">
        Laporan Kekerasan Seksual
      </h1>

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
            {adminReports.map((report, index) => (
              <tr key={report.reportid} className="hover:bg-orange-50">
                <td className="px-4 py-2 text-center border">{index + 1}</td>
                <td className="px-4 py-2 border">{report.reporterfullname}</td>
                <td className="px-4 py-2 border text-sm text-gray-700 max-w-xs">
                  <div className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                    {report.incidentdescription || "-"}
                  </div>
                </td>
                <td className="px-4 py-2 text-center border">{report.createdat}</td>
                <td className="px-4 py-2 text-center border space-x-2">
                  <Link href={'/admin/report/${report.reportid}'}>
                    <button className="p-2 bg-yellow-300 hover:bg-yellow-200 rounded">
                      <Eye size={16} />
                    </button>
                  </Link>
                  <Link href={'/admin/update/${report.reportid}'}>
                    <button className="p-2 bg-yellow-300 hover:bg-blue-200 rounded">
                      <Pencil size={16} />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}