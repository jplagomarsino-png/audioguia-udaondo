import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerControlProps {
  isPlaying: boolean;
  onClick: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  compact?: boolean; // versión más chica para el pop-up flotante
}

export default function AudioPlayerControl({
  isPlaying,
  onClick,
  onPrev,
  onNext,
  compact = false,
}: AudioPlayerControlProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 select-none">
        {onPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="w-8 h-8 rounded-full bg-white/90 text-[#0092e0] border border-[#0092e0]/40 shadow-sm hover:bg-white active:scale-90 transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
            title="Parada anterior"
          >
            <SkipBack className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 border-2 border-white/60 cursor-pointer ${
            isPlaying
              ? 'bg-[#D4AF37] hover:bg-[#C5A028] text-white'
              : 'bg-[#0092e0] hover:bg-[#0081c7] text-white'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-white" />
          ) : (
            <Play className="w-4 h-4 fill-white ml-0.5" />
          )}
        </button>
        {onNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="w-8 h-8 rounded-full bg-white/90 text-[#0092e0] border border-[#0092e0]/40 shadow-sm hover:bg-white active:scale-90 transition-all cursor-pointer flex items-center justify-center flex-shrink-0"
            title="Siguiente parada"
          >
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-between py-4 select-none w-full mx-auto px-2 sm:px-4">
      <button
        onClick={(e) => { e.stopPropagation(); if (onPrev) onPrev(); }}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#0092e0] border-2 border-[#0092e0] shadow-md hover:bg-sky-50 active:scale-90 transition-all cursor-pointer flex items-center justify-center flex-shrink-0 relative z-20"
        title="Parada anterior"
      >
        <SkipBack className="w-4 h-4 fill-current" />
      </button>

      <div className="absolute left-11 right-11 sm:left-14 sm:right-14 h-0.5 bg-[#0092e0]/60 top-1/2 -translate-y-1/2 z-0" />

      <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 border-4 border-white cursor-pointer flex-shrink-0 ${
          isPlaying
            ? 'bg-[#D4AF37] hover:bg-[#C5A028] text-white shadow-amber-200/50'
            : 'bg-[#0092e0] hover:bg-[#0081c7] text-white shadow-sky-100'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-5 sm:w-6 h-5 sm:h-6 fill-white" />
        ) : (
          <Play className="w-5 sm:w-6 h-5 sm:h-6 fill-white ml-1" />
        )}
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); if (onNext) onNext(); }}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#0092e0] border-2 border-[#0092e0] shadow-md hover:bg-sky-50 active:scale-90 transition-all cursor-pointer flex items-center justify-center flex-shrink-0 relative z-20"
        title="Siguiente parada"
      >
        <SkipForward className="w-4 h-4 fill-current" />
      </button>
    </div>
  );
}
