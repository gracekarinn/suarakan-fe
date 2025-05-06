"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Publication } from "@/modules/PublicationModule/interface";

const BE_URL = "https://kelompok-3-suarakan-be.pkpl.cs.ui.ac.id"

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
    <div className="bg-[#F8F4FC] min-h-screen">
      <section className="py-12 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#6A4C93]/10 to-[#9AC4F8]/15">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-[#FFCAD4]/10"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-[#9AC4F8]/10"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-[#6A4C93]/10"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <div className="flex mb-2 justify-start">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FFCAD4] mx-1"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#9AC4F8] mx-1"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#6A4C93] mx-1"></span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#6A4C93] mb-2 relative">
                Detail Publikasi
                <div className="absolute -right-8 top-0 flex items-center opacity-70">
                  <span className="text-[#FFCAD4] text-xl">♥</span>
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

          {loading ? (
            <div className="bg-white rounded-xl p-8 shadow-md animate-pulse">
              <div className="space-y-6">
                <div className="h-8 bg-[#6A4C93]/20 rounded w-3/4 mb-6"></div>
                <div className="h-4 bg-[#1A1A2E]/10 rounded w-full"></div>
                <div className="h-4 bg-[#1A1A2E]/10 rounded w-5/6"></div>
                <div className="h-4 bg-[#1A1A2E]/10 rounded w-2/3"></div>
                <div className="flex space-x-4 mt-8">
                  <div className="h-10 bg-[#6A4C93]/20 rounded-lg w-24"></div>
                  <div className="h-10 bg-[#9AC4F8]/20 rounded-lg w-24"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-[#FFCAD4]/20 border border-[#FFCAD4] rounded-xl p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#6A4C93] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-[#6A4C93] font-medium text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-[#6A4C93] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-md"
              >
                Coba Lagi
              </button>
            </div>
          ) : !pub ? (
            <div className="bg-white/80 rounded-xl p-8 text-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#9AC4F8] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[#1A1A2E] font-medium text-lg">Publikasi tidak ditemukan.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#6A4C93] mb-2">{pub.title}</h2>
                <div className="w-16 h-1 bg-[#9AC4F8] mb-4"></div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#F8F4FC] p-5 rounded-lg">
                  <h3 className="text-sm font-semibold text-[#6A4C93] uppercase tracking-wider mb-3">Deskripsi</h3>
                  <p className="text-[#1A1A2E]">{pub.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#F8F4FC] p-5 rounded-lg">
                    <h3 className="text-sm font-semibold text-[#6A4C93] uppercase tracking-wider mb-3">Tanggal Dibuat</h3>
                    <div className="flex items-center text-[#1A1A2E]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#6A4C93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(pub.createdat).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="bg-[#F8F4FC] p-5 rounded-lg">
                    <h3 className="text-sm font-semibold text-[#6A4C93] uppercase tracking-wider mb-3">Tanggal Diedit</h3>
                    {pub.updatedat ? (
                      <div className="flex items-center text-[#1A1A2E]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#6A4C93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {new Date(pub.updatedat).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    ) : (
                      <span className="text-[#1A1A2E]/60">Belum pernah diedit</span>
                    )}
                  </div>
                </div>

                <div className="bg-[#F8F4FC] p-5 rounded-lg">
                  <h3 className="text-sm font-semibold text-[#6A4C93] uppercase tracking-wider mb-3">Tautan File</h3>
                  <a
                    href={pub.filelink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#6A4C93] hover:text-[#9AC4F8] font-medium transition-colors group"
                  >
                    <span className="border-b border-transparent group-hover:border-[#9AC4F8] transition-colors">
                      Lihat File Publikasi
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <Link href="/admin/publication">
                  <button className="bg-white text-[#6A4C93] border border-[#6A4C93] font-medium py-2 px-6 rounded-lg hover:bg-[#6A4C93]/10 transition-all shadow-md">
                    Kembali
                  </button>
                </Link>
                <Link href={`/admin/publication/edit/${pub.publicationid}`}>
                  <button className="group bg-[#6A4C93] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 relative overflow-hidden flex items-center">
                    <span className="relative z-10 flex items-center">
                      Edit Publikasi
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewPublicationSection;