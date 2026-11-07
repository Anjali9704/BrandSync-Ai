import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import Loader from '../components/common/Loader.jsx';
import { ROLES } from '../utils/constants.js';

// Auth pages
const Login = lazy(() => import('../pages/auth/Login.jsx'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword.jsx'));

// App pages
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard.jsx'));
const ContentAnalysis = lazy(() => import('../pages/analysis/ContentAnalysis.jsx'));
const BrandGuidelines = lazy(() => import('../pages/guidelines/BrandGuidelines.jsx'));
const ContentLibrary = lazy(() => import('../pages/content/ContentLibrary.jsx'));
const ReviewApproval = lazy(() => import('../pages/review/ReviewApproval.jsx'));
const Reports = lazy(() => import('../pages/reports/Reports.jsx'));
const TeamManagement = lazy(() => import('../pages/team/TeamManagement.jsx'));
const Settings = lazy(() => import('../pages/settings/Settings.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));

const SuspenseFallback = () => <Loader fullPage text="Loading page…" />;

export default function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected app routes inside layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis" element={<ContentAnalysis />} />
          <Route path="/guidelines" element={<BrandGuidelines />} />
          <Route path="/content" element={<ContentLibrary />} />
          <Route
            path="/review"
            element={
              <ProtectedRoute allowedRoles={[ROLES.REVIEWER, ROLES.BRAND_MANAGER, ROLES.ADMIN]}>
                <ReviewApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={[ROLES.BRAND_MANAGER, ROLES.ADMIN]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <TeamManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

