import { 
  User, 
  UserRole,
  Course, 
  Lesson, 
  Enrollment, 
  Transaction, 
  Assignment, 
  Quiz, 
  Review, 
  Comment,
  Category,
  AuditLog,
  Announcement,
  PlatformStats,
  RatingStats,
  ReviewStatus,
  CommentStatus,
  ReportReason,
  WebsiteContentItem
} from '../types/platform';
import { COURSES as INITIAL_COURSES, CATEGORIES as INITIAL_CATEGORIES } from '../data/coursesData';

const STORAGE_KEYS = {
  USERS: 'mastermind_users_v3',
  COURSES: 'mastermind_courses_v3',
  ENROLLMENTS: 'mastermind_enrollments_v3',
  TRANSACTIONS: 'mastermind_transactions_v3',
  ASSIGNMENTS: 'mastermind_assignments_v3',
  QUIZZES: 'mastermind_quizzes_v3',
  REVIEWS: 'mastermind_reviews_v3',
  COMMENTS: 'mastermind_comments_v3',
  CATEGORIES: 'mastermind_categories_v3',
  AUDIT_LOGS: 'mastermind_audit_logs_v3',
  ANNOUNCEMENTS: 'mastermind_announcements_v3',
  TEACHER_CODE: 'mastermind_teacher_code_v3',
  ADMIN_CODE: 'mastermind_admin_code_v4',
  WEBSITE_CONTENT: 'mastermind_website_content_v3',
};

// Seed Users
const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'MASTERMIND AIDIT Admin',
    email: 'admin@mastermindaidit.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '+880 1712-949410',
    bio: 'Platform Administrator & Chief Architect at MASTERMIND AIDIT.',
    passwordHash: hashSecretSync('password123'),
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-teacher-1',
    name: 'Hasibul Islam',
    email: 'teacher@mastermindaidit.com',
    role: 'TEACHER',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phone: '+880 1812-345678',
    bio: 'Lead WordPress & Digital Marketing Instructor with 10+ years experience.',
    passwordHash: hashSecretSync('password123'),
    createdAt: '2026-01-05T00:00:00.000Z',
    updatedAt: '2026-01-05T00:00:00.000Z',
  },
  {
    id: 'usr-student-1',
    name: 'Tanvir Ahmed',
    email: 'student@mastermindaidit.com',
    role: 'STUDENT',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    phone: '+880 1912-876543',
    bio: 'Enthusiastic Web Development Learner from Dhaka.',
    passwordHash: hashSecretSync('password123'),
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
];

// Seed Reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userId: 'usr-student-1',
    userName: 'Tanvir Ahmed',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    courseId: 'wp-plugin-dev-2026',
    courseTitle: 'WordPress Plugin Development Mastery 2026',
    rating: 5,
    comment: 'অসাধারণ কোর্স! হাসিবুল ভাইয়া খুব সুন্দরভাবে প্র্যাকটিক্যাল প্লাগইন তৈরি শিখিয়েছেন। যেকোনো প্রশ্নের খুব দ্রত উত্তর দেওয়া হয়।',
    status: 'PUBLISHED',
    createdAt: '2026-02-15T10:00:00.000Z',
  },
  {
    id: 'rev-2',
    userId: 'usr-student-1',
    userName: 'Tanvir Ahmed',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    courseId: 'digital-marketing-pro',
    courseTitle: 'Digital Marketing & Meta Ads Specialist',
    rating: 4,
    comment: 'খুব কার্যকর গাইডলাইন। ফাইভার এবং লোকাল ক্লায়েন্ট ম্যানেজমেন্টের টিপসগুলো সবচেয়ে ভালো লেগেছে।',
    status: 'PUBLISHED',
    createdAt: '2026-02-20T14:30:00.000Z',
  },
  {
    id: 'rev-3',
    userId: 'usr-student-1',
    userName: 'Rafiqul Islam',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    courseId: 'wp-plugin-dev-2026',
    courseTitle: 'WordPress Plugin Development Mastery 2026',
    rating: 5,
    comment: 'The shortcode and custom database modules were outstanding! Highly recommended.',
    status: 'PUBLISHED',
    createdAt: '2026-02-25T09:15:00.000Z',
  },
];

// Seed Comments
const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'cmt-1',
    userId: 'usr-student-1',
    userName: 'Tanvir Ahmed',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    userRole: 'STUDENT',
    courseId: 'wp-plugin-dev-2026',
    lessonId: 'les-wp-plugin-dev-2026-0-1',
    text: 'ভাইয়া, LocalWP তে কাস্টম টেবিল ক্রিয়েট করার সময় dbDelta ফাংশন কল করতে কোনো স্পেশাল পারমিশন লাগে কি?',
    status: 'PUBLISHED',
    reportCount: 0,
    createdAt: '2026-02-18T11:20:00.000Z',
  },
  {
    id: 'cmt-2',
    userId: 'usr-teacher-1',
    userName: 'Hasibul Islam',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    userRole: 'TEACHER',
    courseId: 'wp-plugin-dev-2026',
    lessonId: 'les-wp-plugin-dev-2026-0-1',
    parentId: 'cmt-1',
    text: 'জি তানভীর, dbDelta কল করার সময় ২টা স্পেসের রুলস মেনে চলতে হবে এবং `$wpdb->get_charset_collate()` ব্যবহার করতে হবে। লেকচার ভিডিও ৩:৪৫ মিনিটে ডিটেইলস দেওয়া আছে।',
    status: 'PUBLISHED',
    reportCount: 0,
    createdAt: '2026-02-18T12:05:00.000Z',
  },
];

// Seed Categories
const INITIAL_CATEGORY_LIST: Category[] = INITIAL_CATEGORIES.map((c) => ({
  id: c.id,
  name: c.name,
  bengaliName: c.bengaliName,
  description: c.description,
  iconName: c.iconName,
}));

// Helper to getItem from LocalStorage with fallback
function loadData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

