/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        github: {
          black: '#010409',
          gray: '#161b22',
          white: '#f0f6fc',
        },
      },
    },
  },
  plugins: [],
};
