module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'elektronik-red': '#D4293D',
        'elektronik-blue': '#5992ca',
      },
      screens: {
        xxs: '420px',
        xs: '600px',
        print: { raw: 'print' },
      },
    },
  },
  plugins: [],
};
