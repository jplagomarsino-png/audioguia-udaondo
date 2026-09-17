import { useEffect, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { X, ZoomIn, ZoomOut, Map as MapIcon } from 'lucide-react';

const MAP_SRC = '/mapa-udaondo.png';

interface Props {
  onClose: () => void;
}

export default function MapaUdaondo({ onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [view, setView] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = MAP_SRC;

    const measure = () => {
      const el = containerRef.current;
      if (el) setView({ w: el.clientWidth, h: el.clientHeight });
    };
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 300);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, []);

  const ready = dims && view;
  const initialScale = ready ? Math.max(view!.w / dims!.w, view!.h / dims!.h) : 1;

  return (
    <div className="fixed inset-0 z-[70] bg-slate-100 flex flex-col">
      {/* Top bar */}
      <div className="h-12 sm:h-14 bg-white border-b border-slate-200 flex items-center justify-between px-3 z-10 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-8 h-8 rounded-lg bg-[#0092e0]/10 text-[#0092e0] flex items-center justify-center shrink-0">
            <MapIcon className="w-4 h-4" />
          </span>
          <span className="font-display font-black uppercase tracking-tight text-slate-700 text-xs sm:text-sm truncate">
            Mapa General del Complejo
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors shrink-0"
          title="Cerrar mapa"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={containerRef} className="relative flex-1 overflow-hidden bg-slate-200">
        {ready ? (
          <TransformWrapper
            initialScale={initialScale}
            minScale={initialScale}
            maxScale={8}
            centerOnInit
            wheel={{ disabled: true }}
          >
            {({ zoomIn, zoomOut }) => (
              <>
                <div
                  onWheel={(e) => {
                    e.preventDefault();
                    const s = 0.06;
                    if (e.deltaY < 0) zoomIn(s);
                    else zoomOut(s);
                  }}
                  className="w-full h-full"
                >
                  <TransformComponent
                    wrapperStyle={{ width: '100%', height: '100%' }}
                    contentStyle={{}}
                  >
                    <img
                      src={MAP_SRC}
                      alt="Mapa general del Complejo Museográfico Enrique Udaondo"
                      draggable={false}
                      className="select-none"
                      style={{ width: dims.w, height: dims.h, maxWidth: 'none' }}
                    />
                  </TransformComponent>
                </div>

                {/* Zoom controls */}
                <div className="absolute bottom-5 right-4 flex flex-col gap-2 z-10">
                  <button
                    onClick={() => zoomIn(0.3)}
                    className="w-11 h-11 rounded-full bg-white shadow-md border border-slate-200 text-[#0092e0] flex items-center justify-center cursor-pointer hover:bg-sky-50"
                    title="Acercar"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => zoomOut(0.3)}
                    className="w-11 h-11 rounded-full bg-white shadow-md border border-slate-200 text-[#0092e0] flex items-center justify-center cursor-pointer hover:bg-sky-50"
                    title="Alejar"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </TransformWrapper>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-sans font-bold">
            Cargando mapa…
          </div>
        )}

        <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none bg-black/60 text-white text-[10px] font-sans font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
          Deslizá para moverte • botones +/− para zoom
        </div>
      </div>
    </div>
  );
}
