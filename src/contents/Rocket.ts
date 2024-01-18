
class Rocket {
  x: number
  y: number
  w: number
  h: number
  deg: number
  lines: [number, number][][]
  strokeStyle = '#20242C'
  constructor({ x, y, w, h, deg = 0 }: { x: number; y: number; w: number; h: number; deg?: number }) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.deg = deg
    this.lines = [
      [
        [x - w / 2, y - h / 2],
        [x, y + h / 2],
        [x + w / 2, y - h / 2],
        [x, y - h / 4],
        [x - w / 2, y - h / 2],
      ],
      [
        [x, y - h / 4],
        [x, y + h / 2],
      ],
    ]
    this.rotate(deg)
  }
  stroke(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.strokeStyle = this.strokeStyle
    ctx.beginPath()
    this.lines.forEach((line) => {
      line.forEach(([x, y], i) => {
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
    })
    ctx.stroke()
    ctx.restore()
  }
  rotate(deg: number) {
    this.lines = this.lines.map((line) => {
      return line.map((point) => {
        return Rocket.rotatePoint(point, [this.x, this.y], deg)
      })
    })
    // 保存当前角度
    this.deg += deg
  }
  move(delta: number) {
    this.lines = this.lines.map((line) => {
      return line.map((point) => {
        return Rocket.movePoint(point, this.deg, delta)
      })
    });
    // 保存当前位置
    [this.x, this.y] = Rocket.movePoint([this.x, this.y], this.deg, delta)
  }

  static movePoint([x, y]: [number, number], deg, delta: number): [number, number] {
    const rad = deg * (Math.PI / 180);
    const newX = x - delta * Math.sin(rad)
    const newY = y + delta * Math.cos(rad)
    return [newX, newY]
  }

  static rotatePoint = ([x1, y1]: [number, number], [x2, y2]: [number, number], deg: number): [number, number] => {
    let rad = (deg * Math.PI) / 180
    let newX = x2 + (x1 - x2) * Math.cos(rad) - (y1 - y2) * Math.sin(rad)
    let newY = y2 + (x1 - x2) * Math.sin(rad) + (y1 - y2) * Math.cos(rad)
    return [newX, newY]
  }

}

export default Rocket
