"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { UpdateReport } from "../interface";


const BE_URL = "https://kelompok-3-suarakan-be.pkpl.cs.ui.ac.id"

const statusOptions = ["Received", "Processing", "Completed", "Rejected"];

const AdminUpdateSection = () => {
  const params = useParams();
  const router = useRouter();
  
  const id = params.id as string;
  
  const [updateData, setUpdateData] = useState<UpdateReport | null>(null);
  const [originalStatus, setOriginalStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setError("ID tidak valid: parameter id tidak ditemukan dalam URL");
      setLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Token tidak ditemukan.");
        }
        
        const updateResponse = await fetch(`${BE_URL}/api/v1/updates/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!updateResponse.ok) {
          throw new Error(`Gagal mengambil data: Error ${updateResponse.status}`);
        }
          
        const data = await updateResponse.json();
        setUpdateData(data);
        setOriginalStatus(data.status || "Received");
        setError(null);
      } catch (err) {
        setError(`Gagal mengambil data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (updateData) {
      setUpdateData({
        ...updateData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!updateData || !id) return;
    
    try {
      setSubmitting(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Token tidak ditemukan.");
      }

      const response = await fetch(`${BE_URL}/api/v1/updates/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status: updateData.status,
          remarks: updateData.remarks,
          proof: updateData.proof,
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("access_token");
          throw new Error("Akses ditolak. Silakan login kembali.");
        }
        
        throw new Error(`Error: ${response.status}`);
      }

      // Show success modal
      setShowSuccessModal(true);
      
      // Redirect will be handled inside the modal
      
    } catch (err) {
      setError(`Gagal memperbarui data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error("Error updating data:", err);
    } finally {
      setSubmitting(false);
    }
  };

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

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "received":
        return "bg-[#9AC4F8]/20 text-[#6A4C93] border-[#9AC4F8]";
      case "processing":
        return "bg-[#FFC107]/20 text-[#E65100] border-[#FFC107]";
      case "completed":
        return "bg-[#4CAF50]/20 text-[#2E7D32] border-[#4CAF50]";
      case "rejected":
        return "bg-[#FFCAD4]/20 text-[#D32F2F] border-[#FFCAD4]";
      default:
        return "bg-[#9AC4F8]/20 text-[#6A4C93] border-[#9AC4F8]";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4FC] px-4 md:px-8 py-6 relative">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-[#FFCAD4]/10 -z-10"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-[#9AC4F8]/10 -z-10"></div>
      <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-[#6A4C93]/10 -z-10"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Link href="/admin/report" className="flex items-center group">
          <div className="p-2 bg-white rounded-full shadow-md mr-2 text-[#6A4C93] transition-transform group-hover:-translate-x-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[#6A4C93] font-medium">Kembali ke daftar laporan</span>
        </Link>
        
        <h1 className="text-xl md:text-2xl font-bold text-[#6A4C93] flex items-center">
          Update Status Laporan #{updateData?.reportid}
          <span className="text-[#FFCAD4] text-sm ml-2">♥</span>
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16 bg-white rounded-xl shadow-md animate-fadeIn">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-[#FFCAD4]/30 border-t-[#6A4C93] animate-spin"></div>
            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-transparent border-b-[#9AC4F8] animate-spin animation-delay-150"></div>
          </div>
          <p className="ml-4 text-[#1A1A2E]/70">Memuat data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl shadow-sm relative mb-6 animate-fadeIn" role="alert">
          <div className="flex items-center">
            <div className="w-10 h-10 flex-shrink-0 mr-3 flex items-center justify-center rounded-full bg-red-100">
              <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-lg">Terjadi Kesalahan</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="font-medium">Beberapa kemungkinan solusi:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Periksa URL dan pastikan parameter id tersedia</li>
              <li>Pastikan endpoint API sudah benar</li>
              <li>Coba login kembali untuk mendapatkan token baru</li>
              <li>Pastikan ID yang digunakan valid</li>
            </ul>
          </div>
          <div className="mt-6">
            <Link href="/admin/report">
              <button className="bg-[#6A4C93] hover:bg-[#6A4C93]/90 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-all hover:-translate-y-0.5">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Kembali ke Daftar Laporan
              </button>
            </Link>
          </div>
        </div>
      ) : updateData ? (
        <div className="max-w-3xl mx-auto animate-fadeIn">
          <div className="bg-white border border-[#9AC4F8]/20 rounded-xl shadow-md p-6 mb-6 relative overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCAD4]/5 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#9AC4F8]/5 rounded-tr-full"></div>
            
            <h2 className="text-lg font-semibold text-[#6A4C93] mb-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-[#6A4C93]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Informasi Update
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-[#F8F4FC] rounded-lg p-4 border border-[#9AC4F8]/10">
                <label className="text-sm text-[#1A1A2E]/60 block mb-1">ID Update:</label>
                <p className="font-medium text-[#1A1A2E]">{updateData.updateid}</p>
              </div>
              <div className="bg-[#F8F4FC] rounded-lg p-4 border border-[#9AC4F8]/10">
                <label className="text-sm text-[#1A1A2E]/60 block mb-1">ID Laporan:</label>
                <p className="font-medium text-[#1A1A2E]">{updateData.reportid}</p>
              </div>
              <div className="bg-[#F8F4FC] rounded-lg p-4 border border-[#9AC4F8]/10">
                <label className="text-sm text-[#1A1A2E]/60 block mb-1">Tanggal Laporan Dibuat:</label>
                <p className="text-[#1A1A2E]">{formatDate(updateData.createdat)}</p>
              </div>
              <div className="bg-[#F8F4FC] rounded-lg p-4 border border-[#9AC4F8]/10">
                <label className="text-sm text-[#1A1A2E]/60 block mb-1">Terakhir Diperbarui:</label>
                <p className="text-[#1A1A2E]">{formatDate(updateData.updatedat)}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-[#1A1A2E]/60 block mb-1">Status Saat Ini:</label>
                <div className={`rounded-lg px-4 py-3 font-medium ${getStatusColor(originalStatus)} border flex items-center`}>
                  <span className="w-3 h-3 rounded-full bg-current mr-2 opacity-70"></span>
                  {originalStatus}
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white border border-[#9AC4F8]/20 rounded-xl shadow-md p-6 relative overflow-hidden transition-all hover:shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCAD4]/5 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#9AC4F8]/5 rounded-tr-full"></div>
            
            <h2 className="text-lg font-semibold text-[#6A4C93] mb-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-[#6A4C93]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.2322 5.23223L18.7677 8.76777M16.7322 3.73223C17.7085 2.75592 19.2914 2.75592 20.2677 3.73223C21.244 4.70854 21.244 6.29146 20.2677 7.26777L6.5 21.0355H3V17.4644L16.7322 3.73223Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              Update Status Laporan
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-[#1A1A2E]/80 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={updateData.status}
                  onChange={handleInputChange}
                  className="w-full bg-[#F8F4FC] border border-[#9AC4F8]/30 rounded-lg py-3 px-4 focus:ring-2 focus:ring-[#9AC4F8] focus:border-[#9AC4F8] text-[#1A1A2E] shadow-sm transition-all"
                  required
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-[#1A1A2E]/80 mb-2">
                  Catatan
                </label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={updateData.remarks}
                  onChange={handleInputChange}
                  className="w-full bg-[#F8F4FC] border border-[#9AC4F8]/30 rounded-lg py-3 px-4 focus:ring-2 focus:ring-[#9AC4F8] focus:border-[#9AC4F8] text-[#1A1A2E] min-h-32 shadow-sm transition-all"
                  placeholder="Masukkan catatan untuk update status ini"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="proof" className="block text-sm font-medium text-[#1A1A2E]/80 mb-2">
                  Bukti (URL)
                </label>
                <input
                  type="url"
                  id="proof"
                  name="proof"
                  value={updateData.proof}
                  onChange={handleInputChange}
                  className="w-full bg-[#F8F4FC] border border-[#9AC4F8]/30 rounded-lg py-3 px-4 focus:ring-2 focus:ring-[#9AC4F8] focus:border-[#9AC4F8] text-[#1A1A2E] shadow-sm transition-all"
                  placeholder="https://example.com/bukti"
                  required
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group bg-[#6A4C93] hover:bg-[#6A4C93]/90 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center justify-center">
                    {submitting ? (
                      <>
                        <div className="animate-spin w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Simpan Perubahan
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center bg-white rounded-xl shadow-md p-8 animate-fadeIn max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#FFCAD4]/20 flex items-center justify-center rounded-full mx-auto mb-4">
            <svg className="w-8 h-8 text-[#6A4C93]/40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 3H11C9.89543 3 9 3.89543 9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5C15 3.89543 14.1046 3 13 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L12 15M12 15L15 12M12 15V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-xl font-medium text-[#1A1A2E] mb-2">Data tidak ditemukan</p>
          <p className="text-[#1A1A2E]/60 mb-6">Laporan yang Anda cari tidak tersedia atau telah dihapus</p>
          
          <Link href="/admin/report">
            <button className="bg-[#6A4C93] hover:bg-[#6A4C93]/90 text-white px-4 py-2 rounded-lg flex items-center shadow-md mx-auto transform hover:-translate-y-0.5 transition-all">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Kembali ke Daftar Laporan
            </button>
          </Link>
        </div>
      )}
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFCAD4]/5 rounded-bl-full -z-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#9AC4F8]/5 rounded-tr-full -z-10"></div>
              
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-16 sm:w-16">
                    <svg className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-xl leading-6 font-bold text-green-700" id="modal-title">
                      Perubahan Berhasil Disimpan
                    </h3>
                    <div className="mt-2">
                      <p className="text-[#1A1A2E]/80">
                        Status laporan telah berhasil diperbarui. Anda akan diarahkan kembali ke halaman daftar laporan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row justify-center">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-[#6A4C93] text-base font-medium text-white hover:bg-[#6A4C93]/90 focus:outline-none sm:w-auto sm:text-sm transition-all transform hover:-translate-y-0.5"
                  onClick={() => router.push("/admin/report")}
                >
                  Kembali ke Daftar Laporan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminUpdateSection;