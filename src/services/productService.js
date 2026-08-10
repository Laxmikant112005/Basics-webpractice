let products = [
  { id: 1, name: 'Cement - 50kg', price: 500, stock: 120, vendor: 'ABC Suppliers' },
  { id: 2, name: 'Steel Beam - IPE200', price: 2500, stock: 40, vendor: 'SteelWorks' }
];

export const productService = {
  list: async () => {
    await new Promise(r => setTimeout(r, 300));
    return products;
  },
  get: async (id) => products.find(p => p.id === parseInt(id)),
  create: async (data) => {
    const item = { ...data, id: Date.now() };
    products.push(item);
    return item;
  },
  update: async (id, data) => {
    const idx = products.findIndex(p => p.id === parseInt(id));
    if (idx !== -1) products[idx] = { ...products[idx], ...data };
    return products[idx];
  },
  remove: async (id) => {
    products = products.filter(p => p.id !== parseInt(id));
    return true;
  }
};
