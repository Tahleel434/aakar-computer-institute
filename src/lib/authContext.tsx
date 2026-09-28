import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import {
  GMAIL_SCOPES,
  setCachedGmailToken,
  getCachedGmailToken,
  connectGmailOAuth,
} from './gmailService';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  connectGmail: () => Promise<string>;
  gmailToken: string | null;
  isGmailConnected: boolean;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {},
  connectGmail: async () => '',
  gmailToken: null,
  isGmailConnected: false,
  signOut: async () => {},
  error: null,
});

export const ADMIN_EMAILS = [
  'tahleel.shikalgar@gmail.com',
  'aakaroffice99@gmail.com',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [gmailToken, setGmailToken] = useState<string | null>(getCachedGmailToken());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is in authorized emails list
        const isEmailAdmin =
          !!currentUser.email &&
          ADMIN_EMAILS.some((adm) => adm.toLowerCase() === currentUser.email?.toLowerCase());

        let isDocAdmin = false;
        try {
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          if (adminDoc.exists()) {
            isDocAdmin = true;
          } else if (isEmailAdmin) {
            // Auto-provision admin doc if matching primary owner email
            await setDoc(doc(db, 'admins', currentUser.uid), {
              email: currentUser.email,
              role: 'admin',
              createdAt: serverTimestamp(),
            });
            isDocAdmin = true;
          }
        } catch (e) {
          console.warn('Admin check error:', e);
        }

        setIsAdmin(isEmailAdmin || isDocAdmin);
      } else {
        setIsAdmin(false);
        setCachedGmailToken(null, null);
        setGmailToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      GMAIL_SCOPES.forEach((scope) => provider.addScope(scope));
      provider.setCustomParameters({
        prompt: 'select_account',
        login_hint: 'aakaroffice99@gmail.com',
      });

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken || null;

      if (token) {
        setCachedGmailToken(token, result.user.email);
        setGmailToken(token);
      }
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setError(err?.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  const connectGmail = async (): Promise<string> => {
    setError(null);
    try {
      const { token } = await connectGmailOAuth();
      setGmailToken(token);
      return token;
    } catch (err: any) {
      console.error('Gmail OAuth Connect Error:', err);
      setError(err?.message || 'Failed to connect Gmail account');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setIsAdmin(false);
      setCachedGmailToken(null, null);
      setGmailToken(null);
    } catch (err: any) {
      console.error('Sign Out Error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signInWithGoogle,
        connectGmail,
        gmailToken,
        isGmailConnected: !!gmailToken,
        signOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
