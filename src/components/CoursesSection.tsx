import React, { useState } from 'react';
import { Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { Course, COURSES_DATA } from '../data';
import { FirestoreCourse } from '../lib/firestoreService';

interface CoursesSectionProps {
  onSelectCourse: (course: Course | FirestoreCourse) => void;
  courses?: FirestoreCourse[];
}

type CategoryType = 'programming' | 'design' | 'digital-marketing' | 'others';

export const CoursesSection: React.FC<CoursesSectionProps> = ({ onSelectCourse, courses }) => {
  const [activeTab, setActiveTab] = useState<CategoryType>('programming');

  const tabs: { id: CategoryType; label: string }[] = [
    { id: 'programming', label: 'Programming' },
    { id: 'design', label: 'Design' },
    { id: 'digital-marketing', label: 'Digital Marketing' },
    { id: 'others', label: 'Others' },
  ];

  const sourceCourses = courses && courses.length > 0 ? courses : COURSES_DATA;
  const filteredCourses = sourceCourses.filter((course) => course.category === activeTab);

  return (
    <section id="courses" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Explore Courses</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow">
            Find the right skill path
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-200">
            Choose a category to browse Aakar's wide range of practical training options.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/40 scale-102'
                      : 'bg-slate-950/50 hover:bg-slate-900/80 text-slate-200 border border-white/15 backdrop-blur-md'
                  }`}
                  aria-pressed={isActive}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => {
            const isFlagship = ['mscit', 'tally-prime', 'adv-excel', 'web-dev', 'python-prog', 'graphic-design'].includes(course.id);
            const displayNumber = (course as any).number || String(idx + 1).padStart(2, '0');
            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCourse(course);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group bg-slate-950/40 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-white/15 shadow-xl hover:shadow-2xl hover:border-blue-400/60 hover:bg-slate-950/60 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[190px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                aria-label={`Enquire about ${course.title}`}
              >
                {/* Top Row: Number & Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-blue-400 tracking-wider">
                      {displayNumber}
                    </span>
                    {isFlagship && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        High Demand
                      </span>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Title & Description */}
                <div className="my-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-300 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                </div>

                {/* Bottom Row: Enquire Now Button */}
                <div className="pt-3 flex items-center justify-between border-t border-slate-800 text-slate-300 group-hover:text-blue-300 transition-colors">
                  <span className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
                    Enquire Now
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {course.duration && (
                    <span className="text-[11px] font-medium text-slate-200 bg-slate-800/90 px-2.5 py-1 rounded-md border border-slate-700">
                      {course.duration}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
