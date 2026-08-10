import React, { useState } from 'react';
import { ShoppingCart, Package, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const materials = [
  { id: 1, name: 'Premium Portland Cement', price: 650, image: 'https://images.unsplash.com/photo-1606890658317-7d4e6e05102d?w=400', category: 'cement' },
  { id: 2, name: 'High Grade Steel Bars TMT', price: 85000, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5ba1a45?w=400', category: 'steel' },
  { id: 3, name: 'Ceramic Wall Tiles (12x24)', price: 85, image: 'https://images.unsplash.com/photo-1586672082635-7c25635465ab?w=400', category: 'tiles' },
  { id: 4, name: 'Asian Paints Premium Emulsion', price: 4200, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', category: 'paint' },
  { id: 5, name: 'UPVC Windows & Doors', price: 450, image: 'https://images.unsplash.com/photo-1600566752355-3571b2d143c8?w=400', category: 'windows' },
  { id: 6, name: 'Modular Kitchen Cabinets', price: 12500, image: 'https://images.unsplash.com/photo-1558618047-3c8c76bbb17c?w=400', category: 'kitchen' },
  { id: 7, name: 'RCC Precast Slabs', price: 1250, image: 'https://images.unsplash.com/photo-1602940784238-9b9a6671dbb2?w=400', category: 'slabs' },
  { id: 8, name: 'Solar Panels 1kW', price: 55000, image: 'https://images.unsplash.com/photo-1578662996441-02e9b552aa59?w=400', category: 'solar' },
];

const Marketplace = () => {
  const { addItem, totalItems } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredMaterials] = useState(materials);

  const categories = ['All', 'Cement', 'Steel', 'Tiles', 'Paint', 'Windows', 'Kitchen', 'Slabs', 'Solar'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-3 bg-gold/20 text-gold px-6 py-3 rounded-full mb-6">
          <ShoppingBag className="w-6 h-6" />
          <span className="font-bold text-lg uppercase tracking-wide">Material Marketplace</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-navy mb-6">Building Materials</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Premium construction materials sourced from trusted suppliers. 
          Everything you need for your dream home - delivered to site.
        </p>
      </div>

      {/* Cart Status */}
      {totalItems > 0 && (
        <div className="mb-12 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-4xl shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-12 h-12 text-emerald-600 bg-emerald-100 p-3 rounded-3xl" />
              <div>
                <h3 className="text-2xl font-bold text-emerald-800">Cart ({totalItems})</h3>
                <p className="text-emerald-700 font-medium">Ready to checkout</p>
              </div>
            </div>
<Link to="/user/cart" className="bg-gold hover:bg-gold-light text-navy font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
              View Cart <ShoppingCart className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-16 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-wide border-2 transition-all shadow-sm hover:shadow-md",
              activeCategory === category 
                ? "bg-gold text-navy border-gold shadow-gold/25" 
                : "bg-white/50 text-slate-700 border-slate-200 hover:bg-white"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredMaterials.map((material) => (
          <div key={material.id} className="group bg-white rounded-4xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border border-slate-200">
            <div className="relative h-64 overflow-hidden bg-slate-50">
              <img 
                src={material.image} 
                alt={material.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.target.src = '/images/placeholder-design.jpg';
                  e.target.onerror = null;
                }}
              />
              <div className="absolute top-4 right-4 bg-gold text-navy px-3 py-1 rounded-xl font-bold text-xs shadow-lg">
                {material.category}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-navy mb-2 line-clamp-2 group-hover:text-gold transition-colors">{material.name}</h3>
              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-black text-gold">
                  ₹{material.price.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Package className="w-4 h-4" />
                  Free delivery
                </div>
              </div>
              
              <button
                onClick={() => addItem(material)}
                className="w-full bg-gradient-to-r from-navy to-slate-900 text-white py-4 px-6 rounded-3xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-navy hover:to-slate-900/80 transition-all duration-300 flex items-center justify-center gap-3 group-hover:scale-[1.02]"
              >
                <ShoppingCart className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-24">
        <div className="text-center p-10 bg-gradient-to-br from-slate-50 to-slate-100 rounded-4xl border border-slate-200">
          <div className="text-4xl font-black text-navy mb-4">10K+</div>
          <p className="text-slate-600 font-bold uppercase tracking-wide">Materials Available</p>
        </div>
        <div className="text-center p-10 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-4xl border border-emerald-200">
          <div className="text-4xl font-black text-emerald-700 mb-4">500+</div>
          <p className="text-emerald-700 font-bold uppercase tracking-wide">Trusted Suppliers</p>
        </div>
        <div className="text-center p-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-4xl border border-blue-200">
          <div className="text-4xl font-black text-blue-700 mb-4">24h</div>
          <p className="text-blue-700 font-bold uppercase tracking-wide">Delivery Ready</p>
        </div>
        <div className="text-center p-10 bg-gradient-to-br from-gold/10 to-gold/20 rounded-4xl border border-gold/30">
          <div className="text-4xl font-black text-gold mb-4">₹50Cr+</div>
          <p className="text-gold font-bold uppercase tracking-wide">Order Value</p>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

