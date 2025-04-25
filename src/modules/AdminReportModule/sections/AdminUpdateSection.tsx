"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { sanitizeString, validateDescription, validateUrl } from "./utils";

export default function AdminUpdateSection() {
  const router = useRouter();
  const params = useParams();
  const reportId = Array.isArray(params.reportId) ? params.reportId[0] : params.reportId;

  const [status, setStatus] = useState("received");
  const [remarks, setRemarks] = useState("");
  const [proofLink, setProofLink] = useState("");

  const [remarksError, setRemarksError] = useState("");
  const [proofLinkError, setProofLinkError] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing data
  useEffect(() => {
    const fetchUpdateData = async () => {
      if (!reportId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/v1/updates/${reportId}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Populate form with existing data
        if (data) {
          setStatus(data.status || "received");
          setRemarks(data.remarks || "");
          setProofLink(data.proofLink || "");
        }
        
        setError(null);
      } catch (err) {
        setError(`Gagal mengambil data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error("Error fetching update data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdateData();
  }, [reportId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    setRemarksError("");
    setProofLinkError("");

    if (!validateDescription(remarks)) {
      setRemarksError("Catatan harus memiliki minimal 10 karakter.");
      valid = false;
    }

    if (proofLink.trim() && !validateUrl(proofLink.trim())) {
      setProofLinkError("Link bukti tidak valid. Harap masukkan URL yang benar.");
      valid = false;
    }

    if (!valid) return;

    const cleanRemarks = sanitizeString(remarks.trim());
    const cleanProofLink = proofLink.trim() ? sanitizeString(proofLink.trim()) : "";

    const updateData = {
      reportId,
      status,
      remarks: cleanRemarks,
      proofLink: cleanProofLink,
    };

    try {
      setSubmitting(true);
      
      // Send POST request to the API
      const response = await fetch(`http://localhost:3000/api/v1/updates/${reportId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Redirect after successful update
      router.push("/admin/report");
    } catch (err) {
      setError(`Gagal menyimpan data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error("Error submitting update:", err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-8 py-6 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-6 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-orange-700">Update Status Laporan</h1>
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      <form
        onSubmit={handleSubmit}
        className="bg-orange-50 p-6 rounded-lg max-w-lg mx-auto shadow space-y-4"
      >
        <div>
          <label className="block font-semibold mb-1">Status Laporan</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            disabled={submitting}
          >
            <option value="received">Received</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Catatan / Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Tuliskan catatan tambahan jika ada..."
            disabled={submitting}
          />
          {remarksError && (
            <p className="mt-1 text-sm text-red-500">{remarksError}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-1">Link Bukti Penanganan (Opsional)</label>
          <input
            type="url"
            value={proofLink}
            onChange={(e) => setProofLink(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="https://contoh.com/bukti"
            disabled={submitting}
          />
          {proofLinkError && (
            <p className="mt-1 text-sm text-red-500">{proofLinkError}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="submit"
            className={`bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={submitting}
          >
            {submitting ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            disabled={submitting}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}