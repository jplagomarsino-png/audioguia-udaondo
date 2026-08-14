import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Compass, 
  MapPin, 
  Sparkles, 
  Bookmark, 
  Map, 
  List, 
  ChevronRight,
  ChevronDown, 
  ChevronLeft, 
  Volume2, 
  X, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Lock,
  QrCode,
  CreditCard,
  Calendar,
  ShieldCheck,
  CheckCircle,
  DollarSign,
  Store,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BASILICA_TOUR_DATA, ALL_TOUR_STOPS, TourStop } from './data';
import basilicaImg from './assets/images/basilica_lujan_1782603179083.jpg';
import AudioPlayerControl from './components/AudioPlayerControl';
import PlanoInteractivo from './components/PlanoInteractivo';
import AdminPanel from './components/AdminPanel';

// --- CUSTOM SVG BASILICA SILHOUETTE LOGO ---
function BasilicaLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 500 500" 
      className={className}
      fill="currentColor"
    >
      {/* Symmetrical Left Tower */}
      {/* Left Tower Outer Step */}
      <rect x="90" y="380" width="15" height="100" />
      <rect x="105" y="330" width="15" height="150" />
      
      {/* Main Left Tower body */}
      <rect x="120" y="220" width="50" height="260" />
      <rect x="125" y="140" width="40" height="80" />
      
      {/* Left spire needle */}
      <path d="M 127 140 L 145 20 L 163 140 Z" />
      
      {/* Left cross with halo circle */}
      <circle cx="145" cy="14" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="145" y1="5" x2="145" y2="24" stroke="currentColor" strokeWidth="2.5" />
      <line x1="137" y1="14" x2="153" y2="14" stroke="currentColor" strokeWidth="2.5" />

      {/* Symmetrical Right Tower */}
      {/* Right Tower Outer Step */}
      <rect x="395" y="380" width="15" height="100" />
      <rect x="380" y="330" width="15" height="150" />
      
      {/* Main Right Tower body */}
      <rect x="330" y="220" width="50" height="260" />
      <rect x="335" y="140" width="40" height="80" />
      
      {/* Right spire needle */}
      <path d="M 337 140 L 355 20 L 373 140 Z" />
      
      {/* Right cross with halo circle */}
      <circle cx="355" cy="14" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="355" y1="5" x2="355" y2="24" stroke="currentColor" strokeWidth="2.5" />
      <line x1="347" y1="14" x2="363" y2="14" stroke="currentColor" strokeWidth="2.5" />

      {/* Connecting Center building */}
      <rect x="170" y="290" width="160" height="190" />
      {/* Central Spire */}
      <path d="M 242 290 L 250 220 L 258 290 Z" />
      <line x1="250" y1="210" x2="250" y2="222" stroke="currentColor" strokeWidth="2" />
      <line x1="246" y1="215" x2="254" y2="215" stroke="currentColor" strokeWidth="2" />

      {/* Center Semicircle Portal Arch with Radiating Spokes / Spokes wheel */}
      {/* Outer arch path */}
      <path d="M 175 480 A 75 75 0 0 1 325 480 Z" fill="#ffffff" />
      <path d="M 175 480 A 75 75 0 0 1 325 480" stroke="currentColor" strokeWidth="10" fill="none" />
      <path d="M 188 480 A 62 62 0 0 1 312 480" stroke="currentColor" strokeWidth="4" fill="none" />
      
      {/* Inner rose/portal spokes */}
      <circle cx="250" cy="480" r="10" fill="currentColor" />
      {/* Radiating lines (8 spokes) */}
      <line x1="250" y1="480" x2="187" y2="445" stroke="currentColor" strokeWidth="6" />
      <line x1="250" y1="480" x2="200" y2="415" stroke="currentColor" strokeWidth="6" />
      <line x1="250" y1="480" x2="225" y2="395" stroke="currentColor" strokeWidth="6" />
      <line x1="250" y1="480" x2="250" y2="385" stroke="currentColor" strokeWidth="6" />
      <line x1="250" y1="480" x2="275" y2="395" stroke="currentColor" strokeWidth="6" />
      <line x1="250" y1="480" x2="300" y2="415" stroke="currentColor" strokeWidth="6" />
      <line x1="250" y1="480" x2="313" y2="445" stroke="currentColor" strokeWidth="6" />

      {/* Decorative concentric arches in rose window portal */}
      <path d="M 205 480 A 45 45 0 0 1 295 480" stroke="currentColor" strokeWidth="4" fill="none" />

      {/* Bottom Ground Curved Swooshes */}
      <path d="M -10 460 Q 250 360 510 460 L 510 510 L -10 510 Z" fill="#ffffff" />
      <path d="M -10 460 Q 250 360 510 460" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M 20 495 Q 250 415 480 495" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// --- CUSTOM SVG MERCADO PAGO OVAL LOGO (EXACT COPY OF SECOND IMAGE) ---
function MercadoPagoLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 65" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background celestial blue rounded rectangle */}
      <rect width="100" height="65" rx="8" fill="#009ee3" />
      {/* Oval badge representing the logo outline */}
      <ellipse cx="50" cy="28" rx="22" ry="14" fill="#009ee3" stroke="#ffffff" strokeWidth="2.5" />
      
      {/* Handshake vector lines */}
      {/* Hand 1 */}
      <path 
        d="M 38 28 C 38 24, 43 21, 48 24 C 50 25, 52 25, 54 24 C 59 21, 64 24, 64 28" 
        stroke="#ffffff" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none" 
      />
      {/* Hand 2 bottom curves */}
      <path 
        d="M 38 28 C 36 30, 36 34, 41 36 C 45 38, 49 34, 50 32" 
        stroke="#ffffff" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none" 
      />
      <path 
        d="M 64 28 C 66 30, 66 34, 61 36 C 57 38, 53 34, 52 32" 
        stroke="#ffffff" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none" 
      />
      {/* Finger joint details */}
      <circle cx="43.5" cy="30" r="1.5" fill="#ffffff" />
      <circle cx="47.5" cy="32" r="1.5" fill="#ffffff" />
      <circle cx="51.5" cy="32" r="1.5" fill="#ffffff" />
      <circle cx="55.5" cy="30" r="1.5" fill="#ffffff" />

      {/* Typography "mercado pago" below */}
      <text x="50" y="52" fill="#ffffff" fontSize="8" fontFamily="sans-serif" fontWeight="900" textAnchor="middle" letterSpacing="0.2">
        mercado
      </text>
      <text x="50" y="59" fill="#ffffff" fontSize="8" fontFamily="sans-serif" fontWeight="900" textAnchor="middle" letterSpacing="0.2">
        pago
      </text>
    </svg>
  );
}

// --- PARTNER MERCHANTS DICTIONARY ---
const COMERCIOS: Record<string, string> = {
  santeria_basilica: "Santería de la Basílica",
  cafe_plaza: "Café de la Plaza",
  hotel_lujan: "Hotel Luján Real",
  regalos_virgencita: "Regalos de la Virgencita",
  guias_locales: "Guías de Turismo de Luján",
  puesto_central: "Puesto de Informes Central"
};

