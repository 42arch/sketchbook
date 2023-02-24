import * as d3 from 'd3'

const points = []

const chartId = 'chart'
const chart = d3
  .select('#container')
  .append('svg')
  .attr('id', chartId)
  .attr('width', 600)
  .attr('maxWidth', '100%')

const tempLine = chart
  .append('line')
  .attr('class', 'temp')
  .attr('stroke', 'red')
  .attr('stroke-dasharray', 2)
  .attr('fill', 'none')

draw()

function draw() {
  chart.on('mousemove', (e) => {
    if (points.length === 1) {
      const p = d3.pointer(e, chart)
      tempLine
        .attr('x1', points[0][0])
        .attr('y1', points[0][1])
        .attr('x2', p[0])
        .attr('y2', p[1])
    }
  })
  chart.on('click', (e) => {
    const p = d3.pointer(e, chart)
    points.push(p)
    if (points.length <= 2) {
      chart
        .append('g')
        .call((g) => {
          g.append('circle').attr('r', 3)
        })
        .attr('transform', () => `translate(${p})`)

      if (points.length === 2) {
        chart
          .append('line')
          .attr('stroke', '#aaa')
          .attr('stroke-dasharray', 2)
          .attr('x1', points[0][0])
          .attr('y1', points[0][1])
          .attr('x2', points[1][0])
          .attr('y2', points[1][1])
        points.length = 0
        // chart.select('.temp').remove();
      }
    }
  })
}
