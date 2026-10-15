// src/components/consumer/ProductCard.tsx
// High-Impact Visual Product Card with High-Res Image, Hover Scaling, Badges, and Stepper Controls

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
    <div className="group relative rounded-2xl bg-[#0F1E36]/90 hover:bg-[#142646] border border-drone-navy-border hover:border-emerald-500/50 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-2xl hover:shadow-emerald-950/30 overflow-hidden">
      <div>
        {/* Product Visual Container with Aspect Ratio and Micro-Zoom */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#182C4E] to-[#0B1528] overflow-hidden flex items-center justify-center">
          {item.image && !imageError ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 gap-1.5 p-4 text-center">
              <Package className="w-8 h-8 text-slate-600" />
              <span className="text-[11px] font-mono">{item.category}</span>
            </div>
          )}

          {/* Gradient Overlay Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36] via-transparent to-black/30 pointer-events-none" />

          {/* Top Badges Strip (Floating above image) */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 flex-wrap z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/90 text-slate-200 border border-slate-700/80 backdrop-blur-md font-mono shadow-sm">
              {item.category}
            </span>

            <div className="flex items-center gap-1 flex-wrap">
              {isColdChain && (
                <span
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-500/90 text-white backdrop-blur-md shadow-sm font-mono"
                  title="Cold-Chain Insulated Flight Packaging"
                >
                  <Snowflake className="w-2.5 h-2.5" />
                  <span>Cold-Chain</span>
                </span>
              )}
              {isFragile && (
                <span
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/90 text-slate-950 backdrop-blur-md shadow-sm font-mono"
                  title="Fragile Item: Soft Tether Winch Lowering"
                >
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>Fragile</span>
                </span>
              )}
              {item.badge && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-emerald-500 text-slate-950 backdrop-blur-md shadow-sm font-mono">
                  {item.badge === 'Express 3-Min' && <Zap className="w-2.5 h-2.5 fill-current" />}
                  {item.badge === 'GreenLoop' && <Sparkles className="w-2.5 h-2.5 fill-current" />}
                  <span>{item.badge}</span>
                </span>
              )}
            </div>
          </div>

          {/* Bottom Weight Pill Overlay on Image */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-slate-200 z-10">
            <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/10">
              {formatWeight(item.weightGrams)}
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-md text-emerald-400 font-semibold text-[10px]">
              {payloadPercent}% load
            </span>
          </div>
        </div>

        {/* Text & Content Details */}
        <div className="p-4 pt-3.5 space-y-2">
          {/* Product Title with Keyword Highlight */}
          <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug">
            <HighlightText text={item.name} query={searchQuery} />
          </h3>

          {/* Description */}
          {item.description && (
            <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Mini Payload Progress Bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-1 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                payloadPercent > 40
                  ? 'bg-amber-400'
                  : payloadPercent > 20
                  ? 'bg-emerald-400'
                  : 'bg-teal-400'
              }`}
              style={{ width: `${payloadPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pricing & Add/Stepper Controls */}
      <div className="p-4 pt-3 border-t border-drone-navy-border/60 flex items-center justify-between bg-[#0B1528]/40">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight">Price</span>
          <div className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
            {formatINR(item.priceINR)}
          </div>
        </div>

        {cartItem ? (
          <div className="flex items-center gap-1.5 bg-slate-900 border border-emerald-500/50 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors active:scale-95"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="min-w-[22px] text-center text-xs font-bold text-emerald-400 font-mono">
              {cartItem.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors active:scale-95"
              aria-label={`Increase quantity of ${item.name}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/25 transition-all duration-200 active:scale-95"
            aria-label={`Add ${item.name} to drone cart`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
};
