import * as d3 from 'd3'

const createLineChart = async () => {
  const id = '#chart1'
  const data = await d3.json('../data/washington_dc_weather.json')

  const width = d3.select(id).node().offsetWidth
  const height = d3.select(id).node().offsetHeight

  let margin = {
    top: 15,
    right: 15,
    bottom: 20,
    left: 60
  }
  const boundedWidth = width - margin.right - margin.left
  const boundedHeight = height - margin.bottom - margin.top

  console.log(33333, width, height, data)

  const yAccessor = (d) => d['temperatureMax']
  const dateParser = d3.timeParse('%Y-%m-%d')
  const xAccessor = (d) => dateParser(d['date'])

  // draw canvas
  const wrapper = d3
    .select(id)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('border', '1px solid')

  const bounds = wrapper
    .append('g')
    .style('transform', `translate(${margin.left}px, ${margin.top}px)`)

  // draw scales
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([boundedHeight, 0])

  const freezingTemperatures = bounds
    .append('rect')
    .attr('x', 0)
    .attr('y', yScale(50))
    .attr('width', boundedWidth)
    .attr('height', boundedHeight - yScale(50))
    .attr('fill', 'skyblue')

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xAccessor))
    .range([0, boundedWidth])

  // draw data
  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)))

  const line = bounds
    .append('path')
    .attr('d', lineGenerator(data))
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-width', 2)

  // draw peripherals
  const yAxisGenerator = d3.axisLeft().scale(yScale)
  const yAxis = bounds.append('g').call(yAxisGenerator)

  const xAxisGenerator = d3.axisBottom().scale(xScale)
  const xAxis = bounds
    .append('g')
    .call(xAxisGenerator)
    .style('transform', `translate(0, ${boundedHeight}px)`)
}

createLineChart()
