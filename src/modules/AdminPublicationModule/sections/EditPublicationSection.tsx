"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

const BE_URL = "https://kelompok-3-suarakan-be.pkpl.cs.ui.ac.id"

const EditPublicationSection = () => {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    filelink: "",
  });

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

        if (!res.ok) throw new Error("Gagal memuat data publikasi.");

        const data = await res.json();
        setForm({
          title: data.title,
          description: data.description,
          filelink: data.filelink,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token") || "";
      const res = await fetch(`${BE_URL}/api/v1/publications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          filelink: form.filelink,
          updatedat: new Date().toISOString().split("T")[0],
        }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui publikasi.");

      router.push("/admin/publication");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan saat menyimpan.");
    }
  };

  if (loading) return <div className="p-6">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">Edit Publikasi</h1>
        <Link href="/admin/publication">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-md">
            ← Kembali ke Dashboard
          </button>
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl bg-orange-50 border border-orange-200 p-6 rounded-xl shadow space-y-5"
      >
        <div>
          <label className="block font-semibold text-orange-800 mb-1">
            Judul Publikasi
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-orange-800 mb-1">
            Deskripsi
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-orange-800 mb-1">
            Tautan File Publikasi
          </label>
          <input
            name="filelink"
            value={form.filelink}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
            required
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-5 py-2 rounded-lg shadow"
          >
            Simpan Perubahan
          </button>
          <Link href="/admin/publication">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg"
            >
              Batal
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditPublicationSection;
