import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, CheckCircle2, Wifi, WifiOff, X, Share, PlusSquare } from 'lucide-react';

export function StandaloneAppButton() {
  const { isStandalone, isIOS, isOnline, triggerInstall } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (!showInstructions) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowInstructions(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showInstructions]);

  const handleClick = async () => {
    const result = await triggerInstall();
    if (result === 'manual_instructions') {
      setShowInstructions(true);
    }
  };

  return (
    <div className="px-4 pb-4 pt-2 border-t border-er-line">
      {isStandalone ? (
        <div className="p-3.5 rounded-xl bg-[#0b1f1c] border border-[#14b8a6]/40 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-er-teal/20 text-er-teal flex items-center justify-center flex-none">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-er-teal flex items-center gap-1.5">
                Standalone App Mode Active
              </div>
              <div className="text-xs text-[#5eead4]/80 mt-0.5">
                Full offline caching active • No browser bars
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-black/40 text-er-ink-soft border border-er-line">
            {isOnline ? (
              <>
                <Wifi size={12} className="text-er-teal" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-amber-400" />
                <span>Offline mode</span>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-[#0e0e0e] border border-er-line/90 hover:border-er-teal/40 transition-colors">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-er-teal/15 text-er-teal border border-er-teal/30 flex items-center justify-center flex-none">
                <Smartphone size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-er-ink flex items-center gap-1.5">
                  Standalone App Mode
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded font-extrabold bg-er-teal/20 text-er-teal border border-er-teal/30">
                    Offline
                  </span>
                </div>
                <div className="text-xs text-er-ink-soft mt-0.5">
                  Install to home screen for full-screen & zero-internet use
                </div>
              </div>
            </div>

            <button
              type="button"
              id="installStandaloneAppBtn"
              onClick={handleClick}
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold bg-er-teal text-black hover:bg-[#2dd4bf] active:scale-[0.98] transition-all cursor-pointer shadow-sm"
            >
              <Download size={14} strokeWidth={2.5} />
              <span>Install App</span>
            </button>
          </div>
        </div>
      )}

      {/* Manual Instructions Modal for iOS / Safari / unsupported prompt browsers */}
      {showInstructions && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInstructions(false);
          }}
        >
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="installModalTitle"
            aria-describedby="installModalDesc"
            className="w-full max-w-sm bg-[#111111] border border-er-line rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-er-line/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-er-teal/20 text-er-teal flex items-center justify-center">
                  <Smartphone size={16} />
                </div>
                <h4 id="installModalTitle" className="text-xs font-bold text-er-ink uppercase tracking-wider">
                  Add to Home Screen
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                aria-label="Close installation instructions"
                title="Close installation instructions"
                className="p-1 rounded-md text-er-ink-soft hover:text-er-ink hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p id="installModalDesc" className="text-xs text-er-ink-soft leading-relaxed">
              Install <strong>New Case Alert</strong> on your phone for full offline access, zero address bar distractions, and fast 1-tap launching:
            </p>

            <div className="space-y-2.5 text-xs text-er-ink bg-[#161616] p-3 rounded-xl border border-er-line">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#222222] flex items-center justify-center text-er-teal flex-none font-bold text-xs">
                  1
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  Tap browser{' '}
                  {isIOS ? (
                    <span className="inline-flex items-center gap-1 font-bold text-er-teal">
                      Share <Share size={12} />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-bold text-er-teal">
                      Menu (⋮)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#222222] flex items-center justify-center text-er-teal flex-none font-bold text-xs">
                  2
                </div>
                <div className="flex items-center gap-1.5">
                  Select <span className="font-bold text-er-teal inline-flex items-center gap-1">Add to Home Screen <PlusSquare size={12} /></span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#222222] flex items-center justify-center text-er-teal flex-none font-bold text-xs">
                  3
                </div>
                <div>
                  Tap <span className="font-bold text-er-teal">Add</span> to complete installation
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="w-full py-2.5 rounded-lg text-xs font-bold bg-[#1e1e1e] hover:bg-[#252525] text-er-ink border border-er-line transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
