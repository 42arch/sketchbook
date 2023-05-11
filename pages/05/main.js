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
      .style(
        'transform',
        `translate(${this.margin.left}px, ${this.margin.top}px)`
      )

    this.bounds.append('g').call(this.xAxis.bind(this))
    this.bounds.append('g').call(this.yAxis.bind(this))
    this.crosshair()
  }

  xAxis(g) {
    return (
      g
        // .attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
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
    )
  }

  yAxis(g) {
    return (
      g
        // .attr('transform', `translate(${this.margin.left}, 0)`)
        .call(
          d3.axisLeft(d3.scaleLinear().domain([0, 1]).range([this.boundHeight]))
        )
        .selectAll('.tick line')
        .clone()
        .attr('x2', this.boundHeight)
        .attr('stroke-dasharray', '2,2')
        .attr('stroke-opacity', 0.3)
    )
  }

  crosshair() {
    const crosshairX = this.wrapper
      .append('line')
      .attr('class', 'crosshair')
      .attr('stroke', 'red')

      .attr('x1', 0)
      .attr('x2', this.width)
      .attr('y1', 0)
      .attr('y2', 0)

    const crosshairY = this.wrapper
      .append('line')
      .attr('class', 'crosshair')
      .attr('stroke', 'red')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', this.height)

    this.wrapper.on('mousemove', (e) => {
      const [x, y] = d3.pointer(e)
      // console.log('mousemove', x, y)
      crosshairX.attr('y1', y).attr('y2', y)
      crosshairY.attr('x1', x).attr('x2', x)
    })
    this.wrapper.on('mouseout', () => {
      console.log('mouseout')
      crosshairX.attr('y1', 0).attr('y2', 0)
      crosshairY.attr('x1', 0).attr('x2', 0)
    })
  }
}

const cartesian = new CartesianCoordinate('#coordinate1')
