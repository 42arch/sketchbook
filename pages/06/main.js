import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols'
import GUI from 'lil-gui'
import galaxtVertexShader from './shaders/galaxy/vertex.glsl'
import galaxyFragmentShader from './shaders/galaxy/fragment.glsl'

const gui = new GUI({
  title: 'galaxy',
  resizable: true,
  closeFolders: true
})

const canvas = document.querySelector('canvas.webgl')

const scene = new Scene()

// Galaxy
const parameters = {}
parameters.count = 200000
parameters.size = 0.005
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.5
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
  console.log('Generating Galaxy')

  if (points !== null) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  geometry = new BufferGeometry()
  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)
  const scales = new Float32Array(parameters.count * 1)
  const randomness = new Float32Array(parameters.count * 3)

  const colorInside = new Color(parameters.insideColor)
  const colorOutside = new Color(parameters.outsideColor)

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3
    // position
    const radius = Math.random() * parameters.radius
    const spinAngle = radius * parameters.spin
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2

    positions[i3] = Math.cos(branchAngle) * radius
    positions[i3 + 1] = 0
    positions[i3 + 2] = Math.sin(branchAngle) * radius

    // Randomness
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius

    randomness[i3] = randomX
    randomness[i3 + 1] = randomY
    randomness[i3 + 2] = randomZ

    // color
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b

    // scale
    scales[i] = Math.random()
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('color', new BufferAttribute(colors, 3))
  geometry.setAttribute('aScale', new BufferAttribute(scales, 1))
  geometry.setAttribute('aRandomness', new BufferAttribute(randomness, 3))

  material = new ShaderMaterial({
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
    vertexShader: galaxtVertexShader,
    fragmentShader: galaxyFragmentShader,
    uniforms: {
      uTime: {
        value: 0
      },
      uSize: {
        value: 30 * renderer.getPixelRatio()
      }
    }
  })

  /**
   * Points
   */
  points = new Points(geometry, material)
  scene.add(points)
}

gui
  .add(parameters, 'count')
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'radius')
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'branches')
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'randomness')
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'randomnessPower')
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

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

const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(3, 3, 3)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

generateGalaxy()

const clock = new Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  material.uniforms.uTime.value = elapsedTime

  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
