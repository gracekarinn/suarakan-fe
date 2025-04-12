"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { adminpublications } from "../constant";
import { AdminPublication } from "../interface";

const EditPublicationSection = () => {
  const params = useParams();
  const { id } = params;
  const pub: AdminPublication | undefined = adminpublications.find(
    (p) => p.id === Number(id)
  );

  const [form, setForm] = useState({
    title: pub?.title || "",
    description: pub?.description || "",
    fileLink: pub?.fileLink || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update publikasi:", form);
    alert("Publikasi berhasil diedit (dummy)");
  };

  if (!pub) {
    return <div className="p-6">Publikasi tidak ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <h1 className="text-3xl font-bold text-orange-700 mb-6">Edit Publikasi</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block font-semibold">Judul</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Deskripsi</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">File Link</label>
          <input
            name="fileLink"
            value={form.fileLink}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded font-semibold"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default EditPublicationSection;
