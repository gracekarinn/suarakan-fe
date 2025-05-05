"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserData } from "./interface";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch(
        `https://kelompok-3-suarakan-auth.pkpl.cs.ui.ac.id/api/auth/user-profile/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setUserData(data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    localStorage.removeItem("is_logged_in");
    setIsLoggedIn(false);
    setUserData(null);
    router.push("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = isLoggedIn
    ? userData?.user_type === "ADMIN"
      ? [
          { href: "/admin/report", text: "Lihat Laporan" },
          { href: "/admin/publication", text: "Buat Publikasi" },
        ]
      : [
          { href: "/", text: "Beranda" },
          { href: "/report/create", text: "Pelaporan" },
          { href: "/progress", text: "Pelacakan" },
          { href: "/publication", text: "Publikasi" },
        ]
    : [
        { href: "/", text: "Beranda" },
        { href: "/publication", text: "Publikasi" },
      ];

  return (
    <nav className="bg-[#F8F4FC] text-[#1A1A2E] p-4 sticky top-0 z-50 border-b border-[#FFCAD4]/30">
      <div className="container mx-auto">
        <div className="hidden md:flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">
            <Link
              href="/"
              className="flex items-center hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center">
                <span className="text-[#6A4C93]">SUARA</span>
                <span className="text-[#9AC4F8]">KAN</span>
                <span className="text-[#FFCAD4] text-sm ml-1">♥</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <div key={index}>
                <Link
                  href={link.href}
                  className="text-[#1A1A2E] hover:text-[#6A4C93] font-medium transition-colors relative group"
                >
                  {link.text}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFCAD4] group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center bg-white rounded-full pl-3 pr-1 py-1 shadow-md border border-[#FFCAD4]/20">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-[#9AC4F8]/30 rounded-full mr-2 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6A4C93"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <span className="mr-2 text-sm font-medium text-[#1A1A2E]">
                    {userData?.user_type === "ADMIN"
                      ? "Admin"
                      : userData?.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-[#F8F4FC] text-[#6A4C93] hover:bg-[#FFCAD4]/20 p-2 rounded-full transition-colors"
                  aria-label="Logout"
                >
                  <span className="block text-xs font-medium">Log out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="bg-[#6A4C93] hover:bg-[#6A4C93]/90 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Log in
              </Link>
            )}
          </div>
        </div>

        <div className="md:hidden flex justify-between items-center">
          <div className="text-xl font-bold">
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <span className="text-[#6A4C93]">SUARA</span>
                <span className="text-[#9AC4F8]">KAN</span>
                <span className="text-[#FFCAD4] text-xs ml-0.5">♥</span>
              </div>
            </Link>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 focus:outline-none text-[#6A4C93] rounded-md hover:bg-[#FFCAD4]/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <span className="block w-6 h-6 text-center font-medium text-lg">
                ✕
              </span>
            ) : (
              <div className="flex flex-col justify-center items-center w-6 h-6">
                <span className="block w-5 h-0.5 bg-[#6A4C93] mb-1"></span>
                <span className="block w-5 h-0.5 bg-[#6A4C93] mb-1"></span>
                <span className="block w-5 h-0.5 bg-[#6A4C93]"></span>
              </div>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-4 bg-white rounded-lg mt-3 shadow-lg border border-[#FFCAD4]/20">
            {navLinks.map((link, index) => (
              <div key={index} className="py-2 border-b border-[#F8F4FC]">
                <Link
                  href={link.href}
                  className="block text-[#1A1A2E] hover:text-[#6A4C93] transition-colors px-4 py-1 rounded-md hover:bg-[#F8F4FC]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.text}
                </Link>
              </div>
            ))}
            <div className="pt-2 px-4 pb-3">
              {isLoggedIn ? (
                <div className="flex items-center justify-between bg-[#F8F4FC] rounded-lg p-3 shadow-sm">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-[#9AC4F8]/30 rounded-full mr-2 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6A4C93"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3 h-3"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-[#1A1A2E]">
                      {userData?.user_type === "ADMIN"
                        ? "Admin"
                        : userData?.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-white text-[#6A4C93] hover:bg-[#FFCAD4]/20 px-3 py-1.5 rounded-md transition-colors text-xs font-medium border border-[#FFCAD4]/30"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="bg-[#6A4C93] hover:bg-[#6A4C93]/90 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 shadow-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  Log in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};