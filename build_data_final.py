# -*- coding: utf-8 -*-
# Regenera src/data.ts con el recorrido FINAL de 47 paradas (texto fuente definitivo)
import re, json, os

SRC = r'C:\Users\xulla\mcp-projects\superpowers-mcp\.hermes\desktop-attachments\texto_final_45.txt'
OUT = r'C:\Users\xulla\Desktop\audioguia-basilica\src\data.ts'

text = open(SRC, encoding='utf-8').read()
lines = text.split('\n')

# --- Limpieza de artefactos ---
def clean(s):
    s = s.replace('&quot;', '"').replace('&amp;', '&')
    s = re.sub(r'\[[^\]]*(Contexto de la consulta|Contexto)[^\]]*\]', '', s)  # notas [118, Contexto...]
    s = s.replace('Historial.', '').replace('historial.', '')
    s = re.sub(r'\s+([,.;:])', r'\1', s)   # " ," -> ","
    s = re.sub(r'\s+', ' ', s).strip()      # espacios dobles
    return s

HEADER_RE = re.compile(r'^(\d+)[:.\-]?\s*(.*)$')
SIN_NUM = {
    'Las Piedras Escritas y las Intenciones Ocultas': 'piedras',
    'San Patricio: De Pastor a Guerrero': 'sanpatricio',
}
# IDs especiales por título para las que no tienen Imagen/Audio explícitos
SPECIAL = {
    'Las columnas de la iglesia y los cuatro evangelistas': ('arbotantes', 'arbotantes'),
    'La entrada: revestimiento de piedra y escaleras de marmol': ('ingreso', 'ingreso'),
}

paradas = []      # lista de dicts crudos
current = None

def start_parada(title):
    return {'title': title, 'subtitle': '', 'image': None, 'audio': None, 'locucion_parts': [], 'epigrafe_seen': False}

i = 0
N = len(lines)
while i < N:
    line = lines[i].rstrip()
    stripped = line.strip()
    # ¿Header numerado?
    m = HEADER_RE.match(stripped)
    is_sin_num = stripped in SIN_NUM
    if (m and len(stripped) < 90 and not stripped.startswith(('Imagen:', 'Audio:', 'Epígrafe:', 'Locución:'))) or is_sin_num:
        if m:
            title = m.group(2).strip()
        else:
            title = stripped
        # Evitar falsos positivos: headers deben tener pinta de título (no párrafo largo con número al inicio)
        if current is not None and m and len(title) < 90:
            pass
        if current:
            paradas.append(current)
        current = start_parada(title)
        i += 1
        continue
    if current is None:
        i += 1
        continue
    # Campos
    if stripped.startswith('Epígrafe:'):
        current['subtitle'] = clean(stripped[len('Epígrafe:'):].strip())
        current['epigrafe_seen'] = True
        i += 1
        continue
    if stripped.startswith('Imagen:') and '|' in stripped:
        img_part = stripped[len('Imagen:'):].strip()
        m2 = re.match(r'([\w\-]+\.(jpg|png))?\s*\|\s*Audio:\s*([\w\-]+\.(mpg|mp|mp3))?', img_part)
        if m2:
            current['image'] = m2.group(1) or None
            current['audio'] = m2.group(3) or None
        i += 1
        continue
    if stripped.startswith('Locución:'):
        current['locucion_parts'].append(clean(stripped[len('Locución:'):].strip()))
        i += 1
        continue
    # Párrafo suelto: si ya empezó la locución de esta parada, se suma a la locución;
    # si la parada no tiene formato (8, 9) o no hay epígrafe visto, también es locución.
    if stripped and not stripped.startswith(('Imagen:', 'Audio:')):
        if current['locucion_parts'] or not current['epigrafe_seen']:
            current['locucion_parts'].append(clean(stripped))
    i += 1

if current:
    paradas.append(current)

