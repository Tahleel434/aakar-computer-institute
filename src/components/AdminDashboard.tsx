import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  BookOpen,
  MessageSquare,
  Star,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  LogOut,
  RefreshCw,
  Database,
  Search,
  ExternalLink,
  ChevronDown,
  UserCheck,
  AlertCircle,
  UploadCloud,
  Mail,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { AakarLogo } from './AakarLogo';
import { GmailManager } from './GmailManager';
import {
  FirestoreCourse,
  FirestoreEnquiry,
  FirestoreTestimonial,
  EnquiryStatus,
  subscribeCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  seedInitialCourses,
  subscribeEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  subscribeTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../lib/firestoreService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin, loading: authLoading, signInWithGoogle, signOut, error: authError } = useAuth();

  const [activeTab, setActiveTab] = useState<'enquiries' | 'courses' | 'testimonials' | 'gmail' | 'system'>('enquiries');

  // Gmail passing state for quick reply from enquiries
  const [gmailInitialRecipient, setGmailInitialRecipient] = useState<string>('');
  const [gmailInitialSubject, setGmailInitialSubject] = useState<string>('');
  const [gmailInitialBody, setGmailInitialBody] = useState<string>('');

  // Data states
  const [enquiries, setEnquiries] = useState<FirestoreEnquiry[]>([]);
  const [courses, setCourses] = useState<FirestoreCourse[]>([]);
  const [testimonials, setTestimonials] = useState<FirestoreTestimonial[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [seedingCourses, setSeedingCourses] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Enquiry filters
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | EnquiryStatus>('all');
  const [enquirySearch, setEnquirySearch] = useState('');

  // Course Modal state
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<FirestoreCourse | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'programming' as 'programming' | 'design' | 'digital-marketing' | 'others',
    duration: '',
    price: '',
    description: '',
  });

  // Testimonial Modal state
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<FirestoreTestimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    course: '',
    rating: 5,
    review: '',
  });

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !courseModalOpen && !testimonialModalOpen) {
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
  }, [isOpen, courseModalOpen, testimonialModalOpen, onClose]);

  // Load subscriptions when authorized
  useEffect(() => {
    if (!isOpen || !isAdmin) return;

    setLoadingData(true);
    const unsubEnquiries = subscribeEnquiries((list) => {
      setEnquiries(list);
      setLoadingData(false);
    });

    const unsubCourses = subscribeCourses((list) => {
      setCourses(list);
    });

    const unsubTestimonials = subscribeTestimonials((list) => {
      setTestimonials(list);
    });

    return () => {
      unsubEnquiries();
      unsubCourses();
      unsubTestimonials();
    };
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Status badge style helper
  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'contacted':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'converted':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'closed':
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      showToast(`Enquiry status updated to ${newStatus}`);
    } catch (e: any) {
      showToast(`Error updating status: ${e.message}`);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry record?')) {
      try {
        await deleteEnquiry(id);
        showToast('Enquiry deleted');
      } catch (e: any) {
        showToast(`Error deleting: ${e.message}`);
      }
    }
  };

  // Course save
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseForm);
        showToast('Course updated successfully');
      } else {
        await addCourse(courseForm);
        showToast('New course added to Firestore');
      }
      setCourseModalOpen(false);
      setEditingCourse(null);
    } catch (e: any) {
      showToast(`Course error: ${e.message}`);
    }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (window.confirm(`Delete course "${title}" from Firestore?`)) {
      try {
        await deleteCourse(id);
        showToast('Course deleted');
      } catch (e: any) {
        showToast(`Error deleting course: ${e.message}`);
      }
    }
  };

  const handleSeedCourses = async () => {
    if (window.confirm('Seed all 27 standard institute courses into Firestore database?')) {
      setSeedingCourses(true);
      try {
        const count = await seedInitialCourses();
        showToast(`Successfully seeded ${count} courses to Firestore!`);
      } catch (e: any) {
        showToast(`Seeding error: ${e.message}`);
      } finally {
        setSeedingCourses(false);
      }
    }
  };

  // Testimonial save
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, testimonialForm);
        showToast('Testimonial updated');
      } else {
        await addTestimonial(testimonialForm);
        showToast('New testimonial published');
      }
      setTestimonialModalOpen(false);
      setEditingTestimonial(null);
    } catch (e: any) {
      showToast(`Testimonial error: ${e.message}`);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Delete this student testimonial?')) {
      try {
        await deleteTestimonial(id);
        showToast('Testimonial removed');
      } catch (e: any) {
        showToast(`Error: ${e.message}`);
      }
    }
  };

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesFilter = enquiryFilter === 'all' || item.status === enquiryFilter;
    const matchesSearch =
      !enquirySearch ||
      item.name.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      item.phone.includes(enquirySearch) ||
      item.course.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      item.email.toLowerCase().includes(enquirySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 text-white w-full max-w-6xl h-[92vh] rounded-3xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Aakar Admin Dashboard"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar Header */}
        <div className="px-5 sm:px-8 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <AakarLogo className="w-10 h-10 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Aakar Admin Dashboard</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Firestore Live
                </span>
              </div>
              <p className="text-xs text-slate-400">Manage enquiries, dynamic courses, and testimonials</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 truncate max-w-[160px]">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="ml-2 text-slate-400 hover:text-red-400 cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
              aria-label="Close admin dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action toast */}
        {actionMessage && (
          <div className="bg-blue-600 text-white text-xs px-6 py-2 flex items-center justify-between">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage(null)} className="text-blue-200 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Not Authorized View */}
        {!isAdmin ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900">
            <div className="w-16 h-16 rounded-3xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">Administrator Access Required</h4>
            <p className="text-slate-300 text-sm max-w-md mb-8">
              Sign in with your authorized administrator Google account (e.g.{' '}
              <span className="text-blue-300 font-semibold">aakaroffice99@gmail.com</span> or{' '}
              <span className="text-blue-300 font-semibold">tahleel.shikalgar@gmail.com</span>) to manage student enquiries, courses, and official Gmail communications.
            </p>

            {authError && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs max-w-md text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {user && !isAdmin ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs max-w-md">
                  Signed in as <strong>{user.email}</strong>. This account does not have administrator privileges.
                </div>
                <button
                  onClick={() => signOut()}
                  className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition cursor-pointer"
                >
                  Sign Out & Try Another Account
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                disabled={authLoading}
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition shadow-xl shadow-blue-600/30 cursor-pointer min-h-[52px]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign In With Google</span>
              </button>
            )}
          </div>
        ) : (
          /* Authorized Admin View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-slate-950 border-r border-slate-800 p-4 flex md:flex-col gap-2 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('enquiries')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer text-left ${
                  activeTab === 'enquiries'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enquiries</span>
                {enquiries.filter((e) => e.status === 'new').length > 0 && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                    {enquiries.filter((e) => e.status === 'new').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer text-left ${
                  activeTab === 'courses'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Courses</span>
                <span className="ml-auto text-xs text-slate-400">{courses.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer text-left ${
                  activeTab === 'testimonials'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Testimonials</span>
                <span className="ml-auto text-xs text-slate-400">{testimonials.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('gmail')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer text-left ${
                  activeTab === 'gmail'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4 text-red-400" />
                <span>Gmail Hub</span>
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                  Official
                </span>
              </button>

              <button
                onClick={() => setActiveTab('system')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer text-left ${
                  activeTab === 'system'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Firebase System</span>
              </button>
            </div>

            {/* Main Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900">
              {/* ENQUIRIES TAB */}
              {activeTab === 'enquiries' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-white">Student Enquiries</h4>
                      <p className="text-xs text-slate-400">
                        Real-time student counselling requests from website
                      </p>
                    </div>

                    {/* Filter pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['all', 'new', 'contacted', 'converted', 'closed'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setEnquiryFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer ${
                            enquiryFilter === st
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search enquiries by name, phone, course, or email..."
                      value={enquirySearch}
                      onChange={(e) => setEnquirySearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Enquiries List */}
                  {filteredEnquiries.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border border-slate-800 bg-slate-950/50">
                      <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-300 font-medium">No enquiries matching filter</p>
                      <p className="text-xs text-slate-500 mt-1">
                        New enquiries from the "Book Free Counselling" form will appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredEnquiries.map((enq) => (
                        <div
                          key={enq.id}
                          className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h5 className="font-bold text-base text-white">{enq.name}</h5>
                              <span
                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                                  enq.status
                                )}`}
                              >
                                {enq.status.toUpperCase()}
                              </span>
                              <span className="text-xs text-slate-400">
                                {enq.createdAt?.toDate
                                  ? enq.createdAt.toDate().toLocaleString()
                                  : 'Just now'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                              <a
                                href={`tel:${enq.phone}`}
                                className="text-blue-400 hover:underline font-mono font-medium"
                              >
                                📞 {enq.phone}
                              </a>
                              <a
                                href={`mailto:${enq.email}`}
                                className="text-slate-300 hover:text-white"
                              >
                                ✉️ {enq.email}
                              </a>
                              <span className="text-amber-300 font-medium">
                                🎓 {enq.course}
                              </span>
                              {enq.preferredTimeSlot && (
                                <span className="text-blue-300 font-medium">
                                  ⏰ {enq.preferredTimeSlot}
                                </span>
                              )}
                            </div>

                            {enq.message && (
                              <p className="text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-lg mt-2">
                                "{enq.message}"
                              </p>
                            )}
                          </div>

                          {/* Action controls */}
                          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                            {enq.email && (
                              <button
                                onClick={() => {
                                  setGmailInitialRecipient(enq.email);
                                  setGmailInitialSubject(`Aakar Computer Institute - Details for ${enq.course || 'Course'}`);
                                  setGmailInitialBody(
                                    `Dear ${enq.name || 'Student'},\n\nThank you for reaching out to Aakar Computer Institute regarding the ${enq.course || 'computer training'} course.\n\nWe offer 100% practical, certified computer training at our Kurla training labs. We would be delighted to invite you for a free counseling & demo session.\n\nFeel free to reply to this email or reach us at 09821085899.\n\nWarm regards,\nAdmissions Office\nAakar Computer Institute\nKurla, Mumbai | aakaroffice99@gmail.com`
                                  );
                                  setActiveTab('gmail');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                                title="Reply to student via official Gmail (aakaroffice99@gmail.com)"
                              >
                                <Mail className="w-3.5 h-3.5 text-red-400" />
                                <span>Email (Gmail)</span>
                              </button>
                            )}

                            <label className="text-xs text-slate-400">Status:</label>
                            <select
                              value={enq.status}
                              onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="converted">Converted</option>
                              <option value="closed">Closed</option>
                            </select>

                            <button
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition cursor-pointer"
                              title="Delete enquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* COURSES TAB */}
              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-white">Course Management</h4>
                      <p className="text-xs text-slate-400">
                        {courses.length} courses loaded from Firestore collection
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSeedCourses}
                        disabled={seedingCourses}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer border border-slate-700"
                        title="Seed static catalog into Firestore database"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                        <span>{seedingCourses ? 'Seeding...' : 'Seed Catalog to Firestore'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingCourse(null);
                          setCourseForm({
                            title: '',
                            category: 'programming',
                            duration: '2 Months',
                            price: '',
                            description: '',
                          });
                          setCourseModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Course</span>
                      </button>
                    </div>
                  </div>

                  {/* Course Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                              {course.category}
                            </span>
                            {course.duration && (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {course.duration}
                              </span>
                            )}
                          </div>
                          <h5 className="font-bold text-white text-base mb-1">{course.title}</h5>
                          <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                            {course.description || 'Hands-on practical training with lab assistance.'}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-300">
                            {course.price || 'Free Demo Included'}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingCourse(course);
                                setCourseForm({
                                  title: course.title,
                                  category: course.category,
                                  duration: course.duration || '',
                                  price: course.price || '',
                                  description: course.description || '',
                                });
                                setCourseModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                              title="Edit Course"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id, course.title)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition cursor-pointer"
                              title="Delete Course"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TESTIMONIALS TAB */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold text-white">Student Testimonials</h4>
                      <p className="text-xs text-slate-400">
                        {testimonials.length} testimonials in Firestore
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingTestimonial(null);
                        setTestimonialForm({
                          name: '',
                          course: 'Python Programming',
                          rating: 5,
                          review: '',
                        });
                        setTestimonialModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Testimonial</span>
                    </button>
                  </div>

                  {testimonials.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border border-slate-800 bg-slate-950/50">
                      <Star className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                      <p className="text-slate-300 font-medium">No custom testimonials added yet</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Add reviews here to feature them across the website!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testimonials.map((t) => (
                        <div
                          key={t.id}
                          className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-1 text-amber-400">
                                {[...Array(t.rating || 5)].map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                                ))}
                              </div>
                              <span className="text-xs text-blue-400 font-medium">{t.course}</span>
                            </div>
                            <p className="text-slate-200 text-sm italic mb-4">"{t.review}"</p>
                          </div>

                          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                            <span className="font-bold text-white text-sm">{t.name}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingTestimonial(t);
                                  setTestimonialForm({
                                    name: t.name,
                                    course: t.course || '',
                                    rating: t.rating || 5,
                                    review: t.review,
                                  });
                                  setTestimonialModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTestimonial(t.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SYSTEM TAB */}
              {activeTab === 'system' && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h4 className="text-xl font-bold text-white">Firebase System Status</h4>
                    <p className="text-xs text-slate-400">Active Firestore configuration & environment</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-slate-400 font-medium">Firebase Project ID</span>
                      <span className="font-mono text-white bg-slate-900 px-2 py-1 rounded">
                        bold-tribute-lf38q
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-slate-400 font-medium">Firestore Database ID</span>
                      <span className="font-mono text-white bg-slate-900 px-2 py-1 rounded">
                        ai-studio-aakarcomputerins-3d53eadb-f449-4412-b496-be9a3d914652
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-slate-400 font-medium">Primary Admin Emails</span>
                      <span className="font-mono text-emerald-400 bg-slate-900 px-2 py-1 rounded text-right text-xs">
                        aakaroffice99@gmail.com, tahleel.shikalgar@gmail.com
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-slate-400 font-medium">Official Gmail Integration</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 text-xs">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Google Workspace OAuth Enabled (aakaroffice99@gmail.com)
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-slate-400 font-medium">Security Rules</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Deployed & Active (ABAC Protected)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Enquiry Submissions</span>
                      <span className="text-white font-medium">
                        Public write-only with validation; Admin read/update
                      </span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 space-y-2">
                    <h6 className="font-bold text-white text-sm">Deployment & Configuration Guide</h6>
                    <p>
                      When deploying your application outside AI Studio, define the environment variables
                      prefixed with <code className="bg-blue-900/60 px-1 py-0.5 rounded text-white">VITE_FIREBASE_*</code> in
                      your host platform (Cloud Run, Vercel, Netlify, or .env).
                    </p>
                    <p>
                      Official Gmail API integration connects seamlessly with Google OAuth to authenticate{' '}
                      <strong className="text-white">aakaroffice99@gmail.com</strong> for real-time inbox management and outbound email delivery.
                    </p>
                  </div>
                </div>
              )}

              {/* GMAIL HUB TAB */}
              {activeTab === 'gmail' && (
                <GmailManager
                  initialRecipient={gmailInitialRecipient}
                  initialSubject={gmailInitialSubject}
                  initialBody={gmailInitialBody}
                  onClearInitial={() => {
                    setGmailInitialRecipient('');
                    setGmailInitialSubject('');
                    setGmailInitialBody('');
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Course Modal */}
        {courseModalOpen && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setCourseModalOpen(false)}
          >
            <div
              className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <h4 className="font-bold text-lg text-white">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h4>
                <button
                  onClick={() => setCourseModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Python for Data Analysis"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Category *</label>
                    <select
                      value={courseForm.category}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="digital-marketing">Digital Marketing</option>
                      <option value="others">Others / Tally / Excel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 2.5 Months"
                      value={courseForm.duration}
                      onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Price / Fee Note</label>
                  <input
                    type="text"
                    placeholder="e.g. Affordable installment available"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of skills covered in hands-on lab sessions..."
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCourseModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition shadow-lg"
                  >
                    Save Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Testimonial Modal */}
        {testimonialModalOpen && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setTestimonialModalOpen(false)}
          >
            <div
              className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <h4 className="font-bold text-lg text-white">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                </h4>
                <button
                  onClick={() => setTestimonialModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTestimonial} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Deshmukh"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Course Studied</label>
                    <input
                      type="text"
                      placeholder="e.g. Tally Prime with GST"
                      value={testimonialForm.course}
                      onChange={(e) =>
                        setTestimonialForm({ ...testimonialForm, course: e.target.value })
                      }
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Rating (1-5)</label>
                    <select
                      value={testimonialForm.rating}
                      onChange={(e) =>
                        setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Review Feedback *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Student feedback and learning experience..."
                    value={testimonialForm.review}
                    onChange={(e) =>
                      setTestimonialForm({ ...testimonialForm, review: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setTestimonialModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition shadow-lg"
                  >
                    Save Testimonial
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
