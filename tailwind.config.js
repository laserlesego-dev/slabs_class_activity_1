/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#101318',
        midnight: '#080A0E',
        silver: '#C6C9CE',
        neonRed: '#FF303D',
        electricPurple: '#8B00FF',
        burgundy: '#48151D',
      },
      boxShadow: {
        glow: '0 0 35px rgba(255, 48, 61, 0.35)',
        card: '0 20px 45px rgba(7, 10, 14, 0.6)',
      },
      backgroundImage: {
        'mesh-dark': 'radial-gradient(circle at top left, rgba(139,0,255,0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(255,48,61,0.16), transparent 28%), linear-gradient(135deg, #080A0E 0%, #101318 100%)',
      },
    },
  },
  plugins: [],
};
