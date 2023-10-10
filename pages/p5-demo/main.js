import p5 from 'p5'

function create1dNoise() {
  const element = document.getElementById('noise1')

  new p5(
    (p) => {
      let offset = 0
      let increment = 0.01

      p.setup = () => {
        p.createCanvas(600, 600)
      }

      p.draw = () => {
        p.background(255)
        p.fill(204, 102, 0)
        p.stroke(0)
        p.noFill()
        p.beginShape()

        let xoff = offset
        for (let x = 0; x < p.width; x++) {
          const y = p.noise(xoff) * p.height
          p.vertex(x, y)
          xoff += increment
        }
        p.endShape()
        offset += increment
      }
    },
    element,
    true
  )
}

function create2dNoise() {
  const element = document.getElementById('noise2')

  new p5((p) => {
    const pixel = 6
    let noiseVal
    let noiseScale = 0.02
    let offset = 0
    let increment = 2

    p.setup = () => {
      p.createCanvas(600, 600)
      p.background('#fff')
      p.noStroke()
      p.noiseDetail(5, 0.5)

      // p.noLoop()
    }

    p.draw = () => {
      for (let y = 0; y < p.height; y += pixel) {
        for (let x = 0; x < p.width; x += pixel) {
          noiseVal = p.noise((x + offset) * noiseScale, y * noiseScale)
          p.fill(noiseVal * 255)
          p.rect(x, y, pixel, pixel)
        }
      }
      offset += increment
    }
  }, element)
}

// create1dNoise()
// create2dNoise()
