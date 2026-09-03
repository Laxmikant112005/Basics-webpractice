import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
  LayoutDashboard,
  Bell,
  Calendar,
  RefreshCw,
  X,
  Sparkles,
  Home,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useBookings } from '../../context/BookingContext';
import { designService } from '../../services/designService';
import DesignCard from '../../components/DesignCard';
import FiltersSidebar from '../../components/FiltersSidebar';
import { cn } from '../../utils/cn';

/*
|--------------------------------------------------------------------------
| Premium fallback design images
|--------------------------------------------------------------------------
| These are used by DesignCard when a design doesn't have a valid image.
*/
const DESIGN_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
];

/*
|--------------------------------------------------------------------------
| Stable image assignment
|--------------------------------------------------------------------------
| We don't use Math.random() because that would change images on every
| render. Each design gets a stable image based on its ID.
*/
const getDesignImage = (design, index = 0) => {
  if (
    design?.image &&
    typeof design.image === 'string' &&
    design.image.trim()
  ) {
    return design.image;
  }

  if (
    design?.imageUrl &&
    typeof design.imageUrl === 'string' &&
    design.imageUrl.trim()
  ) {
    return design.imageUrl;
  }

  if (
    design?.coverImage &&
    typeof design.coverImage === 'string' &&
    design.coverImage.trim()
  ) {
    return design.coverImage;
  }

  const identifier = String(
    design?.id ||
      design?._id ||
      design?.designId ||
      design?.title ||
      index
  );

  let hash = 0;

  for (let i = 0; i < identifier.length; i += 1) {
    hash =
      identifier.charCodeAt(i) +
      ((hash << 5) - hash);
  }

  return DESIGN_IMAGES[
    Math.abs(hash) % DESIGN_IMAGES.length
  ];
};

/*
|--------------------------------------------------------------------------
| Safe number helper
|--------------------------------------------------------------------------
*/
const toNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

