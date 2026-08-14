import { useState, useEffect, useRef, useCallback } from 'react';
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

  // Escala inicial: bien cerca (lo mayor entre 2.2× el ancho y 1.4× el alto del viewport)
  const getInitialScale = useCallback(() => {
    if (typeof window === 'undefined') return 0.5;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const fitW = vw / 1600;
    const fitH = vh / 1536;
    return Math.max(0.2, Math.min(Math.max(fitW * 2.2, fitH * 1.4), 2.2));
  }, []);

  // Escala actual del transform (para contrarrestar el zoom en los chips)
  const [viewScale, setViewScale] = useState<number>(() => (typeof window !== 'undefined' ? getInitialScale() : 0.5));

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
    <div className="fixed inset-0 z-[90] bg-[#f6efdd] flex flex-col">
      {/* HEADER — mismo estilo que App.tsx: blanco, h-20, SVG logo + joystick + X */}
      <header className="flex-none h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 shadow-sm z-10">
        {/* Logo SVG (click → inicio) */}
        <div
          onClick={() => onNavigate('inicio')}
          className="flex items-center justify-center cursor-pointer"
        >
          <BasilicaLogo className="w-11 h-14 text-[#0092e0]" />
        </div>

        {/* Joystick: prev / mapa / next */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-full px-2 py-1 shadow-sm">
          <button
            onClick={handlePanelPrev}
            className="w-7 h-7 bg-[#0092e0] text-white hover:bg-[#0081c7] active:scale-90 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Parada anterior"
          >
            <SkipBack className="w-3.5 h-3.5 fill-current" />
          </button>
          <button
            onClick={() => onNavigate('recorrido')}
            className="w-7 h-7 bg-white text-[#0092e0] border border-[#0092e0] hover:bg-sky-50 active:scale-90 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs"
            title="Ver mapa del recorrido"
          >
            <MapPin className="w-3.5 h-3.5 fill-current" />
          </button>
          <button
            onClick={handlePanelNext}
            className="w-7 h-7 bg-[#0092e0] text-white hover:bg-[#0081c7] active:scale-90 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Siguiente parada"
          >
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        {/* X para cerrar */}
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          title="Cerrar plano"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </header>

      {/* VISOR DEL PLANO */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-[#f6efdd]">
        <TransformWrapper
          ref={transformRef}
          initialScale={getInitialScale()}
          minScale={getInitialScale()}
          maxScale={3.2}
          centerOnInit
          limitToBounds
          doubleClick={{ mode: 'zoomIn' }}
          wheel={{ disabled: true }}
          panning={{ disabled: false }}
          onTransformed={(ref) => {
            if (ref && ref.state) setViewScale(ref.state.scale);
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
              <div className="relative">
                <img
                  src={MAP_IMAGE_SRC}
                  alt="Plano de la Basílica de Luján"
                  className="block select-none pointer-events-none"
                  style={{ width: 1600, height: 'auto' }}
                  draggable={false}
                />

                {/* CHIPS DE ZONA */}
                {MAP_ZONES.map((zone) => {
                  const isActive = activeZone?.id === zone.id;
                  return (
                    <motion.div
                      key={zone.id}
                      initial={{ opacity: 0, filter: 'blur(2px)', scale: 0.9 }}
                      animate={
                        revealed.has(zone.id)
                          ? { opacity: 1, filter: 'blur(0px)', scale: isActive ? 1.06 : 1 }
                          : {}
                      }
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChipTap(zone);
                      }}
                      className="absolute px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-2xl text-center cursor-pointer select-none"
                      style={{
                        left: `${zone.labelX}%`,
                        top: `${zone.labelY}%`,
                        transform: 'translate(-50%, -50%)',
                        maxWidth: 110,
                        zIndex: 5,
                        background: isActive
                          ? 'linear-gradient(180deg, #e8c15c, #c79a3c)'
                          : 'rgba(246, 239, 221, 0.75)',
                        color: '#3b2312',
                        border: '1px solid #c79a3c',
                        fontFamily: "'Palatino Linotype', Georgia, serif",
                        fontStyle: 'italic',
                        fontWeight: 700,
                        fontSize: Math.max(6, Math.min(12.5 / (viewScale || 1), 10)),
                        lineHeight: 1.2,
                        boxShadow: isActive
                          ? '0 4px 16px rgba(199,154,60,0.55)'
                          : '0 3px 10px rgba(0,0,0,0.35)',
                      }}
                    >
                      {zone.name}
                    </motion.div>
                  );
                })}
              </div>
            </TransformComponent>
            </div>
            );
          }}
        </TransformWrapper>

        {/* LEYENDA */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <span className="bg-[#2a1a0f]/80 backdrop-blur text-[#e8c15c]/70 text-[10px] px-3 py-1 rounded-full">
            Tocá un nombre para explorar esa zona
          </span>
        </div>

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

      {/* FOOTER DE NAVEGACIÓN — invertido: celeste, iconos blancos */}
      <footer className="flex-none h-14 bg-[#0092e0] border-t border-sky-700 flex justify-around items-center z-10 shadow-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all gap-0.5 cursor-pointer text-white/80 hover:text-white"
            >
              <Icon className="w-4 h-4" />
              <span className="text-[8px] font-sans font-extrabold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </footer>
    </div>
  );
}
