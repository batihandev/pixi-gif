<script setup lang="ts">
import * as PIXI from "pixi.js";
import { createNoise2D } from "simplex-noise";
import debounce from "lodash.debounce";
import hsl from "hsl-to-hex";
import { KawaseBlurFilter } from "@pixi/filter-kawase-blur";
const noise2D = createNoise2D();

const orbPool = [];
const maxOrbs = 10; // Adjust this number based on your needs

function random(min, max) {
  return Math.random() * (max - min) + min;
}
function map(n, start1, end1, start2, end2) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}
// ColorPalette class
class ColorPalette {
  constructor() {
    // Predefined hue values for the specified colors
    this.hueChoices = [215, 230, 235, 320];
    this.currentHueIndex = 0; // Initialize the index
    this.setCustomProperties();
  }

  randomColor() {
    // Get the current hue from the choices
    const currentHue = this.hueChoices[this.currentHueIndex];
    // Increment the index for the next call
    this.currentHueIndex = (this.currentHueIndex + 1) % this.hueChoices.length;

    // Convert the hue to an HSL color
    const color = hsl(currentHue, 95, 50);
    return color.replace("#", "0x");
  }

  setCustomProperties() {
    // No need to set custom properties since you have predefined hues
  }
}
// Orb class
class Orb {
  // Pixi takes hex colors as hexidecimal literals (0x rather than a string with '#')
  constructor(fill = 0x000000) {
    // bounds = the area an orb is "allowed" to move within
    this.bounds = this.setBounds();
    // initialise the orb's { x, y } values to a random point within it's bounds
    this.x = random(this.bounds["x"].min, this.bounds["x"].max);
    this.y = random(this.bounds["y"].min, this.bounds["y"].max);

    // how large the orb is vs it's original radius (this will modulate over time)
    this.scale = 1;

    // what color is the orb?
    this.fill = fill;

    // the original radius of the orb, set relative to window height
    this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

    // starting points in "time" for the noise/self similar random values
    this.xOff = random(0, 1000);
    this.yOff = random(0, 1000);
    // how quickly the noise/self similar random values step through time
    this.inc = 0.002;

    // PIXI.Graphics is used to draw 2d primitives (in this case a circle) to the canvas
    this.graphics = new PIXI.Graphics();
    this.graphics.alpha = 0.825;

    // 250ms after the last window resize event, recalculate orb positions.
    window.addEventListener(
      "resize",
      debounce(() => {
        this.bounds = this.setBounds();
      }, 250)
    );
  }

  setBounds() {
    // Calculate the center of the screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate the maximum distance from the center
    const maxDist =
      window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;

    // Allow each orb to move within a circle around the center
    return {
      x: {
        min: centerX - maxDist,
        max: centerX + maxDist,
      },
      y: {
        min: centerY - maxDist,
        max: centerY + maxDist,
      },
    };
  }

  update() {
    // Generate noise values once per frame
    const xNoise = noise2D(this.xOff, this.xOff);
    const yNoise = noise2D(this.yOff, this.yOff);
    const scaleNoise = noise2D(this.xOff, this.yOff);

    // Map the noise values to the orb's properties
    const mappedX = map(
      xNoise,
      -1,
      1,
      this.bounds["x"].min,
      this.bounds["x"].max
    );
    const mappedY = map(
      yNoise,
      -1,
      1,
      this.bounds["y"].min,
      this.bounds["y"].max
    );
    const mappedScale = map(scaleNoise, -1, 1, 0.5, 1);

    // Update orb properties
    this.x = mappedX;
    this.y = mappedY;
    this.scale = mappedScale;

    // Step through "time"
    this.xOff += this.inc;
    this.yOff += this.inc;
  }
  reset(fill) {
    this.fill = fill;
    this.radius = random(window.innerHeight / 6, window.innerHeight / 3);
    this.xOff = random(0, 1000);
    this.yOff = random(0, 1000);
    this.scale = 1;
    this.x = random(this.bounds["x"].min, this.bounds["x"].max);
    this.y = random(this.bounds["y"].min, this.bounds["y"].max);
  }

  isOutOfBounds() {
    return (
      this.x < this.bounds["x"].min ||
      this.x > this.bounds["x"].max ||
      this.y < this.bounds["y"].min ||
      this.y > this.bounds["y"].max
    );
  }
  render() {
    // update the PIXI.Graphics position and scale values
    this.graphics.x = this.x;
    this.graphics.y = this.y;
    this.graphics.scale.set(this.scale);

    // clear anything currently drawn to graphics
    this.graphics.clear();

    // tell graphics to fill any shapes drawn after this with the orb's fill color
    this.graphics.beginFill(this.fill);
    // draw a circle at { 0, 0 } with it's size set by this.radius
    this.graphics.drawCircle(0, 0, this.radius);
    // let graphics know we won't be filling in any more shapes
    this.graphics.endFill();
  }
}
const canvas = ref(null);
onMounted(() => {
  const app = new PIXI.Application({
    // render to <canvas class="orb-canvas"></canvas>
    view: canvas.value,
    // auto adjust size to fit the current window
    resizeTo: window,
    // transparent background, we will be creating a gradient background later using CSS
    backgroundAlpha: 0,
  });
  app.stage.filters = [new KawaseBlurFilter(30, 10, true)];
  const colorPalette = new ColorPalette();

  for (let i = 0; i < maxOrbs; i++) {
    const orb = new Orb(colorPalette.randomColor());
    app.stage.addChild(orb.graphics);
    orbPool.push(orb);
  }
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    app.ticker.maxFPS = 30; // Set the maxFPS to 10
    app.ticker.add(() => {
      orbPool.forEach((orb) => {
        // Check if orb is outside the bounds
        if (orb.isOutOfBounds()) {
          // Remove the orb from the stage
          app.stage.removeChild(orb.graphics);

          // Reset the orb and push it back into the pool
          orb.reset(colorPalette.randomColor());
          app.stage.addChild(orb.graphics);
        }
        orb.update();
        orb.render();
      });
    });
  } else {
    orbs.forEach((orb) => {
      orb.update();
      orb.render();
    });
  }
  const numFrames = 40; // Adjust as needed
  const orbCanvas = canvas.value;
  const { $createGif } = useNuxtApp();
  const gif = $createGif();
  let frameCounter = 0;
  const frameDelay = 100; // 100ms per frame (adjust as needed)
  let rendered = false;
  function captureFrame() {
    if (frameCounter < numFrames) {
      gif.addFrame(orbCanvas, { copy: true, delay: frameDelay });
      frameCounter++;
      requestAnimationFrame(captureFrame);
    } else {
      // If we've captured all frames, finish the GIF
      gif.render();
      rendered = true;
    }
  }
  if (!rendered) {
    captureFrame();
  }
  gif.on("finished", function (blob) {
    // Create a download link for the GIF
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "animated_orbs.gif";
    a.textContent = "Download GIF";
    console.log("finished");
    // Append the download link to the DOM
    document.body.appendChild(a);
  });
});
</script>
<template>
  <div>
    <canvas
      ref="canvas"
      class="orb-canvas !bg-transparent"
      style="background-color: transparent"
    ></canvas>
  </div>
</template>
