"use client";

import { useState } from "react";
import { ReportFormState, ReportingLevel } from "../types";

enum CaseStatus {
  Reported = "Dilaporkan ke pihak berwajib",
  InProgress = "Sedang diproses pihak berwajib",
  Completed = "Selesai",
}

interface StatusFormProps {
  report: ReportFormState;
  onUpdate: (updatedReport: ReportFormState) => void;
}

const StatusForm = ({ report, onUpdate }: StatusFormProps) => {
  const [selectedInstitution, setSelectedInstitution] =
    useState<ReportingLevel>();
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus>(
    report.status || CaseStatus.Reported
  );

  const handleReportInstitution = () => {
    if (!selectedInstitution) return;

    const updatedReport = {
      ...report,
      reportedTo: [...(report.reportedTo || []), selectedInstitution],
      status: CaseStatus.Reported,
    };

    onUpdate(updatedReport);
    setSelectedInstitution(undefined);
  };

  const handleStatusUpdate = () => {
    const updatedReport = {
      ...report,
      status: selectedStatus,
    };
    onUpdate(updatedReport);
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-[#8B322C] mb-4">
        Update Status Laporan
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Laporkan ke:
          </label>
          <div className="flex gap-2">
            <select
              value={selectedInstitution || ""}
              onChange={(e) =>
                setSelectedInstitution(e.target.value as ReportingLevel)
              }
              className="flex-1 p-2 border rounded-md"
            >
              <option value="">Pilih Institusi</option>
              {Object.values(ReportingLevel).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <button
              onClick={handleReportInstitution}
              className="px-4 py-2 bg-[#DD5746] text-white rounded-md hover:bg-[#C04737] disabled:bg-gray-300"
              disabled={!selectedInstitution}
            >
              Laporkan
            </button>
          </div>

          <div className="mt-2 text-sm text-gray-500">
            Sudah dilaporkan ke: {report.reportedTo?.join(", ") || "-"}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Update Status:
          </label>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as CaseStatus)}
              className="flex-1 p-2 border rounded-md"
            >
              {Object.values(CaseStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              onClick={handleStatusUpdate}
              className="px-4 py-2 bg-[#4793AF] text-white rounded-md hover:bg-[#366f8a]"
            >
              Update
            </button>
          </div>

          <div className="mt-2 text-sm text-gray-500">
            Status saat ini:{" "}
            <span className="font-medium">{report.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusForm;
