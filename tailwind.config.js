/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        card: "var(--card)",
        "card-shadow": "var(--card-shadow)",
        text: "var(--text)",
        accent: "var(--accent)",
        "divider": "var(--divider)",
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px var(--accent)',
      }
    },
  },
  plugins: [],
}
