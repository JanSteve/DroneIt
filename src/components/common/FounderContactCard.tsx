import React, { useState } from 'react';
import { Phone, Mail, Instagram, Copy, Check, ExternalLink, Zap, Calendar } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';

export const FounderContactCard: React.FC<{ variant?: 'card' | 'inline' | 'compact' }> = ({
  variant = 'card',
}) => {
  const { showToast } = useToast();
  const { setIsDemoBookingModalOpen } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (label: string, text: string, key: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      showToast(`Copied ${label} (${text}) to clipboard!`, 'success');
      setTimeout(() => setCopiedKey(null), 2000);
    } else {
      showToast(`Could not copy automatically. Value: ${text}`, 'warning');
    }
  };

  const contacts = [
    {
      key: 'phone',
      label: 'Direct Line / WhatsApp',
      value: '+91 8438110297',
      display: '+91 84381 10297',
      href: 'tel:+918438110297',
      icon: Phone,
      type: 'tel',
    },
    {
      key: 'email',
      label: 'Founder Email',
      value: 'Droneiteco@gmail.com',
      display: 'Droneiteco@gmail.com',
      href: 'mailto:Droneiteco@gmail.com?subject=Droneit%20Investment%20Inquiry',
      icon: Mail,
      type: 'email',
    },
    {
      key: 'instagram',
      label: 'Official Updates',
      value: '@drone.it',
      display: '@drone.it',
      href: 'https://instagram.com/drone.it',
      icon: Instagram,
      type: 'link',
      isExternal: true,
    },
  ];

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {contacts.map((c) => (
          <div
            key={c.key}
            className="inline-flex items-center rounded-lg bg-slate-900/80 border border-slate-800 p-1 pl-2.5 text-xs text-slate-300"
          >
            <c.icon className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0" />
            <a
              href={c.href}
              target={c.isExternal ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors font-mono"
            >
              {c.display}
            </a>
            <button
              onClick={() => handleCopy(c.label, c.value, c.key)}
              className="ml-2 p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              title={`Copy ${c.value}`}
              aria-label={`Copy ${c.label}`}
            >
              {copiedKey === c.key ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="space-y-2.5">
        <div className="space-y-2">
          {contacts.map((c) => (
            <div
              key={c.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <c.icon className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={c.href}
                  target={c.isExternal ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 font-mono transition-colors truncate"
                >
                  {c.display}
                </a>
              </div>
              <button
                onClick={() => handleCopy(c.label, c.value, c.key)}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors shrink-0"
                title={`Copy ${c.value}`}
                aria-label={`Copy ${c.label}`}
              >
                {copiedKey === c.key ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsDemoBookingModalOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 text-xs font-semibold transition-all"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Pilot Demo Flight</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0B132B]/90 backdrop-blur-md p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Direct Founder Channel</h4>
            <p className="text-xs text-slate-400">Instant response for pitch judges & pilot partners</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {contacts.map((c) => (
          <div
            key={c.key}
            className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors shrink-0">
                <c.icon className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  {c.label}
                </div>
                <a
                  href={c.href}
                  target={c.isExternal ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-medium text-slate-200 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 truncate"
                >
                  <span className="truncate">{c.display}</span>
                  {c.isExternal && <ExternalLink className="w-3 h-3 shrink-0 text-slate-500" />}
                </a>
              </div>
            </div>

            <button
              onClick={() => handleCopy(c.label, c.value, c.key)}
              className="ml-3 p-2 rounded-lg bg-slate-800/60 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 border border-slate-700/50 transition-all shrink-0 active:scale-95"
              title={`Copy ${c.value}`}
              aria-label={`Copy ${c.label}`}
            >
              {copiedKey === c.key ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsDemoBookingModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all"
      >
        <Calendar className="w-4 h-4" />
        <span>Schedule Campus Pilot Demo</span>
      </button>
    </div>
  );
};
