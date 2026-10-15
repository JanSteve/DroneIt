// src/components/consumer/ProductCard.tsx
// Product Card with Cold-Chain/Fragile Badges, Keyword Highlighting, and Stepper Controls

import React from 'react';
import { Plus, Minus, Snowflake, AlertTriangle, Zap, Sparkles } from 'lucide-react';
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

  const cartItem = cart.find((c) => c.id === item.id);
  const isColdChain = Boolean(item.isColdChain || item.coldChain);
  const isFragile = Boolean(item.isFragile || item.fragile);

  const handleAdd = () => {
    addToCart(item);
    showToast(`Added ${item.name} to drone cart`, 'success');
  };

  return (
    <div className="group relative rounded-2xl bg-[#0F1E36]/90 border border-drone-navy-border hover:border-emerald-500/40 p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-lg">
      <div>
        {/* Top Badges Strip */}
        <div className="flex items-center justify-between gap-1.5 mb-2.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            {item.category}
          </span>

          <div className="flex items-center gap-1 flex-wrap">
            {isColdChain && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/15 text-blue-300 border border-blue-500/30 font-mono"
                title="Cold-Chain Insulated Flight Packaging"
              >
                <Snowflake className="w-2.5 h-2.5" />
                <span>Cold-Chain</span>
              </span>
            )}
            {isFragile && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono"
                title="Fragile Item: Soft Tether Winch Lowering"
              >
                <AlertTriangle className="w-2.5 h-2.5" />
                <span>Fragile</span>
              </span>
            )}
            {item.badge && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                {item.badge === 'Express 3-Min' && <Zap className="w-2.5 h-2.5" />}
                {item.badge === 'GreenLoop' && <Sparkles className="w-2.5 h-2.5" />}
                <span>{item.badge}</span>
              </span>
            )}
          </div>
        </div>

        {/* Product Title with Keyword Highlight */}
        <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mb-2 leading-snug">
          <HighlightText text={item.name} query={searchQuery} />
        </h3>

        {/* Weight Readout */}
        <div className="text-xs text-slate-400 font-mono mb-4 flex items-center justify-between">
          <span>Payload: {formatWeight(item.weightGrams)}</span>
          <span className="text-[10px] text-slate-500">
            {((item.weightGrams / 2500) * 100).toFixed(0)}% payload
          </span>
        </div>
      </div>

      {/* Pricing & Add/Stepper Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-drone-navy-border/60">
        <div className="text-base font-bold text-white font-mono">
          {formatINR(item.priceINR)}
        </div>

        {cartItem ? (
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl p-1">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors active:scale-95"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="min-w-[20px] text-center text-xs font-bold text-emerald-400 font-mono">
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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-drone-navy font-bold text-xs shadow-md shadow-emerald-950/40 transition-all active:scale-95"
            aria-label={`Add ${item.name} to drone cart`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
};
