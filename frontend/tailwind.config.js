/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      width: {
        '1280': '1280px'
      },
      fontSize: {
        fz_14: '14px'
      },
      backgroundColor: {
        primary: '#77DADA',
        primary_dark: '#0e4f4f'
      },
      colors: {
        primary: '#0e4f4f',
        ab_text: '#475467',
        tx_base: '#101828',
        primary_base: '#77DADA'
      },
      borderRadius: {
        '100': '100px'
      },
      boxShadow: {
        shadow_sm: '0px 1px 2px 0px rgba(16, 24, 40, .06), 0px 1px 3px 0px rgba(16, 24, 40, .1)',
        button: 'rgb(6.3% 9.4% 16% / 0.05) 0px 1px 2px 0px'
      },
      borderColor: {
        button: 'rgb(92% 93% 94%)'
      }
    },
  },
  plugins: [],
}

