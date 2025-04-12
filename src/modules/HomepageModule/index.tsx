// modules/homepagemodules/sections/index.tsx

import React from "react";
import Image from "next/image";
import { homepageContent } from "./constant"; // Pastikan path dan ekspor sudah benar

/**
 * Komponen utama HomepageSections
 * Menampilkan Hero dan section "Mengapa SUARAKAN?"
 */
const HomepageSections: React.FC = () => {
  const { heroSection, whySuarakanSection } = homepageContent;

  return (
    <div>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center md:space-x-8 px-4 py-10">
        {/* Ilustrasi */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0 flex justify-center md:justify-start">
          <Image
            src={heroSection.image}
            alt="Ilustrasi pelecehan"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>

        {/* Teks Hero */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#B73239] mb-4 leading-snug">
            {heroSection.title}
          </h1>
          <p className="text-base md:text-lg mb-6">{heroSection.subtitle}</p>
          <button className="bg-[#FECF4C] text-white font-semibold py-2 px-6 rounded hover:bg-[#E65A30] transition-colors">
            {heroSection.buttonText}
          </button>
        </div>
      </section>

      {/* Section: Mengapa SUARAKAN? */}
      <section className="mt-16 px-4">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Kolom kiri: Teks judul dan deskripsi */}
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#B73239] mb-4">
              {whySuarakanSection.heading}
            </h2>
            <p className="text-base md:text-lg text-[#2D3748] mb-8">
              {whySuarakanSection.description}
            </p>
          </div>

          {/* Kolom kanan: Grid 4 box fitur (2 kolom x 2 baris) */}
          <div className="md:w-1/2 grid grid-cols-2 gap-6">
            {whySuarakanSection.features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#FFF8F5] rounded-xl p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <h3 className="text-[#B73239] text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#2D3748]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomepageSections;
