import * as d3 from 'd3'
import data from './../data/miserables.json'

class CanvasGraph {
  constructor(id, data) {
    this.nodes = data.nodes.map((d) => Object.assign({}, d))
    this.links = data.links.map((d) => Object.assign({}, d))
    this.nodeRadius = 8
    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight
    this.canvas = d3
      .select(id)
      .append('canvas')
      .attr('width', this.width)
      .attr('height', this.height)

    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight

    this.transform = d3.zoomIdentity
    this.simulation = this.forceSimulation(this.width, this.height)
    this.render()
  }

  render() {
    this.simulation.on('tick', this.simulationUpdate.bind(this))
    this.canvas
      .call(
        d3
          .drag()
          .container(this.canvas)
          .subject(this.dragSubject.bind(this))
          .on('start', this.dragStarted.bind(this))
          .on('drag', this.dragged.bind(this))
          .on('end', this.dragEnded.bind(this))
      )
      .call(
        d3
          .zoom()
          .scaleExtent([1 / 10, 8])
          .on('zoom', this.zoomed.bind(this))
      )
  }

  forceSimulation(width, height) {
    return d3
      .forceSimulation(this.nodes)
      .force(
        'link',
        d3.forceLink(this.links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
  }

  simulationUpdate() {
    const ctx = this.canvas.node().getContext('2d')
    ctx.save()
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.translate(this.transform.x, this.transform.y)
    ctx.scale(this.transform.k, this.transform.k)

    this.links.forEach((link) => {
      ctx.beginPath()
      ctx.moveTo(link.source.x, link.source.y)
      ctx.lineTo(link.target.x, link.target.y)
      ctx.strokeStyle = '#aaa'
      ctx.stroke()
    })

    this.nodes.forEach((node) => {
      ctx.beginPath()
      ctx.moveTo(node.x + this.nodeRadius, node.y)
      ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI)
      ctx.fillStyle = 'purple'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = '1.5'
      ctx.stroke()
    })
    ctx.restore()
  }

  zoomed(currentEvent) {
    console.log('zoomed')
    this.transform = currentEvent.transform
    this.simulationUpdate()
  }

  dragSubject(currentEvent) {
    const node = this.simulation.find(
      currentEvent.sourceEvent.offsetX,
      currentEvent.sourceEvent.offsetY,
      5
    )

    return node
  }

  dragStarted(currentEvent) {
    if (!currentEvent.active) this.simulation.alphaTarget(0.3).restart()
    currentEvent.subject.fx = currentEvent.subject.x
    currentEvent.subject.fy = currentEvent.subject.y
    // currentEvent.subject.fx = this.transform.invertX(currentEvent.subject.x)
    // currentEvent.subject.fy = this.transform.invertY(currentEvent.subject.y)
  }

  dragged(currentEvent) {
    // currentEvent.subject.fx = this.transform.invertX(currentEvent.x)
    // currentEvent.subject.fy = this.transform.invertY(currentEvent.y)
    currentEvent.subject.fx = currentEvent.x
    currentEvent.subject.fy = currentEvent.y
  }

  dragEnded(currentEvent) {
    if (!currentEvent.active) this.simulation.alphaTarget(0)
    currentEvent.subject.fx = null
    currentEvent.subject.fy = null
  }
}

class SvgGraph {
  constructor(id, data) {
    this.id = id
    this.nodes = data.nodes.map((d) => Object.assign({}, d))
    this.links = data.links.map((d) => Object.assign({}, d))
    this.nodeRadius = 8

    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight

    this.linkEle = null
    this.nodeEle = null

    this.transform = d3.zoomIdentity
    this.simulation = this.forceSimulation(this.width, this.height)
    this.render()
  }

  render() {
    const svg = d3
      .select(this.id)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .call(
        d3
          .zoom()
          .scaleExtent([1 / 10, 8])
          .on('zoom', this.zoomed.bind(this))
      )

    this.linkEle = svg
      .append('g')
      .attr('class', 'group links')
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('stroke-width', 1)
      .attr('stroke', 'rgba(50, 50, 50, 0.2)')
      .on('click', () => {
        console.log('link clicked')
      })

    this.nodeEle = svg
      .append('g')
      .attr('class', 'group nodes')
      .attr('fill', 'purple')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(this.nodes)
      .join('circle')
      .attr('r', this.nodeRadius)
      .call(
        d3
          .drag()
          .on('start', this.dragStarted.bind(this))
          .on('drag', this.dragged.bind(this))
          .on('end', this.dragEnded.bind(this))
      )

    if (this.transform) {
      const group = d3.selectAll('g')
      group.attr(
        'transform',
        `translate(${this.transform.x},${this.transform.y}) scale(${this.transform.k})`
      )
    }

    this.simulation.on('tick', this.simulationUpdate.bind(this))
  }

  forceSimulation(width, height) {
    return d3
      .forceSimulation(this.nodes)
      .force(
        'link',
        d3.forceLink(this.links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
  }

  simulationUpdate() {
    this.linkEle
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)

    this.nodeEle.attr('transform', (d) => {
      const dx = d.x
      const dy = d.y
      return `translate(${[dx, dy]})`
    })
  }

  zoomed(currentEvent) {
    // this.transform = currentEvent.transform
    d3.selectAll('g').attr('transform', currentEvent.transform)

    console.log('zoomed', currentEvent)
  }

  dragStarted(currentEvent) {
    if (!currentEvent.active) this.simulation.alphaTarget(0.3).restart()
    currentEvent.subject.fx = currentEvent.subject.x
    currentEvent.subject.fy = currentEvent.subject.y
  }

  dragged(currentEvent) {
    if (!currentEvent.active) this.simulation.alphaTarget(0.3).restart()
    currentEvent.subject.fx = currentEvent.x
    currentEvent.subject.fy = currentEvent.y
  }

  dragEnded(currentEvent) {
    if (!currentEvent.active) this.simulation.alphaTarget(0)
    currentEvent.subject.fx = null
    currentEvent.subject.fy = null
  }
}

new CanvasGraph('#canvas-renderer', data, 400, 400)
new SvgGraph('#svg-renderer', data, 400, 400)
