"use client";

import { useEffect, useState } from "react";
import { Publication } from "@/modules/PublicationModule/interface";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL ?? "http://localhost:3000";

export default function PublicationSection() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await fetch(`${BE_URL}/api/v1/publications`, {credentials: "include"});
        if (!res.ok) throw new Error("Gagal memuat data publikasi.");
        const data: Publication[] = await res.json();
        setPublications(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan tak dikenal.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) {
    return <p className="text-center py-10">Memuat publikasi...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  return (
    <div className="min-h-screen px-6 py-12 bg-[#FCFCFC]">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-orange-600 mb-10">
        Publikasi Kasus Kekerasan Seksual
      </h1>

      <div className="space-y-6">
        {publications.map((pub) => (
          <div
            key={pub.publicationid}
            className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center"
          >
            <div className="max-w-3xl">
              <h2 className="text-lg font-semibold text-orange-700">{pub.title}</h2>
              <p className="text-sm text-gray-700 mt-1">{pub.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Dibuat pada:{" "}
                {new Date(pub.createdat).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {pub.updatedat && (
                  <>
                    {" | "}Terakhir diedit:{" "}
                    {new Date(pub.updatedat).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </>
                )}
              </p>
            </div>
            <a
              href={pub.filelink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md"
            >
              Baca Publikasi Resmi
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}