import * as d3 from 'd3'

const chartId = 'chart'
const sx = 40,
  sy = 100,
  cx = 150,
  cy = 280,
  ex = 350,
  ey = 20

const chart = d3
  .select('#container')
  .append('svg')
  .attr('id', chartId)
  .attr('viewBox', '0 0 600 300')
  .attr('width', 600)
  .attr('maxWidth', '100%')

const path = d3.path()
path.moveTo(sx, sy)
path.quadraticCurveTo(cx, cy, ex, ey)

d3.select('svg')
  .append('path')
  .attr('class', 'u-path')
  .attr('stroke', 'orange')
  .attr('stroke-width', 1)
  .attr('fill', 'none')
  .attr('d', path)

const points = [
  [sx, sy],
  [cx, cy],
  [ex, ey]
]
const labels = ['Start', 'Control', 'End']
const lines = [
  [points[0], points[1]],
  [points[1], points[2]]
]

const lineCfg = [
  {
    type: 'quadratic-bezier',
    points: [
      {
        corrd: [sx, sy],
        label: 'Start'
      },
      {
        corrd: [cx, cy],
        label: 'Control'
      },
      {
        corrd: [ex, ey],
        label: 'End'
      }
    ]
  }
]

draggable(lines, draw)

function draw() {
  const path = d3.path()
  path.moveTo(...points[0])
  path.quadraticCurveTo(...points[1], ...points[2])
  return path
}

function draggable(lines, draw) {
  const dist = (p, m) => {
    return Math.sqrt((p[0] - m[0]) ** 2 + (p[1] - m[1]) ** 2)
  }

  let subject, dx, dy

  const dragSubject = (event) => {
    const p = d3.pointer(event.sourceEvent, chart)
    subject = d3.least(points, (a, b) => dist(p, a) - dist(p, b))
    if (subject) {
      chart.style('cursor', 'hand').style('cursor', 'grab')
    } else {
      chart.style('cursor', null)
    }
    return subject
  }

  chart
    .on('mousemove', (event) => dragSubject({ sourceEvent: event }))
    .call(
      d3
        .drag()
        .subject(dragSubject)
        .on('start', (event) => {
          if (subject) {
            chart.style('cursor', 'grabbing')
            dx = subject[0] - event.x
            dy = subject[1] - event.y
          }
        })
        .on('drag', (event) => {
          if (subject) {
            subject[0] = event.x + dx
            subject[1] = event.y + dy
          }
        })
        .on('end', () => {
          chart.style('cursor', 'grab')
        })
        .on('start.render drag.render end.render', () => {
          update(points, labels, lines, draw)
        })
    )
}

function update(points, labels, lines) {
  chart.select('.u-path').attr('d', draw())
  chart
    .selectAll('.u-point')
    .data(points)
    .join((enter) =>
      enter
        .append('g')
        .classed('u-point', true)
        .call((g) => {
          g.append('circle').attr('r', 3)
          g.append('text')
            .text((d, i) => labels[i])
            .attr('dy', (d) => (d[1] > 100 ? 15 : -5))
        })
    )
    .attr('transform', (d) => `translate(${d})`)

  chart
    .selectAll('.u-line')
    .data(lines)
    .join('line')
    .attr('stroke', '#aaa')
    .attr('stroke-dasharray', 2)
    .attr('x1', (d) => d[0][0])
    .attr('y1', (d) => d[0][1])
    .attr('x2', (d) => d[1][0])
    .attr('y2', (d) => d[1][1])
    .classed('u-line', true)
}
