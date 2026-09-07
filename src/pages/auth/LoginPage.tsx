import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  BrainCircuit, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  Key, 
  GraduationCap, 
  UserCheck, 
  Phone, 
  UserPlus, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/platform';
import { AIOrb } from '../../components/ai/AIOrb';

interface LoginPageProps {
  presetRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({ presetRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginTeacher, loginAdmin, activateTeacher, isLoading } = useAuth();

  const from = (location.state as any)?.from?.pathname || null;

  // Active form state
  const [activeRole, setActiveRole] = useState<UserRole>(presetRole || 'STUDENT');
  const [teacherTab, setTeacherTab] = useState<'signin' | 'activate'>('signin');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (presetRole) {
      setActiveRole(presetRole);
    } else {
      if (location.pathname.includes('/admin')) setActiveRole('ADMIN');
      else if (location.pathname.includes('/teacher')) setActiveRole('TEACHER');
      else setActiveRole('STUDENT');
    }
  }, [presetRole, location.pathname]);

  // Clean inputs on role switch
  useEffect(() => {
    setEmail('');
    setPassword('');
    setAccessCode('');
    setErrorMsg('');
  }, [activeRole]);

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    const result = await login(email, password, 'STUDENT');
    if (result.success && result.user) {
      if (from) navigate(from, { replace: true });
      else navigate('/dashboard');
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (teacherTab === 'activate') {
      if (!name.trim() || !email.trim() || !accessCode.trim()) {
        setErrorMsg('Please fill in all required activation fields.');
        return;
      }

      const res = await activateTeacher(name, email, phone, password, accessCode);
      if (res.success && res.user) {
        if (from) navigate(from, { replace: true });
        else navigate('/teacher/dashboard');
      } else {
        setErrorMsg(res.error || 'Unable to verify teacher access. Please check your credentials.');
      }
      return;
    }

    const result = await loginTeacher(email, password, accessCode);
    if (result.success && result.user) {
      if (from) navigate(from, { replace: true });
      else navigate('/teacher/dashboard');
    } else {
      setErrorMsg(result.error || 'Unable to verify teacher access. Please check your credentials.');
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim() || !accessCode.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const result = await loginAdmin(email, password, accessCode);
    if (result.success && result.user) {
      if (from) navigate(from, { replace: true });
      else navigate('/admin/dashboard');
    } else {
      setErrorMsg(result.error || 'Admin authentication failed.');
    }
  };

  // Background Theme Styling per Role
  const themeColors = {
    STUDENT: 'from-brand-600 to-brand-500',
    TEACHER: 'from-emerald-600 to-teal-700',
    ADMIN: 'from-purple-700 to-indigo-900',
  };

  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Background Glows */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-tr ${themeColors[activeRole]} pointer-events-none`} />

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-3 text-center">
        <Link to="/" className="inline-flex items-center gap-3 justify-center group">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${themeColors[activeRole]} flex items-center justify-center text-white shadow-xl`}>
            <BrainCircuit className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="text-base sm:text-xl font-black tracking-tight leading-none">
                Mastermind <span className="text-brand-400">AidlT</span>
              </span>
        </Link>

        <div>
          <h2 className="text-2xl font-black">
            {activeRole === 'ADMIN' && 'Admin Portal Login'}
            {activeRole === 'TEACHER' && 'Teacher Portal'}
            {activeRole === 'STUDENT' && 'Student Login'}
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {activeRole === 'ADMIN' && 'Secure Administrator Authentication Gateway'}
            {activeRole === 'TEACHER' && 'Instructor Portal & Account Activation'}
            {activeRole === 'STUDENT' && 'Sign in to access your course materials and progress'}
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-4">
        
        {/* Top Auth Mode Switcher (Sign In vs Sign Up) */}
        {/* <div className="bg-[#071325] p-1.5 rounded-2xl border border-brand-500/30 flex text-xs font-black shadow-lg">
          <div className="flex-1 py-2.5 rounded-xl bg-brand-500 text-white shadow-md flex items-center justify-center gap-1.5">
            <UserCheck className="w-4 h-4" />
            <span>Sign In</span>
          </div>
          <Link
            to="/register"
            className="flex-1 py-2.5 rounded-xl text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition hover:bg-white/5"
          >
            <UserPlus className="w-4 h-4 text-brand-400" />
            <span>Sign Up (New User) →</span>
          </Link>
        </div> */}

        {/* Role Selector Tabs */}
        <div className="bg-[#071325] p-1.5 rounded-2xl border border-slate-800 grid grid-cols-3 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveRole('STUDENT'); setErrorMsg(''); }}
            className={`py-2 rounded-xl transition ${activeRole === 'STUDENT' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => { setActiveRole('TEACHER'); setErrorMsg(''); }}
            className={`py-2 rounded-xl transition ${activeRole === 'TEACHER' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Teacher
          </button>
          <button
            type="button"
            onClick={() => { setActiveRole('ADMIN'); setErrorMsg(''); }}
            className={`py-2 rounded-xl transition ${activeRole === 'ADMIN' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Admin
          </button>
        </div>

        {/* STUDENT LOGIN FORM */}
        {activeRole === 'STUDENT' && (
          <div className="bg-[#0B1B33]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-5">
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">Password</label>
                  <Link
                    to={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                    className="text-[11px] font-bold text-brand-400 hover:text-brand-300 hover:underline transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition"
              >
                <span>Sign In as Student</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-4 border-t border-slate-800/80 text-center space-y-2.5">
                <p className="text-xs text-slate-400 font-medium">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-extrabold text-brand-400 hover:text-brand-300 transition hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
                {/* <Link
                  to="/register"
                  className="w-full py-2.5 bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 font-extrabold text-xs rounded-xl border border-brand-400/40 flex items-center justify-center gap-2 transition shadow-md"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>Create Account (Sign Up) →</span>
                </Link> */}
              </div>
            </form>
          </div>
        )}

        {/* TEACHER LOGIN & ACTIVATION FORM */}
        {activeRole === 'TEACHER' && (
          <div className="bg-[#0B1B33]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-5">
            {/* <div className="flex gap-2 p-1 bg-[#071325] rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setTeacherTab('signin')}
                className={`flex-1 py-1.5 rounded-lg transition ${teacherTab === 'signin' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                Teacher Sign In
              </button>
              <button
                type="button"
                onClick={() => setTeacherTab('activate')}
                className={`flex-1 py-1.5 rounded-lg transition ${teacherTab === 'activate' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                Activate Account
              </button>
            </div> */}

            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              {teacherTab === 'activate' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {teacherTab === 'activate' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">Password</label>
                  <Link
                    to={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Requirement #3: Teacher Access Code */}
              <div>
                <label className="block text-xs font-bold text-emerald-400 mb-1">
                  Teacher Access Code {teacherTab === 'activate' && '(Required)'}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Enter Teacher Access Code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#071325] border border-emerald-500/50 rounded-xl text-xs font-mono font-bold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
              >
                <span>{teacherTab === 'activate' ? 'Activate Teacher Account' : 'Sign In as Teacher'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ADMIN LOGIN FORM (Requirement #4 & #6) */}
        {activeRole === 'ADMIN' && (
          <div className="bg-[#0B1B33]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-purple-500/40 shadow-2xl space-y-5">
            {/* <div className="flex items-center gap-2 text-xs text-purple-300 font-bold bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Privileged Administrator Security Gateway</span>
            </div> */}

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="Enter Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">Admin Password</label>
                  <Link
                    to={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                    className="text-[11px] font-bold text-purple-400 hover:text-purple-300 hover:underline transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Requirement #4 & #6: Admin Special Access Code */}
              <div>
                <label className="block text-xs font-bold text-purple-400 mb-1">
                  Admin Security Access Code (Required)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Enter Admin Security Code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#071325] border border-purple-500/50 rounded-xl text-xs font-mono font-bold text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition"
              >
                <span>Secure Admin Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* <div className="pt-3 border-t border-slate-800/80 text-center">
                <Link to="/admin/register" className="text-xs text-slate-400 hover:text-purple-300 font-extrabold hover:underline">
                  Need a new account? Register 
                </Link>
              </div> */}
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
