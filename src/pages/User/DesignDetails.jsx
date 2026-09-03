import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Calendar,
  Car,
  CheckCircle2,
  Download,
  ExternalLink,
  Layers,
  MapPin,
  MessageCircle,
  Share2,
  ShieldCheck,
  Star,
  UtensilsCrossed,
} from "lucide-react";

import { useBookings } from "../../context/BookingContext";
import { useNotifications } from "../../context/NotificationContext";
import { designService } from "../../services/designService";
import { userService } from "../../services/userService";
import BookingModal from "../../components/BookingModal";

const PLACEHOLDER_IMAGE = "/images/placeholder-design.jpg";

const getErrorMessage = (error, fallback = "Something went wrong.") => {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const getId = (value) => {
  if (!value) return null;

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return String(
    value?.id ||
      value?._id ||
      value?.userId ||
      value?.engineerId ||
      ""
  );
};

const getArrayFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.engineers)) return response.engineers;
  if (Array.isArray(response?.data?.engineers)) {
    return response.data.engineers;
  }

  return [];
};

const normalizeImageUrl = (image) => {
  if (!image) return PLACEHOLDER_IMAGE;
  if (typeof image === "string") return image;

  return (
    image?.url ||
    image?.secure_url ||
    image?.src ||
    image?.path ||
    PLACEHOLDER_IMAGE
  );
};

const formatNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) return "0";

  return number.toLocaleString("en-IN");
};

const formatBudget = (budget, currency = "INR", exchangeRate = 82) => {
  const value = Number(budget);

  if (!Number.isFinite(value) || value <= 0) {
    return "Price TBD";
  }

  if (String(currency).toUpperCase() === "USD") {
    return `₹${formatNumber(value * exchangeRate)}`;
  }

  return `₹${formatNumber(value)}`;
};

const DesignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { createBooking } = useBookings();
  const { addNotification } = useNotifications();

  const [design, setDesign] = useState(null);
  const [engineer, setEngineer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const [shareLoading, setShareLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* Fetch design                                                           */
  /* ---------------------------------------------------------------------- */

  const fetchDesign = useCallback(
    async (signal) => {
      if (!id) {
        setPageError("Invalid design ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setPageError("");

      try {
        const response = await designService.getById(id);

        if (signal?.aborted) return;

        const data =
          response?.design ||
          response?.data?.design ||
          response?.data ||
          response;

        if (!data || typeof data !== "object") {
          throw new Error("Design not found.");
        }

        setDesign(data);

        const populatedEngineer =
          data?.engineer ||
          data?.engineerDetails ||
          data?.createdBy;

        if (populatedEngineer && typeof populatedEngineer === "object") {
          setEngineer(populatedEngineer);
          return;
        }

        const engineerId =
          getId(data?.engineerId) ||
          getId(data?.engineer_id) ||
          getId(data?.engineer);

        if (!engineerId) {
          setEngineer(null);
          return;
        }

        try {
          const engineersResponse = await userService.getEngineers();

          if (signal?.aborted) return;

          const engineers = getArrayFromResponse(engineersResponse);

          const matchedEngineer = engineers.find((item) => {
            const ids = [
              getId(item),
              getId(item?.id),
              getId(item?._id),
              getId(item?.userId),
              getId(item?.user?.id),
              getId(item?.user?._id),
            ].filter(Boolean);

            return ids.includes(engineerId);
          });

          setEngineer(matchedEngineer || null);
        } catch (engineerError) {
          console.warn(
            "Engineer information unavailable:",
            engineerError
          );

          setEngineer(null);
        }
      } catch (error) {
        if (signal?.aborted) return;

        console.error("Design loading error:", error);

        const message = getErrorMessage(
          error,
          "Unable to load this design."
        );

        setPageError(message);
        setDesign(null);

        try {
          addNotification(message, "error");
        } catch {
          // Prevent notification failure from crashing the page.
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [id, addNotification]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchDesign(controller.signal);

    return () => controller.abort();
  }, [fetchDesign]);

  /* ---------------------------------------------------------------------- */
  /* Derived values                                                         */
  /* ---------------------------------------------------------------------- */

  const designId = useMemo(() => getId(design), [design]);
  const engineerId = useMemo(() => getId(engineer), [engineer]);

  const designTitle = useMemo(
    () =>
      design?.title ||
      design?.name ||
      design?.designName ||
      "Architectural Design",
    [design]
  );

  const designImage = useMemo(
    () =>
      normalizeImageUrl(
        design?.image ||
          design?.imageUrl ||
          design?.thumbnail ||
          design?.coverImage ||
          design?.featuredImage
      ),
    [design]
  );

  const engineerName = useMemo(
    () =>
      engineer?.name ||
      engineer?.fullName ||
      engineer?.user?.name ||
      engineer?.user?.fullName ||
      "Professional Engineer",
    [engineer]
  );

  const engineerAvatar = useMemo(
    () =>
      normalizeImageUrl(
        engineer?.avatar ||
          engineer?.profileImage ||
          engineer?.profilePicture ||
          engineer?.image ||
          engineer?.user?.avatar
      ),
    [engineer]
  );

  const engineerSpecialization = useMemo(
    () =>
      engineer?.specialization ||
      engineer?.specialty ||
      engineer?.profession ||
      engineer?.user?.specialization ||
      "Architectural Professional",
    [engineer]
  );

  const budget = useMemo(() => {
    const amount =
      design?.budget ??
      design?.estimatedBudget ??
      design?.price ??
      design?.estimatedCost;

    const currency =
      design?.currency ||
      design?.budgetCurrency ||
      design?.priceCurrency ||
      "INR";

    return formatBudget(amount, currency);
  }, [design]);

  const rating = useMemo(() => {
    const value = Number(
      design?.rating ??
        design?.averageRating ??
        4.9
    );

    if (!Number.isFinite(value)) return "4.9";

    return Math.min(Math.max(value, 0), 5).toFixed(1);
  }, [design]);

  const specs = useMemo(
    () => [
      {
        label: "Bedrooms",
        value: design?.bedrooms ?? design?.bedroomCount ?? 0,
        icon: BedDouble,
      },
      {
        label: "Floors",
        value: design?.floors ?? design?.floorCount ?? 0,
        icon: Layers,
      },
      {
        label: "Kitchen",
        value:
          design?.kitchen ??
          design?.kitchens ??
          design?.kitchenCount ??
          0,
        icon: UtensilsCrossed,
      },
      {
        label: "Parking",
        value:
          design?.parking ??
          design?.parkingSpaces ??
          0,
        icon: Car,
      },
    ],
    [design]
  );

  /* ---------------------------------------------------------------------- */
  /* Booking                                                                */
  /* ---------------------------------------------------------------------- */

  const openBooking = () => {
    setBookingError("");

    if (!designId) {
      const message =
        "This design cannot be booked because its ID is missing.";

      setBookingError(message);
      addNotification(message, "error");

      return;
    }

    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    if (bookingLoading) return;

    setIsBookingOpen(false);
    setBookingError("");
  };

  const handleBooking = async (bookingData) => {
    if (bookingLoading) return;

    setBookingLoading(true);
    setBookingError("");

    try {
      const payload = {
        ...bookingData,
        designId:
          bookingData?.designId ||
          bookingData?.designID ||
          designId,
        engineerId:
          bookingData?.engineerId ||
          bookingData?.engineerID ||
          engineerId ||
          undefined,
      };

      await createBooking(payload);

      addNotification(
        "Booking request sent successfully!",
        "success"
      );

      setIsBookingOpen(false);
      setBookingError("");
    } catch (error) {
      console.error("Booking failed:", error);

      const message = getErrorMessage(
        error,
        "Unable to create your booking. Please try again."
      );

      setBookingError(message);
      addNotification(message, "error");
    } finally {
      setBookingLoading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Share                                                                  */
  /* ---------------------------------------------------------------------- */

  const handleShare = async () => {
    if (shareLoading) return;

    setShareLoading(true);

    try {
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title: designTitle,
          text:
            design?.description ||
            "Explore this architectural design on Planova.",
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);

        addNotification(
          "Design link copied to clipboard.",
          "success"
        );
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.warn("Share failed:", error);
      }
    } finally {
      setShareLoading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Download                                                               */
  /* ---------------------------------------------------------------------- */

  const handleDownload = async () => {
    if (downloadLoading) return;

    setDownloadLoading(true);

    try {
      const response = await fetch(designImage);

      if (!response.ok) {
        throw new Error("Download failed.");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `${designTitle
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase()}-planova.jpg`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);

      addNotification(
        "Design image downloaded successfully.",
        "success"
      );
    } catch (error) {
      console.warn("Direct download failed:", error);

      window.open(
        designImage,
        "_blank",
        "noopener,noreferrer"
      );
    } finally {
      setDownloadLoading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Engineer actions                                                       */
  /* ---------------------------------------------------------------------- */

  const openPortfolio = () => {
    if (!engineerId) return;

    navigate(`/engineers/${engineerId}`);
  };

  const openMessage = () => {
    if (!engineerId) return;

    navigate(
      `/chat?engineerId=${encodeURIComponent(engineerId)}`
    );
  };

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
        <div className="text-center animate-[fadeIn_.5s_ease-out]">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />

            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#c9a227] animate-spin" />

            <div className="absolute inset-3 rounded-full bg-[#101827] flex items-center justify-center">
              <span className="text-[#c9a227] text-xs font-black">
                P
              </span>
            </div>
          </div>

          <h2 className="text-lg font-extrabold text-[#101827]">
            Loading design
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Preparing your architectural details...
          </p>
        </div>

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Not found                                                              */
  /* ---------------------------------------------------------------------- */

  if (!design) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center px-5">
        <div className="max-w-md w-full bg-white rounded-[2rem] border border-slate-200 shadow-xl p-10 text-center animate-[fadeUp_.6s_ease-out]">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>

          <h2 className="text-2xl font-black text-[#101827] mb-3">
            Design Not Found
          </h2>

          <p className="text-slate-500 leading-relaxed mb-8">
            {pageError ||
              "This architectural design is unavailable or may have been removed."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-[#101827] hover:border-[#c9a227] hover:text-[#c9a227] transition-all"
            >
              Go Back
            </button>

            <button
              onClick={() => navigate("/designs")}
              className="flex-1 py-3 rounded-xl bg-[#101827] text-white font-bold hover:-translate-y-0.5 transition-all shadow-lg"
            >
              Browse Designs
            </button>
          </div>
        </div>

        <style>{`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Main page                                                              */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-[#f7f8fa] overflow-x-hidden">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* ================================================================ */}
        {/* BACK BUTTON                                                       */}
        {/* ================================================================ */}

        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-[#c9a227] font-bold mb-8 transition-all duration-300 animate-[slideRight_.6s_ease-out]"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </button>

        {/* ================================================================ */}
        {/* HERO                                                             */}
        {/* ================================================================ */}

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* IMAGE */}
          <div className="lg:col-span-8 animate-[imageReveal_.8s_cubic-bezier(.2,.8,.2,1)]">
            <div className="relative rounded-[2rem] overflow-hidden bg-white border border-slate-200 shadow-[0_25px_70px_rgba(15,23,42,.10)] group">

              <img
                src={designImage}
                alt={designTitle}
                className="w-full aspect-[16/10] object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                onError={(event) => {
                  event.currentTarget.src = PLACEHOLDER_IMAGE;
                  event.currentTarget.onerror = null;
                }}
              />

              {/* Image gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101827]/65 via-transparent to-transparent pointer-events-none" />

              {/* Badge */}
              <div className="absolute top-5 left-5">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#101827]/85 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[.18em] border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227] animate-pulse" />
                  Planova Collection
                </span>
              </div>

              {/* Bottom title */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-[#e2c45b] uppercase text-[10px] font-black tracking-[.25em] mb-2">
                  Featured Architecture
                </p>

                <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-3xl">
                  {designTitle}
                </h1>
              </div>

              {/* Image actions */}
              <div className="absolute top-5 right-5 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <button
                  onClick={handleDownload}
                  disabled={downloadLoading}
                  className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-[#c9a227] hover:text-[#101827] transition-all"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>

                <button
                  onClick={handleShare}
                  disabled={shareLoading}
                  className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-[#c9a227] hover:text-[#101827] transition-all"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                <button
                  onClick={() =>
                    window.open(
                      designImage,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-[#c9a227] hover:text-[#101827] transition-all"
                  title="Open image"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SUMMARY CARD                                                  */}
          {/* ============================================================ */}

          <div className="lg:col-span-4 animate-[fadeUp_.8s_.15s_both]">
            <div className="h-full bg-[#101827] rounded-[2rem] p-7 sm:p-9 text-white shadow-[0_25px_70px_rgba(15,23,42,.18)] relative overflow-hidden">

              {/* Decorative background */}
              <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-[#c9a227]/10 blur-3xl" />
              <div className="absolute -left-20 bottom-0 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl" />

              <div className="relative z-10 h-full flex flex-col">

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[#c9a227] uppercase text-[10px] font-black tracking-[.22em] mb-2">
                      Estimated Budget
                    </p>

                    <div className="text-3xl sm:text-4xl font-black tracking-tight">
                      {budget}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/10">
                    <Star className="w-4 h-4 text-[#c9a227] fill-[#c9a227]" />

                    <span className="text-sm font-black">
                      {rating}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-white/10 mb-7" />

                <div className="space-y-5">

                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#c9a227]/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-[#c9a227]" />
                    </div>

                    <div>
                      <p className="font-bold text-sm">
                        Professional Standard
                      </p>

                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Consultation-ready architectural planning.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#c9a227]/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-[#c9a227]" />
                    </div>

                    <div>
                      <p className="font-bold text-sm">
                        Flexible Scheduling
                      </p>

                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Choose a convenient consultation schedule.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#c9a227]/10 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4 text-[#c9a227]" />
                    </div>

                    <div>
                      <p className="font-bold text-sm">
                        Direct Communication
                      </p>

                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Communicate directly with the professional.
                      </p>
                    </div>
                  </div>

                </div>

                <div className="mt-auto pt-10">

                  {bookingError && (
                    <div className="mb-4 rounded-xl bg-red-500/10 border border-red-400/20 p-3 text-xs text-red-200">
                      {bookingError}
                    </div>
                  )}

                  <button
                    onClick={openBooking}
                    disabled={bookingLoading}
                    className="group w-full py-4 rounded-2xl bg-[#c9a227] text-[#101827] font-black flex items-center justify-center gap-3 shadow-lg hover:shadow-[0_15px_40px_rgba(201,162,39,.25)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                  >
                    Book Consultation

                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-center text-[9px] text-slate-500 uppercase tracking-[.18em] font-bold mt-5">
                    No initial commitment required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* CONTENT SECTION                                                  */}
        {/* ================================================================ */}

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mt-10">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-8 space-y-8">

            {/* DESCRIPTION */}
            <article className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-7 sm:p-9 animate-[fadeUp_.7s_.2s_both]">

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-[#c9a227]" />
                </div>

                <div>
                  <p className="text-[#c9a227] uppercase text-[9px] font-black tracking-[.2em]">
                    Design Concept
                  </p>

                  <h2 className="text-2xl font-black text-[#101827]">
                    Architectural Vision
                  </h2>
                </div>
              </div>

              <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
                {design?.description ||
                  "Experience living in a thoughtfully designed architectural space created around comfort, functionality, natural light, and modern living."}
              </p>

              {design?.location && (
                <div className="mt-7 pt-6 border-t border-slate-100 flex items-center gap-3 text-sm text-slate-500">
                  <MapPin className="w-4 h-4 text-[#c9a227]" />
                  <span>{design.location}</span>
                </div>
              )}
            </article>

            {/* SPECIFICATIONS */}
            <article className="animate-[fadeUp_.7s_.3s_both]">

              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="text-[#c9a227] uppercase text-[9px] font-black tracking-[.2em] mb-1">
                    Property Overview
                  </p>

                  <h2 className="text-2xl font-black text-[#101827]">
                    Design Specifications
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map((spec, index) => {
                  const Icon = spec.icon;

                  return (
                    <div
                      key={spec.label}
                      style={{
                        animationDelay: `${index * 80}ms`,
                      }}
                      className="group bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:-translate-y-2 hover:shadow-xl hover:border-[#c9a227]/30 transition-all duration-500 animate-[cardIn_.6s_both]"
                    >
                      <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-[#101827] flex items-center justify-center mb-5 transition-all duration-500">
                        <Icon className="w-5 h-5 text-[#c9a227] group-hover:scale-110 transition-transform" />
                      </div>

                      <div className="text-2xl font-black text-[#101827] group-hover:text-[#c9a227] transition-colors">
                        {formatNumber(spec.value)}
                      </div>

                      <div className="text-[9px] font-black uppercase tracking-[.15em] text-slate-400 mt-1">
                        {spec.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            {/* FEATURES */}
            <article className="bg-[#101827] rounded-[2rem] p-7 sm:p-9 text-white overflow-hidden relative animate-[fadeUp_.7s_.4s_both]">

              <div className="absolute right-0 top-0 w-64 h-64 bg-[#c9a227]/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <p className="text-[#c9a227] uppercase text-[9px] font-black tracking-[.2em] mb-2">
                  Planova Advantage
                </p>

                <h2 className="text-2xl font-black mb-7">
                  Built for Better Decisions
                </h2>

                <div className="grid sm:grid-cols-3 gap-6">

                  <div className="group">
                    <CheckCircle2 className="w-6 h-6 text-[#c9a227] mb-3 group-hover:scale-110 transition-transform" />

                    <h3 className="font-bold mb-1">
                      Professional Review
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Connect with qualified professionals for project guidance.
                    </p>
                  </div>

                  <div className="group">
                    <CheckCircle2 className="w-6 h-6 text-[#c9a227] mb-3 group-hover:scale-110 transition-transform" />

                    <h3 className="font-bold mb-1">
                      Transparent Planning
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Understand your design before moving into execution.
                    </p>
                  </div>

                  <div className="group">
                    <CheckCircle2 className="w-6 h-6 text-[#c9a227] mb-3 group-hover:scale-110 transition-transform" />

                    <h3 className="font-bold mb-1">
                      Project Ready
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Turn architectural concepts into actionable projects.
                    </p>
                  </div>

                </div>
              </div>
            </article>
          </div>

          {/* ============================================================ */}
          {/* ENGINEER                                                       */}
          {/* ============================================================ */}

          <aside className="lg:col-span-4 animate-[fadeUp_.8s_.35s_both]">

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-7 sm:p-8">

              <div className="flex items-center justify-between mb-7">
                <div>
                  <p className="text-[#c9a227] uppercase text-[9px] font-black tracking-[.2em]">
                    Professional
                  </p>

                  <h2 className="text-xl font-black text-[#101827]">
                    Designed By
                  </h2>
                </div>

                <div className="w-9 h-9 rounded-xl bg-[#c9a227]/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#c9a227]" />
                </div>
              </div>

              {engineer ? (
                <div>

                  <div className="flex items-center gap-4 mb-7">
                    <div className="w-20 h-20 rounded-full p-1 border-2 border-[#c9a227]/30 bg-slate-50">
                      <img
                        src={engineerAvatar}
                        alt={engineerName}
                        className="w-full h-full rounded-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = PLACEHOLDER_IMAGE;
                          event.currentTarget.onerror = null;
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-[#101827]">
                        {engineerName}
                      </h3>

                      <p className="text-sm text-slate-400 mt-1">
                        {engineerSpecialization}
                      </p>

                      {engineer?.location && (
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3 text-[#c9a227]" />
                          {engineer.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <button
                      onClick={openPortfolio}
                      disabled={!engineerId}
                      className="py-3 rounded-xl border border-slate-200 text-[#101827] font-bold text-xs hover:border-[#c9a227] hover:text-[#c9a227] transition-all disabled:opacity-40"
                    >
                      Portfolio
                    </button>

                    <button
                      onClick={openMessage}
                      disabled={!engineerId}
                      className="py-3 rounded-xl bg-[#101827] text-white font-bold text-xs hover:bg-[#c9a227] hover:text-[#101827] transition-all disabled:opacity-40"
                    >
                      Message
                    </button>

                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-slate-400 shrink-0" />

                    <p className="text-sm text-slate-500 leading-relaxed">
                      Professional information is currently unavailable.
                      You can still request a consultation for this design.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </aside>
        </section>
      </main>

      {/* BOOKING MODAL */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={closeBooking}
        design={design}
        engineer={engineer}
        onSuccess={handleBooking}
      />

      {/* ================================================================ */}
      {/* PAGE ANIMATIONS                                                   */}
      {/* ================================================================ */}

      <style>{`
        @keyframes imageReveal {
          from {
            opacity: 0;
            transform: translateY(25px) scale(.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-15px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DesignDetails;