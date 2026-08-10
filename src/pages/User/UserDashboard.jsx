import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Grid as GridIcon, List, ArrowUpDown, LayoutDashboard, Bell, MessageCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookings } from '../../context/BookingContext';
import { designService } from '../../services/designService';
import DesignCard from '../../components/DesignCard';
import FiltersSidebar from '../../components/FiltersSidebar';
import { cn } from '../../utils/cn';

const UserDashboard = () => {
  const { bookings, loading: bookingsLoading } = useBookings();
  const [designs, setDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      const data = await designService.getAll();
      setDesigns(data);
      setFilteredDesigns(data);
      setLoading(false);
    };
    fetchDesigns();
  }, []);

  useEffect(() => {
    let result = designs;

    if (search) {
      result = result.filter(d => 
        d.title.toLowerCase().includes(search.toLowerCase()) || 
        d.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (filters.floors) {
      result = result.filter(d => d.floors === filters.floors);
    }

    if (filters.bedrooms) {
      result = result.filter(d => d.bedrooms === filters.bedrooms);
    }

    if (filters.budget) {
      const [min, max] = filters.budget.split('-').map(Number);
      result = result.filter(d => d.budget >= min && (max ? d.budget <= max : true));
    }

    setFilteredDesigns(result);
  }, [search, filters, designs]);

  return (
    <div className="flex gap-8">
      {/* Filters Sidebar */}
      <FiltersSidebar filters={filters} setFilters={setFilters} />

      {/* Main Content */}
      <div className="flex-grow space-y-8">
        {/* Dashboard Header */}
        <div className="space-y-8">
          <div className="bg-navy p-10 rounded-4xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="relative z-10">
              <h1 className="text-4xl font-extrabold text-white mb-2">Welcome Back!</h1>
              <p className="text-slate-400 font-medium">Your dashboard for discovering and managing dream home projects</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/designs" className="group bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-4xl p-10 hover:shadow-2xl hover:border-gold transition-all duration-300 hover:-translate-y-2">
              <LayoutDashboard className="w-16 h-16 text-navy mb-6 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-navy mb-2 text-center">Browse Designs</h3>
              <p className="text-slate-500 text-center mb-6">Discover amazing home designs</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gold font-bold uppercase tracking-wider">
                Explore Now
              </div>
            </Link>

            <Link to="/user/bookings" className="group bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/50 rounded-4xl p-10 hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 hover:-translate-y-2">
              <Calendar className="w-16 h-16 text-emerald-600 mb-6 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h3 className="text-2xl font-bold text-emerald-800 mb-2">Bookings</h3>
                <p className="text-emerald-700 mb-2 font-bold text-xl">{bookings.length}</p>
                <p className="text-emerald-600 text-sm">Active projects</p>
              </div>
            </Link>

            <Link to="/user/notifications" className="group relative bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50 rounded-4xl p-10 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 hover:-translate-y-2">
              <Bell className="w-16 h-16 text-blue-600 mb-6 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-800 mb-2">Notifications</h3>
                <p className="text-sm text-blue-600 font-medium uppercase tracking-wider mb-4">Stay Updated</p>
              </div>
              {bookingsLoading ? (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
                </div>
              ) : null}
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="bg-white border border-slate-200 rounded-4xl p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-navy mb-4">Search Designs</h3>
                <div className="flex bg-slate-100 p-4 rounded-3xl border border-slate-200">
                  <Search className="w-5 h-5 text-slate-400 mr-3 mt-0.5 flex-shrink-0" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by style, location, or budget..." 
                    className="bg-transparent border-none outline-none text-navy placeholder-slate-400 w-full"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Results Info & Grid Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4 px-2">
          <div>
            <span className="text-slate-400 font-medium">Showing</span>
            <span className="text-navy font-extrabold mx-2 text-xl">{filteredDesigns.length}</span>
            <span className="text-slate-400 font-medium tracking-tight uppercase text-xs">exclusive designs</span>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <button className="p-2 rounded-xl bg-slate-100 text-navy transition-all"><GridIcon className="w-5 h-5" /></button>
            <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 transition-all"><List className="w-5 h-5" /></button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button className="flex items-center gap-2 px-3 py-1 text-slate-500 font-bold text-sm hover:text-gold transition-colors">
              <ArrowUpDown className="w-4 h-4" /> Latest
            </button>
          </div>
        </div>

        {/* Grid (Masonry effect using CSS columns) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={`user-skeleton-${i}`} className="h-[400px] bg-slate-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredDesigns?.length > 0 ? (
          <div className="columns-1 md:columns-2 gap-8 space-y-8">
            {filteredDesigns.map((design) => (
              <div key={design?.id || `design-${Math.random()}`} className="break-inside-avoid">
                <DesignCard design={design} />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-navy">No Designs Matching Your Criteria</h3>
            <p className="text-slate-400 max-w-sm">Try adjusting your filters or search keywords to find more options.</p>
            <button onClick={() => { setSearch(''); setFilters({}); }} className="text-gold font-bold underline">Clear all and browse everything</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
