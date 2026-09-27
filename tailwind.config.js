/** Tailwind config — CDN'dagi sozlamalar bilan bir xil (index.html ichidagi eski tailwind.config). */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './js/**/*.js'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' }
    },
    extend: {
      colors: {
        brand: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          500: '#0284C7',
          600: '#0F3F7A',
          700: '#0A2E5C',
          800: '#071F3D'
        }
      }
    }
  }
};
