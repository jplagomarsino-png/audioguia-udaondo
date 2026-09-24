import { useState, useEffect, useMemo, useRef, type ReactNode } from 'react';
import {
  Play,
  Pause,
  Map,
  ChevronRight,
  FastForward,
  Volume2,
  X,
  SkipBack,
  SkipForward,
  Landmark,
  Car,
  Train,
  TreePine,
  Home,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ALL_TOUR_STOPS,
  MUSEUM_AREAS,
  QUICK_TOUR_IDS,
  MuseumId,
  TourStop,
  SalaTematica,
  MuseumArea
} from './data';
import AudioPlayerControl from './components/AudioPlayerControl';
import MapaUdaondo from './components/MapaUdaondo';

// Imagen de respaldo (fallback de cualquier foto rota)
const placeholderImg = '/museo-historico.jpg';

// Helper para obtener foto destacada de una sala
function getSalaImage(sala: SalaTematica, museum: MuseumArea): string {
  if (sala.introStopId) {
    const intro = ALL_TOUR_STOPS.find(s => s.id === sala.introStopId);
    if (intro?.image) return intro.image;
  }
  if (sala.stopIds && sala.stopIds.length > 0) {
    const first = ALL_TOUR_STOPS.find(s => s.id === sala.stopIds[0]);
    if (first?.image) return first.image;
  }
  return museum.image;
}

// Íconos SVG por museo (fallback de seguridad)
const MUSEUM_ICONS: Record<MuseumId, ReactNode> = {
  historico: <Landmark strokeWidth={2.5} className="w-6 h-6" />,
  transportes: <Train strokeWidth={2.5} className="w-6 h-6" />,
  automovil: <Car strokeWidth={2.5} className="w-6 h-6" />,
  otros: <TreePine strokeWidth={2.5} className="w-6 h-6" />,
};

// Íconos temáticos para los museos
const MUSEUM_ICON_IMAGES: Record<MuseumId, string> = {
  historico: '/iconos/historico.webp',
  transportes: '/iconos/carretas-y-motores.webp',
  automovil: '/iconos/automotor.webp',
  otros: '/iconos/otros-espacios.webp',
};

