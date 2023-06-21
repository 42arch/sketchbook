import SvgGraph from './svg'
import CanvasGraph from './canvas'
import data from './../data/miserables.json'

const options = {
  sticky: true
}

const force = {
  x: 0,
  y: 0,
  collide: null,
  radius: null,
  charge: null
}

const canvasGraph = new CanvasGraph('#canvas-renderer', data, options)
const svgGraph = new SvgGraph('#svg-renderer', data, options)

// canvasGraph.force(force)
