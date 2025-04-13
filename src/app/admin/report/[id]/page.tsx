import React from "react";
import AdminReportDetailSection from "@/modules/AdminReportModule/sections/AdminReportDetailSection";

interface PageProps {
    params: { id: string };
}

export default function ReportDetailPage({ params }: PageProps) {
    console.log("Dari URL, reportId:", params.id);
    return <AdminReportDetailSection reportId={params.id} />;
}
