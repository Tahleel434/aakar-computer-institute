import React from 'react';
import { Phone, MapPin, Mail, ArrowUp, Shield } from 'lucide-react';
import { AakarLogo } from './AakarLogo';

interface FooterProps {
  onOpenReviews: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReviews, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 pt-16 pb-12 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Brand Info with Official Aakar Emblem Logo */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <AakarLogo className="w-12 h-12 shrink-0" />
              <div>
                <span className="text-white font-extrabold text-lg tracking-tight uppercase block leading-tight">
                  Aakar Computer Institute
                </span>
                <span className="text-[11px] font-bold text-amber-300">
                  Govt Recognised • Skill India & NSDC Partner
                </span>
              </div>
            </div>
            
            <p className="text-slate-200 text-sm max-w-md leading-relaxed">
              100% Practical Training | Transform Your Career. Kurla's premier center for
              computer programming, design, accounting, MS-CIT, and digital skills.
            </p>

            <div className="text-xs text-slate-400 pt-1">
              ISO 9001:2008 Certified Training Center • Authorized MS-CIT & GCC-TBC Exam Lab
            </div>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <a href="#courses" className="hover:text-white transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Why Aakar
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenReviews}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Reviews (294+)
                </button>
              </li>
              <li>
                <a href="#location" className="hover:text-white transition-colors">
                  Location & Hours
                </a>
              </li>
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-blue-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span>Admin Portal</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <a
                  href="tel:09821085899"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-white font-medium">098210 85899</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:aakaroffice99@gmail.com"
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 text-red-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-slate-200 group-hover:text-white">aakaroffice99@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-slate-200">
                  S.K.P School Campus, Mother Dairy Road, Nehru Nagar, Kurla East, Mumbai 400024
                </span>
              </li>
              <li className="text-xs text-slate-400 pt-1">
                Mon: 7 am–10 pm | Tue–Sun: 7 am–9 pm
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 Aakar Computer Institute. All rights reserved.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-blue-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};
