import * as d3 from 'd3'

const width = d3.select('.renderer').node().offsetWidth
const height = d3.select('.renderer').node().offsetHeight
const radius = 30
// const color = d3.scaleSequential(d3.interpolateCividis).domain([0, Math.PI])
const color = d3.scaleSequential(d3.interpolateRainbow)
console.log(2333, color(1))

// 1.
const svg1 = d3
  .select('#animate1')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

const circle1 = svg1
  .append('g')
  .append('circle')
  .attr('cx', width / 2)
  .attr('cy', height / 2)
  .attr('r', radius)
  .attr('fill', '#aaa')
  .attr('stroke', '#fff')
  .attr('stroke-width', 2)

d3.timer(() => circle1.attr('fill', d3.interpolateRainbow(Date.now() / 10000)))

// 2.
const data = Array.from(Array(5).keys())

const svg2 = d3
  .select('#animate2')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

svg2
  .append('circle')
  .classed('circle-body', true)
  .attr('r', radius)
  .attr('stroke', 'yellow')
  .attr('fill', 'orange')
  .attr('opacity', 1)
  .attr('cx', width / 2)
  .attr('cy', height / 2)

svg2
  .selectAll('circle.animate')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'animate')
  .attr('id', (d, i) => `no_${i}`)
  .attr('r', radius)
  .attr('stroke', 'orange')
  .attr('stroke-width', 1)
  .attr('fill', 'none')
  .attr('opacity', 1)
  .attr('cx', width / 2)
  .attr('cy', height / 2)

function blink() {
  svg2.selectAll('circle.animate').each((d, idx, g) => {
    let index = idx
    d3.select(g[idx])
      .transition()
      .duration(4000)
      .delay(index * 1500)
      .attr('opacity', 0)
      .attr('r', radius * 2)
      .on('end', (d, i, g) => {
        d3.select(g[i]).attr('r', 30).attr('opacity', 1)
        if (index === 2) {
          blink()
        }
      })
  })
}

blink()

// 3.
const svg3 = d3
  .select('#animate3')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

const circle3 = svg3
  .append('circle')
  .attr('r', radius)
  .attr('stroke', '#000')
  .attr('fill', '#fff')
  .attr('opacity', 1)
  .attr('cx', width / 2)
  .attr('cy', height / 2)
const [centerX, centerY] = [width / 2 - radius / 2, height / 2 - radius / 2]
// path绘制三角形
const obj = svg3
  .append('path')
  .attr(
    'd',
    `M ${centerX + 10} ${centerY + 5} L ${centerX + 15} ${centerY + 15} L ${
      centerX + 5
    } ${centerY + 15} Z`
  )

// polygon绘制三角形
// const obj = svg3
//   .append('polygon')
//   .attr(
//     'points',
//     `${centerX + 10},${centerY + 5} ${centerX + 15},${centerY + 15} ${
//       centerX + 5
//     },${centerY + 15}`
//   )

// const obj = svg3
//   .append('circle')
//   .attr('cx', width / 2)
//   .attr('cy', height / 2)
//   .attr('r', 3)
//   .attr('fill', '#000')

let angle = 0
function rotate() {
  angle += 1
  const transform = `rotate(${angle}, ${centerX + radius / 2}, ${
    centerY + radius / 2
  })`
  obj.attr('transform', transform)
}

d3.timer(rotate)

// function spinPoint(angle, clockwise) {
//   const radian = (angle * Math.PI) / 180
//   const x = Math.cos(radian) * radius
//   const y = Math.sin(clockwise ? radian : -radian) * radius
//   obj.attr('transform', `translate(${x} ${y}) `)
// }

// let i = 0
// d3.timer(() => {
//   spinPoint(i, false)
//   i = i + 2
// })
