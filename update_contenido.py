# -*- coding: utf-8 -*-
# Actualiza data.ts: locuciones 7 y 9 + inserta paradas 38 (camarín) y 40 (confesionarios)
import re

p = 'src/data.ts'
s = open(p, encoding='utf-8').read()

def esc(t):
    return t.replace('\\', '\\\\').replace("'", "\\'")

# ---------- 1) LOCUCION PARADA 7 (torres) ----------
nueva_torres = ("Ahora sí, preparemos el cuello porque vamos a elevar la mirada bien arriba, "
"hacia las torres simétricas de 106 metros de altura. Unas montañas impresionantes que parecen "
"querer pinchar las nubes. Pero fíjense bien: allá atrás, justo sobre el centro de la Basílica, "
"aparece una torrecita más pequeña, como un alfiler de bronce que mide 6 metros. Esa aguja no está "
"ahí por capricho; es la que nos indica desde afuera el lugar exacto donde se encuentra el altar "
"mayor y la Virgen. En la torre de la izquierda se esconde el tesoro musical: un carillón de 15 "
"campanas de bronce fundidas con cañones de la Segunda Guerra Mundial. Pensar que ese metal usado "
"para la guerra hoy es un llamado a la paz. ¿No es increíble? La campana más grande pesa 3.400 "
"kilos. Estén atentos, porque suenan cada media hora. Y más arriba, coronando todo, las cruces de "
"hierro que parecen tocar el cielo.")

pat = re.compile(r"(id: 'torres',[\s\S]*?locucion: )'[^']*'")
s, n1 = pat.subn(lambda m: m.group(1) + "'" + esc(nueva_torres) + "'", s)

# ---------- 2) LOCUCION PARADA 9 (memorial) ----------
nueva_memorial = ("Antes de entrar, deténganse un momento frente a este memorial. Es la antigua cruz "
"que coronaba la torre este. El 13 de junio de 2000, durante una tormenta muy fuerte, esta mole de "
"1.100 kilos de hierro se desprendió y cayó desde 106 metros de altura. Fue un milagro que no "
"lastimara a nadie, porque cayó en un lugar donde siempre hay gente. Ese ruido no fue solo el golpe; "
"fue el aviso que necesitábamos para darnos cuenta de que la Basílica estaba sufriendo el paso del "
"tiempo y la erosión. Gracias a esa caída se empezó la restauración minuciosa que hoy permite que el "
"templo brille de nuevo. Es un recordatorio de que, a veces, las cosas tienen que caer para poder "
"reconstruirse con más fuerza.")

pat2 = re.compile(r"(id: 'memorial',[\s\S]*?locucion: )'[^']*'")
s, n2 = pat2.subn(lambda m: m.group(1) + "'" + esc(nueva_memorial) + "'", s)

# ---------- 3) NUEVA PARADA confesionarios (después de sanroque) ----------
loc_conf = ("Caminando por esta nave derecha, si prestan atención a los laterales, aparecen los "
"confesionarios. Son piezas de madera tallada que guardan muchísimos secretos y pedidos de perdón. "
"Es lindo imaginar que la misericordia emana desde el centro mismo del templo, ahí donde está el "
"altar y la Virgen, y se derrama hacia estos costados para recibir a los que necesitan un alivio. A "
"veces uno piensa que estarían en lugares más escondidos, pero no; estos nos salen al encuentro acá, "
"recordándonos que el perdón está siempre a mano. Es una invitación a seguir el camino con el alma "
"un poquito más liviana.")

sub_conf = ("Piezas de madera tallada donde el perdón sale al encuentro en la nave derecha.")

bloque_conf = """  {
    id: 'confesionarios',
    type: 'sala',
    title: 'Los Confesionarios: El Encuentro del Perdón',
    subtitle: 'SUB',
    audio: 'confesionarios.mp3',
    section: 'interior',
    image: '/confesionarios.jpg',
    text: 'SUB',
    locucion: 'LOC',
    gallery: [
      { url: '/confesionarios.jpg', caption: 'SUB' }
    ]
  },
""".replace('SUB', esc(sub_conf)).replace('LOC', esc(loc_conf))

# Insertar después del bloque sanroque (hasta el cierre "  }," siguiente)
m_sanroque = re.search(r"(id: 'sanroque',[\s\S]*?\n  \},)", s)
if m_sanroque:
    s = s[:m_sanroque.end()] + '\n' + bloque_conf + s[m_sanroque.end():]
    n3 = 1
else:
    n3 = 0

# ---------- 4) NUEVA PARADA camarinsacristia (después de piedras) ----------
loc_cam = ("Estamos justo detrás del altar mayor, en el centro del deambulatorio. Antes de subir, "
"pasamos frente a la Sacristía Principal. Es un lugar de mucha actividad silenciosa donde los "
"sacerdotes y obispos se preparan para la misa; allí late el día a día de quienes dedican su vida a "
"la fe por María. Ahora, si subimos por la escalera de mármol de Carrara, llegamos al Camarín. Este "
"es el verdadero cofre que el Padre Salvaire soñó para su Perla del Plata. Aquí, en este recinto de "
"madera de cedro y adornos dorados, reside la imagen original de terracota de 1630. Es esa talla "
"pequeñita que decidió quedarse a vivir con nosotros hace casi cuatro siglos. Estar acá arriba, tan "
"cerca de Ella, nos permite un momento de intimidad y silencio que es el corazón mismo de toda esta "
"visita.")

sub_cam = "El cofre que el Padre Salvaire soñó: la sacristía y la imagen original de 1630."

bloque_cam = """  {
    id: 'camarinsacristia',
    type: 'sala',
    title: 'El Camarín y el Latir de la Sacristía',
    subtitle: 'SUB',
    audio: 'camarin_sacristia.mp3',
    section: 'interior',
    image: '/camarin_sacristia.jpg',
    text: 'SUB',
    locucion: 'LOC',
    gallery: [
      { url: '/camarin_sacristia.jpg', caption: 'SUB' }
    ]
  },
""".replace('SUB', esc(sub_cam)).replace('LOC', esc(loc_cam))

m_piedras = re.search(r"(id: 'piedras',[\s\S]*?\n  \},)", s)
if m_piedras:
    s = s[:m_piedras.end()] + '\n' + bloque_cam + s[m_piedras.end():]
    n4 = 1
else:
    n4 = 0

open(p, 'w', encoding='utf-8').write(s)
print(f"torres: {n1}, memorial: {n2}, confesionarios insertada: {n3}, camarín insertada: {n4}")
