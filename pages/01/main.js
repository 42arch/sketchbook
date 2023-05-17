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

    this.line = this.wrapper
      .append('line')
      .attr('class', 'line')
      .attr('stroke', 'orange')
      .attr('stroke-dasharray', '2,2')
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

        this.line
          .attr('x1', this.startPos[0])
          .attr('y1', this.startPos[1])
          .attr('x2', this.endPos[0])
          .attr('y2', this.endPos[1])
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
    this.startLine = null
    this.endLine = null

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
    this.path = this.wrapper
      .append('path')
      .attr('class', 'path')
      .attr('fill', 'none')
      .attr('stroke', 'orange')

    this.startLine = this.wrapper
      .append('line')
      .attr('class', 'help-line')
      .attr('stroke', '#aaa')
      .attr('stroke-dasharray', '2,2')

    this.endLine = this.wrapper
      .append('line')
      .attr('class', 'help-line')
      .attr('stroke', '#aaa')
      .attr('stroke-dasharray', '2,2')
  }

  updatePath(startX, startY, controlX, controlY, endX, endY) {
    this.startLine
      .attr('x1', startX)
      .attr('y1', startY)
      .attr('x2', controlX)
      .attr('y2', controlY)

    this.endLine
      .attr('x1', endX)
      .attr('y1', endY)
      .attr('x2', controlX)
      .attr('y2', controlY)

    const path = d3.path()
    path.moveTo(startX, startY)
    path.quadraticCurveTo(controlX, controlY, endX, endY)
    this.path.attr('d', path)
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
        d3.select(this).attr('transform', `translate(${e.x}, ${e.y})`)
        if (point === 'start') {
          self.updatePath(e.x, e.y, ...self.controlPos, ...self.endPos)
          self.startPos = [e.x, e.y]
        } else if (point === 'end') {
          self.updatePath(...self.startPos, ...self.controlPos, e.x, e.y)
          self.endPos = [e.x, e.y]
        } else if (point === 'control') {
          self.updatePath(...self.startPos, e.x, e.y, ...self.endPos)
          self.controlPos = [e.x, e.y]
        }
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
          .attr('fill', 'black')
          .attr('transform', `translate(${position[0]}, ${position[1]})`)
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

        this.updatePath(...this.startPos, ...this.controlPos, ...this.endPos)
        return
      }
    })
  }
}

class CubicBezier {
  constructor(id) {
    this.id = id
    this.wrapper = null
    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight

    this.startPoint = null
    this.endPoint = null
    this.controlAPoint = null
    this.controlBPoint = null
    this.startPos = []
    this.endPos = []
    this.controlAPos = []
    this.controlBPos = []
    this.path = null
    this.startLine = null
    this.endLine = null

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
    this.path = this.wrapper
      .append('path')
      .attr('class', 'path')
      .attr('fill', 'none')
      .attr('stroke', 'orange')

    this.startLine = this.wrapper
      .append('line')
      .attr('class', 'help-line')
      .attr('stroke', '#aaa')
      .attr('stroke-dasharray', '2,2')

    this.endLine = this.wrapper
      .append('line')
      .attr('class', 'help-line')
      .attr('stroke', '#aaa')
      .attr('stroke-dasharray', '2,2')
  }

  updatePath(
    startX,
    startY,
    controlAX,
    controlAY,
    controlBX,
    controlBY,
    endX,
    endY
  ) {
    this.startLine
      .attr('x1', startX)
      .attr('y1', startY)
      .attr('x2', controlAX)
      .attr('y2', controlAY)

    this.endLine
      .attr('x1', endX)
      .attr('y1', endY)
      .attr('x2', controlBX)
      .attr('y2', controlBY)

    const path = d3.path()
    path.moveTo(startX, startY)
    path.bezierCurveTo(controlAX, controlAY, controlBX, controlBY, endX, endY)
    this.path.attr('d', path)
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
        d3.select(this).attr('transform', `translate(${e.x}, ${e.y})`)
        if (point === 'start') {
          self.updatePath(
            e.x,
            e.y,
            ...self.controlAPos,
            ...self.controlBPos,
            ...self.endPos
          )
          self.startPos = [e.x, e.y]
        } else if (point === 'end') {
          self.updatePath(
            ...self.startPos,
            ...self.controlAPos,
            ...self.controlBPos,
            e.x,
            e.y
          )
          self.endPos = [e.x, e.y]
        } else if (point === 'controlA') {
          self.updatePath(
            ...self.startPos,
            e.x,
            e.y,
            ...self.controlBPos,
            ...self.endPos
          )
          self.controlAPos = [e.x, e.y]
        } else if (point === 'controlB') {
          self.updatePath(
            ...self.startPos,
            ...self.controlAPos,
            e.x,
            e.y,
            ...self.endPos
          )
          self.controlBPos = [e.x, e.y]
        }
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
      if (!this.controlAPoint) {
        this.controlAPoint = this.wrapper
          .append('g')
          .attr('class', 'control-a')
          .attr('fill', 'black')
          .attr('transform', `translate(${position[0]}, ${position[1]})`)
          .call(this.onDrag('controlA'))

        this.controlAPoint
          .append('circle')
          .attr('r', 5)
          .attr('cursor', 'pointer')
        this.controlAPoint
          .append('text')
          .attr('class', 'ctr-label')
          .attr('font-size', '.6em')
          .attr('text-anchor', 'left')
          .attr('fill-opacity', 0.8)
          .attr('transform', 'translate(6, -6)')
          .text('control a')
        this.controlAPos = position

        // this.updatePath(...this.startPos, ...this.controlPos, ...this.endPos)
        return
      }
      if (!this.controlBPoint) {
        this.controlBPoint = this.wrapper
          .append('g')
          .attr('class', 'control-b')
          .attr('fill', 'black')
          .attr('transform', `translate(${position[0]}, ${position[1]})`)
          .call(this.onDrag('controlB'))

        this.controlBPoint
          .append('circle')
          .attr('r', 5)
          .attr('cursor', 'pointer')
        this.controlBPoint
          .append('text')
          .attr('class', 'ctr-label')
          .attr('font-size', '.6em')
          .attr('text-anchor', 'left')
          .attr('fill-opacity', 0.8)
          .attr('transform', 'translate(6, -6)')
          .text('control b')
        this.controlBPos = position

        this.updatePath(
          ...this.startPos,
          ...this.controlAPos,
          ...this.controlBPos,
          ...this.endPos
        )
        return
      }
    })
  }
}

