import React from 'react';
import { Sparkles, Target, HeartHandshake, Tv, Compass, Users, Award } from 'lucide-react';
import { DIFFERENCE_ITEMS } from '../data';

export const AakarDifference: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target':
        return <Target className="w-6 h-6 text-blue-400" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-blue-400" />;
      case 'Tv':
        return <Tv className="w-6 h-6 text-blue-400" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-blue-400" />;
      case 'Users':
        return <Users className="w-6 h-6 text-blue-400" />;
      case 'Award':
        return <Award className="w-6 h-6 text-blue-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
            <Sparkles className="w-4 h-4" />
            <span>The Aakar Difference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow">
            Everything you need to keep moving forward
          </h2>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {DIFFERENCE_ITEMS.map((item) => (
            <div
              key={item.number}
              className="bg-slate-950/40 backdrop-blur-md rounded-2xl sm:rounded-3xl p-7 sm:p-8 border border-white/15 shadow-xl hover:border-white/30 hover:bg-slate-950/60 transition-all group"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                {getIcon(item.icon)}
              </div>

              {/* Number */}
              <div className="text-xs font-extrabold text-blue-400 tracking-wider mb-2">
                {item.number}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
