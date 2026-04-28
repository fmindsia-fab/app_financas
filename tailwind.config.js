// tailwind.config.js – custom design tokens for app_financas
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // enable class‑based dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // blue‑500 – primary actions
        secondary: "#3b82f6", // blue‑500 – secondary actions
        accent: "#a855f7", // violet‑500 – accents / highlights
        background: "#0f172a", // slate‑900 – dark background
        "background-light": "#f1f5f9", // slate‑100 – light background
        surface: "#1e293b", // slate‑800 – cards / surfaces
        danger: "#ef4444", // red‑500 – error states
    success: "#10b981" // emerald‑500 – positive financial status
      },
      spacing: {
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        5: "1.25rem",
        6: "1.5rem",
        8: "2rem",
        10: "2.5rem",
        12: "3rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
        40: "10rem",
        48: "12rem"
      },
      fontFamily: {
        sans: ["Bricolage Grotesque", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
