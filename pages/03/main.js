import ForceGraph3D from '3d-force-graph'
import * as d3 from 'd3'
import graphData from './data.json'

// see detail: https://github.com/vasturiano/3d-force-graph

const forceRadius = (nodes, R = 1) => {
  return () => {
    for (let n of nodes) {
      const r = Math.hypot(n.x, n.y, n.z)
      const u = Math.pow(r ? Math.sqrt(R / r) : 1, 0.05)
      n.x *= u
      n.y *= u
      n.z *= u
    }
  }
}

const graph = ForceGraph3D()

graph(document.querySelector('#graph'))
  .backgroundColor('#fff')
  .height(600)
  .linkWidth(1)
  .linkOpacity(0.2)
  .linkDirectionalArrowColor('black')
  .linkDirectionalArrowLength(3)
  .linkDirectionalArrowRelPos(1)
  .nodeLabel('id')
  .nodeOpacity(0.8)
  .nodeRelSize(5)
  .nodeAutoColorBy('group')
  // .nodeColor((node) => {
  //   return 'red'
  // })
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
  .d3VelocityDecay(0.3)
  .d3Force('radius', forceRadius(graphData.nodes, 320))
  .onNodeClick((e) => {
    console.log('node clicked', e)
  })
