# 🫙 Mi Despensa — PWA compartida

Despensa compartida en tiempo real usando Firebase. Cualquiera con el enlace puede ver y editar.

---

## ⚙️ Paso 1 — Crear tu base de datos Firebase (gratis)

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) e inicia sesión con Google
2. Haz clic en **"Agregar proyecto"** → dale un nombre (ej: `mi-despensa`) → continuar
3. En el menú izquierdo ve a **Firestore Database** → **"Crear base de datos"**
4. Elige **"Comenzar en modo de prueba"** → selecciona una región → listo

### Obtener las credenciales
1. En el menú izquierdo ve a ⚙️ **Configuración del proyecto**
2. Baja a **"Tus apps"** → haz clic en el ícono **</>** (web)
3. Dale un nombre y haz clic en **"Registrar app"**
4. Firebase te mostrará un bloque como este — **cópialo**:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "mi-despensa.firebaseapp.com",
  projectId: "mi-despensa",
  storageBucket: "mi-despensa.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123...",
};
```

5. Abre el archivo `src/App.jsx` y **reemplaza** el bloque `firebaseConfig` al inicio con tus valores reales

---

## 🚀 Paso 2 — Publicar en Vercel

1. Sube todos los archivos a un repositorio de GitHub (público)
2. Ve a [vercel.com](https://vercel.com) → **"Add New Project"** → selecciona el repo
3. Vercel detecta Vite automáticamente → haz clic en **Deploy**
4. ¡Listo! Recibirás un enlace tipo `https://mi-despensa-xxx.vercel.app`

---

## 📱 Paso 3 — Instalar en el celular

**Android:** Abre el enlace en Chrome → menú ⋮ → "Añadir a pantalla de inicio"  
**iPhone:** Abre en Safari → botón compartir ↑ → "Añadir a pantalla de inicio"

---

## 👥 Compartir con otra persona

Envía el enlace de Vercel por WhatsApp. La otra persona abre el enlace y verá la misma despensa en tiempo real. Los cambios de uno aparecen en el celular del otro al instante.

---

## 💻 Desarrollo local

```bash
npm install
npm run dev
```
