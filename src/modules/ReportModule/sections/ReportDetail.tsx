"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ReportUpdate, StatusType } from "@/modules/ReportModule/interface";
import { formatDate, getStatusColor, canEditReport, canDeleteReport, deleteReport } from "./utils";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL ?? "http://localhost:3000";

const ReportDetail = () => {
    const { id } = useParams();
    const router = useRouter();
    const [report, setReport] = useState<ReportUpdate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem("access_token") || "";
                if (!token) {
                    throw new Error("Token tidak ditemukan. Silakan login kembali.");
                }
                
                const res = await fetch(`${BE_URL}/api/v1/reports/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        localStorage.removeItem("access_token");
                        throw new Error("Akses ditolak. Silakan login kembali.");
                    }
                    throw new Error(`Error: ${res.status}`);
                }

                const data = await res.json();
                setReport(data);
            } catch (err) {
                if (err instanceof Error) setError(err.message);
                else setError("Terjadi kesalahan.");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    const handleDelete = async () => {
        if (!report) return;
        
        if (!confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
            return;
        }

        setIsDeleting(true);
        setDeleteError("");
        try {
            const token = localStorage.getItem("access_token");
            if (!token) throw new Error("Token tidak ditemukan.");

            await deleteReport({ reportId: report.report.reportid, token });
            router.push("/progress"); 
        } catch (err: unknown) {
            setDeleteError(`Gagal menghapus laporan: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const InfoSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="mb-8">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );

    const InfoItem = ({ label, value }: { label: string, value: string | null | undefined }) => (
        <div className="mb-2">
            <p className="text-gray-600 text-sm">{label}:</p>
            <p className="font-medium">{value || "-"}</p>
        </div>
    );

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
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="text-center p-6 bg-gray-50 rounded-lg my-4">
                <p className="text-gray-600">Laporan tidak ditemukan.</p>
                <Link href="/progress" className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Kembali ke Daftar Laporan
                </Link>
            </div>
        );
    }

    const { report: reportData, update } = report;
    const status = update.status as StatusType;

    return (
        <div className="container mx-auto py-8 px-4">
            {deleteError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {deleteError}
                </div>
            )}
            
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Detail Laporan #{reportData.reportid}</h1>
                    
                    <div className="flex items-center">
                        <span className={`mr-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(status)}`}>
                            {status || "Tidak Ada Status"}
                        </span>
                        
                        <div className="flex space-x-2">
                            <Link href="/progress" className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                                Kembali
                            </Link>
                            
                            {canEditReport(status) && (
                                <Link 
                                    href={`/report/edit/${reportData.reportid}`} 
                                    className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                                >
                                    Edit
                                </Link>
                            )}
                            
                            {canDeleteReport(status) && (
                                <button 
                                    onClick={handleDelete}
                                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Menghapus..." : "Hapus"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Dibuat pada</p>
                        <p className="font-medium">{formatDate(reportData.createdat)}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Diperbarui pada</p>
                        <p className="font-medium">{formatDate(reportData.updatedat) || formatDate(update.updatedat) || "-"}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Tujuan Pengaduan</p>
                        <p className="font-medium">{reportData.authority}</p>
                    </div>
                </div>
                
                <InfoSection title="Status Pembaruan">
                    <InfoItem label="Status" value={update.status} />
                    <InfoItem label="Keterangan" value={update.remarks} />
                    {update.proof && update.proof !== "" ? (
                        <div className="col-span-2">
                            <p className="text-gray-600 text-sm">Bukti Update:</p>
                            <a 
                                href={update.proof} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all"
                            >
                                {update.proof}
                            </a>
                        </div>
                    ) : (
                        <InfoItem label="Bukti Update" value="-" />
                    )}
                </InfoSection>
                
                <InfoSection title="Informasi Insiden">
                    <InfoItem label="Lokasi Insiden" value={reportData.incidentlocation} />
                    <InfoItem label="Waktu Insiden" value={formatDate(reportData.incidenttime)} />
                    
                    <div className="col-span-2">
                        <p className="text-gray-600 text-sm">Deskripsi Insiden:</p>
                        <p className="font-medium whitespace-pre-line">{reportData.incidentdescription || "-"}</p>
                    </div>
                    
                    <div className="col-span-2">
                        <p className="text-gray-600 text-sm">Kebutuhan Korban:</p>
                        <p className="font-medium whitespace-pre-line">{reportData.incidentvictimneeds || "-"}</p>
                    </div>
                    
                    {reportData.incidentproof && (
                        <div className="col-span-2">
                            <p className="text-gray-600 text-sm">Bukti Insiden:</p>
                            <a 
                                href={reportData.incidentproof} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all"
                            >
                                {reportData.incidentproof}
                            </a>
                        </div>
                    )}
                </InfoSection>
                
                <InfoSection title="Informasi Pelapor">
                    <InfoItem label="Nama Pelapor" value={reportData.reporterfullname} />
                    <InfoItem label="No. Telepon" value={reportData.reporterphonenum} />
                    <InfoItem label="Alamat" value={reportData.reporteraddress} />
                    <InfoItem label="Hubungan dengan Korban" value={reportData.reporterrelationship} />
                </InfoSection>
                
                <InfoSection title="Informasi Korban">
                    <InfoItem label="Nama Korban" value={reportData.victimfullname} />
                    <InfoItem label="NIK" value={reportData.victimnik} />
                    <InfoItem label="Email" value={reportData.victimemail} />
                    <InfoItem label="No. Telepon" value={reportData.victimphonenum} />
                    <InfoItem label="Alamat" value={reportData.victimaddress} />
                    <InfoItem label="Pekerjaan" value={reportData.victimoccupation} />
                    <InfoItem label="Jenis Kelamin" value={reportData.victimsex} />
                    <InfoItem label="Tanggal Lahir" value={reportData.victimdateofbirth ? formatDate(reportData.victimdateofbirth) : null} />
                    <InfoItem label="Tempat Lahir" value={reportData.victimplaceofbirth} />
                    <InfoItem label="Tingkat Pendidikan" value={reportData.victimeducationlevel} />
                    <InfoItem label="Status Pernikahan" value={reportData.victimmarriagestatus} />
                </InfoSection>
                
                <InfoSection title="Informasi Terlapor">
                    <InfoItem label="Nama Terlapor" value={reportData.accusedfullname} />
                    <InfoItem label="Alamat" value={reportData.accusedaddress} />
                    <InfoItem label="No. Telepon" value={reportData.accusedphonenum} />
                    <InfoItem label="Pekerjaan" value={reportData.accusedoccupation} />
                    <InfoItem label="Jenis Kelamin" value={reportData.accusedsex} />
                    <InfoItem label="Hubungan dengan Korban" value={reportData.accusedrelationship} />
                </InfoSection>
            </div>
        </div>
    );
};

export default ReportDetail;