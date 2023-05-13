import * as d3 from 'd3'

class CartesianCoordinate {
  constructor(id) {
    this.id = id
    this.margin = { top: 20, right: 30, bottom: 20, left: 30 }
    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight
    this.boundWidth = this.width - this.margin.right - this.margin.left
    this.boundHeight = this.height - this.margin.top - this.margin.bottom
    this.wrapper = null
    this.content = null

    this.xScale = d3.scaleLinear().domain([-10, 10]).range([0, this.boundWidth])
    this.yScale = d3
      .scaleLinear()
      .domain([10, -10])
      .range([0, this.boundHeight])

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
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

    this.content.append('g').call(this.xAxis.bind(this))
    this.content.append('g').call(this.yAxis.bind(this))
    this.helperLine()
  }

  xAxis(g) {
    const xAxisGroup = g
      .attr('transform', `translate(0, ${this.boundHeight / 2})`)
      .attr('font-size', '.8em')
      .call(
        d3
          .axisBottom(this.xScale)

          .tickValues(d3.range(-10, 11).filter((d) => d % 2 === 0 && d !== 0))
          .tickSizeInner(-6)
          .tickSizeOuter(0)
          .tickPadding(6)
      )
    xAxisGroup
      .append('text')
      .attr('x', this.boundWidth + 10)
      .attr('y', 0)
      .attr('fill', '#000')
      .text('X')

    xAxisGroup.selectAll('text').attr('fill', 'gray')

    xAxisGroup
      .selectAll('.tick line')
      .clone()
      .attr('y1', this.boundHeight)
      .attr('y2', -this.boundHeight)
      .attr('stroke-dasharray', '2,2')
      .attr('stroke-opacity', 0.3)

    return xAxisGroup
  }

  yAxis(g) {
    const yAxisGroup = g
      .attr('transform', `translate(${this.boundWidth / 2}, 0)`)
      .attr('font-size', '.8em')
      .call(
        d3
          .axisLeft(this.yScale)
          .tickValues(d3.range(-10, 11).filter((d) => d % 2 === 0 && d !== 0))
          .tickSizeInner(-6)
          .tickSizeOuter(0)
          .tickPadding(6)
      )

    yAxisGroup
      .append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('fill', '#000')
      .text('Y')

    yAxisGroup.selectAll('text').attr('fill', 'gray')

    yAxisGroup
      .selectAll('.tick line')
      .clone()
      .attr('x1', -this.boundWidth)
      .attr('x2', this.boundWidth)
      .attr('stroke-dasharray', '2,2')
      .attr('stroke-opacity', 0.3)

    return yAxisGroup
  }

  helperLine() {
    const overlay = this.content
      .append('rect')
      .attr('width', this.boundWidth)
      .attr('height', this.boundHeight)
      .style('pointer-events', 'all')
      .attr('fill', 'none')
      .attr('stroke', 'none')

    const tooltip = this.content.append('text').attr('fill', 'gray')

    const crosshair = this.content
      .append('g')
      .style('opacity', 1)
      .style('pointer-events', 'none')
    const crosshairX = crosshair
      .append('line')
      .attr('class', 'crosshair')
      .attr('stroke', 'red')
      .attr('stroke-opacity', 1)
      .attr('stroke-dasharray', '6,6')
      .attr('x1', 0)
      .attr('x2', this.boundWidth)
      .attr('y1', this.boundHeight)
      .attr('y2', this.boundHeight)

    const crosshairY = crosshair
      .append('line')
      .attr('class', 'crosshair')
      .attr('stroke', 'red')
      .attr('stroke-opacity', 1)
      .attr('stroke-dasharray', '6,6')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', this.boundHeight)

    overlay.on('mousemove', (e) => {
      const [x, y] = d3.pointer(e)
      const xValue = d3.format('.2f')(this.xScale.invert(x))
      const yValue = d3.format('.2f')(this.yScale.invert(y))
      overlay.attr('cursor', 'crosshair')
      crosshairX.attr('y1', y).attr('y2', y).attr('opacity', 1)
      crosshairY.attr('x1', x).attr('x2', x).attr('opacity', 1)
      tooltip
        .attr('opacity', 1)
        .attr('x', x)
        .attr('y', y)
        .attr('font-size', '.8em')
        .attr('transform', 'translate(8, -8)')
        .text(`x:${xValue}, y:${yValue}`)
    })
    overlay.on('mouseout', () => {
      crosshairX.attr('opacity', 0)
      crosshairY.attr('opacity', 0)
      tooltip.attr('opacity', 0)
    })
  }
}

