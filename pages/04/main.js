import * as d3 from 'd3'

const margin = { top: 20, right: 30, bottom: 20, left: 30 }

const renderCircle = (id) => {
  const width = d3.select(id).node().offsetWidth,
    height = d3.select(id).node().offsetHeight
  const boundWidth = width - margin.left - margin.right,
    boundHeight = height - margin.top - margin.bottom

  const xScale = d3
    .scaleLinear()
    .domain([-1.5, 1.5])
    .range([-width / 2, width / 2])

  const wrapper = d3
    .select(id)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .append('g')
    .style('filter', 'url(#gooey)')
    .attr(
      'transform',
      `translate(${boundWidth / 2 + margin.left}, ${
        boundHeight / 2 + margin.top
      })`
    )

  const defs = wrapper.append('defs')
  const filter = defs.append('filter').attr('id', 'gooey')
  filter
    .append('feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', '10')
    .attr('result', 'blur')
  filter
    .append('feColorMatrix')
    .attr('in', 'blur')
    .attr('mode', 'matrix')
    .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9')
    .attr('result', 'gooey')
  filter
    .append('feComposite')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'goo')
    .attr('operator', 'atop')

  // add circle
  wrapper
    .append('rect')
    .attr('class', 'center')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 20)
    .style('fill', '#81BC00')

  const steps = 15
  wrapper
    .selectAll('.fly')
    .data(d3.range(steps).map((n) => (n / steps) * (2 * Math.PI)))
    .enter()
    .append('circle')
    .attr('class', 'fly')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 15)
    .style('fill', '#81BC00')
    .call(update)

  function update() {
    const circle = d3.selectAll('.fly')
    const dur = 1500,
      del = 500

    function repeat() {
      circle
        .transition('outward')
        .duration(dur)
        .delay((d, i) => i * del)
        .attr('cy', (d) => xScale(Math.sin(d)))
        .attr('cx', (d) => xScale(Math.cos(d)))
        .transition('inward')
        .duration(dur)
        .delay((d, i) => steps * del + i * del)
        .attr('cx', 0)
        .attr('cy', 0)
        .call(endall, repeat)
    }
    repeat()
  }

  function endall(transition, callback) {
    let n = 0
    transition
      .each(function () {
        ++n
      })
      .on('end', function () {
        if (!--n) callback.apply(this, arguments)
      })
  }
}

const renderRect = (id) => {
  var data = [
    { xLoc: -50, seed: 1 },
    { xLoc: 0, seed: 2 },
    { xLoc: 50, seed: 3 }
  ]
  const width = d3.select(id).node().offsetWidth,
    height = d3.select(id).node().offsetHeight
  const boundWidth = width - margin.left - margin.right,
    boundHeight = height - margin.top - margin.bottom,
    rectWidth = 200,
    rectHeight = 30

  const scale = d3
    .scaleLinear()
    .domain([-1, 1])
    .range([
      Math.min(boundHeight / 2, 200),
      -1 * Math.min(boundHeight / 2, 200)
    ])

  const random = (d) => {
    const x = Math.sin(d) * 10000
    const rand = x - Math.floor(x)
    return (Math.floor(Math.random() * 2) == 1 ? 1 : -1) * (scale(rand) + 20)
  }

  const wrapper = d3
    .select(id)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .append('g')
    .style('filter', 'url(#gooey)')
    .attr(
      'transform',
      `translate(${boundWidth / 2 + margin.left}, ${
        boundHeight / 2 + margin.top
      })`
    )

  const defs = wrapper.append('defs')
  const filter = defs.append('filter').attr('id', 'gooey')
  filter
    .append('feGaussianBlur')
    .attr('in', 'SourceGraphic')
    .attr('stdDeviation', '10')
    .attr('result', 'blur')
  filter
    .append('feColorMatrix')
    .attr('in', 'blur')
    .attr('mode', 'matrix')
    .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9')
    .attr('result', 'gooey')
  filter
    .append('feComposite')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'goo')
    .attr('operator', 'atop')

  wrapper
    .append('rect')
    .attr('class', 'centerRect')
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .attr('x', -rectWidth / 2)
    .attr('y', -rectHeight / 2)
    .style('fill', '#81BC00')

  wrapper
    .selectAll('.flyCircle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'flyCircle')
    .attr('cx', function (d, i) {
      return d.xLoc
    })
    .attr('cy', 0)
    .attr('r', 15)
    .style('fill', '#81BC00')
    .transition()
    .duration(1000)
    .delay(function (d, i) {
      return i * 300
    })
    .attr('cy', function (d) {
      return random(d.seed++)
    })
    .each(update)

  function update() {
    let circle = d3.select(this)

    function repeat() {
      circle = circle
        .transition()
        .duration(1000)
        .attr('cy', 0)
        .transition()
        .duration(1000)
        .attr('cy', function (d) {
          return random(d.seed++)
        })
        .on('end', repeat)
    }
    repeat()
  }
}

renderCircle('#circle')
renderRect('#rect')
