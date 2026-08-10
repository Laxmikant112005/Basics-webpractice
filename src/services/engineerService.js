// src/services/engineerService.js
import { mockEngineers } from '../data/mockEngineers';

let engineers = [...mockEngineers];

export const engineerService = {
  getAllEngineers: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return engineers;
  },

  getEngineerById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return engineers.find(e => e.id === parseInt(id)) || null;
  },

  updateEngineer: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = engineers.findIndex(e => e.id === parseInt(id));
    if (index !== -1) {
      engineers[index] = { ...engineers[index], ...data };
      return engineers[index];
    }
    throw new Error('Engineer not found');
  },

  deleteEngineer: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = engineers.findIndex(e => e.id === parseInt(id));
    if (index !== -1) {
      engineers.splice(index, 1);
      return true;
    }
    throw new Error('Engineer not found');
  },

  approveEngineer: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = engineers.findIndex(e => e.id === parseInt(id));
    if (index !== -1) {
      engineers[index].status = 'active';
      return engineers[index];
    }
    throw new Error('Engineer not found');
  }
};
