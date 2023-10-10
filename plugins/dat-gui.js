import * as dat from "dat.gui";

export default defineNuxtPlugin(() => {
  let gui;
  const createGUI = () => {
    gui = new dat.GUI();
    return gui;
  };
  const destroyGUI = () => {
    gui.destroy();
  };
  // let camGUI = gui.addFolder("Camera");
  // let mathGUI = gui.addFolder("Math Options");
  // let perlinGUI = gui.addFolder("Setup Perlin Noise");

  // Function to hide the GUI

  return {
    provide: {
      createGUI,
      destroyGUI,
    },
  };
});