class PolarCoordinate {
  constructor(id) {
    this.id = id
    this.margin = { top: 20, right: 30, bottom: 20, left: 30 }
    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight
    this.boundWidth = this.width - this.margin.right - this.margin.left
    this.boundHeight = this.height - this.margin.top - this.margin.bottom
    this.wrapper = null
    this.content = null

    this.radius = Math.min(this.boundHeight, this.boundWidth) / 2
    this.scale = d3.scaleLinear().domain([0, 10]).range([0, this.radius])
    this.angle = d3
      .scaleLinear()
      .domain([0, 360])
      .range([0, 2 * Math.PI])

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

    this.content.append('g').call(this.radialGrid.bind(this))
    this.content.append('g').call(this.radialAxis.bind(this))

    this.helperLine()
  }

  radialGrid(g) {
    const radialGrid = g
      .attr('class', 'radial-grid')
      .selectAll('g')
      .data(this.scale.ticks(5).slice(1))
      .enter()
      .append('g')

    radialGrid
      .append('circle')
      .attr('r', this.scale)
      .attr('fill', 'none')
      .attr('stroke', 'gray')
      .attr('stroke-dasharray', '2, 2')

    radialGrid
      .append('text')
      .attr('y', (d) => -this.scale(d) - 4)
      .attr('transform', 'rotate(15)')
      .style('text-anchor', 'middle')
      .attr('fill', 'gray')
      .attr('font-size', '.8em')
      .text((d) => d)

    return radialGrid
  }

  radialAxis(g) {
    const radialAxis = g
      .attr('class', 'radial-axis')
      .selectAll('g')
      .data(d3.range(0, 360, 30))
      .enter()
      .append('g')
      .attr('transform', (d) => `rotate(${-d})`)

    radialAxis
      .append('line')
      .attr('x2', this.radius)
      .attr('stroke', 'gray')
      .attr('stroke-dasharray', '2, 2')

    radialAxis
      .append('text')
      .attr('x', this.radius + 6)
      .attr('dy', '.35em')
      .style('text-anchor', (d) => (d < 270 && d > 90 ? 'end' : null))
      .attr('transform', (d) =>
        d < 270 && d > 90 ? `rotate(180 ${this.radius + 6},0)` : null
      )
      .attr('fill', 'gray')
      .attr('font-size', '.8em')
      .text((d) => d + '°')

    return radialAxis
  }

  helperLine() {
    const overlay = this.content
      .append('circle')
      .attr('r', this.radius)
      .style('pointer-events', 'all')
      .attr('fill', 'none')
      .attr('stroke', 'none')
      .attr('cursor', 'crosshair')

    // const scale = this.scale.ticks(5).slice(1)
    const helperCircle = this.content
      .append('circle')
      .style('pointer-events', 'none')
      .attr('fill', 'none')
      .attr('stroke-dasharray', '4, 4')
      .attr('stroke', 'red')

    const format = d3.format('.2f')

    const helperAxis = this.content
      .append('line')
      .style('pointer-events', 'none')
      .attr('stroke-dasharray', '4, 4')
      .attr('stroke', 'red')
      .attr('x2', this.radius)

    const tooltip = this.content.append('text').attr('fill', 'gray')

    overlay.on('mousemove', (e) => {
      const [x, y] = d3.pointer(e)
      const r = Math.sqrt(x * x + y * y)
      const radius = this.scale.invert(r)
      const theta = Math.atan2(y, x)
      const deg = (theta * 180) / Math.PI
      helperCircle.attr('r', r).attr('opacity', 1)
      helperAxis.attr('transform', `rotate(${deg})`).attr('opacity', 1)
      tooltip
        .attr('opacity', 1)
        .attr('x', x)
        .attr('y', y)
        .attr('font-size', '.8em')
        .attr('transform', 'translate(8, -8)')
        .text(`r:${format(radius)}, θ:${format(theta)}`)
    })
    overlay.on('mouseout', () => {
      helperCircle.attr('opacity', 0)
      helperAxis.attr('opacity', 0)
      tooltip.attr('opacity', 0)
    })
  }
}

const cartesian = new CartesianCoordinate('#coordinate1')
const polar = new PolarCoordinate('#coordinate2')
