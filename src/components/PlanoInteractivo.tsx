import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { X, Map, Compass, Bookmark, Sparkles, ChevronRight, SkipBack, MapPin, SkipForward } from 'lucide-react';
import type { TourStop } from '../data';
import AudioPlayerControl from './AudioPlayerControl';

/* ============================================================
 * SVG BASILICA LOGO (compacto, mismo que App.tsx)
 * ============================================================ */
function BasilicaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 500" className={className} fill="currentColor">
      <rect x="90" y="380" width="15" height="100" />
      <rect x="105" y="330" width="15" height="150" />
      <rect x="120" y="220" width="50" height="260" />
      <rect x="125" y="140" width="40" height="80" />
      <path d="M 127 140 L 145 20 L 163 140 Z" />
      <circle cx="145" cy="14" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="145" y1="5" x2="145" y2="24" stroke="currentColor" strokeWidth="2.5" />
      <line x1="137" y1="14" x2="153" y2="14" stroke="currentColor" strokeWidth="2.5" />
      <rect x="395" y="380" width="15" height="100" />
      <rect x="380" y="330" width="15" height="150" />
      <rect x="330" y="220" width="50" height="260" />
      <rect x="335" y="140" width="40" height="80" />
      <path d="M 337 140 L 355 20 L 373 140 Z" />
      <circle cx="355" cy="14" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="355" y1="5" x2="355" y2="24" stroke="currentColor" strokeWidth="2.5" />
      <line x1="347" y1="14" x2="363" y2="14" stroke="currentColor" strokeWidth="2.5" />
      <rect x="170" y="290" width="160" height="190" />
      <path d="M 242 290 L 250 220 L 258 290 Z" />
      <line x1="250" y1="210" x2="250" y2="222" stroke="currentColor" strokeWidth="2" />
      <line x1="246" y1="215" x2="254" y2="215" stroke="currentColor" strokeWidth="2" />
      <path d="M 175 480 A 75 75 0 0 1 325 480 Z" fill="#ffffff" />
      <path d="M 175 480 A 75 75 0 0 1 325 480" stroke="currentColor" strokeWidth="10" fill="none" />
      <path d="M 188 480 A 62 62 0 0 1 312 480" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="250" cy="480" r="10" fill="currentColor" />
      <line x1="250" y1="480" x2="187" y2="445" stroke="currentColor" strokeWidth="6" />
      <line x1="250" y1="480" x2="200" y2="415" stroke="currentColor" strokeWidth="6" />
      <line x1="250" y1="480" x2="225" y2="395" stroke="currentColor" strokeWidth="6" />
      <line x1="250" y1="480" x2="250" y2="385" stroke="currentColor" strokeWidth="6" />
      <line x1="250" y1="480" x2="275" y2="395" stroke="currentColor" strokeWidth="6" />
      <line x1="250" y1="480" x2="300" y2="415" stroke="currentColor" strokeWidth="6" />
      <line x1="250" y1="480" x2="313" y2="445" stroke="currentColor" strokeWidth="6" />
      <path d="M 205 480 A 45 45 0 0 1 295 480" stroke="currentColor" strokeWidth="4" fill="none" />
      <path d="M -10 460 Q 250 360 510 460 L 510 510 L -10 510 Z" fill="#ffffff" />
      <path d="M -10 460 Q 250 360 510 460" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M 20 495 Q 250 415 480 495" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ============================================================
 * DATOS DE ZONAS (8 zonas + Entrada)
 * ============================================================ */
interface ZonaInfo {
  id: number;
  name: string;
  stopId: string;
  left: number;
  top: number;
  width: number;
  height: number;
  labelX: number;
  labelY: number;
}

