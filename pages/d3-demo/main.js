import * as d3 from 'd3'

const data = [
  { date: new Date(2007, 3, 24), value: 13.24 },
  { date: new Date(2007, 3, 25), value: 35.35 },
  { date: new Date(2007, 3, 26), value: 98.84 },
  { date: new Date(2007, 3, 27), value: 59.92 },
  { date: new Date(2007, 3, 30), value: 9.8 },
  { date: new Date(2007, 4, 1), value: 99.47 }
]

const data1 = [
  [10, 60],
  [40, 90],
  [60, 10],
  [190, 10]
]

const width = d3.select('.renderer').node().offsetWidth
const height = d3.select('.renderer').node().offsetHeight
// const radius = 30
// const linear = d3.scaleLinear().domain([0, 100]).range([0, 1])
const line = d3
  .line()
  .x((d) =>
    d3
      .scaleLinear()
      .domain([
        d3.min(data.map((i) => i.date)),
        d3.max(data.map((i) => i.date))
      ])
      .range([0, 300])(d.date)
  )
  .y((d) => d3.scaleLinear().domain([0, 100]).range([1, 300])(d.value))
  .curve(d3.curveCatmullRom.alpha(0.4))

const pathData = line(data)
// 1
const svg1 = d3
  .select('#path1')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

const path1 = svg1
  .append('path')
  .attr('d', pathData)
  .attr('fill', 'none')
  .attr('stroke-width', 2)
  .attr('stroke', 'darkgrey')

// rect1
const svg2 = d3
  .select('#rect1')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

const rect1 = svg2
  .append('rect')
  .attr('x', width / 2 - 150 / 2)
  .attr('y', height / 2 - 150 / 2)
  .attr('width', 150)
  .attr('height', 150)
  .attr('rx', 12)
  .attr('ry', 12)
  .attr('style', 'fill-opacity: 0.1; stroke: #aaa; stroke-width: 1')
  .attr('stroke-dasharray', '3,3')

// note: svg rotate旋转规则与css不同，默认是以svg元素的左上角为中心变化的
// 居中旋转的方式：用rotate第二个参数偏移中心点。[x + width / 2, y + height / 2]

let angle = 0
d3.timer(() => {
  rect1.attr(
    'transform',
    `rotate(${angle}, ${width / 2 - 150 / 2 + 150 / 2} ${
      height / 2 - 150 / 2 + 150 / 2
    })`
  )
  angle++
})

// Equilateral triangle
const svg3 = d3
  .select('#tri1')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

const center = {
  x: width / 2,
  y: height / 2
}
const radius = 100
function getTriPoints(triangleSize) {
  return [
    [width / 2, height / 2 - (Math.sqrt(3) / 3) * triangleSize],
    [
      width / 2 - triangleSize / 2,
      height / 2 + (Math.sqrt(3) / 6) * triangleSize
    ],
    [
      width / 2 + triangleSize / 2,
      height / 2 + (Math.sqrt(3) / 6) * triangleSize
    ]
  ]
}

const tri1 = svg3.append('polygon').attr('points', getTriPoints(30))

let angle1 = 0

function rotateTriangle() {
  angle1 += 1
  const transform = `rotate(${angle1}, ${width / 2}, ${height / 2})`
  tri1.attr('transform', transform)
}

d3.timer(rotateTriangle, 50)
