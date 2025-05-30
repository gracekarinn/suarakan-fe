"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ReportFormState, Relationships, MarriageStatus, EducationLevel, Authority } from '../interface';
import {
    sanitizeString,
    sanitizeName,
    validatePhone,
    validateEmail,
    validateUrl,
    validateDescription,
    validateNIK,
    formatDateForBackend,
    formatDateTimeForBackend
  } from './utils';

const BE_URL = "https://kelompok-3-suarakan-be.pkpl.cs.ui.ac.id"

const EditReport = () => {
    const { id } = useParams();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState<ReportFormState>({
        // REPORTER
        reporterfullname: '',
        reporterphonenum: '',
        reporteraddress: '',
        reporterrelationship: Relationships.Teman,
    
        // INCIDENT
        incidentlocation: '',
        incidenttime: '',
        incidentdescription: '',
        incidentvictimneeds: '',
        incidentproof: '',
        
        // VICTIM
        victimfullname: '',
        victimnik: '',
        victimemail: '',
        victimaddress: '',
        victimphonenum: '',
        victimoccupation: '',
        victimsex: 'Laki-laki',
        victimdateofbirth: '',
        victimplaceofbirth: '',
        victimeducationlevel: EducationLevel.SMA_MA_SMK_Sederajat,
        victimmarriagestatus: MarriageStatus.Belum_Kawin,

        // ACCUSED
        accusedfullname: '',
        accusedaddress: '',
        accusedphonenum: '',
        accusedoccupation: '',
        accusedsex: 'Laki-laki',
        accusedrelationship: Relationships.Teman,
    
        // AUTHORITY 
        authority: Authority.Universitas_Indonesia
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    setError('Anda harus login terlebih dahulu');
                    router.push('/login');
                    return;
                }

                const response = await fetch(`${BE_URL}/api/v1/reports/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch report');
                }

                const data = await response.json();
                const report = data.report;

                const incidentTime = report.incidenttime ? 
                    formatDateTimeForBackend(report.incidenttime).slice(0, 16) : '';
                const victimDateOfBirth = report.victimdateofbirth ?
                    formatDateForBackend(report.victimdateofbirth) : '';

                setFormData({
                    reporterfullname: report.reporterfullname || '',
                    reporterphonenum: report.reporterphonenum || '',
                    reporteraddress: report.reporteraddress || '',
                    reporterrelationship: (report.reporterrelationship as Relationships) || Relationships.Teman,
                    
                    incidentlocation: report.incidentlocation,
                    incidenttime: incidentTime,
                    incidentdescription: report.incidentdescription || '',
                    incidentvictimneeds: report.incidentvictimneeds || '',
                    incidentproof: report.incidentproof || '',
                    
                    victimfullname: report.victimfullname,
                    victimnik: report.victimnik || '',
                    victimemail: report.victimemail || '',
                    victimaddress: report.victimaddress || '',
                    victimphonenum: report.victimphonenum || '',
                    victimoccupation: report.victimoccupation || '',
                    victimsex: report.victimsex as 'Laki-laki' | 'Perempuan' | 'Lainnya' || 'Laki-laki',
                    victimdateofbirth: victimDateOfBirth,
                    victimplaceofbirth: report.victimplaceofbirth || '',
                    victimeducationlevel: (report.victimeducationlevel as EducationLevel) || EducationLevel.SMA_MA_SMK_Sederajat,
                    victimmarriagestatus: (report.victimmarriagestatus as MarriageStatus) || MarriageStatus.Belum_Kawin,
                    
                    accusedfullname: report.accusedfullname,
                    accusedaddress: report.accusedaddress || '',
                    accusedphonenum: report.accusedphonenum || '',
                    accusedoccupation: report.accusedoccupation || '',
                    accusedsex: report.accusedsex as 'Laki-laki' | 'Perempuan' | 'Lainnya' || 'Laki-laki',
                    accusedrelationship: (report.accusedrelationship as Relationships) || Relationships.Teman,
                    
                    authority: (report.authority as Authority) || Authority.Universitas_Indonesia
                });
            } catch (error) {
                console.error('Error fetching report:', error);
                setError(error instanceof Error ? error.message : 'Failed to load report');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id, router]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = (): { [key: string]: string } => {
        let newErrors: { [key: string]: string } = {};

        if (!formData.incidentlocation.trim()) {
            newErrors.incidentlocation = "Lokasi insiden harus diisi!";
        }
        if (!formData.victimfullname.trim()) {
            newErrors.victimfullname = "Nama korban harus diisi!";
        }
        if (!formData.accusedfullname.trim()) {
            newErrors.accusedfullname = "Nama pelaku harus diisi!";
        }
        if (!formData.authority.trim()) {
            newErrors.authority = "Tujuan pengaduan harus diisi!";
        }
        if (!formData.incidenttime) {
            newErrors.incidenttime = "Waktu insiden harus diisi!";
        }
        if (!formData.incidentproof) {
            newErrors.incidentproof = "Link bukti harus diisi!";
        }

        // VALIDASI
        if (formData.reporterphonenum && !validatePhone(formData.reporterphonenum)) {
            newErrors.reporterphonenum = "Nomor telepon tidak valid. Harus terdiri dari 8-13 digit numerik.";
        }
        if (!validateDescription(formData.incidentdescription)) {
            newErrors.incidentdescription = "Deskripsi pelanggaran harus minimal 10 karakter.";
        }
        if (formData.victimemail && !validateEmail(formData.victimemail)) {
            newErrors.victimemail = "Email korban tidak valid.";
        }
        if (formData.incidentproof && !validateUrl(formData.incidentproof)) {
            newErrors.incidentproof = "Link bukti tidak valid.";
        }
        if (formData.victimnik && !validateNIK(formData.victimnik)) {
            newErrors.victimnik = "NIK harus terdiri dari 16 digit numerik.";
        }
        if (formData.victimphonenum && !validatePhone(formData.victimphonenum)) {
            newErrors.victimphonenum = "Nomor telepon tidak valid. Harus terdiri dari 8-13 digit numerik.";
        }
        if (formData.accusedphonenum && !validatePhone(formData.accusedphonenum)) {
            newErrors.accusedphonenum = "Nomor telepon tidak valid. Harus terdiri dari 8-13 digit numerik.";
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            // FORMAT DATA KE BACKEND
            const formattedData = {
                reporterfullname: formData.reporterfullname || null,
                reporterphonenum: formData.reporterphonenum || null,
                reporteraddress: formData.reporteraddress || null,
                reporterrelationship: formData.reporterrelationship || null,
                
                incidentlocation: formData.incidentlocation,
                incidenttime: new Date(formData.incidenttime).toISOString().slice(0, 19),
                incidentdescription: formData.incidentdescription || null,
                incidentvictimneeds: formData.incidentvictimneeds || null,
                incidentproof: formData.incidentproof || null,
                
                victimfullname: formData.victimfullname,
                victimnik: formData.victimnik || null,
                victimemail: formData.victimemail || null,
                victimaddress: formData.victimaddress || null,
                victimphonenum: formData.victimphonenum || null,
                victimoccupation: formData.victimoccupation || null,
                victimsex: formData.victimsex || null,
                victimdateofbirth: formData.victimdateofbirth ? formatDateForBackend(formData.victimdateofbirth) : null,
                victimplaceofbirth: formData.victimplaceofbirth || null,
                victimeducationlevel: formData.victimeducationlevel || null,
                victimmarriagestatus: formData.victimmarriagestatus || null,
                
                accusedfullname: formData.accusedfullname,
                accusedaddress: formData.accusedaddress || null,
                accusedphonenum: formData.accusedphonenum || null,
                accusedoccupation: formData.accusedoccupation || null,
                accusedsex: formData.accusedsex || null,
                accusedrelationship: formData.accusedrelationship || null,
                
                authority: formData.authority,
                reportid: Number(id),
                reporterid: null // SET DI BACKEND PAKE TOKEN
            };

            const token = localStorage.getItem('access_token');
            if (!token) {
                setSubmitError('Anda harus login terlebih dahulu');
                router.push('/login');
                return;
            }

            const response = await fetch(`${BE_URL}/api/v1/reports/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formattedData)
            });

            let data;
            const contentType = response.headers.get("Content-Type") || "";
            
            if (contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(text || 'Server tidak merespons dengan data JSON');
            }
            
            if (!response.ok) {
                throw new Error(data?.error || 'Terjadi kesalahan saat mengupdate laporan');
            }
            
            alert('Laporan berhasil diupdate!');
            router.push('/progress');
        } catch (error) {
            console.error('Error updating report:', error);
            setSubmitError(error instanceof Error ? error.message : 'Terjadi kesalahan saat mengupdate laporan');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl">Loading...</div>;
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl">
                <p className="text-red-500">{error}</p>
                <Link href="/progress" className="mt-4 inline-block text-[#DD5746] hover:underline">
                    Kembali ke Daftar Laporan
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl mb-4 mt-4">
            <h2 className="text-3xl font-bold text-[#6A4C93] mb-6 text-center">Edit Formulir Pengaduan</h2>
            
            {submitError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                    {submitError}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Identitas Pelapor Section */}
                <div className="bg-gray-100 p-4 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4 text-[#6A4C93]">1. Identitas Pelapor</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="reporterfullname"
                            value={formData.reporterfullname}
                            onChange={handleInputChange}
                            placeholder="Nama Lengkap"
                            className="w-full p-2 border rounded"
                        />
                        <div>
                            <input
                                type="tel"
                                name="reporterphonenum"
                                value={formData.reporterphonenum}
                                onChange={handleInputChange}
                                placeholder="Nomor Telepon"
                                className="w-full p-2 border rounded"
                            />
                            {errors.reporterphonenum && <p className="text-red-500 text-sm mt-1">{errors.reporterphonenum}</p>}
                        </div>
                        <textarea
                            name="reporteraddress"
                            value={formData.reporteraddress}
                            onChange={handleInputChange}
                            placeholder="Alamat"
                            className="w-full p-2 border rounded col-span-2"
                            rows={3}
                        />
                        <select
                            name="reporterrelationship"
                            value={formData.reporterrelationship}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Pilih Hubungan dengan Korban</option>
                            {Object.values(Relationships).map(relation => (
                                <option key={relation} value={relation}>{relation}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 2. Informasi Pelanggaran Section */}
                <div className="bg-gray-100 p-4 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4 text-[#6A4C93]">2. Informasi Pelanggaran</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                name="incidentlocation"
                                value={formData.incidentlocation}
                                onChange={handleInputChange}
                                placeholder="Lokasi"
                                className={`w-full p-2 border rounded ${errors.incidentlocation ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.incidentlocation && <p className="text-red-500 text-sm mt-1">{errors.incidentlocation}</p>}
                        </div>
                        <div>
                            <input
                                type="datetime-local"
                                name="incidenttime"
                                value={formData.incidenttime}
                                onChange={handleInputChange}
                                placeholder="Waktu"
                                className={`w-full p-2 border rounded ${errors.incidenttime ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.incidenttime && <p className="text-red-500 text-sm mt-1">{errors.incidenttime}</p>}
                        </div>
                        <div className="col-span-2">
                            <textarea
                                name="incidentdescription"
                                value={formData.incidentdescription}
                                onChange={handleInputChange}
                                placeholder="Deskripsi Pelanggaran"
                                className={`w-full p-2 border rounded ${errors.incidentdescription ? 'border-red-500' : ''}`}
                                rows={4}
                                required
                            />
                            {errors.incidentdescription && <p className="text-red-500 text-sm mt-1">{errors.incidentdescription}</p>}
                        </div>
                        <input
                            type="text"
                            name="incidentvictimneeds"
                            value={formData.incidentvictimneeds}
                            onChange={handleInputChange}
                            placeholder="Kebutuhan Korban"
                            className="w-full p-2 border rounded col-span-2"
                        />
                        <div className="col-span-2">
                            <input
                                type="url"
                                name="incidentproof"
                                value={formData.incidentproof}
                                onChange={handleInputChange}
                                placeholder="Link Bukti"
                                className={`w-full p-2 border rounded ${errors.incidentproof ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.incidentproof && <p className="text-red-500 text-sm mt-1">{errors.incidentproof}</p>}
                        </div>
                    </div>
                </div>

                {/* 3. Identitas Korban Section */}
                <div className="bg-gray-100 p-4 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4 text-[#6A4C93]">3. Identitas Korban</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                name="victimfullname"
                                value={formData.victimfullname}
                                onChange={handleInputChange}
                                placeholder="Nama Lengkap"
                                className={`w-full p-2 border rounded ${errors.victimfullname ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.victimfullname && <p className="text-red-500 text-sm mt-1">{errors.victimfullname}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                name="victimnik"
                                value={formData.victimnik}
                                onChange={handleInputChange}
                                placeholder="NIK"
                                className={`w-full p-2 border rounded ${errors.victimnik ? 'border-red-500' : ''}`}
                            />
                            {errors.victimnik && <p className="text-red-500 text-sm mt-1">{errors.victimnik}</p>}
                        </div>
                        <div>
                            <input
                                type="email"
                                name="victimemail"
                                value={formData.victimemail}
                                onChange={handleInputChange}
                                placeholder="Email"
                                className={`w-full p-2 border rounded ${errors.victimemail ? 'border-red-500' : ''}`}
                            />
                            {errors.victimemail && <p className="text-red-500 text-sm mt-1">{errors.victimemail}</p>}
                        </div>
                        <textarea
                            name="victimaddress"
                            value={formData.victimaddress}
                            onChange={handleInputChange}
                            placeholder="Alamat Domisili"
                            className="w-full p-2 border rounded"
                            rows={2}
                        />
                        <div>
                            <input
                                type="tel"
                                name="victimphonenum"
                                value={formData.victimphonenum}
                                onChange={handleInputChange}
                                placeholder="Nomor Telepon"
                                className={`w-full p-2 border rounded ${errors.victimphonenum ? 'border-red-500' : ''}`}
                            />
                            {errors.victimphonenum && <p className="text-red-500 text-sm mt-1">{errors.victimphonenum}</p>}
                        </div>
                        <input
                            type="text"
                            name="victimoccupation"
                            value={formData.victimoccupation}
                            onChange={handleInputChange}
                            placeholder="Pekerjaan"
                            className="w-full p-2 border rounded"
                        />
                        <select
                            name="victimsex"
                            value={formData.victimsex}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                        <div>
                            <input
                                type="date"
                                name="victimdateofbirth"
                                value={formData.victimdateofbirth}
                                onChange={handleInputChange}
                                placeholder="Tanggal Lahir"
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <input
                            type="text"
                            name="victimplaceofbirth"
                            value={formData.victimplaceofbirth}
                            onChange={handleInputChange}
                            placeholder="Tempat Lahir"
                            className="w-full p-2 border rounded"
                        />
                        <select
                            name="victimeducationlevel"
                            value={formData.victimeducationlevel}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Pilih Pendidikan</option>
                            {Object.values(EducationLevel).map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                        <select
                            name="victimmarriagestatus"
                            value={formData.victimmarriagestatus}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Pilih Status Pernikahan</option>
                            {Object.values(MarriageStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 4. Identitas Terdakwa Section */}
                <div className="bg-gray-100 p-4 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4 text-[#6A4C93]">4. Identitas Terdakwa</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                name="accusedfullname"
                                value={formData.accusedfullname}
                                onChange={handleInputChange}
                                placeholder="Nama Lengkap"
                                className={`w-full p-2 border rounded ${errors.accusedfullname ? 'border-red-500' : ''}`}
                                required
                            />
                            {errors.accusedfullname && <p className="text-red-500 text-sm mt-1">{errors.accusedfullname}</p>}
                        </div>
                        <textarea
                            name="accusedaddress"
                            value={formData.accusedaddress}
                            onChange={handleInputChange}
                            placeholder="Alamat Domisili"
                            className="w-full p-2 border rounded"
                            rows={2}
                        />
                        <div>
                            <input
                                type="tel"
                                name="accusedphonenum"
                                value={formData.accusedphonenum}
                                onChange={handleInputChange}
                                placeholder="Nomor Telepon"
                                className={`w-full p-2 border rounded ${errors.accusedphonenum ? 'border-red-500' : ''}`}
                            />
                            {errors.accusedphonenum && <p className="text-red-500 text-sm mt-1">{errors.accusedphonenum}</p>}
                        </div>
                        <input
                            type="text"
                            name="accusedoccupation"
                            value={formData.accusedoccupation}
                            onChange={handleInputChange}
                            placeholder="Pekerjaan"
                            className="w-full p-2 border rounded"
                        />
                        <select
                            name="accusedsex"
                            value={formData.accusedsex}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                        <select
                            name="accusedrelationship"
                            value={formData.accusedrelationship}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Pilih Hubungan dengan Korban</option>
                            {Object.values(Relationships).map(relation => (
                                <option key={relation} value={relation}>{relation}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 5. Level Pengaduan Section */}
                <div className="bg-gray-100 p-4 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4 text-[#6A4C93]">5. Tujuan Pengaduan</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <select
                                name="authority"
                                value={formData.authority}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded ${errors.authority ? 'border-red-500' : ''}`}
                                required
                            >
                                <option value="">Pilih Institusi yang Dituju</option>
                                {Object.values(Authority).map(auth => (
                                    <option key={auth} value={auth}>{auth}</option>
                                ))}
                            </select>
                            {errors.authority && <p className="text-red-500 text-sm mt-1">{errors.authority}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Link 
                        href="/progress"
                        className="w-1/2 bg-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-400 transition-colors text-center"
                    >
                        Cancel
                    </Link>
                    <button 
                        type="submit" 
                        className="w-1/2 bg-[#6A4C93] text-white px-6 py-3 rounded-xl hover:bg-[#8364B0] transition-colors disabled:bg-gray-400 cursor-pointer"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Mengupdate...' : 'Edit Laporan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditReport;