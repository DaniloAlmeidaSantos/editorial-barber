/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: ["selector", ".dark"],
  theme: {
    extend: {
      colors: {
        "outline": "#a38c7c",
        "surface-container-low": "#1c1b1b",
        "on-tertiary-fixed": "#001d32",
        "surface-dim": "#131313",
        "on-error-container": "#ffdad6",
        "outline-variant": "#554336",
        "surface": "#131313",
        "on-secondary-container": "#abb9d1",
        "surface-variant": "#353535",
        "tertiary-fixed-dim": "#96ccff",
        "surface-container-lowest": "#0e0e0e",
        "on-background": "#e5e2e1",
        "on-secondary": "#233144",
        "on-surface-variant": "#dbc2b0",
        "primary": "#ffb77d",
        "primary-container": "#d97707",
        "background": "#131313",
        "surface-container": "#20201f",
        "error-container": "#93000a",
        "surface-tint": "#ffb77d",
        "inverse-primary": "#904d00",
        "on-tertiary-container": "#002c48",
        "on-secondary-fixed-variant": "#3a485b",
        "secondary": "#b9c7df",
        "surface-bright": "#393939",
        "primary-fixed-dim": "#ffb77d",
        "primary-fixed": "#ffdcc3",
        "on-error": "#690005",
        "tertiary": "#96ccff",
        "error": "#ffb4ab",
        "inverse-surface": "#e5e2e1",
        "on-tertiary": "#003353",
        "on-secondary-fixed": "#0d1c2e",
        "tertiary-fixed": "#cee5ff",
        "surface-container-high": "#2a2a2a",
        "inverse-on-surface": "#313030",
        "on-primary": "#4d2600",
        "surface-container-highest": "#353535",
        "on-tertiary-fixed-variant": "#004a75",
        "on-primary-fixed-variant": "#6e3900",
        "secondary-fixed": "#d5e3fc",
        "secondary-container": "#3c4a5e",
        "on-surface": "#e5e2e1",
        "on-primary-fixed": "#2f1500",
        "tertiary-container": "#0297e8",
        "secondary-fixed-dim": "#b9c7df",
        "on-primary-container": "#432100"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "montserrat": ["Montserrat", "sans-serif"],
        "inter": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards"
      }
    },
  },
  plugins: [],
}