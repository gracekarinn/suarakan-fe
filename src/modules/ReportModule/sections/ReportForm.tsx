"use client";

import React, { useState } from 'react';
import { ReportFormState, Relationships, MarriageStatus, EducationLevel, Authority } from '../interface';
import {
  sanitizeString,
  sanitizeName,
  validatePhone,
  validateEmail,
  validateUrl,
  validateDate,
  validateDescription
} from './utils';

const ReportForm: React.FC = () => {
  const [formData, setFormData] = useState<ReportFormState>({
    // Identitas Pelapor
    reporterfullname: '',
    reporterphonenum: '',
    reporteraddress: '',
    reporterrelationship: Relationships.Teman,
  
    // Informasi Pelanggaran
    incidentlocation: '',
    incidenttime: '',
    incidentdescription: '',
    incidentvictimneeds: '',
    incidentproof: '',
    
    // Identitas Korban
    victimfullname: '',
    victimnik: '',
    victimemail: '',
    victimaddress: '',
    victimphonenum: '',
    victimoccupation: '',
    victimsex: 'Laki-laki',
    victimdateofbirth: '',
    victimplaceofbirth: '',
    victimeducationlevel: EducationLevel.Tidak_Sekolah,
    victimmarriagestatus: MarriageStatus.Belum_Kawin,

    // Terdakwa
    accusedfullname: '',
    accusedaddress: '',
    accusedphonenum: '',
    accusedoccupation: '',
    accusedsex: 'Laki-laki',
    accusedrelationship: Relationships.Teman,
  
    // Level Pengaduan
    authority: Authority.Universitas_Indonesia
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    let newErrors: { [key: string]: string } = {};

    if (!validatePhone(formData.reporterphonenum)) {
      newErrors.reporterphonenum = "Nomor telepon tidak valid. Harus terdiri dari 10-15 digit, dengan opsi '+' di awal.";
    }
    if (!validateDescription(formData.incidentdescription)) {
      newErrors.incidentdescription = "Deskripsi pelanggaran harus minimal 10 karakter.";
    }
    if (!validateEmail(formData.victimemail)) {
      newErrors.victimemail = "Email korban tidak valid.";
    }
    if (formData.incidentproof && !validateUrl(formData.incidentproof)) {
      newErrors.incidentproof = "Link bukti tidak valid.";
    }
    if (!validateDate(formData.victimdateofbirth)) {
      newErrors.victimdateofbirth = "Tanggal lahir tidak valid.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const sanitizedData: ReportFormState = {
      ...formData,
      reporterfullname: sanitizeName(formData.reporterfullname),
      reporterphonenum: sanitizeString(formData.reporterphonenum),
      reporteraddress: sanitizeString(formData.reporteraddress),
      incidentlocation: sanitizeString(formData.incidentlocation),
      incidentdescription: sanitizeString(formData.incidentdescription),
      incidentvictimneeds: sanitizeString(formData.incidentvictimneeds),
      incidentproof: sanitizeString(formData.incidentproof),
      victimfullname: sanitizeName(formData.victimfullname),
      victimnik: sanitizeString(formData.victimnik),
      victimemail: formData.victimemail.trim(),
      victimaddress: sanitizeString(formData.victimaddress),
      victimphonenum: sanitizeString(formData.victimphonenum),
      victimoccupation: sanitizeString(formData.victimoccupation),
      victimplaceofbirth: sanitizeString(formData.victimplaceofbirth),
      accusedfullname: sanitizeName(formData.accusedfullname),
      accusedaddress: sanitizeString(formData.accusedaddress),
      accusedphonenum: sanitizeString(formData.accusedphonenum),
      accusedoccupation: sanitizeString(formData.accusedoccupation),
    };

    console.log("Sanitized Data:", sanitizedData);
    // Here you would typically send the data to your API
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-3xl font-bold text-[#8B322C] mb-6 text-center">Formulir Pengaduan</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Identitas Pelapor Section */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-[#8B322C]">1. Identitas Pelapor</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="reporterfullname"
              value={formData.reporterfullname}
              onChange={handleInputChange}
              placeholder="Nama Lengkap"
              className="w-full p-2 border rounded"
              required
            />
            <div>
              <input
                type="tel"
                name="reporterphonenum"
                value={formData.reporterphonenum}
                onChange={handleInputChange}
                placeholder="Nomor Telepon"
                className="w-full p-2 border rounded"
                required
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
              required
            />
            <select
              name="reporterrelationship"
              value={formData.reporterrelationship}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Hubungan</option>
              {Object.values(Relationships).map(relation => (
                <option key={relation} value={relation}>{relation}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Informasi Pelanggaran Section */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-[#8B322C]">2. Informasi Pelanggaran</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="incidentlocation"
              value={formData.incidentlocation}
              onChange={handleInputChange}
              placeholder="Lokasi"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="datetime-local"
              name="incidenttime"
              value={formData.incidenttime}
              onChange={handleInputChange}
              placeholder="Waktu"
              className="w-full p-2 border rounded"
              required
            />
            <div className="col-span-2">
              <textarea
                name="incidentdescription"
                value={formData.incidentdescription}
                onChange={handleInputChange}
                placeholder="Deskripsi Pelanggaran"
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
              />
              {errors.incidentproof && <p className="text-red-500 text-sm mt-1">{errors.incidentproof}</p>}
            </div>
          </div>
        </div>

        {/* 3. Identitas Korban Section */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-[#8B322C]">3. Identitas Korban</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="victimfullname"
              value={formData.victimfullname}
              onChange={handleInputChange}
              placeholder="Nama Lengkap"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="victimnik"
              value={formData.victimnik}
              onChange={handleInputChange}
              placeholder="NIK"
              className="w-full p-2 border rounded"
              required
            />
            <div>
              <input
                type="email"
                name="victimemail"
                value={formData.victimemail}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
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
              required
            />
            <input
              type="tel"
              name="victimphonenum"
              value={formData.victimphonenum}
              onChange={handleInputChange}
              placeholder="Nomor Telepon"
              className="w-full p-2 border rounded"
              required
            />
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
                required
              />
              {errors.victimdateofbirth && <p className="text-red-500 text-sm mt-1">{errors.victimdateofbirth}</p>}
            </div>
            <input
              type="text"
              name="victimplaceofbirth"
              value={formData.victimplaceofbirth}
              onChange={handleInputChange}
              placeholder="Tempat Lahir"
              className="w-full p-2 border rounded"
              required
            />
            <select
              name="victimeducationlevel"
              value={formData.victimeducationlevel}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
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
              required
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
          <h3 className="text-xl font-semibold mb-4 text-[#8B322C]">4. Identitas Terdakwa</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="accusedfullname"
              value={formData.accusedfullname}
              onChange={handleInputChange}
              placeholder="Nama Lengkap"
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="accusedaddress"
              value={formData.accusedaddress}
              onChange={handleInputChange}
              placeholder="Alamat Domisili"
              className="w-full p-2 border rounded"
              rows={2}
              required
            />
            <input
              type="tel"
              name="accusedphonenum"
              value={formData.accusedphonenum}
              onChange={handleInputChange}
              placeholder="Nomor Telepon"
              className="w-full p-2 border rounded"
              required
            />
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
              required
            >
              <option value="">Pilih Hubungan</option>
              {Object.values(Relationships).map(relation => (
                <option key={relation} value={relation}>{relation}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Level Pengaduan Section */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-[#8B322C]">5. Level Pengaduan</h3>
          <div className="grid grid-cols-1 gap-4">
            <select
              name="authority"
              value={formData.authority}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Level Pengaduan</option>
              {Object.values(Authority).map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#DD5746] text-white px-6 py-3 rounded-xl hover:bg-[#C04737] transition-colors"
        >
          Kirim Laporan
        </button>
      </form>
    </div>
  );
};

export default ReportForm;