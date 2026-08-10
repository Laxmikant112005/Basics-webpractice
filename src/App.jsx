import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages - Common
import Home from './pages/Common/Home';
import Login from './pages/Common/Login';
import Register from './pages/Common/Register';

// Pages - User
import UserDashboard from './pages/User/UserDashboard';
import DesignDetails from './pages/User/DesignDetails';
import Bookings from './pages/User/Bookings';
import Notifications from './pages/User/Notifications';
import UserFeedback from './pages/User/Feedback';
import Engineers from './pages/User/Engineers';
import EngineerProfile from './pages/User/EngineerProfile';
import Favorites from './pages/User/Favorites';
import UserProfile from './pages/User/Profile';
import MapField from './pages/User/MapField';
import Marketplace from './pages/User/Marketplace';
import Cart from './pages/User/Cart';
import BookingDetails from './pages/User/BookingDetails';
import AdminFeedback from './pages/Admin/Feedback';
import AdminUsers from './pages/Admin/Users';
import AdminEngineers from './pages/Admin/AdminEngineers';
import EngineerDetails from './pages/Admin/EngineerDetails';
import EditEngineer from './pages/Admin/EditEngineer';

// Pages - Engineer
import EngineerDashboard from './pages/Engineer/EngineerDashboard';
import UploadDesign from './pages/Engineer/UploadDesign';
import BookingRequests from './pages/Engineer/BookingRequests';
import EngineerAvailability from './pages/Engineer/EngineerAvailability';
import MyDesigns from './pages/Engineer/MyDesigns';
import EngineerReviews from './pages/Engineer/EngineerReviews';
import EngineerMessages from './pages/Engineer/EngineerMessages';
import EngineerProfilePage from './pages/Engineer/Profile';

// Pages - Admin
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminEngineersPage from './pages/Admin/AdminEngineers';
import AdminDesigns from './pages/Admin/AdminDesigns';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminTransactions from './pages/Admin/AdminTransactions';
import AdminAnalytics from './pages/Admin/AdminAnalytics';
import AdminSecurity from './pages/Admin/AdminSecurity';

// Logic to show the correct dashboard based on role
const RoleBasedDashboard = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'engineer') return <EngineerDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  
  // Default to User Dashboard (House browsing)
  return <UserDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/designs/:id" element={<DesignDetails />} />
          <Route path="/unauthorized" element={<div className="flex flex-col items-center justify-center h-[60vh] space-y-4"><h1 className="text-4xl font-extrabold text-navy">403</h1><p className="text-slate-400 font-bold uppercase tracking-widest text-sm underline decoration-gold decoration-4 underline-offset-8 transition-all">Unauthorized Access</p></div>} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Dashboard Routes - Role-Based Redirection */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<RoleBasedDashboard />} />
        </Route>

        {/* Role Specific Protected Areas */}
        <Route path="/designs" element={<DashboardLayout allowedRoles={['user', 'engineer', 'admin']} />}>
          <Route index element={<UserDashboard />} />
        </Route>

        <Route path="/engineer" element={<DashboardLayout allowedRoles={['engineer']} />}>
          <Route index element={<EngineerDashboard />} />
          <Route path="dashboard" element={<EngineerDashboard />} />
          <Route path="upload" element={<UploadDesign />} />
          <Route path="designs" element={<MyDesigns />} />
          <Route path="requests" element={<BookingRequests />} />
          <Route path="profile" element={<EngineerProfilePage />} />
          <Route path="availability" element={<EngineerAvailability />} />
          <Route path="reviews" element={<EngineerReviews />} />
          <Route path="messages" element={<EngineerMessages />} />
        </Route>

        <Route path="/user" element={<DashboardLayout allowedRoles={['user']} />}>
          <Route path="bookings" element={<Bookings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="feedback" element={<UserFeedback />} />
          <Route path="engineers" element={<Engineers />} />
          <Route path="engineers/:id" element={<EngineerProfile />} />
          <Route path="map-field" element={<MapField />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="cart" element={<Cart />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="bookings/:id" element={<BookingDetails />} />
        </Route>

        <Route path="/admin" element={<DashboardLayout allowedRoles={['admin']} />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="engineers" element={<AdminEngineersPage />} />
          <Route path="engineers/:id" element={<EngineerDetails />} />
          <Route path="engineers/edit/:id" element={<EditEngineer />} />
          <Route path="designs" element={<AdminDesigns />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="security" element={<AdminSecurity />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