# --- Construcción de objetos finales ---
stops = []
for idx, p in enumerate(paradas):
    title = p['title']
    # títulos con artefactos
    title = clean(title)
    title = title.replace('El Plan de Vuelo recorrido Interior', 'El Plan de Vuelo del Recorrido Interior')
    title = title.replace('escaleras de marmol', 'escaleras de mármol')
    title = title.replace('Pieles Rojas', 'Pieles Rojas')
    if title.startswith('8.-'):
        title = title.replace('8.-', '', 1).strip()
    # limpiar numeración y guiones residuales
    title = re.sub(r'^[\d]+[.:\-]\s*', '', title).strip()
    title = re.sub(r'^[-–—]\s*', '', title).strip()

    image = p['image']
    audio = p['audio']
    if title in SPECIAL or (idx < 9 and not image):
        sp = SPECIAL.get(title, (None, None))
        if sp[0] and not image:
            image = sp[0] + '.jpg'
        if sp[1] and not audio:
            audio = sp[1] + '.mp3'

    # audio normalizado a .mp3
    if audio:
        audio = re.sub(r'\.(mpg|mp|mp3)$', '.mp3', audio)
    if image:
        image = re.sub(r'\.(jpg|jpeg|png|webp)$', '.jpg', image)

    # ID desde la imagen
    if image:
        sid = re.sub(r'\.jpg$', '', image)
    else:
        sid = 'parada' + str(idx + 1)

    subtitle = p['subtitle']
    if not subtitle:
        # Epígrafes derivados (8 y 9) — redactados desde el propio contenido del bloque
        if 'columnas' in title.lower() or 'evangelistas' in title.lower():
            subtitle = 'El perfil real del templo, los arbotantes y los símbolos de los cuatro evangelistas'
        elif 'entrada' in title.lower():
            subtitle = 'Piedra de Colón y mármol de Carrara antes de cruzar el umbral del silencio'
        else:
            first = p['locucion_parts'][0] if p['locucion_parts'] else title
            subtitle = first[:120].rsplit('.', 1)[0].strip()

    locucion = ' '.join([t for t in p['locucion_parts'] if t]).strip()
    if not locucion:
        locucion = title + '.'

    section = 'arquitectura' if idx < 9 else 'interior'

    stops.append({
        'id': sid,
        'title': title,
        'subtitle': subtitle,
        'section': section,
        'image': '/' + image if image else '/bienvenida.jpg',
        'audio': '/' + audio if audio else '/bienvenida.mp3',
        'text': subtitle,
        'locucion': locucion,
    })

# Sanidad
ids = [s['id'] for s in stops]
assert len(ids) == len(set(ids)), 'IDs duplicados'
assert len(stops) == 47, f'Esperaba 47, hay {len(stops)}'

# --- Escribir data.ts ---
def q(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")

lines_out = []
lines_out.append("// ============================================================")
lines_out.append("// RECORRIDO FINAL - 47 paradas (texto fuente definitivo)")
lines_out.append("// Generado por build_data_final.py")
lines_out.append("// ============================================================")
lines_out.append("")
lines_out.append("export type SectionId = 'arquitectura' | 'interior' | 'vitrales';")
lines_out.append("export type StopType = 'sala' | 'tesoro' | 'recorrido' | 'estacion';")
lines_out.append("")
lines_out.append("export interface TourStop {")
lines_out.append("  id: string;")
lines_out.append("  type: StopType;")
lines_out.append("  title: string;")
lines_out.append("  subtitle: string;")
lines_out.append("  section: SectionId;")
lines_out.append("  image: string;")
lines_out.append("  audio: string;")
lines_out.append("  text: string;")
lines_out.append("  locucion: string;")
lines_out.append("}")
lines_out.append("")
lines_out.append("export interface TourCategory {")
lines_out.append("  id: SectionId;")
lines_out.append("  title: string;")
lines_out.append("  description: string;")
lines_out.append("  image: string;")
lines_out.append("}")
lines_out.append("")
lines_out.append("export const ALL_TOUR_STOPS: TourStop[] = [")
for s in stops:
    lines_out.append("  {")
    lines_out.append(f"    id: '{q(s['id'])}',")
    lines_out.append("    type: 'sala',")
    lines_out.append(f"    title: '{q(s['title'])}',")
    lines_out.append(f"    subtitle: '{q(s['subtitle'])}',")
    lines_out.append(f"    section: '{q(s['section'])}',")
    lines_out.append(f"    image: '{q(s['image'])}',")
    lines_out.append(f"    audio: '{q(s['audio'])}',")
    lines_out.append(f"    text: '{q(s['text'])}',")
    lines_out.append(f"    locucion: '{q(s['locucion'])}',")
    lines_out.append("  },")
lines_out.append("];")
lines_out.append("")
lines_out.append("export const TOUR_CATEGORIES: TourCategory[] = [")
lines_out.append("  { id: 'arquitectura', title: 'Arquitectura', description: 'Exterior, fachada, columnas, torres y estructura del templo.', image: '/portadas.jpg' },")
lines_out.append("  { id: 'interior', title: 'Interior', description: 'Nave central, crucero, altar mayor, camarín de la Virgen, capillas y altares.', image: '/navecentral.jpg' },")
lines_out.append("];")
lines_out.append("")

open(OUT, 'w', encoding='utf-8').write('\n'.join(lines_out))
print(f'OK: {len(stops)} paradas escritas')
print('Secciones:', {sec: sum(1 for s in stops if s["section"] == sec) for sec in ['arquitectura', 'interior']})
print('Primeras:', [s['title'][:40] for s in stops[:5]])
print('Últimas:', [s['title'][:40] for s in stops[-5:]])
