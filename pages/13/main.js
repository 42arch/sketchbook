import * as d3 from 'd3'

class Delaunay {
  constructor(id, data, options) {
    this.id = id
    this.data = data
    this.options = options
    this.dpi = window.devicePixelRatio || 1
    this.width = d3.select(this.id).node().offsetWidth || 0
    this.height = d3.select(this.id).node().offsetHeight || 0
    this.canvas = null
    this.ctx = null
    this.path = null
    this.delaunay = d3.Delaunay.from(this.data)
    this.voronoi = this.delaunay.voronoi([
      0.5,
      0.5,
      this.width - 0.5,
      this.height - 0.5
    ])

    this.render()
  }

  render() {
    this.canvas = d3
      .select(this.id)
      .append('canvas')
      .attr('width', this.width * this.dpi)
      .attr('height', this.height * this.dpi)
      .style('width', `${this.width}px`)
      .style('height', `${this.height}px`)
    this.ctx = this.canvas.node().getContext('2d')
    this.ctx.scale(this.dpi, this.dpi)
    // this.path = d3.geoPath(null, this.ctx).pointRadius(2.5)

    this.data.forEach((i) => {
      this.ctx.strokeStyle = '#000'
      this.ctx.beginPath()
      this.voronoi.render(this.ctx)
      this.voronoi.renderBounds(this.ctx)

      this.ctx.stroke()

      this.ctx.fillStyle = '#000'
      this.ctx.beginPath()
      d3.geoPath(null, this.ctx).pointRadius(2.5)({
        type: 'MultiPoint',
        coordinates: this.data
      })
      this.ctx.fill()
    })
  }
}

function generateRandomPoints(num, width, height) {
  return Array.from({ length: num }, () => [
    Math.random() * width,
    Math.random() * height
  ])
}

const points = generateRandomPoints(100, 600, 600)

console.log(23333, points)

const delaunay = new Delaunay('#chart', points, {})
