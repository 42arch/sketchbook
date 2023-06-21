import * as d3 from 'd3'

export default class CanvasGraph {
  constructor(id, data) {
    this.id = id
    this.nodes = data.nodes.map((d) => Object.assign({}, d))
    this.links = data.links.map((d) => Object.assign({}, d))
    this.nodeRadius = 8
    this.width = 0
    this.height = 0
    this.canvas = null
    this.ctx = null
    this.dpi = window.devicePixelRatio || 1
    this.transform = d3.zoomIdentity
    this.simulation = null
    this.init()
    this.forceSimulation()
  }

  init() {
    this.width = d3.select(this.id).node().offsetWidth
    this.height = d3.select(this.id).node().offsetHeight
    this.canvas = d3
      .select(this.id)
      .append('canvas')
      .attr('width', this.width * this.dpi)
      .attr('height', this.height * this.dpi)
      .style('width', `${this.width}px`)
      .style('height', `${this.height}px`)
    this.ctx = this.canvas.node().getContext('2d')
    this.ctx.scale(this.dpi, this.dpi)

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

    window.addEventListener('resize', this.resize.bind(this))
  }

  forceSimulation() {
    this.simulation = d3.forceSimulation()
    this.simulation
      .nodes(this.nodes)
      .force(
        'link',
        d3.forceLink(this.links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
    this.simulation.on('tick', this.tick.bind(this))
    // this.simulation.restart()
  }

  tick() {
    this.ctx.save()
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.translate(this.transform.x, this.transform.y)
    this.ctx.scale(this.transform.k, this.transform.k)

    this.links.forEach((link) => {
      this.ctx.beginPath()
      this.ctx.moveTo(link.source.x, link.source.y)
      this.ctx.lineTo(link.target.x, link.target.y)
      this.ctx.strokeStyle = '#aaa'
      this.ctx.stroke()
    })

    this.nodes.forEach((node) => {
      this.ctx.beginPath()
      this.ctx.moveTo(node.x + this.nodeRadius, node.y)
      this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI)
      this.ctx.fillStyle = 'purple'
      this.ctx.fill()
      this.ctx.strokeStyle = '#fff'
      this.ctx.lineWidth = '1.5'
      this.ctx.stroke()
    })
    this.ctx.restore()
  }

  resize() {
    this.width = d3.select(this.id).node().offsetWidth
    this.height = d3.select(this.id).node().offsetHeight

    this.canvas
      .attr('width', this.width * this.dpi)
      .attr('height', this.height * this.dpi)
      .style('width', `${this.width}px`)
      .style('height', `${this.height}px`)
    this.ctx.scale(this.dpi, this.dpi)
    this.tick()
  }

  zoomed(event) {
    this.transform = event.transform
    this.tick()
  }

  dragSubject(event) {
    const [x, y] = d3.pointer(event)
    const [tx, ty] = this.transform.invert([x, y])
    const dragNode = this.simulation.find(tx, ty, 5)
    return dragNode
  }

  dragStarted(currentEvent) {
    if (!currentEvent.active) this.simulation.alphaTarget(0.3).restart()
    currentEvent.subject.fx = currentEvent.subject.x
    currentEvent.subject.fy = currentEvent.subject.y
  }

  dragged(currentEvent) {
    currentEvent.subject.fx = currentEvent.x
    currentEvent.subject.fy = currentEvent.y
  }

  dragEnded(currentEvent) {
    if (!currentEvent.active) this.simulation.alphaTarget(0)
    currentEvent.subject.fx = null
    currentEvent.subject.fy = null
  }
}
