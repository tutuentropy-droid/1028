/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        quantum: {
          950: "#050816",
          900: "#0a0e27",
          800: "#11183d",
          700: "#1a2354",
          600: "#252f6e",
        },
        glow: {
          cyan: "#00d4ff",
          purple: "#9d4edd",
          orange: "#ff6b35",
          green: "#39ff14",
          red: "#ff2e63",
          blue: "#4361ee",
        },
      },
      fontFamily: {
        serif: ['"Lora"', '"Source Han Serif SC"', '"Noto Serif SC"', "serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
        sans: ['"Inter"', '"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.2)',
        'glow-purple': '0 0 20px rgba(157, 78, 221, 0.5), 0 0 40px rgba(157, 78, 221, 0.2)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.5), 0 0 40px rgba(255, 107, 53, 0.2)',
        'glow-green': '0 0 20px rgba(57, 255, 20, 0.5), 0 0 40px rgba(57, 255, 20, 0.2)',
        'glow-red': '0 0 20px rgba(255, 46, 99, 0.5), 0 0 40px rgba(255, 46, 99, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor' },
        },
      },
    },
  },
  plugins: [],
};
