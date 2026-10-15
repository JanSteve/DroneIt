// src/components/consumer/ProductCard.tsx
// High-Impact Visual Product Card (Blinkit / Zepto White Format)

import React, { useState } from 'react';
import { Plus, Minus, Snowflake, AlertTriangle, Zap, Sparkles, Package } from 'lucide-react';
import { CartItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { formatINR, formatWeight } from '../../utils/formatters';
import { HighlightText } from './HighlightText';

export interface ProductCardProps {
  item: CartItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const { cart, addToCart, updateQuantity, searchQuery } = useApp();
  const { showToast } = useToast();
  const [imageError, setImageError] = useState(false);

  const cartItem = cart.find((c) => c.id === item.id);
  const isColdChain = Boolean(item.isColdChain || item.coldChain);
  const isFragile = Boolean(item.isFragile || item.fragile);

  const handleAdd = () => {
    addToCart(item);
    showToast(`Added ${item.name} to drone cart`, 'success');
  };

  const payloadPercent = Math.min(100, Math.round((item.weightGrams / 2500) * 100));

  return (
    <div className="group relative rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 flex flex-col justify-between transition-all duration-200 hover:shadow-md overflow-hidden">
      <div>
        {/* Product Visual Container with Aspect Ratio and Micro-Zoom */}
        <div className="relative w-full aspect-square bg-slate-50 overflow-hidden flex items-center justify-center p-3">
          {item.image && !imageError ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center rounded-xl transform group-hover:scale-105 transition-transform duration-300 ease-out"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center">
              <Package className="w-8 h-8 text-slate-300" />
              <span className="text-[11px] font-mono text-slate-500">{item.category}</span>
            </div>
          )}

          {/* Top Badges Strip (Floating above image) */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 flex-wrap z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-700 border border-slate-200 backdrop-blur-xs font-mono shadow-xs">
              {item.category}
            </span>

            <div className="flex items-center gap-1 flex-wrap">
              {isColdChain && (
                <span
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200 font-mono"
                  title="Cold-Chain Insulated Flight Packaging"
                >
                  <Snowflake className="w-2.5 h-2.5" />
                  <span>Cold</span>
                </span>
              )}
              {isFragile && (
                <span
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200 font-mono"
                  title="Fragile Item: Soft Tether Winch Lowering"
                >
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>Fragile</span>
                </span>
              )}
              {item.badge && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                  {item.badge === 'Express 3-Min' && <Zap className="w-2.5 h-2.5 fill-current" />}
                  {item.badge === 'GreenLoop' && <Sparkles className="w-2.5 h-2.5 fill-current" />}
                  <span>{item.badge}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Text & Content Details */}
        <div className="p-3.5 space-y-1.5">
          {/* Weight & Load Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>{formatWeight(item.weightGrams)}</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold">
              {payloadPercent}% load
            </span>
          </div>

          {/* Product Title with Keyword Highlight */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            <HighlightText text={item.name} query={searchQuery} />
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* Pricing & Add/Stepper Controls (Blinkit Style) */}
      <div className="p-3 pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <div className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-tight">
            {formatINR(item.priceINR)}
          </div>
        </div>

        {cartItem ? (
          <div className="flex items-center bg-emerald-600 rounded-lg p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-white hover:bg-emerald-700 rounded transition-colors active:scale-95"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="min-w-[24px] text-center text-xs font-black text-white font-mono">
              {cartItem.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-white hover:bg-emerald-700 rounded transition-colors active:scale-95"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-600 font-extrabold text-xs transition-all duration-150 active:scale-95 shadow-xs"
            aria-label={`Add ${item.name} to drone cart`}
          >
            <span>ADD</span>
            <Plus className="w-3 h-3 stroke-[3]" />
          </button>
        )}
      </div>
    </div>
  );
};
