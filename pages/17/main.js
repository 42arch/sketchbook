import {
  AdditiveBlending,
  AmbientLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import data from './../data/terrain.json'
import GUI from 'lil-gui'

/**
 * Debug
 */
const canvas = document.querySelector('canvas.webgl')

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const scene = new Scene()

const camera = new PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, -1, 0.5)
camera.up.set(0, 0, 1)
camera.lookAt(new Vector3(0, 0, 0))
scene.add(camera)

const planeGeometry = new PlaneGeometry(1, 1, 255, 255)
const wireframeMaterial = new MeshBasicMaterial({
  color: 0x2250ff,
  wireframe: true,
  transparent: true,
  depthWrite: false,
  side: DoubleSide,
  blending: AdditiveBlending
})
const wireframe = new Mesh(planeGeometry, wireframeMaterial)
wireframe.name = 'terrain'
scene.add(wireframe)

const heightArray = [].concat.apply([], data).map((elev) => (elev - 350) / 4000)
const positions = planeGeometry.getAttribute('position').array

console.log(9999999, positions)
for (let i = 0; i < positions.length; i++) {
  if ((i + 1) % 3 === 0) {
    positions[i] = heightArray[Math.floor(i / 3)]
  }
}
planeGeometry.computeVertexNormals()

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animate
const tick = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
