'use client';
import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#F8F4FC] text-[#1A1A2E]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">
                <span className="text-[#9AC4F8]">SUARA</span>
                <span className="text-[#6A4C93]">KAN</span>
                <span className="text-[#FFCAD4] text-sm ml-1">♥</span>
              </h2>
              <p className="text-[#1A1A2E]/80 text-sm mb-4 leading-relaxed">
                Platform pengaduan yang aman dan terpercaya untuk melaporkan dan melacak kasus pelecehan seksual.
              </p>
              <div className="flex space-x-4">
                <div className="w-9 h-9 flex items-center justify-center bg-[#FFCAD4]/20 rounded-full hover:bg-[#FFCAD4]/40 transition-all cursor-pointer">
                  <svg className="w-4 h-4 text-[#6A4C93]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="w-9 h-9 flex items-center justify-center bg-[#FFCAD4]/20 rounded-full hover:bg-[#FFCAD4]/40 transition-all cursor-pointer">
                  <svg className="w-4 h-4 text-[#6A4C93]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </div>
                <div className="w-9 h-9 flex items-center justify-center bg-[#FFCAD4]/20 rounded-full hover:bg-[#FFCAD4]/40 transition-all cursor-pointer">
                  <svg className="w-4 h-4 text-[#6A4C93]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-[#6A4C93] relative inline-block">
              Tautan Cepat
              <span className="absolute -right-4 -top-1 text-[#FFCAD4] text-sm">♥</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <div className="text-[#1A1A2E]/80 hover:text-[#6A4C93] transition-colors flex items-center group cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#FFCAD4]/60 mr-2 group-hover:bg-[#FFCAD4] transition-colors"></span>
                  Beranda
                </div>
              </li>
              <li>
                <div className="text-[#1A1A2E]/80 hover:text-[#6A4C93] transition-colors flex items-center group cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#FFCAD4]/60 mr-2 group-hover:bg-[#FFCAD4] transition-colors"></span>
                  Pelaporan
                </div>
              </li>
              <li>
                <div className="text-[#1A1A2E]/80 hover:text-[#6A4C93] transition-colors flex items-center group cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#FFCAD4]/60 mr-2 group-hover:bg-[#FFCAD4] transition-colors"></span>
                  Pelacakan
                </div>
              </li>
              <li>
                <div className="text-[#1A1A2E]/80 hover:text-[#6A4C93] transition-colors flex items-center group cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#FFCAD4]/60 mr-2 group-hover:bg-[#FFCAD4] transition-colors"></span>
                  Publikasi
                </div>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-[#6A4C93] relative inline-block">
              Sumber Daya
              <span className="absolute -right-4 -top-1 text-[#FFCAD4] text-sm">♥</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <div className="text-[#1A1A2E]/80 hover:text-[#6A4C93] transition-colors flex items-center group cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#FFCAD4]/60 mr-2 group-hover:bg-[#FFCAD4] transition-colors"></span>
                  Tentang Kami
                </div>
              </li>
              <li>
                <div className="text-[#1A1A2E]/80 hover:text-[#6A4C93] transition-colors flex items-center group cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#FFCAD4]/60 mr-2 group-hover:bg-[#FFCAD4] transition-colors"></span>
                  Pusat Bantuan
                </div>
              </li>
              <li>
                <div className="text-[#1A1A2E]/80 hover:text-[#6A4C93] transition-colors flex items-center group cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#FFCAD4]/60 mr-2 group-hover:bg-[#FFCAD4] transition-colors"></span>
                  FAQ
                </div>
              </li>
              <li>
                <div className="text-[#1A1A2E]/80 hover:text-[#6A4C93] transition-colors flex items-center group cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#FFCAD4]/60 mr-2 group-hover:bg-[#FFCAD4] transition-colors"></span>
                  Hubungi Kami
                </div>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-[#6A4C93] relative inline-block">
              Kontak
              <span className="absolute -right-4 -top-1 text-[#FFCAD4] text-sm">♥</span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#FFCAD4]/20 rounded-full mt-0.5 text-[#6A4C93] group-hover:bg-[#FFCAD4]/40 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="ml-3 text-[#1A1A2E]/80 text-sm leading-relaxed">
                  Jl. Margonda Raya No.100, Depok
                </span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#FFCAD4]/20 rounded-full mt-0.5 text-[#6A4C93] group-hover:bg-[#FFCAD4]/40 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="ml-3 text-[#1A1A2E]/80 text-sm">
                  contact@suarakan.id
                </span>
              </li>
              <li className="flex items-start group">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#FFCAD4]/20 rounded-full mt-0.5 text-[#6A4C93] group-hover:bg-[#FFCAD4]/40 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="ml-3 text-[#1A1A2E]/80 text-sm">
                  +62 812 3456 7890
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#FFCAD4]/20 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-[#1A1A2E]/60 text-sm">
            <div className="mb-4 md:mb-0">
              &copy; {currentYear} SUARAKAN. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <div className="hover:text-[#6A4C93] transition-colors cursor-pointer">
                Syarat Layanan
              </div>
              <div className="hover:text-[#6A4C93] transition-colors cursor-pointer">
                Kebijakan Privasi
              </div>
              <div className="hover:text-[#6A4C93] transition-colors cursor-pointer">
                Kebijakan Cookie
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#FFCAD4]/10 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[#1A1A2E]/60 text-xs">
          <p>SUARAKAN adalah platform yang didedikasikan untuk memberdayakan suara dan menciptakan ruang yang lebih aman.</p>
          <div className="mt-2 md:mt-0 flex items-center">
            Dirancang dengan 
            <span className="mx-1">
              <svg className="w-3 h-3 text-[#6A4C93]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            untuk masa depan yang lebih baik
          </div>
        </div>
      </div>
    </footer>
  );
};