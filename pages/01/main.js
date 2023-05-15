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
          .attr('font-size', '.6em')
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
          .attr('font-size', '.6em')
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

class QuadraticBezier {
  constructor(id) {
    this.id = id
    this.wrapper = null
    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight

    this.startPoint = null
    this.endPoint = null
    this.controlPoint = null
    this.startPos = []
    this.endPos = []
    this.controlPos = []
    this.path = null

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

  createPath(startX, startY, controlX, controlY, endX, endY) {
    const path = d3.path()
    path.moveTo(startX, startY)
    path.quadraticCurveTo(controlX, controlY, endX, endY)
    return path.toString()
  }

  onDrag(point) {
    const self = this

    return d3
      .drag()
      .on('start', function () {
        d3.select(this).attr('fill', 'orange')
      })
      .on('drag', function (e) {
        let path
        d3.select(this).attr('transform', `translate(${e.x}, ${e.y})`)
        if (point === 'start') {
          path = self.createPath(e.x, e.y, ...self.controlPos, ...self.endPos)
          self.startPos = [e.x, e.y]
        } else if (point === 'end') {
          path = self.createPath(...self.startPos, ...self.controlPos, e.x, e.y)
          self.endPos = [e.x, e.y]
        } else if (point === 'control') {
          path = self.createPath(...self.startPos, e.x, e.y, ...self.endPos)
          self.controlPos = [e.x, e.y]
        }
        self.path.attr('d', path)
      })
      .on('end', function () {
        d3.select(this).attr('fill', null)
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
          .attr('font-size', '.6em')
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
          .attr('font-size', '.6em')
          .attr('text-anchor', 'left')
          .attr('fill-opacity', 0.8)
          .attr('transform', 'translate(6, -6)')
          .text('end')
        this.endPos = position
        return
      }
      if (!this.controlPoint) {
        this.controlPoint = this.wrapper
          .append('g')
          .attr('class', 'control')
          .attr('transform', `translate(${position[0]}, ${position[1]})`)
          .attr('fill', 'black')
          .call(this.onDrag('control'))

        this.controlPoint
          .append('circle')
          .attr('r', 5)
          .attr('cursor', 'pointer')
        this.controlPoint
          .append('text')
          .attr('class', 'ctr-label')
          .attr('font-size', '.6em')
          .attr('text-anchor', 'left')
          .attr('fill-opacity', 0.8)
          .attr('transform', 'translate(6, -6)')
          .text('control')
        this.controlPos = position

        const path = d3.path()
        path.moveTo(this.startPos[0], this.startPos[1])
        path.quadraticCurveTo(
          this.controlPos[0],
          this.controlPos[1],
          this.endPos[0],
          this.endPos[1]
        )

        this.path = this.wrapper
          .append('path')
          .attr('class', 'u-path')
          .attr('fill', 'none')
          .attr('stroke', 'orange')
          .attr('d', path.toString())

        return
      }
    })
  }
}

const line = new Line('#path1')
const path = new QuadraticBezier('#path2')
