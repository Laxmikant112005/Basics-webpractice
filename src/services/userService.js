import { mockUsers, mockEngineers } from '../data/mockData';

export const userService = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      setTimeout(() => {
        if (user) {
          const { password, ...safeUser } = user;
          resolve(safeUser);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800);
    });
  },
  
  register: async (userData) => {
    return new Promise((resolve) => {
      const newUser = { 
        ...userData, 
        id: Date.now(), 
        // If it's an engineer, add default profile fields
        ...(userData.role === 'engineer' ? { 
          rating: 4.5, 
          avatar: "https://i.pravatar.cc/150?u=" + userData.name,
          specialization: "General Engineering"
        } : {})
      };
      setTimeout(() => resolve(newUser), 1000);
    });
  },
  
  getEngineers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockEngineers), 400);
    });
  }
};
