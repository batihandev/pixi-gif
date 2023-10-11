<script setup lang="ts"></script>
<template>
  <div>page</div>
</template>
<!-- <script setup>
import * as THREE from "three";
import waveFragmentShader from "~/assets/shaders/waveFragmentShader";
import waveVertexShader from "~/assets/shaders/waveVertexShader";

const pointCvs = ref(null);
let scene, camera, renderer;
class Time {
  constructor() {
    this.ticks = [];
    this.tweens = [];
    this.isStop = false;
    TIME.addBody(this);
  }

  /**
   * 该物体灭亡
   */
  destory() {
    TIME.removeBody(this);
  }

  /**
   * 帧更新
   * @param timegap 与上一帧的时间间隔
   */
  addTick(fn) {
    var tick = { fn: fn.bind(this) };

    tick.isStop = false;
    this.ticks.push(tick);
    return tick;
  }

  removeTick(tick) {
    if (!tick) {
      // remove all
      this.ticks = [];
      return;
    }

    var index = this.ticks.indexOf(tick);

    if (index !== -1) {
      this.ticks.splice(index, 1);
    }
  }

  /**
   * tween
   */
  addTween(tween) {
    this.tweens.push(tween);
  }

  removeTween(tween) {
    if (!tween) {
      // remove all
      this.tween = [];
      return;
    }

    var index = this.tweens.indexOf(tween);

    if (index !== -1) {
      //tween.stop();
      this.tweens.splice(index, 1);
    }
  }

  // stop 暂停时间
  stop() {
    this.isStop = true;
    this.tweens.forEach(function (tween) {
      tween.stop();
    });
  }

  start() {
    this.isStop = false;
    this.tweens.forEach(function (tween) {
      tween.start();
    });
  }
}
class Wave extends Time {
  constructor(options) {
    super();

    let defaults = {
      color: "#ffffff",
      opacity: 1,
      position: new THREE.Vector3(),
      xCount: 100,
      zCount: 100,

      xDis: 200,
      zDis: 200,

      size: 1, // 点大小
      frequency1: 0.2,
      frequency2: 0.1,

      maxWaveHeight1: 10,
      minWaveHeight1: 3,
      maxWaveHeight2: 8,
      minWaveHeight2: 5,

      initOffset1: 0,
      initOffset2: 0,
      offsetSpeed1: 2,
      offsetSpeed2: 4,
      offsetSign: 1, // -1 or 1
    };

    for (let key in defaults) {
      options[key] = options[key] || defaults[key];
    }
    options.xStep = options.xDis / options.xCount;
    options.zStep = options.zDis / options.zCount;

    this.options = options;

    this.tick;

    this.offset1 = options.initOffset1;
    this.offset2 = options.initOffset2;

    this.particlePositions;
    this.obj = this.create();
  }

