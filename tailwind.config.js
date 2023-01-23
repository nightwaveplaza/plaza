/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/desktop/index.html',
    './src/desktop/**/*.{js,scss,vue}',
    './src/mobile/index.html',
    './src/mobile/**/*.{js,scss,vue}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
