import {
  AdditiveBlending,
  AmbientLight,
  AxesHelper,
  ConeGeometry,
  DirectionalLight,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshLambertMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera, scene, renderer
let pointLight

const objects = [],
  materials = []

init()
animate()

function init() {
  const container = document.querySelector('#graph')
  let width = container.clientWidth
  let height = container.clientHeight
  scene = new Scene()
  camera = new PerspectiveCamera(75, width / height, 0.1, 10000)
  camera.position.set(0, 200, 800)

  const helper = new GridHelper(1000, 40, 0x303030, 0x303030)
  helper.position.y = -75
  scene.add(helper)

  // materials
  const texture = new Texture(generateTexture())
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true

  materials.push(new MeshLambertMaterial({ map: texture, transparent: true }))
  materials.push(new MeshLambertMaterial({ color: 0xdddddd }))
  materials.push(
    new MeshPhongMaterial({
      color: 0xdddddd,
      specular: 0x009900,
      shininess: 30,
      flatShading: true
    })
  )
  materials.push(new MeshNormalMaterial())
  materials.push(
    new MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      blending: AdditiveBlending
    })
  )
  // materials.push(new MeshLambertMaterial({ color: 0xdddddd }))

  materials.push(
    new MeshPhongMaterial({
      color: 0xdddddd,
      specular: 0x009900,
      shininess: 30,
      map: texture,
      transparent: true
    })
  )
  materials.push(new MeshNormalMaterial({ flatShading: true }))
  materials.push(new MeshBasicMaterial({ color: 0xffaa00, wireframe: true }))
  materials.push(new MeshDepthMaterial())
  materials.push(
    new MeshLambertMaterial({ color: 0x666666, emissive: 0xff0000 })
  )
  materials.push(
    new MeshPhongMaterial({
      color: 0x000000,
      specular: 0x666666,
      emissive: 0xff0000,
      shininess: 10,
      opacity: 0.9,
      transparent: true
    })
  )
  materials.push(new MeshBasicMaterial({ map: texture, transparent: true }))

  renderer = new WebGLRenderer()
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // control
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  const geometry = new SphereGeometry(30, 32, 16)
  for (let i = 0, l = materials.length; i < l; i++) {
    addMesh(geometry, materials[i])
  }

  console.log(8888, objects)

  // lights
  const light = new AmbientLight(0x404040)
  light.position.set(1, 1, 1)
  scene.add(light)

  const directionalLight = new DirectionalLight(0xffffff, 0.125)

  directionalLight.position.x = Math.random() - 0.5
  directionalLight.position.y = Math.random() - 0.5
  directionalLight.position.z = Math.random() - 0.5
  directionalLight.position.normalize()

  // scene.add(directionalLight)

  pointLight = new PointLight(0xffffff, 1)
  scene.add(pointLight)
  pointLight.add(
    new Mesh(
      new SphereGeometry(4, 8, 8),
      new MeshBasicMaterial({ color: 0xffffff })
    )
  )
}

function addMesh(geometry, material) {
  const mesh = new Mesh(geometry, material)
  mesh.position.x = (objects.length % 4) * 200 - 400
  mesh.position.z = Math.floor(objects.length / 4) * 200 - 200

  objects.push(mesh)
  scene.add(mesh)
}

function generateTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const context = canvas.getContext('2d')
  const image = context.getImageData(0, 0, 256, 256)

  let x = 0,
    y = 0

  for (let i = 0, j = 0, l = image.data.length; i < l; i += 4, j++) {
    x = j % 256
    y = x === 0 ? y + 1 : y

    image.data[i] = 255
    image.data[i + 1] = 255
    image.data[i + 2] = 255
    image.data[i + 3] = Math.floor(x ^ y)
  }
  context.putImageData(image, 0, 0)
  return canvas
}

function animate() {
  render()
  requestAnimationFrame(animate)
}

function render() {
  const timer = 0.0001 * Date.now()

  for (let i = 0, l = objects.length; i < l; i++) {
    const object = objects[i]

    object.rotation.x += 0.01
    object.rotation.y += 0.005
  }

  pointLight.position.x = Math.sin(timer * 7) * 300
  pointLight.position.y = Math.cos(timer * 5) * 400
  pointLight.position.z = Math.cos(timer * 3) * 300
  renderer.render(scene, camera)
}
