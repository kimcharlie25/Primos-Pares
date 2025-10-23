/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primos: {
          red: '#EF4444', // Bright red for dark theme visibility
          darkRed: '#DC2626', // Red for hover states
          brightRed: '#F87171', // Even brighter red for emphasis
          black: '#000000', // Pure black background
          white: '#FFFFFF', // Pure white for text
          gray: {
            50: '#1A1A1A', // Very dark gray for cards
            100: '#262626', // Dark gray for hover states
            200: '#333333', // Medium dark gray
            300: '#404040', // Lighter dark gray for borders
            400: '#525252', // Mid gray
            500: '#737373', // Lighter mid gray
            600: '#A3A3A3', // Light gray for secondary text
            700: '#D4D4D4', // Very light gray
            800: '#E5E5E5', // Near white
            900: '#F5F5F5', // Almost white
          }
        },
        // Keep old colors for admin panel
        ramen: {
          red: '#D7263D',
          dark: '#0B0A0A',
          charcoal: '#111113',
          cream: '#FFF3E0',
          beige: '#F7E7CE',
          gold: '#E0A106',
          sesame: '#D1C7B7',
          seaweed: '#1F2937',
          kimchi: '#B81D24'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
};