/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* warm-gray-200 */
        input: "var(--color-input)", /* white */
        ring: "var(--color-ring)", /* warm-orange-600 */
        background: "var(--color-background)", /* cream-white */
        foreground: "var(--color-foreground)", /* dark-brown */
        primary: {
          DEFAULT: "var(--color-primary)", /* warm-orange-600 */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* saddle-brown */
          foreground: "var(--color-secondary-foreground)", /* white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* warm-red */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* warm-gray-50 */
          foreground: "var(--color-muted-foreground)", /* warm-gray-500 */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* golden-yellow */
          foreground: "var(--color-accent-foreground)", /* dark-brown */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* white */
          foreground: "var(--color-popover-foreground)", /* dark-brown */
        },
        card: {
          DEFAULT: "var(--color-card)", /* warm-gray-50 */
          foreground: "var(--color-card-foreground)", /* dark-brown */
        },
        success: {
          DEFAULT: "var(--color-success)", /* sage-green */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* golden-yellow */
          foreground: "var(--color-warning-foreground)", /* dark-brown */
        },
        error: {
          DEFAULT: "var(--color-error)", /* warm-red */
          foreground: "var(--color-error-foreground)", /* white */
        },
        'text-primary': "var(--color-text-primary)", /* dark-brown */
        'text-secondary': "var(--color-text-secondary)", /* warm-gray-500 */
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-warm": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "pulse-warm": "pulse-warm 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        'warm': '0 4px 12px rgba(44, 24, 16, 0.08)',
        'warm-sm': '0 2px 8px rgba(44, 24, 16, 0.06)',
        'warm-lg': '0 8px 25px rgba(44, 24, 16, 0.12)',
        'warm-xl': '0 20px 40px rgba(44, 24, 16, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'warm': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}