<script setup>
import * as THREE from "three";
import vertexShaderCode from "~/assets/shaders/vertexShader";
import fragmentShaderCode from "~/assets/shaders/fragmentShader";
const vertexShader = ref(vertexShaderCode);
const fragmentShader = ref(fragmentShaderCode);

let Theme = { _darkred: 0x000000 };

let scene, camera, renderer, container;
let start = Date.now();
let _width, _height;
const containerRef = ref(null);
let options = {
  perlin: {
    vel: 0.002,
    speed: 0.0005,
    perlins: 1.0,
    decay: 0.1,
    complex: 0.3,
    waves: 20.0,
    eqcolor: 11.0,
    fragment: true,
    redhell: true,
  },
  spin: {
    sinVel: 0.0,
    ampVel: 80.0,
  },
};

function createWorld() {
  _width = window.innerWidth;
  _height = window.innerHeight;
  //---
  scene = new THREE.Scene();
  //scene.fog = new THREE.Fog(Theme._darkred, 8, 20);
  scene.background = new THREE.Color(Theme._darkred);
  //---
  camera = new THREE.PerspectiveCamera(55, _width / _height, 1, 1000);
  camera.position.z = 12;
  //---
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(_width, _height);
  //---
  // container = document.getElementById("container");
  container = containerRef.value;
  container.appendChild(renderer.domElement);
  //---
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  _width = window.innerWidth;
  _height = window.innerHeight;
  renderer.setSize(_width, _height);
  camera.aspect = _width / _height;
  camera.updateProjectionMatrix();
  console.log("- resize -");
}

let mat;
var primitiveElement = function () {
  this.mesh = new THREE.Object3D();
  mat = new THREE.ShaderMaterial({
    wireframe: false,
    //fog: true,
    uniforms: {
      time: {
        type: "f",
        value: 0.0,
      },
      pointscale: {
        type: "f",
        value: 0.0,
      },
      decay: {
        type: "f",
        value: 0.0,
      },
      complex: {
        type: "f",
        value: 0.0,
      },
      waves: {
        type: "f",
        value: 0.0,
      },
      eqcolor: {
        type: "f",
        value: 0.0,
      },
      fragment: {
        type: "i",
        value: true,
      },
      redhell: {
        type: "i",
        value: true,
      },
    },
    vertexShader: vertexShader.value,
    fragmentShader: fragmentShader.value,
  });

  let geo = new THREE.IcosahedronGeometry(3, 110);

  let mesh = new THREE.Points(geo, mat);

  //---
  this.mesh.add(mesh);
};
function createPrimitive() {
  _primitive = new primitiveElement();
  scene.add(_primitive.mesh);
}

let _primitive;

function createGUI() {
  const { $createGUI } = useNuxtApp();

  let gui = $createGUI();
  let camGUI = gui.addFolder("Camera");
  //cam.add(, 'speed', 0.0, 30.00).listen();
  camGUI.add(camera.position, "z", 3, 20).name("Zoom").listen();
  camGUI.add(options.perlin, "vel", 0.0, 0.02).name("Velocity").listen();
  //camGUI.open();

  let mathGUI = gui.addFolder("Math Options");
  mathGUI.add(options.spin, "sinVel", 0.0, 0.5).name("Sine").listen();
  mathGUI.add(options.spin, "ampVel", 0.0, 90.0).name("Amplitude").listen();
  //mathGUI.open();

  let perlinGUI = gui.addFolder("Setup Perlin Noise");
  perlinGUI.add(options.perlin, "perlins", 1.0, 5.0).name("Size").step(1);
  perlinGUI.add(options.perlin, "speed", 0.0, 0.0005).name("Speed").listen();
  perlinGUI.add(options.perlin, "decay", 0.0, 1.0).name("Decay").listen();
  perlinGUI.add(options.perlin, "waves", 0.0, 20.0).name("Waves").listen();
  perlinGUI.add(options.perlin, "fragment", true).name("Fragment");
  perlinGUI.add(options.perlin, "complex", 0.1, 1.0).name("Complex").listen();
  perlinGUI.add(options.perlin, "redhell", true).name("Electroflow");
  perlinGUI.add(options.perlin, "eqcolor", 0.0, 15.0).name("Hue").listen();
  perlinGUI.open();
}

function animation() {
  requestAnimationFrame(animation);
  let performance = Date.now() * 0.003;

  _primitive.mesh.rotation.y += options.perlin.vel;
  _primitive.mesh.rotation.x =
    (Math.sin(performance * options.spin.sinVel) *
      options.spin.ampVel *
      Math.PI) /
    180;
  //---
  mat.uniforms["time"].value = options.perlin.speed * (Date.now() - start);
  mat.uniforms["pointscale"].value = options.perlin.perlins;
  mat.uniforms["decay"].value = options.perlin.decay;
  mat.uniforms["complex"].value = options.perlin.complex;
  mat.uniforms["waves"].value = options.perlin.waves;
  mat.uniforms["eqcolor"].value = options.perlin.eqcolor;
  mat.uniforms["fragment"].value = options.perlin.fragment;
  mat.uniforms["redhell"].value = options.perlin.redhell;
  //---
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}
onMounted(() => {
  createWorld();
  createPrimitive();
  createGUI();
  animation();
});
onUnmounted(() => {
  const { $destroyGUI } = useNuxtApp();

  $destroyGUI();
});
</script>
<template>
  <div class="relative w-full">
    <div
      class="absolute bottom-5 left-5 z-20 whitespace-nowrap font-goldman text-xl font-bold text-white"
    >
      Perlin Noise
    </div>
    <div
      class="container-ref z-10 w-full"
      ref="containerRef"
      id="container"
    ></div>
  </div>
</template>
<style>
.container-ref canvas {
  width: 100% !important;
  max-height: calc(100vh - 60px) !important;
}
.close-button.close-bottom {
  background-color: #fff !important;
  border: 1px solid #000 !important;
  color: #000 !important;
}
</style>
