import p5 from 'p5'

let grid
let cols
let rows
let resolution = 3

function make2DArray(cols, rows) {
  let arr = new Array(cols)
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows)
  }
  return arr
}

function countNeighbors(grid, x, y) {
  let sum = 0
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols
      let row = (y + j + rows) % rows
      sum += grid[col][row]
    }
  }
  sum -= grid[x][y]
  return sum
}

function initGame() {
  const element = document.getElementById('game')
  const width = 600
  const height = 600

  new p5(
    (p) => {
      function init() {
        grid = make2DArray(cols, rows)
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            grid[i][j] = p.floor(p.random(2))
          }
        }
      }

      p.setup = () => {
        p.createCanvas(width, height)
        cols = width / resolution
        rows = height / resolution

        init()
      }

      p.draw = () => {
        p.background(0)

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            let x = i * resolution
            let y = j * resolution
            if (grid[i][j] === 1) {
              p.fill(255)
              p.stroke(0)
              p.rect(x, y, resolution, resolution)
            }
          }
        }

        let next = make2DArray(cols, rows)

        // 计算接下来的状态
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            let state = grid[i][j]
            let neighbors = countNeighbors(grid, i, j)

            if (state == 0 && neighbors == 3) {
              next[i][j] = 1
            } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
              next[i][j] = 0
            } else {
              next[i][j] = state
            }
          }
        }
        grid = next
      }

      p.mousePressed = () => {
        init()
      }
    },
    element,
    true
  )
}

initGame()
