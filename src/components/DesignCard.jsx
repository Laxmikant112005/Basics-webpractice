import React from 'react';
import {
  MapPin,
  BedDouble,
  Layers,
  Star,
  Heart,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext';

/*
 * ---------------------------------------------------------
 * Fallback Design Images
 * ---------------------------------------------------------
 * Backend image has priority.
 * These images are only used when design.image is missing
 * or the backend image fails to load.
 */
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
];

/*
 * Select a stable fallback image.
 * We intentionally don't use Math.random().
 */
const getFallbackImage = (design) => {
  const identifier = String(
    design?.id ||
    design?._id ||
    design?.designId ||
    design?.title ||
    'design'
  );

  let hash = 0;

  for (let i = 0; i < identifier.length; i += 1) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % FALLBACK_IMAGES.length;

  return FALLBACK_IMAGES[index];
};

/*
 * ---------------------------------------------------------
 * Budget Formatter
 * ---------------------------------------------------------
 *
 * IMPORTANT:
 * This assumes your backend budget is already in INR.
 *
 * If your backend stores USD, change this function to:
 *
 * const convertToINR = (usd) =>
 *   `₹${(Number(usd) * 82).toLocaleString('en-IN')}`;
 */
const formatINR = (amount) => {
  const value = Number(amount);

  if (!Number.isFinite(value) || value <= 0) {
    return 'Price on request';
  }

  return `₹${value.toLocaleString('en-IN')}`;
};

const DesignCard = ({ design, className }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!design) {
    return null;
  }

  /*
   * Support both:
   * MongoDB: _id
   * Frontend/API: id
   */
  const designId =
    design?.id ||
    design?._id ||
    design?.designId;

  /*
   * Backend image first.
   * Local image/fallback after that.
   */
  const fallbackImage =
    design?.fallbackImage ||
    getFallbackImage(design);

  const imageUrl =
    design?.image ||
    design?.imageUrl ||
    design?.coverImage ||
    design?.thumbnail ||
    fallbackImage;

  const title =
    design?.title ||
    design?.name ||
    'Untitled Design';

  const location =
    design?.location ||
    design?.city ||
    'India';

  const bedrooms =
    Number(design?.bedrooms) || 0;

  const floors =
    Number(design?.floors) || 0;

  const rating =
    design?.rating !== undefined &&
    design?.rating !== null
      ? design.rating
      : '4.9';

  const budget =
    design?.budget ??
    design?.price ??
    design?.estimatedBudget;

  return (
    <Link
      to={`/designs/${designId || ''}`}
      className={cn(
        `
        group
        relative
        block
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-[#D4AF37]
        hover:shadow-2xl
        `,
        className
      )}
    >
      {/* =====================================================
          IMAGE
      ====================================================== */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
          "
          onError={(event) => {
            /*
             * If backend image fails, use our fallback image.
             */
            if (event.currentTarget.src !== fallbackImage) {
              event.currentTarget.src = fallbackImage;
            } else {
              /*
               * Final local fallback.
               * Add this file if you want an offline fallback.
               */
              event.currentTarget.src =
                '/images/placeholder-design.jpg';
            }

            /*
             * Prevent infinite error loops.
             */
            event.currentTarget.onerror = null;
          }}
        />

        {/* Image overlay */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/30
            via-transparent
            to-transparent
            opacity-60
          "
        />

        {/* ===================================================
            RATING
        ==================================================== */}
        <div className="absolute left-4 top-4 z-10">
          <div
            className="
              flex
              items-center
              gap-1.5
              rounded-lg
              bg-white/95
              px-2.5
              py-1.5
              shadow-md
              backdrop-blur-sm
            "
          >
            <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />

            <span className="text-xs font-bold text-navy">
              {rating}
            </span>
          </div>
        </div>

        {/* ===================================================
            FAVORITE
        ==================================================== */}
        <button
          type="button"
          aria-label={
            isFavorite(designId)
              ? 'Remove from favorites'
              : 'Save design'
          }
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-white/70
            bg-white/95
            shadow-lg
            backdrop-blur-sm
            transition-all
            duration-200
            hover:scale-105
            hover:border-red-200
            hover:bg-white
          "
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (designId) {
              toggleFavorite(designId);
            }
          }}
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-colors',
              isFavorite(designId)
                ? 'fill-red-500 text-red-500'
                : 'text-slate-400 hover:text-red-500'
            )}
          />
        </button>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="min-w-0 p-5 sm:p-6">
        {/* Title + Budget */}
        <div className="mb-3 flex min-w-0 items-start justify-between gap-4">
          <h3
            className="
              min-w-0
              flex-1
              truncate
              text-lg
              font-bold
              text-navy
              transition-colors
              group-hover:text-[#D4AF37]
            "
            title={title}
          >
            {title}
          </h3>

          <span
            className="
              shrink-0
              whitespace-nowrap
              text-sm
              font-extrabold
              text-[#D4AF37]
              sm:text-base
            "
          >
            {formatINR(budget)}
          </span>
        </div>

        {/* Location */}
        <div className="mb-5 flex min-w-0 items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4 shrink-0 text-[#D4AF37]" />

          <span
            className="truncate"
            title={location}
          >
            {location}
          </span>
        </div>

        {/* Details */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-5
            gap-y-3
            border-t
            border-slate-100
            pt-4
          "
        >
          {/* Bedrooms */}
          <div className="flex items-center gap-2 text-slate-600">
            <BedDouble className="h-4 w-4 shrink-0 text-[#D4AF37]" />

            <span className="whitespace-nowrap text-sm font-medium">
              {bedrooms} Beds
            </span>
          </div>

          {/* Floors */}
          <div className="flex items-center gap-2 text-slate-600">
            <Layers className="h-4 w-4 shrink-0 text-[#D4AF37]" />

            <span className="whitespace-nowrap text-sm font-medium">
              {floors} Floors
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DesignCard;