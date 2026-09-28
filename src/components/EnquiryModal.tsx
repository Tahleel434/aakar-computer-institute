import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Phone, Calendar, Clock, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { Course, COURSES_DATA } from '../data';
import { FirestoreCourse, submitEnquiry } from '../lib/firestoreService';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse?: Course | FirestoreCourse | null;
  coursesList?: FirestoreCourse[];
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  selectedCourse,
  coursesList,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [courseName, setCourseName] = useState('');
  const [preferredBatch, setPreferredBatch] = useState('Morning (7 AM - 12 PM)');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const displayCourses = coursesList && coursesList.length > 0 ? coursesList : COURSES_DATA;

  useEffect(() => {
    if (selectedCourse) {
      setCourseName(selectedCourse.title);
    } else if (displayCourses.length > 0) {
      setCourseName(displayCourses[0].title);
    } else {
      setCourseName('Python Programming');
    }
  }, [selectedCourse, isOpen]);

  // Auto-close modal after successful submission
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        handleReset();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) {
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
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Frontend validation
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedCourse = courseName.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    const cleanPhone = trimmedPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    if (!trimmedCourse) {
      setErrorMessage('Please select a course.');
      return;
    }

    // Prevent duplicate submission
    if (submitting) return;

    setSubmitting(true);

    try {
      await submitEnquiry({
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        course: trimmedCourse,
        preferredTimeSlot: preferredBatch,
        message: message.trim(),
      });

      // Clear form inputs only after successful submission
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setSubmitted(true);
    } catch (err: any) {
      console.error('Submission failed:', err);
      // Keep form open with entered data and display error message
      setErrorMessage(
        err?.message || 'Failed to submit enquiry. Please check your internet connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMessage(null);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        if (!submitting) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-slate-900 text-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 id="enquiry-modal-title" className="font-bold text-base sm:text-lg text-white">
                {selectedCourse ? `Enquire: ${selectedCourse.title}` : 'Book a Free Demo Class'}
              </h3>
              <p className="text-xs text-blue-100">Aakar Computer Institute, Kurla East</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-10 h-10 rounded-full text-white/80 hover:text-white hover:bg-white/20 flex items-center justify-center transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0 disabled:opacity-50"
            aria-label="Close demo booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-7 bg-slate-900 text-white overflow-y-auto">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-white">Demo Session Requested!</h4>
              <p className="text-slate-200 text-sm max-w-sm mx-auto leading-relaxed">
                Your free demo session has been requested successfully. Our team will contact you shortly.
              </p>

              <div className="pt-4 flex flex-col gap-2">
                <a
                  href="tel:09821085899"
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3.5 rounded-full hover:bg-blue-500 transition shadow-lg shadow-blue-600/30"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Direct: 098210 85899</span>
                </a>
                <button
                  onClick={handleReset}
                  className="w-full text-slate-300 text-sm py-2.5 hover:text-white font-medium cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label htmlFor="enquiry-name" className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                  Your Full Name *
                </label>
                <input
                  id="enquiry-name"
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-sm transition disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="enquiry-phone" className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    id="enquiry-phone"
                    type="tel"
                    required
                    placeholder="e.g. 9821085899"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-sm transition disabled:opacity-60"
                  />
                </div>

                <div>
                  <label htmlFor="enquiry-email" className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="enquiry-email"
                    type="email"
                    required
                    placeholder="e.g. rahul@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-sm transition disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="enquiry-course" className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                  Selected Course *
                </label>
                <select
                  id="enquiry-course"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-sm transition disabled:opacity-60 cursor-pointer"
                >
                  {displayCourses.map((c) => (
                    <option key={c.id} value={c.title} className="bg-slate-900 text-white">
                      {c.title} {c.category ? `(${c.category.toUpperCase()})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="enquiry-batch" className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  id="enquiry-batch"
                  value={preferredBatch}
                  onChange={(e) => setPreferredBatch(e.target.value)}
                  disabled={submitting}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-sm transition disabled:opacity-60 cursor-pointer"
                >
                  <option className="bg-slate-900 text-white">Morning (7 AM - 12 PM)</option>
                  <option className="bg-slate-900 text-white">Afternoon (12 PM - 4 PM)</option>
                  <option className="bg-slate-900 text-white">Evening (4 PM - 9 PM)</option>
                  <option className="bg-slate-900 text-white">Weekend Batches</option>
                </select>
              </div>

              <div>
                <label htmlFor="enquiry-message" className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                  Message / Queries (Optional)
                </label>
                <textarea
                  id="enquiry-message"
                  rows={2}
                  placeholder="Any specific topics or goals you would like guidance on..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={submitting}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none text-sm transition disabled:opacity-60"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3.5 rounded-full transition shadow-lg shadow-blue-600/30 active:scale-98 cursor-pointer border border-blue-400/40 min-h-[48px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving Enquiry...</span>
                    </>
                  ) : (
                    <span>Confirm Free Demo Session</span>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400">
                100% free consultation. No payment required. Visit or attend live online.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