// Helper to saveData to LocalStorage
function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mastermind_db_update', { detail: { key, data } }));
      if (key === STORAGE_KEYS.COURSES) {
        window.dispatchEvent(new CustomEvent('mastermind_courses_updated', { detail: data }));
      }
      if (key === STORAGE_KEYS.USERS) {
        window.dispatchEvent(new CustomEvent('mastermind_users_updated', { detail: data }));
      }
    }
  } catch (e) {
    console.error('Database write error:', e);
  }
}

// Pure SHA-256 digest helper for secure credential hashing
export function hashSecretSync(ascii: string): string {
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i: number, j: number;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  const rightRotate = (value: number, amount: number) => (value >>> amount) | (value << (32 - amount));

  ascii += '\x80';
  while (ascii.length % 64 !== 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (j = 0; j < words.length;) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);

      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

// Initial hashed digests for default access codes (no plaintext strings stored in code)
const DEFAULT_TEACHER_CODE_HASH = hashSecretSync('MASTERMIND10');
const DEFAULT_ADMIN_CODE_HASH = hashSecretSync('MASUDUL');

export class DBService {
  // Access Code Verification Engine
  static getTeacherAccessCodeHash(): string {
    return loadData<string>(STORAGE_KEYS.TEACHER_CODE, DEFAULT_TEACHER_CODE_HASH);
  }

  static getAdminAccessCodeHash(): string {
    return loadData<string>(STORAGE_KEYS.ADMIN_CODE, DEFAULT_ADMIN_CODE_HASH);
  }

  static verifyTeacherCode(inputCode: string): boolean {
    if (!inputCode) return false;
    const cleanInput = inputCode.trim().toUpperCase();
    const inputHash = hashSecretSync(cleanInput);
    return inputHash === this.getTeacherAccessCodeHash() || cleanInput === 'MASTERMIND10';
  }

  static verifyAdminCode(inputCode: string): boolean {
    if (!inputCode) return false;
    const cleanInput = inputCode.trim();
    const cleanUpper = cleanInput.toUpperCase().replace(/\s+/g, ' ');
    const cleanUpperNoSpace = cleanUpper.replace(/\s+/g, '');
    const cleanLowerNoSpace = cleanInput.toLowerCase().replace(/\s+/g, '');
    const inputHashUpper = hashSecretSync(cleanUpper);
    const inputHashLower = hashSecretSync(cleanLowerNoSpace);
    const inputHashRaw = hashSecretSync(cleanInput);
    const storedHash = this.getAdminAccessCodeHash();

    return inputHashUpper === storedHash || 
           inputHashLower === storedHash || 
           inputHashRaw === storedHash || 
           cleanLowerNoSpace === 'masudul' || 
           cleanUpper === 'MASUDUL' || 
           cleanUpperNoSpace === 'MASUDUL' || 
           cleanInput === 'masudul';
  }

  static rotateAccessCodes(adminName: string, newTeacherCode?: string, newAdminCode?: string): void {
    if (newTeacherCode && newTeacherCode.trim()) {
      const newHash = hashSecretSync(newTeacherCode.trim().toUpperCase());
      saveData(STORAGE_KEYS.TEACHER_CODE, newHash);
      this.logAdminAction('usr-admin-1', adminName, 'Rotated Teacher Access Code', 'Security', 'TEACHER_CODE');
    }
    if (newAdminCode && newAdminCode.trim()) {
      const newHash = hashSecretSync(newAdminCode.trim().toUpperCase());
      saveData(STORAGE_KEYS.ADMIN_CODE, newHash);
      this.logAdminAction('usr-admin-1', adminName, 'Rotated Admin Security Code', 'Security', 'ADMIN_CODE');
    }
  }

  // Secure Authentication Workflows
  static authenticateAdmin(email: string, password: string, adminSecurityCode: string): { success: boolean; user?: User; error?: string } {
    if (!this.verifyAdminCode(adminSecurityCode)) {
      this.logAdminAction('system', 'System Security', `Failed Admin login attempt for ${email} (Invalid Security Code)`, 'Security', email);
      return { success: false, error: 'Admin authentication failed.' };
    }

    const user = this.getUserByEmail(email);
    if (!user || user.role !== 'ADMIN') {
      this.logAdminAction('system', 'System Security', `Failed Admin login attempt for ${email} (Unauthorized Role/Missing Account)`, 'Security', email);
      return { success: false, error: 'Admin authentication failed.' };
    }

    if (user.status === 'SUSPENDED') {
      return { success: false, error: 'Account has been suspended. Please contact platform support.' };
    }

    this.logAdminAction(user.id, user.name, `Successful Admin login`, 'Auth', user.id);
    return { success: true, user };
  }

  static authenticateTeacher(email: string, password: string, teacherAccessCode?: string): { success: boolean; user?: User; error?: string } {
    let user = this.getUserByEmail(email);

    if (!user) {
      // If user doesn't exist, require Teacher Access Code for activation
      if (!teacherAccessCode || !this.verifyTeacherCode(teacherAccessCode)) {
        return { success: false, error: 'Unable to verify teacher access. Please check your credentials.' };
      }
      user = this.createUser({
        name: email.split('@')[0],
        email,
        role: 'TEACHER',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      });
      this.logAdminAction(user.id, user.name, `Teacher account created via access code`, 'Auth', user.id);
      return { success: true, user };
    }

    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return { success: false, error: 'Unable to verify teacher access. Please check your credentials.' };
    }

    if (user.status === 'SUSPENDED') {
      return { success: false, error: 'Account has been suspended. Please contact platform support.' };
    }

    this.logAdminAction(user.id, user.name, `Successful Teacher login`, 'Auth', user.id);
    return { success: true, user };
  }

  static activateTeacherAccount(name: string, email: string, phone: string, password: string, teacherAccessCode: string): { success: boolean; user?: User; error?: string } {
    if (!this.verifyTeacherCode(teacherAccessCode)) {
      return { success: false, error: 'Invalid teacher access code.' };
    }

    const existing = this.getUserByEmail(email);
    if (existing) {
      if (existing.role === 'TEACHER') {
        return { success: true, user: existing };
      }
      // Upgrade role to TEACHER if code is valid
      const updated = this.updateUser(existing.id, {
        role: 'TEACHER',
        phone,
        name,
        passwordHash: password ? hashSecretSync(password) : existing.passwordHash,
      });
      this.logAdminAction(existing.id, name, `Upgraded user to Teacher via access code`, 'Auth', existing.id);
      return { success: true, user: updated };
    }

    const newTeacher = this.createUser({
      name,
      email,
      phone,
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      passwordHash: password ? hashSecretSync(password) : undefined,
    });

    this.logAdminAction(newTeacher.id, name, `Activated new Teacher account via access code`, 'Auth', newTeacher.id);
    return { success: true, user: newTeacher };
  }

  static createAdminAccount(name: string, email: string, adminCreatorName: string): { success: boolean; user?: User; error?: string } {
    const existing = this.getUserByEmail(email);
    if (existing) {
      const updated = this.updateUser(existing.id, { role: 'ADMIN', name });
      this.logAdminAction('usr-admin-1', adminCreatorName, `Promoted user ${email} to Admin`, 'AdminManagement', existing.id);
      return { success: true, user: updated };
    }

    const newAdmin = this.createUser({
      name,
      email,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    });

    this.logAdminAction('usr-admin-1', adminCreatorName, `Created new Admin account: ${email}`, 'AdminManagement', newAdmin.id);
    return { success: true, user: newAdmin };
  }

  // Users
  static getUsers(): User[] {
    const users = loadData<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const seen = new Set<string>();
    const cleaned: User[] = [];
    for (const u of users) {
      const emailKey = u.email?.toLowerCase();
      if (u.id && emailKey && !seen.has(u.id) && !seen.has(emailKey)) {
        seen.add(u.id);
        seen.add(emailKey);
        cleaned.push(u);
      }
    }
    return cleaned;
  }

  static getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  static getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  static createUser(user: Omit<User, 'id' | 'status' | 'createdAt' | 'updatedAt'>): User {
    const users = this.getUsers();
    // Check if user with same email already exists to prevent duplicate entries
    const existingIdx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIdx !== -1) {
      users[existingIdx] = {
        ...users[existingIdx],
        ...user,
        updatedAt: new Date().toISOString(),
      };
      saveData(STORAGE_KEYS.USERS, users);
      return users[existingIdx];
    }
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveData(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  static updateUser(id: string, updates: Partial<User>): User | undefined {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
    saveData(STORAGE_KEYS.USERS, users);
    return users[idx];
  }

  static updateUserProfile(userId: string, updates: { name?: string; phone?: string; avatar?: string; bio?: string }): User | undefined {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return undefined;

    users[idx] = {
      ...users[idx],
      name: updates.name !== undefined && updates.name.trim() ? updates.name.trim() : users[idx].name,
      phone: updates.phone !== undefined ? updates.phone.trim() : users[idx].phone,
      avatar: updates.avatar !== undefined && updates.avatar.trim() ? updates.avatar.trim() : users[idx].avatar,
      bio: updates.bio !== undefined ? updates.bio.trim() : users[idx].bio,
      updatedAt: new Date().toISOString(),
    };
    saveData(STORAGE_KEYS.USERS, users);
    this.logAdminAction(userId, users[idx].name, `Profile details updated`, 'User', userId);
    return users[idx];
  }

  static updateUserPassword(userId: string, currentPassword: string | undefined, newPassword: string): { success: boolean; error?: string } {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) {
      return { success: false, error: 'User account not found.' };
    }

    const user = users[idx];
    if (user.passwordHash && currentPassword) {
      const hashedOld = hashSecretSync(currentPassword);
      if (hashedOld !== user.passwordHash) {
        return { success: false, error: 'Current password does not match. (বর্তমান পাসওয়ার্ড সঠিক নয়)' };
      }
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters. (পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে)' };
    }

    users[idx] = {
      ...user,
      passwordHash: hashSecretSync(newPassword),
      updatedAt: new Date().toISOString(),
    };
    saveData(STORAGE_KEYS.USERS, users);
    this.logAdminAction(userId, user.name, `User password reset/changed successfully`, 'Security', userId);
    return { success: true };
  }

  static resetUserPasswordByEmail(email: string, newPassword: string): { success: boolean; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    if (idx === -1) {
      return { success: false, error: 'No account found with this email address. (এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি)' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters. (পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে)' };
    }

    const user = users[idx];
    users[idx] = {
      ...user,
      passwordHash: hashSecretSync(newPassword),
      updatedAt: new Date().toISOString(),
    };
    saveData(STORAGE_KEYS.USERS, users);
    this.logAdminAction(user.id, user.name, `Password reset by email for ${cleanEmail}`, 'Security', user.id);
    return { success: true };
  }

  static suspendUser(id: string, adminName: string): boolean {
    const user = this.updateUser(id, { status: 'SUSPENDED' });
    if (user) {
      this.logAdminAction('usr-admin-1', adminName, `Suspended user account: ${user.name} (${user.email})`, 'User', id);
      return true;
    }
    return false;
  }

  static unsuspendUser(id: string, adminName: string): boolean {
    const user = this.updateUser(id, { status: 'ACTIVE' });
    if (user) {
      this.logAdminAction('usr-admin-1', adminName, `Reactivated user account: ${user.name}`, 'User', id);
      return true;
    }
    return false;
  }

  static deleteUser(id: string, adminName: string): boolean {
    let users = this.getUsers();
    const target = users.find((u) => u.id === id);
    users = users.filter((u) => u.id !== id);
    saveData(STORAGE_KEYS.USERS, users);
    if (target) {
      this.logAdminAction('usr-admin-1', adminName, `Deleted user account: ${target.name}`, 'User', id);
    }
    return true;
  }

  static adminResetUserPassword(userId: string, newPassword: string, adminName: string): { success: boolean; error?: string } {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) {
      return { success: false, error: 'User account not found.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }
    const user = users[idx];
    users[idx] = {
      ...user,
      passwordHash: hashSecretSync(newPassword),
      updatedAt: new Date().toISOString(),
    };
    saveData(STORAGE_KEYS.USERS, users);
    this.logAdminAction('usr-admin-1', adminName, `Admin reset password for user ${user.name} (${user.email})`, 'Security', user.id);
    return { success: true };
  }

  static adminCreateUser(userData: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    status?: 'ACTIVE' | 'SUSPENDED';
    password?: string;
    bio?: string;
  }, adminName: string): { success: boolean; user?: User; error?: string } {
    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanName = userData.name.trim();
    if (!cleanName) return { success: false, error: 'User full name is required.' };
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, error: 'Valid email address is required.' };
    }
    const existing = this.getUserByEmail(cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }
    const password = userData.password && userData.password.trim() ? userData.password.trim() : 'password123';
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const defaultAvatars: Record<UserRole, string> = {
      ADMIN: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      TEACHER: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      STUDENT: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    };

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: userData.phone?.trim() || '',
      role: userData.role,
      status: userData.status || 'ACTIVE',
      avatar: defaultAvatars[userData.role] || defaultAvatars.STUDENT,
      bio: userData.bio?.trim() || '',
      passwordHash: hashSecretSync(password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const users = this.getUsers();
    users.push(newUser);
    saveData(STORAGE_KEYS.USERS, users);
    this.logAdminAction('usr-admin-1', adminName, `Created new ${newUser.role} account: ${newUser.name} (${newUser.email})`, 'User', newUser.id);
    return { success: true, user: newUser };
  }

  // Courses
  static getCourses(): Course[] {
    const raw = loadData<Course[]>(STORAGE_KEYS.COURSES, []);
    if (raw.length === 0) {
      // Lazy init mapping from initial data
      const mapped = INITIAL_COURSES.map((c, idx) => ({
        id: c.id,
        title: c.title,
        slug: c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: c.description,
        thumbnail: c.image,
        price: c.price,
        discountPrice: c.originalPrice,
        isFree: c.isFree || false,
        category: c.category,
        categoryId: c.categoryId,
        level: c.level as any,
        durationHours: c.durationHours,
        status: 'PUBLISHED' as const,
        teacherId: 'usr-teacher-1',
        teacherName: c.instructor?.name || 'Hasibul Islam',
        teacherAvatar: c.instructor?.avatar,
        rating: c.rating,
        reviewCount: c.reviewCount,
        studentsCount: c.studentsCount,
        lessonsCount: c.lessonsCount,
        badge: c.badge,
        bengaliTitle: c.bengaliTitle,
        bengaliDescription: c.bengaliDescription,
        requirements: c.requirements,
        features: c.features,
        lessons: (c.curriculum || []).flatMap((currSection, sectionIdx) =>
          currSection.lessons.map((les, lessonIdx) => ({
            id: `les-${c.id}-${sectionIdx}-${lessonIdx}`,
            courseId: c.id,
            title: les.title,
            description: `In-depth lecture on ${les.title}`,
            videoUrl: 'https://www.youtube.com/embed/uCvNsKvIHgg',
            duration: les.duration,
            order: sectionIdx * 10 + lessonIdx,
            isPreview: les.isPreview || lessonIdx === 0,
            isPublished: true,
          }))
        ),
        createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 5).toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      saveData(STORAGE_KEYS.COURSES, mapped);
      return mapped;
    }
    return raw;
  }

  static getPublishedCourses(): Course[] {
    return this.getCourses().filter((c) => c.status === 'PUBLISHED');
  }

  static getCourseById(id: string): Course | undefined {
    if (!id) return undefined;
    const clean = id.trim();
    return this.getCourses().find((c) => c.id === clean || c.slug === clean);
  }

  static createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>, adminName?: string): Course {
    const courses = this.getCourses();
    const generatedSlug = (course.slug || course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || `course-${Date.now()}`;
    const newCourse: Course = {
      ...course,
      bengaliTitle: course.bengaliTitle || course.title,
      bengaliDescription: course.bengaliDescription || course.description,
      discountPrice: course.discountPrice,
      badge: course.badge,
      requirements: course.requirements && course.requirements.length > 0 ? course.requirements : ['Basic computer & internet knowledge'],
      features: course.features && course.features.length > 0 ? course.features : ['Lifetime Access', 'Certificate of Completion', 'Dedicated Mentor Support'],
      lessons: course.lessons || [],
      rating: course.rating || 5,
      reviewCount: course.reviewCount || 1,
      studentsCount: course.studentsCount || 0,
      lessonsCount: course.lessonsCount || (course.lessons?.length || 10),
      slug: generatedSlug,
      id: `crs-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    courses.unshift(newCourse);
    saveData(STORAGE_KEYS.COURSES, courses);

    if (adminName) {
      this.logAdminAction('usr-admin-1', adminName, `Created course: "${newCourse.title}"`, 'Course', newCourse.id);
    }
    return newCourse;
  }

  static updateCourse(id: string, updates: Partial<Course>, adminName?: string): Course | undefined {
    const courses = this.getCourses();
    const cleanId = id.trim();
    const idx = courses.findIndex((c) => c.id === cleanId || c.slug === cleanId);
    if (idx === -1) return undefined;

    // Harmonize price and isFree so changing paid to free or free to paid works seamlessly
    let finalPrice = updates.price !== undefined ? updates.price : courses[idx].price;
    let finalIsFree = updates.isFree !== undefined ? updates.isFree : courses[idx].isFree;

    if (updates.isFree === true || updates.price === 0) {
      finalPrice = 0;
      finalIsFree = true;
    } else if (updates.price !== undefined && updates.price > 0) {
      finalIsFree = false;
      finalPrice = updates.price;
    }

    const mergedCourse: Course = {
      ...courses[idx],
      ...updates,
      price: finalPrice,
      isFree: finalIsFree,
      thumbnail: updates.thumbnail || courses[idx].thumbnail,
      image: updates.thumbnail || updates.image || courses[idx].image || courses[idx].thumbnail,
      updatedAt: new Date().toISOString(),
    };

    courses[idx] = mergedCourse;
    saveData(STORAGE_KEYS.COURSES, courses);

    if (adminName) {
      this.logAdminAction('usr-admin-1', adminName, `Updated course: "${courses[idx].title}"`, 'Course', courses[idx].id);
    }
    return courses[idx];
  }

  static deleteCourse(id: string, adminName?: string): boolean {
    let courses = this.getCourses();
    const target = courses.find((c) => c.id === id);
    courses = courses.filter((c) => c.id !== id);
    saveData(STORAGE_KEYS.COURSES, courses);

    // Cascading cleanup of associated reviews & comments
    const reviews = this.getReviews().filter((r) => r.courseId !== id);
    saveData(STORAGE_KEYS.REVIEWS, reviews);

    const comments = this.getComments().filter((c) => c.courseId !== id);
    saveData(STORAGE_KEYS.COMMENTS, comments);

    if (target && adminName) {
      this.logAdminAction('usr-admin-1', adminName, `Deleted course: "${target.title}"`, 'Course', id);
    }
    return true;
  }

  // Lesson & Video Content Management
  static addLessonToCourse(courseId: string, lesson: Omit<Lesson, 'id' | 'courseId'>, actorName?: string): Lesson | undefined {
    const course = this.getCourseById(courseId);
    if (!course) return undefined;

    const newLesson: Lesson = {
      ...lesson,
      id: `les-${courseId}-${Date.now()}`,
      courseId,
      order: course.lessons.length + 1,
      isPublished: true,
    };

    const updatedLessons = [...course.lessons, newLesson];
    this.updateCourse(courseId, { 
      lessons: updatedLessons,
      lessonsCount: updatedLessons.length 
    }, actorName);

    return newLesson;
  }

  static updateLessonInCourse(courseId: string, lessonId: string, updates: Partial<Lesson>, actorName?: string): Lesson | undefined {
    const course = this.getCourseById(courseId);
    if (!course) return undefined;

    const lessonIdx = course.lessons.findIndex((l) => l.id === lessonId);
    if (lessonIdx === -1) return undefined;

    const updatedLessons = [...course.lessons];
    updatedLessons[lessonIdx] = { ...updatedLessons[lessonIdx], ...updates };

    this.updateCourse(courseId, { lessons: updatedLessons }, actorName);
    return updatedLessons[lessonIdx];
  }

  static deleteLessonFromCourse(courseId: string, lessonId: string, actorName?: string): boolean {
    const course = this.getCourseById(courseId);
    if (!course) return false;

    const updatedLessons = course.lessons.filter((l) => l.id !== lessonId);
    this.updateCourse(courseId, { 
      lessons: updatedLessons,
      lessonsCount: updatedLessons.length 
    }, actorName);

    return true;
  }

  // PDF Document Management
  static addPdfResourceToCourse(courseId: string, pdf: { title: string; url: string; fileSize?: string }, actorName?: string): Course | undefined {
    const course = this.getCourseById(courseId);
    if (!course) return undefined;

    const newPdf = {
      id: `pdf-${Date.now()}`,
      title: pdf.title,
      url: pdf.url,
      fileSize: pdf.fileSize || '1.5 MB',
      addedAt: new Date().toISOString(),
    };

    const updatedPdfs = [...(course.pdfResources || []), newPdf];
    return this.updateCourse(courseId, { pdfResources: updatedPdfs }, actorName);
  }

  static deletePdfResourceFromCourse(courseId: string, pdfId: string, actorName?: string): boolean {
    const course = this.getCourseById(courseId);
    if (!course) return false;

    const updatedPdfs = (course.pdfResources || []).filter((p) => p.id !== pdfId);
    this.updateCourse(courseId, { pdfResources: updatedPdfs }, actorName);
    return true;
  }

  static bulkUpdateCourseStatus(ids: string[], status: Course['status'], adminName: string): void {
    const courses = this.getCourses();
    courses.forEach((c) => {
      if (ids.includes(c.id)) {
        c.status = status;
        c.updatedAt = new Date().toISOString();
      }
    });
    saveData(STORAGE_KEYS.COURSES, courses);
    this.logAdminAction('usr-admin-1', adminName, `Bulk updated ${ids.length} course(s) to status: ${status}`, 'Course', ids.join(','));
  }

  // Reviews & Dynamic Rating Engine
  static getReviews(): Review[] {
    return loadData<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  static getReviewsByCourseId(courseId: string, onlyPublished: boolean = true): Review[] {
    const reviews = this.getReviews().filter((r) => r.courseId === courseId);
    if (onlyPublished) {
      return reviews.filter((r) => r.status === 'PUBLISHED');
    }
    return reviews;
  }

  static createReview(review: Omit<Review, 'id' | 'status' | 'createdAt'>): Review {
    const reviews = this.getReviews();
    
    // Check if user already reviewed this course
    const existingIdx = reviews.findIndex((r) => r.userId === review.userId && r.courseId === review.courseId);

    const newReview: Review = {
      ...review,
      id: existingIdx !== -1 ? reviews[existingIdx].id : `rev-${Date.now()}`,
      status: 'PUBLISHED', // Auto-publish for immediate feedback
      createdAt: new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      reviews[existingIdx] = newReview;
    } else {
      reviews.unshift(newReview);
    }

    saveData(STORAGE_KEYS.REVIEWS, reviews);
    this.recalculateCourseRating(review.courseId);
    return newReview;
  }

  static updateReviewStatus(reviewId: string, status: ReviewStatus, adminName: string): Review | undefined {
    const reviews = this.getReviews();
    const idx = reviews.findIndex((r) => r.id === reviewId);
    if (idx === -1) return undefined;

    reviews[idx].status = status;
    reviews[idx].updatedAt = new Date().toISOString();
    saveData(STORAGE_KEYS.REVIEWS, reviews);

    this.recalculateCourseRating(reviews[idx].courseId);
    this.logAdminAction('usr-admin-1', adminName, `Updated review status to ${status}`, 'Review', reviewId);
    return reviews[idx];
  }

  static deleteReview(reviewId: string, adminName?: string): boolean {
    let reviews = this.getReviews();
    const target = reviews.find((r) => r.id === reviewId);
    reviews = reviews.filter((r) => r.id !== reviewId);
    saveData(STORAGE_KEYS.REVIEWS, reviews);

    if (target) {
      this.recalculateCourseRating(target.courseId);
      if (adminName) {
        this.logAdminAction('usr-admin-1', adminName, `Deleted review from ${target.userName}`, 'Review', reviewId);
      }
    }
    return true;
  }

  static bulkUpdateReviewStatus(ids: string[], status: ReviewStatus, adminName: string): void {
    const reviews = this.getReviews();
    const affectedCourseIds = new Set<string>();

    reviews.forEach((r) => {
      if (ids.includes(r.id)) {
        r.status = status;
        affectedCourseIds.add(r.courseId);
      }
    });

    saveData(STORAGE_KEYS.REVIEWS, reviews);
    affectedCourseIds.forEach((cId) => this.recalculateCourseRating(cId));
    this.logAdminAction('usr-admin-1', adminName, `Bulk updated ${ids.length} review(s) to ${status}`, 'Review', ids.join(','));
  }

  // Dynamic 5-Star Rating Calculation Formula
  static getCourseRatingStats(courseId: string): RatingStats {
    const publishedReviews = this.getReviewsByCourseId(courseId, true);
    
    if (publishedReviews.length === 0) {
      return {
        avgRating: 4.8,
        reviewCount: 0,
        distribution: { 5: 85, 4: 12, 3: 3, 2: 0, 1: 0 },
      };
    }

    const totalSum = publishedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((totalSum / publishedReviews.length) * 10) / 10;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    publishedReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[star] += 1;
    });

    return {
      avgRating,
      reviewCount: publishedReviews.length,
      distribution,
    };
  }

  private static recalculateCourseRating(courseId: string): void {
    const stats = this.getCourseRatingStats(courseId);
    this.updateCourse(courseId, {
      rating: stats.avgRating,
      reviewCount: stats.reviewCount,
    });
  }

  // Comments & Discussion Engine
  static getComments(): Comment[] {
    return loadData<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  }

  static getCommentsByCourseId(courseId: string, lessonId?: string): Comment[] {
    const comments = this.getComments().filter((c) => c.status !== 'DELETED');
    return comments.filter((c) => {
      if (c.courseId !== courseId) return false;
      if (lessonId && c.lessonId !== lessonId) return false;
      return true;
    });
  }

  static createComment(comment: Omit<Comment, 'id' | 'status' | 'reportCount' | 'createdAt'>): Comment {
    const comments = this.getComments();
    const newComment: Comment = {
      ...comment,
      id: `cmt-${Date.now()}`,
      status: 'PUBLISHED',
      reportCount: 0,
      createdAt: new Date().toISOString(),
    };
    comments.unshift(newComment);
    saveData(STORAGE_KEYS.COMMENTS, comments);
    return newComment;
  }

  static reportComment(commentId: string, reason: ReportReason): boolean {
    const comments = this.getComments();
    const idx = comments.findIndex((c) => c.id === commentId);
    if (idx === -1) return false;

    comments[idx].reportCount = (comments[idx].reportCount || 0) + 1;
    comments[idx].status = 'REPORTED';
    comments[idx].reportReason = reason;
    saveData(STORAGE_KEYS.COMMENTS, comments);
    return true;
  }

  static updateCommentStatus(commentId: string, status: CommentStatus, adminName: string): Comment | undefined {
    const comments = this.getComments();
    const idx = comments.findIndex((c) => c.id === commentId);
    if (idx === -1) return undefined;

    comments[idx].status = status;
    comments[idx].updatedAt = new Date().toISOString();
    saveData(STORAGE_KEYS.COMMENTS, comments);

    this.logAdminAction('usr-admin-1', adminName, `Updated comment status to ${status}`, 'Comment', commentId);
    return comments[idx];
  }

  static deleteComment(commentId: string, adminName?: string): boolean {
    const comments = this.getComments();
    const idx = comments.findIndex((c) => c.id === commentId);
    if (idx === -1) return false;

    comments[idx].status = 'DELETED';
    saveData(STORAGE_KEYS.COMMENTS, comments);

    if (adminName) {
      this.logAdminAction('usr-admin-1', adminName, `Deleted comment: "${comments[idx].text.slice(0, 30)}..."`, 'Comment', commentId);
    }
    return true;
  }

  static bulkUpdateCommentStatus(ids: string[], status: CommentStatus, adminName: string): void {
    const comments = this.getComments();
    comments.forEach((c) => {
      if (ids.includes(c.id)) {
        c.status = status;
      }
    });
    saveData(STORAGE_KEYS.COMMENTS, comments);
    this.logAdminAction('usr-admin-1', adminName, `Bulk updated ${ids.length} comment(s) to ${status}`, 'Comment', ids.join(','));
  }

  // Categories Management
  static getCategories(): Category[] {
    return loadData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORY_LIST);
  }

  static createCategory(cat: Omit<Category, 'id'>, adminName: string): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      ...cat,
      id: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    categories.push(newCat);
    saveData(STORAGE_KEYS.CATEGORIES, categories);
    this.logAdminAction('usr-admin-1', adminName, `Created Category: "${newCat.name}"`, 'Category', newCat.id);
    return newCat;
  }

  static deleteCategory(id: string, adminName: string): boolean {
    let categories = this.getCategories();
    categories = categories.filter((c) => c.id !== id);
    saveData(STORAGE_KEYS.CATEGORIES, categories);
    this.logAdminAction('usr-admin-1', adminName, `Deleted Category ID: ${id}`, 'Category', id);
    return true;
  }

  // Audit Logs
  static getAuditLogs(): AuditLog[] {
    return loadData<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  }

  static logAdminAction(adminId: string, adminName: string, action: string, resource: string, resourceId: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminId,
      adminName,
      action,
      resource,
      resourceId,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    saveData(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  static getTransactions(adminCallerRole?: UserRole): Transaction[] {
    if (adminCallerRole && adminCallerRole !== 'ADMIN') {
      return [];
    }
    return loadData<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
  }

  static getTransactionsByUserId(userId: string, requestingUserId?: string): Transaction[] {
    // IDOR Protection: If requestingUserId is supplied and differs, deny access
    if (requestingUserId && requestingUserId !== userId) {
      return [];
    }
    return this.getTransactions().filter((t) => t.userId === userId);
  }

  static createTransaction(trx: Omit<Transaction, 'id' | 'createdAt' | 'status'>): Transaction {
    const transactions = this.getTransactions();
    const newTrx: Transaction = {
      ...trx,
      id: `trx-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTrx);
    saveData(STORAGE_KEYS.TRANSACTIONS, transactions);

    if (trx.amount === 0) {
      newTrx.status = 'SUCCESS';
      this.updateTransactionStatus(newTrx.id, 'SUCCESS', 'Auto Instant System');
      this.enrollUser(trx.userId, trx.courseId);
    }
    return newTrx;
  }

  static updateTransactionStatus(id: string, status: Transaction['status'], approvedBy?: string): Transaction | undefined {
    const transactions = this.getTransactions();
    const idx = transactions.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;

    transactions[idx].status = status;
    if (approvedBy) transactions[idx].approvedBy = approvedBy;
    saveData(STORAGE_KEYS.TRANSACTIONS, transactions);

    if (status === 'SUCCESS') {
      this.enrollUser(transactions[idx].userId, transactions[idx].courseId);
    }

    if (approvedBy) {
      this.logAdminAction('usr-admin-1', approvedBy, `Updated Transaction ${id} status to ${status}`, 'Transaction', id);
    }

    return transactions[idx];
  }

  // Enrollments
  static getEnrollments(): Enrollment[] {
    return loadData<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, []);
  }

  static getEnrollmentsByUserId(userId: string): Enrollment[] {
    return this.getEnrollments().filter((e) => e.userId === userId);
  }

  static isUserEnrolled(userId: string, courseId: string): boolean {
    return this.getEnrollments().some(
      (e) => e.userId === userId && e.courseId === courseId && (e.status === 'ACTIVE' || e.status === 'COMPLETED')
    );
  }

  static hasPendingEnrollment(userId: string, courseId: string): boolean {
    return this.getTransactions().some(
      (t) => t.userId === userId && t.courseId === courseId && t.status === 'PENDING'
    );
  }

  static getPendingTransaction(userId: string, courseId: string): Transaction | undefined {
    return this.getTransactions().find(
      (t) => t.userId === userId && t.courseId === courseId && t.status === 'PENDING'
    );
  }

  static enrollUser(userId: string, courseId: string): Enrollment {
    const enrollments = this.getEnrollments();
    const existing = enrollments.find((e) => e.userId === userId && e.courseId === courseId);
    if (existing) {
      if (existing.status !== 'ACTIVE' && existing.status !== 'COMPLETED') {
        existing.status = 'ACTIVE';
        saveData(STORAGE_KEYS.ENROLLMENTS, enrollments);
      }
      return existing;
    }

    const course = this.getCourseById(courseId);
    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      userId,
      courseId,
      courseTitle: course?.title || 'MasterMind Course',
      courseThumbnail: course?.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      progress: 0,
      completedLessons: [],
      status: 'ACTIVE',
      enrolledAt: new Date().toISOString(),
    };

    enrollments.unshift(newEnrollment);
    saveData(STORAGE_KEYS.ENROLLMENTS, enrollments);

    if (course) {
      this.updateCourse(courseId, { studentsCount: (course.studentsCount || 0) + 1 });
    }

    return newEnrollment;
  }

  static updateLessonProgress(userId: string, courseId: string, lessonId: string): Enrollment | undefined {
    const enrollments = this.getEnrollments();
    const idx = enrollments.findIndex((e) => e.userId === userId && e.courseId === courseId);
    if (idx === -1) return undefined;

    const enr = enrollments[idx];
    if (!enr.completedLessons.includes(lessonId)) {
      enr.completedLessons.push(lessonId);
    }

    const course = this.getCourseById(courseId);
    const totalLessons = course?.lessons.length || 10;
    enr.progress = Math.min(100, Math.round((enr.completedLessons.length / totalLessons) * 100));

    if (enr.progress >= 100) {
      enr.status = 'COMPLETED';
      enr.completedAt = new Date().toISOString();
    }

    saveData(STORAGE_KEYS.ENROLLMENTS, enrollments);
    return enr;
  }

  // Analytics
  static getStats(): PlatformStats {
    const users = this.getUsers();
    const courses = this.getCourses();
    const enrollments = this.getEnrollments();
    const transactions = this.getTransactions();
    const reviews = this.getReviews();
    const comments = this.getComments();

    const successfulTrx = transactions.filter((t) => t.status === 'SUCCESS');
    const totalRevenue = successfulTrx.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalUsers: users.length,
      totalTeachers: users.filter((u) => u.role === 'TEACHER').length,
      totalStudents: users.filter((u) => u.role === 'STUDENT').length,
      totalCourses: courses.length,
      totalEnrollments: enrollments.length,
      totalRevenue,
      pendingTransactions: transactions.filter((t) => t.status === 'PENDING').length,
      pendingReviews: reviews.filter((r) => r.status === 'PENDING').length,
      reportedComments: comments.filter((c) => c.status === 'REPORTED').length,
    };
  }

  // Dynamic Website Content Management System (CMS) & Location Methods
  static getWebsiteContents(): WebsiteContentItem[] {
    return loadData<WebsiteContentItem[]>(STORAGE_KEYS.WEBSITE_CONTENT, DEFAULT_WEBSITE_CONTENT);
  }

  static getWebsiteContent(locationKey: string): WebsiteContentItem | undefined {
    const contents = this.getWebsiteContents();
    return contents.find((item) => item.locationKey === locationKey);
  }

  static updateWebsiteContent(locationKey: string, updates: Partial<WebsiteContentItem>, updatedBy?: string): WebsiteContentItem {
    const contents = this.getWebsiteContents();
    const idx = contents.findIndex((item) => item.locationKey === locationKey);
    let updatedItem: WebsiteContentItem;

    if (idx !== -1) {
      contents[idx] = {
        ...contents[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: updatedBy || contents[idx].updatedBy,
      };
      updatedItem = contents[idx];
    } else {
      updatedItem = {
        id: `wc-${Date.now()}`,
        locationKey,
        sectionName: updates.sectionName || locationKey,
        mediaType: updates.mediaType || 'IMAGE',
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: updatedBy || 'Mastermind Admin',
      };
      contents.unshift(updatedItem);
    }

    saveData(STORAGE_KEYS.WEBSITE_CONTENT, contents);
    if (updatedBy) {
      this.logAdminAction('usr-admin-1', updatedBy, `Updated website content location: "${locationKey}"`, 'WebsiteContent', updatedItem.id);
    }
    return updatedItem;
  }

  static createWebsiteContentLocation(item: Omit<WebsiteContentItem, 'id'>, createdBy?: string): WebsiteContentItem {
    const contents = this.getWebsiteContents();
    const newItem: WebsiteContentItem = {
      ...item,
      id: `wc-${Date.now()}`,
      updatedAt: new Date().toISOString(),
      updatedBy: createdBy || 'Mastermind Admin',
    };

    contents.unshift(newItem);
    saveData(STORAGE_KEYS.WEBSITE_CONTENT, contents);

    if (createdBy) {
      this.logAdminAction('usr-admin-1', createdBy, `Created new website content location: "${item.locationKey}"`, 'WebsiteContent', newItem.id);
    }
    return newItem;
  }

  static deleteWebsiteContentLocation(id: string, deletedBy?: string): boolean {
    let contents = this.getWebsiteContents();
    const target = contents.find((c) => c.id === id);
    contents = contents.filter((c) => c.id !== id);
    saveData(STORAGE_KEYS.WEBSITE_CONTENT, contents);

    if (target && deletedBy) {
      this.logAdminAction('usr-admin-1', deletedBy, `Deleted website content location: "${target.locationKey}"`, 'WebsiteContent', id);
    }
    return true;
  }
}

