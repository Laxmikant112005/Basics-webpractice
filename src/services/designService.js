import { mockDesigns } from '../data/mockData';

export const designService = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDesigns), 500);
    });
  },
  
  getById: async (id) => {
    return new Promise((resolve) => {
      const design = mockDesigns.find(d => d.id === parseInt(id));
      setTimeout(() => resolve(design), 300);
    });
  },
  
  getByEngineer: async (engineerId) => {
    return new Promise((resolve) => {
      const designs = mockDesigns.filter(d => d.engineerId === parseInt(engineerId));
      setTimeout(() => resolve(designs), 400);
    });
  },
  
  create: async (designData) => {
    return new Promise((resolve) => {
      const newDesign = { ...designData, id: Date.now() };
      // In a real app we'd push to a database
      setTimeout(() => resolve(newDesign), 800);
    });
  }
};
