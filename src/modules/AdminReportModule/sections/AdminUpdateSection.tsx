"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { sanitizeString, validateDescription, validateUrl } from "./utils";

export default function AdminUpdateSection() {
    const router = useRouter();
    const params = useParams();
    const { reportId } = params;

    const [status, setStatus] = useState("received");
    const [remarks, setRemarks] = useState("");
    const [proofLink, setProofLink] = useState("");

    const [remarksError, setRemarksError] = useState("");
    const [proofLinkError, setProofLinkError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
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

        router.push("/admin");
    };

    return (
        <div className="min-h-screen px-8 py-6 bg-white">
        <h1 className="text-2xl font-bold mb-4 text-orange-700">Update Status Laporan</h1>
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
            />
            {remarksError && (
                <p className="mt-1 text-sm text-red-500">{remarksError}</p>
            )}
            </div>

            <div>
            <label className="block font-semibold mb-1">
                Link Bukti Penanganan (Opsional)
            </label>
            <input
                type="url"
                value={proofLink}
                onChange={(e) => setProofLink(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="https://contoh.com/bukti"
            />
            {proofLinkError && (
                <p className="mt-1 text-sm text-red-500">{proofLinkError}</p>
            )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
            <button
                type="submit"
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
                Simpan
            </button>
            <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
                Batal
            </button>
            </div>
        </form>
        </div>
    );
}