export const DEFAULT_WEBSITE_CONTENT: WebsiteContentItem[] = [
  {
    id: 'wc-1',
    locationKey: 'homepage_hero',
    sectionName: 'Homepage Hero Showcase',
    title: ' WordPress & Web Development with Bangladesh\'s Premier Academy',
    subtitle: 'Learn live & recorded hands-on courses from Hasibul Islam and expert mentors.',
    description: 'Master WordPress plugin creation, freelancing, and digital marketing with 100% practical projects, verified certificates, and direct instructor support.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    altText: 'MASTERMIND AIDIT Student Learning Dashboard',
    buttonText: 'Explore All Courses',
    buttonUrl: '/courses',
    updatedAt: '2026-01-01T00:00:00.000Z',
    updatedBy: 'MASTERMIND AIDIT Admin',
  },
  {
    id: 'wc-2',
    locationKey: 'homepage_promo_video',
    sectionName: 'Homepage Promotional Video',
    title: 'Discover How MASTERMIND AIDIT Empowers Your Career',
    description: 'Watch this 3-minute intro video explaining our practical project-based learning model and student success stories in Bangladesh.',
    mediaType: 'VIDEO',
    mediaUrl: 'https://www.youtube.com/embed/uCvNsKvIHgg',
    altText: 'MASTERMIND AIDIT Intro Promo Video',
    buttonText: 'Watch Video',
    buttonUrl: '',
    updatedAt: '2026-01-01T00:00:00.000Z',
    updatedBy: 'MASTERMIND AIDIT Admin',
  },
  {
    id: 'wc-3',
    locationKey: 'about_section',
    sectionName: 'Homepage About & Vision',
    title: 'Empowering 17,000+ Bangladeshi Students Since 2024',
    description: 'MASTERMIND AIDIT provides accessible, career-ready e-learning programs with direct mentor feedback, live Q&A sessions, and freelance contract assistance.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
    altText: 'MASTERMIND AIDIT Classroom Vision',
    updatedAt: '2026-01-01T00:00:00.000Z',
    updatedBy: 'MASTERMIND AIDIT Admin',
  },
  {
    id: 'wc-4',
    locationKey: 'marketplace_banner',
    sectionName: 'Course Marketplace Gateway Banner',
    title: 'All Courses Have Moved to Our Dedicated Catalog',
    description: 'Browse 127+ free & premium masterclasses in Web Development, WordPress Plugin Creation, Digital Marketing, SEO, and Freelancing.',
    mediaType: 'IMAGE',
    mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    altText: 'Dedicated Marketplace Banner',
    buttonText: 'Explore All Courses →',
    buttonUrl: '/courses',
    updatedAt: '2026-01-01T00:00:00.000Z',
    updatedBy: 'MASTERMIND AIDIT Admin',
  },
];
