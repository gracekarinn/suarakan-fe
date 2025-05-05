'use client';
import Image from "next/image";
import React from "react";
import { homepageContent } from "../constant";

const HomepageSection: React.FC = () => {
  const { heroSection, whySuarakanSection } = homepageContent;

  const getIconForIndex = (index: number) => {
    const icons = [
      <svg key="shield" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>,
      
      <svg key="eye" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 9v0"></path>
        <path d="M12 15v0"></path>
        <path d="M15 12h0"></path>
        <path d="M9 12h0"></path>
      </svg>,
      
      <svg key="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>,
      
      <svg key="heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ];
    
    return icons[index % icons.length];
  };

  return (
    <div className="bg-[#F8F4FC]">
      <section className="relative overflow-hidden py-20 px-4 md:px-8">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#6A4C93]/10 to-[#9AC4F8]/15">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-[#FFCAD4]/10"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-[#9AC4F8]/10"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-[#6A4C93]/10"></div>
        </div>
        
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 z-10">
              <div className="flex items-center mb-3">
                <span className="inline-block w-3 h-3 rounded-full bg-[#FFCAD4] mr-2"></span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#9AC4F8] mr-2"></span>
                <span className="inline-block w-1 h-1 rounded-full bg-[#6A4C93]"></span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-[#6A4C93] mb-6 leading-tight">
                {heroSection.title}
                <span className="inline-block ml-2 text-[#FFCAD4] text-2xl">♥</span>
              </h1>
              
              <p className="text-[#1A1A2E] text-lg mb-8 max-w-xl leading-relaxed">
                {heroSection.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="group bg-[#6A4C93] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#6A4C93]/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden">
                  <span className="relative z-10">{heroSection.buttonText}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
                
                <button className="group bg-transparent border-2 border-[#9AC4F8] text-[#6A4C93] font-medium py-3 px-8 rounded-lg hover:bg-[#9AC4F8]/10 transition-all relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Pelajari Lebih Lanjut
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            
            <div className="relative w-full md:w-2/5 aspect-square max-w-md">
              {/* Decorative elements around the image */}
              <div className="absolute -top-6 -left-6 w-full h-full rounded-2xl bg-[#FFCAD4]/20 transform rotate-3"></div>
              
              <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                <Image
                  src={heroSection.image}
                  alt="Illustration"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 border-8 border-white/30 rounded-xl pointer-events-none"></div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#9AC4F8]/20 rounded-full"></div>
              <div className="absolute -top-8 -right-2 w-12 h-12 bg-[#FFCAD4]/20 rounded-full"></div>
              <div className="absolute bottom-10 -left-6 w-8 h-8 bg-[#6A4C93]/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-16 bg-[#F8F4FC] rounded-b-[50%] opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#FFCAD4]/10 rounded-full -mb-10 -mr-10"></div>
        <div className="absolute top-1/3 left-10 w-20 h-20 bg-[#9AC4F8]/10 rounded-full"></div>
        
        <div className="container mx-auto">
          <div className="flex flex-col items-center mb-16 relative">
            <div className="flex mb-4 justify-center">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FFCAD4] mx-1"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#9AC4F8] mx-1"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#6A4C93] mx-1"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#FFCAD4] mx-1"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#9AC4F8] mx-1"></span>
            </div>
            
            <span className="text-[#FFCAD4] text-sm font-semibold uppercase tracking-wider mb-2 border-[#FFCAD4]/30 border px-4 py-1 rounded-full">Keunggulan Kami</span>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#6A4C93] mb-4 text-center relative">
              {whySuarakanSection.heading}
              <div className="absolute -right-8 top-0 flex items-center opacity-70">
                <span className="text-[#FFCAD4] text-xl">♥</span>
              </div>
            </h2>
            
            <div className="w-24 h-1 bg-[#9AC4F8] mb-6 relative rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-[#FFCAD4]"></div>
            </div>
            
            <p className="text-[#1A1A2E] text-lg max-w-2xl text-center">
              {whySuarakanSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whySuarakanSection.features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-[#F8F4FC] rounded-xl p-6 shadow-md hover:shadow-lg transition-all border-b-4 border-transparent hover:border-[#9AC4F8] group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-[#FFCAD4]/10 rounded-bl-xl transform rotate-6 group-hover:rotate-0 transition-transform duration-300"></div>
                
                <div className="w-14 h-14 rounded-full bg-[#FFCAD4]/20 flex items-center justify-center mb-4 group-hover:bg-[#FFCAD4]/40 transition-all relative">
                  <div className="absolute inset-0 rounded-full border-2 border-[#FFCAD4]/30 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500"></div>
                  <div className="w-7 h-7 text-[#6A4C93]">
                    {getIconForIndex(index)}
                  </div>
                </div>
                
                <h3 className="text-[#1A1A2E] text-xl font-semibold mb-3 group-hover:text-[#6A4C93] transition-colors flex items-center">
                  {feature.title}
                  <span className="w-2 h-2 rounded-full bg-[#FFCAD4] ml-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </h3>
                
                <p className="text-[#1A1A2E]/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-[#6A4C93] to-[#9AC4F8] rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute top-4 left-8 opacity-20">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="white"/>
              </svg>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="md:w-2/3">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center">
                  Siap untuk menyuarakan pengalaman Anda?
                  <span className="ml-2 text-[#FFCAD4] text-2xl hidden md:inline-block">♥</span>
                </h2>
                <p className="text-white/90 text-lg max-w-xl leading-relaxed">
                  Bergabunglah bersama ribuan orang lain yang membuat perubahan. Pengalaman Anda berharga.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button className="group bg-white text-[#6A4C93] font-medium py-3 px-8 rounded-lg hover:bg-[#FFCAD4]/20 transition-all shadow-lg transform hover:-translate-y-1 relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Laporkan Sekarang
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <span className="absolute inset-0 bg-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#FFCAD4]/40 transition-colors duration-300"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomepageSection;