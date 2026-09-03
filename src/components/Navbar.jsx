import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Safely get the user's display name.
   * Supports different possible user object structures.
   */
  const displayName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.email?.split('@')[0] ||
    'User';

  const userInitial = displayName.charAt(0).toUpperCase();

  /**
   * Determine dashboard according to role.
   *
   * Adjust these routes if your application uses
   * different role-specific dashboard paths.
   */
  const getDashboardPath = useCallback(() => {
    const role = String(
      user?.role ||
      user?.userType ||
      user?.accountType ||
      ''
    ).toUpperCase();

    switch (role) {
      case 'ENGINEER':
        return '/engineer/dashboard';

      case 'ADMIN':
        return '/admin/dashboard';

      case 'USER':
      default:
        return '/dashboard';
    }
  }, [user]);

  const dashboardPath = getDashboardPath();

  /**
   * Close mobile menu.
   */
  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  /**
   * Handle logout safely.
   */
  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    closeMobileMenu();

    try {
      await logout();

      // Make sure user is returned to the public page.
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);

      // Even if logout API fails, don't leave the user
      // stuck on a protected screen.
      navigate('/', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  /**
   * Navigate and close mobile menu.
   */
  const handleMobileNavigation = () => {
    closeMobileMenu();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center space-x-2"
            aria-label="DreamHouse Home"
          >
            <div className="bg-gold p-2 rounded-lg">
              <Home className="w-6 h-6 text-navy" />
            </div>

            <span className="text-white font-bold text-xl tracking-tight">
              Dream
              <span className="text-gold">House</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">

            <Link
              to="/"
              className="text-slate-300 hover:text-gold transition-colors duration-200"
            >
              Home
            </Link>

            {user ? (
              <>
                {/* Dashboard */}
                <Link
                  to={dashboardPath}
                  className="text-slate-300 hover:text-gold transition-colors duration-200 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {/* User section */}
                <div className="flex items-center space-x-4 pl-4 border-l border-white/10">

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 group"
                    aria-label="Open profile"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center">
                      <span className="text-gold font-semibold text-sm">
                        {userInitial}
                      </span>
                    </div>

                    <span className="text-white font-medium group-hover:text-gold transition-colors">
                      {displayName}
                    </span>
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    aria-label="Logout"
                    title="Logout"
                    className="text-slate-300 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">

                <Link
                  to="/login"
                  className="text-white hover:text-gold transition-colors duration-200"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn-gold"
                >
                  Sign Up
                </Link>

              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen((previous) => !previous)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden bg-navy border-b border-white/10 p-4 space-y-2 shadow-xl"
        >
          {/* Home */}
          <Link
            to="/"
            onClick={handleMobileNavigation}
            className="block text-slate-300 hover:text-gold transition-colors py-3 px-2 rounded-lg hover:bg-white/5"
          >
            Home
          </Link>

          {user ? (
            <>
              {/* Dashboard */}
              <Link
                to={dashboardPath}
                onClick={handleMobileNavigation}
                className="flex items-center gap-2 text-slate-300 hover:text-gold transition-colors py-3 px-2 rounded-lg hover:bg-white/5"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                onClick={handleMobileNavigation}
                className="flex items-center gap-2 text-slate-300 hover:text-gold transition-colors py-3 px-2 rounded-lg hover:bg-white/5"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>

              {/* User information */}
              <div className="flex items-center gap-3 px-2 py-3 border-t border-white/10 mt-2">
                <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center">
                  <span className="text-gold font-semibold">
                    {userInitial}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-white font-medium truncate">
                    {displayName}
                  </p>

                  {user?.email && (
                    <p className="text-slate-400 text-sm truncate">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2 text-left text-red-400 hover:text-red-300 transition-colors py-3 px-2 rounded-lg hover:bg-red-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4" />

                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                onClick={handleMobileNavigation}
                className="block text-slate-300 hover:text-gold transition-colors py-3 px-2 rounded-lg hover:bg-white/5"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                onClick={handleMobileNavigation}
                className="block btn-gold text-center mt-2"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;