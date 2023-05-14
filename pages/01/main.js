import * as d3 from 'd3'

class Line {
  constructor(id) {
    this.id = id
    this.wrapper = null
    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight

    this.startPoint = null
    this.endPoint = null
    this.startPos = []
    this.endPos = []
    this.line = null

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

  onDrag(point) {
    const self = this
    return d3
      .drag()
      .on('start', function () {
        d3.select(this).attr('fill', 'orange')
      })
      .on('drag', function (e) {
        d3.select(this).attr('transform', `translate(${e.x}, ${e.y})`)
        if (point === 'start') {
          self.line.attr('x1', e.x).attr('y1', e.y).attr('stroke', 'orange')
        } else if (point === 'end') {
          self.line.attr('x2', e.x).attr('y2', e.y).attr('stroke', 'orange')
        }
      })
      .on('end', function () {
        d3.select(this).attr('fill', null)
        self.line.attr('stroke', 'black')
      })
  }

  draw() {
    this.wrapper.on('click', (e) => {
      const position = d3.pointer(e)
      if (!this.startPoint) {
        this.startPoint = this.wrapper
          .append('g')
          .attr('class', 'start')
          .attr('transform', `translate(${position[0]}, ${position[1]})`)
          .attr('fill', 'black')
          .call(this.onDrag('start'))

        this.startPoint.append('circle').attr('r', 5).attr('cursor', 'pointer')
        this.startPoint
          .append('text')
          .attr('class', 'start-label')
          .attr('font-size', '.8em')
          .attr('text-anchor', 'left')
          .attr('fill-opacity', 0.8)
          .attr('transform', 'translate(6, -6)')
          .text('start')

        this.startPos = position
        return
      }
      if (!this.endPoint) {
        this.endPoint = this.wrapper
          .append('g')
          .attr('class', 'end')
          .attr('transform', `translate(${position[0]}, ${position[1]})`)
          .attr('fill', 'black')
          .call(this.onDrag('end'))

        this.endPoint.append('circle').attr('r', 5).attr('cursor', 'pointer')
        this.endPoint
          .append('text')
          .attr('class', 'end-label')
          .attr('font-size', '.8em')
          .attr('text-anchor', 'left')
          .attr('fill-opacity', 0.8)
          .attr('transform', 'translate(6, -6)')
          .text('end')
        this.endPos = position

        this.line = this.wrapper
          .append('line')
          .attr('class', 'line')
          .attr('x1', this.startPos[0])
          .attr('y1', this.startPos[1])
          .attr('x2', this.endPos[0])
          .attr('y2', this.endPos[1])
          .attr('stroke', 'black')
          .attr('stroke-dasharray', '2,2')
        return
      }
    })
  }
}

const line = new Line('#curve1')
