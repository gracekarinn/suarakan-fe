"use client";

import { publications } from "../constant";
import { Publication } from "../interface";

export default function PublicationSection() {
  return (
    <div className="min-h-screen px-6 py-12 bg-[#FCFCFC]">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-orange-600 mb-10">
        Publikasi Kasus Kekerasan Seksual
      </h1>

      <div className="space-y-6">
        {publications.map((pub: Publication) => (
          <div
            key={pub.id}
            className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center"
          >
            <div className="max-w-3xl">
              <h2 className="text-lg font-semibold text-orange-700">{pub.title}</h2>
              <p className="text-sm text-gray-700 mt-1">{pub.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Dibuat pada: {new Date(pub.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {pub.updatedAt && (
                  <>
                    {" | "}Terakhir diedit:{" "}
                    {new Date(pub.updatedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </>
                )}
              </p>
            </div>
            <a
              href={pub.fileLink}
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
