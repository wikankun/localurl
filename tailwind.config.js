/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./*.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neo-brutalism color palette
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        surface: '#F9FAFB',
        'surface-2': '#F3F4F6',
        border: '#E5E7EB',
        'border-strong': '#D1D5DB',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        'text-muted': '#9CA3AF',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'neo-sm': '2px 2px 0 rgba(0, 0, 0, 0.1)',
        'neo': '4px 4px 0 rgba(0, 0, 0, 0.1)',
        'neo-lg': '6px 6px 0 rgba(0, 0, 0, 0.1)',
        'neo-xl': '8px 8px 0 rgba(0, 0, 0, 0.1)',
        'neo-2xl': '12px 12px 0 rgba(0, 0, 0, 0.1)',
        // Dark mode shadows
        'neo-dark-sm': '2px 2px 0 rgba(0, 0, 0, 0.5)',
        'neo-dark': '4px 4px 0 rgba(0, 0, 0, 0.5)',
        'neo-dark-lg': '6px 6px 0 rgba(0, 0, 0, 0.5)',
        'neo-dark-xl': '8px 8px 0 rgba(0, 0, 0, 0.5)',
        'neo-dark-2xl': '12px 12px 0 rgba(0, 0, 0, 0.5)',
      },
      borderWidth: {
        '2': '2px',
        '3': '3px',
        '4': '4px',
      },
      height: {
        'btn': '44px',
        'btn-sm': '36px',
        'btn-lg': '52px',
        'input': '44px',
        'input-sm': '36px',
        'nav': '64px',
        '13': '52px', // For btn-lg
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '350': '350ms',
      },
      animation: {
        'fade-in': 'fadeIn 250ms ease-out',
        'slide-up': 'slideUp 250ms ease-out',
        'toast-slide-up': 'toastSlideUp 250ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastSlideUp: {
          '0%': { opacity: '0', transform: 'translate(-50%, 100%)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' },
        },
      },
      zIndex: {
        'modal': '1000',
        'toast': '2000',
      },
    },
  },
  plugins: [
    // Custom utilities for neo-brutalism
    function({ addUtilities, theme }) {
      const neoUtilities = {
        '.neo-brutalism': {
          border: '2px solid',
          borderColor: theme('colors.border'),
          boxShadow: theme('boxShadow.neo'),
        },
        '.neo-brutalism-sm': {
          border: '2px solid',
          borderColor: theme('colors.border'),
          boxShadow: theme('boxShadow.neo-sm'),
        },
        '.neo-brutalism-lg': {
          border: '3px solid',
          borderColor: theme('colors.border'),
          boxShadow: theme('boxShadow.neo-lg'),
        },
        '.neo-brutalism-xl': {
          border: '4px solid',
          borderColor: theme('colors.border'),
          boxShadow: theme('boxShadow.neo-xl'),
        },
        '.hover-neo-lift': {
          transition: 'all 150ms ease',
          '&:hover': {
            boxShadow: theme('boxShadow.neo-lg'),
            transform: 'translate(-2px, -2px)',
          },
          '&:active': {
            boxShadow: theme('boxShadow.neo-sm'),
            transform: 'translate(1px, 1px)',
          },
        },
        '.dark .neo-brutalism': {
          borderColor: theme('colors.secondary.700'),
          boxShadow: theme('boxShadow.neo-dark'),
        },
        '.dark .neo-brutalism-sm': {
          borderColor: theme('colors.secondary.700'),
          boxShadow: theme('boxShadow.neo-dark-sm'),
        },
        '.dark .neo-brutalism-lg': {
          borderColor: theme('colors.secondary.600'),
          boxShadow: theme('boxShadow.neo-dark-lg'),
        },
        '.dark .neo-brutalism-xl': {
          borderColor: theme('colors.secondary.600'),
          boxShadow: theme('boxShadow.neo-dark-xl'),
        },
        '.dark .hover-neo-lift': {
          '&:hover': {
            boxShadow: theme('boxShadow.neo-dark-lg'),
          },
          '&:active': {
            boxShadow: theme('boxShadow.neo-dark-sm'),
          },
        },
      };

      addUtilities(neoUtilities);
    },
  ],
}