import p5 from 'p5'

function create1DNoise() {
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

function create1DBezier() {
  const element = document.getElementById('noise1-bezier')
  let t

  new p5((p) => {
    p.setup = () => {
      p.createCanvas(600, 600)
      p.stroke(0, 18)
      p.noFill()
      t = 0
    }

    p.draw = () => {
      let x1 = p.width * p.noise(t + 15)
      let x2 = p.width * p.noise(t + 25)
      let x3 = p.width * p.noise(t + 35)
      let x4 = p.width * p.noise(t + 45)
      let y1 = p.height * p.noise(t + 55)
      let y2 = p.height * p.noise(t + 65)
      let y3 = p.height * p.noise(t + 75)
      let y4 = p.height * p.noise(t + 85)

      p.bezier(x1, y1, x2, y2, x3, y3, x4, y4)
      t += 0.005

      if (p.frameCount % 1000 == 0) {
        p.background(255)
      }
    }
  }, element)
}

function create2DNoise() {
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

create1DNoise()
create1DBezier()
create2DNoise()
