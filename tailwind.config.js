/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        yankees: {
          900: "#0B132B",
          800: "#1A2849",
          700: "#16213E",
        },
        accent: {
          yellow: "#FFC857",
          blue: "#3A6EA5",
        }
      },
      boxShadow: {
        soft: "0 8px 20px rgba(0,0,0,0.35)",
      },
      animation: {
        fade: "fade 0.6s ease-out",
      },
      keyframes: {
        fade: {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
