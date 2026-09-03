import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid,
  PlusCircle,
  ClipboardList,
  Users,
  MapPin,
  ShoppingBag,
  DollarSign,
  BarChart3,
  ShieldCheck,
  Clock,
  Heart,
  Bell,
  User,
  MessageSquare,
  Star,
  Settings,
  ChevronRight,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = {
    user: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Browse Designs', icon: Grid, path: '/designs' },
      { name: 'Map My Field', icon: MapPin, path: '/user/map-field' },
      { name: 'Engineers', icon: Users, path: '/user/engineers' },
      { name: 'My Bookings', icon: ClipboardList, path: '/user/bookings' },
      { name: 'Marketplace', icon: ShoppingBag, path: '/user/marketplace' },
      { name: 'Favorites', icon: Heart, path: '/user/favorites' },
      { name: 'Notifications', icon: Bell, path: '/user/notifications' },
      { name: 'Profile', icon: User, path: '/user/profile' },
    ],

    engineer: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/engineer/dashboard' },
      { name: 'Profile', icon: User, path: '/engineer/profile' },
      { name: 'My Designs', icon: Grid, path: '/engineer/designs' },
      { name: 'Upload New', icon: PlusCircle, path: '/engineer/upload' },
      { name: 'Bookings', icon: ClipboardList, path: '/engineer/requests' },
      { name: 'Availability', icon: Clock, path: '/engineer/availability' },
      { name: 'Messages', icon: MessageSquare, path: '/engineer/messages' },
      { name: 'Reviews', icon: Star, path: '/engineer/reviews' },
    ],

    admin: [
      { name: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
      { name: 'Manage Users', icon: Users, path: '/admin/users' },
      { name: 'Manage Engineers', icon: Users, path: '/admin/engineers' },
      { name: 'Designs', icon: Grid, path: '/admin/designs' },
      { name: 'Products', icon: ShoppingBag, path: '/admin/products' },
      { name: 'Transactions', icon: DollarSign, path: '/admin/transactions' },
      { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
      { name: 'Security', icon: ShieldCheck, path: '/admin/security' },
      { name: 'Feedback', icon: MessageSquare, path: '/admin/feedback' },
    ],
  };

  const role = user?.role?.toLowerCase();
  const currentItems = menuItems[role] || [];

  return (
    <aside
      className="
        group/sidebar
        sticky top-20
        z-40
        flex
        h-[calc(100vh-5rem)]
        w-[280px]
        min-w-[280px]
        max-w-[280px]
        shrink-0
        flex-col
        overflow-hidden
        border-r border-white/10
        bg-[#07111F]
        text-white
        shadow-[8px_0_30px_rgba(0,0,0,0.12)]
      "
    >
      {/* Sidebar Header */}
      <div className="shrink-0 px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              Workspace
            </p>

            <h3 className="mt-1 text-sm font-semibold text-white">
              {role === 'engineer'
                ? 'Engineer Panel'
                : role === 'admin'
                ? 'Admin Panel'
                : 'User Panel'}
            </h3>
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
            <LayoutDashboard className="h-4 w-4 text-[#D4AF37]" />
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav
        className="
          flex-1
          min-h-0
          overflow-y-auto
          overflow-x-hidden
          px-4
          pb-4
          scrollbar-thin
          scrollbar-thumb-white/10
          scrollbar-track-transparent
        "
      >
        <div className="mb-3 px-3">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Menu
          </h4>
        </div>

        <div className="space-y-1.5">
          {currentItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    `
                    group
                    relative
                    flex
                    min-h-[46px]
                    w-full
                    items-center
                    rounded-xl
                    px-3
                    transition-all
                    duration-200
                    ease-out
                    `,
                    isActive
                      ? `
                        bg-[#D4AF37]
                        text-[#07111F]
                        shadow-[0_8px_24px_rgba(212,175,55,0.18)]
                      `
                      : `
                        text-slate-400
                        hover:bg-white/[0.06]
                        hover:text-white
                      `
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    <span
                      className={cn(
                        'absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition-all',
                        isActive
                          ? 'bg-[#07111F] opacity-100'
                          : 'bg-[#D4AF37] opacity-0 group-hover:opacity-100'
                      )}
                    />

                    {/* Icon */}
                    <span
                      className={cn(
                        `
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        transition-all
                        duration-200
                        `,
                        isActive
                          ? 'bg-black/10'
                          : 'bg-white/[0.03] group-hover:bg-white/[0.08]'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0',
                          isActive
                            ? 'text-[#07111F]'
                            : 'text-slate-400 group-hover:text-[#D4AF37]'
                        )}
                      />
                    </span>

                    {/* Label */}
                    <span
                      className={cn(
                        `
                        ml-3
                        min-w-0
                        flex-1
                        truncate
                        text-sm
                        leading-5
                        `,
                        isActive ? 'font-bold' : 'font-medium'
                      )}
                    >
                      {item.name}
                    </span>

                    {/* Arrow */}
                    <ChevronRight
                      className={cn(
                        `
                        ml-2
                        h-4
                        w-4
                        shrink-0
                        transition-all
                        duration-200
                        `,
                        isActive
                          ? 'translate-x-0 opacity-100'
                          : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'
                      )}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="shrink-0 border-t border-white/10 bg-[#07111F] p-4">
        <button
          type="button"
          className="
            group
            flex
            min-h-[46px]
            w-full
            items-center
            rounded-xl
            px-3
            text-slate-400
            transition-all
            duration-200
            hover:bg-white/[0.06]
            hover:text-white
          "
        >
          <span
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-white/[0.03]
              transition-colors
              group-hover:bg-white/[0.08]
            "
          >
            <Settings className="h-[18px] w-[18px] transition-colors group-hover:text-[#D4AF37]" />
          </span>

          <span className="ml-3 flex-1 text-left text-sm font-medium">
            Settings
          </span>

          <ChevronRight
            className="
              h-4
              w-4
              shrink-0
              -translate-x-1
              opacity-0
              transition-all
              group-hover:translate-x-0
              group-hover:opacity-60
            "
          />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;