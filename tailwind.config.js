/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['var(--font-pacifico)'],
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        'pacifico': ['Pacifico', 'cursive'],
        sans: ['Your-Font-Family', 'sans-serif'],
      },
      colors: {
        'primary': '#FF6B6B',
        'secondary': '#4ECDC4',
        'background': '#F5F5F5',
      },
    },
  },
  variants: {},
  plugins: [],
}
