"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Publication } from "@/modules/PublicationModule/interface";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL;

const ViewPublicationSection = () => {
  const { id } = useParams();
  const [pub, setPub] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";
        const res = await fetch(`${BE_URL}/api/v1/publications/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal memuat publikasi.");

        const data = await res.json();
        setPub({
          publicationid: data.id,
          title: data.title,
          description: data.description,
          filelink: data.filelink,
          createdat: data.createdat,
          updatedat: data.updatedat,
        });
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id]);

  if (loading) return <div className="p-6">Memuat data publikasi...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!pub) return <div className="p-6">Publikasi tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">Detail Publikasi</h1>
        <Link href="/admin/publication">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-md">
            ← Kembali ke Dashboard
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-orange-100 text-orange-800 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3 border text-left w-1/4">Kolom</th>
              <th className="px-4 py-3 border text-left">Isi</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            <tr className="hover:bg-orange-50">
              <td className="px-4 py-3 border font-medium bg-gray-50">Judul</td>
              <td className="px-4 py-3 border">{pub.title}</td>
            </tr>
            <tr className="hover:bg-orange-50">
              <td className="px-4 py-3 border font-medium bg-gray-50">Deskripsi</td>
              <td className="px-4 py-3 border">{pub.description}</td>
            </tr>
            <tr className="hover:bg-orange-50">
              <td className="px-4 py-3 border font-medium bg-gray-50">Tanggal Dibuat</td>
              <td className="px-4 py-3 border">{pub.createdat}</td>
            </tr>
            <tr className="hover:bg-orange-50">
              <td className="px-4 py-3 border font-medium bg-gray-50">Tanggal Diedit</td>
              <td className="px-4 py-3 border">{pub.updatedat ?? "-"}</td>
            </tr>
            <tr className="hover:bg-orange-50">
              <td className="px-4 py-3 border font-medium bg-gray-50">Tautan File</td>
              <td className="px-4 py-3 border">
                <a
                  href={pub.filelink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Lihat File
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPublicationSection;