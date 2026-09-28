import React from 'react';
import { Phone, Calendar } from 'lucide-react';

interface CtaBannerProps {
  onOpenDemoModal: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenDemoModal }) => {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl sm:rounded-[32px] p-8 sm:p-14 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl border border-blue-400/40">
          
          {/* Subtle geometric circles in background for depth */}
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-500/40 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-blue-700/50 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="text-xs sm:text-sm font-bold tracking-widest text-blue-100 uppercase">
              Your Next Skill Starts Here
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Book your free counselling or demo class.
            </h2>

            <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto font-normal pt-1">
              Speak with Aakar to find the course that fits your interests and goals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-6">
              <a
                href="tel:09821085899"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-blue-600 font-bold text-base px-8 py-4 rounded-full transition-all shadow-lg active:scale-95 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                id="cta-call-btn"
                aria-label="Call Aakar Computer Institute at 098210 85899"
              >
                <Phone className="w-5 h-5 fill-blue-600 text-blue-600" />
                <span>Call 098210 85899</span>
              </a>

              <button
                onClick={onOpenDemoModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-700/80 hover:bg-blue-800 text-white font-semibold text-base px-7 py-4 rounded-full border border-blue-300/40 transition-all active:scale-95 cursor-pointer min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Book a free demo class"
              >
                <Calendar className="w-5 h-5 text-blue-200" />
                <span>Book a Demo</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
