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

    this.wrapper
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8) // 设置箭头在路径的终点处
      .attr('markerWidth', 6) // 宽度和高度
      .attr('markerHeight', 6)
      .attr('orient', 'auto') // 自动确定箭头方向
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5') // 箭头路径

    this.bounds = this.wrapper
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

    this.bounds.append('g').call(this.xAxis.bind(this))
    this.bounds.append('g').call(this.yAxis.bind(this))
    this.addCrosshair()

    // d3.selectAll('.domain').attr('marker-end', 'url(#arrowhead)')
  }

  xAxis(g) {
    const xAxisGroup = g
      .attr('transform', `translate(0, ${this.boundHeight / 2})`)
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
    // const yScale = d3
    //   .scaleLinear()
    //   .domain([10, -10])
    //   .range([0, this.boundHeight])

    const yAxisGroup = g
      .attr('transform', `translate(${this.boundWidth / 2}, 0)`)
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

    yAxisGroup
      .selectAll('.tick line')
      .clone()
      .attr('x1', -this.boundWidth)
      .attr('x2', this.boundWidth)
      .attr('stroke-dasharray', '2,2')
      .attr('stroke-opacity', 0.3)

    return yAxisGroup
  }

  addCrosshair() {
    const overlay = this.bounds
      .append('rect')
      .attr('width', this.boundWidth)
      .attr('height', this.boundHeight)
      .style('pointer-events', 'all')
      .attr('fill', 'none')
      .attr('stroke', 'none')

    const tooltip = this.bounds.append('text')

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
      const xValue = d3.format('.2f')(this.xScale.invert(x))
      const yValue = d3.format('.2f')(this.yScale.invert(y))
      overlay.attr('cursor', 'crosshair')
      crosshairX.attr('y1', y).attr('y2', y)
      crosshairY.attr('x1', x).attr('x2', x)
      tooltip
        .attr('x', x)
        .attr('y', y)
        .attr('font-size', '.8em')
        .attr('transform', 'translate(8, -8)')
        .text(`x:${xValue}, y:${yValue}`)
    })
    overlay.on('mouseout', () => {
      crosshairX.attr('y1', this.boundHeight).attr('y2', this.boundHeight)
      crosshairY.attr('x1', 0).attr('x2', 0)
    })
  }
}

const cartesian = new CartesianCoordinate('#coordinate1')
