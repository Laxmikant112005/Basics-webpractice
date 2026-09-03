import React, { useMemo, useState } from 'react';
import {
  ShoppingCart,
  Package,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useCart } from '../../context/CartContext';
import { cn } from '../../utils/cn';

const materials = [
  {
    id: 1,
    name: 'Premium Portland Cement',
    price: 650,
    image:
      'https://images.unsplash.com/photo-1606890658317-7d4e6e05102d?w=800&q=80',
    category: 'cement',
  },
  {
    id: 2,
    name: 'High Grade Steel Bars TMT',
    price: 85000,
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5ba1a45?w=800&q=80',
    category: 'steel',
  },
  {
    id: 3,
    name: 'Ceramic Wall Tiles (12x24)',
    price: 85,
    image:
      'https://images.unsplash.com/photo-1586672082635-7c25635465ab?w=800&q=80',
    category: 'tiles',
  },
  {
    id: 4,
    name: 'Asian Paints Premium Emulsion',
    price: 4200,
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    category: 'paint',
  },
  {
    id: 5,
    name: 'UPVC Windows & Doors',
    price: 450,
    image:
      'https://images.unsplash.com/photo-1600566752355-3571b2d143c8?w=800&q=80',
    category: 'windows',
  },
  {
    id: 6,
    name: 'Modular Kitchen Cabinets',
    price: 12500,
    image:
      'https://images.unsplash.com/photo-1558618047-3c8c76bbb17c?w=800&q=80',
    category: 'kitchen',
  },
  {
    id: 7,
    name: 'RCC Precast Slabs',
    price: 1250,
    image:
      'https://images.unsplash.com/photo-1602940784238-9b9a6671dbb2?w=800&q=80',
    category: 'slabs',
  },
  {
    id: 8,
    name: 'Solar Panels 1kW',
    price: 55000,
    image:
      'https://images.unsplash.com/photo-1578662996441-02e9b552aa59?w=800&q=80',
    category: 'solar',
  },
];

const categories = [
  'All',
  'Cement',
  'Steel',
  'Tiles',
  'Paint',
  'Windows',
  'Kitchen',
  'Slabs',
  'Solar',
];

