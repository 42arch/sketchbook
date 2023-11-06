const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
const width = 600
const height = 600

let moved = false
let ball = {
  x: width / 2,
  y: height / 2,
  radius: 8,
  speedX: 0,
  speedY: -2
}

const paddle = {
  width: 90,
  height: 10,
  x: (width - 90) / 2
}

function createCanvas() {
  const element = document.getElementById('game')
  element.appendChild(canvas)
  canvas.width = width
  canvas.height = height

  canvas.addEventListener('mousemove', handleMove, true)
}

function handleMove(e) {
  moved = true
  if (e.layerX + paddle.width / 2 >= width) {
    paddle.x = width - paddle.width
  } else if (e.layerX - paddle.width / 2 <= 0) {
    paddle.x = 0
  } else {
    paddle.x = e.layerX - paddle.width / 2
  }
}

function intersection() {
  return ball.x - (paddle.x + paddle.width / 2)
}

function renderCanvas() {
  context.fillStyle = '#000000'
  context.fillRect(0, 0, width, height)
  context.beginPath()
  context.setLineDash([8])
  context.moveTo(0, height / 2)
  context.lineTo(width, height / 2)
  context.strokeStyle = '#ffffff'
  context.stroke()
  context.closePath()

  // ball
  context.beginPath()
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
  context.fillStyle = '#ffffff'
  context.fill()
  context.closePath()

  // top paddle
  context.beginPath()
  context.rect(paddle.x, 0, paddle.width, paddle.height)
  context.fillStyle = '#ffffff'
  context.fill()
  context.closePath()

  // bottom paddle
  context.beginPath()
  context.rect(paddle.x, height - paddle.height, paddle.width, paddle.height)
  context.fillStyle = '#ffffff'
  context.fill()
  context.closePath()
}

function update() {
  ball.x += ball.speedX
  ball.y += ball.speedY

  if (
    ball.x + ball.radius >= paddle.x &&
    ball.x - ball.radius <= paddle.x + paddle.width
  ) {
    if (ball.y <= paddle.height) {
      // top paddle
      if (moved) {
        if (intersection() > 0) {
          ball.speedX -= 1
        } else {
          ball.speedX += 1
        }
      }

      ball.speedY = -ball.speedY
      ball.y = paddle.height + ball.radius
    } else if (ball.y >= height - paddle.height) {
      // bottom paddle
      if (moved) {
        if (intersection() > 0) {
          ball.speedX += 1
        } else {
          ball.speedX -= 1
        }
      }

      ball.speedY = -ball.speedY
      ball.y = height - paddle.height - ball.radius
    }
    moved = false
  } else {
    if (ball.y + ball.radius > height) {
      ball.speedX = 0
      ball.y = height - ball.radius
    } else if (ball.y < ball.radius) {
      ball.speedX = 0
      ball.y = ball.radius
    }

    // hit left and right wall
    if (ball.x + ball.radius > width) {
      console.log('right')

      ball.speedX = -ball.speedX
      ball.x = width - ball.radius
    } else if (ball.x - ball.radius < 0) {
      console.log('left')
      ball.speedX = -ball.speedX
      ball.x = ball.radius
    }
  }
}

function loop() {
  renderCanvas()
  update()
  window.requestAnimationFrame(loop)
}

createCanvas()
loop()
