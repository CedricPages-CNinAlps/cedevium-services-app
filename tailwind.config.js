/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: '#DC582A',
        'blue-night': '#1E1A34',
        // Ajoutez vos couleurs personnalisées ici :
        'custom-red': '#FF0000',
        'custom-blue': '#0066CC',
        'brand-primary': '#2563EB',
        'brand-secondary': '#7C3AED',
      },
    },
  },
  plugins: [],
}
