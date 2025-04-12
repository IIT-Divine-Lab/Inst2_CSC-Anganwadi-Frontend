/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        drawCheck: {
          '0%': { strokeDasharray: '0, 36' },
          '100%': { strokeDasharray: '36, 36' },
        },
      },
      animation: {
        'draw-check': 'drawCheck 1s ease-out 0.6s forwards',
      },
    },
  },
  plugins: [],
}