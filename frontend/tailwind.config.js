/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory:        '#FAFAF8',
        gold:         '#C9A84C',
        'gold-light': '#F0E8D0',
        'gold-dark':  '#9A7A30',
        charcoal:     '#1A1A1A',
        cream:        '#F5F0E8',
        muted:        '#6B6B6B',
        border:       '#E8E2D8',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter:    ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}