import React, { useState, useEffect } from 'react';
import { ArrowRight, Star, Sparkles, MapPin, Maximize2, X, CheckCircle2, Clock, Award, PhoneCall, ChevronDown } from 'lucide-react';
import { AakarLogo } from './AakarLogo';

interface HeroProps {
  onOpenDemoModal: () => void;
  onOpenReviews: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemoModal, onOpenReviews }) => {
  const [isStorefrontModalOpen, setIsStorefrontModalOpen] = useState(false);

  // Close lightbox modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsStorefrontModalOpen(false);
      }
    };
    if (isStorefrontModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isStorefrontModalOpen]);

  return (
    <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Call To Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Open Today Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Open today from 7 am</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-md">
              Learn the skills.<br />
              <span className="text-blue-400">Transform</span> your<br />
              career.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-200 max-w-xl leading-relaxed font-normal">
              Master industry-demanded computer skills at Kurla's trusted training institute — practical,
              career-focused education across programming, design, marketing and more.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#courses"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all shadow-lg shadow-blue-600/30 active:scale-95 group border border-blue-400/40"
                id="hero-explore-courses-btn"
              >
                <span>Explore courses</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={onOpenDemoModal}
                className="inline-flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full border border-slate-700 hover:border-slate-500 transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-md"
                id="hero-book-demo-btn"
              >
                Book a free demo
              </button>
            </div>

            {/* Social Proof Review Rating Bar */}
            <div className="pt-4 flex items-center gap-4 flex-wrap">
              {/* Overlapping avatar circles */}
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-800 bg-blue-900 text-blue-200 font-bold text-xs flex items-center justify-center">
                  R
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-800 bg-amber-900 text-amber-200 font-bold text-xs flex items-center justify-center">
                  A
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-800 bg-emerald-900 text-emerald-200 font-bold text-xs flex items-center justify-center">
                  M
                </div>
              </div>

              {/* 5 Stars */}
              <div className="flex items-center text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Rating text */}
              <button
                onClick={onOpenReviews}
                className="text-sm text-slate-200 hover:text-blue-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
              >
                <span className="font-bold text-white">4.5</span>
                <span>294 Google reviews in Kurla East, Mumbai</span>
              </button>
            </div>
          </div>

          {/* Right Column: Translucent Feature Hub (Static images replaced by background video animation) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900/40 backdrop-blur-md p-6 sm:p-7">
              {/* Center Status & Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
                <div className="inline-flex items-center gap-1.5 bg-blue-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-blue-400/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
                  <span>Official Kurla East Center</span>
                </div>
                <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full border border-amber-400/30">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Batches: 7 AM – 9 PM</span>
                </div>
              </div>

              {/* Institute Name & Location */}
              <div className="space-y-1 mb-5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
                  Aakar Computer Institute
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>S.K.P School Campus, Mother Dairy Road, Nehru Nagar, Kurla East</span>
                </div>
              </div>

              {/* 4 Core Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">1-on-1 Dedicated PC</div>
                    <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">Personal workstation for each learner</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Govt & MKCL Certified</div>
                    <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">Recognized course completion certificates</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">100% Practical Training</div>
                    <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">Real project work with mentor support</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <PhoneCall className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Admissions Helpline</div>
                    <div className="text-[11px] text-blue-300 font-semibold mt-0.5 leading-snug">098210 85899 (Direct Call)</div>
                  </div>
                </div>
              </div>

              {/* Scroll Zoom Guidance Indicator */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/70 to-slate-950/80 border border-blue-500/30 flex items-center justify-between gap-3 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                  <span className="text-blue-300 font-medium">Scroll down to zoom from space into our Kurla campus</span>
                </div>
                <ChevronDown className="w-4 h-4 text-blue-400 animate-bounce shrink-0" />
              </div>
            </div>

            {/* Overlapping Blue Banner (Why Students Choose Aakar) */}
            <div className="mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-2xl border border-blue-400/30 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-blue-100 text-xs font-bold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Why students choose Aakar</span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-1.5 leading-tight">
                  100% Hands-on Practical Training
                </h3>
              </div>
              <AakarLogo className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 hidden sm:inline-flex drop-shadow-xl" />
            </div>

          </div>

        </div>
      </div>

      {/* Lightbox Modal for Storefront & Signboard Photo */}
      {isStorefrontModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Aakar Storefront & Signboard Gallery"
          onClick={() => setIsStorefrontModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-400/40 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">▲</span>
                <div>
                  <h4 className="font-extrabold text-base sm:text-lg text-slate-950 leading-tight uppercase">AAKAR COMPUTER INSTITUTE</h4>
                  <p className="text-xs text-slate-800 font-semibold">S.K.P School Campus, Mother Dairy Road, Nehru Nagar, Kurla East, Mumbai</p>
                </div>
              </div>
              <button
                onClick={() => setIsStorefrontModalOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-black/20 text-slate-900 flex items-center justify-center transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-center space-y-4 overflow-y-auto">
              <div className="w-full rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl bg-slate-900">
                <img
                  src="/images/aakar_contact_banner.png"
                  alt="Aakar Computer & Healthcare Institute Admissions and Contact Banner"
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
              <div className="w-full rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
                <img
                  src="/images/aakar_institute_front.jpg"
                  alt="Aakar Institute Exterior Facade"
                  className="w-full max-h-[35vh] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Kurla East, Mumbai Campus</span>
              <button
                onClick={() => setIsStorefrontModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition cursor-pointer min-h-[40px]"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
