import {
  AdditiveBlending,
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Debug
 */
const canvasDom = document.querySelector('canvas#renderer1')
const sizes = {
  width: canvasDom.innerWidth,
  height: canvasDom.innerHeight
}

// const canvas = document.querySelector('canvas#renderer1')
const scene = new Scene()

const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5
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

const mesh = new Mesh()
mesh.geometry = new BoxGeometry(1, 1, 1)
mesh.material = new MeshStandardMaterial({ color: 0x00ff00 })

scene.add(mesh)

// scene.add(wireframe)

// Lights
const ambientLight = new AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new DirectionalLight(0xffffff, 0.5)
scene.add(directionalLight)

// Controls
const controls = new OrbitControls(camera, canvasDom)
controls.enableDamping = true

// Renderer
const renderer = new WebGLRenderer({
  canvas: canvasDom,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// window.addEventListener('resize', () => {
//   // Update sizes
//   sizes.width = canvasDom.innerWidth
//   sizes.height = canvasDom.innerHeight

//   // Update camera
//   camera.aspect = sizes.width / sizes.height
//   camera.updateProjectionMatrix()

//   // Update renderer
//   renderer.setSize(sizes.width, sizes.height)
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

// Animate
const tick = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
