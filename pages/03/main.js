import ForceGraph3D from '3d-force-graph'
import * as d3 from 'd3'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import graphData from '../data/blocks.json'
// import graphData from '../data/assets.json'

// see detail: https://github.com/vasturiano/3d-force-graph

const forceRadius = (nodes, R = 1) => {
  return () => {
    for (let n of nodes) {
      const r = Math.hypot(n.x, n.y, n.z)
      const u = Math.pow(r ? Math.sqrt(R / r) : 1, 0.01)
      n.x *= u
      n.y *= u
      n.z *= u
    }
  }
}

const width = d3.select('#graph').node().offsetWidth
const height = d3.select('#graph').node().offsetHeight
let distance = 800

const bloomPass = new UnrealBloomPass()
bloomPass.strength = 1
bloomPass.radius = 1
bloomPass.threshold = 0.01

const graph = ForceGraph3D()(document.querySelector('#graph'))
  // .backgroundColor('#fff')
  .height(height)
  .width(width)
  .showNavInfo(false)
  // .linkSource('start')
  // .linkTarget('end')
  .linkWidth(1)
  .linkOpacity(0.1)
  .linkDirectionalArrowColor('black')
  .linkDirectionalArrowLength(3)
  .linkDirectionalArrowRelPos(1)
  .nodeLabel('id')
  .nodeOpacity(1)
  .nodeRelSize(5)
  .nodeResolution(10)
  .nodeAutoColorBy('user')
  .onNodeDragEnd((node) => {
    node.fx = node.x
    node.fy = node.y
    node.fz = node.z
  })
  .graphData(graphData)
  .d3Force(
    'collision',
    d3.forceCollide((node) => Math.cbrt(node.size) * 5)
  )
  .d3AlphaDecay(0.01)
  .d3VelocityDecay(0.3)
  .d3Force('radius', null)
  .onNodeClick((node) => {
    console.log('node clicked', node)
    const distance = 100
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
    const newPos =
      node.x || node.y || node.z
        ? {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio
          }
        : { x: 0, y: 0, z: distance } // special case if node is in (0,0,0)
    graph.cameraPosition(
      newPos, // new position
      node, // lookAt ({ x, y, z })
      3000 // ms transition duration
    )
  })
  .cameraPosition({
    z: distance
  })

graph.postProcessingComposer().addPass(bloomPass)

let isSphere = false
let isRotate = false
document.getElementById('style').addEventListener('click', () => {
  if (!isSphere) {
    graph
      .graphData(graphData)
      .d3Force('radius', forceRadius(graphData.nodes, 320))
  } else {
    graph.graphData(graphData).d3Force('radius', null)
  }
  isSphere = !isSphere
})

let angle = 0
setInterval(() => {
  if (isRotate) {
    graph.cameraPosition({
      x: distance * Math.sin(angle),
      z: distance * Math.cos(angle)
    })
    angle += Math.PI / 300
  }
}, 10)

document.getElementById('rotate').addEventListener('click', () => {
  isRotate = !isRotate
  // if (isRotate) {
  //   graph.enableNodeDrag(false).enableNavigationControls(false, )
  // } else {
  //   graph.enableNodeDrag(true).enableNavigationControls(true)
  // }
})

document.getElementById('fit').addEventListener('click', () => {
  graph.zoomToFit()
})
