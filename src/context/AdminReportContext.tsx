"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminReport } from "@/modules/AdminReportModule/interface";
import { adminReports as dummyReports } from "@/modules/AdminReportModule/constant";

interface AdminReportContextType {
  reports: AdminReport[];
  updateReportStatus: (id: number, newStatus: string) => void;
}

const AdminReportContext = createContext<AdminReportContextType | undefined>(undefined);

export const AdminReportProvider = ({ children }: { children: React.ReactNode }) => {
  const [reports, setReports] = useState<AdminReport[]>([]);

  useEffect(() => {
    setReports(dummyReports);
  }, []);

  const updateReportStatus = (id: number, newStatus: string) => {
    setReports((prev) =>
      prev.map((r) => (r.reportid === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <AdminReportContext.Provider value={{ reports, updateReportStatus }}>
      {children}
    </AdminReportContext.Provider>
  );
};

export const useAdminReportContext = () => {
  const context = useContext(AdminReportContext);
  if (!context) {
    throw new Error("useAdminReportContext must be used within a AdminReportProvider");
  }
  return context;
};
