import Vector from "./Vector";

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

  static movePoint({ x, y }: Vector, deg, delta: number): Vector {
    const rad = deg * (Math.PI / 180);
    const newX = x - delta * Math.sin(rad)
    const newY = y + delta * Math.cos(rad)
    return new Vector(newX, newY)
  }

  static rotatePoint = ({ x: x1, y: y1 }: Vector, { x: x2, y: y2 }: Vector, deg: number): Vector => {
    let rad = (deg * Math.PI) / 180
    let newX = x2 + (x1 - x2) * Math.cos(rad) - (y1 - y2) * Math.sin(rad)
    let newY = y2 + (x1 - x2) * Math.sin(rad) + (y1 - y2) * Math.cos(rad)
    return new Vector(newX, newY)
  }
}

export default BattleObject
