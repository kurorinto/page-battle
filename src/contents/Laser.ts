import BattleObject from "./BattleObject";
import type Point from "./Point";

class Laser {
  color = 'red'
  start: Point
  angle: number
  w: number

  constructor(start: Point, angle: number, w: number) {
    this.start = start
    this.angle = angle
    this.w = w
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}

export default Laser
