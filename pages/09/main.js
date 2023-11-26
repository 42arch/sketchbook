import p5 from 'p5'

function createTerrain() {
  const element = document.getElementById('noise3')

  new p5((p) => {
    const w = 1400
    const h = 1400
    let flying = 0
    let cols, rows
    let scl = 20
    let terrain = []

    p.setup = () => {
      p.frameRate(30)
      p.createCanvas(600, 600, p.WEBGL)
      cols = w / scl
      rows = h / scl
      terrain = create2DArray(cols, rows)
    }

    p.draw = () => {
      flying -= 0.2
      let yoff = flying

      for (let y = 0; y < rows; y++) {
        let xoff = 0
        for (let x = 0; x < cols; x++) {
          terrain[x][y] = p.map(p.noise(xoff, yoff), 0, 1, -60, 60)
          xoff += 0.2
        }
        yoff += 0.2
      }

      p.background(0)
      p.stroke(255)
      p.noFill()
      p.rotateX(p.PI / 3)
      // 将坐标原点移动到左上角
      p.translate(-p.width / 2 - 100, -p.height / 2 + 50)

      for (let y = 0; y < rows - 1; y++) {
        p.smooth()
        p.beginShape(p.TRIANGLE_STRIP)

        for (let x = 0; x < cols; x++) {
          p.vertex(x * scl, y * scl, terrain[x][y])
          p.vertex(x * scl, (y + 1) * scl, terrain[x][y + 1])
        }
        p.endShape()
      }
    }
  }, element)
}

function create2DArray(cols, rows) {
  let arr = new Array(cols)
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows)
  }
  return arr
}

createTerrain()
