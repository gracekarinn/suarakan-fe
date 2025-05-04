"use client";
import { Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Publication } from "@/modules/PublicationModule/interface";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL;

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
    return <p className="text-center py-10">Memuat publikasi...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-700">
          Dashboard Publikasi Kasus Kekerasan Seksual
        </h1>
        <Link href="/admin/publication/create">
          <button className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-300">
            + Buat Publikasi
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-orange-100 text-orange-800 text-sm font-semibold">
            <tr>
              <th className="px-4 py-3 border">No.</th>
              <th className="px-4 py-3 border text-left">Judul</th>
              <th className="px-4 py-3 border text-left">Deskripsi</th>
              <th className="px-4 py-3 border">Tanggal Edit</th>
              <th className="px-4 py-3 border">Tanggal Buat</th>
              <th className="px-4 py-3 border">Link</th>
              <th className="px-4 py-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {publications.map((pub, index) => (
              <tr key={pub.publicationid} className="hover:bg-orange-50">
                <td className="px-4 py-2 text-center border">{index + 1}.</td>
                <td className="px-4 py-2 border font-medium">{pub.title}</td>
                <td className="px-4 py-2 border text-sm text-gray-700 max-w-xs">
                  <div className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                    {pub.description}
                  </div>
                </td>
                <td className="px-4 py-2 border text-center">{pub.updatedat ?? "-"}</td>
                <td className="px-4 py-2 border text-center">{pub.createdat}</td>
                <td className="px-4 py-2 border text-center">
                  <a
                    href={pub.filelink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Open
                  </a>
                </td>
                <td className="px-4 py-2 border text-center space-x-2">
                  <Link href={`/admin/publication/${pub.publicationid}`}>
                    <button className="p-2 rounded bg-yellow-300 hover:bg-yellow-200">
                      <Eye size={16} />
                    </button>
                  </Link>
                  <Link href={`/admin/publication/edit/${pub.publicationid}`}>
                    <button className="p-2 rounded bg-yellow-300 hover:bg-yellow-200">
                      <Pencil size={16} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(pub.publicationid)}
                    className="p-2 rounded bg-yellow-300 hover:bg-yellow-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-orange-700 mb-4">Konfirmasi Penghapusan</h3>
            <p className="mb-6">Apakah kamu yakin ingin menghapus publikasi ini?</p>
            <div className="flex justify-between">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400"
              >
                Ya, Hapus
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}