/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Asegúrate de que estos coincidan con la estructura de tu proyecto
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    }, // Puedes extender la configuración aquí
  },
  plugins: [], // Puedes agregar plugins de Tailwind si los necesitas
};
