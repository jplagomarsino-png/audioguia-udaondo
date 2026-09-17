# Audioguía Complejo Museográfico Provincial Enrique Udaondo

Proyecto: Audioguía Oficial del Complejo Museográfico Enrique Udaondo (Luján).
Ubicación: `C:\Users\xulla\Desktop\app udaondo\`
Stack: React 19 + TypeScript + Vite + Tailwind CSS + motion (framer-motion)

---

## 1. Origen y Estado Inicial

- Clonado a partir de la base de código de la **Audioguía Basílica de Luján** para conservar íntegramente el diseño visual, reproductor de audio, vista móvil sin scroll y arquitectura PWA.
- **Desvinculación git:** Se eliminó el remote git origin de la Basílica para iniciar un ciclo de versiones independiente.
- **Rebranding base aplicado:**
  - `index.html`: Título configurado como *"Audioguía Complejo Museográfico Enrique Udaondo"*.
  - `manifest.json` y `public/manifest.json`: Nombre *"Audioguía Complejo Museográfico Enrique Udaondo"*, nombre corto *"Guía Udaondo"*, descripción actualizada.
  - `package.json`: Nombre del paquete `audioguia-udaondo`.

---

## 2. Próximos Pasos Técnicos

1. **Estructura de Datos Multi-nivel (`src/data.ts`):**
   - Modelar las paradas con soporte para múltiples niveles / áreas / salas del complejo (Cabildo, Casa de Rosas, Área de Transportes, Patios, etc.).
   - Mantener campos estándar por parada: `id`, `title`, `subtitle`, `locucion` (fallback TTS), `audio`, `image`, `section` / `level`.
2. **Contenido y Assets:**
   - Carga de nuevos guiones, locuciones MP3 e imágenes representativas en `public/`.
   - Incorporación de planos interactivos por sector o nivel si corresponde.
3. **Ajustes de UI:**
   - Adaptación de selectores temáticos y pestañas de navegación al nuevo esquema de áreas.
