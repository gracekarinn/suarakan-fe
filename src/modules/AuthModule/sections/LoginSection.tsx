"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginFormData } from "../interface";

const AUTH_URL = "https://kelompok-3-suarakan-auth.pkpl.cs.ui.ac.id";

export default function LoginSection() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info" | null; text: string }>({
    type: null,
    text: "",
  });

  const router = useRouter();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: null, text: "" });

    if (!emailRegex.test(formData.email)) {
      setMessage({ type: "error", text: "Format email tidak valid" });
      setIsLoading(false);
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setMessage({ type: "error", text: "Password harus minimal 8 karakter" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${AUTH_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user_id", JSON.stringify(data.user_id));
        localStorage.setItem("user_role", data.user_role);
        localStorage.setItem("is_logged_in", "true");

        setMessage({ type: "success", text: "Login berhasil. Mengarahkan..." });
      
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);        
      } else {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Email atau password salah.";
        
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
        
        setMessage({ type: "error", text: errorMessage });
      }
      
    } catch (error) {
      console.error("Login error:", (error as Error).message);
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan. Silakan coba lagi." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F4FC] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#6A4C93] to-[#9AC4F8] text-white p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 flex items-center">
              <span>SUARA</span>
              <span>KAN</span>
              <span className="text-[#FFCAD4] text-2xl ml-2">♥</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
              Masuk untuk melanjutkan pelaporan kasus kekerasan seksual
            </p>
            <div className="space-y-4 text-white/90">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p>Kelola laporan Anda</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 14V17M12 14V17M16 14V17M3 21H21M4 10H20C20.5523 10 21 10.4477 21 11V21H3V11C3 10.4477 3.44772 10 4 10ZM12 3L19 10H5L12 3Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p>Pantau status laporan</p>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[#FFCAD4]/20"></div>
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[#FFCAD4]/10"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-white/10"></div>
        </div>
        
        <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#6A4C93] mb-2">Masuk Akun</h2>
              <p className="text-[#1A1A2E]/70">
                Masukkan email dan password Anda
              </p>
            </div>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#1A1A2E]/80 block">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6A4C93]/60">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" 
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-3 border border-[#9AC4F8]/30 rounded-lg focus:ring-2 focus:ring-[#9AC4F8] focus:border-[#9AC4F8] text-[#1A1A2E]"
                    placeholder="Masukkan alamat email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium text-[#1A1A2E]/80">
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-[#9AC4F8] hover:text-[#6A4C93] transition-colors">
                    Lupa password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6A4C93]/60">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" 
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-3 border border-[#9AC4F8]/30 rounded-lg focus:ring-2 focus:ring-[#9AC4F8] focus:border-[#9AC4F8] text-[#1A1A2E]"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6A4C93]/60 hover:text-[#6A4C93]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.8787 11.1213C13.3284 10.571 12.5346 10.25 11.6569 10.25C9.90149 10.25 8.50798 11.8931 8.55845 13.75C8.58088 14.5692 8.89966 15.3151 9.34835 15.8787M17.1925 15.2562C16.3728 16.0407 15.2977 16.5982 14.0644 16.75C11.7445 17.0729 9.9855 15.7959 9.2995 14.25M3 3L21 21M10.7973 5.34467C11.1909 5.24481 11.5947 5.19229 12.0054 5.19229C16.4396 5.19229 20.0054 9.5 20.0054 9.5C20.0054 9.5 19.0054 11.1667 17.0054 12.5L10.7973 5.34467ZM7.49958 6.5C7.16894 6.83345 6.86856 7.16345 6.59917 7.45097C5.5 8.625 4.5 9.5 4.5 9.5C4.5 9.5 8.06583 13.8077 12.5 13.8077C12.6338 13.8077 12.7669 13.8042 12.899 13.7973L7.49958 6.5Z" 
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.0054 5C16.4396 5 20.0054 9.5 20.0054 9.5C20.0054 9.5 16.4396 14 12.0054 14C7.57124 14 4.00537 9.5 4.00537 9.5C4.00537 9.5 7.57124 5 12.0054 5Z"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {message.type && (
                <div
                  className={`p-4 rounded-lg ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : message.type === "error"
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-blue-50 text-blue-800 border border-blue-200"
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {message.type === "success" ? (
                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : message.type === "error" ? (
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">
                        {message.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#6A4C93] focus:ring-[#6A4C93] border-[#9AC4F8]/30 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#1A1A2E]/70">
                  Ingat saya
                </label>
              </div>
 
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6A4C93] hover:bg-[#6A4C93]/90 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </span>
              </button>

              <div className="text-center mt-6">
                <p className="text-[#1A1A2E]/70">
                  Belum punya akun?{" "}
                  <Link href="/auth/register" className="font-medium text-[#6A4C93] hover:text-[#9AC4F8] transition-colors hover:underline">
                    Daftar Sekarang
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}