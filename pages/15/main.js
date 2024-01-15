import {
  AdditiveBlending,
  Clock,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import getStarField from './getStarField'
import { getFresnelMat } from './getFresnelMat'

/**
 * Debug
 */
const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')
const scene = new Scene()

const loader = new TextureLoader()

const earthGroup = new Group()
earthGroup.rotation.z = (-23.4 * Math.PI) / 180
scene.add(earthGroup)
const geometry = new IcosahedronGeometry(1, 12)
const material = new MeshPhongMaterial({
  map: loader.load('/assets/textures/earth/earthmap1k.jpg'),
  specularMap: loader.load('/assets/textures/earth/earthspec1k.jpg'),
  bumpMap: loader.load('/assets/textures/earth/earthbump1k.jpg'),
  bumpScale: 0.04
})
const earthMesh = new Mesh(geometry, material)
earthGroup.add(earthMesh)

const lightsMat = new MeshBasicMaterial({
  map: loader.load('/assets/textures/earth/earthlights1k.jpg'),
  blending: AdditiveBlending
})
const lightsMesh = new Mesh(geometry, lightsMat)
earthGroup.add(lightsMesh)

const cloudMat = new MeshStandardMaterial({
  map: loader.load('/assets/textures/earth/earthcloudmap.jpg'),
  transparent: true,
  opacity: 0.8,
  blending: AdditiveBlending,
  alphaMap: loader.load('/assets/textures/earth/earthcloudmaptrans.jpg')
})
const cloudMesh = new Mesh(geometry, cloudMat)
cloudMesh.scale.setScalar(1.003)
earthGroup.add(cloudMesh)

const freshnelMat = getFresnelMat()
const glowMesh = new Mesh(geometry, freshnelMat)
glowMesh.scale.setScalar(1.01)
earthGroup.add(glowMesh)

const stars = getStarField(1000)
scene.add(stars)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

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

// Light
const sunLight = new DirectionalLight(0xffffff)
sunLight.position.set(-2, 0.5, 1.5)
scene.add(sunLight)

const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  earthMesh.rotation.y += 0.002
  lightsMesh.rotation.y += 0.002
  cloudMesh.rotation.y += 0.0023
  glowMesh.rotation.y += 0.002
  stars.rotation.y -= 0.0002
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
