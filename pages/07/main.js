import * as d3 from 'd3'

class Blob {
  constructor(id, color, complexity, contrast) {
    this.id = id
    this.color = color
    this.margin = { top: 20, right: 30, bottom: 20, left: 30 }
    this.complexity = complexity
    this.contrast = contrast
    this.data = this.updateData(this.complexity, this.contrast)

    console.log(22222, this.data)
    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight
    this.boundWidth = this.width - this.margin.right - this.margin.left
    this.boundHeight = this.height - this.margin.top - this.margin.bottom
    this.wrapper = null
    this.content = null
    this.path = null
    this.render()
  }

  render() {
    this.wrapper = d3
      .select(this.id)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height])

    this.content = this.wrapper
      .append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`)

    this.path = this.content
      .append('path')
      .attr('d', this.radarLine(this.data))
      .attr('fill', this.color)
      .attr('fill-opacity', 0.2)
      .attr('stroke', this.color)
      .attr('stroke-width', 2)
  }

  radarLine(data) {
    const maxValue = 10
    const rScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([0, this.height / 2])
    const angleSlice = (Math.PI * 2) / data.length

    return d3
      .lineRadial()
      .curve(d3.curveCardinalClosed)
      .radius((d) => rScale(d))
      .angle((d, i) => i * angleSlice)(data)
  }

  updateData(n, c) {
    const maxValue = 10,
      minValue = 0,
      offset = 1
    const noise = Array.from({ length: n }, d3.randomNormal(0, c))
    const base = Array(n).fill(5)
    const vals = d3.zip(base, noise).map((vals) => d3.sum(vals))
    console.log(1111, vals)
    return vals.map((d) =>
      d < minValue + offset
        ? minValue + offset
        : d > maxValue - offset
        ? maxValue - offset
        : d
    )
  }
}

const blob = new Blob('#blob', '#08BDBA', 12, 0.5)
