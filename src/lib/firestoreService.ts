import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { COURSES_DATA, Course } from '../data';

export type EnquiryStatus = 'new' | 'contacted' | 'converted' | 'closed';

export interface FirestoreCourse {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  price?: string;
  image?: string;
  category: 'programming' | 'design' | 'digital-marketing' | 'others';
  number?: string;
  createdAt?: any;
}

export interface FirestoreEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  preferredTimeSlot?: string;
  message?: string;
  status: EnquiryStatus;
  createdAt?: any;
}

export interface FirestoreTestimonial {
  id: string;
  name: string;
  course?: string;
  review: string;
  rating: number;
  createdAt?: any;
}

// ================= Courses =================

export async function getCourses(): Promise<FirestoreCourse[]> {
  const path = 'courses';
  try {
    const q = query(collection(db, path));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      // Return hardcoded data formatted as FirestoreCourse if empty
      return COURSES_DATA.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description || '',
        duration: c.duration || '',
        price: '',
        image: '',
        category: c.category,
        number: c.number,
      }));
    }
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<FirestoreCourse, 'id'>),
    }));
  } catch (error) {
    console.warn('Could not fetch courses from Firestore, falling back to static list:', error);
    return COURSES_DATA.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description || '',
      duration: c.duration || '',
      price: '',
      image: '',
      category: c.category,
      number: c.number,
    }));
  }
}

export function subscribeCourses(callback: (courses: FirestoreCourse[]) => void): () => void {
  const path = 'courses';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      if (snapshot.empty) {
        callback(
          COURSES_DATA.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description || '',
            duration: c.duration || '',
            price: '',
            image: '',
            category: c.category,
            number: c.number,
          }))
        );
      } else {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<FirestoreCourse, 'id'>),
        }));
        callback(list);
      }
    },
    (error) => {
      console.warn('Firestore courses subscription fallback to static data:', error);
      callback(
        COURSES_DATA.map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description || '',
          duration: c.duration || '',
          price: '',
          image: '',
          category: c.category,
          number: c.number,
        }))
      );
    }
  );
}

export async function addCourse(course: Omit<FirestoreCourse, 'id' | 'createdAt'>): Promise<string> {
  const path = 'courses';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...course,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateCourse(id: string, updates: Partial<Omit<FirestoreCourse, 'id' | 'createdAt'>>): Promise<void> {
  const path = `courses/${id}`;
  try {
    await updateDoc(doc(db, 'courses', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCourse(id: string): Promise<void> {
  const path = `courses/${id}`;
  try {
    await deleteDoc(doc(db, 'courses', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Helper to seed initial courses into Firestore from existing static data
export async function seedInitialCourses(): Promise<number> {
  let count = 0;
  for (const c of COURSES_DATA) {
    try {
      await addCourse({
        title: c.title,
        description: c.description || '',
        duration: c.duration || '',
        price: 'Contact for fees',
        image: '',
        category: c.category,
        number: c.number,
      });
      count++;
    } catch (e) {
      console.error('Error seeding course:', c.title, e);
    }
  }
  return count;
}

// ================= Enquiries =================

export async function submitEnquiry(data: {
  name: string;
  phone: string;
  email: string;
  course: string;
  preferredTimeSlot?: string;
  message?: string;
}): Promise<string> {
  const path = 'enquiries';

  // Validation
  const trimmedName = data.name.trim();
  const trimmedPhone = data.phone.trim();
  const trimmedEmail = data.email.trim();
  const trimmedCourse = data.course.trim();
  const trimmedPreferredTimeSlot = (data.preferredTimeSlot || '').trim();
  const trimmedMessage = (data.message || '').trim();

  if (!trimmedName || trimmedName.length < 2) {
    throw new Error('Please enter your full name (minimum 2 characters).');
  }

  // Mobile number validation (at least 10 digits)
  const phoneDigits = trimmedPhone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    throw new Error('Please enter a valid 10-digit mobile number.');
  }

  // Email format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    throw new Error('Please enter a valid email address (e.g. name@example.com).');
  }

  if (!trimmedCourse) {
    throw new Error('Please select a course.');
  }

  try {
    const docRef = await addDoc(collection(db, path), {
      name: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail,
      course: trimmedCourse,
      preferredTimeSlot: trimmedPreferredTimeSlot || 'Morning (7 AM - 12 PM)',
      message: trimmedMessage,
      status: 'new' as EnquiryStatus,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeEnquiries(callback: (enquiries: FirestoreEnquiry[]) => void): () => void {
  const path = 'enquiries';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<FirestoreEnquiry, 'id'>),
      }));
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  const path = `enquiries/${id}`;
  try {
    await updateDoc(doc(db, 'enquiries', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteEnquiry(id: string): Promise<void> {
  const path = `enquiries/${id}`;
  try {
    await deleteDoc(doc(db, 'enquiries', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ================= Testimonials =================

export async function getTestimonials(): Promise<FirestoreTestimonial[]> {
  const path = 'testimonials';
  try {
    const q = query(collection(db, path));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<FirestoreTestimonial, 'id'>),
    }));
  } catch (error) {
    console.warn('Could not load testimonials from Firestore:', error);
    return [];
  }
}

export function subscribeTestimonials(callback: (testimonials: FirestoreTestimonial[]) => void): () => void {
  const path = 'testimonials';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<FirestoreTestimonial, 'id'>),
      }));
      callback(list);
    },
    (error) => {
      console.warn('Testimonial subscription error:', error);
    }
  );
}

export async function addTestimonial(testimonial: Omit<FirestoreTestimonial, 'id' | 'createdAt'>): Promise<string> {
  const path = 'testimonials';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...testimonial,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateTestimonial(id: string, updates: Partial<Omit<FirestoreTestimonial, 'id' | 'createdAt'>>): Promise<void> {
  const path = `testimonials/${id}`;
  try {
    await updateDoc(doc(db, 'testimonials', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  const path = `testimonials/${id}`;
  try {
    await deleteDoc(doc(db, 'testimonials', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
