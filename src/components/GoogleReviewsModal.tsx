import React, { useState, useEffect } from 'react';
import { X, Star, Heart, Share2, MoreVertical, ThumbsUp } from 'lucide-react';
import { STUDENT_STORIES, Review } from '../data';

interface GoogleReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleReviewsModal: React.FC<GoogleReviewsModalProps> = ({ isOpen, onClose }) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Most relevant');
  const [likedReviews, setLikedReviews] = useState<{ [id: string]: boolean }>({});
  const [copiedReviewId, setCopiedReviewId] = useState<string | null>(null);

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tags = [
    { label: 'All', count: null },
    { label: 'computer courses', count: 14 },
    { label: 'digital marketing course', count: 2 },
    { label: 'practical session', count: 3 },
    { label: 'supportive teachers', count: 3 },
    { label: '+6', count: null },
  ];

  const sortOptions = ['Most relevant', 'Newest', 'Highest', 'Lowest'];

  // Filter reviews
  let displayedReviews = [...STUDENT_STORIES];
  if (selectedTag !== 'All' && selectedTag !== '+6') {
    displayedReviews = displayedReviews.filter((r) =>
      r.tags?.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()))
    );
  }

  // Sort reviews
  if (sortBy === 'Highest') {
    displayedReviews.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'Lowest') {
    displayedReviews.sort((a, b) => a.rating - b.rating);
  }

  const toggleLike = (id: string) => {
    setLikedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedReviewId(id);
      setTimeout(() => setCopiedReviewId(null), 2500);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#1e1f20] text-slate-100 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-700"
        role="dialog"
        aria-modal="true"
        aria-label="Student Google Reviews for Aakar Computer Institute"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-[#1e1f20] shrink-0">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Google Reviews (294+)</h3>
            <p className="text-xs text-slate-400">Aakar Computer Institute, Kurla East, Mumbai</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 shrink-0"
            aria-label="Close reviews dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-6 flex-1 text-slate-200">
          
          {/* Overall Rating Header */}
          <div className="flex items-center justify-between bg-slate-800/60 p-4 rounded-xl border border-slate-700/40">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-white">4.5</span>
              <div>
                <div className="flex items-center text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">294 Google reviews in Kurla, Mumbai</div>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Aakar+Computer+Institute,+Kurla"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg transition"
            >
              Write a review
            </a>
          </div>

          {/* Filter Pills */}
          <div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTag === tag.label;
                return (
                  <button
                    key={tag.label}
                    onClick={() => setSelectedTag(tag.label)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <span>{tag.label}</span>
                    {tag.count && <span className="ml-1.5 opacity-80">{tag.count}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By Row */}
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-2">Sort by</div>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((opt) => {
                const isSelected = sortBy === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setSortBy(opt)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          <div className="divide-y divide-slate-800 space-y-6">
            {displayedReviews.map((review) => {
              const isLiked = !!likedReviews[review.id];
              return (
                <div key={review.id} className="pt-6 first:pt-0 space-y-3">
                  {/* Reviewer Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {review.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {review.reviewCount ? `${review.reviewCount} reviews` : review.role}
                        </div>
                      </div>
                    </div>
                    <button className="text-slate-500 hover:text-slate-300 p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stars & Date */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="flex items-center text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span>•</span>
                    <span>{review.timeAgo}</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {review.text}
                  </p>

                  {/* Photos if any */}
                  {review.id === 'gajanan' && (
                    <div className="grid grid-cols-2 gap-2 pt-1 max-w-sm">
                      <img
                        src="/images/aakar_institute_front.jpg"
                        alt="Aakar Computer Institute storefront premises"
                        className="rounded-lg h-24 w-full object-cover border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <img
                        src="/images/aakar_computer_lab.jpg"
                        alt="Aakar Computer Institute training lab"
                        className="rounded-lg h-24 w-full object-cover border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  {/* Action buttons (Like & Share) */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <button
                      onClick={() => toggleLike(review.id)}
                      className={`inline-flex items-center gap-1.5 transition hover:text-white cursor-pointer ${
                        isLiked ? 'text-red-400' : ''
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-400' : ''}`} />
                      <span>{isLiked ? 'Liked' : 'Hover to react'}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(review.id)}
                      className="inline-flex items-center gap-1.5 hover:text-white transition cursor-pointer"
                      aria-label="Share review link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{copiedReviewId === review.id ? 'Link Copied!' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>Source: Google Business Profile (Kurla East)</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition cursor-pointer min-h-[38px]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