const MAP_ZONES: ZonaInfo[] = [
  // INTERIOR
  { id: 1,  name: 'Nave Central',                     stopId: 'navecentral',    left: 31, top: 34, width: 28, height: 30, labelX: 45, labelY: 49 },
  { id: 2,  name: 'Altares Principales y Camarín de la Virgen', stopId: 'sanantonio', left: 5, top: 45, width: 50, height: 18, labelX: 22, labelY: 50 },
  { id: 3,  name: 'Nave Lateral Izquierda (Paraguay)', stopId: 'sanjose',        left: 31, top: 64, width: 28, height: 18, labelX: 45, labelY: 82 },
  { id: 4,  name: 'Nave Lateral Derecha (Uruguay)',    stopId: 'bautismo',       left: 31, top: 16, width: 28, height: 18, labelX: 45, labelY: 14 },
  { id: 5,  name: 'Ábside y Deambulatorio',            stopId: 'deambulatorio',  left: 2,  top: 48, width: 18, height: 18, labelX: 11, labelY: 55 },
  // FACHADA (bajados 20% en bloque)
  { id: 7,  name: 'Los Tres Portales',                 stopId: 'portadas',       left: 71, top: 75, width: 29, height: 23, labelX: 85.5, labelY: 86 },
  { id: 8,  name: 'Apóstoles y Evangelistas',          stopId: 'apostoles',      left: 71, top: 58, width: 29, height: 15, labelX: 85.5, labelY: 61 },
  { id: 9,  name: 'Campanarios y Relojes',             stopId: 'torres',         left: 71, top: 44, width: 29, height: 14, labelX: 85.5, labelY: 47 },
  { id: 10, name: 'Las Torres',                        stopId: 'torres',         left: 71, top: 30, width: 29, height: 14, labelX: 85.5, labelY: 34 },
  // ENTRADA (corrida hacia el centro)
  { id: 11, name: 'Entrada',                           stopId: 'bienvenida',     left: 56, top: 48, width: 16, height: 8,  labelX: 64, labelY: 50 },
];

const MAP_IMAGE_SRC = '/plano.jpg';

/* ============================================================
 * PROPS
 * ============================================================ */
interface PlanoInteractivoProps {
  stops: TourStop[];
  currentPlayingStopId: string | null;
  isPlaying: boolean;
  onPlay: (stopId: string) => void;
  onStop: () => void;
  onNavigate: (tab: string) => void;
  onClose: () => void;
  onUserPan?: () => void;
}

/* ============================================================
 * COMPONENTE
 * ============================================================ */
