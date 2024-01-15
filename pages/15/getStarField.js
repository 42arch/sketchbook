import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  TextureLoader,
  Vector3
} from 'three'

export default function getStarField({ num = 500 }) {
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25
    const u = Math.random()
    const v = Math.random()
    const theta = 2 * Math.PI * u
    const phi = Math.acos(2 * v - 1)
    let x = radius * Math.sin(phi) * Math.cos(theta)
    let y = radius * Math.sin(phi) * Math.sin(theta)
    let z = radius * Math.cos(phi)

    return {
      pos: new Vector3(x, y, z),
      hue: 0.6,
      minDist: radius
    }
  }

  const verts = []
  const colors = []
  const positions = []
  let col

  for (let i = 0; i < num; i += 1) {
    let p = randomSpherePoint()
    const { pos, hue } = p
    positions.push(p)
    col = new Color().setHSL(hue, 0.2, Math.random())
    verts.push(pos.x, pos.y, pos.z)
    colors.push(col.r, col.g, col.b)
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(verts, 3))
  geo.setAttribute('color', new Float32BufferAttribute(colors, 3))

  const mat = new PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new TextureLoader().load('/assets/textures/1.png')
  })
  const points = new Points(geo, mat)
  return points
}