// Íconos temáticos para las salas (restituidos con sus archivos correspondientes)
const SALA_ICON_IMAGES: Record<string, string> = {
  'origenes-colonia': '/iconos/encuentro.webp',
  'pueblos-originarios': '/iconos/originarios-1.webp',
  'planta-alta-cabildo': '/iconos/cabildo-planta-alta.webp',
  'independencia': '/iconos/independencia.webp',
  'autonomias-rosas': '/iconos/reoganizacion-nacional.webp',
  'vida-gaucha': '/iconos/vida-gaucha.webp',
  'evolucion-contrastes': '/iconos/evolucion.webp',
  'carretas-motores': '/iconos/carretas-y-motores.webp',
  'grandes-hazanas': '/iconos/hazanas.webp',
  'memoria-movimiento': '/iconos/automotor.webp',
  'espacios-monumentos': '/iconos/otros-espacios.webp',
};

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'inicio' | MuseumId>('inicio');
  const [selectedSalaId, setSelectedSalaId] = useState<string | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showQuick, setShowQuick] = useState<boolean>(false);
  const [quickStopId, setQuickStopId] = useState<string | null>(null);

  // Audio Playback / TTS State
  const [playingStopId, setPlayingStopId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // References for SpeechSynthesis and HTML Audio Playback
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize SpeechSynthesis on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => { stopAudio(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    }
  }, [activeTab]);

  // --- AUDIO & VOICE SYNTHESIS CONTROL ---
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setPlayingStopId(null);
  };

  const playTTS = (stopId: string, text: string) => {
    const stop = ALL_TOUR_STOPS.find(s => s.id === stopId);
    const audioFilename = stop?.audio || `${stopId}.mp3`;

    if (playingStopId === stopId) {
      if (isPlaying) {
        if (audioRef.current) audioRef.current.pause();
        else if (synthRef.current) synthRef.current.pause();
        setIsPlaying(false);
      } else {
        if (audioRef.current) {
          audioRef.current.play().catch(() => playTTSFallback(stopId, text));
        } else if (synthRef.current) {
          synthRef.current.resume();
        }
        setIsPlaying(true);
      }
      return;
    }

    stopAudio();
    setPlayingStopId(stopId);
    setIsPlaying(true);

    const audioUrl = `/${audioFilename}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.play()
      .then(() => { audio.onended = () => advanceAfterAudioEnd(); })
      .catch(() => {
        audioRef.current = null;
        playTTSFallback(stopId, text);
      });
  };

  const playTTSFallback = (_stopId: string, text: string) => {
    if (!synthRef.current) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-AR';
    utterance.rate = 1.05;
    const voices = synthRef.current.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es-'));
    if (spanishVoice) utterance.voice = spanishVoice;
    utterance.onend = () => advanceAfterAudioEnd();
    utterance.onerror = () => stopAudio();
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  // --- DERIVED DATA ---
  const fullStopsList = useMemo(() => ALL_TOUR_STOPS, []);
  const firstStop = useMemo(() => fullStopsList[0], [fullStopsList]);

  // Paradas del recorrido Vía Rápida
  const quickStops = useMemo(() => {
    return QUICK_TOUR_IDS
      .map(id => ALL_TOUR_STOPS.find(s => s.id === id))
      .filter((s): s is TourStop => !!s);
  }, []);

  // Museo actual
  const activeMuseum = useMemo(() => {
    if (activeTab === 'inicio') return null;
    return MUSEUM_AREAS.find(m => m.id === activeTab) || null;
  }, [activeTab]);

  // Sala actual seleccionada dentro del museo
  const activeSala = useMemo(() => {
    if (!activeMuseum || !selectedSalaId) return null;
    return activeMuseum.salas.find(s => s.id === selectedSalaId) || null;
  }, [activeMuseum, selectedSalaId]);

  // Paradas de la sala activa
  const activeSalaStops = useMemo(() => {
    if (!activeSala) return [];
    return activeSala.stopIds
      .map(id => ALL_TOUR_STOPS.find(s => s.id === id))
      .filter((s): s is TourStop => !!s);
  }, [activeSala]);

  // Todas las paradas del museo en orden
  const museumStops = useMemo(() => {
    if (!activeMuseum) return [];
    return ALL_TOUR_STOPS.filter(s => s.museum === activeMuseum.id);
  }, [activeMuseum]);

  // Parada expandida (mini reproductor dentro del listado / single view)
  const expandedStopId = selectedStopId;
  const setExpandedStopId = (id: string | null) => setSelectedStopId(id);

  // Vía Rápida: parada activa
  const activeQuickStop = useMemo(() => {
    if (quickStops.length === 0) return null;
    return quickStops.find(s => s.id === quickStopId) || quickStops[0];
  }, [quickStopId, quickStops]);

  // Auto-scroll a la parada expandida cuando cambia
  useEffect(() => {
    if (!expandedStopId) return;
    const t = setTimeout(() => {
      const el = document.getElementById(`stop-exp-${expandedStopId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
    return () => clearTimeout(t);
  }, [expandedStopId]);

  // --- NAVEGACIÓN ---
  const handleSelectMuseum = (museumId: MuseumId) => {
    stopAudio();
    setShowMap(false);
    setShowQuick(false);
    setSelectedSalaId(null);
    setSelectedStopId(null);
    setActiveTab(museumId);
  };

  const handleGoInicio = () => {
    stopAudio();
    setShowMap(false);
    setShowQuick(false);
    setSelectedSalaId(null);
    setSelectedStopId(null);
    setActiveTab('inicio');
  };

  const handleSelectSala = (salaId: string) => {
    stopAudio();
    setSelectedSalaId(salaId);
    setSelectedStopId(null);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as any });
    }
  };

  const handleBackToSalas = () => {
    stopAudio();
    setSelectedSalaId(null);
    setSelectedStopId(null);
  };

  const handleOpenMap = () => {
    stopAudio();
    setShowQuick(false);
    setShowMap(true);
  };

  const handleOpenQuick = () => {
    stopAudio();
    setShowMap(false);
    setShowQuick(true);
    setQuickStopId(QUICK_TOUR_IDS[0] || null);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  // Navegación horizontal del reproductor de Bienvenida (Inicio)
  const handleHomeNext = () => handleSelectMuseum('historico');
  const handleHomePrev = () => handleSelectMuseum('transportes');

  // Tocar una parada del listado: expande/colapsa el mini reproductor en la card
  const handleToggleExpand = (stopId: string) => {
    setExpandedStopId(expandedStopId === stopId ? null : stopId);
    stopAudio();
  };

  // Siguiente/anterior DENTRO del museo (expande la parada correspondiente)
  const nextMuseumStop = (wrap: boolean): TourStop | null => {
    if (museumStops.length === 0) return null;
    const curIdx = expandedStopId
      ? museumStops.findIndex(s => s.id === expandedStopId)
      : -1;
    let nextIdx = curIdx + 1;
    if (wrap && nextIdx >= museumStops.length) nextIdx = 0;
    if (nextIdx >= museumStops.length) return null;
    return museumStops[nextIdx];
  };

  const prevMuseumStop = (wrap: boolean): TourStop | null => {
    if (museumStops.length === 0) return null;
    const curIdx = expandedStopId
      ? museumStops.findIndex(s => s.id === expandedStopId)
      : 0;
    let prevIdx = curIdx - 1;
    if (wrap && prevIdx < 0) prevIdx = museumStops.length - 1;
    if (prevIdx < 0) return null;
    return museumStops[prevIdx];
  };

  const handleNextStop = () => {
    const next = nextMuseumStop(true);
    if (next) {
      stopAudio();
      setExpandedStopId(next.id);
    }
  };

  const handlePrevStop = () => {
    const prev = prevMuseumStop(true);
    if (prev) {
      stopAudio();
      setExpandedStopId(prev.id);
    }
  };

  const handleQuickNext = () => {
    if (quickStops.length === 0) return;
    const i = Math.max(0, quickStops.findIndex(s => s.id === activeQuickStop?.id));
    const next = quickStops[(i + 1) % quickStops.length];
    if (next) {
      setQuickStopId(next.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuickPrev = () => {
    if (quickStops.length === 0) return;
    const i = Math.max(0, quickStops.findIndex(s => s.id === activeQuickStop?.id));
    const prev = quickStops[(i - 1 + quickStops.length) % quickStops.length];
    if (prev) {
      setQuickStopId(prev.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Avance automático al terminar el audio
  const advanceAfterAudioEnd = () => {
    if (showQuick) {
      if (quickStops.length === 0) { stopAudio(); return; }
      const i = Math.max(0, quickStops.findIndex(s => s.id === activeQuickStop?.id));
      const nextIndex = i + 1;
      if (nextIndex < quickStops.length) {
        setQuickStopId(quickStops[nextIndex].id);
      } else {
        stopAudio();
      }
      return;
    }
    if (activeMuseum && activeMuseum.hasTour) {
      const next = nextMuseumStop(false);
      if (next) {
        setExpandedStopId(next.id);
      } else {
        stopAudio();
      }
      return;
    }
    stopAudio();
  };

  // ============================
  // RENDER
  // ============================
  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900 pb-24 pt-16 sm:pt-22 landscape:pt-14">

      {/* FIXED CELESTE HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-22 landscape:h-14 bg-[#0092e0] border-b border-[#0081c7] shadow-md">
        <div className="h-full w-full flex items-center justify-center px-3 sm:px-5">
          {/* GRUPO CENTRADO EN PANTALLA: TEXTO A LA IZQUIERDA (JUSTIFICADO DERECHA) + LOGO 40% MÁS GRANDE */}
          <div
            onClick={handleGoInicio}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer select-none"
          >
            {/* TEXTO A SU LADO IZQUIERDO JUSTIFICADO A LA DERECHA (20% MÁS PEQUEÑO) */}
            <div className="flex flex-col justify-center items-end text-right leading-none">
              <span className="font-sans font-bold tracking-tight text-[10px] sm:text-xs text-white uppercase leading-none">
                Audioguía
              </span>
              <span className="font-sans font-medium text-[6.5px] sm:text-[8px] text-white/95 leading-tight mt-0.5 whitespace-nowrap uppercase">
                del Complejo
              </span>
              <span className="font-sans font-bold text-[6.5px] sm:text-[8px] text-white/95 leading-tight whitespace-nowrap uppercase">
                MUSEOGRÁFICO.
              </span>
            </div>

            {/* LOGO 40% MÁS GRANDE */}
            <img
              src="/logo-udaondo.png"
              alt="Complejo Museográfico Enrique Udaondo"
              className="h-14 sm:h-20 landscape:h-11 w-auto object-contain drop-shadow-md shrink-0"
            />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col w-full">
        <AnimatePresence mode="wait">

          {/* ========== VIEW: INICIO ========== */}
          {activeTab === 'inicio' && !showQuick && (
            <motion.div
              key="inicio"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col"
            >
              {/* HERO BANNER */}
              <div className="w-full relative overflow-hidden h-[50vh] sm:h-[55vh] md:h-[60vh] bg-slate-950">
                <img
                  src={placeholderImg}
                  alt="Complejo Museográfico Enrique Udaondo"
                  className="w-full h-full object-cover object-center brightness-90 contrast-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

                <div className="absolute inset-x-0 top-0 flex flex-col justify-start items-center text-center p-4 sm:p-6 pt-2 sm:pt-6 max-w-xl mx-auto w-full z-10">
                  <div className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-white text-[9px] sm:text-xs font-sans font-bold uppercase tracking-wider text-center mb-2">
                    Bienvenidos • Parada 0
                  </div>
                  <h2 className="text-white font-display font-bold text-lg sm:text-3xl tracking-tight leading-tight uppercase text-center [text-shadow:0_2px_14px_rgba(0,0,0,0.85),0_1px_4px_rgba(0,0,0,0.8)]">
                    Bienvenidos.
                  </h2>
                  <p className="text-white text-[9px] sm:text-xs font-medium leading-snug font-sans text-center px-6 mt-1 max-w-md [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                    {firstStop?.subtitle}
                  </p>
                </div>
              </div>

              {/* FLOATING CARD with player */}
              <div className="max-w-xl mx-auto w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-full -mt-5 sm:-mt-16 relative z-10 bg-white rounded-2xl border border-slate-100 p-1 pb-1.5 sm:p-6 shadow-md flex flex-col pt-10 sm:pt-12 gap-1 sm:gap-5">
                <div className="absolute top-0 inset-x-0 -translate-y-1/2 z-20 px-2 sm:px-4">
                  <AudioPlayerControl
                    isPlaying={playingStopId === firstStop?.id && isPlaying}
                    onClick={() => {
                      if (firstStop) playTTS(firstStop.id, firstStop.locucion || firstStop.text);
                    }}
                    onPrev={handleHomePrev}
                    onNext={handleHomeNext}
                  />
                </div>

                {/* Botones: Vía Rápida + Mapa del Complejo */}
                <div className="grid grid-cols-2 gap-1 w-full px-1 -mt-1">
                  <button
                    onClick={handleOpenQuick}
                    className="inline-flex items-center justify-center gap-1.5 px-1 py-1 sm:py-3 bg-[#0092e0] text-white hover:bg-[#0081c7] active:scale-95 rounded-xl transition-all duration-200 cursor-pointer shadow-md font-sans font-black uppercase tracking-tighter text-[9px] sm:text-xs w-full"
                    title="Recorrido Vía Rápida"
                  >
                    <FastForward className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                    Vía Rápida
                  </button>
                  <button
                    onClick={handleOpenMap}
                    className="inline-flex items-center justify-center gap-1.5 px-1 py-1 sm:py-3 bg-white text-[#0092e0] hover:bg-sky-50 active:scale-95 rounded-xl transition-all duration-200 cursor-pointer shadow-sm border-2 border-[#0092e0]/30 font-sans font-black uppercase tracking-tighter text-[9px] sm:text-xs w-full"
                    title="Ver el mapa del Complejo"
                  >
                    <Map className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                    Mapa
                  </button>
                </div>
              </div>

              {/* TIMELINE Bienvenida */}
              <div className="w-full max-w-xl mx-auto px-1 pt-4">
                <div className="relative w-full flex items-start justify-between gap-1">
                  <div className="absolute left-[16.6%] right-[16.6%] h-0.5 bg-slate-200 top-1.5 sm:top-2 -translate-y-1/2 z-0" />

                  <div className="flex flex-col items-center text-center z-10 flex-1 min-w-0 px-4 sm:px-6">
                    <button
                      onClick={handleHomePrev}
                      className="group flex flex-col items-center focus:outline-none cursor-pointer w-full"
                      title="Ir a Museo de Transportes"
                    >
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-slate-300 bg-white group-hover:border-[#0092e0] group-hover:bg-[#0092e0] transition-colors flex-shrink-0" />
                      <p className="text-[8px] sm:text-[10px] font-sans font-black text-slate-500 group-hover:text-[#0092e0] transition-colors leading-tight uppercase tracking-tight mt-0.5 line-clamp-3">
                        Museo de Transportes
                      </p>
                    </button>
                  </div>

                  <div className="flex items-start justify-center z-10 w-10 sm:w-14 pt-0.5">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0092e0]/50 animate-ping" />
                      <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#0092e0] border-2 border-sky-200 shadow-sm" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center z-10 flex-1 min-w-0 px-4 sm:px-6">
                    <button
                      onClick={handleHomeNext}
                      className="group flex flex-col items-center focus:outline-none cursor-pointer w-full"
                      title="Ir a Museo Histórico y Colonial"
                    >
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-slate-300 bg-white group-hover:border-[#0092e0] group-hover:bg-[#0092e0] transition-colors flex-shrink-0" />
                      <p className="text-[8px] sm:text-[10px] font-sans font-black text-slate-500 group-hover:text-[#0092e0] transition-colors leading-tight uppercase tracking-tight mt-0.5 line-clamp-3">
                        Museo Histórico y Colonial
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 MUSEUM CARDS */}
              <div className="max-w-xl mx-auto w-full px-4 py-6 space-y-4">
                <div>
                  <h3 className="font-display font-black text-sm text-[#0092e0] tracking-[-0.04em] leading-none mb-1 uppercase">
                    Explorá el Complejo
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Elegí un museo o espacio para comenzar tu recorrido.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {MUSEUM_AREAS.map(museum => {
                    const stopCount = ALL_TOUR_STOPS.filter(s => s.museum === museum.id).length;
                    const iconImg = MUSEUM_ICON_IMAGES[museum.id];
                    return (
                      <div
                        key={museum.id}
                        onClick={() => handleSelectMuseum(museum.id)}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative cursor-pointer"
                      >
                        <div className="w-full h-40 relative bg-slate-950">
                          <img
                            src={museum.image}
                            alt={museum.title}
                            onError={(e) => { if (e.currentTarget.src !== placeholderImg) e.currentTarget.src = placeholderImg; }}
                            className="w-full h-full object-cover object-center brightness-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                          <div className="absolute top-4 left-4 right-4">
                            <span className="text-[10px] font-sans font-black text-white uppercase tracking-widest leading-none block mb-1 [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
                              {museum.shortTitle} • {stopCount} {stopCount === 1 ? 'parada' : 'paradas'}
                            </span>
                            <h4 className="font-display font-black text-base text-white tracking-[-0.03em] leading-tight uppercase [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
                              {museum.title}
                            </h4>
                          </div>
                        </div>

                        {/* Ícono central grande */}
                        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-[#0092e0] p-0.5 overflow-hidden">
                            {iconImg ? (
                              <img
                                src={iconImg}
                                alt={museum.title}
                                className="w-full h-full object-contain scale-105"
                              />
                            ) : (
                              <div className="text-[#0092e0]">
                                {MUSEUM_ICONS[museum.id]}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-2 pt-10 bg-white">
                          <p className="font-bold text-slate-600 text-xs font-sans leading-relaxed text-center px-1">
                            {museum.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== VIEW: VÍA RÁPIDA ========== */}
          {showQuick && (
            <motion.div
              key="via-rapida"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col max-w-xl mx-auto"
            >
              <div className="px-4 pt-5 pb-3 flex items-center justify-between border-b border-slate-200">
                <div>
                  <h2 className="font-display font-black tracking-[-0.04em] text-lg text-slate-700 leading-none uppercase">
                    Vía Rápida
                  </h2>
                  <p className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider mt-1">
                    {quickStops.length} paradas esenciales del Complejo
                  </p>
                </div>
                <button
                  onClick={() => { stopAudio(); setShowQuick(false); }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-sans font-bold text-[10px] uppercase tracking-wider cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2.75} />
                  Salir
                </button>
              </div>

              {activeQuickStop && (
                <div className="px-4 pt-5">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-md relative pt-10 sm:pt-12 px-1 pb-3 flex flex-col gap-3">
                    <div className="absolute top-0 inset-x-0 -translate-y-1/2 z-20 px-2 sm:px-4">
                      <AudioPlayerControl
                        isPlaying={playingStopId === activeQuickStop.id && isPlaying}
                        onClick={() => playTTS(activeQuickStop.id, activeQuickStop.locucion || activeQuickStop.text)}
                        onPrev={handleQuickPrev}
                        onNext={handleQuickNext}
                      />
                    </div>
                    <div className="px-3 text-center">
                      <span className="text-[9px] font-sans font-black text-[#0092e0] uppercase tracking-widest">
                        Parada {activeQuickStop.stopNumber}
                      </span>
                      <h3 className="font-display font-black text-sm sm:text-base text-slate-800 leading-tight mt-0.5">
                        {activeQuickStop.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-sans mt-1 line-clamp-2">
                        {activeQuickStop.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="px-4 pt-5 pb-8 space-y-3">
                {quickStops.map((stop, i) => {
                  const isActive = activeQuickStop?.id === stop.id;
                  return (
                    <button
                      key={stop.id}
                      onClick={() => { setQuickStopId(stop.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-full text-left px-4 py-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0092e0]/5 border-[#0092e0]/40 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-[#0092e0]/40 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans font-black text-xs flex-shrink-0 transition-colors ${
                        isActive ? 'bg-[#0092e0] text-white' : 'bg-[#0092e0]/10 text-[#0092e0]'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className={`font-display font-black text-sm leading-tight truncate ${isActive ? 'text-[#0092e0]' : 'text-slate-700'}`}>
                          {stop.title}
                        </h4>
                        <p className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                          N° {stop.stopNumber} • {stop.museum}
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#0092e0]' : 'text-slate-300'}`} strokeWidth={2.5} />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ========== VIEW: MUSEUM ========== */}
          {activeTab !== 'inicio' && activeMuseum && !showQuick && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col"
            >

              {/* BANNER COMPACTO del museo */}
              <div className="w-full relative overflow-hidden h-40 sm:h-52 md:h-64 bg-slate-950">
                <img
                  src={activeMuseum.image}
                  alt={activeMuseum.title}
                  onError={(e) => { if (e.currentTarget.src !== placeholderImg) e.currentTarget.src = placeholderImg; }}
                  className="w-full h-full object-cover object-center brightness-90 contrast-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end items-center text-center p-3 sm:p-5 max-w-xl mx-auto w-full z-10">
                  <span className="text-[8px] sm:text-[9.5px] font-sans font-bold text-sky-200 uppercase tracking-wider mb-0.5 [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
                    {activeMuseum.hasTour ? 'Recorrido con salas' : 'Espacios del Complejo'} •{' '}
                    {ALL_TOUR_STOPS.filter(s => s.museum === activeMuseum.id).length} paradas
                  </span>
                  <h2 className="text-white font-display font-bold text-sm sm:text-2xl tracking-tight leading-tight uppercase text-center [text-shadow:0_2px_14px_rgba(0,0,0,0.85),0_1px_4px_rgba(0,0,0,0.8)]">
                    {activeMuseum.title}
                  </h2>
                  <p className="text-white text-[8px] sm:text-xs font-medium leading-snug font-sans text-center px-4 mt-0.5 max-w-md [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                    {activeMuseum.description}
                  </p>
                </div>
              </div>

              {/* HINT */}
              <div className="flex items-center justify-center gap-1 pt-3 text-[#0092e0]">
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" strokeWidth={2.5} />
                <span className="text-[8px] font-sans font-bold uppercase tracking-wider">
                  Tocá una sala para explorarla
                </span>
              </div>

              <div className="max-w-xl mx-auto w-full px-3.5 py-4 space-y-4">

                {/* SI EL MUSEO TIENE 1 SOLA SALA (EJ. MUSEO DEL AUTOMÓVIL): MUESTRA DIRECTO EL CABEZAL DE SALA Y TODAS LAS PARADAS */}
                {activeMuseum.salas.length === 1 ? (
                  (() => {
                    const sala = activeMuseum.salas[0];
                    const salaStops = sala.stopIds
                      .map(id => ALL_TOUR_STOPS.find(s => s.id === id))
                      .filter((s): s is TourStop => !!s);
                    const salaIconSrc = SALA_ICON_IMAGES[sala.id] || MUSEUM_ICON_IMAGES[activeMuseum.id];

                    return (
                      <div className="space-y-4">
                        {/* BOTÓN SUPERIOR VOLVER AL INICIO */}
                        <div className="flex items-center justify-between">
                          <button
                            onClick={handleGoInicio}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-sans font-bold text-[10px] uppercase tracking-wider cursor-pointer transition-colors shadow-2xs"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.75} />
                            Volver al Inicio
                          </button>
                          <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                            {salaStops.length} paradas
                          </span>
                        </div>

                        {/* CABEZAL DE LA SALA */}
                        <div className="bg-[#0092e0] rounded-2xl border border-[#0081c7] px-3.5 py-2.5 flex items-center gap-3 text-white shadow-sm">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-white bg-white shadow-sm flex items-center justify-center flex-shrink-0 p-0">
                            {salaIconSrc ? (
                              <img src={salaIconSrc} alt={sala.title} className="w-full h-full object-contain scale-105" />
                            ) : (
                              <div className="text-[#0092e0]">{MUSEUM_ICONS[activeMuseum.id]}</div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[7.5px] font-sans font-bold text-sky-100 uppercase tracking-[0.2em] block leading-none mb-0.5">
                              Sala
                            </span>
                            <h3 className="font-sans font-bold text-xs sm:text-sm text-white tracking-tight leading-snug">
                              {sala.title}
                            </h3>
                          </div>
                        </div>

                        {/* LISTA DE PARADAS ABIERTAS */}
                        <div className="space-y-3">
                          {salaStops.map(stop => (
                            <div
                              key={stop.id}
                              className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm cursor-pointer active:scale-[0.99] transition-transform bg-white"
                              onClick={() => setExpandedStopId(stop.id)}
                            >
                              {/* FOTO ABIERTA DE LA PARADA */}
                              <div className="w-full h-28 sm:h-36 relative bg-slate-950">
                                <img
                                  src={stop.image}
                                  alt={stop.title}
                                  onError={(e) => { if (e.currentTarget.src !== placeholderImg) e.currentTarget.src = placeholderImg; }}
                                  className="w-full h-full object-cover object-center brightness-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                                <span className="absolute top-2 left-3 bg-slate-950/70 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-[8px] font-sans font-bold uppercase tracking-wider">
                                  Parada {stop.stopNumber}
                                </span>
                              </div>
                              {/* PIE DE LA PARADA CON TÍTULO CENTRADO */}
                              <div className="px-3.5 py-2.5 flex items-center justify-between gap-2.5">
                                <div className="w-7 h-7 shrink-0" />
                                <div className="min-w-0 flex-1 text-center">
                                  <h4 className="font-sans font-bold text-xs sm:text-sm text-slate-800 leading-snug tracking-tight text-center">
                                    {stop.title}
                                  </h4>
                                </div>
                                <div className="w-7 h-7 rounded-full bg-[#0092e0]/10 text-[#0092e0] flex items-center justify-center shrink-0 hover:bg-[#0092e0] hover:text-white transition-colors">
                                  <Play className="w-3 h-3 fill-current ml-0.5" strokeWidth={2.5} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* BOTÓN AL FINAL DEL RECORRIDO PARA VOLVER */}
                        <div className="pt-4 pb-8">
                          <button
                            onClick={handleGoInicio}
                            className="w-full py-3 px-6 rounded-xl bg-slate-700 hover:bg-slate-800 active:scale-95 text-white font-sans font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" strokeWidth={2.75} />
                            Volver al Inicio
                          </button>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  /* SI EL MUSEO TIENE MÚLTIPLES SALAS (HISTÓRICO, TRANSPORTES): MUESTRA ÍNDICE DE SALAS */
                  <>
                    {/* BOTÓN SUPERIOR VOLVER AL INICIO */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleGoInicio}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-sans font-bold text-[10px] uppercase tracking-wider cursor-pointer transition-colors shadow-2xs"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.75} />
                        Volver al Inicio
                      </button>
                      <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                        {activeMuseum.salas.length} salas
                      </span>
                    </div>

                    {/* Fila especial: Introducción al museo */}
                    {(() => {
                      const introStop = ALL_TOUR_STOPS.find(s => s.id === activeMuseum.introStopId);
                      const introAbsorbidaEnSala = activeMuseum.salas.some(s => s.introStopId === activeMuseum.introStopId);
                      if (!introStop || introAbsorbidaEnSala) return null;
                      return (
                        <div key={`intro-${introStop.id}`} className="rounded-2xl border border-[#0081c7] overflow-hidden shadow-sm cursor-pointer" onClick={() => setExpandedStopId(introStop.id)}>
                          <div className="w-full h-28 sm:h-36 relative bg-slate-950">
                            <img
                              src={introStop.image}
                              alt={introStop.title}
                              onError={(e) => { if (e.currentTarget.src !== placeholderImg) e.currentTarget.src = placeholderImg; }}
                              className="w-full h-full object-cover object-center brightness-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
                            <div className="absolute inset-0 bg-[#0092e0]/30 pointer-events-none" />
                          </div>
                          <div className="bg-[#0092e0] px-3 py-2 flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white bg-white flex items-center justify-center flex-shrink-0 p-0">
                              <img src={MUSEUM_ICON_IMAGES[activeMuseum.id]} alt={introStop.title} className="w-full h-full object-contain scale-105" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[7px] font-sans font-bold text-sky-100 uppercase tracking-widest block leading-none mb-0.5">Comenzar acá</span>
                              <h4 className="font-sans font-bold text-xs sm:text-sm text-white leading-snug tracking-tight">{introStop.title}</h4>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white text-[#0092e0] flex items-center justify-center shrink-0 shadow-sm">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" strokeWidth={2.5} />
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Cards de salas — NIVEL 2: foto abierta + header celeste */}
                    {activeMuseum.salas.map(sala => {
                      const salaStops = sala.stopIds
                        .map(id => ALL_TOUR_STOPS.find(s => s.id === id))
                        .filter((s): s is TourStop => !!s);
                      const visibleCount = salaStops.length;
                      const salaIconSrc = SALA_ICON_IMAGES[sala.id] || MUSEUM_ICON_IMAGES[activeMuseum.id];
                      const salaImg = getSalaImage(sala, activeMuseum);

                      return (
                        <div
                          key={sala.id}
                          className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
                          onClick={() => handleSelectSala(sala.id)}
                        >
                          {/* FOTO ABIERTA DE LA SALA */}
                          <div className="w-full h-28 sm:h-36 relative bg-slate-950">
                            <img
                              src={salaImg}
                              alt={sala.title}
                              onError={(e) => { if (e.currentTarget.src !== placeholderImg) e.currentTarget.src = placeholderImg; }}
                              className="w-full h-full object-cover object-center brightness-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                          </div>
                          {/* HEADER CELESTE DE LA SALA */}
                          <div className="bg-[#0092e0] border-t border-[#0081c7] px-3 py-2 flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-white bg-white flex items-center justify-center flex-shrink-0 p-0">
                              {salaIconSrc ? (
                                <img src={salaIconSrc} alt={sala.title} className="w-full h-full object-contain scale-105" />
                              ) : (
                                <div className="text-[#0092e0]">{MUSEUM_ICONS[activeMuseum.id]}</div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[7px] font-sans font-bold text-sky-100 uppercase tracking-[0.2em] block leading-none mb-0.5">Sala</span>
                              <h3 className="font-sans font-bold text-xs sm:text-sm text-white tracking-tight leading-snug">{sala.title}</h3>
                            </div>
                            <span className="text-[9px] font-sans font-bold text-white/80 uppercase tracking-wider shrink-0">
                              {visibleCount} {visibleCount === 1 ? 'parada' : 'paradas'}
                            </span>
                            <ChevronRight className="w-4 h-4 text-white/70 shrink-0" strokeWidth={2.5} />
                          </div>
                        </div>
                      );
                    })}

                    {/* BOTÓN AL FINAL DEL LISTADO DE SALAS */}
                    <div className="pt-4 pb-8">
                      <button
                        onClick={handleGoInicio}
                        className="w-full py-3 px-6 rounded-xl bg-slate-700 hover:bg-slate-800 active:scale-95 text-white font-sans font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" strokeWidth={2.75} />
                        Volver al Inicio
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* NIVEL 3 — VISTA SALA: fotos de paradas abiertas */}
              <AnimatePresence>
                {activeSala && !expandedStopId && (() => {
                  const salaIconSrc = SALA_ICON_IMAGES[activeSala.id] || MUSEUM_ICON_IMAGES[activeMuseum.id];
                  return (
                    <motion.div
                      key={`sala-view-${activeSala.id}`}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.2 }}
                      className="fixed top-16 sm:top-22 landscape:top-14 bottom-16 landscape:bottom-10 inset-x-0 z-30 bg-slate-50 flex flex-col overflow-y-auto"
                    >
                      {/* CABEZAL DE LA SALA CON BOTÓN DE REGRESO CLARO */}
                      <div className="w-full bg-[#0092e0] text-white px-3 py-2.5 border-b border-[#0081c7] flex items-center gap-3 shrink-0 shadow-sm">
                        <button
                          onClick={handleBackToSalas}
                          className="inline-flex items-center gap-1 py-1 px-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-sans font-bold text-[10px] uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
                          title="Volver a las salas"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.75} />
                          Salas
                        </button>
                        <div className="w-8 h-8 rounded-xl overflow-hidden border-2 border-white bg-white flex items-center justify-center shrink-0 p-0">
                          {salaIconSrc ? (
                            <img src={salaIconSrc} alt={activeSala.title} className="w-full h-full object-contain scale-105" />
                          ) : (
                            <div className="text-[#0092e0]">{MUSEUM_ICONS[activeMuseum.id]}</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[7px] font-sans font-bold text-sky-100 uppercase tracking-[0.2em] block leading-none mb-0.5">Sala</span>
                          <h2 className="font-sans font-bold text-xs sm:text-sm text-white tracking-tight leading-snug">{activeSala.title}</h2>
                        </div>
                      </div>

                      {/* CARDS DE PARADAS — NIVEL 3: foto abierta de cada parada */}
                      <div className="max-w-xl mx-auto w-full px-3.5 py-4 space-y-3">
                        {activeSalaStops.map(stop => (
                          <div
                            key={stop.id}
                            className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm cursor-pointer active:scale-[0.99] transition-transform bg-white"
                            onClick={() => setExpandedStopId(stop.id)}
                          >
                            {/* FOTO ABIERTA DE LA PARADA */}
                            <div className="w-full h-28 sm:h-36 relative bg-slate-950">
                              <img
                                src={stop.image}
                                alt={stop.title}
                                onError={(e) => { if (e.currentTarget.src !== placeholderImg) e.currentTarget.src = placeholderImg; }}
                                className="w-full h-full object-cover object-center brightness-90"
                              />
                              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                              <span className="absolute top-2 left-3 bg-slate-950/70 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-[8px] font-sans font-bold uppercase tracking-wider">
                                Parada {stop.stopNumber}
                              </span>
                            </div>
                            {/* PIE DE LA PARADA CON TÍTULO CENTRADO */}
                            <div className="px-3.5 py-2.5 flex items-center justify-between gap-2.5">
                              <div className="w-7 h-7 shrink-0" />
                              <div className="min-w-0 flex-1 text-center">
                                <h4 className="font-sans font-bold text-xs sm:text-sm text-slate-800 leading-snug tracking-tight text-center">
                                  {stop.title}
                                </h4>
                              </div>
                              <div className="w-7 h-7 rounded-full bg-[#0092e0]/10 text-[#0092e0] flex items-center justify-center shrink-0 hover:bg-[#0092e0] hover:text-white transition-colors">
                                <Play className="w-3 h-3 fill-current ml-0.5" strokeWidth={2.5} />
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* BOTÓN AL FINAL DE LA SALA PARA VOLVER AL LISTADO DE SALAS */}
                        <div className="pt-4 pb-8">
                          <button
                            onClick={handleBackToSalas}
                            className="w-full py-3 px-6 rounded-xl bg-slate-700 hover:bg-slate-800 active:scale-95 text-white font-sans font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" strokeWidth={2.75} />
                            Volver a Salas de {activeMuseum.shortTitle}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

              {/* FICHA INDIVIDUAL DE PARADA (VISIÓN SINGLE - sin scroll, fija entre encabezado y footer) */}
              <AnimatePresence>
                {expandedStopId && (() => {
                  const selectedStop = ALL_TOUR_STOPS.find(s => s.id === expandedStopId);
                  if (!selectedStop) return null;
                  const isPlayingHere = playingStopId === selectedStop.id && isPlaying;

                  // Orden numérico de paradas dentro del museo
                  const curIdx = museumStops.findIndex(s => s.id === selectedStop.id);
                  const prevStop = curIdx > 0 ? museumStops[curIdx - 1] : null;
                  const nextStop = curIdx >= 0 && curIdx < museumStops.length - 1 ? museumStops[curIdx + 1] : null;

                  return (
                    <motion.div
                      key={selectedStop.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="fixed top-16 sm:top-22 landscape:top-14 bottom-16 landscape:bottom-10 inset-x-0 z-40 bg-slate-50 flex flex-col justify-between overflow-hidden"
                    >
                      {/* HERO BANNER A PANTALLA COMPLETA HASTA EL CABEZAL */}
                      <div className="w-full relative overflow-hidden h-[45vh] sm:h-[50vh] bg-slate-950 shrink-0">
                        <img
                          src={selectedStop.image}
                          alt={selectedStop.title}
                          onError={(e) => { if (e.currentTarget.src !== placeholderImg) e.currentTarget.src = placeholderImg; }}
                          className="w-full h-full object-cover object-center brightness-90 contrast-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

                        {/* BOTÓN X FLOTANTE */}
                        <button
                          onClick={() => setExpandedStopId(null)}
                          className="absolute top-2.5 right-3 z-20 w-8 h-8 rounded-full bg-black/40 text-white backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                          title="Cerrar"
                        >
                          <X className="w-4 h-4" strokeWidth={2.75} />
                        </button>

                        {/* TEXTOS CENTRADOS SOBRE LA IMAGEN (IDEM BIENVENIDA) */}
                        <div className="absolute inset-x-0 top-0 flex flex-col justify-start items-center text-center p-3 sm:p-5 pt-2 sm:pt-4 max-w-xl mx-auto w-full z-10">
                          <div className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-0.5 rounded-full text-white text-[8px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-center mb-1">
                            Parada {selectedStop.stopNumber} • {activeMuseum.shortTitle}
                          </div>
                          <h2 className="text-white font-display font-bold text-sm sm:text-2xl tracking-tight leading-tight uppercase text-center [text-shadow:0_2px_14px_rgba(0,0,0,0.85),0_1px_4px_rgba(0,0,0,0.8)]">
                            {selectedStop.title}
                          </h2>
                          {selectedStop.subtitle && (
                            <p className="text-white text-[8.5px] sm:text-xs font-medium leading-snug font-sans text-center px-4 mt-0.5 max-w-md [text-shadow:0_1px_10px_rgba(0,0,0,0.85)]">
                              {selectedStop.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* FLOATING CARD CON REPRODUCTOR (FUERA DE LA IMAGEN) */}
                      <div className="max-w-xl mx-auto w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-full -mt-5 sm:-mt-8 relative z-10 bg-white rounded-2xl border border-slate-100 p-1 pb-1.5 sm:p-4 shadow-md flex flex-col pt-8 sm:pt-10">
                        <div className="absolute top-0 inset-x-0 -translate-y-1/2 z-20 px-2 sm:px-4">
                          <AudioPlayerControl
                            isPlaying={isPlayingHere}
                            onClick={() => playTTS(selectedStop.id, selectedStop.locucion || selectedStop.text)}
                            onPrev={prevStop ? () => setExpandedStopId(prevStop.id) : () => setExpandedStopId(null)}
                            onNext={nextStop ? () => setExpandedStopId(nextStop.id) : undefined}
                          />
                        </div>
                      </div>

                      {/* ESQUEMA / TIMELINE DE PARADAS (IDEM BIENVENIDA) */}
                      <div className="w-full max-w-xl mx-auto px-2 pt-2 pb-3">
                        <div className="relative w-full flex items-start justify-between gap-1">
                          <div className="absolute left-[16.6%] right-[16.6%] h-0.5 bg-slate-200 top-1.5 sm:top-2 -translate-y-1/2 z-0" />

                          {/* ANTERIOR / VOLVER A SALA */}
                          <div className="flex flex-col items-center text-center z-10 flex-1 min-w-0 px-2 sm:px-4">
                            <button
                              onClick={prevStop ? () => setExpandedStopId(prevStop.id) : () => setExpandedStopId(null)}
                              className="group flex flex-col items-center focus:outline-none cursor-pointer w-full"
                              title={prevStop ? `Parada ${prevStop.stopNumber}: ${prevStop.title}` : 'Volver a la sala'}
                            >
                              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-slate-300 bg-white group-hover:border-[#0092e0] group-hover:bg-[#0092e0] transition-colors flex-shrink-0" />
                              <p className="text-[7.5px] sm:text-[9px] font-sans font-bold text-slate-500 group-hover:text-[#0092e0] transition-colors leading-tight uppercase tracking-tight mt-0.5 line-clamp-2 text-center">
                                {prevStop ? `Parada ${prevStop.stopNumber} • ${prevStop.title}` : 'Volver a Sala'}
                              </p>
                            </button>
                          </div>

                          {/* PUNTO DEL MEDIO TITILANDO SIN ACLARACIÓN (DONDE ESTÁS PARADO) */}
                          <div className="flex items-start justify-center z-10 w-10 sm:w-14 pt-0.5">
                            <div className="relative flex items-center justify-center">
                              <span className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0092e0]/50 animate-ping" />
                              <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#0092e0] border-2 border-sky-200 shadow-sm" />
                            </div>
                          </div>

                          {/* SIGUIENTE PARADA */}
                          <div className="flex flex-col items-center text-center z-10 flex-1 min-w-0 px-2 sm:px-4">
                            <button
                              onClick={nextStop ? () => setExpandedStopId(nextStop.id) : () => setExpandedStopId(null)}
                              className="group flex flex-col items-center focus:outline-none cursor-pointer w-full"
                              title={nextStop ? `Parada ${nextStop.stopNumber}: ${nextStop.title}` : 'Volver a la sala'}
                            >
                              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-slate-300 bg-white group-hover:border-[#0092e0] group-hover:bg-[#0092e0] transition-colors flex-shrink-0" />
                              <p className="text-[7.5px] sm:text-[9px] font-sans font-bold text-slate-500 group-hover:text-[#0092e0] transition-colors leading-tight uppercase tracking-tight mt-0.5 line-clamp-2 text-center">
                                {nextStop ? `Parada ${nextStop.stopNumber} • ${nextStop.title}` : 'Fin de Sala'}
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FLOATING PLAYER (cuando suena algo) */}
      <AnimatePresence>
        {playingStopId && isPlaying && (
          <div className="fixed bottom-20 inset-x-0 z-[60] flex justify-center md:justify-end md:pr-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="pointer-events-auto w-auto min-w-64 max-w-[92vw] md:w-80 bg-slate-900/95 backdrop-blur text-white p-3 rounded-2xl shadow-xl border border-slate-800 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-2 bg-[#0092e0] rounded-xl">
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-sans font-bold text-sky-400 uppercase tracking-widest truncate leading-none">
                  Reproduciendo
                </p>
                <p className="text-xs font-display font-black truncate text-white leading-tight mt-0.5">
                  {ALL_TOUR_STOPS.find(s => s.id === playingStopId)?.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (playingStopId) {
                    const stop = ALL_TOUR_STOPS.find(s => s.id === playingStopId);
                    if (stop) playTTS(playingStopId, stop.locucion || stop.text);
                  }
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <button onClick={stopAudio} className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer">
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER CELESTE */}
      <footer className="fixed bottom-0 left-0 right-0 h-16 landscape:h-10 bg-[#0092e0] border-t border-[#0081c7] flex justify-around items-center z-50 px-1 shadow-lg">
        <button
          onClick={handleGoInicio}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all gap-0.5 cursor-pointer ${
            activeTab === 'inicio' && !showQuick ? 'text-white' : 'text-white/70 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" strokeWidth={2.75} />
          <span className="text-[8px] font-sans font-extrabold tracking-tight">Inicio</span>
        </button>

        <button
          onClick={() => handleSelectMuseum('historico')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all gap-0.5 cursor-pointer ${
            activeTab === 'historico' ? 'text-white' : 'text-white/70 hover:text-white'
          }`}
        >
          <Landmark className="w-5 h-5" strokeWidth={2.75} />
          <span className="text-[8px] font-sans font-extrabold tracking-tight">Histórico</span>
        </button>

        <button
          onClick={() => handleSelectMuseum('transportes')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all gap-0.5 cursor-pointer ${
            activeTab === 'transportes' ? 'text-white' : 'text-white/70 hover:text-white'
          }`}
        >
          <Train className="w-5 h-5" strokeWidth={2.75} />
          <span className="text-[8px] font-sans font-extrabold tracking-tight">Transportes</span>
        </button>

        <button
          onClick={() => handleSelectMuseum('automovil')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all gap-0.5 cursor-pointer ${
            activeTab === 'automovil' ? 'text-white' : 'text-white/70 hover:text-white'
          }`}
        >
          <Car className="w-5 h-5" strokeWidth={2.75} />
          <span className="text-[8px] font-sans font-extrabold tracking-tight">Automóvil</span>
        </button>

        <button
          onClick={() => handleSelectMuseum('otros')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all gap-0.5 cursor-pointer ${
            activeTab === 'otros' ? 'text-white' : 'text-white/70 hover:text-white'
          }`}
        >
          <TreePine className="w-5 h-5" strokeWidth={2.75} />
          <span className="text-[8px] font-sans font-extrabold tracking-tight">Otros</span>
        </button>
      </footer>

      {/* MAPA GENERAL DEL COMPLEJO (pantalla completa) */}
      {showMap && (
        <MapaUdaondo onClose={() => setShowMap(false)} />
      )}

      </div>
    </>
  );
}
