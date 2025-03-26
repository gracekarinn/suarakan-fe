"use client";

import React from "react";
import { categories } from "../constant";

export const HomepageSection = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl font-bold text-primary mb-4 text-center">
        Selamat Datang di <span className="text-secondary">SUARAKAN</span>
      </h1>
      <p className="text-gray-600 text-lg mb-10 text-center max-w-2xl">
        Platform pelaporan dan pemantauan kasus pelecehan seksual di lingkungan kampus.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-primary mb-4">{category.name}</h2>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-300"
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
