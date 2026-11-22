/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#147D55',
          dark: '#0d5c3e',
          light: '#1a9c6a',
          soft: '#E8F5EF',
          muted: '#C2E4D4'
        },
        navy: {
          DEFAULT: '#17324D',
          dark: '#0f2234',
          light: '#234a70',
          soft: '#EEF3F8'
        },
        accent: {
          DEFAULT: '#B7DCC9',
          light: '#DCEFE5',
          dark: '#82bFA1'
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F5F8F6',
          muted: '#EBF1EE'
        },
        body: '#252D35'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Merriweather', 'Georgia', 'serif']
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(23, 50, 77, 0.06), 0 1px 2px 0 rgba(23, 50, 77, 0.04)',
        'card': '0 4px 12px 0 rgba(23, 50, 77, 0.06), 0 1px 3px 0 rgba(23, 50, 77, 0.04)',
        'card-hover': '0 12px 24px -4px rgba(20, 125, 85, 0.12), 0 4px 6px -2px rgba(23, 50, 77, 0.05)',
        'dropdown': '0 10px 25px -5px rgba(23, 50, 77, 0.15), 0 8px 10px -6px rgba(23, 50, 77, 0.1)'
      }
    },
  },
  plugins: [],
}
