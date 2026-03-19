import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { designAPI } from '../services/api';
import DesignCard from '../components/DesignCard';
import { CardSkeleton } from '../components/Loading';
import { 
  bhkTypes, 
  styles, 
  facingDirections 
} from '../utils/designFilters';
import Loading from '../components/Loading';

const Designs = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 12;
  const [filters, setFilters] = useState({
    type: '',
    style: '',
    facing: '',
    floors: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
  });

  const navigate = useNavigate();

  // useApi for fetching designs
  const fetchDesignsApi = useApi(designAPI.getDesigns);
  const suggestDesignsApi = useApi((data) => api.post('/designs/suggestion/suggest', data));

  const fetchDesigns = useCallback(async (pageNum = page, currentFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pageNum,
        limit: LIMIT,
        ...currentFilters,
      };
      const response = await fetchDesignsApi.execute(params);
      setDesigns(response?.designs || []);
      setTotal(response?.pagination?.total || 0);
    } catch (err) {
      setError('Failed to load designs. Please try again.');
      console.error('Error fetching designs:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchDesignsApi.execute, page, filters]);

  // Fetch designs on mount and filter/page change
  useEffect(() => {
    fetchDesigns(1, filters);
  }, [filters.style, filters.type, filters.facing, filters.floors, filters.minPrice, filters.maxPrice, filters.minArea, filters.maxArea]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value,
      page: 1 // Reset to first page
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      type: '',
      style: '',
      facing: '',
      floors: '',
      minPrice: '',
      maxPrice: '',
      minArea: '',
      maxArea: '',
    });
  };

  const handleSmartSuggestion = async () => {
    try {
      setLoading(true);
      const response = await suggestDesignsApi.execute({
        budget: 3000000,
        area: 1200,
        style: filters.style || 'modern',
        floors: filters.floors || 2,
      });
      console.log('Smart suggestions:', response);
      // Optionally update designs with suggestions
      setDesigns(response?.designs || designs);
    } catch (err) {
      setError('Failed to get recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const bhkOptions = bhkTypes.map(t => ({ value: t, label: t }));
  const styleOptions = styles.map(s => ({ value: s, label: s }));
  const facingOptions = facingDirections.map(f => ({ value: f, label: f }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Explore Designs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover thousands of verified house designs by top engineers. Filter by your plot size, budget, and style.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl ring-1 ring-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Filters</h3>
              
              {/* BHK */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">BHK Type</label>
                <select 
                  value={filters.type} 
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {bhkOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Style */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                <select 
                  value={filters.style} 
                  onChange={(e) => handleFilterChange('style', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Styles</option>
                  {styleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Facing */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Facing</label>
                <select 
                  value={filters.facing} 
                  onChange={(e) => handleFilterChange('facing', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Facing</option>
                  {facingOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Floors */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Floors</label>
                <select 
                  value={filters.floors} 
                  onChange={(e) => handleFilterChange('floors', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Floors</option>
                  {[1,2,3,4,5].map(f => (
                    <option key={f} value={f}>{f} Floor{f > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6 space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₹)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Area Range */}
              <div className="mb-6 space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Plot Area (sqft)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minArea}
                    onChange={(e) => handleFilterChange('minArea', e.target.value)}
                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxArea}
                    onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleClearFilters}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all"
              >
                Clear All Filters
              </button>

              <button
                onClick={handleSmartSuggestion}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                ✨ Get Smart Recommendations
              </button>
            </div>
          </div>

          {/* Designs Grid */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
                <p className="text-red-800">{error}</p>
                <button 
                  onClick={() => fetchDesigns(1, filters)}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {total} designs found
                </h2>
                <p className="text-gray-600 mt-1">
                  Page {page} of {Math.ceil(total / LIMIT)}
                </p>
              </div>
              <span className="text-sm text-gray-500">
                Sort by relevance
              </span>
            </div>

            {loading ? (
              <CardSkeleton count={9} />
            ) : designs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">🏠</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No designs found</h3>
                <p className="text-gray-500 mb-8">Try adjusting your filters</p>
                <button 
                  onClick={handleClearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {designs.map((design) => (
                  <DesignCard key={design._id || design.id} design={design} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {total > LIMIT && (
              <div className="flex justify-center mt-16 space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 font-medium text-gray-700">
                  Page {page} of {Math.ceil(total / LIMIT)}
                </span>
                <button
                  disabled={page * LIMIT >= total}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Designs;

