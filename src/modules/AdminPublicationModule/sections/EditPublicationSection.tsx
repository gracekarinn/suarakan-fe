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
    <div className="bg-[#F8F4FC] min-h-screen">
      <section className="py-12 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#6A4C93]/10 to-[#9AC4F8]/15">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-[#FFCAD4]/10"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-[#9AC4F8]/10"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-[#6A4C93]/10"></div>
        </div>
  
        <div className="container mx-auto relative z-10 max-w-3xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <div className="flex mb-2 justify-start">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FFCAD4] mx-1"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#9AC4F8] mx-1"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#6A4C93] mx-1"></span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#6A4C93] mb-2 relative">
                Edit Publikasi
                <div className="absolute -right-8 top-0 flex items-center opacity-70">
                  <span className="text-[#FFCAD4] text-xl">✎</span>
                </div>
              </h1>
              <div className="w-24 h-1 bg-[#9AC4F8] mb-4 relative rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-[#FFCAD4]"></div>
              </div>
            </div>
            <Link href="/admin/publication">
              <button className="group bg-[#6A4C93] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 relative overflow-hidden flex items-center">
                <span className="relative z-10 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Kembali
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </Link>
          </div>
  
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md space-y-6 border border-[#9AC4F8]/30">
            <div>
              <label className="block text-sm font-medium text-[#6A4C93] mb-1">Judul Publikasi</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9AC4F8]"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-[#6A4C93] mb-1">Deskripsi</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9AC4F8]"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-[#6A4C93] mb-1">Tautan File Publikasi</label>
              <input
                name="filelink"
                value={form.filelink}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9AC4F8]"
              />
            </div>
  
            <div className="flex justify-start gap-4 pt-2">
              <button
                type="submit"
                className="bg-[#9AC4F8] hover:bg-[#6A4C93] text-white font-semibold px-6 py-2 rounded-lg shadow transition-all"
              >
                Simpan Perubahan
              </button>
              <Link href="/admin/publication">
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-all"
                >
                  Batal
                </button>
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );  
};

export default EditPublicationSection;
