import { useState, useEffect, useCallback } from 'react';
import { Lock, Plus, ArrowLeft, QrCode, Printer, CheckCircle, Trash2 } from 'lucide-react';

const API = 'https://audioguia-basilica.vercel.app/api';

interface Comercio {
  id: string;
  nombre: string;
  contacto: string;
  cbu: string;
  comisionPct: number;
  activo: boolean;
  creado: number;
  ventas: number;
  facturado: number;
  comision: number;
  pendiente: number;
  ultimoPago: number | null;
}

interface Venta {
  paymentId: string;
  monto: number;
  comision: number;
  createdAt: number;
  liquidacion: { pagado: boolean; fecha: number } | null;
}

const fmt = (n: number) => '$' + n.toLocaleString('es-AR');
const fmtFecha = (t: number | null) => (t ? new Date(t).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : '—');

// Selector de % de comisión del punto de venta
function SelectorComision({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2">
      {[30, 40, 50].map((pct) => (
        <button
          key={pct}
          type="button"
          onClick={() => onChange(pct)}
          className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-black transition-all cursor-pointer ${
            value === pct
              ? 'border-[#0092e0] bg-sky-50 text-[#0092e0]'
              : 'border-slate-200 text-slate-400 hover:border-slate-300'
          }`}
        >
          {pct}%
        </button>
      ))}
    </div>
  );
}

export default function AdminPanel() {
  const [session, setSession] = useState<string>(() => localStorage.getItem('audioguia_admin_session') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [vista, setVista] = useState<'dashboard' | 'ficha' | 'nuevo'>('dashboard');
  const [comercios, setComercios] = useState<Comercio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [comercioSel, setComercioSel] = useState<Comercio | null>(null);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [resumenVentas, setResumenVentas] = useState({ total: 0, comisionTotal: 0, pendiente: 0, cantidad: 0 });

  // Campos de edición / nuevo
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [cbu, setCbu] = useState('');
  const [comisionPct, setComisionPct] = useState<number>(30);
  const [nuevoCreado, setNuevoCreado] = useState<{ id: string; qrUrl: string; cartelUrl: string } | null>(null);

  const headers = () => ({ 'Content-Type': 'application/json', 'X-Session': session });

  const doLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch(`${API}/adminLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.session) {
        localStorage.setItem('audioguia_admin_session', data.session);
        setSession(data.session);
        setPassword('');
      } else {
        setLoginError(data.error || 'Error');
      }
    } catch {
      setLoginError('Error de conexión');
    }
    setLoginLoading(false);
  };

  const cargarComercios = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/adminComercios`, { headers: headers() });
      const data = await res.json();
      if (res.ok) setComercios(data.comercios || []);
      else setError(data.error || 'Error');
    } catch {
      setError('Error de conexión');
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (session) cargarComercios();
  }, [session, cargarComercios]);

  const verFicha = async (c: Comercio) => {
    setComercioSel(c);
    setNombre(c.nombre);
    setContacto(c.contacto);
    setCbu(c.cbu);
    setComisionPct(c.comisionPct || 30);
    setVista('ficha');
    try {
      const res = await fetch(`${API}/adminVentas?comercio=${c.id}`, { headers: headers() });
      const data = await res.json();
      if (res.ok) {
        setVentas(data.ventas || []);
        setResumenVentas(data.resumen || { total: 0, comisionTotal: 0, pendiente: 0, cantidad: 0 });
      }
    } catch {
      /* noop */
    }
  };

  const guardarFicha = async () => {
    if (!comercioSel) return;
    await fetch(`${API}/adminComercios`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ id: comercioSel.id, nombre, contacto, cbu, comisionPct }),
    });
    await cargarComercios();
    verFicha({ ...comercioSel, nombre, contacto, cbu });
  };

  const marcarPagado = async () => {
    if (!comercioSel) return;
    const res = await fetch(`${API}/adminMarcarPagado`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ comercioId: comercioSel.id }),
    });
    if (res.ok) {
      await cargarComercios();
      verFicha(comercioSel);
    }
  };

  const crearComercio = async () => {
    if (!nombre.trim()) return;
    setLoading(true);
    const res = await fetch(`${API}/adminComercios`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ nombre, contacto, cbu, comisionPct }),
    });
    const data = await res.json();
    if (res.ok) {
      setNuevoCreado(data);
      setNombre('');
      setContacto('');
      setCbu('');
      await cargarComercios();
    } else {
      setError(data.error || 'Error al crear');
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('audioguia_admin_session');
    setSession('');
    setVista('dashboard');
  };

  // ---------- LOGIN ----------
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 w-full max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-[#0092e0] text-white flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-display font-black text-xl text-slate-800 uppercase tracking-tight">Panel de Ventas</h1>
          <p className="text-xs text-slate-500 mt-1 mb-5">Audioguía Basílica de Luján — acceso restringido</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doLogin()}
            placeholder="Clave de administrador"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0092e0] focus:outline-none text-sm mb-3"
          />
          {loginError && <p className="text-xs text-red-600 mb-2">{loginError}</p>}
          <button
            onClick={doLogin}
            disabled={loginLoading}
            className="w-full py-3 rounded-xl bg-[#0092e0] hover:bg-[#0081c7] text-white font-black text-sm uppercase tracking-wide transition-colors cursor-pointer"
          >
            {loginLoading ? 'Verificando…' : 'Entrar'}
          </button>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  if (vista === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display font-black text-2xl text-slate-800 uppercase tracking-tight">Puntos de venta</h1>
              <p className="text-xs text-slate-500">Ventas y comisiones en tiempo real</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setVista('nuevo'); setNuevoCreado(null); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0092e0] hover:bg-[#0081c7] text-white rounded-full text-xs font-black uppercase tracking-wide shadow-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Nuevo punto de venta
              </button>
              <button onClick={logout} className="px-3 py-2.5 text-slate-500 hover:text-red-600 text-xs font-bold cursor-pointer">
                Salir
              </button>
            </div>
          </div>

          {loading && <p className="text-sm text-slate-500">Cargando…</p>}
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <div className="space-y-3">
            {comercios.length === 0 && !loading && (
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
                Todavía no hay puntos de venta. Creá el primero con «Nuevo punto de venta».
              </div>
            )}
            {comercios.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-black text-base text-slate-800 truncate">{c.nombre}</h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${c.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                        {c.activo ? 'Activo' : 'Inactivo'}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-sky-100 text-[#0092e0]">
                        {c.comisionPct || 30}% comisión
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">{c.id}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <a href={`${API}/qr?comercio=${c.id}`} target="_blank" rel="noreferrer" title="QR para WhatsApp"
                      className="w-8 h-8 rounded-full bg-sky-50 hover:bg-sky-100 text-[#0092e0] flex items-center justify-center border border-sky-200 cursor-pointer">
                      <QrCode className="w-4 h-4" />
                    </a>
                    <a href={`${API}/cartel?comercio=${c.id}`} target="_blank" rel="noreferrer" title="Cartel imprimible"
                      className="w-8 h-8 rounded-full bg-sky-50 hover:bg-sky-100 text-[#0092e0] flex items-center justify-center border border-sky-200 cursor-pointer">
                      <Printer className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-center">
                  <div className="bg-slate-50 rounded-xl p-2">
                    <div className="text-lg font-black text-slate-800">{c.ventas}</div>
                    <div className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">Ventas</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2">
                    <div className="text-lg font-black text-slate-800">{fmt(c.facturado)}</div>
                    <div className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">Facturado</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2">
                    <div className="text-lg font-black text-slate-800">{fmt(c.comision)}</div>
                    <div className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">Comisión total</div>
                  </div>
                  <div className={`rounded-xl p-2 ${c.pendiente > 0 ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                    <div className={`text-lg font-black ${c.pendiente > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{fmt(c.pendiente)}</div>
                    <div className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">{c.pendiente > 0 ? 'A pagar' : 'Al día'}</div>
                  </div>
                </div>

                <button
                  onClick={() => verFicha(c)}
                  className="mt-3 w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                >
                  Ver historial y detalles →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------- NUEVO ----------
  if (vista === 'nuevo') {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
        <div className="max-w-md mx-auto">
          <button onClick={() => setVista('dashboard')} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <h1 className="font-display font-black text-2xl text-slate-800 uppercase tracking-tight mb-5">Nuevo punto de venta</h1>

          {nuevoCreado ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h2 className="font-black text-lg text-slate-800">{nuevoCreado.id}</h2>
              <p className="text-xs text-slate-500 mt-1 mb-5">Punto de venta creado. Generá su QR:</p>
              <div className="space-y-2">
                <a href={`${API}/qr?comercio=${nuevoCreado.id}`} target="_blank" rel="noreferrer"
                  className="block w-full py-3 rounded-xl bg-[#0092e0] hover:bg-[#0081c7] text-white font-black text-xs uppercase tracking-wide cursor-pointer">
                  Descargar QR (WhatsApp)
                </a>
                <a href={`${API}/cartel?comercio=${nuevoCreado.id}`} target="_blank" rel="noreferrer"
                  className="block w-full py-3 rounded-xl bg-white border-2 border-[#0092e0]/30 text-[#0092e0] font-black text-xs uppercase tracking-wide cursor-pointer">
                  Ver cartel imprimible
                </a>
                <button onClick={() => { setVista('dashboard'); setNuevoCreado(null); }}
                  className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs cursor-pointer">
                  Terminar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">Nombre del negocio *</label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0092e0] focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">Contacto (nombre / tel)</label>
                <input value={contacto} onChange={(e) => setContacto(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0092e0] focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">CBU / Alias (para pagos)</label>
                <input value={cbu} onChange={(e) => setCbu(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0092e0] focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">Comisión del comercio</label>
                <SelectorComision value={comisionPct} onChange={setComisionPct} />
              </div>
              <button onClick={crearComercio} disabled={loading || !nombre.trim()}
                className="w-full py-3 rounded-xl bg-[#0092e0] hover:bg-[#0081c7] disabled:opacity-40 text-white font-black text-sm uppercase tracking-wide cursor-pointer">
                Crear punto de venta
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- FICHA ----------
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => { setVista('dashboard'); setComercioSel(null); }} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 mb-4 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="font-display font-black text-xl text-slate-800">{comercioSel?.nombre}</h1>
              <p className="text-[10px] font-mono text-slate-400">{comercioSel?.id}</p>
            </div>
            <div className="flex gap-1.5">
              <a href={`${API}/qr?comercio=${comercioSel?.id}`} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-sky-50 hover:bg-sky-100 text-[#0092e0] flex items-center justify-center border border-sky-200 cursor-pointer" title="QR">
                <QrCode className="w-4 h-4" />
              </a>
              <a href={`${API}/cartel?comercio=${comercioSel?.id}`} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-sky-50 hover:bg-sky-100 text-[#0092e0] flex items-center justify-center border border-sky-200 cursor-pointer" title="Cartel">
                <Printer className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">Nombre</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0092e0] focus:outline-none text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">Contacto</label>
              <input value={contacto} onChange={(e) => setContacto(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0092e0] focus:outline-none text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">CBU / Alias</label>
              <input value={cbu} onChange={(e) => setCbu(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0092e0] focus:outline-none text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 block mb-1">Comisión del comercio</label>
              <SelectorComision value={comisionPct} onChange={setComisionPct} />
            </div>
            <button onClick={guardarFicha}
              className="w-full py-2.5 rounded-xl bg-[#0092e0] hover:bg-[#0081c7] text-white font-black text-xs uppercase tracking-wide cursor-pointer">
              Guardar datos
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mb-4">
            <div className="bg-slate-50 rounded-xl p-2">
              <div className="text-lg font-black text-slate-800">{resumenVentas.cantidad}</div>
              <div className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">Ventas</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-2">
              <div className="text-lg font-black text-slate-800">{fmt(resumenVentas.total)}</div>
              <div className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">Facturado</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-2">
              <div className="text-lg font-black text-slate-800">{fmt(resumenVentas.comisionTotal)}</div>
              <div className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">Comisión</div>
            </div>
            <div className={`rounded-xl p-2 ${resumenVentas.pendiente > 0 ? 'bg-amber-50' : 'bg-emerald-50'}`}>
              <div className={`text-lg font-black ${resumenVentas.pendiente > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{fmt(resumenVentas.pendiente)}</div>
              <div className="text-[9px] uppercase tracking-wide text-slate-400 font-bold">A pagar</div>
            </div>
          </div>

          <button onClick={marcarPagado} disabled={resumenVentas.pendiente === 0}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" /> Marcar todo como pagado
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-black text-sm text-slate-700 uppercase tracking-wide">Historial facturado</h2>
          </div>
          {ventas.length === 0 && (
            <p className="p-6 text-center text-sm text-slate-400">Sin ventas todavía.</p>
          )}
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {ventas.map((v) => (
              <div key={v.paymentId} className="px-6 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate">{v.paymentId}</p>
                  <p className="text-[10px] text-slate-400">{fmtFecha(v.createdAt)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-slate-800">{fmt(v.monto)}</p>
                  <p className={`text-[10px] font-bold ${v.liquidacion?.pagado ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {v.liquidacion?.pagado ? `Pagado ${fmtFecha(v.liquidacion.fecha)}` : `Comisión ${fmt(v.comision)} pendiente`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
