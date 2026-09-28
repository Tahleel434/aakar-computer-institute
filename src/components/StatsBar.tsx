import React from 'react';
import { Star, ExternalLink } from 'lucide-react';

interface StatsBarProps {
  onOpenReviews?: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({ onOpenReviews }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenReviews?.();
    }
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950/40 backdrop-blur-md border border-white/15 rounded-2xl sm:rounded-3xl py-8 sm:py-10 px-6 sm:px-12 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 items-center text-center">
            
            {/* Stat 1: Google Reviews (Clickable) */}
            <div 
              onClick={onOpenReviews}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              className="cursor-pointer group flex flex-col items-center justify-center p-2 rounded-xl transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="View 294+ Google Reviews"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors drop-shadow">
                294+
              </div>
              <div className="mt-2 text-xs sm:text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1 group-hover:text-blue-300 transition-colors">
                <span>Google Reviews</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </div>
            </div>

            {/* Stat 2: Trusted Rating (Clickable) */}
            <div 
              onClick={onOpenReviews}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              className="cursor-pointer group flex flex-col items-center justify-center p-2 rounded-xl transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="View 4.5 out of 5 Trusted Rating on Google"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-amber-400 tracking-tight group-hover:text-amber-300 transition-colors drop-shadow flex items-center justify-center gap-1">
                <span>4.5</span>
                <Star className="w-6 h-6 sm:w-8 sm:h-8 fill-amber-400 text-amber-400 inline" />
              </div>
              <div className="mt-2 text-xs sm:text-sm font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1 group-hover:text-amber-300 transition-colors">
                <span>Trusted Rating</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </div>
            </div>

            {/* Stat 3: 100% Practical Training */}
            <div className="flex flex-col items-center justify-center p-2">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-blue-400 tracking-tight drop-shadow">
                100%
              </div>
              <div className="mt-2 text-xs sm:text-sm font-bold tracking-wider text-slate-300 uppercase">
                Practical Training
              </div>
            </div>

            {/* Stat 4: 7 Days Open */}
            <div className="flex flex-col items-center justify-center p-2">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow">
                7 Days
              </div>
              <div className="mt-2 text-xs sm:text-sm font-bold tracking-wider text-slate-300 uppercase">
                Open Every Week
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
