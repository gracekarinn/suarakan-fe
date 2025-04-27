"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, AlertTriangle } from "lucide-react";
import { UpdateReport } from "../interface";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL ?? "http://localhost:4000";

const statusOptions = ["Received", "Processing", "Completed", "Rejected"];

const AdminUpdateSection = () => {
  const params = useParams();
  const router = useRouter();
  
  const id = params.id as string;
  
  console.log("Params:", params);
  console.log("ID from params:", id);
  
  const [updateData, setUpdateData] = useState<UpdateReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

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

        console.log(`Attempting to fetch data for ID: ${id}`);
        
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
        console.log("Fetched update data:", data);
        setUpdateData(data);
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

      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
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

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/admin/report" className="flex items-center mr-4">
            <ArrowLeft className="h-5 w-5 mr-1 text-orange-700" />
            <span className="text-orange-700">Kembali ke daftar laporan</span>
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-orange-700">
          Update Status Laporan #{updateData?.reportid}
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-1">{error}</span>
          </div>
          <div className="mt-4 text-sm">
            <p>Beberapa kemungkinan solusi:</p>
            <ul className="list-disc ml-5 mt-2">
              <li>Periksa URL dan pastikan parameter id tersedia</li>
              <li>Pastikan endpoint API sudah benar (sudah menggunakan port 4000)</li>
              <li>Coba login kembali untuk mendapatkan token baru</li>
              <li>Pastikan ID yang digunakan valid</li>
            </ul>
          </div>
        </div>
      ) : updateData ? (
        <>
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Berhasil!</strong>
              <span className="block sm:inline"> Status berhasil diperbarui.</span>
            </div>
          )}
          
          <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">ID Update:</p>
                <p className="font-medium">{updateData.updateid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID Laporan:</p>
                <p className="font-medium">{updateData.reportid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal Laporan Dibuat:</p>
                <p className="font-medium">{formatDate(updateData.createdat)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Terakhir Diperbarui Admin:</p>
                <p className="font-medium">{formatDate(updateData.updatedat)}</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={updateData.status}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
                Catatan
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={updateData.remarks}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-32"
                placeholder="Masukkan catatan untuk update status ini"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="proof" className="block text-sm font-medium text-gray-700 mb-1">
                Bukti (URL)
              </label>
              <input
                type="url"
                id="proof"
                name="proof"
                value={updateData.proof}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="https://example.com/bukti"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md flex items-center disabled:bg-orange-300"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center text-gray-500 py-8">
          Data tidak ditemukan
        </div>
      )}
    </div>
  );
};

export default AdminUpdateSection;