const Marketplace = () => {
  const { addItem, totalItems } = useCart();

  const [activeCategory, setActiveCategory] = useState('All');
  const [addedItemId, setAddedItemId] = useState(null);

  /**
   * Filter materials whenever the selected category changes.
   */
  const filteredMaterials = useMemo(() => {
    if (activeCategory === 'All') {
      return materials;
    }

    const normalizedCategory = activeCategory.toLowerCase();

    return materials.filter(
      (material) =>
        material.category.toLowerCase() === normalizedCategory
    );
  }, [activeCategory]);

  /**
   * Add product to cart and show temporary feedback.
   */
  const handleAddToCart = (material) => {
    try {
      addItem(material);

      setAddedItemId(material.id);

      window.setTimeout(() => {
        setAddedItemId((currentId) =>
          currentId === material.id ? null : currentId
        );
      }, 1500);
    } catch (error) {
      console.error('Failed to add material to cart:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ================= HEADER ================= */}
      <div className="text-center mb-16">

        <div className="inline-flex items-center gap-3 bg-gold/20 text-gold px-6 py-3 rounded-full mb-6">
          <ShoppingBag className="w-6 h-6" />

          <span className="font-bold text-lg uppercase tracking-wide">
            Material Marketplace
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy mb-6">
          Building Materials
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Premium construction materials sourced from trusted suppliers.
          Everything you need for your dream home — delivered to your site.
        </p>
      </div>

      {/* ================= CART STATUS ================= */}
      {totalItems > 0 && (
        <div className="mb-12 p-5 md:p-6 bg-emerald-50 border-2 border-emerald-200 rounded-3xl shadow-lg">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

            <div className="flex items-center gap-3">

              <div className="shrink-0">
                <ShoppingCart className="w-12 h-12 text-emerald-600 bg-emerald-100 p-3 rounded-2xl" />
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-emerald-800">
                  Cart ({totalItems})
                </h3>

                <p className="text-emerald-700 font-medium">
                  Items ready for checkout
                </p>
              </div>

            </div>

            <Link
              to="/user/cart"
              className="w-full sm:w-auto bg-gold hover:bg-gold-light text-navy font-bold px-7 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              View Cart
              <ShoppingCart className="w-5 h-5" />
            </Link>

          </div>
        </div>
      )}

      {/* ================= CATEGORY FILTER ================= */}
      <div className="flex flex-wrap gap-3 mb-12 justify-center">

        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={isActive}
              className={cn(
                'px-5 md:px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-wide border-2 transition-all duration-300 shadow-sm hover:shadow-md',
                isActive
                  ? 'bg-gold text-navy border-gold shadow-gold/25 scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-gold/40'
              )}
            >
              {category}
            </button>
          );
        })}

      </div>

      {/* ================= RESULT COUNT ================= */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-2xl font-bold text-navy">
            {activeCategory === 'All'
              ? 'All Materials'
              : `${activeCategory} Materials`}
          </h2>

          <p className="text-slate-500 mt-1">
            {filteredMaterials.length}{' '}
            {filteredMaterials.length === 1
              ? 'product'
              : 'products'}{' '}
            available
          </p>
        </div>

      </div>

      {/* ================= MATERIALS GRID ================= */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">

          {filteredMaterials.map((material) => {

            const isAdded = addedItemId === material.id;

            return (
              <div
                key={material.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-200"
              >

                {/* Product Image */}
                <div className="relative h-56 md:h-64 overflow-hidden bg-slate-100">

                  <img
                    src={material.image}
                    alt={material.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        '/images/placeholder-design.jpg';
                    }}
                  />

                  {/* Category */}
                  <div className="absolute top-4 right-4 bg-gold text-navy px-3 py-1.5 rounded-xl font-bold text-xs uppercase shadow-lg">
                    {material.category}
                  </div>

                </div>

                {/* Product Details */}
                <div className="p-5 md:p-6">

                  <h3 className="text-lg md:text-xl font-bold text-navy mb-3 line-clamp-2 min-h-[56px] group-hover:text-gold transition-colors">
                    {material.name}
                  </h3>

                  <div className="flex items-center justify-between gap-3 mb-6">

                    <div className="text-xl md:text-2xl font-black text-gold">
                      ₹
                      {Number(material.price || 0).toLocaleString(
                        'en-IN'
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 text-xs md:text-sm whitespace-nowrap">
                      <Package className="w-4 h-4" />
                      Free delivery
                    </div>

                  </div>

                  {/* Add To Cart */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(material)}
                    className={cn(
                      'w-full py-3.5 px-5 rounded-2xl font-bold text-base shadow-lg transition-all duration-300 flex items-center justify-center gap-3',
                      isAdded
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-gradient-to-r from-navy to-slate-900 text-white hover:shadow-xl hover:-translate-y-0.5'
                    )}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </button>

                </div>
              </div>
            );
          })}

        </div>
      ) : (
        /* ================= EMPTY STATE ================= */
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200">

          <Package className="w-16 h-16 text-slate-400 mx-auto mb-5" />

          <h3 className="text-2xl font-bold text-navy mb-2">
            No materials found
          </h3>

          <p className="text-slate-500 mb-6">
            There are currently no materials available in this category.
          </p>

          <button
            type="button"
            onClick={() => setActiveCategory('All')}
            className="bg-gold text-navy font-bold px-6 py-3 rounded-xl hover:bg-gold-light transition-colors"
          >
            View All Materials
          </button>

        </div>
      )}

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-20">

        <div className="text-center p-8 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border border-slate-200">
          <div className="text-3xl md:text-4xl font-black text-navy mb-3">
            10K+
          </div>

          <p className="text-slate-600 font-bold uppercase tracking-wide text-sm">
            Materials Available
          </p>
        </div>

        <div className="text-center p-8 md:p-10 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl border border-emerald-200">
          <div className="text-3xl md:text-4xl font-black text-emerald-700 mb-3">
            500+
          </div>

          <p className="text-emerald-700 font-bold uppercase tracking-wide text-sm">
            Trusted Suppliers
          </p>
        </div>

        <div className="text-center p-8 md:p-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl border border-blue-200">
          <div className="text-3xl md:text-4xl font-black text-blue-700 mb-3">
            24h
          </div>

          <p className="text-blue-700 font-bold uppercase tracking-wide text-sm">
            Delivery Ready
          </p>
        </div>

        <div className="text-center p-8 md:p-10 bg-gradient-to-br from-gold/10 to-gold/20 rounded-3xl border border-gold/30">
          <div className="text-3xl md:text-4xl font-black text-gold mb-3">
            ₹50Cr+
          </div>

          <p className="text-gold font-bold uppercase tracking-wide text-sm">
            Order Value
          </p>
        </div>

      </div>
    </div>
  );
};

export default Marketplace;