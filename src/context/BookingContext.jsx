import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import { bookingService } from '../services/bookingService';
import { useAuth } from './AuthContext';

const BookingContext = createContext(null);

const initialState = {
  bookings: [],
  loading: false,
  error: null,
};

const getErrorMessage = (error) => {
  if (!error) {
    return 'Something went wrong.';
  }

  if (typeof error === 'string') {
    return error;
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong while processing the booking.'
  );
};

const normalizeBookings = (response) => {
  // Supports:
  // 1. [...]
  // 2. { data: [...] }
  // 3. { bookings: [...] }
  // 4. { data: { bookings: [...] } }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.bookings)) {
    return response.bookings;
  }

  if (Array.isArray(response?.data?.bookings)) {
    return response.data.bookings;
  }

  return [];
};

const normalizeBooking = (response) => {
  // Supports:
  // { ...booking }
  // { data: booking }
  // { booking: booking }

  if (response?.data?.booking) {
    return response.data.booking;
  }

  if (response?.booking) {
    return response.booking;
  }

  if (response?.data && !Array.isArray(response.data)) {
    return response.data;
  }

  return response;
};

const getBookingId = (booking) => {
  return booking?.id ?? booking?._id;
};

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BOOKINGS':
      return {
        ...state,
        bookings: Array.isArray(action.payload) ? action.payload : [],
        loading: false,
        error: null,
      };

    case 'ADD_BOOKING':
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
        loading: false,
        error: null,
      };

    case 'UPDATE_BOOKING': {
      const updatedBooking = action.payload;
      const updatedId = getBookingId(updatedBooking);

      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          getBookingId(booking) === updatedId
            ? { ...booking, ...updatedBooking }
            : booking
        ),
        loading: false,
        error: null,
      };
    }

    case 'REMOVE_BOOKING': {
      const bookingId = action.payload;

      return {
        ...state,
        bookings: state.bookings.filter(
          (booking) => getBookingId(booking) !== bookingId
        ),
      };
    }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
};

export const BookingProvider = ({ children }) => {
  const { user } = useAuth();

  const [state, dispatch] = useReducer(
    bookingReducer,
    initialState
  );

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Fetch bookings belonging to the authenticated user.
   */
  const fetchBookings = useCallback(async () => {
    const userId = user?.id ?? user?._id;

    if (!userId) {
      dispatch({ type: 'RESET' });
      return [];
    }

    dispatch({
      type: 'SET_LOADING',
      payload: true,
    });

    try {
      const response = await bookingService.getByUser(userId);

      const bookings = normalizeBookings(response);

      if (isMountedRef.current) {
        dispatch({
          type: 'SET_BOOKINGS',
          payload: bookings,
        });
      }

      return bookings;
    } catch (error) {
      const message = getErrorMessage(error);

      if (isMountedRef.current) {
        dispatch({
          type: 'SET_ERROR',
          payload: message,
        });
      }

      return [];
    }
  }, [user]);

  /**
   * Create a new booking.
   */
  const createBooking = useCallback(
    async (bookingData) => {
      const userId = user?.id ?? user?._id;

      if (!userId) {
        const error = new Error(
          'You must be logged in to create a booking.'
        );

        dispatch({
          type: 'SET_ERROR',
          payload: error.message,
        });

        throw error;
      }

      if (!bookingData || typeof bookingData !== 'object') {
        const error = new Error(
          'Invalid booking data.'
        );

        dispatch({
          type: 'SET_ERROR',
          payload: error.message,
        });

        throw error;
      }

      dispatch({
        type: 'SET_LOADING',
        payload: true,
      });

      try {
        const response = await bookingService.create({
          ...bookingData,
          userId,
        });

        const newBooking = normalizeBooking(response);

        if (!newBooking) {
          throw new Error(
            'Booking was created, but no booking data was returned.'
          );
        }

        if (isMountedRef.current) {
          dispatch({
            type: 'ADD_BOOKING',
            payload: newBooking,
          });
        }

        return newBooking;
      } catch (error) {
        const message = getErrorMessage(error);

        if (isMountedRef.current) {
          dispatch({
            type: 'SET_ERROR',
            payload: message,
          });
        }

        throw error;
      }
    },
    [user]
  );

  /**
   * Update booking status.
   */
  const updateBookingStatus = useCallback(
    async (bookingId, status) => {
      if (!bookingId) {
        const error = new Error(
          'Booking ID is required.'
        );

        dispatch({
          type: 'SET_ERROR',
          payload: error.message,
        });

        throw error;
      }

      if (!status) {
        const error = new Error(
          'Booking status is required.'
        );

        dispatch({
          type: 'SET_ERROR',
          payload: error.message,
        });

        throw error;
      }

      dispatch({
        type: 'SET_LOADING',
        payload: true,
      });

      try {
        const response = await bookingService.updateStatus(
          bookingId,
          status
        );

        const updatedBooking = normalizeBooking(response);

        if (!updatedBooking) {
          throw new Error(
            'Booking was updated, but no booking data was returned.'
          );
        }

        if (isMountedRef.current) {
          dispatch({
            type: 'UPDATE_BOOKING',
            payload: updatedBooking,
          });
        }

        return updatedBooking;
      } catch (error) {
        const message = getErrorMessage(error);

        if (isMountedRef.current) {
          dispatch({
            type: 'SET_ERROR',
            payload: message,
          });
        }

        throw error;
      }
    },
    []
  );

  /**
   * Refetch whenever authenticated user changes.
   */
  useEffect(() => {
    if (user?.id || user?._id) {
      fetchBookings();
    } else {
      dispatch({
        type: 'RESET',
      });
    }
  }, [user, fetchBookings]);

  /**
   * Clear current error.
   */
  const clearError = useCallback(() => {
    dispatch({
      type: 'CLEAR_ERROR',
    });
  }, []);

  /**
   * Remove booking from local state.
   * This does not delete it from the backend.
   */
  const removeBookingFromState = useCallback((bookingId) => {
    if (!bookingId) {
      return;
    }

    dispatch({
      type: 'REMOVE_BOOKING',
      payload: bookingId,
    });
  }, []);

  const contextValue = {
    bookings: state.bookings,
    loading: state.loading,
    error: state.error,

    createBooking,
    updateBookingStatus,

    refetch: fetchBookings,
    clearError,

    removeBookingFromState,
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error(
      'useBookings must be used within a BookingProvider.'
    );
  }

  return context;
};

export default BookingContext;