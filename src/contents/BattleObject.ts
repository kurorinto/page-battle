import FireWorkLine from "./FireWorkLine";
import Line from "./Line";
import Point from "./Point";

class BattleObject {
  x: number
  y: number
  w: number
  h: number

  constructor({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(this.x + this.w, this.y)
    ctx.lineTo(this.x + this.w, this.y + this.h)
    ctx.lineTo(this.x, this.y + this.h)
    ctx.closePath()
    ctx.stroke()
    ctx.restore()
  }

  static movePointFromAngle({ x, y }: Point, deg: number, delta: number): Point {
    const rad = deg * (Math.PI / 180);
    const newX = x - delta * Math.sin(rad)
    const newY = y + delta * Math.cos(rad)
    return new Point(newX, newY)
  }

  static movePointFromPoint({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point, delta: number): Point {
    // 计算两点连线的斜率和偏转角
    const slope = (y2 - y1) / (x2 - x1);
    const angle = Math.atan(slope);
    const isRight = x2 > x1;
    // 计算新点的坐标
    const newX = isRight ? x1 - delta * Math.cos(angle) : x1 + delta * Math.cos(angle);
    const newY = isRight ? y1 - delta * Math.sin(angle) : y1 + delta * Math.sin(angle);
    return new Point(newX, newY)
  }

  static moveLineFromPoint<T extends Line | FireWorkLine>(line: T, { x, y }: Point, delta: number): T {
    const newStart = BattleObject.movePointFromPoint(line.start, { x, y }, delta)
    const newEnd = BattleObject.movePointFromPoint(line.end, { x, y }, delta)
    line.start = newStart
    line.end = newEnd
    return line
  }

  static rotatePoint = ({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point, deg: number): Point => {
    let rad = (deg * Math.PI) / 180
    let newX = x2 + (x1 - x2) * Math.cos(rad) - (y1 - y2) * Math.sin(rad)
    let newY = y2 + (x1 - x2) * Math.sin(rad) + (y1 - y2) * Math.cos(rad)
    return new Point(newX, newY)
  }

  static getNumbersWithInterval(a: number, b: number, gap: number): number[] {
    let result = [];
    for (let i = a + gap; i < b; i += gap) {
      result.push(i);
    }
    return result;
  }

  static boundaryLimit({ x, y }: Point) {
    if (x < 0 || x > window.innerWidth) {
      return false
    }
    if (y < 0 || y > window.innerHeight) {
      return false
    }
    return true
  }

  static calculateDistance({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
  }
}

export default BattleObject
