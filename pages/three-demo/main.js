import {
  BoxBufferGeometry,
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three'

// 1
const container1 = document.querySelector('#scene1')
const scene = new Scene()
const camera = new PerspectiveCamera(
  75,
  container1.clientWidth / container1.clientHeight,
  0.1,
  1000
)

const renderer = new WebGLRenderer()
renderer.setSize(container1.clientWidth, container1.clientHeight)
renderer.setPixelRatio(window.devicePixelRatio)
container1.appendChild(renderer.domElement)

const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshBasicMaterial({ color: 'purple' })
const cube = new Mesh(geometry, material)
scene.add(cube)

camera.position.z = 5

function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}

animate()
