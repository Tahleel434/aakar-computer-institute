import React, { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  Send,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Inbox,
  CornerUpLeft,
  X,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  User,
  Paperclip,
  Check,
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import {
  fetchGmailProfile,
  listGmailMessages,
  fetchGmailMessageDetails,
  sendGmailMessage,
  trashGmailMessage,
  markGmailAsRead,
  GmailProfile,
  GmailMessageSummary,
} from '../lib/gmailService';

interface GmailManagerProps {
  initialRecipient?: string;
  initialSubject?: string;
  initialBody?: string;
  onClearInitial?: () => void;
}

// Student response email templates for Aakar Computer Institute
const EMAIL_TEMPLATES = [
  {
    id: 'general_inquiry',
    title: 'Admission Enquiry Response',
    subject: 'Welcome to Aakar Computer Institute - Course Details & Admissions',
    body: `Dear Student,

Thank you for your enquiry regarding computer courses at Aakar Computer Institute, Kurla, Mumbai.

We offer 100% practical, hands-on computer training guided by certified industry experts. Our programs include:
• MS-CIT (Govt. Recognized Certification)
• Tally Prime with GST & Accounting
• Advanced Excel, Financial Modelling & Dashboards
• Graphic Designing (Photoshop, Illustrator, CorelDraw)
• Full Stack Web Development & Python Programming
• Digital Marketing & SEO

Batch Timings: Morning, Afternoon, Evening & Weekend batches available.
Locations: Kurla East (Near Station) & Kurla West (CSMT Road).

Please feel free to reply to this email or visit our institute for a free career counseling session and free demo lecture.

Warm regards,
Admissions Desk
Aakar Computer & Healthcare Institute
📞 09821085899 / 09372860716
✉️ aakaroffice99@gmail.com
🌐 Kurla, Mumbai`,
  },
  {
    id: 'tally_gst',
    title: 'Tally Prime + GST Syllabus & Brochure',
    subject: 'Aakar Computer Institute - Tally Prime + GST Course Details',
    body: `Dear Student,

Thank you for your interest in the Tally Prime + GST Professional Training Program at Aakar Computer Institute!

Course Highlights:
• Company Creation, Ledger & Group Management
• Inventory Management & Order Processing
• GST Invoicing, E-Way Bills & Tax Computation
• GST Returns Filing (GSTR-1, GSTR-3B, GSTR-9)
• TDS, TCS & Payroll Management
• Live Practical Projects & Real Company Books

Duration: Flexible batch options available (Fast-track & Regular).
Certification: Recognized Certificate provided upon course completion.

Reply to this email with your preferred timing to book a FREE demo session.

Best regards,
Aakar Computer Institute, Kurla
Email: aakaroffice99@gmail.com
Phone: +91 9821085899`,
  },
  {
    id: 'advanced_excel',
    title: 'Advanced Excel & Business Analytics',
    subject: 'Aakar Computer Institute - Advanced Excel Training Curriculum',
    body: `Dear Student,

Greetings from Aakar Computer Institute, Kurla!

Here are the details for our Advanced Excel for Corporate Professionals program:
• Advanced Formulas: XLOOKUP, VLOOKUP, INDEX-MATCH, SUMIFS
• Dynamic Dashboards & Pivot Tables
• Data Analysis & Power Query
• Automation with Macros & VBA basics
• Business Charting & Visual Reporting

We conduct personalized, hands-on sessions on individual computer workstations.

Let us know when you would like to attend a free introductory session.

Sincerely,
Aakar Computer Institute
Kurla, Mumbai | aakaroffice99@gmail.com`,
  },
  {
    id: 'demo_session',
    title: 'Free Demo Class Invitation',
    subject: 'Your Free Demo Lecture Invitation - Aakar Computer Institute',
    body: `Dear Student,

You are cordially invited for a FREE 1-on-1 Demo Session at Aakar Computer Institute, Kurla!

During this session:
1. Experience our practical teaching methodology.
2. Meet our experienced faculty and discuss your career goals.
3. Review the complete course syllabus and live project samples.
4. Get personalized guidance on the best course for your profile.

Institute Locations:
• Kurla East: Station Road, Kurla East, Mumbai - 400024
• Kurla West: Opposite Station, Kurla West, Mumbai - 400070

Call or reply to confirm your preferred day and time.

Team Aakar Computer Institute
aakaroffice99@gmail.com | 09821085899`,
  },
];

export const GmailManager: React.FC<GmailManagerProps> = ({
  initialRecipient,
  initialSubject,
  initialBody,
  onClearInitial,
}) => {
  const { user, connectGmail, gmailToken, isGmailConnected } = useAuth();

  // Gmail Profile & Messages State
  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Compose Modal State
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [replyThreadId, setReplyThreadId] = useState<string | undefined>(undefined);
  const [replyMessageId, setReplyMessageId] = useState<string | undefined>(undefined);

  // Mandatory User Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    isDestructive: boolean;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionLabel: '',
    isDestructive: false,
    onConfirm: async () => {},
  });

  // Load profile and messages once connected
  useEffect(() => {
    if (gmailToken) {
      loadGmailData();
    }
  }, [gmailToken]);

  // Handle external triggers (e.g., clicking "Email Student" from Enquiries tab)
  useEffect(() => {
    if (initialRecipient) {
      setComposeTo(initialRecipient);
      setComposeSubject(initialSubject || 'Aakar Computer Institute - Course Information');
      setComposeBody(
        initialBody ||
          `Dear Student,\n\nThank you for reaching out to Aakar Computer Institute.\n\n`
      );
      setIsComposeOpen(true);
      if (onClearInitial) onClearInitial();
    }
  }, [initialRecipient, initialSubject, initialBody, onClearInitial]);

  const loadGmailData = async (query = searchQuery) => {
    if (!gmailToken) return;
    setIsLoading(true);
    setError(null);
    try {
      const prof = await fetchGmailProfile(gmailToken);
      setProfile(prof);

      const res = await listGmailMessages(query, 15, gmailToken);
      setMessages(res.messages || []);
    } catch (err: any) {
      console.error('Error loading Gmail data:', err);
      setError(err?.message || 'Failed to sync with Gmail.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectGmail = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await connectGmail();
      setStatusMessage('Connected to Gmail successfully!');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to authorize Gmail.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMessage = async (msg: GmailMessageSummary) => {
    setSelectedMessage(msg);
    if (msg.isUnread && gmailToken) {
      await markGmailAsRead(msg.id, gmailToken);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isUnread: false } : m))
      );
    }
  };

  const handleOpenCompose = (templateId?: string) => {
    if (templateId) {
      const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
      if (template) {
        setComposeSubject(template.subject);
        setComposeBody(template.body);
      }
    } else {
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
    }
    setReplyThreadId(undefined);
    setReplyMessageId(undefined);
    setIsComposeOpen(true);
  };

  const handleOpenReply = (msg: GmailMessageSummary) => {
    setComposeTo(msg.fromEmail || msg.from || '');
    setComposeSubject(msg.subject?.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`);
    setComposeBody(
      `\n\n--- Original Message from ${msg.from} on ${msg.date} ---\n${msg.snippet || ''}\n`
    );
    setReplyThreadId(msg.threadId);
    setReplyMessageId(msg.id);
    setIsComposeOpen(true);
  };

  // Request user confirmation before sending email (MANDATORY per Workspace Integration skill)
  const triggerSendConfirmation = () => {
    if (!composeTo.trim()) {
      setError('Please specify a recipient email address.');
      return;
    }
    if (!composeSubject.trim()) {
      setError('Please add a subject for your email.');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Sending Email via Gmail',
      description: `You are about to send an official email to ${composeTo} with the subject "${composeSubject}". This will be sent directly from your connected Gmail account (${profile?.emailAddress || 'aakaroffice99@gmail.com'}). Do you wish to proceed?`,
      actionLabel: 'Confirm & Send Email',
      isDestructive: false,
      onConfirm: executeSendEmail,
    });
  };

  const executeSendEmail = async () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
    setIsLoading(true);
    setError(null);
    try {
      const htmlFormatted = `<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #222;">${composeBody
        .split('\n')
        .map((line) => (line.trim() ? `<p style="margin: 0 0 10px 0;">${escapeHtml(line)}</p>` : '<br/>'))
        .join('')}</div>`;

      await sendGmailMessage(
        {
          to: composeTo,
          subject: composeSubject,
          bodyText: composeBody,
          bodyHtml: htmlFormatted,
          threadId: replyThreadId,
          replyToMessageId: replyMessageId,
        },
        gmailToken || undefined
      );

      setStatusMessage(`Email successfully sent to ${composeTo}!`);
      setIsComposeOpen(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      setTimeout(() => setStatusMessage(null), 5000);

      // Refresh list
      loadGmailData();
    } catch (err: any) {
      console.error('Failed to send email:', err);
      setError(err?.message || 'Error sending email via Gmail.');
    } finally {
      setIsLoading(false);
    }
  };

  // Request user confirmation before trashing message (MANDATORY per Workspace Integration skill)
  const triggerTrashConfirmation = (messageId: string, subject: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Move Email to Trash?',
      description: `Are you sure you want to move the email "${subject}" to Trash in your Gmail account? This operation can be undone in your Gmail Trash folder.`,
      actionLabel: 'Move to Trash',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        setIsLoading(true);
        try {
          await trashGmailMessage(messageId, gmailToken || undefined);
          setMessages((prev) => prev.filter((m) => m.id !== messageId));
          if (selectedMessage?.id === messageId) {
            setSelectedMessage(null);
          }
          setStatusMessage('Email moved to Trash.');
          setTimeout(() => setStatusMessage(null), 4000);
        } catch (err: any) {
          setError(err?.message || 'Failed to move email to Trash.');
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadGmailData(searchQuery);
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-900/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Mail className="w-7 h-7 text-red-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">Gmail Communications Hub</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                  Official Google Workspace
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-0.5">
                Connected inbox & outbound email dispatcher for{' '}
                <span className="text-white font-medium">aakaroffice99@gmail.com</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isGmailConnected ? (
              <>
                <button
                  type="button"
                  onClick={() => loadGmailData()}
                  disabled={isLoading}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenCompose()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-semibold shadow-lg shadow-red-950/40 transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Compose Email</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleConnectGmail}
                disabled={isLoading}
                className="gsi-material-button px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-semibold shadow-xl transition flex items-center gap-3 active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>Authorize Gmail with aakaroffice99@gmail.com</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="mt-4 p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-200 text-xs px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {statusMessage && (
          <div className="mt-4 p-3.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-200 text-sm flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Account Info strip */}
        {profile && (
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Gmail Sync Active
              </span>
              <span>•</span>
              <span>
                Account: <strong className="text-slate-200">{profile.emailAddress}</strong>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>
                Total Messages:{' '}
                <strong className="text-slate-200">{profile.messagesTotal.toLocaleString()}</strong>
              </span>
              <span>
                Threads:{' '}
                <strong className="text-slate-200">{profile.threadsTotal.toLocaleString()}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Mailbox Interface */}
      {isGmailConnected ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Messages Column (Left) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-[650px]">
            {/* Search Bar & Filters */}
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages (e.g. from:student, Tally)..."
                className="w-full pl-10 pr-20 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg transition"
              >
                Search
              </button>
            </form>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800 text-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  loadGmailData('');
                }}
                className={`px-3 py-1 rounded-lg transition font-medium whitespace-nowrap ${
                  !searchQuery ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Messages
              </button>
              <button
                type="button"
                onClick={() => {
                  const q = 'is:unread';
                  setSearchQuery(q);
                  loadGmailData(q);
                }}
                className={`px-3 py-1 rounded-lg transition font-medium whitespace-nowrap ${
                  searchQuery === 'is:unread'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Unread
              </button>
              <button
                type="button"
                onClick={() => {
                  const q = 'label:sent';
                  setSearchQuery(q);
                  loadGmailData(q);
                }}
                className={`px-3 py-1 rounded-lg transition font-medium whitespace-nowrap ${
                  searchQuery === 'label:sent'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Sent by Institute
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {isLoading && messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                  <RefreshCw className="w-7 h-7 animate-spin mb-2 text-red-500" />
                  <p className="text-sm">Connecting to Gmail...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-center px-4">
                  <Inbox className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
                  <p className="text-sm font-medium text-slate-300">No emails found</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try adjusting your search query or check back later.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer relative ${
                        isSelected
                          ? 'bg-slate-800/90 border-red-500/50 shadow-md'
                          : msg.isUnread
                          ? 'bg-slate-950/80 border-slate-700 hover:border-slate-600'
                          : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-950/80 hover:border-slate-700'
                      }`}
                    >
                      {msg.isUnread && (
                        <span className="w-2 h-2 rounded-full bg-red-500 absolute top-3.5 right-3.5" />
                      )}
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span
                          className={`text-sm truncate font-medium ${
                            msg.isUnread ? 'text-white font-semibold' : 'text-slate-300'
                          }`}
                        >
                          {msg.fromName || msg.from}
                        </span>
                        <span className="text-[11px] text-slate-500 shrink-0">
                          {msg.date ? new Date(msg.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                        </span>
                      </div>
                      <h4
                        className={`text-xs mb-1 truncate ${
                          msg.isUnread ? 'text-slate-200 font-medium' : 'text-slate-400'
                        }`}
                      >
                        {msg.subject || '(No subject)'}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {msg.snippet || 'No text snippet'}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Message Reader / Details (Right) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-[650px] flex flex-col">
            {selectedMessage ? (
              <div className="flex flex-col h-full">
                {/* Email Header */}
                <div className="border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                      {selectedMessage.subject || '(No Subject)'}
                    </h2>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenReply(selectedMessage)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
                      >
                        <CornerUpLeft className="w-3.5 h-3.5 text-blue-400" />
                        <span>Reply</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          triggerTrashConfirmation(
                            selectedMessage.id,
                            selectedMessage.subject || 'this email'
                          )
                        }
                        className="p-1.5 bg-slate-800/80 hover:bg-red-950/60 text-slate-400 hover:text-red-300 rounded-lg border border-slate-700/60 transition"
                        title="Move to Trash"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                        {(selectedMessage.fromName || selectedMessage.from || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">
                          {selectedMessage.fromName}
                        </div>
                        <div className="text-slate-500">{selectedMessage.fromEmail}</div>
                      </div>
                    </div>
                    <div className="text-slate-500 sm:text-right">
                      <div>{selectedMessage.date}</div>
                      <div className="text-[10px] text-slate-600">To: {selectedMessage.to}</div>
                    </div>
                  </div>
                </div>

                {/* Email Body Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-950/40 rounded-xl border border-slate-800/50 text-sm text-slate-200 custom-scrollbar leading-relaxed">
                  {selectedMessage.bodyHtml ? (
                    <div
                      className="gmail-rendered-content text-slate-200 overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedMessage.bodyHtml) }}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-slate-300">
                      {selectedMessage.bodyText || selectedMessage.snippet}
                    </pre>
                  )}
                </div>

                {/* Quick Reply Bar at Bottom */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Received in <strong className="text-slate-400">aakaroffice99@gmail.com</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenReply(selectedMessage)}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-1.5"
                  >
                    <CornerUpLeft className="w-3.5 h-3.5" />
                    <span>Send Quick Reply</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
                <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 text-slate-600">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-300 mb-1">Select an email to view</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Click on any message from the inbox on the left to read inquiries, respond to students, or review sent mail.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => handleOpenCompose()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition"
                  >
                    Compose New Email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Disconnected / Prompt State */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center shadow-xl">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-red-600 to-amber-500 mx-auto p-0.5 shadow-xl shadow-red-950/50 mb-5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                <Mail className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Connect Institute Gmail Account</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Authorize access to <strong className="text-white">aakaroffice99@gmail.com</strong> using Google OAuth. This enables you to send course brochures, respond to student admission enquiries, and manage emails directly from the admin dashboard.
            </p>

            <button
              type="button"
              onClick={handleConnectGmail}
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold shadow-xl transition flex items-center justify-center gap-3 active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{isLoading ? 'Connecting...' : 'Authorize aakaroffice99@gmail.com'}</span>
            </button>
            <p className="text-[11px] text-slate-500 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Secured with official Google OAuth 2.0 & encrypted tokens
            </p>
          </div>
        </div>
      )}

      {/* Compose Email Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-base">
                  {replyThreadId ? 'Reply via Gmail' : 'Compose Email via Gmail'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsComposeOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Selector Bar */}
            <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick Student Templates:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {EMAIL_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setComposeSubject(tpl.subject);
                      setComposeBody(tpl.body);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition whitespace-nowrap text-[11px]"
                  >
                    {tpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  From
                </label>
                <div className="px-3.5 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300">
                  Aakar Computer Institute &lt;{profile?.emailAddress || 'aakaroffice99@gmail.com'}&gt;
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Recipient Email (To) <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="e.g. Aakar Computer Institute - Tally Prime Course Details"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Email Message Body <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  rows={8}
                  placeholder="Write your email message here..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition font-sans leading-relaxed resize-none"
                  required
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Will be sent via official Gmail API
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={triggerSendConfirmation}
                  disabled={isLoading || !composeTo.trim() || !composeSubject.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-950/50 transition flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via Gmail</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY Explicit Confirmation Dialog (Per Workspace Integration Skill) */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  confirmDialog.isDestructive
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                {confirmDialog.isDestructive ? (
                  <Trash2 className="w-5 h-5" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </div>
              <h3 className="text-lg font-bold text-white">{confirmDialog.title}</h3>
            </div>

            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {confirmDialog.description}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDialog.onConfirm()}
                className={`px-5 py-2 text-white text-sm font-semibold rounded-xl shadow-lg transition ${
                  confirmDialog.isDestructive
                    ? 'bg-red-600 hover:bg-red-500 shadow-red-900/40'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'
                }`}
              >
                {confirmDialog.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Safe HTML sanitizer helper
function sanitizeHtml(html: string): string {
  // Strip dangerous scripts or iframes while preserving benign formatting
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
