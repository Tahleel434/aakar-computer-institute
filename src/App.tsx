import React, { useState, useEffect } from 'react';
import { BackgroundScrollAnimation } from './components/BackgroundScrollAnimation';
import { TopSignboardBanner } from './components/TopSignboardBanner';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { WhyAakar } from './components/WhyAakar';
import { CoursesSection } from './components/CoursesSection';
import { AakarDifference } from './components/AakarDifference';
import { StudentStories } from './components/StudentStories';
import { LocationSection } from './components/LocationSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { FadeInSection } from './components/FadeInSection';
import { GoogleReviewsModal } from './components/GoogleReviewsModal';
import { EnquiryModal } from './components/EnquiryModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { Course, COURSES_DATA } from './data';
import { AuthProvider } from './lib/authContext';
import {
  FirestoreCourse,
  FirestoreTestimonial,
  subscribeCourses,
  subscribeTestimonials,
} from './lib/firestoreService';

function MainApp() {
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | FirestoreCourse | null>(null);

  // Dynamic collections from Firestore
  const [courses, setCourses] = useState<FirestoreCourse[]>([]);
  const [testimonials, setTestimonials] = useState<FirestoreTestimonial[]>([]);

  useEffect(() => {
    // Real-time Firestore courses subscription
    const unsubCourses = subscribeCourses((list) => {
      if (list && list.length > 0) {
        setCourses(list);
      }
    });

    // Real-time Firestore testimonials subscription
    const unsubTestimonials = subscribeTestimonials((list) => {
      setTestimonials(list);
    });

    return () => {
      unsubCourses();
      unsubTestimonials();
    };
  }, []);

  const handleOpenDemoModal = () => {
    setSelectedCourse(null);
    setIsEnquiryOpen(true);
  };

  const handleCourseEnquiry = (course: Course | FirestoreCourse) => {
    setSelectedCourse(course);
    setIsEnquiryOpen(true);
  };

  const handleOpenCallModal = () => {
    window.location.href = 'tel:09821085899';
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col font-sans relative selection:bg-blue-600 selection:text-white overflow-x-hidden w-full">
      {/* Scroll-Driven Earth to Aakar Institute Video & Imagery Animation */}
      <BackgroundScrollAnimation />

      {/* Official Signboard Banner & Accreditations on Top */}
      <TopSignboardBanner />

      {/* Top Navigation */}
      <Navbar
        onOpenCallModal={handleOpenCallModal}
        onOpenReviews={() => setIsReviewsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <FadeInSection>
          <Hero
            onOpenDemoModal={handleOpenDemoModal}
            onOpenReviews={() => setIsReviewsOpen(true)}
          />
        </FadeInSection>

        {/* Stats / Numbers Bar */}
        <FadeInSection>
          <StatsBar onOpenReviews={() => setIsReviewsOpen(true)} />
        </FadeInSection>

        {/* Why Aakar / Training built around doing */}
        <FadeInSection>
          <WhyAakar />
        </FadeInSection>

        {/* Explore Courses / Find the right skill path (dynamic Firestore catalog) */}
        <FadeInSection>
          <CoursesSection
            onSelectCourse={handleCourseEnquiry}
            courses={courses}
          />
        </FadeInSection>

        {/* The Aakar Difference / 6 Core Features */}
        <FadeInSection>
          <AakarDifference />
        </FadeInSection>

        {/* Student Stories / Google Reviews & Firestore Testimonials */}
        <FadeInSection>
          <StudentStories
            onOpenReviews={() => setIsReviewsOpen(true)}
            testimonials={testimonials}
          />
        </FadeInSection>

        {/* Location & Map / Practical learning right here in Kurla */}
        <FadeInSection>
          <LocationSection />
        </FadeInSection>

        {/* CTA Banner / Book your free demo class */}
        <FadeInSection>
          <CtaBanner onOpenDemoModal={handleOpenDemoModal} />
        </FadeInSection>
      </main>

      {/* Footer */}
      <FadeInSection>
        <Footer
          onOpenReviews={() => setIsReviewsOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </FadeInSection>

      {/* Google Reviews Drawer Modal */}
      <GoogleReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
      />

      {/* Demo Booking & Course Enquiry Modal connected to Firestore */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        selectedCourse={selectedCourse}
        coursesList={courses}
      />

      {/* Protected Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Floating WhatsApp Contact Button */}
      <FloatingWhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

