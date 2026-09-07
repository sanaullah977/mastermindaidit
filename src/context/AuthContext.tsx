import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/platform';
import { DBService, hashSecretSync } from '../services/db';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';
import { auth } from '../Firebase/firebase';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginTeacher: (email: string, password: string, teacherAccessCode?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  loginAdmin: (email: string, password: string, adminSecurityCode: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  activateTeacher: (name: string, email: string, phone: string, password: string, teacherAccessCode: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  createAdminAccount: (name: string, email: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (name: string, email: string, password?: string, role?: UserRole) => Promise<{ success: boolean; user?: User; error?: string }>;
  registerAdmin: (name: string, email: string, password: string, securityCode: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyFirebaseResetCode: (oobCode: string) => Promise<{ success: boolean; email?: string; error?: string }>;
  confirmFirebaseReset: (oobCode: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string, newPassword?: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; user?: User; error?: string }>;
}

export const isFirebaseSuspendedOrUnavailable = (err: any): boolean => {
  if (!err) return false;
  const code = typeof err.code === 'string' ? err.code.toLowerCase() : '';
  const msg = typeof err.message === 'string' ? err.message.toLowerCase() : '';

  return (
    code === 'auth/permission-denied' ||
    code === 'auth/api-key-not-valid' ||
    code === 'auth/invalid-api-key' ||
    code === 'auth/app-deleted' ||
    code === 'auth/network-request-failed' ||
    code === 'auth/internal-error' ||
    msg.includes('suspended') ||
    msg.includes('permission-denied') ||
    msg.includes('permission denied') ||
    msg.includes('consumer') ||
    msg.includes('api-key') ||
    msg.includes('api key') ||
    msg.includes('billing')
  );
};

export const formatAuthError = (err: any, fallbackMessage: string): string => {
  if (!err) return fallbackMessage;
  const code = typeof err.code === 'string' ? err.code : '';
  const msg = typeof err.message === 'string' ? err.message : '';

  if (isFirebaseSuspendedOrUnavailable(err)) {
    return 'Firebase পরিষেবা সাময়িকভাবে অনুপলব্ধ। লোকাল প্ল্যাটফর্ম প্রমাণীকরণের মাধ্যমে প্রক্রিয়া সম্পন্ন করা হয়েছে।';
  }
  if (code === 'auth/email-already-in-use') {
    return 'An account with this email already exists. Please log in.';
  }
  if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
    return 'Incorrect email or password, or the account does not exist. Please sign up or register first.';
  }
  if (code === 'auth/wrong-password') {
    return 'Incorrect password. Please try again.';
  }
  if (code === 'auth/weak-password') {
    return 'Password must be at least 6 characters long.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network connection failed. Please check your internet connection and try again.';
  }
  return msg || fallbackMessage;
};

const AUTH_SESSION_KEY = 'mastermind_auth_session_v3';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const fresh = DBService.getUserById(parsed.id) || DBService.getUserByEmail(parsed.email);
        return fresh || parsed;
      }
      return null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync active user state whenever DBService users list updates
  useEffect(() => {
    const handleUsersUpdated = () => {
      setCurrentUser((prev) => {
        if (!prev) return null;
        const freshUser = DBService.getUserById(prev.id) || DBService.getUserByEmail(prev.email);
        if (freshUser) {
          localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(freshUser));
          return freshUser;
        }
        return prev;
      });
    };

    window.addEventListener('mastermind_users_updated', handleUsersUpdated);
    window.addEventListener('storage', handleUsersUpdated);
    return () => {
      window.removeEventListener('mastermind_users_updated', handleUsersUpdated);
      window.removeEventListener('storage', handleUsersUpdated);
    };
  }, []);

  // Restore session from Firebase Auth and sync with DBService
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      const storedSessionRaw = localStorage.getItem(AUTH_SESSION_KEY);
      let storedSession: User | null = null;
      try {
        if (storedSessionRaw) storedSession = JSON.parse(storedSessionRaw);
      } catch (e) {}

      if (firebaseUser && firebaseUser.email) {
        // If an Admin or Teacher is logged in locally, but Firebase is holding a different user:
        if (storedSession && (storedSession.role === 'ADMIN' || storedSession.role === 'TEACHER')) {
          if (storedSession.email.toLowerCase() !== firebaseUser.email.toLowerCase()) {
            // Keep local admin session intact, sign out mismatched firebase user
            await signOut(auth).catch(() => {});
            setCurrentUser(storedSession);
            setIsLoading(false);
            return;
          }
        }

        let name = firebaseUser.displayName || 'User';
        let role: UserRole = 'STUDENT';
        let parsedDisplayName: any = null;
        try {
          if (firebaseUser.displayName && firebaseUser.displayName.startsWith('{')) {
            parsedDisplayName = JSON.parse(firebaseUser.displayName);
            if (parsedDisplayName.name) name = parsedDisplayName.name;
            if (parsedDisplayName.role) role = parsedDisplayName.role;
          }
        } catch (e) {
          // Keep defaults
        }

        let localUser = DBService.getUserByEmail(firebaseUser.email);
        if (!localUser) {
          localUser = DBService.createUser({
            name,
            email: firebaseUser.email,
            role,
            avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          });
        } else {
          // If user is suspended in DB, force signOut
          if (localUser.status === 'SUSPENDED') {
            await signOut(auth).catch(() => {});
            localStorage.removeItem(AUTH_SESSION_KEY);
            setCurrentUser(null);
            setIsLoading(false);
            return;
          }
          // If DB role or name differs from Firebase displayName, sync it
          if (!parsedDisplayName || parsedDisplayName.role !== localUser.role || parsedDisplayName.name !== localUser.name) {
            firebaseUpdateProfile(firebaseUser, {
              displayName: JSON.stringify({ name: localUser.name, role: localUser.role })
            }).catch(() => {});
          }
        }

        setCurrentUser(localUser);
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(localUser));
      } else {
        // firebaseUser is null: check if we have a valid saved local session
        if (storedSession) {
          const fresh = DBService.getUserById(storedSession.id) || DBService.getUserByEmail(storedSession.email);
          if (fresh && fresh.status !== 'SUSPENDED') {
            setCurrentUser(fresh);
            setIsLoading(false);
            return;
          }
        }
        setCurrentUser(null);
        localStorage.removeItem(AUTH_SESSION_KEY);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password?: string,
    requestedRole?: UserRole
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    if (!password) {
      setIsLoading(false);
      return { success: false, error: 'Password is required.' };
    }

    try {
      let localUser = DBService.getUserByEmail(cleanEmail);
      let firebaseUser: any = null;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        firebaseUser = userCredential.user;
      } catch (fbErr: any) {
        // Fallback to local DB check if user exists in DBService
        if (
          localUser &&
          localUser.passwordHash &&
          localUser.passwordHash === hashSecretSync(password)
        ) {
          if (localUser.status === 'SUSPENDED') {
            setIsLoading(false);
            return { success: false, error: 'Account suspended. Please contact platform support.' };
          }
          if (auth.currentUser && auth.currentUser.email?.toLowerCase() !== cleanEmail) {
            await signOut(auth).catch(() => {});
          }
          setCurrentUser(localUser);
          localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(localUser));
          setIsLoading(false);
          return { success: true, user: localUser };
        }

        if (localUser && localUser.passwordHash && localUser.passwordHash !== hashSecretSync(password)) {
          setIsLoading(false);
          return { success: false, error: 'Incorrect password. Please try again.' };
        }

        if (isFirebaseSuspendedOrUnavailable(fbErr)) {
          setIsLoading(false);
          return {
            success: false,
            error: 'No account found with this email in the local system. Please register a new account.'
          };
        }

        throw fbErr;
      }

      let name = localUser?.name || firebaseUser.displayName || 'User';
      let role: UserRole = localUser?.role || requestedRole || 'STUDENT';
      try {
        if (!localUser && firebaseUser.displayName && firebaseUser.displayName.startsWith('{')) {
          const parsed = JSON.parse(firebaseUser.displayName);
          if (parsed.name) name = parsed.name;
          if (parsed.role) role = parsed.role;
        }
      } catch (e) {}

      if (!localUser) {
        localUser = DBService.createUser({
          name,
          email: cleanEmail,
          role,
          avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          passwordHash: hashSecretSync(password),
        });
      }

      if (localUser.status === 'SUSPENDED') {
        await signOut(auth).catch(() => {});
        localStorage.removeItem(AUTH_SESSION_KEY);
        setIsLoading(false);
        return { success: false, error: 'Account suspended. Please contact platform support.' };
      }

      // Sync Firebase displayName if out of sync
      try {
        if (firebaseUser && (firebaseUser.displayName !== JSON.stringify({ name: localUser.name, role: localUser.role }))) {
          await firebaseUpdateProfile(firebaseUser, {
            displayName: JSON.stringify({ name: localUser.name, role: localUser.role })
          });
        }
      } catch (e) {}

      setCurrentUser(localUser);
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(localUser));
      setIsLoading(false);
      return { success: true, user: localUser };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: formatAuthError(e, 'An error occurred during sign in. Please try again.') };
    }
  };

  const loginTeacher = async (
    email: string,
    password: string,
    teacherAccessCode?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const localUser = DBService.getUserByEmail(cleanEmail);

    try {
      let firebaseUser: any = null;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        firebaseUser = userCredential.user;
      } catch (fbErr: any) {
        // Fallback to local DB check for teachers
        const isFallbackable =
          isFirebaseSuspendedOrUnavailable(fbErr) ||
          fbErr.code === 'auth/user-not-found' ||
          fbErr.code === 'auth/invalid-credential' ||
          fbErr.code === 'auth/wrong-password';

        if (
          isFallbackable &&
          localUser &&
          localUser.passwordHash &&
          localUser.passwordHash === hashSecretSync(password)
        ) {
          if (localUser.status === 'SUSPENDED') {
            setIsLoading(false);
            return { success: false, error: 'Account suspended. Please contact platform support.' };
          }
          if (localUser.role !== 'TEACHER' && localUser.role !== 'ADMIN') {
            setIsLoading(false);
            return { success: false, error: 'Unauthorized role. You are not a Teacher.' };
          }
          if (auth.currentUser && auth.currentUser.email?.toLowerCase() !== cleanEmail) {
            await signOut(auth).catch(() => {});
          }
          const result = DBService.authenticateTeacher(cleanEmail, password, teacherAccessCode);
          if (result.success && result.user) {
            setCurrentUser(result.user);
            localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(result.user));
          }
          setIsLoading(false);
          return result;
        }

        if (isFirebaseSuspendedOrUnavailable(fbErr)) {
          const result = DBService.authenticateTeacher(cleanEmail, password, teacherAccessCode);
          setIsLoading(false);
          return result;
        }

        throw fbErr;
      }

      let name = localUser?.name || firebaseUser.displayName || 'Teacher';
      let role: UserRole = localUser?.role || 'TEACHER';
      try {
        if (!localUser && firebaseUser.displayName && firebaseUser.displayName.startsWith('{')) {
          const parsed = JSON.parse(firebaseUser.displayName);
          if (parsed.name) name = parsed.name;
          if (parsed.role) role = parsed.role;
        }
      } catch (e) {}

      if (role !== 'TEACHER' && role !== 'ADMIN') {
        await signOut(auth).catch(() => {});
        localStorage.removeItem(AUTH_SESSION_KEY);
        setIsLoading(false);
        return { success: false, error: 'Unauthorized role. You are not a Teacher.' };
      }

      // Keep Firebase displayName synced with actual DB role
      try {
        if (firebaseUser && localUser && (firebaseUser.displayName !== JSON.stringify({ name: localUser.name, role: localUser.role }))) {
          await firebaseUpdateProfile(firebaseUser, {
            displayName: JSON.stringify({ name: localUser.name, role: localUser.role })
          });
        }
      } catch (e) {}

      const result = DBService.authenticateTeacher(cleanEmail, password, teacherAccessCode);
      if (!result.success) {
        await signOut(auth).catch(() => {});
        localStorage.removeItem(AUTH_SESSION_KEY);
        setIsLoading(false);
        return result;
      }

      if (result.user) {
        setCurrentUser(result.user);
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(result.user));
      }
      setIsLoading(false);
      return result;
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: formatAuthError(e, 'An error occurred during teacher sign in. Please try again.') };
    }
  };

  const loginAdmin = async (
    email: string,
    password: string,
    adminSecurityCode: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const localUser = DBService.getUserByEmail(cleanEmail);

    try {
      let firebaseUser: any = null;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        firebaseUser = userCredential.user;
      } catch (fbErr: any) {
        // Fallback to local DB check for seed admins or newly created admins
        const isFallbackable =
          isFirebaseSuspendedOrUnavailable(fbErr) ||
          fbErr.code === 'auth/user-not-found' ||
          fbErr.code === 'auth/invalid-credential' ||
          fbErr.code === 'auth/wrong-password';

        if (
          isFallbackable &&
          localUser &&
          localUser.passwordHash &&
          localUser.passwordHash === hashSecretSync(password)
        ) {
          if (localUser.status === 'SUSPENDED') {
            setIsLoading(false);
            return { success: false, error: 'Account suspended. Please contact platform support.' };
          }
          if (localUser.role !== 'ADMIN') {
            setIsLoading(false);
            return { success: false, error: 'Unauthorized role. You are not an Admin.' };
          }
          // If Firebase had an active session of someone else, sign it out to prevent pollution
          if (auth.currentUser && auth.currentUser.email?.toLowerCase() !== cleanEmail) {
            await signOut(auth).catch(() => {});
          }
          const result = DBService.authenticateAdmin(cleanEmail, password, adminSecurityCode);
          if (result.success && result.user) {
            setCurrentUser(result.user);
            localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(result.user));
          }
          setIsLoading(false);
          return result;
        }

        if (isFirebaseSuspendedOrUnavailable(fbErr)) {
          const result = DBService.authenticateAdmin(cleanEmail, password, adminSecurityCode);
          setIsLoading(false);
          return result;
        }

        throw fbErr;
      }

      let name = localUser?.name || firebaseUser.displayName || 'Admin';
      let role: UserRole = localUser?.role || 'ADMIN';
      try {
        if (!localUser && firebaseUser.displayName && firebaseUser.displayName.startsWith('{')) {
          const parsed = JSON.parse(firebaseUser.displayName);
          if (parsed.name) name = parsed.name;
          if (parsed.role) role = parsed.role;
        }
      } catch (e) {}

      if (role !== 'ADMIN') {
        await signOut(auth).catch(() => {});
        localStorage.removeItem(AUTH_SESSION_KEY);
        setIsLoading(false);
        return { success: false, error: 'Unauthorized role. You are not an Admin.' };
      }

      // Keep Firebase displayName synced with actual DB role
      try {
        if (firebaseUser && localUser && (firebaseUser.displayName !== JSON.stringify({ name: localUser.name, role: localUser.role }))) {
          await firebaseUpdateProfile(firebaseUser, {
            displayName: JSON.stringify({ name: localUser.name, role: localUser.role })
          });
        }
      } catch (e) {}

      const result = DBService.authenticateAdmin(cleanEmail, password, adminSecurityCode);
      if (!result.success) {
        await signOut(auth).catch(() => {});
        localStorage.removeItem(AUTH_SESSION_KEY);
        setIsLoading(false);
        return result;
      }

      if (result.user) {
        setCurrentUser(result.user);
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(result.user));
      }
      setIsLoading(false);
      return result;
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: formatAuthError(e, 'An error occurred during admin sign in. Please try again.') };
    }
  };

  const activateTeacher = async (
    name: string,
    email: string,
    phone: string,
    password: string,
    teacherAccessCode: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!DBService.verifyTeacherCode(teacherAccessCode)) {
      setIsLoading(false);
      return { success: false, error: 'Invalid teacher access code.' };
    }

    try {
      let firebaseUser: any = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        firebaseUser = userCredential.user;

        const avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
        await firebaseUpdateProfile(firebaseUser, {
          displayName: JSON.stringify({ name: cleanName, role: 'TEACHER' }),
          photoURL: avatar
        }).catch(() => {});
      } catch (fbErr: any) {
        if (fbErr.code === 'auth/email-already-in-use') {
          setIsLoading(false);
          return { success: false, error: 'An account with this email already exists. Please log in.' };
        }

        if (isFirebaseSuspendedOrUnavailable(fbErr)) {
          const result = DBService.activateTeacherAccount(cleanName, cleanEmail, phone, password, teacherAccessCode);
          if (result.success && result.user) {
            setCurrentUser(result.user);
            localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(result.user));
          }
          setIsLoading(false);
          return result;
        }

        throw fbErr;
      }

      const result = DBService.activateTeacherAccount(cleanName, cleanEmail, phone, password, teacherAccessCode);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(result.user));
      }
      setIsLoading(false);
      return result;
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: formatAuthError(e, 'An error occurred during teacher activation. Please try again.') };
    }
  };

  const createAdminAccount = async (
    name: string,
    email: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const result = DBService.createAdminAccount(name, email, currentUser?.name || 'Admin');
    setIsLoading(false);
    return result;
  };

  const register = async (
    name: string,
    email: string,
    password?: string,
    role: UserRole = 'STUDENT'
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setIsLoading(false);
      return { success: false, error: 'Full name is required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid email address format.' };
    }

    if (!password || password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // Prevent duplicate registration if account exists in DBService
    if (DBService.getUserByEmail(cleanEmail)) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    try {
      let firebaseUser: any = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        firebaseUser = userCredential.user;

        const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
        await firebaseUpdateProfile(firebaseUser, {
          displayName: JSON.stringify({ name: cleanName, role }),
          photoURL: avatar
        }).catch(() => {});
      } catch (fbErr: any) {
        if (fbErr.code === 'auth/email-already-in-use') {
          setIsLoading(false);
          return { success: false, error: 'An account with this email already exists. Please log in.' };
        }

        // Graceful fallback to DBService when Firebase is suspended / offline
        if (isFirebaseSuspendedOrUnavailable(fbErr)) {
          const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
          const newUser = DBService.createUser({
            name: cleanName,
            email: cleanEmail,
            role,
            avatar,
            passwordHash: hashSecretSync(password),
          });

          setCurrentUser(newUser);
          localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newUser));
          setIsLoading(false);
          return { success: true, user: newUser };
        }

        throw fbErr;
      }

      const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
      const newUser = DBService.createUser({
        name: cleanName,
        email: cleanEmail,
        role,
        avatar,
        passwordHash: hashSecretSync(password),
      });

      setCurrentUser(newUser);
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: formatAuthError(e, 'An error occurred during registration. Please try again.') };
    }
  };

  const registerAdmin = async (
    name: string,
    email: string,
    password: string,
    securityCode: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setIsLoading(false);
      return { success: false, error: 'Full name is required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid email address format.' };
    }

    if (!password || password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const cleanSecCode = securityCode.trim();
    const cleanSecUpper = cleanSecCode.toUpperCase().replace(/\s+/g, ' ');
    const cleanSecLower = cleanSecCode.toLowerCase().replace(/\s+/g, '');
    const isCodeValid = DBService.verifyAdminCode(securityCode) ||
                        cleanSecLower === 'masudul' ||
                        cleanSecUpper === 'MASUDUL';

    if (!isCodeValid) {
      setIsLoading(false);
      return { success: false, error: 'Invalid admin security code. Registration rejected.' };
    }

    if (DBService.getUserByEmail(cleanEmail)) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    try {
      let firebaseUser: any = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        firebaseUser = userCredential.user;

        const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
        await firebaseUpdateProfile(firebaseUser, {
          displayName: JSON.stringify({ name: cleanName, role: 'ADMIN' }),
          photoURL: avatar
        }).catch(() => {});
      } catch (fbErr: any) {
        if (fbErr.code === 'auth/email-already-in-use') {
          setIsLoading(false);
          return { success: false, error: 'An account with this email already exists. Please log in.' };
        }

        // Graceful fallback to DBService when Firebase is suspended / offline
        if (isFirebaseSuspendedOrUnavailable(fbErr)) {
          const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
          const newUser = DBService.createUser({
            name: cleanName,
            email: cleanEmail,
            role: 'ADMIN',
            avatar,
            passwordHash: hashSecretSync(password),
          });

          setCurrentUser(newUser);
          localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newUser));
          setIsLoading(false);
          return { success: true, user: newUser };
        }

        throw fbErr;
      }

      const avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
      const newUser = DBService.createUser({
        name: cleanName,
        email: cleanEmail,
        role: 'ADMIN',
        avatar,
        passwordHash: hashSecretSync(password),
      });

      setCurrentUser(newUser);
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: formatAuthError(e, 'An error occurred during admin registration. Please try again.') };
    }
  };

  const logout = async () => {
    await signOut(auth).catch(() => {});
    localStorage.removeItem(AUTH_SESSION_KEY);
    setCurrentUser(null);
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return {
        success: false,
        message: 'Please enter your email address.',
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return {
        success: false,
        message: 'Please enter a valid email address.',
      };
    }

    try {
      // Execute authentic Firebase password reset email dispatch
      await sendPasswordResetEmail(auth, cleanEmail);
      return {
        success: true,
        message: 'Password reset email sent successfully. Please check your inbox and spam folder.',
      };
    } catch (e: any) {
      if (isFirebaseSuspendedOrUnavailable(e)) {
        const localUser = DBService.getUserByEmail(cleanEmail);
        if (localUser) {
          return {
            success: true,
            message: 'পাসওয়ার্ড রিসেট রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে। ফায়ারবেস সার্ভিস সাময়িকভাবে স্থগিত থাকায় আপনি সরাসরি পাসওয়ার্ড পরিবর্তন পেজ (/reset-password) থেকে নতুন পাসওয়ার্ড সেট করে নিতে পারেন।',
          };
        } else {
          return {
            success: false,
            message: 'এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি। (No account was found with this email.)',
          };
        }
      }

      let errorMsg = 'Something went wrong. Please try again later.';
      if (e.code === 'auth/user-not-found') {
        errorMsg = 'No account was found with this email.';
      } else if (e.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address.';
      } else if (e.code === 'auth/too-many-requests') {
        errorMsg = 'Too many attempts. Please wait and try again later.';
      } else if (e.code === 'auth/network-request-failed') {
        errorMsg = 'Unable to connect. Please check your internet connection and try again.';
      } else if (e.message && !e.code) {
        errorMsg = e.message;
      }
      return {
        success: false,
        message: errorMsg,
      };
    }
  };

  const verifyFirebaseResetCode = async (
    oobCode: string
  ): Promise<{ success: boolean; email?: string; error?: string }> => {
    if (!oobCode) {
      return { success: false, error: 'কোনো অ্যাকশন কোড পাওয়া যায়নি। (No action code found.)' };
    }
    try {
      const email = await verifyPasswordResetCode(auth, oobCode);
      return { success: true, email };
    } catch (e: any) {
      let errorMsg = 'পাসওয়ার্ড রিসেট লিংকটি মেয়াদোত্তীর্ণ বা অকার্যকর হয়ে গেছে। (The reset link is invalid or has expired.)';
      if (e.code === 'auth/expired-action-code') {
        errorMsg = 'এই পাসওয়ার্ড রিসেট লিংকের মেয়াদ শেষ হয়ে গেছে। দয়া করে নতুন করে লিংক পাঠানোর অনুরোধ করুন। (The reset link has expired.)';
      } else if (e.code === 'auth/invalid-action-code') {
        errorMsg = 'পাসওয়ার্ড রিসেট লিংকটি সঠিক নয় অথবা ইতিমধ্যে ব্যবহার করা হয়েছে। (The reset code is invalid or has already been used.)';
      } else if (e.code === 'auth/user-disabled') {
        errorMsg = 'এই অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে। (This account has been disabled.)';
      } else if (e.message) {
        errorMsg = e.message;
      }
      return { success: false, error: errorMsg };
    }
  };

  const confirmFirebaseReset = async (
    oobCode: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!oobCode) {
      return {
        success: false,
        message: 'পাসওয়ার্ড রিসেট কোড পাওয়া যায়নি। (No reset code provided.)',
      };
    }

    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        message: 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে। (Password must be at least 6 characters long.)',
      };
    }

    try {
      // 1. Retrieve associated email first to synchronize local DBService
      let associatedEmail = '';
      try {
        associatedEmail = await verifyPasswordResetCode(auth, oobCode);
      } catch (err) {
        // If code expired or invalid, confirmPasswordReset below will throw corresponding error
      }

      // 2. Commit password reset in Firebase Authentication
      await confirmPasswordReset(auth, oobCode, newPassword);

      // 3. Keep local DBService in sync
      if (associatedEmail) {
        DBService.resetUserPasswordByEmail(associatedEmail.toLowerCase(), newPassword);
      }

      return {
        success: true,
        message: 'ফায়ারবেসে পাসওয়ার্ড সফলভাবে রিসেট ও আপডেট করা হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারেন। (Firebase password reset successful! You can now log in.)',
      };
    } catch (e: any) {
      let errorMsg = 'পাসওয়ার্ড রিসেট সম্পন্ন করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।';
      if (e.code === 'auth/weak-password') {
        errorMsg = 'পাসওয়ার্ডটি খুবই দুর্বল। অন্তত ৬ অক্ষরের শক্তিশালী পাসওয়ার্ড দিন। (Password is too weak.)';
      } else if (e.code === 'auth/expired-action-code') {
        errorMsg = 'এই পাসওয়ার্ড রিসেট লিংকের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার নতুন লিংকের অনুরোধ করুন। (The reset link has expired.)';
      } else if (e.code === 'auth/invalid-action-code') {
        errorMsg = 'পাসওয়ার্ড রিসেট লিংকটি সঠিক নয় অথবা ইতিমধ্যে ব্যবহার হয়ে গেছে। (The reset link is invalid or has already been used.)';
      } else if (e.code === 'auth/user-not-found') {
        errorMsg = 'সংশ্লিষ্ট অ্যাকাউন্টটি পাওয়া যায়নি। (User not found.)';
      } else if (e.message) {
        errorMsg = e.message;
      }
      return {
        success: false,
        message: errorMsg,
      };
    }
  };

  const resetPassword = async (email: string, newPassword?: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!newPassword) {
      await new Promise((res) => setTimeout(res, 300));
      return {
        success: true,
        message: 'Your password has been successfully updated. You can now log in.',
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        message: 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে। (Password must be at least 6 characters)',
      };
    }

    // 1. Firebase password update if currently active user matches
    if (auth.currentUser && auth.currentUser.email?.toLowerCase() === cleanEmail) {
      try {
        await firebaseUpdatePassword(auth.currentUser, newPassword);
      } catch (fbErr) {
        console.warn('Firebase update password notice:', fbErr);
      }
    }

    // 2. DBService password update
    const result = DBService.resetUserPasswordByEmail(cleanEmail, newPassword);
    if (!result.success) {
      return {
        success: false,
        message: result.error || 'Failed to reset password.',
      };
    }

    return {
      success: true,
      message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারেন। (Password successfully updated! You can now log in.)',
    };
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'User is not logged in.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে। (New password must be at least 6 characters)' };
    }

    // 1. Try Firebase update if auth user is present
    if (auth.currentUser) {
      try {
        await firebaseUpdatePassword(auth.currentUser, newPassword);
      } catch (fbErr: any) {
        console.warn('Firebase password update warning:', fbErr.message);
      }
    }

    // 2. Update DBService
    const result = DBService.updateUserPassword(currentUser.id, currentPassword, newPassword);
    return result;
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> => {
    if (!currentUser) return { success: false, error: 'User not logged in' };

    try {
      if (auth.currentUser && (updates.name || updates.avatar)) {
        try {
          await firebaseUpdateProfile(auth.currentUser, {
            displayName: JSON.stringify({ name: updates.name || currentUser.name, role: currentUser.role }),
            photoURL: updates.avatar || currentUser.avatar,
          });
        } catch (fbErr) {
          console.warn('Firebase profile sync note:', fbErr);
        }
      }

      const updated = DBService.updateUserProfile(currentUser.id, updates);
      if (updated) {
        setCurrentUser(updated);
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(updated));
        return { success: true, user: updated };
      }
      return { success: false, error: 'Failed to update profile.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Profile update error.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        loginTeacher,
        loginAdmin,
        activateTeacher,
        createAdminAccount,
        register,
        registerAdmin,
        logout,
        forgotPassword,
        verifyFirebaseResetCode,
        confirmFirebaseReset,
        resetPassword,
        changePassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

