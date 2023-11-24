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
      // this.ctx.strokeStyle = '#000'
      // this.voronoi.renderCell(i, this.ctx)
      // this.ctx.stroke()

      const v = [...this.voronoi.neighbors(i)]
      const d = [...this.delaunay.neighbors(i)]
      const u = d.filter((j) => !v.includes(j))
      console.log('1111', u)

      const cell = this.voronoi.cellPolygon(i)
      this.ctx.fillStyle = '#fff'
      this.ctx.beginPath()
      this.ctx.moveTo(cell[0][0], cell[0][1])
      for (let j = 1; j < cell.length; j++) {
        this.ctx.lineTo(cell[j][0], cell[j][1])
      }
      this.ctx.closePath()
      this.ctx.fill()
      this.ctx.strokeStyle = '#000'
      this.ctx.stroke()
      this.ctx.closePath()

      const p = this.data[i]
      this.ctx.beginPath()
      this.ctx.arc(...p, 2, 2 * Math.PI, false)
      this.ctx.fillStyle = '#000'
      this.ctx.fill()
      this.ctx.closePath()

      this.ctx.canvas.ontouchmove = this.ctx.canvas.onmousemove = (e) => {
        const h = this.delaunay.find(e.layerX, e.layerY)
        console.log('move', h)

        // const cell = this.voronoi.cellPolygon(h)
        // this.ctx.fillStyle = '#040'
        // this.ctx.beginPath()
        // this.ctx.moveTo(cell[0][0], cell[0][1])
        // for (let j = 1; j < cell.length; j++) {
        //   this.ctx.lineTo(cell[j][0], cell[j][1])
        // }
        // this.ctx.closePath()
        // this.ctx.fill()

        // this.ctx.closePath()
      }
    }
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
