import GIF from "gif.js/dist/gif";
console.log(GIF.workersPath);
GIF.workersPath = "/node_modules/gif.js/dist/"; // Replace with the correct path

export default defineNuxtPlugin(() => {
  const gif = new GIF({
    workers: 6,
    quality: 1,
    width: 1920,
    height: 1080,
    transparent: "ffffff00",
    repeat: -1,
  });
  return {
    provide: {
      createGif: () => gif,
    },
  };
});
