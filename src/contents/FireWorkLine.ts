import BattleObject from "./BattleObject";
import Line from "./Line";
import type Point from "./Point";
import { getRandomInt } from "./utils";

class FireWorkLine extends Line {
  startPos: Point
  maxDis: number
  /** 是否存在 */
  existed = true

  constructor(start: Point, end: Point, color: string) {
    super(start, end, color)
    this.startPos = start
    this.maxDis = getRandomInt(100, 200)
  }

  draw(ctx: CanvasRenderingContext2D) {
    const distance = BattleObject.calculateDistance(this.start, this.startPos)
    this.existed = distance < this.maxDis
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

export default FireWorkLine
