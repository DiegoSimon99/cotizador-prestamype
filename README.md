# 💱 Cotizador de Cambio (Nuxt 3 + Pinia + Tailwind + Firebase)

Un cotizador online de dólares y soles en Perú.  
Construido con **Nuxt 3**, **Pinia** para estado global, **TailwindCSS** para estilos y **Firebase Firestore** para obtener las tasas de cambio en tiempo real.

---

## 🚀 Tecnologías usadas
- [Nuxt 3](https://nuxt.com/) — Framework de Vue para SSR/SPA.
- [Pinia](https://pinia.vuejs.org/) — Store management.
- [TailwindCSS](https://tailwindcss.com/) — Estilos utilitarios.
- [Firebase Firestore](https://firebase.google.com/) — Base de datos en la nube.
- [Vite](https://vitejs.dev/) — Bundler.

---

## ⚙️ Instalación y ejecución local

Clonar el repositorio:

```bash
git clone https://github.com/DiegoSimon99/cotizador-prestamype.git
cd cotizador-prestamype

Instalar dependencias: npm install
Ejecutar en modo desarrollo: npm run dev

Crea un archivo .env en la raíz con las siguientes claves (ejemplo):

NUXT_PUBLIC_FIREBASE_API_KEY=xxxxxxxxxxxxxxxxxxxx
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=xxxx
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxx.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxx
NUXT_PUBLIC_FIREBASE_APP_ID=1:xxxx:web:xxxx
NUXT_PUBLIC_FIREBASE_RATES_COLLECTION=rates
NUXT_PUBLIC_FIREBASE_RATES_DOC_ID=TDmXIypgLKKfNggHHSnw
