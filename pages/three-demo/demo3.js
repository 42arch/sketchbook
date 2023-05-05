import {
  AmbientLight,
  BoxGeometry,
  ConeGeometry,
  IcosahedronGeometry,
  Layers,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  ReinhardToneMapping,
  Scene,
  SphereGeometry,
  Vector2,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'

const runDemo = (gui) => {
  const container = document.querySelector('#demo3')
  let width = container.clientWidth
  let height = container.clientHeight

  // create two scene
  const scene = new Scene()
  // const scene2 = new Scene()
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)

  // renderer
  const renderer = new WebGLRenderer({
    antialias: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = ReinhardToneMapping
  renderer.autoClear = false
  container.appendChild(renderer.domElement)

  // objects
  const geometry = new IcosahedronGeometry(1, 1)
  const material = new MeshBasicMaterial({ color: 'purple' })
  const icosahedron = new Mesh(geometry, material)
  icosahedron.position.set(2, 0, 0)
  scene.add(icosahedron)

  const geometry1 = new ConeGeometry(1, 3, 8)
  const material1 = new MeshBasicMaterial({ color: 'yellow' })
  const cone = new Mesh(geometry1, material1)
  cone.position.set(-1, 0, 0)
  scene.add(cone)

  const geometry2 = new SphereGeometry(1, 16, 32)
  const material2 = new MeshBasicMaterial({ color: 'red' })
  const sphere = new Mesh(geometry2, material2)
  sphere.position.set(5, 0, 0)
  scene.add(sphere)

  // effect
  const renderPass = new RenderPass(scene, camera)
  const effectCopy = new ShaderPass(CopyShader)
  effectCopy.renderToScreen = true
  const bloomPass = new UnrealBloomPass(new Vector2(width, height), 3, 0.3, 0.1)
  bloomPass.renderToScreen = true

  const bloomPass2 = new UnrealBloomPass(
    new Vector2(width, height),
    1,
    0.3,
    0.1
  )
  bloomPass2.renderToScreen = true

  const composer = new EffectComposer(renderer)
  composer.setSize(width, height)
  composer.addPass(renderPass)

  composer.addPass(bloomPass2)
  composer.addPass(bloomPass)
  // composer.addPass(effectCopy)

  // control
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  // gui
  // const demo2Folder = gui.addFolder('demo3')

  camera.position.z = 5

  // window.addEventListener('resize', () => {
  //   width = container.clientWidth
  //   height = container.clientHeight
  //   camera.aspect = width / height
  //   camera.updateProjectionMatrix()
  //   renderer.setSize(width, height)
  //   renderer.render(scene1, camera)
  // })

  sphere.layers.enable(1)
  cone.layers.enable(0)
  icosahedron.layers.enable(1)
  // sphere.layers.set(1)
  // cone.layers.set(0)
  // icosahedron.layers.set(1)

  function animate() {
    renderer.clear()
    camera.layers.set(1)
    composer.render()

    renderer.clearDepth()
    camera.layers.set(0)
    // renderer.render(scene, camera)
    composer.render()
    requestAnimationFrame(animate)
  }
  animate()
}

export default runDemo
