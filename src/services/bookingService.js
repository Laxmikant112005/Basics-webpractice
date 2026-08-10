let mockBookings = [
  {
    id: 901,
    userId: 1,
    engineerId: 101,
    designId: 1,
    date: "2026-04-15",
    time: "10:00 AM",
    details: "I want to modify the pool size.",
    status: "completed",
    createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString()
  },
  {
    id: 902,
    userId: 1,
    engineerId: 102,
    designId: 2,
    date: "2026-04-20",
    time: "02:00 PM",
    details: "Looking for a site visit.",
    status: "accepted",
    createdAt: new Date().toISOString()
  },
  {
    id: 903,
    userId: 2,
    engineerId: 101,
    designId: 3,
    date: "2026-04-25",
    time: "11:00 AM",
    details: "Full consultation needed",
    status: "pending",
    createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
  }
];

export const bookingService = {
  create: async (bookingData) => {
    return new Promise((resolve) => {
      const newBooking = { 
        ...bookingData, 
        id: Date.now(), 
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      // In a real app we'd push to a database
      mockBookings.push(newBooking);
      setTimeout(() => resolve(newBooking), 900);
    });
  },
  
  getByUser: async (userId) => {
    return new Promise((resolve) => {
      const bookings = mockBookings.filter(b => b.userId === parseInt(userId));
      setTimeout(() => resolve(bookings), 500);
    });
  },
  
  getByEngineer: async (engineerId) => {
    return new Promise((resolve) => {
      const bookings = mockBookings.filter(b => b.engineerId === parseInt(engineerId));
      setTimeout(() => resolve(bookings), 600);
    });
  },
  
  updateStatus: async (bookingId, status) => {
    return new Promise((resolve, reject) => {
      try {
        const booking = mockBookings.find(b => b.id === parseInt(bookingId));
        if (!booking) return reject(new Error('Booking not found'));
        if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
          return reject(new Error('Invalid status'));
        }
        booking.status = status;
        booking.updatedAt = new Date().toISOString();
        setTimeout(() => resolve(booking), 700);
      } catch (error) {
        reject(error);
      }
    });
  },

  getByStatus: async (userId, status) => {
    return new Promise((resolve) => {
      const bookings = mockBookings.filter(b => 
        b.userId === parseInt(userId) && b.status === status
      );
      setTimeout(() => resolve(bookings), 400);
    });
  }
};
