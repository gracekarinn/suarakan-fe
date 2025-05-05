"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { RegisterFormData } from "../interface";

export default function RegisterSection() {
  const [formData, setFormData] = useState<RegisterFormData>({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });

  const AUTH_URL = "https://kelompok-3-suarakan-auth.pkpl.cs.ui.ac.id";
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[0-9]{8,15}$/;
  const fullNameRegex = /^[a-zA-Z0-9\s._-]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const isStrongPassword = (password: string) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: null, text: "" });

    if (!emailRegex.test(formData.email)) {
      setMessage({ type: "error", text: "Format email tidak valid" });
      setIsLoading(false);
      return;
    }

    if (!phoneRegex.test(formData.phone_number)) {
      setMessage({ type: "error", text: "Format nomor telepon tidak valid" });
      setIsLoading(false);
      return;
    }

    if (
      formData.phone_number.startsWith("+") ||
      formData.phone_number.includes("-")
    ) {
      setMessage({
        type: "error",
        text: "Nomor HP tidak boleh diawali dengan + atau mengandung tanda -",
      });
      setIsLoading(false);
      return;
    }

    if (!fullNameRegex.test(formData.full_name)) {
      setMessage({
        type: "error",
        text: "Nama hanya boleh berisi huruf, angka, spasi, dan karakter ('.','_','-')",
      });
      setIsLoading(false);
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setMessage({
        type: "error",
        text: "Password harus minimal 8 karakter dan mengandung huruf besar, kecil, dan angka",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setMessage({
        type: "error",
        text: "Password dan konfirmasi password tidak sama",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${AUTH_URL}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone_number: formData.phone_number.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Pendaftaran berhasil!",
        });
        setFormData({
          full_name: "",
          email: "",
          phone_number: "",
          password: "",
          confirm_password: "",
        });
      } else {
        let errorMessage = "Pendaftaran gagal.";
        if (data.email) errorMessage = `Email: ${data.email[0]}`;
        else if (data.password) errorMessage = `Password: ${data.password[0]}`;
        else if (data.phone_number)
          errorMessage = `Nomor Telepon: ${data.phone_number[0]}`;
        else if (data.non_field_errors) errorMessage = data.non_field_errors[0];
        setMessage({ type: "error", text: errorMessage });
      }
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan jaringan. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F4FC] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#6A4C93] to-[#9AC4F8] text-white p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 flex items-center">
              <span>SUARA</span>
              <span>KAN</span>
              <span className="text-[#FFCAD4] text-2xl ml-2">♥</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
              Laporkan kasus kekerasan seksual dengan aman dan terpercaya
            </p>
            <div className="space-y-4 text-white/90">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p>Kerahasiaan terjamin</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p>Terenkripsi dan aman</p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 14V17M12 14V17M16 14V17M3 21H21M4 10H20C20.5523 10 21 10.4477 21 11V21H3V11C3 10.4477 3.44772 10 4 10ZM12 3L19 10H5L12 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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

        <div className="w-full md:w-7/12 p-6 md:p-10">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#6A4C93] mb-2">
                Buat Akun Baru
              </h2>
              <p className="text-[#1A1A2E]/70">
                Isi formulir di bawah untuk memulai pelaporan
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label
                  htmlFor="full_name"
                  className="text-sm font-medium text-[#1A1A2E]/80 block"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6A4C93]/60">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2.5 border border-[#9AC4F8]/30 rounded-lg focus:ring-2 focus:ring-[#9AC4F8] focus:border-[#9AC4F8] text-[#1A1A2E]"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-[#1A1A2E]/80 block"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6A4C93]/60">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2.5 border border-[#9AC4F8]/30 rounded-lg focus:ring-2 focus:ring-[#9AC4F8] focus:border-[#9AC4F8] text-[#1A1A2E]"
                    placeholder="Masukkan alamat email"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="phone_number"
                  className="text-sm font-medium text-[#1A1A2E]/80 block"
                >
                  Nomor Telepon
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6A4C93]/60">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    required
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2.5 border border-[#9AC4F8]/30 rounded-lg focus:ring-2 focus:ring-[#9AC4F8] focus:border-[#9AC4F8] text-[#1A1A2E]"
                    placeholder="Masukkan nomor telepon"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#1A1A2E]/80 block"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6A4C93]/60">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2.5 border border-[#9AC4F8]/30 rounded-lg focus:ring-2 focus:ring-[#9AC4F8] focus:border-[#9AC4F8] text-[#1A1A2E]"
                    placeholder="Buat password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6A4C93]/60 hover:text-[#6A4C93]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.8787 11.1213C13.3284 10.571 12.5346 10.25 11.6569 10.25C9.90149 10.25 8.50798 11.8931 8.55845 13.75C8.58088 14.5692 8.89966 15.3151 9.34835 15.8787M17.1925 15.2562C16.3728 16.0407 15.2977 16.5982 14.0644 16.75C11.7445 17.0729 9.9855 15.7959 9.2995 14.25M3 3L21 21M10.7973 5.34467C11.1909 5.24481 11.5947 5.19229 12.0054 5.19229C16.4396 5.19229 20.0054 9.5 20.0054 9.5C20.0054 9.5 19.0054 11.1667 17.0054 12.5L10.7973 5.34467ZM7.49958 6.5C7.16894 6.83345 6.86856 7.16345 6.59917 7.45097C5.5 8.625 4.5 9.5 4.5 9.5C4.5 9.5 8.06583 13.8077 12.5 13.8077C12.6338 13.8077 12.7669 13.8042 12.899 13.7973L7.49958 6.5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.0054 5C16.4396 5 20.0054 9.5 20.0054 9.5C20.0054 9.5 16.4396 14 12.0054 14C7.57124 14 4.00537 9.5 4.00537 9.5C4.00537 9.5 7.57124 5 12.0054 5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#1A1A2E]/60">
                  Min. 8 karakter dengan huruf besar, kecil, dan angka
                </p>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirm_password"
                  className="text-sm font-medium text-[#1A1A2E]/80 block"
                >
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6A4C93]/60">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full pl-10 px-4 py-2.5 border border-[#9AC4F8]/30 rounded-lg focus:ring-2 focus:ring-[#9AC4F8] focus:border-[#9AC4F8] text-[#1A1A2E]"
                    placeholder="Konfirmasi password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#6A4C93]/60 hover:text-[#6A4C93]"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.8787 11.1213C13.3284 10.571 12.5346 10.25 11.6569 10.25C9.90149 10.25 8.50798 11.8931 8.55845 13.75C8.58088 14.5692 8.89966 15.3151 9.34835 15.8787M17.1925 15.2562C16.3728 16.0407 15.2977 16.5982 14.0644 16.75C11.7445 17.0729 9.9855 15.7959 9.2995 14.25M3 3L21 21M10.7973 5.34467C11.1909 5.24481 11.5947 5.19229 12.0054 5.19229C16.4396 5.19229 20.0054 9.5 20.0054 9.5C20.0054 9.5 19.0054 11.1667 17.0054 12.5L10.7973 5.34467ZM7.49958 6.5C7.16894 6.83345 6.86856 7.16345 6.59917 7.45097C5.5 8.625 4.5 9.5 4.5 9.5C4.5 9.5 8.06583 13.8077 12.5 13.8077C12.6338 13.8077 12.7669 13.8042 12.899 13.7973L7.49958 6.5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12.0054 5C16.4396 5 20.0054 9.5 20.0054 9.5C20.0054 9.5 16.4396 14 12.0054 14C7.57124 14 4.00537 9.5 4.00537 9.5C4.00537 9.5 7.57124 5 12.0054 5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {message.type && (
                <div
                  className={`p-3 rounded-lg ${
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
                        <svg
                          className="h-5 w-5 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.293-11.293a1 1 0 00-1.414 0L8 9.586l-1.879-1.879a1 1 0 00-1.414 1.414l2.293 2.293a1 1 0 001.414 0l3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : message.type === "error" ? (

                        <svg
                          className="h-5 w-5 text-red-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.293-11.293a1 1 0 00-1.414 0L8 9.586l-1.879-1.879a1 1 0 00-1.414 1.414l2.293 2.293a1 1 0 001.414 0l3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-blue-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.293-11.293a1 1 0 00-1.414 0L8 9.586l-1.879-1.879a1 1 0 00-1.414 1.414l2.293 2.293a1 1 0 001.414 0l3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <div className="ml-3"></div>
                        <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className={`w-full py-2.5 px-4 bg-[#6A4C93] text-white rounded-lg font-semibold transition duration-200 hover:bg-[#9AC4F8] focus:outline-none focus:ring-2 focus:ring-[#9AC4F8] focus:ring-opacity-50 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4.22223 12C4.22223 7.58172 7.58172 4.22223 12 4.22223C16.4183 4.22223 19.7778 7.58172 19.7778 12C19.7778 16.4183 16.4183 19.7778 12 19.7778C7.58172 19.7778 4.22223 16.4183 4.22223 12Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M12.9497 4.05025C13.3409 3.65909 13.9732 3.65909 14.3644 4.05025L18.3644 8.05025C18.7556 8.44141 18.7556 9.07373 18.3644 9.46491C17.9732 9.85609 17.3409 9.85609 16.95 9.46491L13.9497 6.46491L12 .05025Z"
                      fill="#E5E7EB"
                    />
                  </svg>
                ) : (
                  "Daftar"
                )}
              </button>
              <p className="text-sm text-center text-[#1A1A2E]/70">
                Sudah punya akun?{" "}
                <Link
                  href="/auth/login"
                  className="text-[#6A4C93] font-semibold hover:underline"
                >
                  Masuk
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}