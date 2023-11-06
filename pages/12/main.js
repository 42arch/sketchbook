import GUI from 'lil-gui'

const width = 600
const height = 600

class PixelBoard {
  constructor(id, options) {
    this.id = id
    this.color = options.color || 'black'
    this.resolution = options.resolution || 10
    this.isDrawing = false
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    this.init()
  }

  init() {
    const element = document.getElementById(this.id)
    element.appendChild(this.canvas)
    this.canvas.width = width
    this.canvas.height = height

    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this))
    this.canvas.addEventListener('mousemove', this.draw.bind(this))
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this))
  }

  startDrawing(e) {
    this.isDrawing = true
    this.draw(e)
  }

  stopDrawing() {
    this.isDrawing = false
  }

  draw(e) {
    if (!this.isDrawing) return
    let rect = this.canvas.getBoundingClientRect()
    let x =
      Math.floor((e.clientX - rect.left) / this.resolution) * this.resolution
    let y =
      Math.floor((e.clientY - rect.top) / this.resolution) * this.resolution

    this.context.fillStyle = this.color
    this.context.fillRect(x, y, this.resolution, this.resolution)
  }

  changeOptions(options) {
    this.color = options.color || 'black'
    this.resolution = options.resolution || 10
  }
}

const gui = new GUI()
const options = {
  color: '#08BDBA',
  resolution: 6
}

const board = new PixelBoard('board', options)

gui.addColor(options, 'color', 0, 40, 1).onChange((v) => {
  options.color = v
  board.changeOptions(options)
})

gui.add(options, 'resolution', ['3', '6', '10', '12']).onChange((v) => {
  options.resolution = v
  board.changeOptions(options)
})