  create() {
    let options = this.options;

    let particlesGeom = new THREE.BufferGeometry();
    let particlePositions = new Float32Array(
      options.xCount * options.zCount * 3
    );

    let uniforms = {
      texture: {
        value: new THREE.CanvasTexture(pointCvs),
      },
      color: {
        value: new THREE.Color(options.color),
      },
      opacity: {
        type: "float",
        value: options.opacity,
      },
      size: {
        type: "float",
        value: options.size * 10,
      },
      frequency1: {
        type: "float",
        value: options.frequency1,
      },
      frequency2: {
        type: "float",
        value: options.frequency2,
      },
      offset1: {
        type: "float",
        value: 0,
      },
      offset2: {
        type: "float",
        value: 0,
      },
      waveHeight1: {
        type: "float",
        value: 0,
      },
      waveHeight2: {
        type: "float",
        value: 0,
      },
    };

    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: waveVertexShader,
      fragmentShader: waveFragmentShader,

      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });

    let count = 0;
    for (let x = 0; x < options.xCount; x++) {
      for (let z = 0; z < options.zCount; z++) {
        particlePositions[count++] = x * options.xStep;
        particlePositions[count++] = 0; // y
        particlePositions[count++] = z * options.zStep;
      }
    }

    this.particlePositions = particlePositions;

    particlesGeom.setDrawRange(0, options.xCount * options.zCount);
    particlesGeom.addAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3).setDynamic(true)
    );
    particlesGeom.computeBoundingBox();
    particlesGeom.center();

    let points = new THREE.Points(particlesGeom, shaderMaterial);
    points.position.copy(options.position);
    points.rotation.y = Math.random() * 0.2;

    return points;
  }

  start() {
    this.tick = this.addTick(this.update);

    let that = this;
    function changeWHP(waveHeight) {
      that.obj.material.uniforms.waveHeight1.value = waveHeight.waveHeight1;
      that.obj.material.uniforms.waveHeight2.value = waveHeight.waveHeight2;
      // console.log(this.waveHeight1);
    }

    let waveHeight = {
      waveHeight1: this.options.minWaveHeight1,
      waveHeight2: this.options.minWaveHeight2,
    };
    let tween1 = new TWEEN.Tween(waveHeight)
      .to(
        {
          waveHeight1: this.options.maxWaveHeight1,
          waveHeight2: this.options.maxWaveHeight2,
        },
        3000
      )
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(changeWHP);

    let tween2 = new TWEEN.Tween(waveHeight)
      .to(
        {
          waveHeight1: this.options.minWaveHeight1,
          waveHeight2: this.options.minWaveHeight2,
        },
        3000
      )
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(changeWHP);

    this.addTween(tween1);
    // this.addTween(tween2);
    tween1.chain(tween2);
    tween2.chain(tween1);
    tween1.start();
  }

  stop() {
    this.removeTick(this.tick);
  }

  update(delta) {
    let options = this.options;
    let second = delta / 1000;
    let particlePositions = this.particlePositions;

    this.obj.material.uniforms.offset1.value +=
      second * options.offsetSpeed1 * options.offsetSign;
    this.obj.material.uniforms.offset2.value +=
      second * options.offsetSpeed2 * options.offsetSign;
  }
}
class Ani extends Time {
  constructor() {
    super();
    this.waves = [];
    this.tick;

    this.scene = new THREE.Scene(); //场景

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    ); //透视相机
    this.camera.position.set(0, 6, 150); //相机位置
    this.scene.add(this.camera); //add到场景中
    // this.scene.fog = new THREE.Fog(0x000000, 100, 500);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    }); //渲染
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, (window.innerWidth * 9) / 16);
    document.querySelector("body").appendChild(this.renderer.domElement); //将渲染Element添加到Dom中
  }

  resize() {
    // console.log(1);
    this.camera.aspect = 16 / 9;
    this.renderer.setSize(window.innerWidth, (window.innerWidth * 9) / 16);
  }

  addWave(wave) {
    this.waves.push(wave);
    this.scene.add(wave.obj);
  }

  start() {
    this.waves.forEach((w) => w.start());
    this.tick = this.addTick(this.update);
  }

  stop() {
    this.removeTick(this.tick);
  }

  update() {
    this.renderer.render(this.scene, this.camera);
  }
}
let wave1 = new Wave({
  color: 0x3062ff,
  opacity: 0.7,
  position: new THREE.Vector3(),
  xCount: 300,
  zCount: 300,
  xDis: 200, // x 宽
  zDis: 200, // z 宽
  size: 0.6, // 点大小
  frequency1: 0.03,
  frequency2: 0.06,

  maxWaveHeight1: 8,
  minWaveHeight1: 3,
  maxWaveHeight2: 6,
  minWaveHeight2: 3,

  initOffset1: 0,
  initOffset2: 0,
  offsetSpeed1: 0.6,
  offsetSpeed2: 0.4,
  offsetSign: 1, // -1 or 1
});
let wave2 = new Wave({
  color: 0x3bdee0,
  opacity: 0.2,
  position: new THREE.Vector3(0, 6, -50),
  xCount: 180,
  zCount: 180,
  xDis: 200, // x 宽
  zDis: 200, // z 宽
  size: 0.4, // 点大小
  frequency1: 0.06,
  frequency2: 0.052,

  maxWaveHeight1: 6,
  minWaveHeight1: 4,
  maxWaveHeight2: 4,
  minWaveHeight2: 2,

  initOffset1: 0,
  initOffset2: 0,
  offsetSpeed1: 0.3,
  offsetSpeed2: 0.1,
  offsetSign: -1, // -1 or 1
});

// const init = () => {
//   scene = new THREE.Scene();
//   camera = new THREE.PerspectiveCamera(
//     60,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   );
//   camera.position.set(0, 6, 150);

//   renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//   renderer.setClearColor(0x000000, 0);
//   renderer.setSize(window.innerWidth, (window.innerWidth * 9) / 16);

//   pointCvs.value.appendChild(renderer.domElement);

//   // Add your Three.js objects and animations here
//   // For example, create and add your waves.

//   // ...

//   animate();
// };

// const animate = () => {
//   const animateFrame = () => {
//     // Update your Three.js objects here
//     // For example, update the positions of your waves.

//     // ...

//     renderer.render(scene, camera);

//     window.requestAnimationFrame(animateFrame);
//   };

//   animateFrame();
// };

onMounted(() => {
  let ani = new Ani();
  ani.addWave(wave1);
  ani.addWave(wave2);

  ani.start();

  window.addEventListener("resize", () => {
    // console.log(1132);
    ani.resize();
  });

  window.TIME.start();
});

onUnmounted(() => {
  // Clean up and remove event listeners if needed.
});
</script>
<template>
  <div ref="canvasContainer"></div>
</template> -->
