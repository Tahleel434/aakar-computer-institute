import React, { useState, useEffect } from 'react';
import { Award, Maximize2, X } from 'lucide-react';

export const TopSignboardBanner: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <>
      {/* Official Signboard Banner Header at the very top of the website */}
      <div className="relative bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 border-b-2 border-amber-500 text-slate-900 shadow-md w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">
            
            {/* Left Credentials from Signboard */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold text-slate-900 flex-wrap justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded shadow-sm tracking-wide uppercase">
                <Award className="w-3.5 h-3.5" />
                Govt Recognised
              </span>
              <span className="hidden sm:inline text-slate-700 font-bold">•</span>
              <span className="text-[11px] sm:text-xs font-extrabold text-slate-900">
                Skill India & NSDC Partner
              </span>
              <span className="hidden sm:inline text-slate-700 font-bold">•</span>
              <span className="bg-[#24205f] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                MS-CIT Authorized Center
              </span>
            </div>

            {/* Center / Right Signboard Image Teaser with click-to-enlarge */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex items-center gap-2 bg-slate-950 hover:bg-black active:bg-slate-900 text-amber-300 font-bold text-xs px-3.5 py-2 rounded-lg border border-amber-300/50 shadow-sm transition-all hover:scale-102 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                title="View Official Aakar Storefront Signboard"
                aria-haspopup="dialog"
              >
                <div className="w-4 h-4 rounded-sm overflow-hidden bg-amber-400 shrink-0">
                  <img
                    src="/images/aakar_signboard_banner.jpg"
                    alt="Aakar Signboard Thumbnail"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span>View Official Signboard</span>
                <Maximize2 className="w-3.5 h-3.5 text-amber-400 group-hover:text-white transition-colors" />
              </button>

              <span className="text-[11px] font-extrabold text-red-700 bg-white/80 px-2.5 py-1 rounded hidden lg:inline-block border border-red-200 shadow-xs">
                100% Practical Training & Job Assistance
              </span>
            </div>

          </div>
        </div>

        {/* Visual ribbon of popular courses featured on the official yellow board with horizontal scroll safety */}
        <div className="bg-[#1f1d4f] text-white py-1.5 px-3 overflow-x-auto text-[10px] sm:text-[11px] font-bold tracking-wide flex items-center justify-start sm:justify-center gap-2 sm:gap-3 border-t border-amber-300/30 w-full no-scrollbar">
          <span className="text-amber-300 font-extrabold uppercase shrink-0 pl-1">Featured Courses:</span>
          <span className="bg-pink-600 px-2.5 py-0.5 rounded text-white whitespace-nowrap shadow-xs">TALLY + GST</span>
          <span className="bg-indigo-600 px-2.5 py-0.5 rounded text-white whitespace-nowrap shadow-xs">COMPUTER TYPING</span>
          <span className="bg-red-600 px-2.5 py-0.5 rounded text-white whitespace-nowrap shadow-xs">ADVANCE EXCEL</span>
          <span className="bg-blue-600 px-2.5 py-0.5 rounded text-white whitespace-nowrap shadow-xs">DIGITAL GRAPHICS</span>
          <span className="bg-emerald-600 px-2.5 py-0.5 rounded text-white whitespace-nowrap shadow-xs">WEB DESIGNING</span>
          <span className="bg-amber-600 px-2.5 py-0.5 rounded text-white whitespace-nowrap shadow-xs pr-1">AUTOCAD & 3DS MAX</span>
        </div>
      </div>

      {/* Full Resolution Signboard Photo Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Official Aakar Signboard"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-slate-900 border border-amber-400/40 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-5 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between text-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
                  ▲
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg leading-tight uppercase tracking-tight">
                    Aakar Computer Institute Official Signboard
                  </h3>
                  <p className="text-xs font-semibold text-slate-800">
                    S.K.P School Campus, Mother Dairy Road, Nehru Nagar, Kurla East, Mumbai
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-slate-900 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 shrink-0"
                aria-label="Close signboard modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="p-4 sm:p-6 overflow-y-auto bg-slate-950 flex flex-col items-center justify-center space-y-4">
              <div className="w-full rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-slate-900">
                <img
                  src="/images/aakar_contact_banner.png"
                  alt="Aakar Computer & Healthcare Institute Official Admissions and Contact Banner"
                  className="w-full h-auto object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('ChatGPT')) {
                      target.src = '/images/ChatGPT Image Sep 18, 2026, 09_43_02 PM.png';
                    }
                  }}
                />
              </div>

              <div className="w-full rounded-2xl overflow-hidden border border-amber-400/40 shadow-xl bg-amber-400">
                <img
                  src="/images/aakar_signboard_banner.jpg"
                  alt="Aakar Computer Institute Signboard Full View"
                  className="w-full h-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Signboard Details Grid */}
              <div className="mt-5 w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-slate-200">
                  <span className="block font-bold text-amber-300 mb-1">Accreditations</span>
                  Government Recognised • Skill India • NSDC
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-slate-200">
                  <span className="block font-bold text-amber-300 mb-1">Center Brand Tagline</span>
                  "Shape Your Career" • 100% Practical Training
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-slate-200">
                  <span className="block font-bold text-amber-300 mb-1">Flagship Program</span>
                  नवीन MS-CIT आंतरराष्ट्रीय दर्जाचा परिपूर्ण कंप्यूटर कोर्स
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Aakar Computer Institute — Established in Kurla East</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition cursor-pointer min-h-[38px]"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
