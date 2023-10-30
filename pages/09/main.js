import * as d3 from 'd3'
import GUI from 'lil-gui'
import data from './../data/faithful.json'
import { debounce } from '../../utils/debounce'

class Contour {
  constructor(id, margin, data, xField, yField, bandwidth, thresholds) {
    this.id = id
    this.data = data
    this.margin = margin
    this.xField = xField
    this.yField = yField
    this.bandwidth = bandwidth
    this.thresholds = thresholds

    this.width = d3.select(id).node().offsetWidth
    this.height = d3.select(id).node().offsetHeight

    this.wrapper = null
    this.path = null

    this.xScale = d3
      .scaleLinear()
      .domain(d3.extent(this.data, (d) => d[this.xField]))
      .nice()
      .rangeRound([this.margin, this.width - this.margin])

    this.yScale = d3
      .scaleLinear()
      .domain(d3.extent(this.data, (d) => d[this.yField]))
      .nice()
      .rangeRound([this.height - this.margin, this.margin])

    this.contours = d3
      .contourDensity()
      .x((d) => this.xScale(d[this.xField]))
      .y((d) => this.yScale(d[this.yField]))
      .size([this.width, this.height])
      .bandwidth(this.bandwidth)
      .thresholds(this.thresholds)(this.data)

    this.color = d3.scaleSequential(
      d3.extent(this.contours, (d) => d.value),
      d3.interpolateYlGnBu
    )

    this.render()
  }

  render() {
    this.wrapper = d3
      .select(this.id)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height])
    this.wrapper
      .append('g')
      .attr('transform', `translate(0,${this.height - this.margin})`)
      .call(d3.axisBottom(this.xScale).tickSizeOuter(0))
      // .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('y', -3)
          .attr('dy', null)
          .attr('font-weigth', 'bold')
          .attr('z-index', -1)
          .text('Idle (min.)')
      )

    this.wrapper
      .append('g')
      .attr('transform', `translate(${this.margin}, 0)`)
      .call(d3.axisLeft(this.yScale).tickSizeOuter(0))
      // .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 3)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .text('Erupting (min.)')
      )

    this.wrapper
      .append('g')
      .attr('class', 'content')
      .attr('fill', 'none')
      .attr('stroke-linejoin', 'round')
      .selectAll()
      .data(this.contours)
      .join('path')
      .attr('class', 'contour-path')
      .attr('stroke', (d) => d3.lab(this.color(d.value)).darker(1))
      .attr('stroke-width', (d, i) => (i % 5 ? 0.25 : 1))
      .attr('d', d3.geoPath())
      .attr('fill', (d) => {
        return this.color(d.value)
      })
      .exit()
      .remove()

    this.wrapper
      .append('g')
      .attr('class', 'points')
      .attr('stroke', 'white')
      .selectAll()
      .data(this.data)
      .join('circle')
      .attr('cx', (d) => this.xScale(d[this.xField]))
      .attr('cy', (d) => this.yScale(d[this.yField]))
      .attr('r', '2')
      .attr('fill', 'grey')
      .attr('opacity', 0.9)
      .attr('z-index', 999)
  }

  update(bandwidth, thresholds, colorScheme) {
    // this.wrapper.selectAll('.content').remove()
    console.log('update')

    this.bandwidth = bandwidth
    this.thresholds = thresholds
    this.contours = d3
      .contourDensity()
      .x((d) => this.xScale(d[this.xField]))
      .y((d) => this.yScale(d[this.yField]))
      .size([this.width, this.height])
      .bandwidth(this.bandwidth)
      .thresholds(this.thresholds)(this.data)

    this.color = d3.scaleSequential(
      d3.extent(this.contours, (d) => d.value),
      d3.interpolateYlGnBu
    )

    // this.wrapper
    //   .select('.content')
    //   .selectAll('.contour-path')
    //   .data(this.contours)
    //   .join('path')
    //   .attr('d', d3.geoPath())
    //   .attr('fill', (d) => this.color(d.value))

    const updatedPaths = this.wrapper
      .select('.content')
      .selectAll('.contour-path')
      .data(this.contours)

    updatedPaths
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('class', 'contour-path')
            .attr('fill', (d) => this.color(d.value))
            .attr('stroke', (d) => d3.lab(this.color(d.value)).darker(1))
            .attr('stroke-width', (d, i) => (i % 5 ? 0.25 : 1)),
        (update) => update,
        (exit) => exit.remove()
      )
      .attr('d', d3.geoPath())
  }
}

const gui = new GUI()
const params = {
  color: '#08BDBA',
  bandwidth: 20.4939,
  thresholds: 20
}

const contour = new Contour(
  '#contour1',
  60,
  data,
  'waiting',
  'eruptions',
  params.bandwidth,
  params.thresholds
)

gui.add(params, 'bandwidth', 0, 100, 1).onChange((v) => {
  contour.update(v, params.thresholds)
})
gui.add(params, 'thresholds', 0, 40, 1).onChange((v) => {
  contour.update(params.bandwidth, v)
})
