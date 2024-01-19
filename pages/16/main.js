import {
  AmbientLight,
  BoxGeometry,
  CircleGeometry,
  Color,
  DoubleSide,
  Fog,
  GridHelper,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SpotLight,
  SpotLightHelper,
  Vector2,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap, { Power1 } from 'gsap'
import GUI from 'lil-gui'
import { mathRandom } from './utils'

/**
 * Debug
 */
const gui = new GUI()
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
let setColor = 0xf02050
let createCarPos = true

let setTintNum = true

function setTintColor() {
  if (setTintNum) {
    setTintNum = false
    setColor = 0x000000
  } else {
    setTintNum = true
    setColor = 0x000000
  }
  return setColor
}

function createCarLines(scale = 2, pos = 20, color = 0xffff00) {
  const mat = new MeshToonMaterial({ color: color, side: DoubleSide })
  const geo = new BoxGeometry(1, scale / 40, scale / 40)
  const elem = new Mesh(geo, mat)
  const cAmp = 3

  if (createCarPos) {
    createCarPos = false
    elem.position.x = -pos
    elem.position.z = mathRandom(cAmp)
    gsap.to(elem.position, 5, {
      z: pos,
      repeat: -1,
      yoyo: true,
      delay: mathRandom(3)
    })
  } else {
    createCarPos = true
    elem.position.x = mathRandom(cAmp)
    elem.position.z = -pos
    elem.rotation.y = (90 * Math.PI) / 180
    gsap.to(elem.position, 5, {
      z: pos,
      repeat: -1,
      yoyo: true,
      delay: mathRandom(3),
      ease: Power1.easeInOut
    })
  }
  elem.receiveShadow = true
  elem.castShadow = true
  elem.position.y = Math.abs(mathRandom(5))
  city.add(elem)
}

const canvas = document.querySelector('canvas.webgl')
const scene = new Scene()

scene.background = new Color(setColor)
scene.fog = new Fog(setColor, 10, 36)

// City
const city = new Object3D()
const smoke = new Object3D()
const town = new Object3D()

scene.add(city)
city.add(smoke)

// Buildings
for (let i = 1; i < 42 * 3; i++) {
  const segments = 2
  const geo = new BoxGeometry(1, 1, 1, segments, segments, segments)
  const mat = new MeshStandardMaterial({
    color: setTintColor(),
    wireframe: false,
    roughness: 0.3,
    metalness: 1,
    side: DoubleSide
  })
  const wMat = new MeshLambertMaterial({
    color: 0xfefefe,
    wireframe: true,
    transparent: true,
    opacity: 0.03,
    side: DoubleSide
  })

  const cube = new Mesh(geo, mat)
  const floor = new Mesh(geo, mat)
  const wFloor = new Mesh(geo, wMat)

  cube.add(wFloor)
  cube.castShadow = true
  cube.receiveShadow = true
  // cube.rotation.set(0.1 + Math.abs(mathRandom(8)))
  floor.scale.y = 0.05
  cube.scale.y = 0.1 + Math.abs(mathRandom(8))

  const cubeWidth = 0.9
  cube.scale.x = cube.scale.z = cubeWidth + mathRandom(1 - cubeWidth)
  cube.position.x = Math.round(mathRandom())
  cube.position.z = Math.round(mathRandom())
  floor.position.set(cube.position.x, 0, cube.position.z)

  town.add(floor)
  town.add(cube)
}

// Grid Helper
const gridHelper = new GridHelper(60, 120, 0xff0000, 0x000000)
city.add(gridHelper)

// Particular
const pMaterial = new MeshToonMaterial({ color: 0xffff00, side: DoubleSide })
const pGeometry = new CircleGeometry(0.01, 3)

for (let i = 1; i < 300; i++) {
  const particular = new Mesh(pGeometry, pMaterial)
  particular.position.set(mathRandom(5), mathRandom(5), mathRandom(5))
  particular.rotation.set(mathRandom(), mathRandom(), mathRandom())
  smoke.add(particular)
}

const pMat = new MeshPhongMaterial({
  color: 0x000000,
  side: DoubleSide,
  opacity: 0.9,
  transparent: true
})
const pGeo = new PlaneGeometry(60, 60)
const pEle = new Mesh(pGeo, pMat)
pEle.rotation.x = (-90 * Math.PI) / 180
pEle.position.y = -0.001
pEle.receiveShadow = true
city.add(pEle)

// Car Lines
for (let i = 0; i < 60; i++) {
  createCarLines(0.1, 20)
}

// Lights
const ambientLight = new AmbientLight(0xffffff, 4)
const frontLight = new SpotLight(0xffffff, 10, 30)
const backLight = new PointLight(0xffffff, 0.5)
frontLight.rotation.x = (45 * Math.PI) / 180
frontLight.rotation.z = (-45 * Math.PI) / 180
frontLight.position.set(5, 10, 15)
frontLight.castShadow = true
frontLight.shadow.mapSize.width = 6000
frontLight.shadow.mapSize.height = 6000
frontLight.penumbra = 0.1
backLight.position.set(0, 6, 0)
const spotLightHelper = new SpotLightHelper(frontLight)
// scene.add(spotLightHelper)

smoke.position.y = 2
scene.add(ambientLight)
city.add(frontLight)
city.add(town)
scene.add(backLight)

const camera = new PerspectiveCamera(20, sizes.width / sizes.height, 1, 500)
camera.position.set(0, 4, 22)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2 - 0.1
controls.minDistance = 15
controls.maxDistance = 30
controls.enableRotate = false

// Renderer
const renderer = new WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.width = 2048
renderer.shadowMap.height = 2048

renderer.shadowMap.bias = 0.003
renderer.shadowMap.type = PCFSoftShadowMap
renderer.shadowMap.needsUpdate = true

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

// Mouse Events
const mouse = new Vector2()
function onMouseMove(event) {
  event.preventDefault()
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
}
function onDocumentTouchStart(event) {
  if (event.touches.length == 1) {
    event.preventDefault()
    mouse.x = event.touches[0].pageX - window.innerWidth / 2
    mouse.y = event.touches[0].pageY - window.innerHeight / 2
  }
}
function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault()
    mouse.x = event.touches[0].pageX - window.innerWidth / 2
    mouse.y = event.touches[0].pageY - window.innerHeight / 2
  }
}
window.addEventListener('mousemove', onMouseMove, false)
window.addEventListener('touchstart', onDocumentTouchStart, false)
window.addEventListener('touchmove', onDocumentTouchMove, false)

// Animate
const uSpeed = 0.001
const tick = () => {
  city.rotation.y -= (mouse.x * 8 - camera.rotation.y) * uSpeed
  city.rotation.x -= (-(mouse.y * 2) - camera.rotation.x) * uSpeed
  if (city.rotation.x < -0.05) {
    city.rotation.x = -0.05
  } else if (city.rotation.x > 1) {
    city.rotation.x = 1
  }

  smoke.rotation.y += 0.01
  smoke.rotation.x += 0.01

  camera.lookAt(city.position)

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
