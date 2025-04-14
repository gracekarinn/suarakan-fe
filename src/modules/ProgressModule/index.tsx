"use client";
import React from "react";
import ReportSection from "./sections/ProgressSection";

const ProgressPage: React.FC = () => {
    return (
        <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-[#8B322C] mb-6">Progress Laporan Anda</h1>
        <ReportSection />
        </div>
    );
};

export default ProgressPage;