export default function App() {
  // --- SESSION & QR ACCESS STATE ---
  const [currentPass, setCurrentPass] = useState<{
    token: string;
    paidAt: number;
    expiresAt: number;
    merchant: string | null;
  } | null>(() => {
    try {
      const stored = localStorage.getItem('audioguia_lujan_pass');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.expiresAt > Date.now()) {
          return parsed;
        } else {
          localStorage.removeItem('audioguia_lujan_pass');
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [activeMerchantId, setActiveMerchantId] = useState<string | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const mId = params.get('comercio') || params.get('qr');
        if (mId && COMERCIOS[mId]) {
          localStorage.setItem('audioguia_referred_merchant', mId);
          return mId;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return localStorage.getItem('audioguia_referred_merchant') || null;
  });

  // Simulated Sales ledger for statistics (showing sales credited to each commerce)
  const [salesLedger, setSalesLedger] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('audioguia_sales_ledger');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  // UI state for simulated payment
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<string>('');
  const [showSimPanel, setShowSimPanel] = useState<boolean>(true);
  const [showPlano, setShowPlano] = useState<boolean>(false);

  // Helper to open the interactive plano
  const handleOpenPlano = () => {
    stopAudio();
    setShowPlano(true);
  };

  // Navigate from plano to a stop
  const handlePlanoNavigate = (stopId: string) => {
    setShowPlano(false);
    setActiveTab('recorrido');
    setViewMode('lista');
    handleJumpToStop(stopId, false);
  };

  // Navigate from plano footer tabs
  const handlePlanoTabNavigate = (tab: string) => {
    setShowPlano(false);
    stopAudio();
    setActiveTab(tab as any);
    if (tab !== 'inicio' && tab !== 'recorrido') {
      const firstStop = ALL_TOUR_STOPS.find(s => s.section === tab);
      if (firstStop) setSelectedStopId(firstStop.id);
    }
  };

  // Helper to complete simulated payment (SOLO DESARROLLO - se usa cuando API_BASE está vacía)
  const handleCompletePayment = (merchantId: string | null) => {
    const now = Date.now();
    const expires = now + 24 * 60 * 60 * 1000; // 24 hours pass
    const newPass = {
      token: "valid_pass_token_" + Math.random().toString(36).substring(2),
      paidAt: now,
      expiresAt: expires,
      merchant: merchantId
    };
    
    localStorage.setItem('audioguia_lujan_pass', JSON.stringify(newPass));
    setCurrentPass(newPass);

    if (merchantId) {
      const updatedLedger = {
        ...salesLedger,
        [merchantId]: (salesLedger[merchantId] || 0) + 1
      };
      localStorage.setItem('audioguia_sales_ledger', JSON.stringify(updatedLedger));
      setSalesLedger(updatedLedger);
    }
  };

  // ============================================================
  // MERCADO PAGO REAL (Checkout Pro via Firebase Functions)
  // ============================================================
  // Cambiar por la URL de tus functions desplegadas. Vacío = modo desarrollo (simulación)
  const API_BASE = 'https://audioguia-basilica.vercel.app/api';

  // Huella de dispositivo persistente
  const getDeviceId = (): string => {
    let id = localStorage.getItem('audioguia_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('audioguia_device_id', id);
    }
    return id;
  };

  // Iniciar pago real: crear preferencia y redirigir a Checkout Pro
  const handleRealPayment = async () => {
    if (!API_BASE) {
      // Modo desarrollo: se mantiene la simulación
      handleCompletePayment(activeMerchantId);
      return;
    }
    setIsProcessingPayment(true);
    setPaymentStep('Iniciando pago con Mercado Pago...');
    try {
      const deviceId = getDeviceId();
      const res = await fetch(`${API_BASE}/crearPreferencia?origin=${encodeURIComponent(window.location.origin)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, comercioId: activeMerchantId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPaymentStep(data.error || 'Error al iniciar el pago');
        setIsProcessingPayment(false);
        return;
      }
      // Redirigir a Checkout Pro
      window.location.href = data.initPoint;
    } catch (e: any) {
      console.error(e);
      setPaymentStep('Error de conexión. Reintentá.');
      setIsProcessingPayment(false);
    }
  };

  // Al volver de Mercado Pago con ?payment_id=... → confirmar y canjear pase
  useEffect(() => {
    if (!API_BASE) return;
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get('payment_id');
    const status = params.get('status');
    if (!paymentId) return;
    // Limpiar URL
    window.history.replaceState({}, document.title, window.location.pathname);
    if (status && status !== 'approved') {
      console.warn('Pago no aprobado:', status);
      return;
    }
    (async () => {
      try {
        const deviceId = getDeviceId();
        const res = await fetch(`${API_BASE}/confirmarPago`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId, deviceId }),
        });
        const data = await res.json();
        if (res.ok && data.token) {
          const newPass = {
            token: data.token,
            paidAt: Date.now(),
            expiresAt: data.expiresAt,
            merchant: activeMerchantId,
          };
          localStorage.setItem('audioguia_lujan_pass', JSON.stringify(newPass));
          setCurrentPass(newPass);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleSimulateExpiration = () => {
    if (currentPass) {
      const expiredPass = {
        ...currentPass,
        expiresAt: Date.now() - 1000
      };
      localStorage.setItem('audioguia_lujan_pass', JSON.stringify(expiredPass));
    } else {
      localStorage.removeItem('audioguia_lujan_pass');
    }
    setCurrentPass(null);
  };

  // ============================================================
  // IMÁGENES DE PARADAS (subidas desde el panel admin)
  // ============================================================
  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    const CACHE_KEY = 'audioguia_img_cache';
    const tryCache = () => {
      try {
        const c = localStorage.getItem(CACHE_KEY);
        if (c) {
          const parsed = JSON.parse(c);
          if (parsed && parsed.at && Date.now() - parsed.at < 24 * 60 * 60 * 1000) {
            setImageOverrides(parsed.data || {});
            return true;
          }
        }
      } catch { /* noop */ }
      return false;
    };
    if (tryCache()) return;
    fetch('https://audioguia-basilica.vercel.app/api/imagenesParadas')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === 'object' && !data.error) {
          setImageOverrides(data);
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })); } catch { /* noop */ }
        }
      })
      .catch(() => { /* sin red: quedan las locales */ });
  }, []);

  // URL efectiva de imagen de una parada (override admin o local)
  const imgFor = (stop: TourStop | undefined | null): string => {
    if (!stop) return basilicaImg;
    return imageOverrides[stop.id] || stop.image;
  };

  // ============================================================
  // SCROLL LOCK: bloqueado en single view, libre solo en inicio
  // ============================================================
  useEffect(() => {
    const isSingleView = !!activeStop && (activeTab !== 'recorrido' || viewMode === 'lista');
    document.body.style.overflow = isSingleView ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeStop, activeTab, viewMode]);

  const handleResetLedger = () => {
    localStorage.removeItem('audioguia_sales_ledger');
    setSalesLedger({});
  };

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'inicio' | 'recorrido' | 'arquitectura' | 'interior' | 'vitrales'>('inicio');
  const [viewMode, setViewMode] = useState<'lista' | 'mapa'>('lista');
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  
  // Audio Playback / TTS State
  const [playingStopId, setPlayingStopId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Active gallery indexes for the 1/3-screen inline slider of each stop
  const [activeGalleryIndexes, setActiveGalleryIndexes] = useState<Record<string, number>>({});

  // Immersive Gallery Modal State
  const [galleryModalState, setGalleryModalState] = useState<{
    isOpen: boolean;
    stopId: string | null;
    activeIndex: number;
  }>({
    isOpen: false,
    stopId: null,
    activeIndex: 0
  });

  // Automatically select the first stop of a section when entering a thematic tab
  useEffect(() => {
    if (activeTab !== 'inicio') {
      const stops = ALL_TOUR_STOPS.filter(stop => {
        if (activeTab === 'recorrido') return true;
        return stop.section === activeTab;
      });
      if (stops.length > 0) {
        const alreadyBelongs = stops.some(s => s.id === selectedStopId);
        if (!alreadyBelongs) {
          setSelectedStopId(stops[0].id);
        }
      }
    } else {
      setSelectedStopId(null);
    }
  }, [activeTab]);

  // Scroll to the very top whenever the active tab changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as any });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [activeTab]);

  // References for SpeechSynthesis and HTML Audio Playback
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize SpeechSynthesis on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopAudio();
    };
  }, []);

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

    // If clicking play on the already playing stop, toggle play/pause
    if (playingStopId === stopId) {
      if (isPlaying) {
        if (audioRef.current) {
          audioRef.current.pause();
        } else if (synthRef.current) {
          synthRef.current.pause();
        }
        setIsPlaying(false);
      } else {
        if (audioRef.current) {
          audioRef.current.play().catch((err) => {
            console.warn("Audio play failed, falling back to TTS:", err);
            playTTSFallback(stopId, text);
          });
        } else if (synthRef.current) {
          synthRef.current.resume();
        }
        setIsPlaying(true);
      }
      return;
    }

    // Stop any currently playing audio and start new
    stopAudio();
    
    setPlayingStopId(stopId);
    setIsPlaying(true);

    // Try playing real audio first (assuming placed in public folder as /filename.mp3)
    const audioUrl = `/${audioFilename}`;
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.play()
      .then(() => {
        audio.onended = () => {
          advanceAfterAudioEnd();
        };
      })
      .catch((err) => {
        console.warn(`Could not play MP3 file at ${audioUrl}, using TTS fallback instead. Error:`, err);
        audioRef.current = null;
        playTTSFallback(stopId, text);
      });
  };

  const playTTSFallback = (stopId: string, text: string) => {
    if (!synthRef.current) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-AR';
    utterance.rate = 1.05;

    // Grab a Spanish voice if available
    const voices = synthRef.current.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es-'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onend = () => {
      advanceAfterAudioEnd();
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      stopAudio();
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  // --- DERIVED DATA ---
  // The complete list of sequential stops for the full tour
  const fullStopsList = useMemo(() => {
    const mainCat = BASILICA_TOUR_DATA.find(cat => cat.id === 'recorrido');
    return mainCat ? mainCat.stops : [];
  }, []);

  // First stop of the tour (used as default)
  const firstStop = useMemo(() => {
    return fullStopsList[0];
  }, [fullStopsList]);

  // Get active stops based on the active tab
  const activeStops = useMemo(() => {
    if (activeTab === 'inicio') return [];
    if (activeTab === 'recorrido') return fullStopsList;
    
    // Filter stops based on lowercase section mapping
    return ALL_TOUR_STOPS.filter(stop => stop.section === activeTab);
  }, [activeTab, fullStopsList]);

  // Current stop index, previous stop, and next stop relative to the current active stops list
  const currentStopIndex = useMemo(() => {
    const stopsToUse = activeStops.length > 0 ? activeStops : fullStopsList;
    const activeId = selectedStopId || firstStop?.id;
    if (!activeId || stopsToUse.length === 0) return 0;
    const idx = stopsToUse.findIndex(s => s.id === activeId);
    return idx >= 0 ? idx : 0;
  }, [selectedStopId, firstStop, activeStops, fullStopsList]);

  const prevStop = useMemo(() => {
    const stopsToUse = activeStops.length > 0 ? activeStops : fullStopsList;
    const len = stopsToUse.length;
    if (len === 0) return null;
    const idx = (currentStopIndex - 1 + len) % len;
    return stopsToUse[idx];
  }, [currentStopIndex, activeStops, fullStopsList]);

  const nextStop = useMemo(() => {
    const stopsToUse = activeStops.length > 0 ? activeStops : fullStopsList;
    const len = stopsToUse.length;
    if (len === 0) return null;
    const idx = (currentStopIndex + 1) % len;
    return stopsToUse[idx];
  }, [currentStopIndex, activeStops, fullStopsList]);

  // Find the currently active stop in this view
  const activeStop = useMemo(() => {
    if (selectedStopId) {
      const found = ALL_TOUR_STOPS.find(s => s.id === selectedStopId);
      if (found) {
        // If we are in a specific thematic category, make sure the found stop belongs to it
        if (activeTab !== 'inicio' && activeTab !== 'recorrido') {
          if (found.section === activeTab) {
            return found;
          }
        } else {
          return found;
        }
      }
    }
    return activeStops[0] || firstStop || fullStopsList[0];
  }, [selectedStopId, activeTab, activeStops, firstStop, fullStopsList]);

  // Find the 1-based index of the activeStop in the full sequential list
  const activeStopIndex = useMemo(() => {
    if (!activeStop) return 0;
    const idx = fullStopsList.findIndex(s => s.id === activeStop.id);
    return idx >= 0 ? idx : 0;
  }, [activeStop, fullStopsList]);

  // Compute a dynamic label indicating stop numbering (e.g. "Parada 1/10 • arquitectura")
  const currentStopLabel = useMemo(() => {
    if (!activeStop) return '';
    if (activeTab === 'recorrido' || activeTab === 'inicio') {
      return `Parada ${activeStopIndex + 1}/${fullStopsList.length} • ${activeStop.section}`;
    } else {
      const idx = activeStops.findIndex(s => s.id === activeStop.id);
      const displayIdx = idx >= 0 ? idx + 1 : 1;
      return `Parada ${displayIdx}/${activeStops.length} • ${activeStop.section}`;
    }
  }, [activeStop, activeTab, activeStopIndex, fullStopsList.length, activeStops]);

  const isSingleView = useMemo(() => {
    return activeTab !== 'inicio' && (activeTab !== 'recorrido' || viewMode === 'lista') && !!activeStop;
  }, [activeTab, viewMode, activeStop]);

  const stopImages = useMemo(() => {
    if (!activeStop) return [];
    
    // Real gallery of the stop
    if (activeStop.gallery && activeStop.gallery.length > 0) {
      // If the gallery has only 1 image and its URL is identical to the main image,
      // it's considered "no gallery" to avoid duplicate rendering of the banner photo.
      const isDuplicateOfMain = activeStop.gallery.length === 1 && activeStop.gallery[0].url === activeStop.image;
      if (!isDuplicateOfMain) {
        return activeStop.gallery;
      }
    }
    
    return [];
  }, [activeStop]);

  // Handle selecting a thematic category
  const handleSelectCategory = (category: 'arquitectura' | 'interior' | 'vitrales') => {
    setActiveTab(category);
    stopAudio();
    const firstStopOfCat = ALL_TOUR_STOPS.find(s => s.section === category);
    if (firstStopOfCat) {
      setSelectedStopId(firstStopOfCat.id);
    }
  };

  // Jump to a specific stop and optionally play it
  const handleJumpToStop = (stopId: string, playImmediately = false) => {
    setSelectedStopId(stopId);
    scrollToStop(stopId);
    stopAudio();

    if (playImmediately) {
      const stop = ALL_TOUR_STOPS.find(s => s.id === stopId);
      if (stop) {
        playTTS(stop.id, stop.locucion || stop.text);
      }
    }
  };

  const scrollToStop = (stopId: string) => {
    setTimeout(() => {
      const element = document.getElementById(`stop-${stopId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  // --- NEXT & PREV FUNCTIONS FOR JOYSTICK ---
  const handleNextStop = () => {
    const stopsToUse = activeStops.length > 0 ? activeStops : fullStopsList;
    if (stopsToUse.length === 0) return;

    const activeId = selectedStopId || stopsToUse[0].id;
    const currentIndex = stopsToUse.findIndex(s => s.id === activeId);
    const nextIndex = (currentIndex + 1) % stopsToUse.length;
    const next = stopsToUse[nextIndex];
    if (next) {
      // Si estamos en inicio, saltar a la vista de recorrido
      if (activeTab === 'inicio') {
        setActiveTab('recorrido');
        setViewMode('lista');
      }
      handleJumpToStop(next.id, false);
    }
  };

  const handlePrevStop = () => {
    const stopsToUse = activeStops.length > 0 ? activeStops : fullStopsList;
    if (stopsToUse.length === 0) return;

    const activeId = selectedStopId || stopsToUse[0].id;
    const currentIndex = stopsToUse.findIndex(s => s.id === activeId);
    const prevIndex = (currentIndex - 1 + stopsToUse.length) % stopsToUse.length;
    const prev = stopsToUse[prevIndex];
    if (prev) {
      // Si estamos en inicio, saltar a la vista de recorrido
      if (activeTab === 'inicio') {
        setActiveTab('recorrido');
        setViewMode('lista');
      }
      handleJumpToStop(prev.id, false);
    }
  };

  // After an audio finishes, advance to the next stop in the current context
  // so its page loads and is ready to play (no autoplay on the last stop).
  const advanceAfterAudioEnd = () => {
    const stopsToUse = activeStops.length > 0 ? activeStops : fullStopsList;
    if (stopsToUse.length === 0) {
      stopAudio();
      return;
    }
    const activeId = selectedStopId || stopsToUse[0].id;
    const currentIndex = stopsToUse.findIndex(s => s.id === activeId);
    const nextIndex = currentIndex + 1;
    // Only advance if there IS a next stop; otherwise stop cleanly.
    if (nextIndex < stopsToUse.length && stopsToUse[nextIndex]) {
      handleJumpToStop(stopsToUse[nextIndex].id, false);
    } else {
      stopAudio();
    }
  };

  // ---------- MODO ADMIN (/#admin) ----------
  const isAdminView = typeof window !== 'undefined' && window.location.hash.includes('admin');
  if (isAdminView) {
    return <AdminPanel />;
  }

  if (!currentPass) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-[#0092e0]/20 selection:text-slate-900 pb-12 pt-6">
        <div className="max-w-md mx-auto w-full px-4 flex-grow flex flex-col justify-center">
          
          {/* LOGO & BRANDING */}
          <div className="flex items-center gap-4.5 mb-6 text-left max-w-sm mx-auto justify-center">
            <BasilicaLogo className="w-20 sm:w-24 h-20 sm:h-24 text-[#0092e0] shrink-0 filter drop-shadow-[0_4px_12px_rgba(0,146,224,0.12)]" />
            <div className="flex flex-col justify-center leading-[0.95] select-none">
              <span className="font-serif font-black tracking-[0.03em] text-[15px] sm:text-[17px] text-[#0092e0] uppercase">
                Basílica
              </span>
              <span className="font-serif font-black tracking-[0.03em] text-[15px] sm:text-[17px] text-[#0092e0] uppercase">
                Nuestra Señora
              </span>
              <span className="font-serif font-black tracking-[0.03em] text-[15px] sm:text-[17px] text-[#0092e0] uppercase">
                de Luján
              </span>
              <span className="font-sans font-bold tracking-[0.18em] text-[10px] sm:text-[11px] text-[#D4AF37] uppercase mt-2.5 pt-1.5 border-t border-slate-200">
                Audioguía Oficial
              </span>
            </div>
          </div>

          {/* PREVIEW CONTAINER (LOOKS LIKE A REAL TEMPLE APPLICATION BEHIND A LOCK) */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg mb-6 relative">
            
            {/* Real app preview mockup under a semi-blurred lock overlay */}
            <div className="p-4 opacity-50 select-none pointer-events-none">
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                <img src={basilicaImg} alt="Basílica de Luján" className="w-full h-full object-cover filter brightness-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="text-[9px] bg-sky-500 text-white px-2 py-0.5 rounded-full font-bold uppercase">Parada Activa</span>
                  <p className="font-serif font-bold text-sm mt-1">1. Pórtico de Acceso de la Basílica</p>
                </div>
                {/* Small gold Lock button/badge */}
                <div className="absolute top-3 right-3 bg-[#D4AF37] border border-[#b38e47] text-white px-2.5 py-1 rounded-full font-sans font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1 z-10">
                  <Lock className="w-3 h-3 fill-current" />
                  <span>Lock</span>
                </div>
              </div>

              {/* Mock Player */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-sky-500 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>0:45</span>
                    <span>3:20</span>
                  </div>
                </div>
              </div>

              {/* Mock stops */}
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 text-xs border border-slate-100">
                  <span className="font-medium">2. La Fachada Principal y Torres</span>
                  <span className="text-slate-400 font-mono">2:45</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 text-xs border border-slate-100">
                  <span className="font-medium">3. El Pórtico de Bronce Histórico</span>
                  <span className="text-slate-400 font-mono">4:10</span>
                </div>
              </div>
            </div>

            {/* FROSTED LOCK OVERLAY WITH PAYMENT INFORMATION */}
            <div className="absolute inset-0 bg-slate-50/75 backdrop-blur-xs flex flex-col justify-center p-6 text-center">
              <div className="max-w-xs mx-auto">
                <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 text-[#D4AF37] flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
                  <Lock className="w-5 h-5" />
                </div>
                
                <h3 className="font-serif font-black text-xl text-slate-900 mb-2">
                  Pase de Acceso Digital
                </h3>
                <p className="text-xs sm:text-[13px] font-semibold text-slate-700 mb-5 leading-normal bg-sky-50/70 border border-sky-100/60 p-3 rounded-2xl">
                  Para desbloquear toda la guía con todos los audios y las galerías fotográficas.
                </p>

                <div className="bg-white border border-sky-100 rounded-2xl p-4 shadow-sm mb-5 flex justify-between items-center">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">PRECIO TOTAL</span>
                    <span className="font-serif font-black text-2xl text-[#0092e0]">$3.000</span>
                    <span className="text-[10px] text-slate-400 font-bold ml-1">ARS</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-sky-50 text-[#0092e0] border border-sky-200 font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      Acceso Único
                    </span>
                  </div>
                </div>

                {/* SIMULATED MERCADOPAGO BUTTON */}
                {isProcessingPayment ? (
                  <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-center">
                    <div className="inline-block w-6 h-6 border-3 border-[#0092e0] border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-xs font-bold text-slate-800 animate-pulse">{paymentStep}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Conectando...</p>
                  </div>
                ) : (
                  <button
                    onClick={handleRealPayment}
                    className="w-full bg-[#0092e0] hover:bg-[#0081c7] active:scale-98 text-white py-3.5 px-6 rounded-2xl font-black text-base tracking-wide shadow-md border-b-4 border-sky-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MercadoPagoLogo className="w-9 h-7 shrink-0 rounded" />
                    <span>Pagar por Mercado Pago</span>
                  </button>
                )}

                {/* CLARIFICATIONS UNDER PAYMENT */}
                <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-left bg-sky-50/50 p-2 rounded-xl border border-sky-100/50 w-full">
                    <CheckCircle className="w-4 h-4 text-[#0092e0] shrink-0" />
                    <span className="text-[11px] text-slate-700 font-bold leading-tight">
                      Paga con todos los medios habilitados.
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-left bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/50 w-full">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-[11px] text-slate-700 font-bold leading-tight">
                      Acreditación y acceso inmediato.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-left bg-amber-50/50 p-2 rounded-xl border border-amber-100/50 w-full">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="text-[11px] text-slate-700 font-bold leading-tight">
                      Pase por 24 hs
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* ACTIVE QR REFERRAL CARD (CELESTE & WHITE) PLACED BELOW THE MAIN LOCK PANEL */}
          {activeMerchantId && (
            <div className="bg-white border-2 border-sky-100 rounded-2xl p-4 mb-6 text-center shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37]"></div>
              <div className="flex items-center justify-center gap-2 text-[#0092e0] mb-1.5">
                <Store className="w-5 h-5 text-[#0092e0]" />
                <span className="font-sans font-bold text-xs tracking-wider uppercase text-sky-700">Comercio Adherido</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">
                {COMERCIOS[activeMerchantId] || "Local Autorizado"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ¡Gracias por visitarnos! El <strong className="text-[#0092e0]">30%</strong> de tu acceso apoya directamente a este comercio de cercanía de Luján.
              </p>
            </div>
          )}

          {/* SIMULATOR AND DEV CONSOLE (LIGHT STYLED FOR BETTER INTEGRATION) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md">
            <button 
              onClick={() => setShowSimPanel(!showSimPanel)}
              className="w-full flex justify-between items-center text-slate-600 font-mono text-xs font-bold uppercase tracking-wider select-none cursor-pointer hover:text-slate-900"
            >
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#0092e0] animate-pulse" />
                <span className="text-slate-800">🛠️ Simulador QR y Ventas de Comercios</span>
              </div>
              <span className="text-[10px] text-[#0092e0]">{showSimPanel ? "Ocultar ▲" : "Ver ▼"}</span>
            </button>

            {showSimPanel && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-5 text-xs text-slate-600">
                
                {/* MERCHANT SELECTOR SIMULATOR */}
                <div>
                  <p className="font-bold text-slate-800 mb-1.5 font-mono flex items-center gap-1.5 text-[11px] uppercase">
                    <Store className="w-3.5 h-3.5 text-[#0092e0]" />
                    1. Simular Escaneo de QR Comercial:
                  </p>
                  <p className="text-slate-500 mb-3 text-[10px] leading-normal">
                    Seleccioná qué QR del local comercial cercano escaneó el visitante para entrar:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(COMERCIOS).map(([key, value]) => {
                      const isActive = activeMerchantId === key;
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?comercio=${key}`;
                            window.history.pushState({ path: newUrl }, '', newUrl);
                            setActiveMerchantId(key);
                          }}
                          className={`p-2 rounded-xl text-left font-sans transition-all active:scale-95 text-[11px] border cursor-pointer ${
                            isActive 
                              ? 'bg-sky-50 text-[#0092e0] border-[#0092e0] font-bold shadow-sm' 
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="block truncate font-semibold">{value}</span>
                          <span className="text-[8px] font-mono text-slate-400">?comercio={key}</span>
                        </button>
                      );
                    })}
                    <button
                      onClick={() => {
                        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                        window.history.pushState({ path: newUrl }, '', newUrl);
                        setActiveMerchantId(null);
                        localStorage.removeItem('audioguia_referred_merchant');
                      }}
                      className={`p-2 rounded-xl text-center font-sans transition-all active:scale-95 text-[11px] border cursor-pointer col-span-2 ${
                        !activeMerchantId 
                          ? 'bg-amber-50 text-[#D4AF37] border-[#D4AF37] font-bold' 
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>Entrada Directa General (Sin QR de Comercio)</span>
                    </button>
                  </div>
                </div>

                {/* TRACKING COMMISSION METRICS */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 font-mono">
                  <div className="flex justify-between items-center mb-2.5">
                    <p className="font-bold text-slate-700 text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Reporte de Comisiones del Local (30%)
                    </p>
                    <button 
                      onClick={handleResetLedger}
                      className="text-[9px] text-red-600 hover:text-red-800 cursor-pointer font-bold"
                    >
                      [Resetear]
                    </button>
                  </div>
                  <div className="space-y-2 divide-y divide-slate-100">
                    {Object.entries(COMERCIOS).map(([key, name]) => {
                      const sales = salesLedger[key] || 0;
                      const commission = sales * 900; // 30% of 3000 ARS = 900 ARS
                      return (
                        <div key={key} className="flex justify-between items-center pt-2 text-[10px] sm:text-[11px]">
                          <span className="text-slate-600 font-sans truncate pr-2">{name}</span>
                          <span className="text-right shrink-0">
                            <span className="text-slate-800 font-bold">{sales} pase{sales !== 1 ? 's' : ''}</span>
                            <span className="text-[#0092e0] ml-2 font-bold">(${commission} ARS)</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200 text-[10px] text-slate-500 leading-normal font-sans">
                    📈 <strong>Comisión del 30%:</strong> Cada venta registrada mediante un QR de comercio acredita automáticamente <strong>$900 ARS</strong> de ganancia al local correspondiente.
                  </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCompletePayment(activeMerchantId)}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 text-[#D4AF37] border border-[#D4AF37]/50 py-2.5 rounded-xl font-bold transition-all text-center cursor-pointer text-xs"
                  >
                    Simular Desbloqueo Rápido (Entrar)
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  return (
    <>
      {/* PLANO INTERACTIVO (pantalla completa, oculta header/footer) */}
      <AnimatePresence>
        {showPlano && (
          <PlanoInteractivo
            stops={ALL_TOUR_STOPS}
            currentPlayingStopId={playingStopId}
            isPlaying={isPlaying}
            onPlay={(stopId) => {
              const stop = ALL_TOUR_STOPS.find(s => s.id === stopId);
              if (stop) playTTS(stop.id, stop.locucion || stop.text);
            }}
            onStop={stopAudio}
            onNavigate={handlePlanoTabNavigate}
            onClose={() => {
              stopAudio();
              setShowPlano(false);
            }}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900 pb-24 pt-10 sm:pt-20">

      {/* FIXED WHITE PREMIUM HEADER */}
      {!showPlano && (
      <header className="fixed top-0 left-0 right-0 z-50 h-10 sm:h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 shadow-sm">
        
        {/* LOGO IN HEADER - CLICKABLE TO RETURN HOME */}
        <div 
          onClick={() => {
            setActiveTab('inicio');
            stopAudio();
          }}
          className="absolute left-3 top-1.5 z-50 flex items-center justify-center cursor-pointer"
        >
          <BasilicaLogo className="w-6 sm:w-12 h-8 sm:h-15 text-[#0092e0] transition-transform duration-300 hover:scale-105" />
        </div>

        {/* HEADER TITLE - THREE LINES, SERIF CAPS (CINZEL) */}
        <div 
          onClick={() => {
            setActiveTab('inicio');
            stopAudio();
          }}
          className="flex-grow pl-10 sm:pl-18 flex flex-col justify-center leading-[1.05] py-0.5 select-none cursor-pointer"
        >
          <span className="font-serif font-black tracking-[0.03em] text-[8px] sm:text-sm md:text-base text-[#0092e0] uppercase leading-[1.05] whitespace-nowrap">
            Audioguía
          </span>
          <span className="font-serif font-black tracking-[0.03em] text-[8px] sm:text-sm md:text-base text-[#0092e0] uppercase leading-[1.05] whitespace-nowrap">
            de la Basílica
          </span>
          <span className="font-serif font-black tracking-[0.03em] text-[8px] sm:text-sm md:text-base text-[#0092e0] uppercase leading-[1.05] whitespace-nowrap">
            de Luján
          </span>
        </div>

        {/* ELEGANT COMPACT JOYSTICK - SOLO DESKTOP (en móvil estorba al título) */}
        <div className="hidden sm:flex items-center self-center mr-2 sm:mr-4 select-none">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-full px-2 py-1 shadow-sm">
            {/* Back Button */}
            <button
              onClick={handlePrevStop}
              className="w-7 h-7 bg-[#0092e0] text-white hover:bg-[#0081c7] active:scale-90 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="Parada anterior"
            >
              <SkipBack className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Location Trigger (middle button, goes to conceptual map) */}
            <button
              onClick={() => {
                setActiveTab('recorrido');
                setViewMode('mapa');
                stopAudio();
              }}
              className="w-7 h-7 bg-white text-[#0092e0] border border-[#0092e0] hover:bg-sky-50 active:scale-90 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Ver mapa conceptual"
            >
              <MapPin className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextStop}
              className="w-7 h-7 bg-[#0092e0] text-white hover:bg-[#0081c7] active:scale-90 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm"
              title="Siguiente parada"
            >
              <SkipForward className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      </header>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow flex flex-col w-full">
        
        <AnimatePresence mode="wait">
          
          {/* --- VIEW 1: INICIO (HOME HUB) --- */}
          {activeTab === 'inicio' && (
            <motion.div
              key="inicio"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col"
            >
              {/* HERO BANNER - Edge to Edge, No Margins */}
              <div className="w-full relative overflow-hidden h-[36vh] sm:h-[55vh] md:h-[60vh] bg-slate-950">
                <img 
                  src={basilicaImg} 
                  alt="Basílica de Luján" 
                  className="w-full h-full object-cover object-center brightness-90 contrast-[1.02]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Legibility Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end items-center text-center p-5 sm:p-6 pb-20 sm:pb-40 max-w-xl mx-auto w-full z-10">
                  <div className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-white text-[9px] sm:text-xs font-sans font-black uppercase tracking-wider text-center mb-2">
                    Parada 1/{fullStopsList.length} • arquitectura
                  </div>
                  
                  <h2 className="text-white font-display font-black text-lg sm:text-3xl tracking-[-0.04em] leading-tight uppercase text-center">
                    Bienvenida
                  </h2>
                </div>
              </div>

              {/* FLOATING CARD - igual que single view */}
              <div className="max-w-xl mx-auto w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-full -mt-5 sm:-mt-16 relative z-10 bg-white rounded-2xl border border-slate-100 p-1 pb-1.5 sm:p-6 shadow-md flex flex-col pt-7 sm:pt-12 gap-0.5 sm:gap-5">
                <div className="absolute top-0 inset-x-0 -translate-y-1/2 z-20 px-2 sm:px-4">
                  <AudioPlayerControl 
                    isPlaying={playingStopId === firstStop.id && isPlaying}
                    onClick={() => {
                      playTTS(firstStop.id, firstStop.locucion || firstStop.text);
                      setActiveTab('recorrido');
                      setViewMode('lista');
                      setSelectedStopId(firstStop.id);
                    }}
                    onPrev={handlePrevStop}
                    onNext={handleNextStop}
                  />
                </div>

                <p className="font-bold italic text-slate-900 text-[9px] sm:text-sm leading-snug font-sans text-center px-1 sm:px-2 mt-0.5 mb-0.5 sm:mt-8 sm:mb-8">
                  {firstStop?.subtitle}
                </p>

                {/* Botones - igual ancho */}
                <div className="grid grid-cols-2 gap-2 w-full">
                  <button
                    onClick={() => {
                      setActiveTab('recorrido');
                      setViewMode('mapa');
                      stopAudio();
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 sm:py-3 bg-[#0092e0] text-white hover:bg-[#0081c7] active:scale-95 rounded-2xl transition-all duration-200 cursor-pointer shadow-md font-sans font-black uppercase tracking-tight text-xs sm:text-xs w-full"
                    title="Ver el recorrido"
                  >
                    <MapPin className="w-4 h-4 fill-current shrink-0" />
                    Recorrido
                  </button>
                  <button
                    onClick={handleOpenPlano}
                    className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 sm:py-3 bg-white text-[#0092e0] hover:bg-sky-50 active:scale-95 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border-2 border-[#0092e0]/30 font-sans font-black uppercase tracking-tight text-xs sm:text-xs w-full"
                    title="Explorar el plano"
                  >
                    <Map className="w-4 h-4 shrink-0" />
                    Plano
                  </button>
                </div>

                {/* Flechita: seguí hacia abajo para la exploración temática */}
                <div className="flex items-center justify-center pb-1">
                  <ChevronDown className="w-5 h-5 text-[#0092e0] animate-bounce" />
                </div>
              </div>


              {/* THEMATIC EXPLORATION SECTION - DYNAMIC CARDS */}
              <div className="max-w-xl mx-auto w-full px-4 py-8 space-y-6">
                <div>
                  <h3 className="font-display font-black text-2xl text-[#0092e0] tracking-[-0.04em] leading-none mb-1 uppercase">
                    Exploración temática
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Fichas especiales organizadas por salas y tesoros.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {[
                    { id: 'arquitectura', label: 'Arquitectura', desc: 'Exterior, fachada, columnas, torres y estructura del templo.', img: 'https://images.unsplash.com/photo-1548625361-155de6c7f54a?auto=format&fit=crop&w=800&q=80', subtitle: 'Todo el exterior' },
                    { id: 'interior', label: 'Interior', desc: 'Nave central, crucero, altar mayor, camarín de la Virgen, capillas y altares.', img: '/navecentral.jpg', subtitle: 'Nave y altares' },
                    { id: 'vitrales', label: 'Los Vitrales', desc: 'La teología de la luz a través de la deslumbrante colección de vitrales franceses.', img: '/vitrales.jpg', subtitle: 'Luz y teología' }
                  ].filter(sec => ALL_TOUR_STOPS.some(s => s.section === sec.id)).map(sec => {
                    const count = ALL_TOUR_STOPS.filter(s => s.section === sec.id).length;
                    return (
                      <div 
                        key={sec.id}
                        onClick={() => {
                          handleSelectCategory(sec.id as any);
                        }}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 relative cursor-pointer"
                      >
                        <div className="w-full h-40 relative bg-slate-950">
                          <img 
                            src={sec.img} 
                            alt={sec.label} 
                            onError={(e) => {
                              if (e.currentTarget.src !== basilicaImg) {
                                e.currentTarget.src = basilicaImg;
                              }
                            }}
                            className="w-full h-full object-cover object-center brightness-90"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                          <div className="absolute top-4 left-4 right-4">
                            <span className="text-[10px] font-sans font-black text-white uppercase tracking-widest leading-none block mb-1">
                              {sec.subtitle} • {count} {count === 1 ? 'parada' : 'paradas'}
                            </span>
                            <h4 className="font-display font-black text-3xl text-white tracking-[-0.03em] leading-tight uppercase">
                              {sec.label}
                            </h4>
                          </div>
                        </div>
                        
                        {/* Floating 50% Play-style button with Compass */}
                        <div className="absolute top-34 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                          <div className="w-12 h-12 bg-[#0092e0] text-white rounded-full flex items-center justify-center shadow-md border-4 border-white">
                            <Compass className="w-5 h-5" />
                          </div>
                          <span className="text-[#0092e0] font-sans font-black text-[10px] uppercase tracking-wider mt-1 text-center">
                            ¡Explora!
                          </span>
                        </div>

                        <div className="p-4 pt-12 bg-white">
                          <p className="font-bold text-slate-600 text-xs font-sans leading-relaxed text-left ml-4 pr-4">
                            {sec.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CARD CTA: Plano Interactivo */}
              <div className="max-w-xl mx-auto w-full px-4 pb-8">
                <div
                  onClick={handleOpenPlano}
                  className="bg-[#0092e0] hover:bg-[#0081c7] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-white/30">
                      <Map className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-black text-base text-white tracking-[-0.03em] uppercase leading-tight">
                        Plano de la Basílica
                      </h4>
                      <p className="text-xs text-white/90 font-sans font-semibold mt-1 leading-relaxed">
                        Accede al plano general de frente y planta, y ubica cada contenido.
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- VIEW 2: ACTIVE TAB PAGES --- */}
          {activeTab !== 'inicio' && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className={`w-full mx-auto flex flex-col ${
                isSingleView ? 'px-0 py-0 gap-0' : 'max-w-xl px-4 py-6 gap-6'
              }`}
            >
              {/* Header of Section */}
              {!isSingleView && (
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="font-display font-black tracking-[-0.05em] text-2xl text-slate-700 leading-none mt-0.5 capitalize">
                      {activeTab === 'recorrido' ? 'Acompañanos en el recorrido' : activeTab === 'interior' ? 'Interior' : activeTab}
                    </h2>
                  </div>

                  {/* Toggle Mode for Recorrido */}
                  {activeTab === 'recorrido' && (
                    <div className="flex bg-slate-200/80 p-1 rounded-xl">
                      <button
                        onClick={() => setViewMode('lista')}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          viewMode === 'lista' ? 'bg-white text-[#0092e0] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Ver como Lista"
                      >
                        <List className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => setViewMode('mapa')}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          viewMode === 'mapa' ? 'bg-white text-[#0092e0] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Ver recorrido"
                      >
                        <Map className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MAPA CONCEPTUAL INTERACTIVO */}
              {activeTab === 'recorrido' && viewMode === 'mapa' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
                  {/* Timeline Graph */}
                  <div className="relative pl-6 space-y-5">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-3.5 top-3 bottom-3 w-1 bg-gradient-to-b from-[#0092e0] to-sky-300 rounded-full" />

                    {fullStopsList.map((stop, index) => {
                      const isSelected = selectedStopId === stop.id;
                      const isCurrentPlaying = playingStopId === stop.id;
                      
                      return (
                        <div 
                          key={stop.id}
                          className="relative group flex flex-col transition-all"
                        >
                          {/* Point Indicator on Line */}
                          <button
                            onClick={() => {
                              handleJumpToStop(stop.id);
                            }}
                            className={`absolute -left-6 top-1.5 w-8 h-8 rounded-full border-4 flex items-center justify-center font-sans font-black text-xs transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-[#0092e0] border-sky-100 text-white scale-110 shadow-md shadow-sky-400/20' 
                                : 'bg-white border-slate-200 text-slate-500 hover:border-[#0092e0] hover:text-[#0092e0]'
                            }`}
                          >
                            {index + 1}
                          </button>

                          {/* Label of Stop */}
                          <div className="pl-5">
                            <button
                              onClick={() => {
                                setSelectedStopId(stop.id);
                                setViewMode('lista');
                              }}
                              className="text-left focus:outline-none block cursor-pointer group-hover:translate-x-0.5 transition-transform"
                            >
                              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
                                Parada {index + 1}/{fullStopsList.length} • {stop.section}
                              </span>
                              <h4 className={`font-display font-black text-sm leading-none mt-0.5 transition-colors ${
                                isSelected ? 'text-[#0092e0]' : 'text-slate-700 group-hover:text-[#0092e0]'
                              }`}>
                                {stop.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 font-sans font-medium mt-0.5">
                                {stop.subtitle}
                              </p>
                            </button>

                            {/* Expanded mini-panel for active item in Mapa - FORMATED AS FICHA */}
                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden mt-3"
                                >
                                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm space-y-0">
                                    {/* Stop Banner Image */}
                                    <div 
                                      onClick={() => {
                                        setSelectedStopId(stop.id);
                                        setViewMode('lista');
                                      }}
                                      className="w-full h-32 relative bg-slate-950 cursor-pointer group/banner"
                                    >
                                      <img 
                                        src={imgFor(stop)} 
                                        alt={stop.title} 
                                        onError={(e) => {
                                          if (e.currentTarget.src !== basilicaImg) {
                                            e.currentTarget.src = basilicaImg;
                                          }
                                        }}
                                        className="w-full h-full object-cover object-center brightness-90 group-hover/banner:scale-102 transition-transform duration-300"
                                        referrerPolicy="no-referrer"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                                      <div className="absolute bottom-2 left-3 right-3">
                                        <span className="text-[9px] font-sans font-black text-sky-300 uppercase tracking-widest leading-none">
                                          {stop.section} • Parada {index + 1}/{fullStopsList.length}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {/* Body with Play/Pause (no written text or gallery) */}
                                    <div className="p-4">
                                      {/* SIMPLE CENTRALIZED PLAY BUTTON - NO TEXT */}
                                      <AudioPlayerControl 
                                        isPlaying={isCurrentPlaying && isPlaying}
                                        onClick={() => playTTS(stop.id, stop.locucion || stop.text)}
                                        onPrev={handlePrevStop}
                                        onNext={handleNextStop}
                                      />
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SINGLE STOP DETAIL VIEW (No scroll list, just a clean, borderless single view card with horizontal super navigator) */}
              {(activeTab !== 'recorrido' || viewMode === 'lista') && activeStop && (() => {
                const isCurrentPlaying = playingStopId === activeStop.id;
                
                return (
                  <div className="flex flex-col gap-3 sm:gap-6 w-full">
                    <div className="flex flex-col relative w-full">
                      {/* 1. TOP BANNER PHOTO */}
                      <div className="w-full relative overflow-hidden h-[36vh] sm:h-[55vh] md:h-[60vh] bg-slate-950 rounded-none shadow-sm">
                        <img 
                          src={imgFor(activeStop)} 
                          alt={activeStop.title} 
                          onError={(e) => {
                            if (e.currentTarget.src !== basilicaImg) {
                              e.currentTarget.src = basilicaImg;
                            }
                          }}
                          className="w-full h-full object-cover object-center brightness-90 contrast-[1.02]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        
                        {/* Content Overlay - Aligned to bottom ("del centro para abajo") above floating play card */}
                        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end items-center text-center p-5 sm:p-6 pb-20 sm:pb-40 max-w-xl mx-auto w-full z-10">
                          
                          {/* BADGE TRANSLÚCIDO PARADA X/Y */}
                          <div className="bg-white/20 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-white text-[7px] sm:text-xs font-sans font-black uppercase tracking-wider text-center mb-1.5">
                            {currentStopLabel}
                          </div>

                          {isCurrentPlaying && isPlaying && (
                            <div className="mb-2 bg-[#D4AF37] text-white px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5 animate-pulse">
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                              <span className="text-[9px] font-sans font-black uppercase tracking-wider text-slate-950">Al aire</span>
                            </div>
                          )}

                          <h2 className="text-white font-display font-black text-xs sm:text-3xl tracking-[-0.04em] leading-tight uppercase text-center px-1">
                            {activeStop.title}
                          </h2>
                        </div>
                      </div>

                      {/* FLOATING CARD - MITAD DE ALTA, solo 20% sobre la imagen */}
                      <div className="max-w-xl mx-auto w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-full -mt-5 sm:-mt-16 relative z-10 bg-white rounded-2xl border border-slate-100 p-1 pb-1.5 sm:p-6 shadow-md flex flex-col pt-7 sm:pt-12 gap-0.5 sm:gap-5">
                        
                        {/* 1. REPRODUCTOR AL 50% INCRUSTADO CALADO AL 50% SOBRE EL BORDE SUPERIOR */}
                        <div className="absolute top-0 inset-x-0 -translate-y-1/2 z-20 px-2 sm:px-4">
                          <AudioPlayerControl 
                            isPlaying={isCurrentPlaying && isPlaying}
                            onClick={() => playTTS(activeStop.id, activeStop.locucion || activeStop.text)}
                            onPrev={handlePrevStop}
                            onNext={handleNextStop}
                          />
                        </div>

                        {/* 2. EPÍGRAFE - NEGRO ITÁLICO, COMPLETO, A LOS BORDES */}
                        <p className="font-bold italic text-slate-900 text-[9px] sm:text-sm leading-snug font-sans text-center px-1 sm:px-2 mt-0.5 mb-0.5 sm:mt-8 sm:mb-8">
                          {activeStop.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* GALLERY - OUTSIDE OF CARD, SPANNING EDGE-TO-EDGE OF THE SCREEN (al final en móvil) */}
                    <div className="order-3 w-full">
                    {stopImages && stopImages.length > 0 && (() => {
                      const curIdx = activeGalleryIndexes[activeStop.id] || 0;
                      const activeImage = stopImages[curIdx] || stopImages[0];
                      
                      return (
                        <div className="w-full bg-slate-900 flex flex-col my-4">
                          
                          {/* Image Container - EDGE-TO-EDGE, HEIGHT RESPONDS TO PORTRAIT / LANDSCAPE / PC */}
                          <div className="relative w-full h-[52vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] bg-slate-900 group overflow-hidden">
                            <img
                              src={activeImage.url}
                              alt={activeImage.caption}
                              onError={(e) => {
                                if (e.currentTarget.src !== basilicaImg) {
                                  e.currentTarget.src = basilicaImg;
                                }
                              }}
                              onClick={() => {
                                setGalleryModalState({
                                  isOpen: true,
                                  stopId: activeStop.id,
                                  activeIndex: curIdx
                                });
                              }}
                              className="w-full h-full object-cover brightness-95 cursor-pointer hover:scale-[1.01] transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />

                            {/* Left/Right Arrows */}
                            {stopImages.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const prevIdx = (curIdx - 1 + stopImages.length) % stopImages.length;
                                    setActiveGalleryIndexes(prev => ({ ...prev, [activeStop.id]: prevIdx }));
                                  }}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all cursor-pointer z-10"
                                >
                                  <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextIdx = (curIdx + 1) % stopImages.length;
                                    setActiveGalleryIndexes(prev => ({ ...prev, [activeStop.id]: nextIdx }));
                                  }}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all cursor-pointer z-10"
                                >
                                  <ChevronRight className="w-6 h-6" />
                                </button>
                              </>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-xs px-3 py-1 rounded-md text-white text-[10px] font-sans font-black uppercase tracking-wider">
                              Foto {curIdx + 1} de {stopImages.length}
                            </div>
                          </div>

                          {/* Fixed sky-blue band with bold italic white text under the image - Edge to edge of the screen */}
                          <div className="bg-[#0092e0] w-full py-4 px-6 shadow-sm">
                            <p className="text-white font-sans font-extrabold italic text-xs sm:text-sm text-center leading-relaxed max-w-xl mx-auto">
                              {activeImage.caption}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                    </div>

                    {/* SINGLE MAP LOCATION BUTTON & STATION TIMELINE SEGMENT (arriba en móvil) */}
                    <div className="order-2 flex flex-col items-center -mt-2 sm:mt-6 mb-4 sm:mb-16 max-w-xl mx-auto w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-full gap-2 sm:gap-8">
                      {/* DOS BOTONES: RECORRIDO + PLANO - IGUAL ANCHO, PEGADOS */}
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <button
                          onClick={() => {
                            setActiveTab('recorrido');
                            setViewMode('mapa');
                            stopAudio();
                          }}
                          className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 sm:py-3 bg-[#0092e0] text-white hover:bg-[#0081c7] active:scale-95 rounded-2xl transition-all duration-200 cursor-pointer shadow-md font-sans font-black uppercase tracking-tight text-xs sm:text-xs w-full"
                          title="Ver en el recorrido"
                        >
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
                          Recorrido
                        </button>
                        <button
                          onClick={handleOpenPlano}
                          className="inline-flex items-center justify-center gap-1.5 px-2 py-1.5 sm:py-3 bg-white text-[#0092e0] hover:bg-sky-50 active:scale-95 rounded-2xl transition-all duration-200 cursor-pointer shadow-sm border-2 border-[#0092e0]/30 font-sans font-black uppercase tracking-tight text-xs sm:text-xs w-full"
                          title="Explorar el plano"
                        >
                          <Map className="w-4 h-4 shrink-0" />
                          Plano
                        </button>
                      </div>

                      {/* STATION TIMELINE SEGMENT - COMPACTO: punto presente grande y titilante, sin título */}
                      <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-3 shadow-xs relative overflow-hidden">

                        <div className="relative w-full flex items-start justify-between px-4 sm:px-12 gap-1">
                          {/* Horizontal connecting track line behind the dots */}
                          <div className="absolute left-[16.6%] right-[16.6%] h-0.5 bg-slate-200 top-1.5 sm:top-2 -translate-y-1/2 z-0" />

                          {/* 1. Anterior Stop (Left) */}
                          <div className="flex flex-col items-center text-center z-10 flex-1 min-w-0">
                            {prevStop ? (
                              <button
                                onClick={() => {
                                  setSelectedStopId(prevStop.id);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="group flex flex-col items-center focus:outline-none cursor-pointer w-full"
                                title={`Ir a: ${prevStop.title}`}
                              >
                                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-slate-300 bg-white group-hover:border-[#0092e0] group-hover:bg-[#0092e0] transition-colors flex-shrink-0" />
                                <span className="text-[8px] sm:text-[9px] font-sans font-bold text-slate-400 mt-0.5 uppercase tracking-tight">Anterior</span>
                                <p className="text-[8px] sm:text-[10px] font-sans font-black text-slate-500 group-hover:text-[#0092e0] transition-colors leading-tight uppercase tracking-tight mt-0.5">
                                  {prevStop.title}
                                </p>
                              </button>
                            ) : (
                              <div className="flex flex-col items-center opacity-30 select-none">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-slate-200 bg-slate-100 flex-shrink-0" />
                                <span className="text-[8px] font-sans font-bold text-slate-400 mt-0.5 uppercase tracking-tight">Inicio</span>
                              </div>
                            )}
                          </div>

                          {/* 2. Current Stop (Middle) - SOLO PUNTO TITILANTE, SIN TEXTO */}
                          <div className="flex items-start justify-center z-10 w-10 sm:w-14 pt-0.5">
                            <div className="relative flex items-center justify-center">
                              <span className="absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0092e0]/50 animate-ping" />
                              <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#0092e0] border-2 border-sky-200 shadow-sm" />
                            </div>
                          </div>

                          {/* 3. Siguiente Stop (Right) */}
                          <div className="flex flex-col items-center text-center z-10 flex-1 min-w-0">
                            {nextStop ? (
                              <button
                                onClick={() => {
                                  setSelectedStopId(nextStop.id);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="group flex flex-col items-center focus:outline-none cursor-pointer w-full"
                                title={`Ir a: ${nextStop.title}`}
                              >
                                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-slate-300 bg-white group-hover:border-[#0092e0] group-hover:bg-[#0092e0] transition-colors flex-shrink-0" />
                                <span className="text-[8px] sm:text-[9px] font-sans font-bold text-slate-400 mt-0.5 uppercase tracking-tight">Siguiente</span>
                                <p className="text-[8px] sm:text-[10px] font-sans font-black text-slate-500 group-hover:text-[#0092e0] transition-colors leading-tight uppercase tracking-tight mt-0.5">
                                  {nextStop.title}
                                </p>
                              </button>
                            ) : (
                              <div className="flex flex-col items-center opacity-30 select-none">
                                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-slate-200 bg-slate-100 flex-shrink-0" />
                                <span className="text-[8px] font-sans font-bold text-slate-400 mt-0.5 uppercase tracking-tight">Fin</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })()}

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* --- FLOATING CONTROLLER AT THE BOTTOM (If audio is playing on a scrolled stop) --- */}
      <AnimatePresence>
        {playingStopId && isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-sm md:left-auto md:right-4 md:translate-x-0 md:w-80 bg-slate-900/95 backdrop-blur text-white p-3 rounded-2xl shadow-xl border border-slate-800 z-50 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-2 bg-[#D4AF37] rounded-xl">
                <Volume2 className="w-4 h-4 text-slate-950 animate-pulse" />
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
                title="Pausar / Reanudar"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <button
                onClick={stopAudio}
                className="p-1.5 hover:bg-[#D4AF37]/20 rounded-lg text-[#D4AF37] transition-colors cursor-pointer"
                title="Detener"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER NAVIGATION - ALWAYS FIXED AND VISIBLE WITH EXACTLY 6 BEAUTIFUL COMPACT KEYS */}
      {!showPlano && (
      <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center z-50 px-1 shadow-lg">
        {/* INICIO */}
        <button
          onClick={() => {
            setActiveTab('inicio');
            stopAudio();
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all gap-1 cursor-pointer ${
            activeTab === 'inicio' ? 'text-[#0092e0]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Compass className="w-4.5 h-4.5" />
          <span className="text-[7px] font-sans font-extrabold tracking-tight">Inicio</span>
        </button>

        {/* RECORRIDO */}
        <button
          onClick={() => {
            setActiveTab('recorrido');
            setViewMode('mapa');
            stopAudio();
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all gap-1 cursor-pointer ${
            activeTab === 'recorrido' ? 'text-[#0092e0]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Map className="w-4.5 h-4.5" />
          <span className="text-[7px] font-sans font-extrabold tracking-tight">Recorrido</span>
        </button>

        {/* ARQUITECTURA */}
        {ALL_TOUR_STOPS.some(s => s.section === 'arquitectura') && (
          <button
            onClick={() => {
              handleSelectCategory('arquitectura');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all gap-1 cursor-pointer ${
              activeTab === 'arquitectura' ? 'text-[#0092e0]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Compass className="w-4.5 h-4.5 rotate-45" />
            <span className="text-[7px] font-sans font-extrabold tracking-tight">Arquitectura</span>
          </button>
        )}

        {/* INTERIOR */}
        {ALL_TOUR_STOPS.some(s => s.section === 'interior') && (
          <button
            onClick={() => {
              handleSelectCategory('interior');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all gap-1 cursor-pointer ${
              activeTab === 'interior' ? 'text-[#0092e0]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bookmark className="w-4.5 h-4.5" />
            <span className="text-[7px] font-sans font-extrabold tracking-tight">Interior</span>
          </button>
        )}

        {/* VITRALES */}
        {ALL_TOUR_STOPS.some(s => s.section === 'vitrales') && (
          <button
            onClick={() => {
              handleSelectCategory('vitrales');
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all gap-1 cursor-pointer ${
              activeTab === 'vitrales' ? 'text-[#0092e0]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Sparkles className="w-4.5 h-4.5" />
            <span className="text-[7px] font-sans font-extrabold tracking-tight">Vitrales</span>
          </button>
        )}

        {/* PLANO */}
        <button
          onClick={handleOpenPlano}
          className="flex flex-col items-center justify-center flex-1 h-full transition-all gap-1 cursor-pointer text-[#0092e0] hover:text-[#0081c7]"
        >
          <Map className="w-4.5 h-4.5" />
          <span className="text-[7px] font-sans font-extrabold tracking-tight">Plano</span>
        </button>
      </footer>
      )}

      {/* IMMERSIVE FULL-SCREEN GALLERY MODAL */}
      <AnimatePresence>
        {galleryModalState.isOpen && galleryModalState.stopId && (
          (() => {
            const activeStop = ALL_TOUR_STOPS.find(s => s.id === galleryModalState.stopId);
            const images = stopImages;
            const currentImage = images[galleryModalState.activeIndex];

            if (!currentImage) return null;

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-md flex flex-col justify-between p-4"
              >
                {/* Top Bar of Modal */}
                <div className="flex items-center justify-between text-white py-2">
                  <div>
                    <p className="text-[10px] font-sans font-black uppercase tracking-widest text-sky-400">
                      Guía Visual de la Basílica
                    </p>
                    <h3 className="font-display font-black text-sm text-white leading-tight">
                      {activeStop?.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setGalleryModalState(prev => ({ ...prev, isOpen: false }))}
                    className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Central Image with Slider Controls */}
                <div className="flex-grow flex items-center justify-center relative my-4">
                  <img
                    src={currentImage.url}
                    alt={currentImage.caption}
                    onError={(e) => {
                      if (e.currentTarget.src !== basilicaImg) {
                        e.currentTarget.src = basilicaImg;
                      }
                    }}
                    className="max-h-[60vh] md:max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl"
                  />

                  {/* Previous Image Trigger */}
                  {images.length > 1 && (
                    <button
                      onClick={() => {
                        setGalleryModalState(prev => ({
                          ...prev,
                          activeIndex: (prev.activeIndex - 1 + images.length) % images.length
                        }));
                      }}
                      className="absolute left-2 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}

                  {/* Next Image Trigger */}
                  {images.length > 1 && (
                    <button
                      onClick={() => {
                        setGalleryModalState(prev => ({
                          ...prev,
                          activeIndex: (prev.activeIndex + 1) % images.length
                        }));
                      }}
                      className="absolute right-2 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                </div>

                {/* Bottom Caption overlay with clean legible white typography */}
                <div className="max-w-xl mx-auto w-full bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-4">
                  <p className="text-white font-sans font-bold text-sm leading-relaxed text-center">
                    {currentImage.caption}
                  </p>
                  {images.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-3">
                      {images.map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 rounded-full transition-all ${
                            i === galleryModalState.activeIndex ? 'w-6 bg-[#0092e0]' : 'w-1.5 bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })()
        )}
      </AnimatePresence>

    </div>
    </>
  );
}
