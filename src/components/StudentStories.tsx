import React from 'react';
import { Sparkles, Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { STUDENT_STORIES } from '../data';
import { FirestoreTestimonial } from '../lib/firestoreService';

interface StudentStoriesProps {
  onOpenReviews: () => void;
  testimonials?: FirestoreTestimonial[];
}

export const StudentStories: React.FC<StudentStoriesProps> = ({ onOpenReviews, testimonials }) => {
  // Combine custom firestore testimonials if available with standard stories
  const formattedCustomStories = (testimonials || []).map((t) => ({
    id: t.id,
    name: t.name,
    role: t.course ? `Learned ${t.course}` : 'Student',
    timeAgo: 'Verified Student',
    text: t.review,
    rating: t.rating || 5,
  }));

  const allStories = [...formattedCustomStories, ...STUDENT_STORIES];
  const displayStories = allStories.slice(0, 3);

  return (
    <section id="reviews" className="py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Student Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow">
            Confidence built through practice
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-200">
            Student feedback inspired by the themes seen across Aakar's Google reviews.
          </p>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayStories.map((story) => (
            <div
              key={story.id}
              className="bg-slate-950/40 backdrop-blur-md rounded-2xl sm:rounded-3xl p-7 sm:p-8 border border-white/15 shadow-xl hover:border-white/30 hover:bg-slate-950/60 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Quotation mark 99 */}
                <div className="text-blue-400 text-4xl font-serif font-black leading-none mb-3 select-none">
                  “
                </div>

                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(story.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                  {story.text}
                </p>
              </div>

              {/* Author details */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-200 font-bold text-xs flex items-center justify-center shrink-0">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm sm:text-base">
                      {story.name}
                    </div>
                    <div className="text-xs text-slate-300">
                      {story.role}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">
                  {story.timeAgo}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Reviews Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenReviews}
            className="inline-flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base transition shadow-lg border border-slate-700 hover:border-slate-500 cursor-pointer min-h-[46px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="View all 294 Google Reviews in modal"
          >
            <span>View all 294+ Google Reviews</span>
            <ExternalLink className="w-4 h-4 text-blue-400" />
          </button>
        </div>

      </div>
    </section>
  );
};

