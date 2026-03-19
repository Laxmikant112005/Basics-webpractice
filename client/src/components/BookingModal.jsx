import React, { useState } from 'react';

const BookingModal = ({ engineer, design, isOpen, onClose }) => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const timeSlots = [
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
  ];

  const handleBook = async () => {
    setLoading(true);
    try {
      // 1. Create pending booking
      const bookingResponse = await post('/bookings/create', {
        engineerId: engineer._id,
        designId: design._id,
        date,
        timeSlot,
      });

      // 2. Create payment order
      const { data } = await post('/payments/create-order', {
        bookingId: bookingResponse.data._id,
        amount: design.estimatedCost || 5000,
      });

      setShowPayment(true);
      // Integrate Razorpay (load script + open)
      loadRazorpay(data);
    } catch (error) {
      toast.error('Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpay = (orderData) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const options = orderData;
      options.handler = function (response) {
        verifyPayment(response, orderData.bookingId);
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    };
    script.onerror = () => toast.error('Payment gateway failed');
    document.body.appendChild(script);
  };

  const verifyPayment = async (response, bookingId) => {
    await post('/payments/verify', {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      bookingId,
    });
    toast.success('Payment successful! Booking confirmed.');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Book Engineer</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Engineer</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <img src={engineer.avatar} alt={engineer.firstName} className="w-12 h-12 rounded-xl" />
                  <div>
                    <div className="font-bold">{engineer.firstName} {engineer.lastName}</div>
                    <div className="text-sm text-gray-600">₹{engineer.engineerProfile.pricePerSqft}/sqft</div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Design</label>
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <div className="font-bold">{design.title}</div>
                  <div className="text-sm text-blue-700">₹{design.estimatedCost?.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                <select 
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select slot</option>
                  {timeSlots.map(slot => (
                    <option key={`${slot.start}-${slot.end}`} value={`${slot.start}|${slot.end}`}>
                      {slot.start} - {slot.end}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <button 
              onClick={handleBook}
              disabled={loading || !date || !timeSlot}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 px-8 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Book & Pay ₹5,000'}
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

