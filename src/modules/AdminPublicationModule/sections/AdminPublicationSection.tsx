"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Publication } from "@/modules/PublicationModule/interface";

const BE_URL = "https://kelompok-3-suarakan-be.pkpl.cs.ui.ac.id"

export default function AdminPublicationSection() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publicationToDelete, setPublicationToDelete] = useState<number | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token') || '';
        const tokenParts = token.split('.');
        console.log('Token dari localStorage:', token);

      
        if (tokenParts.length !== 3) {
          throw new Error("Token format tidak valid.");
        }
      
        const base64Url = tokenParts[1];
      
        if (!base64Url) {
          throw new Error("Payload token tidak ditemukan.");
        }
      
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join('')
        );
      
        const payload = JSON.parse(jsonPayload);
      
        if (payload.user_type !== "ADMIN") {
          throw new Error("Anda tidak memiliki izin untuk mengakses halaman ini.");
        }
      
        setIsAuthorized(true);
        fetchPublications(token);
      } catch (err) {
        setLoading(false);
        if (err instanceof Error) setError(err.message);
        else setError("Terjadi kesalahan saat memeriksa autentikasi.");
      }
    };
    checkAuth();
  }, []);
  
  const fetchPublications = async (token: string) => {
    try {
      const res = await fetch(`${BE_URL}/api/v1/publications`, {
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('access_token');
          throw new Error("Akses ditolak. Silakan login kembali.");
        }
        throw new Error("Gagal memuat data publikasi.");
      }
  
      const data: Publication[] = await res.json();
      setPublications(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan tak dikenal saat mengambil data.");
    } finally {
      setLoading(false);
    }
  };  

  const handleDelete = (id: number) => {
    setPublicationToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (publicationToDelete !== null) {
      try {
        const token = localStorage.getItem('access_token') || '';
        const res = await fetch(`${BE_URL}/api/v1/publications/${publicationToDelete}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('access_token');
            router.push('/auth/login');
            return;
          }
          throw new Error("Gagal menghapus publikasi.");
        }

        setPublications((prev) => prev.filter((pub) => pub.publicationid !== publicationToDelete));
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setIsModalOpen(false);
      }
    }
  };

  const cancelDelete = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="bg-[#F8F4FC] min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6A4C93]"></div>
          </div>
          <p className="text-center mt-4 text-[#6A4C93]">Memuat publikasi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F8F4FC] min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <div className="flex justify-center text-[#FFCAD4] mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center text-[#6A4C93] mb-2">Terjadi Kesalahan</h2>
          <p className="text-center text-[#1A1A2E] mb-4">{error}</p>
          <div className="flex justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#6A4C93] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-md"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F4FC] min-h-screen">
      <section className="py-12 px-4 md:px-8 relative overflow-hidden">
        <div>
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
                Dashboard Publikasi
                <div className="absolute -right-8 top-0 flex items-center opacity-70">
                  <span className="text-[#FFCAD4] text-xl">♥</span>
                </div>
              </h1>
              <div className="w-24 h-1 bg-[#9AC4F8] mb-4 relative rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-[#FFCAD4]"></div>
              </div>
            </div>
            <Link href="/admin/publication/create">
              <button className="group bg-[#6A4C93] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 relative overflow-hidden flex items-center">
                <span className="relative z-10 flex items-center">
                   Buat Publikasi
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </Link>
          </div>
  
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#9AC4F8]/20">
                <thead className="bg-[#6A4C93]/10">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[#6A4C93] uppercase tracking-wider">
                      No.
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[#6A4C93] uppercase tracking-wider">
                      Judul
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[#6A4C93] uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[#6A4C93] uppercase tracking-wider">
                      Tanggal Edit
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[#6A4C93] uppercase tracking-wider">
                      Tanggal Buat
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[#6A4C93] uppercase tracking-wider">
                      Link
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[#6A4C93] uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#9AC4F8]/20">
                  {publications.map((pub, index) => (
                    <tr key={pub.publicationid} className="hover:bg-[#F8F4FC]/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#6A4C93]">
                        {index + 1}.
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-[#1A1A2E] font-medium">
                        {pub.title}
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-[#1A1A2E] max-w-xs">
                        <div className="line-clamp-2">
                          {pub.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1A2E]">
                        {pub.updatedat ? new Date(pub.updatedat).toLocaleDateString("id-ID") : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1A2E]">
                        {new Date(pub.createdat).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1A2E]">
                        <a
                          href={pub.filelink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#6A4C93] hover:text-[#9AC4F8] font-medium transition-colors flex items-center"
                        >
                          <span>Buka</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1A2E]">
                        <div className="flex space-x-2">
                          <Link href={`/admin/publication/${pub.publicationid}`}>
                            <button className="p-2 rounded-lg bg-[#9AC4F8]/20 hover:bg-[#9AC4F8]/40 text-[#6A4C93] transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                          </Link>
                          <Link href={`/admin/publication/edit/${pub.publicationid}`}>
                            <button className="p-2 rounded-lg bg-[#FFCAD4]/20 hover:bg-[#FFCAD4]/40 text-[#6A4C93] transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                              </svg>
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(pub.publicationid)}
                            className="p-2 rounded-lg bg-[#FFCAD4]/20 hover:bg-[#FFCAD4]/40 text-[#6A4C93] transition-colors"
                          >
                            {/* Trash icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full">
              <h3 className="text-lg font-semibold text-[#6A4C93] mb-4">Konfirmasi Penghapusan</h3>
              <p className="mb-6 text-[#1A1A2E]">Apakah kamu yakin ingin menghapus publikasi ini?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg border border-[#6A4C93] text-[#6A4C93] hover:bg-[#6A4C93]/10 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-[#6A4C93] text-white hover:bg-[#6A4C93]/90 transition-colors shadow-md"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}