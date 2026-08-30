/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090D16", // Obsidian Charcoal
        surface: {
          DEFAULT: "#0F172A",
          elevated: "#131D31",
          highlight: "#18243C",
          subtle: "#0C121E",
        },
        border: {
          DEFAULT: "#1E293B",
          subtle: "#162032",
          focus: "#6366F1",
          bright: "#334155",
        },
        primary: {
          DEFAULT: "#6366F1", // Indigo
          hover: "#4F46E5",
          light: "#818CF8",
          dark: "#3730A3",
          subtle: "rgba(99, 102, 241, 0.12)",
        },
        secondary: {
          DEFAULT: "#8B5CF6", // Violet
          hover: "#7C3AED",
          light: "#A78BFA",
          subtle: "rgba(139, 92, 246, 0.12)",
        },
        accent: {
          emerald: "#10B981", // Success
          amber: "#F59E0B",
          rose: "#F43F5E",
          cyan: "#06B6D4",
        },
        text: {
          DEFAULT: "#F8FAFC",
          muted: "#94A3B8", // Slate
          dim: "#64748B",
          inverse: "#090D16",
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle-glow': '0 0 35px -5px rgba(99, 102, 241, 0.15)',
        'surface-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'elevated-card': '0 10px 30px -5px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(99, 102, 241, 0.15)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
