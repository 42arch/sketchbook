import {
  AmbientLight,
  BoxGeometry,
  ConeGeometry,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass'

const runDemo = (gui) => {
  const container = document.querySelector('#demo2')
  let width = container.clientWidth
  let height = container.clientHeight

  const scene = new Scene()
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)

  const renderer = new WebGLRenderer()
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // light
  const light = new AmbientLight(0x404040)
  light.position.set(1, 1, 1)
  scene.add(light)

  // control
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  // objects
  const geometry = new IcosahedronGeometry(1, 1)
  const material = new MeshBasicMaterial({ color: 0xffff00 })
  const icosahedron = new Mesh(geometry, material)
  scene.add(icosahedron)

  icosahedron.position.set(2, 0, 0)

  const geometry1 = new ConeGeometry(1, 3, 8)
  const material1 = new MeshBasicMaterial({ color: 'purple' })
  const cone = new Mesh(geometry1, material1)
  scene.add(cone)

  cone.position.set(-1, 0, 0)

  const geometry2 = new SphereGeometry(1, 16, 32)
  const material2 = new MeshBasicMaterial({ color: 'red' })
  const sphere = new Mesh(geometry2, material2)
  scene.add(sphere)

  sphere.position.set(5, 0, 0)

  // effect
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  // add bloompass
  const bloomPass = new UnrealBloomPass(0.5, 0.5, 0.5, 0.5)
  composer.addPass(bloomPass)

  const bokehParams = {
    focus: 0,
    aspect: camera.aspect,
    aperture: 0.05,
    maxblur: 5,
    width,
    height
  }
  const bokehPass = new BokehPass(scene, camera, bokehParams)
  composer.addPass(bokehPass)

  // resolution: any, strength: any, radius: any, threshold: any
  // gui
  const demo2Folder = gui.addFolder('demo2')
  // demo2Folder.add(bloomPass, 'resolution', 0, 1)
  demo2Folder.add(bloomPass, 'strength', 0, 3)
  demo2Folder.add(bloomPass, 'radius', 0, 3)
  demo2Folder.add(bloomPass, 'threshold', -1, 3)

  const matChanger = function () {
    bokehPass.uniforms['focus'].value = bokehParams.focus
    bokehPass.uniforms['aperture'].value = bokehParams.aperture
    bokehPass.uniforms['maxblur'].value = bokehParams.maxblur
  }
  demo2Folder.add(bokehParams, 'focus', 0, 100, 0.1).onChange(matChanger)
  demo2Folder.add(bokehParams, 'aperture', 0, 10, 0.1).onChange(matChanger)
  demo2Folder.add(bokehParams, 'maxblur', 0.0, 0.01, 0.001).onChange(matChanger)

  camera.position.z = 5

  window.addEventListener('resize', () => {
    width = container.clientWidth
    height = container.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.render(scene, camera)
  })

  function animate() {
    requestAnimationFrame(animate)
    composer.render()
  }
  animate()
}

export default runDemo
