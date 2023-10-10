module.exports = {
  mode: "jit",
  content: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
    "./plugins/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        slide: "60 / 23",
        video: "16 / 9",
        background: "240 / 73",
        card: "7 / 5",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        body: ["Montserrat", "sans-serif"],
        mont: ["Montserrat", "sans-serif"],
        teko: ["Teko", "sans-serif"],
        goldman: ["Goldman", "sans-serif"],
        kanit: ["Kanit", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.25rem",
        },
        screens: {
          DEFAULT: "100%",
          sm: "50%",
          lg: "1440px",
        },
      },
      boxShadow: {
        card: "0px 20px 50px rgba(61, 121, 253, 0.1)",
      },
      colors: {
        primary: "#3B41F1",
        secondary: "#0066FF",
        textmain: "#D2DCFF",
        textdark: "#8E90B4",
        border: "#4E5364",
        danger: "#FF002E",
        success: "#00FF00",
        background: "#000",
        "background-secondary": "#13132F80",
        lila: "#AD98FF",
      },
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
        "4k": "3840px",
        "2k": "2560px",
      },
      animation: {
        "ping-slow": "ping-slow 2s ease-in-out infinite",
      },
      keyframes: {
        "ping-slow": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(2)", opacity: "0.1" },
        },
      },
    },
  },
  // plugins: [
  //   require("@tailwindcss/typography"),
  //   require("@tailwindcss/forms"),
  //   require("@tailwindcss/aspect-ratio"),
  //   require("tailwind-scrollbar"),
  // ],
};
