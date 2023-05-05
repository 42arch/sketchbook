import * as d3 from 'd3'

let points = []

const width = d3.select('.container').node().offsetWidth
const height = d3.select('.container').node().offsetHeight

console.log(width, height)

const chartId = 'chart'
const chart = d3
  .select('.container')
  .append('svg')
  .attr('id', chartId)
  .attr('width', width)
  .attr('height', height)
  .attr('maxWidth', '100%')

// draw()

const addTempLine = () => {
  console.log('add')
  return chart
    .append('line')
    .attr('class', 'temp')
    .attr('stroke', 'red')
    .attr('stroke-dasharray', 2)
    .attr('fill', 'none')
}

function onDrag(event) {
  function dragstarted() {
    d3.select(this).attr('stroke', 'black')
  }

  function dragged(event, d) {
    console.log('dragged', event, d)
    d3.select(this)
      .raise()
      .attr('cx', (d.x = event.x))
      .attr('cy', (d.y = event.y))
  }

  function dragended() {
    d3.select(this).attr('stroke', null)
  }

  return d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}

const clear = () => {
  chart.selectChildren().remove()
  points = []
}

const drawLine = () => {
  const label = ['start', 'end']
  let tempLine = null

  chart.on('click', (e) => {
    console.log()
    if (points.length === 2) {
      return
    }

    const p = [e.offsetX, e.offsetY]
    if (points.length <= 2) {
      if (points.length === 0) {
        tempLine = addTempLine()
      }
      points.push(p)
      const controlNode = chart
        .append('g')
        .attr('class', 'control')
        .attr('transform', () => `translate(${p})`)
      const point = controlNode
        .append('circle')
        .attr('class', 'point')
        .attr('r', 5)
        .style('cursor', 'pointer')
        .call(
          d3
            .drag()
            .on('start', () => {})
            .on('drag', (e, n) => {
              console.log('drag started', e, n)
            })
            .on('end', () => {})
        )

      controlNode
        .append('text')
        .text(() => label[points.length - 1])
        .attr('dy', 20)

      // chart
      //   .append('g')
      //   .call((g) => {
      //     const point = g
      //       .append('circle')
      //       .attr('class', 'point')
      //       .attr('r', 5)
      //       .style('cursor', 'pointer')
      //       .call(onDrag())

      //     // point.call(
      //     //   drag()
      //     //     .subject(point)
      //     //     .on('start', (event, d) => {
      //     //       console.log('drag start', d)
      //     //       point.attr('fill', 'orange')
      //     //     })
      //     //     .on('drag', (event, d) => {
      //     //       console.log('dragging', event, d)
      //     //       point.attr('cx', event.x).attr('cy', event.y)
      //     //     })
      //     //     .on('end', (event) => {
      //     //       console.log('drag end', event)
      //     //       select(this).attr('fill', 'black')
      //     //     })
      //     // )

      //     g.append('text')
      //       .text(() => label[points.length - 1])
      //       .attr('dy', 20)
      //   })
      //   .attr('transform', () => `translate(${p})`)

      if (points.length === 2) {
        chart.select('.temp').remove()
        chart
          .append('line')
          .attr('stroke', '#aaa')
          .attr('stroke-dasharray', 2)
          .attr('x1', points[0][0])
          .attr('y1', points[0][1])
          .attr('x2', points[1][0])
          .attr('y2', points[1][1])
      }
    }
  })

  chart.on('mousemove', (e) => {
    if (points.length === 1) {
      const p = [e.offsetX, e.offsetY]
      if (tempLine) {
        tempLine
          .attr('x1', points[0][0])
          .attr('y1', points[0][1])
          .attr('x2', p[0])
          .attr('y2', p[1])
      }
    }
  })
}

document.querySelector('#line-btn').addEventListener('click', () => {
  clear()
  drawLine()
})
