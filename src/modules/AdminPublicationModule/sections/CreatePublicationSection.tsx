"use client";

import { useState } from "react";
import { usePublicationContext } from "@/context/PublicationContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CreatePublicationSection = () => {
  const { addPublication, publications } = usePublicationContext();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    fileLink: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPublication = {
      id: publications.length + 1,
      title: form.title,
      description: form.description,
      fileLink: form.fileLink,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: undefined,
    };

    addPublication(newPublication);
    router.push("/admin/publication");
  };

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">Buat Publikasi Baru</h1>
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
            Simpan
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

export default CreatePublicationSection;
