"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useContext, useEffect } from "react";
import { usePublicationContext } from "@/context/PublicationContext";
import Link from "next/link";

const EditPublicationSection = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { publications, updatePublication } = usePublicationContext();

  const pub = publications.find((p) => p.id === Number(id));

  const [form, setForm] = useState({
    title: "",
    description: "",
    fileLink: "",
  });

  useEffect(() => {
    if (pub) {
      setForm({
        title: pub.title,
        description: pub.description,
        fileLink: pub.fileLink,
      });
    }
  }, [pub]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pub) {
      updatePublication({
        ...pub,
        title: form.title,
        description: form.description,
        fileLink: form.fileLink,
        updatedAt: new Date().toISOString().split("T")[0],
      });
    }
    router.push("/admin/publication");
  };

  if (!pub) {
    return <div className="p-6">Publikasi tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">
          Edit Publikasi Kasus Kekerasan Seksual
        </h1>
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
            Link File Publikasi
          </label>
          <input
            name="fileLink"
            value={form.fileLink}
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
