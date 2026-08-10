let mockFeedbacks = [
  {
    id: 501,
    bookingId: 901,
    userId: 1,
    engineerId: 101,
    rating: 5,
    comment: "John was amazing! The modifications were perfect and completed ahead of schedule.",
    createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
  },
  {
    id: 502,
    bookingId: 902,
    userId: 1,
    engineerId: 102,
    rating: 4,
    comment: "Great consultation, very knowledgeable. Looking forward to the final build.",
    createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
  }
];

export const feedbackService = {
  submitFeedback: async (feedbackData) => {
    return new Promise((resolve) => {
      const newFeedback = { 
        ...feedbackData, 
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      mockFeedbacks.push(newFeedback);
      setTimeout(() => resolve(newFeedback), 800);
    });
  },

  getByEngineer: async (engineerId) => {
    return new Promise((resolve) => {
      const feedbacks = mockFeedbacks.filter(f => f.engineerId === parseInt(engineerId));
      setTimeout(() => resolve(feedbacks), 500);
    });
  },

  getByUser: async (userId) => {
    return new Promise((resolve) => {
      const feedbacks = mockFeedbacks.filter(f => f.userId === parseInt(userId));
      setTimeout(() => resolve(feedbacks), 400);
    });
  },

  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFeedbacks), 300);
    });
  }
};

