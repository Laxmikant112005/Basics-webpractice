import { mockDesigns } from '../data/mockData';

let designs = [...mockDesigns];

export const moderationService = {
  listPending: async () => {
    await new Promise(r => setTimeout(r, 300));
    return designs.filter(d => !d.approved);
  },
  approve: async (id) => {
    const idx = designs.findIndex(d => d.id === parseInt(id));
    if (idx !== -1) designs[idx].approved = true;
    return designs[idx];
  },
  reject: async (id) => {
    const idx = designs.findIndex(d => d.id === parseInt(id));
    if (idx !== -1) designs[idx].approved = false;
    return designs[idx];
  },
  listAll: async () => designs
};
