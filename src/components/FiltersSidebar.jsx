import React from 'react';
import { Filter, ChevronDown, Layers, BedDouble, UtensilsCrossed, Car, DollarSign } from 'lucide-react';
import { cn } from '../utils/cn';

const FiltersSidebar = ({ filters, setFilters }) => {
  const categories = [
    { id: 'floors', label: 'Floors', icon: Layers, options: [1, 2, 3] },
    { id: 'bedrooms', label: 'Bedrooms', icon: BedDouble, options: [2, 3, 4, 5] },
    { id: 'kitchen', label: 'Kitchens', icon: UtensilsCrossed, options: [1, 2] },
    { id: 'parking', label: 'Parking', icon: Car, options: [0, 1, 2, 3] },
  ];

  const budgetRanges = [
    { label: '< ₹2.5Cr', value: '0-300000' },
    { label: '₹2.5Cr - ₹4Cr', value: '300000-500000' },
    { label: '₹4Cr+', value: '500000-2000000' },
  ];


  return (
    <div className="w-72 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm sticky top-28 h-fit hidden xl:block">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-xl font-bold text-navy flex items-center gap-2">
          <Filter className="w-5 h-5 text-gold" /> Filters
        </h3>
        <button 
          onClick={() => setFilters({})} 
          className="text-xs font-bold text-gold hover:text-navy transition-colors uppercase tracking-widest"
        >
          Reset
        </button>
      </div>

      <div className="space-y-10">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-4">
            <div className="flex items-center gap-2 text-navy/60 font-bold text-xs uppercase tracking-wider">
              <cat.icon className="w-4 h-4" /> {cat.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilters({ ...filters, [cat.id]: opt })}
                  className={cn(
                    "w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm transition-all shadow-sm",
                    filters[cat.id] === opt 
                      ? "bg-navy border-navy text-white shadow-xl scale-110" 
                      : "bg-slate-50 border-slate-100 text-slate-500 hover:border-gold hover:text-gold"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-navy/60 font-bold text-xs uppercase tracking-wider">
            <DollarSign className="w-4 h-4" /> Budget Range
          </div>
          <div className="space-y-2">
            {budgetRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setFilters({ ...filters, budget: range.value })}
                className={cn(
                  "w-full p-3 rounded-xl border flex items-center justify-between font-bold text-sm transition-all",
                  filters.budget === range.value 
                    ? "bg-gold border-gold text-navy shadow-lg shadow-gold/20" 
                    : "bg-slate-50 border-slate-100 text-slate-500 hover:border-gold hover:text-gold"
                )}
              >
                <span>{range.label}</span>
                <ChevronDown className={cn("w-4 h-4 opacity-40", filters.budget === range.value && "rotate-180 transition-transform")} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebar;
