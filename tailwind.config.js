/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{html,js,jsx,ts,tsx}', 'app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  theme: {
    extend: {
   
    }
  },
  plugins: [require('tailwindcss-animate')]
};
