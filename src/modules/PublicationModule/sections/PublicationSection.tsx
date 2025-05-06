"use client";

import { useEffect, useState } from "react";
import { Publication } from "@/modules/PublicationModule/interface";

const BE_URL = "https://kelompok-3-suarakan-be.pkpl.cs.ui.ac.id"

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
    <div className="bg-[#F8F4FC]">
      <section className="py-20 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#6A4C93]/10 to-[#9AC4F8]/15">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-[#FFCAD4]/10"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-[#9AC4F8]/10"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-[#6A4C93]/10"></div>
        </div>

        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-16 relative">
            <div className="flex mb-4 justify-center">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FFCAD4] mx-1"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#9AC4F8] mx-1"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#6A4C93] mx-1"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#FFCAD4] mx-1"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#9AC4F8] mx-1"></span>
            </div>
            
            <span className="text-[#6A4C93] text-sm font-semibold uppercase tracking-wider mb-2 border-[#FFCAD4]/30 border px-4 py-1 rounded-full">Dokumen Penting</span>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#6A4C93] mb-4 text-center relative">
              Publikasi Kasus Kekerasan Seksual
              <div className="absolute -right-8 top-0 flex items-center opacity-70">
                <span className="text-[#FFCAD4] text-xl">♥</span>
              </div>
            </h2>
            
            <div className="w-24 h-1 bg-[#9AC4F8] mb-6 relative rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-[#FFCAD4]"></div>
            </div>
            
            <p className="text-[#1A1A2E] text-lg max-w-2xl text-center">
              Kumpulan dokumen dan publikasi resmi mengenai kasus-kasus kekerasan seksual yang telah didokumentasikan.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-md border-b-4 border-transparent">
                  <div className="animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-[#FFCAD4]/20 mb-4"></div>
                    <div className="h-6 bg-[#6A4C93]/20 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-[#1A1A2E]/10 rounded"></div>
                      <div className="h-4 bg-[#1A1A2E]/10 rounded w-5/6"></div>
                      <div className="h-4 bg-[#1A1A2E]/10 rounded w-2/3"></div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="h-3 bg-[#1A1A2E]/10 rounded w-1/2"></div>
                      <div className="h-3 bg-[#1A1A2E]/10 rounded w-2/3"></div>
                    </div>
                    <div className="h-12 bg-[#6A4C93]/20 rounded-lg"></div>
                  </div>
                </div>
              ))}
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
          ) : publications.length === 0 ? (
            <div className="bg-white/80 rounded-xl p-8 text-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[#9AC4F8] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[#1A1A2E] font-medium text-lg">Belum ada publikasi saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((pub) => (
                <div
                  key={pub.publicationid}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border-b-4 border-transparent hover:border-[#9AC4F8] group relative overflow-hidden flex flex-col h-full"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#FFCAD4]/10 rounded-bl-xl transform rotate-6 group-hover:rotate-0 transition-transform duration-300"></div>
                  
                  <div className="w-14 h-14 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mb-4 group-hover:bg-[#FFCAD4]/40 transition-all relative">
                    <div className="absolute inset-0 rounded-full border-2 border-[#FFCAD4]/30 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#6A4C93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-[#1A1A2E] text-xl font-semibold mb-3 group-hover:text-[#6A4C93] transition-colors flex items-center">
                    {pub.title}
                    <span className="w-2 h-2 rounded-full bg-[#FFCAD4] ml-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </h3>
                  
                  <p className="text-[#1A1A2E]/80 leading-relaxed mb-4 flex-grow">
                    {pub.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="text-sm text-[#1A1A2E]/60 mb-4">
                      <p className="flex items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">
                          Dibuat: {new Date(pub.createdat).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </p>
                      
                      {pub.updatedat && (
                        <p className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span className="truncate">
                            Diedit: {new Date(pub.updatedat).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </p>
                      )}
                    </div>
                    
                    <a
                      href={pub.filelink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center w-full bg-[#6A4C93] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        Baca Publikasi
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute top-4 left-8 opacity-20">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="white"/>
              </svg>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center">
                  Ingin membantu melaporkan kasus?
                  <span className="ml-2 text-[#FFCAD4] text-2xl hidden md:inline-block">♥</span>
                </h2>
                <p className="text-white/90 text-lg max-w-xl leading-relaxed">
                  Bergabunglah bersama ribuan orang lain yang membuat perubahan. Suara Anda berarti.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button className="group bg-white text-[#6A4C93] font-medium py-3 px-8 rounded-lg hover:bg-[#FFCAD4]/20 transition-all shadow-lg transform hover:-translate-y-1 relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Laporkan Sekarang
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#FFCAD4]/40 transition-colors duration-300"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}