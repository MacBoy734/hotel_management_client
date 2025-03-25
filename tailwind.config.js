/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'md2': '897px',
        'sm2': '450px'
      },
      backgroundImage: {
        'image1' : "url('/images/image_2.jpg')",
        'image2' : "url('/images/image_3.jpg')",
        'image3' : "url('/images/image_4.jpg')",
        'image4' : "url('/images/image_5.jpg')",
        'image5' : "url('/images/image_6.jpg')"
      },
      colors: {
        'custom-bg1': 'rgb(25, 42, 92)',
        'custom-bg2': 'rgb(1, 108, 127)',
        'custom-bg3': 'rgb(166, 35, 12)',
        'custom-color1': 'rgb(11, 5, 102)'
      },
      inset: {
        '40': '45%'
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        merriweather: ['Merriweather', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        sniglet: ['Sniglet', 'sans-serif']
      }
    },
  },
  plugins: [],
}

