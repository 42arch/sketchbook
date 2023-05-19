import * as P5 from 'p5'

new P5((p5) => {
  p5.setup = () => {
    const canvas = p5.createCanvas(200, 200)
    canvas.parent('#circle')
  }
})
