module.exports = {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  darkMode: "class", // use .dark on html
  theme: {
    extend: {
      colors: {
        xceed: {
          50: '#f5f8ff',
          500: '#0f62fe',
          700: '#0846b4'
        }
      }
    }
  },
  plugins: []
}