/*
|--------------------------------------------------------------------------
| User Dashboard
|--------------------------------------------------------------------------
*/
const UserDashboard = () => {
  const {
    bookings = [],
    loading: bookingsLoading = false,
  } = useBookings();

  const [designs, setDesigns] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('latest');

  const [showMobileFilters, setShowMobileFilters] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch designs
  |--------------------------------------------------------------------------
  */
  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await designService.getAll();

      /*
       * Support different API response formats:
       *
       * [...]
       * { designs: [...] }
       * { data: [...] }
       */
      let data = [];

      if (Array.isArray(response)) {
        data = response;
      } else if (Array.isArray(response?.designs)) {
        data = response.designs;
      } else if (Array.isArray(response?.data)) {
        data = response.data;
      }

      setDesigns(data);
    } catch (err) {
      console.error(
        'Failed to fetch designs:',
        err
      );

      setDesigns([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Unable to load designs. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Search + Filter + Sort
  |--------------------------------------------------------------------------
  */
  const filteredDesigns = useMemo(() => {
    let result = [...designs];

    const normalizedSearch =
      search.trim().toLowerCase();

    /*
     * Search
     */
    if (normalizedSearch) {
      result = result.filter((design) => {
        const tags = Array.isArray(design?.tags)
          ? design.tags
          : [];

        const searchableText = [
          design?.title,
          design?.name,
          design?.location,
          design?.city,
          design?.style,
          design?.category,
          design?.description,
          ...tags,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableText.includes(
          normalizedSearch
        );
      });
    }

    /*
     * Floors
     */
    if (
      filters?.floors !== undefined &&
      filters?.floors !== null &&
      filters?.floors !== ''
    ) {
      const selectedFloors =
        Number(filters.floors);

      result = result.filter(
        (design) =>
          Number(design?.floors) === selectedFloors
      );
    }

    /*
     * Bedrooms
     */
    if (
      filters?.bedrooms !== undefined &&
      filters?.bedrooms !== null &&
      filters?.bedrooms !== ''
    ) {
      const selectedBedrooms =
        Number(filters.bedrooms);

      result = result.filter(
        (design) =>
          Number(design?.bedrooms) ===
          selectedBedrooms
      );
    }

    /*
     * Budget
     */
    if (filters?.budget) {
      const budgetParts =
        String(filters.budget)
          .split('-')
          .map((value) =>
            Number(value)
          );

      const minBudget =
        budgetParts[0] || 0;

      const maxBudget =
        budgetParts[1] || null;

      result = result.filter((design) => {
        const budget = toNumber(
          design?.budget
        );

        if (!budget) {
          return false;
        }

        return (
          budget >= minBudget &&
          (maxBudget === null ||
            budget <= maxBudget)
        );
      });
    }

    /*
     * Sorting
     */
    result.sort((a, b) => {
      if (sortBy === 'price-low') {
        return (
          toNumber(a?.budget) -
          toNumber(b?.budget)
        );
      }

      if (sortBy === 'price-high') {
        return (
          toNumber(b?.budget) -
          toNumber(a?.budget)
        );
      }

      if (sortBy === 'rating') {
        return (
          toNumber(b?.rating, 0) -
          toNumber(a?.rating, 0)
        );
      }

      /*
       * Latest
       */
      const dateA = new Date(
        a?.createdAt ||
          a?.updatedAt ||
          0
      ).getTime();

      const dateB = new Date(
        b?.createdAt ||
          b?.updatedAt ||
          0
      ).getTime();

      return dateB - dateA;
    });

    return result;
  }, [
    designs,
    search,
    filters,
    sortBy,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Clear filters
  |--------------------------------------------------------------------------
  */
  const clearFilters = () => {
    setSearch('');
    setFilters({});
  };

  const hasActiveFilters =
    Boolean(search.trim()) ||
    Object.keys(filters || {}).some(
      (key) =>
        filters[key] !== undefined &&
        filters[key] !== null &&
        filters[key] !== ''
    );

  /*
  |--------------------------------------------------------------------------
  | Booking count
  |--------------------------------------------------------------------------
  */
  const bookingCount = Array.isArray(bookings)
    ? bookings.length
    : 0;

  return (
    <main className="min-w-0 w-full">
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="flex min-w-0 gap-6 xl:gap-8">

          {/* =====================================================
              DESKTOP FILTER SIDEBAR
          ====================================================== */}
          <aside className="hidden w-64 shrink-0 lg:block xl:w-72">
            <div className="sticky top-24">
              <FiltersSidebar
                filters={filters}
                setFilters={setFilters}
              />
            </div>
          </aside>

          {/* =====================================================
              MOBILE FILTER PANEL
          ====================================================== */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close filters"
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                onClick={() =>
                  setShowMobileFilters(false)
                }
              />

              <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                      Refine
                    </p>

                    <h2 className="mt-1 text-xl font-extrabold text-navy">
                      Design Filters
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowMobileFilters(false)
                    }
                    className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <FiltersSidebar
                  filters={filters}
                  setFilters={setFilters}
                />
              </div>
            </div>
          )}

          {/* =====================================================
              MAIN
          ====================================================== */}
          <section className="min-w-0 flex-1 space-y-6">

            {/* ===================================================
                HERO
            ==================================================== */}
            <section
              className="
                relative
                min-h-[260px]
                overflow-hidden
                rounded-[2rem]
                border
                border-slate-800
                bg-[#071426]
                px-6
                py-8
                shadow-2xl
                sm:px-8
                sm:py-10
                lg:px-12
              "
            >
              {/* Decorative image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{
                  backgroundImage: `url("${DESIGN_IMAGES[0]}")`,
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#071426] via-[#071426]/95 to-transparent" />

              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />

              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full border border-[#D4AF37]/10" />

              <div className="relative z-10 max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#D4AF37]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Planova Design Studio
                </div>

                <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Build a home that
                  <span className="block text-[#D4AF37]">
                    feels like yours.
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Discover curated residential designs,
                  connect with professionals and turn your
                  vision into a real construction project.
                </p>

                {/* Search */}
                <div className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row">
                  <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5 backdrop-blur-xl transition focus-within:border-[#D4AF37]/50 focus-within:bg-white/15">
                    <Search className="mr-3 h-5 w-5 shrink-0 text-slate-400" />

                    <input
                      type="search"
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                      placeholder="Search villas, styles, locations..."
                      className="min-w-0 w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-400"
                    />

                    {search && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearch('')
                        }
                        className="ml-2 rounded-lg p-1 text-slate-400 hover:text-white"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowMobileFilters(true)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-5 py-3.5 text-sm font-extrabold text-[#071426] shadow-lg shadow-[#D4AF37]/20 transition hover:-translate-y-0.5 hover:bg-[#e0bd4d] lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>
                </div>
              </div>
            </section>

            {/* ===================================================
                QUICK ACTIONS
            ==================================================== */}
            <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

              {/* Designs */}
              <Link
                to="/designs"
                className="
                  group
                  relative
                  min-w-0
                  overflow-hidden
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#D4AF37]
                  hover:shadow-xl
                "
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#D4AF37]/10 transition-transform duration-500 group-hover:scale-150" />

                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#071426] text-[#D4AF37]">
                      <LayoutDashboard className="h-6 w-6" />
                    </div>

                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Explore
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-navy">
                    Browse Designs
                  </h3>

                  <p className="mt-2 text-sm leading-5 text-slate-500">
                    Explore premium home concepts
                    for your next project.
                  </p>

                  <div className="mt-5 text-sm font-bold text-[#D4AF37]">
                    Explore collection →
                  </div>
                </div>
              </Link>

              {/* Bookings */}
              <Link
                to="/user/bookings"
                className="
                  group
                  relative
                  min-w-0
                  overflow-hidden
                  rounded-3xl
                  border
                  border-emerald-100
                  bg-gradient-to-br
                  from-emerald-50
                  to-white
                  p-6
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                    <Calendar className="h-6 w-6" />
                  </div>

                  {bookingsLoading && (
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-emerald-900">
                  My Bookings
                </h3>

                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-black text-emerald-700">
                    {bookingCount}
                  </span>

                  <span className="mb-1 text-sm text-emerald-600">
                    active bookings
                  </span>
                </div>
              </Link>

              {/* Notifications */}
              <Link
                to="/user/notifications"
                className="
                  group
                  relative
                  min-w-0
                  overflow-hidden
                  rounded-3xl
                  border
                  border-blue-100
                  bg-gradient-to-br
                  from-blue-50
                  to-white
                  p-6
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  sm:col-span-2
                  xl:col-span-1
                "
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    <Bell className="h-6 w-6" />
                  </div>

                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Updates
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-blue-900">
                  Notifications
                </h3>

                <p className="mt-2 text-sm text-blue-600">
                  Stay updated with your projects,
                  bookings and messages.
                </p>
              </Link>
            </section>

            {/* ===================================================
                RESULTS TOOLBAR
            ==================================================== */}
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                {/* Result count */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-medium text-slate-400">
                      Showing
                    </span>

                    <span className="text-2xl font-black text-navy">
                      {filteredDesigns.length}
                    </span>

                    <span className="text-sm font-medium text-slate-500">
                      {filteredDesigns.length === 1
                        ? 'design'
                        : 'designs'}
                    </span>
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-1 text-xs font-bold text-[#D4AF37] hover:underline"
                    >
                      Clear search & filters
                    </button>
                  )}
                </div>

                {/* Controls */}
                <div className="flex min-w-0 flex-wrap items-center gap-2">

                  {/* View */}
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setViewMode('grid')
                      }
                      aria-label="Grid view"
                      className={cn(
                        'rounded-lg p-2 transition',
                        viewMode === 'grid'
                          ? 'bg-white text-navy shadow-sm'
                          : 'text-slate-400 hover:text-navy'
                      )}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setViewMode('list')
                      }
                      aria-label="List view"
                      className={cn(
                        'rounded-lg p-2 transition',
                        viewMode === 'list'
                          ? 'bg-white text-navy shadow-sm'
                          : 'text-slate-400 hover:text-navy'
                      )}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Sort */}
                  <div className="relative flex items-center">
                    <ArrowUpDown className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />

                    <select
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(
                          event.target.value
                        )
                      }
                      className="
                        appearance-none
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        py-2.5
                        pl-9
                        pr-9
                        text-sm
                        font-bold
                        text-slate-600
                        outline-none
                        transition
                        focus:border-[#D4AF37]
                      "
                    >
                      <option value="latest">
                        Latest
                      </option>

                      <option value="rating">
                        Top Rated
                      </option>

                      <option value="price-low">
                        Price: Low
                      </option>

                      <option value="price-high">
                        Price: High
                      </option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </section>

            {/* ===================================================
                ERROR
            ==================================================== */}
            {error && !loading && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-red-800">
                      Unable to load designs
                    </h3>

                    <p className="mt-1 text-sm text-red-600">
                      {error}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={fetchDesigns}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* ===================================================
                LOADING
            ==================================================== */}
            {loading && (
              <div
                className={cn(
                  'grid gap-6',
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1'
                )}
              >
                {[0, 1, 2, 3].map(
                  (item) => (
                    <div
                      key={`design-skeleton-${item}`}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
                    >
                      <div className="h-64 animate-pulse bg-slate-200" />

                      <div className="space-y-4 p-6">
                        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />

                        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />

                        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />

                        <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* ===================================================
                DESIGNS
            ==================================================== */}
            {!loading &&
              !error &&
              filteredDesigns.length > 0 && (
                <div
                  className={cn(
                    'min-w-0',
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 gap-6 md:grid-cols-2'
                      : 'grid grid-cols-1 gap-5'
                  )}
                >
                  {filteredDesigns.map(
                    (design, index) => {
                      const designId =
                        design?.id ||
                        design?._id ||
                        design?.designId ||
                        `design-${index}`;

                      /*
                       * We pass a stable fallback image to
                       * DesignCard. If your DesignCard already
                       * contains the same fallback logic, this
                       * remains harmless.
                       */
                      const designWithImage = {
                        ...design,
                        image:
                          design?.image ||
                          design?.imageUrl ||
                          design?.coverImage ||
                          getDesignImage(
                            design,
                            index
                          ),
                      };

                      return (
                        <div
                          key={designId}
                          className={cn(
                            'min-w-0',
                            viewMode === 'list' &&
                              'w-full'
                          )}
                        >
                          <DesignCard
                            design={
                              designWithImage
                            }
                          />
                        </div>
                      );
                    }
                  )}
                </div>
              )}

            {/* ===================================================
                EMPTY STATE
            ==================================================== */}
            {!loading &&
              !error &&
              filteredDesigns.length === 0 && (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-gradient-to-b from-white to-slate-50 px-6 text-center">

                  <div className="relative mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#071426] shadow-xl">
                      <Search className="h-9 w-9 text-[#D4AF37]" />
                    </div>

                    <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-[#071426]">
                      <Home className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-navy">
                    No designs found
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    We couldn't find any designs
                    matching your current search or
                    filters. Try broadening your criteria.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-xl bg-[#071426] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#10243c]"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default UserDashboard;