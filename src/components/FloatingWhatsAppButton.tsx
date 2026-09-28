import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  phoneNumber = '919821085899',
  defaultMessage = 'Hello Aakar Computer Institute, I would like to enquire about your courses and book a free demo session.',
}) => {
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-6 right-6 z-40">
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa51] text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl shadow-[#25D366]/40 hover:shadow-[#25D366]/60 border border-white/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        aria-label="Chat with Aakar Computer Institute on WhatsApp (098210 85899)"
      >
        {/* Pulsing indicator ring */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border border-slate-950"></span>
        </span>

        {/* WhatsApp Chat Icon */}
        <MessageCircle className="w-6 h-6 fill-white text-white shrink-0 drop-shadow-sm" />

        {/* Label visible on medium screens and larger, compact on mobile */}
        <span className="hidden sm:inline font-bold text-sm tracking-wide drop-shadow-xs whitespace-nowrap pr-1">
          Chat on WhatsApp
        </span>

        {/* Floating tooltip on mobile hover */}
        <span className="sm:hidden absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900/95 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
};
