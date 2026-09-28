import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Shield } from 'lucide-react';
import { AakarLogo } from './AakarLogo';

interface NavbarProps {
  onOpenCallModal: () => void;
  onOpenReviews: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCallModal, onOpenReviews, onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setIsScrolled(scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 text-white ${
      isScrolled
        ? 'bg-slate-950/85 backdrop-blur-xl border-b border-white/10 shadow-2xl'
        : 'bg-slate-950/40 backdrop-blur-md border-b border-white/5 shadow-lg'
    }`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
        isScrolled ? 'h-16 sm:h-18' : 'h-22 sm:h-26'
      }`}>
        {/* Official Aakar Circular Emblem Logo & Front-Page Brand Lockup with Scroll Animation */}
        <a href="#" className="flex items-center gap-3 group" aria-label="Aakar Computer Institute Kurla East">
          <AakarLogo className={`group-hover:scale-105 transition-all duration-300 shrink-0 ${
            isScrolled
              ? 'w-11 h-11 sm:w-13 sm:h-13'
              : 'w-15 h-15 sm:w-18 sm:h-18 lg:w-20 lg:h-20 drop-shadow-2xl'
          }`} />
          <div className="flex flex-col transition-all duration-300">
            <span className="font-extrabold tracking-tight leading-none flex items-center gap-1.5 drop-shadow">
              <span className={`text-red-500 font-black lowercase tracking-tighter transition-all duration-300 ${
                isScrolled ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl lg:text-4xl drop-shadow-md'
              }`}>
                aakar
              </span>
              <span className={`bg-[#211e55] text-white font-black uppercase rounded tracking-wider shadow-sm transition-all duration-300 ${
                isScrolled
                  ? 'text-[10px] sm:text-xs px-2 py-0.5 border border-amber-400/40'
                  : 'text-xs sm:text-sm font-black px-2.5 sm:px-3 py-1 rounded-md border border-amber-400/60 shadow-md'
              }`}>
                Computer Institute
              </span>
            </span>
            <span className={`text-amber-300 font-serif italic tracking-wide flex items-center gap-1.5 mt-0.5 transition-all duration-300 ${
              isScrolled ? 'text-xs' : 'text-xs sm:text-sm font-medium'
            }`}>
              <span>"Shape Your Career"</span>
              <span className={`text-white not-italic font-sans font-extrabold uppercase bg-red-600 rounded shadow-sm transition-all duration-300 ${
                isScrolled ? 'text-[9px] px-1.5 py-0.2' : 'text-[10px] sm:text-xs px-2 py-0.5 tracking-wide'
              }`}>
                Govt Recognised
              </span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-200">
          <a href="#about" className="hover:text-white transition-colors">
            About
          </a>
          <a href="#courses" className="hover:text-white transition-colors">
            Courses
          </a>
          <button
            onClick={onOpenReviews}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Reviews
          </button>
          <a href="#location" className="hover:text-white transition-colors">
            Location
          </a>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Call Now Button */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="tel:09821085899"
            onClick={onOpenCallModal}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-md shadow-blue-600/30 hover:shadow-lg active:scale-95 border border-blue-400/40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            id="nav-call-btn"
            aria-label="Call Aakar Computer Institute at 098210 85899"
          >
            <Phone className="w-4 h-4 fill-white text-white" />
            <span>Call now</span>
          </a>
        </div>

        {/* Mobile menu and call buttons with 44px+ accessible touch target */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="tel:09821085899"
            onClick={onOpenCallModal}
            className="w-11 h-11 rounded-full bg-blue-600 active:bg-blue-700 text-white hover:bg-blue-500 transition flex items-center justify-center shadow-md shadow-blue-600/30 border border-blue-400/40"
            aria-label="Call 098210 85899"
          >
            <Phone className="w-4 h-4 fill-white" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-11 h-11 rounded-xl text-slate-300 hover:text-white active:bg-slate-800 bg-slate-900/80 border border-white/10 transition flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-menu"
          className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 py-4 space-y-2 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2 duration-150"
        >
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center h-11 px-3 rounded-xl text-slate-200 font-medium hover:text-white hover:bg-slate-900 active:bg-slate-800 transition"
          >
            About
          </a>
          <a
            href="#courses"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center h-11 px-3 rounded-xl text-slate-200 font-medium hover:text-white hover:bg-slate-900 active:bg-slate-800 transition"
          >
            Courses
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenReviews();
            }}
            className="flex items-center w-full h-11 px-3 rounded-xl text-left text-slate-200 font-medium hover:text-white hover:bg-slate-900 active:bg-slate-800 transition cursor-pointer"
          >
            Reviews (294+ Google Reviews)
          </button>
          <a
            href="#location"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center h-11 px-3 rounded-xl text-slate-200 font-medium hover:text-white hover:bg-slate-900 active:bg-slate-800 transition"
          >
            Location & Timings
          </a>
          {onOpenAdmin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-2 w-full h-11 px-3 rounded-xl text-left text-slate-200 font-medium hover:text-white hover:bg-slate-900 active:bg-slate-800 transition cursor-pointer"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Admin Dashboard</span>
            </button>
          )}
          <div className="pt-2">
            <a
              href="tel:09821085899"
              onClick={onOpenCallModal}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold h-12 rounded-full text-center shadow-lg shadow-blue-600/30 transition"
            >
              <Phone className="w-4 h-4 fill-white" />
              <span>Call 098210 85899</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
