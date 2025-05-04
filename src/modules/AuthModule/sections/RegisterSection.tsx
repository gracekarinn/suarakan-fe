"use client";
import { useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;

interface RegisterFormData {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^[0-9]{8,15}$/;
const fullNameRegex = /^[a-zA-Z0-9\s._-]+$/;

export default function RegisterSection() {
  const [formData, setFormData] = useState<RegisterFormData>({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info" | null; text: string }>({
    type: null,
    text: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const isStrongPassword = (password: string) =>
    password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);

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

    if (formData.phone_number.startsWith('+') || formData.phone_number.includes('-')) {
        setMessage({ type: "error", text: "Nomor HP tidak boleh diawali dengan + atau mengandung tanda -" });
        return;
      }      

    if (!fullNameRegex.test(formData.full_name)) {
        setMessage({ type: "error", text: "Nama hanya boleh berisi huruf, angka, spasi, dan karakter ('.','_','-')" });
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
      setMessage({ type: "error", text: "Password dan konfirmasi password tidak sama" });
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
        setMessage({ type: "success", text: "Pendaftaran berhasil! Silakan cek email Anda." });
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
        else if (data.phone_number) errorMessage = `Nomor Telepon: ${data.phone_number[0]}`;
        else if (data.non_field_errors) errorMessage = data.non_field_errors[0];
        setMessage({ type: "error", text: errorMessage });
      }
    } catch (error) {
      console.error("Registration error:", (error as Error).message);
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan. Silakan coba lagi." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden max-h-[90vh]">
  
        {/* Left Section */}
        <div className="bg-orange-700 text-white flex flex-col justify-center items-center px-8 py-10">
          <h1 className="text-4xl font-extrabold mb-4">SUARAKAN</h1>
          <p className="text-center text-lg font-medium">
            Laporkan kasus kekerasan seksual dengan aman dan mudah
          </p>
        </div>
  
        {/* Right Section */}
        <div className="px-6 py-8 md:p-10 overflow-y-auto max-h-[90vh]">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-bold text-orange-700 mb-1">Daftar Akun</h2>
            <p className="text-sm text-gray-600 text-center">
              Buat akun untuk melaporkan kasus kekerasan seksual
            </p>
          </div>
  
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder="Masukkan nama lengkap"
              />
            </div>
  
            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder="Masukkan email"
              />
            </div>
  
            {/* Phone Number */}
            <div>
              <label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
                Nomor Telepon
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder="Masukkan nomor telepon"
              />
            </div>
  
            {/* Password */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
                  placeholder="Buat password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
  
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-sm"
                  placeholder="Konfirmasi password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
  
            {/* Alert Message */}
            {message.type && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : message.type === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <strong>{message.type === "success" ? "Berhasil" : message.type === "error" ? "Error" : "Info"}: </strong>
                {message.text}
              </div>
            )}
  
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-md transition duration-150 disabled:bg-yellow-300"
            >
              {isLoading ? "Memproses..." : "Daftar"}
            </button>
          </form>
  
          <div className="text-center mt-6">
            <p className="text-sm text-gray-700">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="font-semibold text-orange-600 hover:underline">
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );  
}