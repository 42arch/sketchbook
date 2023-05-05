import {
  AxesHelper,
  MeshBasicMaterial,
  PerspectiveCamera,
  ReinhardToneMapping,
  Scene,
  SphereGeometry,
  Mesh,
  Vector2,
  Vector3,
  WebGLRenderer,
  Box3
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const runDemo = (gui) => {
  const container = document.querySelector('#demo5')
  let width = container.clientWidth
  let height = container.clientHeight

  container.appendChild(document.createElement('button'))

  const scene = new Scene()
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)

  // renderer
  const renderer = new WebGLRenderer({
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = ReinhardToneMapping
  container.appendChild(renderer.domElement)

  const axesHelper = new AxesHelper(2)
  scene.add(axesHelper)

  const colors = [
    'yellow',
    'white',
    'blue',
    'green',
    'cyan',
    'orange',
    'purple',
    'pink'
  ]
  // objects

  // group a
  const objects1 = []
  colors.forEach((color, idx) => {
    const geometry = new SphereGeometry(1, 16, 32)
    const material = new MeshBasicMaterial({ color })
    const sphere = new Mesh(geometry, material)
    sphere.position.set(idx * 3, 0, 0)
    scene.add(sphere)
    objects1.push(sphere)
  })

  // group b
  const objects2 = []
  const objects3 = []
  colors.forEach((color, idx) => {
    const geometry = new SphereGeometry(1, 16, 32)
    const material = new MeshBasicMaterial({ color })
    const sphere = new Mesh(geometry, material)
    sphere.position.set(idx * 3, 8, 8)
    scene.add(sphere)
    if (color === 'green') {
      objects3.push(sphere)
    }
    objects2.push(sphere)
  })
  // control
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  //events
  const size = new Vector3()
  const center = new Vector3()
  const box = new Box3()
  function fitCameraToSelection(camera, controls, selection, fitOffset = 1.2) {
    box.makeEmpty()
    for (const object of selection) {
      box.expandByObject(object)
    }

    box.getSize(size)
    box.getCenter(center)

    const maxSize = Math.max(size.x, size.y, size.z)
    const fitHeightDistance =
      maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360))
    const fitWidthDistance = fitHeightDistance / camera.aspect
    const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance)

    const direction = controls.target
      .clone()
      .sub(camera.position)
      .normalize()
      .multiplyScalar(distance)

    controls.maxDistance = distance * 10
    controls.target.copy(center)

    camera.near = distance / 100
    camera.far = distance * 100
    camera.updateProjectionMatrix()

    camera.position.copy(controls.target).sub(direction)

    controls.update()
  }

  document.querySelector('#group1').addEventListener('click', () => {
    // fitToBBox(objects1)
    fitCameraToSelection(camera, controls, objects1)
  })
  document.querySelector('#group2').addEventListener('click', () => {
    // fitToBBox(objects2)
    console.log('ggg', objects3)
    fitCameraToSelection(camera, controls, objects3)
  })

  // gui
  // const demo2Folder = gui.addFolder('demo3')

  camera.position.z = 20

  window.addEventListener('resize', () => {
    width = container.clientWidth
    height = container.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.render(scene, camera)
  })

  function animate() {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  animate()
}

export default runDemo
