import * as d3 from 'd3'

class Line {
  constructor(id) {
    this.id = id
    this.wrapper = null
    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight

    this.startPoint = null
    this.endPoint = null
    this.path = {
      start: null,
      end: null
    }

    this.render()
    this.draw()
  }

  render() {
    this.wrapper = d3
      .select(this.id)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height])
  }

  draw() {
    this.wrapper.on('click', (e) => {
      console.log('click', d3.pointer(e))
      const position = d3.pointer(e)
      if (!this.startPoint) {
        this.startPoint = this.wrapper
          .append('circle')
          .attr('class', 'start')
          .attr('r', 3)
          .attr('fill', 'black')
          .attr('cx', position[0])
          .attr('cy', position[1])
        console.log('create start')

        this.path.start = position
        return
      }
      if (!this.endPoint) {
        this.endPoint = this.wrapper
          .append('circle')
          .attr('class', 'end')
          .attr('r', 3)
          .attr('fill', 'black')
          .attr('cx', position[0])
          .attr('cy', position[1])

        console.log('create end')
        this.path.end = position

        this.wrapper
          .append('line')
          .attr('class', 'line')
          .attr('x1', this.path.start[0])
          .attr('y1', this.path.start[1])
          .attr('x2', this.path.end[0])
          .attr('y2', this.path.end[1])
          .attr('stroke', 'black')
          .attr('stroke-dasharray', '2,2')
        return
      }
    })
  }
}

const line = new Line('#curve1')
