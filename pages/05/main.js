import * as d3 from 'd3'

class CartesianCoordinate {
  constructor(id) {
    this.id = id
    this.margin = { top: 20, right: 30, bottom: 30, left: 40 }
    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight
    this.boundWidth = this.width - this.margin.right - this.margin.left
    this.boundHeight = this.height - this.margin.top - this.margin.bottom
    this.wrapper = null
    this.bounds = null

    this.render()
  }

  render() {
    this.wrapper = d3
      .select(this.id)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height])
    this.bounds = this.wrapper
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

    this.bounds.append('g').call(this.xAxis.bind(this))
    this.bounds.append('g').call(this.yAxis.bind(this))
    this.addCrosshair()
  }

  xAxis(g) {
    return g
      .attr('transform', `translate(0, ${this.boundHeight})`)
      .call(
        d3
          .axisBottom(
            d3.scaleLinear().domain([0, 10]).range([0, this.boundWidth])
          )
          .ticks(5)
      )
      .selectAll('.tick line')
      .clone()
      .attr('y2', -this.height + this.margin.top + this.margin.bottom)
      .attr('stroke-dasharray', '2,2')
      .attr('stroke-opacity', 0.3)
  }

  yAxis(g) {
    return (
      g
        // .attr('transform', `translate(${this.margin.left}, 0)`)
        .call(
          d3.axisLeft(
            d3.scaleLinear().domain([0, 1]).range([0, this.boundHeight])
          )
        )
        .selectAll('.tick line')
        .clone()
        .attr('x2', this.boundHeight)
        .attr('stroke-dasharray', '2,2')
        .attr('stroke-opacity', 0.3)
    )
  }

  addCrosshair() {
    const overlay = this.bounds
      .append('rect')
      .attr('width', this.boundWidth)
      .attr('height', this.boundHeight)
      .style('pointer-events', 'all')
      .attr('fill', 'none')
      .attr('stroke', 'none')

    const crosshair = this.bounds
      .append('g')
      .style('opacity', 1)
      .style('pointer-events', 'none')
    const crosshairX = crosshair
      .append('line')
      .attr('class', 'crosshair')
      .attr('stroke', 'black')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-dasharray', '6,6')
      .attr('x1', 0)
      .attr('x2', this.boundWidth)
      .attr('y1', this.boundHeight)
      .attr('y2', this.boundHeight)

    const crosshairY = crosshair
      .append('line')
      .attr('class', 'crosshair')
      .attr('stroke', 'black')
      .attr('stroke-opacity', 0.3)
      .attr('stroke-dasharray', '6,6')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', this.boundHeight)

    overlay.on('mousemove', (e) => {
      const [x, y] = d3.pointer(e)
      console.log('mousemove', x, y)
      crosshairX.attr('y1', y).attr('y2', y)
      crosshairY.attr('x1', x).attr('x2', x)
    })
    overlay.on('mouseout', () => {
      crosshairX.attr('y1', this.boundHeight).attr('y2', this.boundHeight)
      crosshairY.attr('x1', 0).attr('x2', 0)
    })
  }
}

const cartesian = new CartesianCoordinate('#coordinate1')
