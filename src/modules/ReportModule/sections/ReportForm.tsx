"use client";

import React, { useState } from 'react';
import { ReportFormState, RelationshipType, ReportingLevel, StatusPernikahan } from '../interface';
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
    reporterPhone: '',
    reporterJob: '',
    reporterDateOfBirth: '',
    reporterAddress: '',
    reporterRelationship: RelationshipType.Friend,

    violationLocation: '',
    violationTime: '',
    violationDescription: '',
    victimNeeds: [],
    pastEffort: '',
    evidenceLink: '',

    victimFullName: '',
    victimNIK: '',
    victimEmail: '',
    victimDomicileAddress: '',
    victimPhone: '',
    victimJob: '',
    victimGender: 'laki-laki',
    victimDateOfBirth: '',
    victimPlaceOfBirth: '',
    victimOfficialAddress: '',
    victimEducation: '',
    victimFaxNumber: '',
    victimMarriageStatus: StatusPernikahan.BelumKawin,
    victimMarriageAge: '',
    victimSpecialNeeds: false,
    victimDisabilityDescription: '',

    suspectFullName: '',
    suspectEmail: '',
    suspectDomicileAddress: '',
    suspectPhone: '',
    suspectJob: '',
    suspectGender: 'laki-laki',
    suspectDateOfBirth: '',
    suspectPlaceOfBirth: '',
    suspectEducation: '',
    suspectRelationship: RelationshipType.Friend,

    reportingLevel: ReportingLevel.UniversitasIndonesia
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
    } else if (name === 'victimNeeds') {
      setFormData(prev => ({
        ...prev,
        victimNeeds: value.split(',').map(need => need.trim())
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

    if (!validatePhone(formData.reporterPhone)) {
      newErrors.reporterPhone = "Nomor telepon tidak valid. Harus terdiri dari 10-15 digit, dengan opsi '+' di awal.";
    }
    if (!validateDate(formData.reporterDateOfBirth)) {
      newErrors.reporterDateOfBirth = "Tanggal lahir tidak valid.";
    }
    if (!validateDescription(formData.violationDescription)) {
      newErrors.violationDescription = "Deskripsi pelanggaran harus minimal 10 karakter.";
    }
    if (!validateEmail(formData.victimEmail)) {
      newErrors.victimEmail = "Email korban tidak valid.";
    }
    if (formData.evidenceLink && !validateUrl(formData.evidenceLink)) {
      newErrors.evidenceLink = "Link bukti tidak valid.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const sanitizedData: ReportFormState = {
      ...formData,
      reporterPhone: sanitizeString(formData.reporterPhone),
      reporterJob: sanitizeString(formData.reporterJob),
      reporterAddress: sanitizeString(formData.reporterAddress),
      violationLocation: sanitizeString(formData.violationLocation),
      violationDescription: sanitizeString(formData.violationDescription),
      pastEffort: sanitizeString(formData.pastEffort),
      evidenceLink: sanitizeString(formData.evidenceLink),
      victimFullName: sanitizeName(formData.victimFullName),
      victimNIK: sanitizeString(formData.victimNIK),
      victimEmail: formData.victimEmail.trim(),
      victimDomicileAddress: sanitizeString(formData.victimDomicileAddress),
      victimPhone: sanitizeString(formData.victimPhone),
      victimJob: sanitizeString(formData.victimJob),
      victimPlaceOfBirth: sanitizeString(formData.victimPlaceOfBirth),
      victimOfficialAddress: sanitizeString(formData.victimOfficialAddress),
      victimEducation: sanitizeString(formData.victimEducation),
      victimFaxNumber: sanitizeString(formData.victimFaxNumber),
      victimMarriageAge: sanitizeString(formData.victimMarriageAge),
      victimDisabilityDescription: sanitizeString(formData.victimDisabilityDescription),
      suspectFullName: sanitizeName(formData.suspectFullName),
      suspectEmail: formData.suspectEmail.trim(),
      suspectDomicileAddress: sanitizeString(formData.suspectDomicileAddress),
      suspectPhone: sanitizeString(formData.suspectPhone),
      suspectJob: sanitizeString(formData.suspectJob),
      suspectPlaceOfBirth: sanitizeString(formData.suspectPlaceOfBirth),
      suspectEducation: sanitizeString(formData.suspectEducation)
    };

    console.log("Sanitized Data:", sanitizedData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-3xl font-bold text-[#8B322C] mb-6 text-center">Formulir Pengaduan</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Identitas Pelapor Section */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-[#8B322C]">1. Identitas Pelapor</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="tel"
                name="reporterPhone"
                value={formData.reporterPhone}
                onChange={handleInputChange}
                placeholder="Nomor Telepon"
                className="w-full p-2 border rounded"
                required
              />
              {errors.reporterPhone && <p className="text-red-500 text-sm mt-1">{errors.reporterPhone}</p>}
            </div>
            <input
              type="text"
              name="reporterJob"
              value={formData.reporterJob}
              onChange={handleInputChange}
              placeholder="Pekerjaan"
              className="w-full p-2 border rounded"
              required
            />
            <div>
              <input
                type="date"
                name="reporterDateOfBirth"
                value={formData.reporterDateOfBirth}
                onChange={handleInputChange}
                placeholder="Tanggal Lahir"
                className="w-full p-2 border rounded"
                required
              />
              {errors.reporterDateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.reporterDateOfBirth}</p>}
            </div>
            <textarea
              name="reporterAddress"
              value={formData.reporterAddress}
              onChange={handleInputChange}
              placeholder="Alamat"
              className="w-full p-2 border rounded col-span-2"
              rows={3}
              required
            />
            <select
              name="reporterRelationship"
              value={formData.reporterRelationship}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Hubungan</option>
              {Object.values(RelationshipType).map(relation => (
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
              name="violationLocation"
              value={formData.violationLocation}
              onChange={handleInputChange}
              placeholder="Lokasi"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="datetime-local"
              name="violationTime"
              value={formData.violationTime}
              onChange={handleInputChange}
              placeholder="Waktu"
              className="w-full p-2 border rounded"
              required
            />
            <div className="col-span-2">
              <textarea
                name="violationDescription"
                value={formData.violationDescription}
                onChange={handleInputChange}
                placeholder="Deskripsi Pelanggaran"
                className="w-full p-2 border rounded"
                rows={4}
                required
              />
              {errors.violationDescription && <p className="text-red-500 text-sm mt-1">{errors.violationDescription}</p>}
            </div>
            <input
              type="text"
              name="victimNeeds"
              value={formData.victimNeeds.join(', ')}
              onChange={handleInputChange}
              placeholder="Kebutuhan Korban (pisahkan dengan koma)"
              className="w-full p-2 border rounded col-span-2"
            />
            <textarea
              name="pastEffort"
              value={formData.pastEffort}
              onChange={handleInputChange}
              placeholder="Upaya yang Telah Dilakukan"
              className="w-full p-2 border rounded col-span-2"
              rows={3}
            />
            <div className="col-span-2">
              <input
                type="url"
                name="evidenceLink"
                value={formData.evidenceLink}
                onChange={handleInputChange}
                placeholder="Link Bukti"
                className="w-full p-2 border rounded"
              />
              {errors.evidenceLink && <p className="text-red-500 text-sm mt-1">{errors.evidenceLink}</p>}
            </div>
          </div>
        </div>

        {/* 3. Identitas Korban Section */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-[#8B322C]">3. Identitas Korban</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="victimFullName"
              value={formData.victimFullName}
              onChange={handleInputChange}
              placeholder="Nama Lengkap"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="victimNIK"
              value={formData.victimNIK}
              onChange={handleInputChange}
              placeholder="NIK"
              className="w-full p-2 border rounded"
              required
            />
            <div>
              <input
                type="email"
                name="victimEmail"
                value={formData.victimEmail}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
              />
              {/* Jika perlu validasi email, bisa tambahkan error field */}
            </div>
            <textarea
              name="victimDomicileAddress"
              value={formData.victimDomicileAddress}
              onChange={handleInputChange}
              placeholder="Alamat Domisili"
              className="w-full p-2 border rounded"
              rows={2}
              required
            />
            <input
              type="tel"
              name="victimPhone"
              value={formData.victimPhone}
              onChange={handleInputChange}
              placeholder="Nomor Telepon"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="victimJob"
              value={formData.victimJob}
              onChange={handleInputChange}
              placeholder="Pekerjaan"
              className="w-full p-2 border rounded"
            />
            <select
              name="victimGender"
              value={formData.victimGender}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="laki-laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>
            <input
              type="date"
              name="victimDateOfBirth"
              value={formData.victimDateOfBirth}
              onChange={handleInputChange}
              placeholder="Tanggal Lahir"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="victimPlaceOfBirth"
              value={formData.victimPlaceOfBirth}
              onChange={handleInputChange}
              placeholder="Tempat Lahir"
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="victimOfficialAddress"
              value={formData.victimOfficialAddress}
              onChange={handleInputChange}
              placeholder="Alamat Resmi"
              className="w-full p-2 border rounded"
              rows={2}
            />
            <input
              type="text"
              name="victimEducation"
              value={formData.victimEducation}
              onChange={handleInputChange}
              placeholder="Pendidikan"
              className="w-full p-2 border rounded"
            />
            <input
              type="tel"
              name="victimFaxNumber"
              value={formData.victimFaxNumber}
              onChange={handleInputChange}
              placeholder="Nomor Fax"
              className="w-full p-2 border rounded"
            />
            <select
              name="victimMarriageStatus"
              value={formData.victimMarriageStatus}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Status</option>
              {Object.values(StatusPernikahan).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <input
              type="text"
              name="victimMarriageAge"
              value={formData.victimMarriageAge}
              onChange={handleInputChange}
              placeholder="Usia Pernikahan"
              className="w-full p-2 border rounded"
            />
            <div className="col-span-2 flex items-center">
              <input
                type="checkbox"
                name="victimSpecialNeeds"
                checked={formData.victimSpecialNeeds}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label>Berkebutuhan Khusus</label>
            </div>
            {formData.victimSpecialNeeds && (
              <textarea
                name="victimDisabilityDescription"
                value={formData.victimDisabilityDescription}
                onChange={handleInputChange}
                placeholder="Deskripsi Disabilitas"
                className="w-full p-2 border rounded col-span-2"
                rows={2}
              />
            )}
          </div>
        </div>

        {/* 4. Identitas Terdakwa Section */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-[#8B322C]">4. Identitas Terdakwa</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="suspectFullName"
              value={formData.suspectFullName}
              onChange={handleInputChange}
              placeholder="Nama Lengkap"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              name="suspectEmail"
              value={formData.suspectEmail}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="suspectDomicileAddress"
              value={formData.suspectDomicileAddress}
              onChange={handleInputChange}
              placeholder="Alamat Domisili"
              className="w-full p-2 border rounded col-span-2"
              rows={2}
              required
            />
            <input
              type="tel"
              name="suspectPhone"
              value={formData.suspectPhone}
              onChange={handleInputChange}
              placeholder="Nomor Telepon"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="suspectJob"
              value={formData.suspectJob}
              onChange={handleInputChange}
              placeholder="Pekerjaan"
              className="w-full p-2 border rounded"
            />
            <select
              name="suspectGender"
              value={formData.suspectGender}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="laki-laki">Laki-laki</option>
              <option value="perempuan">Perempuan</option>
            </select>
            <input
              type="date"
              name="suspectDateOfBirth"
              value={formData.suspectDateOfBirth}
              onChange={handleInputChange}
              placeholder="Tanggal Lahir"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="suspectPlaceOfBirth"
              value={formData.suspectPlaceOfBirth}
              onChange={handleInputChange}
              placeholder="Tempat Lahir"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="suspectEducation"
              value={formData.suspectEducation}
              onChange={handleInputChange}
              placeholder="Pendidikan"
              className="w-full p-2 border rounded"
            />
            <select
              name="suspectRelationship"
              value={formData.suspectRelationship}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Hubungan</option>
              {Object.values(RelationshipType).map(relation => (
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
              name="reportingLevel"
              value={formData.reportingLevel}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Level Pengaduan</option>
              {Object.values(ReportingLevel).map(level => (
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