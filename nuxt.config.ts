import * as fs from "fs";
const isSecure = fs.existsSync("./ssl.key");
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "@nuxt/image-edge",
    "@nuxtjs/google-fonts",
  ],
  tailwindcss: {
    // Options
  },
  typescript: {
    shim: false,
    strict: true,
  },
  googleFonts: {
    preconnect: true,
    download: true,
    inject: true,
    display: "swap",
    families: {
      Teko: {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
      Goldman: {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
      Kanit: {
        wght: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
    },
  },
  app: {
    head: {
      titleTemplate: "Test",
      meta: [
        {
          name: "msapplication-TileColor",
          content: "#00A3E0",
        },
        {
          name: "theme-color",
          content: "#ffffff",
        },
        {
          name: "description",
          content: "Empowering AI Technologies, Join The Movement.",
        },
        {
          property: "og:url",
          content: "#",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:title",
          content: "Test",
        },
        {
          property: "og:description",
          content: "Empowering AI Technologies, Join The Movement.",
        },
      ],
      // link: [
      //   {
      //     rel: "apple-touch-icon",
      //     sizes: "180x180",
      //     href: "/apple-touch-icon.png",
      //   },
      //   {
      //     rel: "icon",
      //     type: "image/png",
      //     sizes: "16x16",
      //     href: "/favicon-16x16.png",
      //   },
      //   {
      //     rel: "icon",
      //     type: "image/png",
      //     sizes: "32x32",
      //     href: "/favicon-32x32.png",
      //   },
      //   {
      //     rel: "manifest",
      //     href: "/site.webmanifest",
      //   },
      // ],
    },
  },
  css: ["mosha-vue-toastify/dist/style.css"],
  plugins: [{ src: "~/plugins/gif-plugin.js", mode: "client" }],

  vite: {
    server: isSecure
      ? {
          https: {
            key: fs.readFileSync("./ssl.key"),
            cert: fs.readFileSync("./ssl.crt"),
          },
          hmr: {
            protocol: "wss",
          },
        }
      : {},
    logLevel: "info",
    optimizeDeps: {
      include: ["@headlessui/vue", "vue", "pinia"],
    },
    define: {
      // Add the raw loader settings
      "process.env": {},
    },
  },
});
