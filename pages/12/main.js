import GUI from 'lil-gui'

const width = 600
const height = 600

class PixelBoard {
  constructor(id, options) {
    this.id = id
    this.color = options.color || 'black'
    this.resolution = options.resolution || 10
    this.isDrawing = false
    this.isErasing = false
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

    if (this.isErasing) {
      this.context.clearRect(x, y, 10, 10)
    } else {
      this.context.fillStyle = this.color
      this.context.fillRect(x, y, this.resolution, this.resolution)
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  saveAsImage() {
    let imageData = this.canvas.toDataURL('image/png')
    let image = new Image()
    image.src = imageData
    let link = document.createElement('a')
    link.href = image.src
    link.download = 'canvas_image.png'
    link.click()
  }

  changeOptions(options) {
    this.color = options.color || 'black'
    this.resolution = options.resolution || 10
    this.isErasing = options.eraseMode
  }
}

const gui = new GUI()
const options = {
  color: '#4d4c4c',
  eraseMode: false,
  resolution: 6,
  clear() {},
  saveAsImage() {}
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

gui.add(options, 'eraseMode').onChange((v) => {
  options.eraseMode = v
  board.changeOptions(options)
})

gui.add(options, 'clear').onChange(() => {
  board.clear()
})

gui.add(options, 'saveAsImage').onChange(() => {
  board.saveAsImage()
})
