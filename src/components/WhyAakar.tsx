import React from 'react';
import { CheckCircle2, BookOpen, GraduationCap, Code2 } from 'lucide-react';

export const WhyAakar: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold tracking-widest text-blue-400 uppercase">
              Why Aakar
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow">
              Training built around doing, not just watching.
            </h2>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              At Aakar, students build practical computer skills with attentive teachers, clear
              explanations and regular hands-on learning.
            </p>

            {/* Checklist with checkmark badges */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-white font-medium text-base">
                  Practical, skills-first approach
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-white font-medium text-base">
                  Supportive and approachable teaching
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-white font-medium text-base">
                  Wide choice of career-focused courses
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Feature Cards Grid */}
          <div className="lg:col-span-6 space-y-5">
            {/* Top Card: Skills that stay with you */}
            <div className="bg-slate-950/40 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/15 shadow-2xl hover:border-white/30 transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow">
                Skills that stay with you
              </h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Learn concepts through guided practice and application.
              </p>
            </div>

            {/* Bottom 2 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Clear guidance */}
              <div className="bg-slate-950/40 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/15 shadow-2xl hover:border-white/30 transition-all">
                <div className="w-11 h-11 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow">
                  Clear guidance
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed">
                  Step-by-step mentoring from patient instructors.
                </p>
              </div>

              {/* Real practice (Translucent Blue Card) */}
              <div className="bg-gradient-to-br from-blue-600/80 to-indigo-600/80 backdrop-blur-md rounded-2xl p-6 sm:p-7 text-white shadow-2xl border border-blue-400/40 hover:from-blue-600/90 hover:to-indigo-600/90 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-blue-500/40 flex items-center justify-center mb-4 border border-white/20">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Real practice
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Extensive computer lab time on real exercises.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
