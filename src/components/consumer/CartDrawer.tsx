// src/components/consumer/CartDrawer.tsx
// Responsive Slide-Over / Bottom-Sheet Cart Drawer with Weight HUD, Fee Breakdown & Checkout Dispatch

import React from 'react';
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldAlert,
  Snowflake,
  AlertTriangle,
  MapPin,
  Sparkles,
  Zap,
  Truck,
  Leaf,
  Repeat,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { formatINR, formatWeight } from '../../utils/formatters';
import { WeightGauge } from './WeightGauge';
import { DropZoneSelector } from './DropZoneSelector';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    totalWeightKg,
    isOverweight,
    splitResolution,
    setSplitOrderModalOpen,
    selectedDropZone,
    priorityDelivery,
    setPriorityDelivery,
    seedTagOption,
    setSeedTagOption,
    greenLoopMembership,
    setGreenLoopMembership,
    feeBreakdown,
    startFlightSimulation,
  } = useApp();

  const { showToast } = useToast();

  if (!isCartOpen) return null;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleClearCart = () => {
    if (cart.length === 0) return;
    clearCart();
    showToast('Cart cleared (0 items)', 'info');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty. Add items to order!', 'warning');
      return;
    }

    if (isOverweight && splitResolution === 'standard_drone') {
      setSplitOrderModalOpen(true);
      showToast('Payload exceeds 2.50 kg safe limit. Choose Dual Drone Split or Ground EV fallback.', 'warning');
      return;
    }

    setIsCartOpen(false);
    startFlightSimulation();
    showToast('Autonomous Flight Dispatched! Tracking live telemetry.', 'success', 4000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop Scrim */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0B132B] border-l border-drone-navy-border shadow-2xl flex flex-col h-full">
          {/* Cart Header */}
          <div className="p-4 sm:p-5 border-b border-drone-navy-border bg-[#0E1B38] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 id="cart-drawer-title" className="text-base font-bold text-white flex items-center gap-2">
                  <span>Drone-Safe Cart</span>
                  {totalItemsCount > 0 && (
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                      {totalItemsCount} items
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {totalWeightKg.toFixed(2)} kg / 2.50 kg certified limit
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
                  title="Clear All Items"
                  aria-label="Clear All Items"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                aria-label="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Embedded Real-Time Weight HUD Gauge */}
          <div className="p-4 border-b border-drone-navy-border bg-[#091024]">
            <WeightGauge variant="full" />
          </div>

          {/* Cart Items Scrollable Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Your drone basket is empty</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Browse essentials from the catalogue to prepare your 3–5 minute aerial delivery.
                  </p>
                </div>
              </div>
            ) : (
              cart.map((item) => {
                const isColdChain = Boolean(item.isColdChain || item.coldChain);
                const isFragile = Boolean(item.isFragile || item.fragile);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          {item.category}
                        </span>
                        {isColdChain && (
                          <span className="text-[9px] text-blue-300 bg-blue-500/15 px-1 rounded flex items-center gap-0.5">
                            <Snowflake className="w-2.5 h-2.5" />
                            Cold
                          </span>
                        )}
                        {isFragile && (
                          <span className="text-[9px] text-amber-300 bg-amber-500/15 px-1 rounded flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Fragile
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {formatINR(item.priceINR)} • {formatWeight(item.weightGrams * item.quantity)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors active:scale-95"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="min-w-[18px] text-center text-xs font-bold text-emerald-400 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors active:scale-95"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Remove item"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}

            {/* Drop-Zone Confirmation Strip if Cart Non-Empty */}
            {cart.length > 0 && (
              <div className="pt-2">
                <DropZoneSelector variant="compact" />
              </div>
            )}
          </div>

          {/* Sticky Fee Breakdown & Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-drone-navy-border bg-[#080E21] space-y-3.5">
              {/* Optional Toggles */}
              <div className="space-y-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="group-hover:text-white transition-colors">
                      Priority 3-Minute Slot (+₹79)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={priorityDelivery}
                    onChange={(e) => setPriorityDelivery(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="group-hover:text-white transition-colors">
                      Plantable Seed Tag (+₹5)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={seedTagOption}
                    onChange={(e) => setSeedTagOption(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="group-hover:text-white transition-colors">
                      GreenLoop Member (+₹99/mo)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={greenLoopMembership}
                    onChange={(e) => setGreenLoopMembership(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0 cursor-pointer"
                  />
                </label>
              </div>

              {/* Itemized Fee Breakdown */}
              <div className="space-y-1.5 text-xs font-mono text-slate-400 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-slate-200">{formatINR(feeBreakdown.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    Delivery ({splitResolution === 'split_drone' ? 'Dual Drone Split' : splitResolution === 'ground_ev' ? 'Partner Ground EV' : 'Base Aerial'}):
                  </span>
                  <span className="text-slate-200">{formatINR(feeBreakdown.deliveryFee)}</span>
                </div>
                {feeBreakdown.prioritySlotFee > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Priority 3-Min Slot:</span>
                    <span>{formatINR(feeBreakdown.prioritySlotFee)}</span>
                  </div>
                )}
                {feeBreakdown.seedTagFee > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Plantable Seed Tag:</span>
                    <span>{formatINR(feeBreakdown.seedTagFee)}</span>
                  </div>
                )}
                {feeBreakdown.membershipFee > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>GreenLoop Membership:</span>
                    <span>{formatINR(feeBreakdown.membershipFee)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Dynamic GST (5% / 18%):</span>
                  <span className="text-slate-200">{formatINR(feeBreakdown.taxGST)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span className="font-sans">Grand Total:</span>
                  <span className="text-emerald-400 font-mono">{formatINR(feeBreakdown.grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              {isOverweight && splitResolution === 'standard_drone' ? (
                <button
                  type="button"
                  onClick={() => setSplitOrderModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-950/50 transition-all active:scale-[0.99] animate-pulse"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Resolve Overweight Payload (Split / EV)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-drone-navy shadow-lg shadow-emerald-950/40 transition-all active:scale-[0.99]"
                >
                  {splitResolution === 'split_drone' ? (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Confirm & Launch Dual Drones ({formatINR(feeBreakdown.grandTotal)})</span>
                    </>
                  ) : splitResolution === 'ground_ev' ? (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>Confirm & Launch Ground EV ({formatINR(feeBreakdown.grandTotal)})</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Launch Aerial Drone</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
