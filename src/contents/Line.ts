import Point from "./Point";

class Line {
  start: Point
  end: Point
  color ='#20242C'

  constructor(start: Point, end: Point, color?: string) {
    this.start = start
    this.end = end
    this.color = color
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.strokeStyle = this.color
    ctx.beginPath()
    ctx.moveTo(this.start.x, this.start.y)
    ctx.lineTo(this.end.x, this.end.y)
    ctx.closePath()
    ctx.stroke()
    ctx.restore()
  }
}

export default Line
