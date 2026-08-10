let mockNotifications = [
  {
    id: 1001,
    userId: 1,
    title: "Booking Accepted!",
    message: "Your booking for Modern Glass Villa has been accepted by John Smith. Site visit scheduled for Apr 20, 2PM.",
    type: 'success',
    relatedBookingId: 902,
    createdAt: new Date(Date.now() - 24*60*60*1000).toISOString(), // yesterday
    read: false
  },
  {
    id: 1002,
    userId: 2,
    title: "New Booking Request",
    message: "Alice User has requested consultation for Contemporary Urban Loft.",
    type: 'info',
    relatedBookingId: 903,
    createdAt: new Date().toISOString(), // recent
    read: false
  },
  {
    id: 1003,
    userId: 1,
    title: "Booking Completed",
    message: "Your pool modification project has been marked as completed. Please leave feedback.",
    type: 'success',
    relatedBookingId: 901,
    createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
    read: true
  }
];

export const notificationService = {
  getByUser: async (userId) => {
    return new Promise((resolve) => {
      const notifications = mockNotifications.filter(n => n.userId === parseInt(userId));
      setTimeout(() => resolve(notifications), 300);
    });
  },

  markAsRead: async (notificationId) => {
    return new Promise((resolve) => {
      const notification = mockNotifications.find(n => n.id === parseInt(notificationId));
      if (notification) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
      }
      setTimeout(() => resolve(notification), 200);
    });
  },

  getUnreadCount: async (userId) => {
    return new Promise((resolve) => {
      const unread = mockNotifications.filter(n => 
        n.userId === parseInt(userId) && !n.read
      );
      setTimeout(() => resolve(unread.length), 100);
    });
  }
};