class CircularArc {
  constructor(id) {
    this.id = id
    this.wrapper = null
    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight

    this.startPoint = null
    this.endPoint = null
    this.startPos = []
    this.endPos = []
    this.path = null

    this.centerPoint = null
    this.centerPos = []
    this.startAngle = 0
    this.endAngle = 2 * Math.PI - 1
    this.radius = 100

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
    this.path = this.wrapper
      .append('path')
      .attr('class', 'path')
      .attr('fill', 'none')
      .attr('stroke', 'orange')
  }

  updatePath(centerX, centerY, startX, startY, endX, endY) {
    const startAngle = Math.atan2(startY - centerX, startX - centerY),
      endAngle = Math.atan2(endY - centerX, endX - centerY)
    // radius = Math.sqrt((startY - centerX) ** 2 + (startX - centerY) ** 2)

    startX = centerX + this.radius * Math.cos(startAngle)
    startY = centerX + this.radius * Math.sin(startAngle)
    endX = centerX + this.radius * Math.cos(endAngle)
    endY = centerX + this.radius * Math.sin(endAngle)

    this.startPos = [startX, startY]
    this.endPos = [endX, endY]

    console.log(77777, startX, startY)
    this.startPoint.attr('transform', `translate(${(startX, startY)})`)
    const path = d3.path()
    path.arc(centerX, centerY, this.radius, startAngle, endAngle)
    this.path.attr('d', path)
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
          self.updatePath(...self.centerPos, e.x, e.y, ...self.endPos)
          self.startPos = [e.x, e.y]
        } else if (point === 'end') {
          self.updatePath(...self.centerPos, ...self.startPos, e.x, e.y)
          self.endPos = [e.x, e.y]
        } else if (point === 'center') {
          const startX = e.x + self.radius * Math.cos(self.startAngle),
            startY = e.y + self.radius * Math.sin(self.startAngle),
            endX = e.x + self.radius * Math.cos(self.endAngle),
            endY = e.y + self.radius * Math.sin(self.endAngle)
          // self.updatePath(e.x, e.y, ...self.startPos, ...self.endPos)

          console.log(7777, e.x, e.y, startX, startY, endX, endY)
          self.startPoint.attr('transform', `translate(${(startX, startY)})`)
          self.endPoint.attr('transform', `translate(${(endX, endY)})`)

          const path = d3.path()
          path.arc(e.x, e.y, this.radius, this.startAngle, this.endAngle)
          self.path.attr('d', path)
          self.centerPos = [e.x, e.y]
        }
      })
      .on('end', function () {
        d3.select(this).attr('fill', null)
      })
  }

  draw() {
    this.wrapper.on('click', (e) => {
      const position = d3.pointer(e)
      if (!this.centerPoint) {
        this.centerPoint = this.wrapper
          .append('g')
          .attr('class', 'center')
          .attr('fill', 'black')
          .attr('transform', `translate(${position[0]}, ${position[1]})`)
          .call(this.onDrag('center'))

        this.centerPoint.append('circle').attr('r', 5).attr('cursor', 'pointer')
        this.centerPoint
          .append('text')
          .attr('class', 'ctr-label')
          .attr('font-size', '.6em')
          .attr('text-anchor', 'left')
          .attr('fill-opacity', 0.8)
          .attr('transform', 'translate(6, -6)')
          .text('center')
        this.centerPos = position

        this.startPos = [
          position[0] + this.radius * Math.cos(this.startAngle),
          position[1] + this.radius * Math.sin(this.startAngle)
        ]
        this.endPos = [
          position[0] + this.radius * Math.cos(this.endAngle),
          position[1] + this.radius * Math.sin(this.endAngle)
        ]

        const path = d3.path()
        path.arc(
          position[0],
          position[1],
          this.radius,
          this.startAngle,
          this.endAngle
        )
        this.path.attr('d', path)

        this.startPoint = this.wrapper
          .append('g')
          .attr('class', 'start')
          .attr(
            'transform',
            `translate(${this.startPos[0]}, ${this.startPos[1]})`
          )
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

        this.endPoint = this.wrapper
          .append('g')
          .attr('class', 'end')
          .attr('transform', `translate(${this.endPos[0]}, ${this.endPos[1]})`)
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

        return
      }
    })
  }
}

const line1 = new Line('#path1')
const path2 = new QuadraticBezier('#path2')
const path3 = new CubicBezier('#path3')
const path4 = new CircularArc('#path4')
