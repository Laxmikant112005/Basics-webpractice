import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

const Marketplace = () => {
  const { get } = useApi('/materials');
  const [materials, setMaterials] = useState([]);
  const [cart, setCart] = useState({});
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, [filters]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const response = await get(`?${params}`);
      setMaterials(response.data.materials || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (materialId, price, name) => {
    setCart(prev => ({
      ...prev,
      [materialId]: {
        id: materialId,
        name,
        price,
        quantity: (prev[materialId]?.quantity || 0) + 1,
      },
    }));
  };

  const updateQuantity = (materialId, quantity) => {
    if (quantity <= 0) {
      delete cart[materialId];
    } else {
      setCart(prev => ({
        ...prev,
        [materialId]: {
          ...prev[materialId],
          quantity,
        },
      }));
    }
  };

  const total = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const placeOrder = async () => {
    const orderData = {
      items: Object.values(cart),
      totalAmount: total,
    };
    try {
      await post('/orders', orderData);
      // Trigger payment flow (reuse Step 10)
      toast.success('Order placed! Redirecting to payment...');
    } catch (error) {
      toast.error('Order failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Construction Materials
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Quality materials for your dream home. Fast delivery, competitive prices.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {/* Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Filters</h3>
              
              <input
                type="text"
                placeholder="Search materials..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl mb-4"
              />

              <select 
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl mb-4"
              >
                <option value="">All Categories</option>
                <option value="cement">Cement</option>
                <option value="steel">Steel</option>
                <option value="paint">Paints</option>
                <option value="tiles">Tiles</option>
              </select>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price Range</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl"
                />
              </div>

              <button 
                onClick={fetchMaterials}
                className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg transition-all"
              >
                Apply Filters
              </button>
            </div>

            {/* Cart Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-xl fixed lg:relative lg:static bottom-4 left-4 right-4 lg:left-auto lg:right-auto lg:bottom-auto w-[calc(100vw-2rem)] lg:w-auto z-10 lg:z-auto">
              <h3 className="font-bold mb-4">Cart ({Object.keys(cart).length})</h3>
              {Object.values(cart).map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">₹{item.price}/unit</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={placeOrder}
                  disabled={total === 0}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  Place Order & Pay
                </button>
              </div>
            </div>
          </div>

          {/* Materials Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                Array(8).fill().map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                materials.map(material => (
                  <div key={material.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden hover:-translate-y-2">
                    <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-blue-50 group-hover:to-indigo-50">
                      <img src={material.images[0] || '/api/placeholder/300/300'} alt={material.name} className="w-3/4 h-3/4 object-cover rounded-lg shadow-md" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{material.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{material.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-2xl font-bold text-emerald-600">
                          ₹{material.price.toLocaleString()}
                          <span className="text-sm font-normal text-gray-500"> /{material.priceUnit}</span>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          {material.stockQuantity} in stock
                        </span>
                      </div>
                      <button 
                        onClick={() => addToCart(material._id, material.price, material.name)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

