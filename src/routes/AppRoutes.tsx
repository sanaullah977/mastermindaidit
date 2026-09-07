import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Layout & Global Components
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { CoursesPage } from '../pages/public/CoursesPage';
import { CourseDetailPage } from '../pages/public/CourseDetailPage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';
import { ClassroomPage } from '../pages/classroom/ClassroomPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
// import { AdminRegisterPage } from '../pages/auth/AdminRegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';

// Transactions Page
import { TransactionsPage } from '../pages/student/TransactionsPage';

// Dashboards
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { TeacherDashboard } from '../pages/teacher/TeacherDashboard';
import { StudentDashboard } from '../pages/student/StudentDashboard';

interface AppRoutesProps {
  onAddToCart: (course: any) => void;
  cartItemIds: string[];
  onOpenPathFinder: () => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  onAddToCart,
  cartItemIds,
  onOpenPathFinder,
}) => {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public Marketing Homepage */}
      <Route
        path="/"
        element={
          <HomePage
            onOpenPathFinder={onOpenPathFinder}
            onAddToCart={onAddToCart}
            cartItemIds={cartItemIds}
          />
        }
      />

      {/* Dedicated Course Catalog Route */}
      <Route
        path="/courses"
        element={
          <CoursesPage
            onAddToCart={onAddToCart}
            cartItemIds={cartItemIds}
          />
        }
      />

      {/* Dedicated Course Details Route */}
      <Route
        path="/courses/:courseId"
        element={
          <ProtectedRoute>
            <CourseDetailPage
            onAddToCart={onAddToCart}
            cartItemIds={cartItemIds}
          /></ProtectedRoute>
        }
      />

      {/* Checkout & Payment Gateway Route */}
      <Route path="/checkout/:courseId" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />

      {/* Protected Student Learning Classroom Route */}
      <Route
        path="/courses/:courseId/learn"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
            <ClassroomPage />
          </ProtectedRoute>
        }
      />

      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<LoginPage presetRole="ADMIN" />} />
      <Route path="/teacher/login" element={<LoginPage presetRole="TEACHER" />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* <Route path="/admin/register" element={<AdminRegisterPage />} /> */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/action" element={<ResetPasswordPage />} />
      <Route path="/__/auth/action" element={<ResetPasswordPage />} />

      {/* Transactions Page (Protected) */}
      <Route
        path="/transactions"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Dashboards */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/*"
        element={
          <ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center space-y-4">
            <div>
              <h2 className="text-3xl font-black text-[#0A192F]">404 - Page Not Found</h2>
              <p className="text-xs text-slate-500 mt-1">The requested route does not exist.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-600 transition"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        }
      />
    </Routes>
  );
};
