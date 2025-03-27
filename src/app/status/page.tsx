"use client";

import { useState, useEffect } from 'react';
import StatusForm from './StatusForm';
import { ReportFormState } from '../types';

const AdminPage = () => {
const [reports, setReports] = useState<ReportFormState[]>([]);
const [searchQuery, setSearchQuery] = useState('');
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Fetch data dari API
useEffect(() => {
    const fetchReports = async () => {
    try {
        const response = await fetch('/api/reports');
        if (!response.ok) {
        throw new Error('Gagal memuat data laporan');
        }
        const data = await response.json();
        setReports(data);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
        setLoading(false);
    }
    };

    fetchReports();
}, []);

const handleUpdateReport = async (updatedReport: ReportFormState) => {
    try {
    const response = await fetch(`/api/reports/${updatedReport.id}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReport),
    });

    if (!response.ok) {
        throw new Error('Gagal memperbarui laporan');
    }

    setReports(prev => 
        prev.map(report => 
        report.id === updatedReport.id ? updatedReport : report
        )
    );
    } catch (err) {
    setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat update');
    }
};

const filteredReports = reports.filter(report =>
    report.victimFullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.victimNIK?.includes(searchQuery)
);

if (loading) {
    return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-[#8B322C]">Memuat data...</div>
    </div>
    );
}

if (error) {
    return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-red-500">{error}</div>
    </div>
    );
}

return (
    <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-6xl mx-auto">
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#8B322C]">Dashboard Admin</h1>
        
        <div className="mt-4">
            <input
            type="text"
            placeholder="Cari berdasarkan Nama atau NIK..."
            className="w-full p-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        </div>

        <div className="space-y-6">
        {filteredReports.map(report => (
            <div key={report.id} className="bg-white shadow-sm rounded-lg p-6">
            <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#8B322C]">
                    {report.victimFullName}
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                    report.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                    report.status === 'Sedang diproses pihak berwajib' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {report.status}
                </span>
                </div>
                <p className="text-gray-600 mt-2">NIK: {report.victimNIK}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                <p className="text-gray-500">Lokasi Kejadian:</p>
                <p className="text-gray-800">{report.violationLocation || '-'}</p>
                </div>
                <div>
                <p className="text-gray-500">Waktu Kejadian:</p>
                <p className="text-gray-800">{new Date(report.violationTime).toLocaleString() || '-'}</p>
                </div>
            </div>

            <StatusForm 
                report={report} 
                onUpdate={handleUpdateReport} 
            />
            </div>
        ))}
        </div>
    </div>
    </div>
);
};

export default AdminPage;