import * as d3 from 'd3'

class Voronoi {
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
    this.delaunay = null
    this.voronoi = null

    this.render()
  }

  render() {
    this.canvas = d3
      .select(this.id)
      .append('canvas')
      .attr('width', this.width * this.dpi)
      .attr('height', this.height * this.dpi)
    // .style('width', `${this.width}px`)
    // .style('height', `${this.height}px`)
    this.ctx = this.canvas.node().getContext('2d')
    this.ctx.scale(this.dpi, this.dpi)

    this.delaunay = d3.Delaunay.from(this.data)
    this.voronoi = this.delaunay.voronoi([
      1,
      1,
      this.width - 1,
      this.height - 1
    ])

    for (let i = 0; i < this.data.length; i++) {
      this.renderItem(i)
      this.ctx.canvas.ontouchmove = this.ctx.canvas.onmousemove = (e) => {
        const h = this.delaunay.find(e.layerX, e.layerY)
        this.renderItem(h)
      }
    }
  }

  renderItem(index) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    if (index >= 0) {
      this.ctx.fillStyle = '#0f0'
      this.ctx.beginPath()
      this.voronoi.renderCell(index, this.ctx)
      this.ctx.fill()

      const v = [...this.voronoi.neighbors(index)]
      const d = [...this.delaunay.neighbors(index)]
      const u = d.filter((j) => !v.includes(j))

      this.ctx.fillStyle = '#ff0'
      this.ctx.beginPath()
      for (let j of u) this.voronoi.renderCell(j, this.ctx)
      this.ctx.fill()

      this.ctx.fillStyle = '#cfc'
      this.ctx.beginPath()
      for (let j of v) this.voronoi.renderCell(j, this.ctx)
      this.ctx.fill()

      this.ctx.beginPath()
      for (let j of d) {
        this.ctx.moveTo(...this.data[index])
        this.ctx.lineTo(...this.data[j])
      }
      this.ctx.strokeStyle = '#292'
      this.ctx.stroke()

      this.ctx.strokeStyle = '#000'
      this.ctx.beginPath()
      this.voronoi.render(this.ctx)
      this.voronoi.renderBounds(this.ctx)
      this.ctx.stroke()
    }

    this.ctx.fillStyle = '#000'
    this.ctx.beginPath()
    d3.geoPath(null, this.ctx).pointRadius(2.5)({
      type: 'MultiPoint',
      coordinates: this.data
    })
    this.ctx.fill()
  }
}

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
    this.delaunay = null
    this.voronoi = null

    this.render()
  }

  render() {
    this.canvas = d3
      .select(this.id)
      .append('canvas')
      .attr('width', this.width * this.dpi)
      .attr('height', this.height * this.dpi)

    this.ctx = this.canvas.node().getContext('2d')
    this.ctx.scale(this.dpi, this.dpi)

    this.delaunay = d3.Delaunay.from(this.data)
    this.voronoi = this.delaunay.voronoi([
      1,
      1,
      this.width - 1,
      this.height - 1
    ])

    for (let i = 0; i < this.data.length; i++) {
      this.renderItem(i)
      this.ctx.canvas.ontouchmove = this.ctx.canvas.onmousemove = (e) => {
        const h = this.delaunay.find(e.layerX, e.layerY)
        this.renderItem(h)
      }
    }
  }

  renderItem(index) {
    this.ctx.clearRect(0, 0, this.width, this.height)

    if (index >= 0) {
      // this.ctx.fillStyle = '#0f0'
      // this.ctx.beginPath()
      // this.voronoi.renderCell(index, this.ctx)
      // this.ctx.fill()

      const v = [...this.voronoi.neighbors(index)]
      const d = [...this.delaunay.neighbors(index)]
      const u = d.filter((j) => !v.includes(j))

      // this.ctx.fillStyle = '#ff0'
      // this.ctx.beginPath()
      // for (let j of u) this.voronoi.renderCell(j, this.ctx)
      // this.ctx.fill()

      // this.ctx.fillStyle = '#cfc'
      // this.ctx.beginPath()
      // for (let j of v) this.voronoi.renderCell(j, this.ctx)
      // this.ctx.fill()

      this.ctx.beginPath()
      for (let j of d) {
        this.ctx.moveTo(...this.data[index])
        this.ctx.lineTo(...this.data[j])
      }
      this.ctx.strokeStyle = '#292'
      this.ctx.stroke()

      this.ctx.strokeStyle = '#000'
      this.ctx.beginPath()
      this.delaunay.render(this.ctx)
      this.delaunay.renderHull(this.ctx)
      this.voronoi.renderBounds(this.ctx)
      this.ctx.stroke()

      for (let p in this.data) {
        const curPoint = this.data[+p]
        if (+p !== index) {
          this.ctx.fillStyle = '#000'
          this.ctx.beginPath()
          this.ctx.arc(...curPoint, 2.5, 0, 2 * Math.PI, false)
          this.ctx.fill()
          this.ctx.closePath()
        } else {
          this.ctx.fillStyle = '#0f0'
          this.ctx.beginPath()
          this.ctx.arc(...curPoint, 4, 0, 2 * Math.PI, false)
          this.ctx.fill()
          this.ctx.closePath()
        }
      }

      // this.delaunay.renderPoints(this.ctx)
      this.ctx.fill()
    }
  }
}

function generateRandomPoints(num, width, height) {
  return Array.from({ length: num }, () => [
    Math.random() * width,
    Math.random() * height
  ])
}

const points = generateRandomPoints(100, 600, 800)

const voronoi = new Voronoi('#voronoi', points, {})
const delaunay = new Delaunay('#delaunay', points, {})
