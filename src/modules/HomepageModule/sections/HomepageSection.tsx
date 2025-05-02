'use client';
import Image from "next/image";
import React from "react";
import { homepageContent } from "../constant";

const HomepageSection: React.FC = () => {
  const { heroSection, whySuarakanSection } = homepageContent;

  return (
    <div>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center md:space-x-8 px-4 py-10">
        {/* Ilustrasi Hero */}
        <div className="order-1 md:order-2 relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden flex-shrink-0 border-8 border-[#FFF3E0] shadow-xl">
          <Image
            src={heroSection.image}
            alt="Ilustrasi pelecehan"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Teks Hero */}
        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#B73239] mb-4 leading-snug">
            {heroSection.title}
          </h1>
          <p className="text-base md:text-lg mb-6">
            {heroSection.subtitle}
          </p>
          <button className="bg-[#FECF4C] text-white font-semibold py-2 px-6 rounded hover:bg-[#E65A30] transition-colors">
            {heroSection.buttonText}
          </button>
        </div>
      </section>

      {/* Section Mengapa SUARAKAN? */}
      <section className="mt-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#B73239] mb-4">
          {whySuarakanSection.heading}
        </h2>
        <p className="text-base md:text-lg max-w-2xl mb-8">
          {whySuarakanSection.description}
        </p>

        {/* Grid Card Feature */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {whySuarakanSection.features.map((feature, index) => (
            <div key={index} className="bg-[#FFF8F5] rounded-lg p-6 shadow">
              <h3 className="text-[#B73239] text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomepageSection;
