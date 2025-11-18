/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#1e40af",
        success: "#10b981",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
