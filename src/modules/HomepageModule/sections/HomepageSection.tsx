"use client";

import React from "react";
import { categories } from "../constant";

export const HomepageSection = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      <div className="max-w-4xl text-center space-y-6 mb-12">
        <h1 className="text-5xl font-extrabold text-[#8B322C] mb-4">
          Selamat Datang di{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#DD5746] to-[#FFC470]">
            SUARAKAN
          </span>
        </h1>
        <p className="text-lg text-[#4793AF] opacity-90 leading-relaxed max-w-3xl mx-auto">
          Platform pelaporan dan pemantauan kasus pelecehan seksual di lingkungan kampus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="group relative bg-white shadow-xl hover:shadow-2xl rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
          >

            <div className={`absolute inset-0 bg-gradient-to-br ${
              index % 3 === 0 
                ? "from-[#4793AF] to-[#FFC470]" 
                : index % 3 === 1 
                ? "from-[#FFC470] to-[#DD5746]" 
                : "from-[#DD5746] to-[#8B322C]"
            } opacity-20 z-0`} />
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-[#8B322C] mb-4">
                {category.name}
              </h2>
              <div className="flex flex-wrap gap-3">
                {category.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    className="bg-[#DD5746] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#8B322C] transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="absolute top-0 left-0 w-72 h-72 bg-[#FFC470]/10 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#4793AF]/10 rounded-full blur-3xl -z-0" />
    </div>
  );
};