export default function PlanoInteractivo({
  stops,
  currentPlayingStopId,
  isPlaying,
  onPlay,
  onStop,
  onNavigate,
  onClose,
  onUserPan,
}: PlanoInteractivoProps) {
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Derivar zona activa del stopId
  const activeZone = activeStopId ? MAP_ZONES.find(z => z.stopId === activeStopId) || null : null;

  // Revelar chips progresivamente
  useEffect(() => {
    const timers = MAP_ZONES.map((z, i) =>
      setTimeout(() => {
        setRevealed((prev) => new Set(prev).add(z.id));
      }, 300 + i * 100)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Dimensiones de referencia de la imagen del plano
  const IMG_W = 1600;
  const IMG_H = 680; // 3613x1536 real, renderizada a 1600 de ancho

  // Medidas REALES del visor (no el viewport: en móvil el alto difiere por header/footer)
  const getViewSize = useCallback(() => {
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return { w: r.width, h: r.height };
    }
    return { w: window.innerWidth, h: window.innerHeight };
  }, []);

  // Escala + posición inicial según orientación.
  // Vertical (celular): ajusta por ALTO (poco/ningún zoom, máxima porción visible del
  // plano) y arranca pegado a la izquierda -> vista parcial que se completa haciendo
  // swipe a la derecha, recorriendo todo el mapa.
  // Horizontal / PC: "cover" centrado (comportamiento actual, sin cambios).
  const computeInitialTransform = useCallback((w: number, h: number) => {
    const isPortrait = h >= w;
    if (isPortrait) {
      const s = h / IMG_H;
      return { scale: s, posX: 0, posY: (h - IMG_H * s) / 2 };
    }
    const s = Math.max(w / IMG_W, h / IMG_H);
    return { scale: s, posX: (w - IMG_W * s) / 2, posY: (h - IMG_H * s) / 2 };
  }, []);

  // Tamaño real del visor, medido ANTES de montar el TransformWrapper para que la
  // escala/posición inicial se calculen una sola vez y con datos reales (sin el salto
  // que producía calcular una vez en el render y corregir 200ms después).
  const [viewSize, setViewSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => setViewSize(getViewSize());
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [getViewSize]);

  const initial = viewSize ? computeInitialTransform(viewSize.w, viewSize.h) : null;

  // Escala actual: SOLO se usa para contra-escalar el tamaño de las etiquetas (no su
  // posición, que queda fija en el mismo nodo transformado que la imagen -> cero lag).
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (initial) setScale(initial.scale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewSize]);

  // Si cambia el tamaño/orientación del visor ya montado (p. ej. rotar el celular),
  // recalcular y reaplicar el transform inicial.
  useEffect(() => {
    if (!viewSize || !transformRef.current) return;
    const { scale: s, posX, posY } = computeInitialTransform(viewSize.w, viewSize.h);
    transformRef.current.setTransform(posX, posY, s, 0);
  }, [viewSize, computeInitialTransform]);

  const stopById = (id: string) => stops.find((s) => s.id === id);

  const handleChipTap = (zone: ZonaInfo) => {
    if (activeStopId === zone.stopId) {
      setActiveStopId(null);
      onStop();
    } else {
      onStop();
      setActiveStopId(zone.stopId);
    }
  };

  const handlePanelPlay = () => {
    if (!activeStopId) return;
    const stop = stopById(activeStopId);
    if (!stop) return;
    onPlay(stop.id);
  };

  const handlePanelNext = () => {
    if (!activeStopId) return;
    const idx = stops.findIndex((s) => s.id === activeStopId);
    if (idx < 0 || idx >= stops.length - 1) return;
    const next = stops[idx + 1];
    setActiveStopId(next.id);
    onPlay(next.id);
  };

  const handlePanelPrev = () => {
    if (!activeStopId) return;
    const idx = stops.findIndex((s) => s.id === activeStopId);
    if (idx <= 0) return;
    const prev = stops[idx - 1];
    setActiveStopId(prev.id);
    onPlay(prev.id);
  };

  const activeStop = activeStopId ? stopById(activeStopId) : null;
  const isCurrentZonePlaying = activeStop && currentPlayingStopId === activeStop.id && isPlaying;

  // Tocar fuera del panel → cerrar
  const handleBgTap = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setActiveStopId(null);
      onStop();
    }
  };

  const tabs = [
    { id: 'inicio', icon: Compass, label: 'Inicio' },
    { id: 'recorrido', icon: Map, label: 'Recorrido' },
    { id: 'arquitectura', icon: Compass, label: 'Arquitectura' },
    { id: 'interior', icon: Bookmark, label: 'Interior' },
    { id: 'vitrales', icon: Sparkles, label: 'Vitrales' },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-[#f6efdd] flex flex-col">

      {/* VISOR DEL PLANO */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-[#f6efdd]">
        {initial && (
        <TransformWrapper
          ref={transformRef}
          initialScale={initial.scale}
          initialPositionX={initial.posX}
          initialPositionY={initial.posY}
          minScale={initial.scale}
          maxScale={3.2}
          centerOnInit={false}
          limitToBounds
          doubleClick={{ mode: 'zoomIn' }}
          wheel={{ disabled: true }}
          panning={{ disabled: false }}
          onTransformed={(ref) => {
            if (ref && ref.state) {
              setScale(ref.state.scale);
              if (onUserPan) onUserPan();
            }
          }}
        >
          {({ zoomIn, zoomOut }) => {
            // Interceptar wheel para zoom suave manual
            const handleWheel = (e: React.WheelEvent) => {
              e.preventDefault();
              const step = 0.04;
              if (e.deltaY < 0) zoomIn(step);
              else zoomOut(step);
            };
            return (
            <div onWheel={handleWheel} className="w-full h-full">
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ position: 'relative' }}
            >
              <div className="relative" style={{ width: IMG_W, height: IMG_H }}>
                <img
                  src={MAP_IMAGE_SRC}
                  alt="Plano de la Basílica de Luján"
                  className="block select-none pointer-events-none"
                  style={{ width: '100%', height: '100%' }}
                  draggable={false}
                />

                {/* ETIQUETAS: dentro del MISMO nodo transformado que la imagen.
                    Posicionadas en % respecto de la imagen -> paneo/zoom perfectamente
                    sincronizados, sin cálculo en JS y sin lag ("pegadas" al lugar). */}
                {MAP_ZONES.map((zone) => {
                  const isActive = activeZone?.id === zone.id;
                  return (
                    <div
                      key={zone.id}
                      className="absolute"
                      style={{
                        left: `${zone.labelX}%`,
                        top: `${zone.labelY}%`,
                        transform: `translate(-50%, -50%) scale(${1 / scale})`,
                        transformOrigin: 'center center',
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={
                          revealed.has(zone.id)
                            ? { opacity: 1, scale: isActive ? 1.08 : 1 }
                            : {}
                        }
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChipTap(zone);
                        }}
                        className="px-1.5 py-0.5 rounded-xl text-center cursor-pointer select-none"
                        style={{
                          maxWidth: 120,
                          background: isActive
                            ? 'linear-gradient(180deg, #e8c15c, #c79a3c)'
                            : 'rgba(246, 239, 221, 0.8)',
                          color: '#3b2312',
                          border: '1px solid #c79a3c',
                          fontFamily: "'Palatino Linotype', Georgia, serif",
                          fontStyle: 'italic',
                          fontWeight: 700,
                          fontSize: 10,
                          lineHeight: 1.15,
                          whiteSpace: 'nowrap',
                          boxShadow: isActive
                            ? '0 4px 16px rgba(199,154,60,0.55)'
                            : '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                      >
                        {zone.name}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </TransformComponent>
            </div>
            );
          }}
        </TransformWrapper>
        )}

        {/* PANEL REPRODUCTOR (60% opacidad) — se cierra al tocar fuera */}
        <AnimatePresence>
          {activeZone && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="absolute inset-0 z-30 flex items-end justify-center pb-24"
              onClick={handleBgTap}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md mx-3 rounded-2xl px-5 pt-5 pb-4 backdrop-blur-md"
                style={{
                  background: 'rgba(255, 255, 255, 0.60)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(0,146,224,0.25)',
                }}
              >
                {/* Encabezado */}
                <div className="text-center mb-3">
                  <p className="text-[10px] font-sans font-bold text-[#0092e0] uppercase tracking-wider">
                    {activeZone.name}
                  </p>
                  <p className="text-xs text-slate-500 font-sans mt-0.5">
                    {activeStop?.title}
                  </p>
                </div>

                {/* Reproductor */}
                <AudioPlayerControl
                  isPlaying={isCurrentZonePlaying}
                  onClick={handlePanelPlay}
                  onPrev={activeStop ? handlePanelPrev : undefined}
                  onNext={activeStop ? handlePanelNext : undefined}
                />

                {/* Botones */}
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => {
                      setActiveStopId(null);
                      onStop();
                    }}
                    className="flex-1 py-2 rounded-full text-xs font-sans font-bold text-slate-500 border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Volver al plano
                  </button>
                  <button
                    onClick={() => {
                      if (activeStop) {
                        onStop();
                        setActiveStopId(null);
                        onNavigate('recorrido');
                      }
                    }}
                    className="flex-1 py-2 rounded-full text-xs font-sans font-bold text-white bg-[#0092e0] hover:bg-[#0081c7] transition-colors cursor-pointer"
                  >
                    Ir al recorrido
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
