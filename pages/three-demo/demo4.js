import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  BufferGeometry,
  Color,
  ConeGeometry,
  IcosahedronGeometry,
  Layers,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  ReinhardToneMapping,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'

const runDemo = (gui) => {
  const container = document.querySelector('#demo4')
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

  const axesHelper = new AxesHelper(2)
  scene.add(axesHelper)

  // create line
  const points = []
  points.push(new Vector3(-5, 0, 0))
  points.push(new Vector3(0, 5, 0))
  points.push(new Vector3(5, 0, 0))
  const lineGeometry = new BufferGeometry().setFromPoints(points)
  const lineMaterial = new LineBasicMaterial({ color: 0xffffff })
  const line = new Line(lineGeometry, lineMaterial)
  scene.add(line)
  const color = new Color(0xffffff)
  let time = 0

  const points2 = []
  points2.push(new Vector3(-3, 0, 0))
  points2.push(new Vector3(0, 3, 0))
  points2.push(new Vector3(3, 0, 0))

  const lineGeometry2 = new BufferGeometry().setFromPoints(points2)
  // 定义着色器代码
  const vertexShader = `
    varying vec3 vPos;
    void main() {
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform vec3 color;
    uniform float time;
    varying vec3 vPos;
    void main() {
      float t = abs(sin(time + vPos.y));
      gl_FragColor = vec4(color * t, 1.0);
    }
  `

  const lineMaterial2 = new ShaderMaterial({
    uniforms: {
      color: { value: new Color(0xffffff) },
      time: { value: 0 }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  })

  const line2 = new Line(lineGeometry2, lineMaterial2)
  scene.add(line2)

  // effect
  const renderPass = new RenderPass(scene, camera)
  const effectCopy = new ShaderPass(CopyShader)
  effectCopy.renderToScreen = true
  const bloomPass = new UnrealBloomPass(new Vector2(width, height), 3, 0.3, 0.1)
  bloomPass.renderToScreen = true

  const composer = new EffectComposer(renderer)
  composer.setSize(width, height)
  composer.addPass(renderPass)
  composer.addPass(bloomPass)

  // control
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  // gui
  // const demo2Folder = gui.addFolder('demo3')

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
    // 计算闪烁效果
    const t = Math.abs(Math.sin(time))
    color.r = t
    color.g = t
    color.b = t
    line.material.color = color

    time += 0.05

    // 更新时间和颜色
    lineMaterial2.uniforms.time.value += 0.05
    lineMaterial2.uniforms.color.value.setRGB(
      Math.random(),
      Math.random(),
      Math.random()
    )

    // renderer.render(scene, camera)
    composer.render()
    requestAnimationFrame(animate)
  }
  animate()
}

export default runDemo
