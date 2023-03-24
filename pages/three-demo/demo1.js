import {
  AxesHelper,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'

const runDemo1 = (gui) => {
  // 1
  const container1 = document.querySelector('#demo1')
  let width1 = container1.clientWidth
  let height1 = container1.clientHeight
  const scene1 = new Scene()
  const camera1 = new PerspectiveCamera(75, width1 / height1, 0.1, 1000)

  // renderer
  const renderer1 = new WebGLRenderer()
  renderer1.setSize(width1, height1)
  renderer1.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container1.appendChild(renderer1.domElement)

  const geometry1 = new BoxGeometry(1, 1, 1)
  const material1 = new MeshBasicMaterial({ color: 'purple' })
  const cube1 = new Mesh(geometry1, material1)
  scene1.add(cube1)

  const axesHelper1 = new AxesHelper(2)
  scene1.add(axesHelper1)

  // control
  const controls1 = new OrbitControls(camera1, renderer1.domElement)
  controls1.update()

  // effect
  const composer1 = new EffectComposer(renderer1)
  composer1.addPass(new RenderPass(scene1, camera1))
  const outlinePass1 = new OutlinePass(
    new Vector2(width1, height1),
    scene1,
    camera1
  )
  outlinePass1.selectedObjects = [cube1]
  composer1.addPass(outlinePass1)

  // debug
  const demo1Folder = gui.addFolder('demo1')
  demo1Folder.add(cube1.position, 'y', -3, 3, 0.01)
  demo1Folder
    .add(cube1.position, 'x')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('alignment')
  demo1Folder.add(material1, 'wireframe')
  demo1Folder.add(axesHelper1, 'visible')
  demo1Folder.addColor(material1, 'color')
  // responsive
  window.addEventListener('resize', () => {
    width1 = container1.clientWidth
    height1 = container1.clientHeight
    camera1.aspect = width1 / height1
    camera1.updateProjectionMatrix()
    renderer1.setSize(width1, height1)
    renderer1.render(scene1, camera1)
  })

  camera1.position.z = 5

  // animation
  function animate() {
    requestAnimationFrame(animate)
    // cube.rotation.x += 0.01
    cube1.rotation.y += 0.01
    // renderer1.render(scene1, camera1)
    composer1.render()
  }
  animate()
}

export default runDemo1
