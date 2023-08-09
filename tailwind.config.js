/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./src/**/*.{html,js,ts,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['v-sans, v-mono, other-fallbacks'],
      }
    },
  },
  plugins: [],
}

