import * as d3 from 'd3'
import data from './../data/miserables.json'

const width = 600
const height = 600

const canvas = d3
  .select('#graph')
  .append('canvas')
  .attr('width', width)
  .attr('height', height)

const ctx = canvas.node().getContext('2d')

const nodes = data.nodes.map((d) => Object.assign({}, d))
const links = data.links.map((d) => Object.assign({}, d))
const nodeRadius = 8

function forceSimulation(width, height) {
  return d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3.forceLink(links).id((d) => d.id)
    )
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(width / 2, height / 2))
}

const simulation = forceSimulation(width, height)
let transform = d3.zoomIdentity

function findNode(nodes, x, y, radius) {
  const rSq = radius * radius
  let i
  for (let i = nodes.length - 1; i >= 0; --i) {
    const node = nodes[i],
      dx = x - node.x,
      dy = y - node.y,
      distSq = dx * dx + dy * dy
    if (distSq < rSq) {
      return node
    }
  }
  return undefined
}

function dragSubject(e) {
  console.log('drag subject', e)
  // let transform = d3.zoomIdentity

  // return simulation.find(e.sourceEvent.offsetX, e.sourceEvent.offsetY)
  const x = transform.invertX(e.x),
    y = transform.invertY(e.y)
  const node = findNode(nodes, x, y, nodeRadius)
  if (node) {
    node.x = transform.applyX(node.x)
    node.y = transform.applyY(node.y)
  }
  return node
}

function zoomed(e) {
  transform = e.transform
  simulationUpdate()
}

function simulationUpdate() {
  ctx.save()
  ctx.clearRect(0, 0, width, height)
  ctx.translate(transform.x, transform.y)
  ctx.scale(transform.k, transform.k)

  links.forEach((link) => {
    ctx.beginPath()
    ctx.moveTo(link.source.x, link.source.y)
    ctx.lineTo(link.target.x, link.target.y)
    ctx.strokeStyle = '#aaa'
    ctx.stroke()
  })

  nodes.forEach((node) => {
    ctx.beginPath()
    ctx.moveTo(node.x + nodeRadius, node.y)
    ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI)
    ctx.fillStyle = 'red'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = '1.5'
    ctx.stroke()
  })

  ctx.restore()
}

simulation.on('tick', simulationUpdate)

canvas
  .call(
    d3
      .drag()
      // .container(canvas.node())
      .subject(dragSubject)
      // .subject((e) =>
      //   simulation.find(
      //     e.sourceEvent.offsetX,
      //     e.sourceEvent.offsetY,
      //     nodeRadius
      //   )
      // )
      // .subject((e) => simulation.find(e.x, e.y, nodeRadius))
      .on('start', (e) => {
        console.log('start drag', e)
        if (!e.active) simulation.alphaTarget(0.3).restart()
        e.subject.fx = d3.zoomIdentity.invertX(e.x)
        e.subject.fy = d3.zoomIdentity.invertY(e.y)
      })
      .on('drag', (e) => {
        e.subject.fx = e.x
        e.subject.fy = e.y
        // e.subject.fx = d3.zoomIdentity.invertX(e.x)
        // e.subject.fy = d3.zoomIdentity.invertY(e.y)
      })
      .on('end', (e) => {
        if (!e.active) simulation.alphaTarget(0)
        e.subject.fx = null
        e.subject.fy = null
      })
  )
  .call(
    d3
      .zoom()
      .scaleExtent([1 / 10, 8])
      .on('zoom', zoomed)
  )
