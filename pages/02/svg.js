import * as d3 from 'd3'

export default class SvgGraph {
  constructor(id, data, options) {
    this.id = id
    this.nodes = data.nodes.map((d) => Object.assign({}, d))
    this.links = data.links.map((d) => Object.assign({}, d))
    this.options = options
    this.nodeRadius = 8
    this.width = 0
    this.height = 0

    this.svg = null
    this.linkEle = null
    this.nodeEle = null

    this.transform = d3.zoomIdentity
    this.simulation = null
    this.init()
    this.forceSimulation()
  }

  init() {
    this.width = d3.select(this.id).node().offsetWidth
    this.height = d3.select(this.id).node().offsetHeight
    this.svg = d3
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

    this.linkEle = this.svg
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

    this.nodeEle = this.svg
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

    window.addEventListener('resize', this.resize.bind(this))
  }

  forceSimulation() {
    this.simulation = d3
      .forceSimulation()
      .nodes(this.nodes)
      .force(
        'link',
        d3.forceLink(this.links).id((d) => d.id)
      )
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
    this.simulation.on('tick', this.tick.bind(this))
  }

  tick() {
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

  resize() {
    this.width = d3.select(this.id).node().offsetWidth
    this.height = d3.select(this.id).node().offsetHeight
    this.svg.attr('width', this.width).attr('height', this.height)
    this.simulation.force(
      'center',
      d3.forceCenter(this.width / 2, this.height / 2)
    )
    this.simulation.alpha(1).restart()
  }

  zoomed(currentEvent) {
    // this.transform = currentEvent.transform
    d3.selectAll('g').attr('transform', currentEvent.transform)
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
    if (this.options.sticky) {
      currentEvent.subject.fx = currentEvent.x
      currentEvent.subject.fy = currentEvent.y
    } else {
      currentEvent.subject.fx = null
      currentEvent.subject.fy = null
    }
  }
}
