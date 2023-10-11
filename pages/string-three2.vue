<template>
  <div ref="canvasContainer"></div>
</template>

<script setup>
import * as THREE from "three";

const SEPARATION = 40;
const AMOUNTX = 130;
const AMOUNTY = 35;

const canvasContainer = ref(null);
let camera, scene, renderer;
let particles = [];
let particle;
let count = 0;

let windowHalfX;
let windowHalfY;

const init = () => {
  if (canvasContainer.value) {
    canvasContainer.value.className += canvasContainer.value.className
      ? " waves"
      : "waves";
  }

  camera = new THREE.PerspectiveCamera(
    120,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.y = 150;
  camera.position.z = 300;
  camera.rotation.x = 0.35;

  scene = new THREE.Scene();

  particles = new Array();

  const PI2 = Math.PI * 2;
  const material = new THREE.SpriteMaterial({
    color: 0x939393,
    program: function (context) {
      context.beginPath();
      context.arc(0, 0, 0.1, 0, PI2, true);
      context.fill();
    },
  });

  let i = 0;

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      particle = particles[i++] = new THREE.Sprite(material);
      particle.position.x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
      particle.position.z = iy * SEPARATION - (AMOUNTY * SEPARATION - 10);
      scene.add(particle);
    }
  }

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  canvasContainer.value.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize, false);
};

const onWindowResize = () => {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const animate = () => {
  requestAnimationFrame(animate);
  render();
};

const render = () => {
  let i = 0;

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      particle = particles[i++];
      particle.position.y =
        Math.sin((ix + count) * 0.5) * 20 + Math.sin((iy + count) * 0.5) * 20;
      particle.scale.x = particle.scale.y =
        (Math.sin((ix + count) * 0.3) + 2) * 4 +
        (Math.sin((iy + count) * 0.5) + 1) * 4;
    }
  }

  renderer.render(scene, camera);

  // This increases or decreases speed
  count += 0.1;
};

onMounted(() => {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  init();
  animate();
});

onUnmounted(() => {
  // Clean up and remove event listeners if needed.
});
</script>
