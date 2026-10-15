import React, { useState } from 'react';
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  Leaf,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';

export const LIVE_WEB_APP_URL = 'https://drone-it-tawny.vercel.app/';

export const QrCodeModal: React.FC = () => {
  const { isQrModalOpen, setIsQrModalOpen } = useApp();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isQrModalOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(LIVE_WEB_APP_URL);
      setCopied(true);
      showToast('Live link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Copied: ' + LIVE_WEB_APP_URL, 'info');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsQrModalOpen(false);
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 id="qr-modal-title" className="text-base sm:text-lg font-black text-slate-900">
                Scan for Live Mobile App
              </h3>
              <p className="text-xs text-slate-500">
                Point your phone camera to open Droneit immediately
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsQrModalOpen(false)}
            aria-label="Close QR Modal"
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* QR Code Presentation Box */}
          <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col items-center justify-center group hover:border-emerald-500 transition-colors">
            <img
              src="/droneit_qr_code.png"
              alt="Scan Droneit QR Code for https://drone-it-tawny.vercel.app/"
              className="w-full h-full object-contain rounded-xl"
              width={288}
              height={288}
            />
          </div>

          {/* Device Compatibility Badge */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 py-2 px-3 rounded-full border border-emerald-200">
            <Smartphone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Works instantly with iPhone Camera, Android & Google Lens</span>
          </div>

          {/* URL Bar & Copy Action */}
          <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-100 rounded-xl border border-slate-200">
            <div className="font-mono text-xs text-slate-800 font-bold truncate pl-2">
              {LIVE_WEB_APP_URL}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <a
                href={LIVE_WEB_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open</span>
              </a>
            </div>
          </div>

          {/* Download Options */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Download QR Assets for Presentation Slides & Posters:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href="/droneit_qr_pitch_card.png"
                download="droneit_pitch_card_poster.png"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xs"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Pitch Card Poster (PNG)</span>
              </a>
              <a
                href="/droneit_qr_code.png"
                download="droneit_qr_code_branded.png"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold transition-all"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Branded QR Code (PNG)</span>
              </a>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
              <Zap className="w-3.5 h-3.5 mx-auto text-emerald-600 mb-1" />
              <div className="text-[11px] font-bold text-slate-900">3–5 Min Flight</div>
              <div className="text-[9px] text-slate-500">Autonomous Hub</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
              <Leaf className="w-3.5 h-3.5 mx-auto text-emerald-600 mb-1" />
              <div className="text-[11px] font-bold text-slate-900">GreenLoop</div>
              <div className="text-[9px] text-slate-500">Zero Plastic</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
              <ShieldCheck className="w-3.5 h-3.5 mx-auto text-blue-600 mb-1" />
              <div className="text-[11px] font-bold text-slate-900">DGCA Compliant</div>
              <div className="text-[9px] text-slate-500">Green Sky Zone</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
