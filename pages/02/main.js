import SvgGraph from './svg'
import CanvasGraph from './canvas'
import data from './../data/miserables.json'

new CanvasGraph('#canvas-renderer', data)
new SvgGraph('#svg-renderer', data)
