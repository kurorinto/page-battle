import Battle from "./Battle";
import BattleObject from "./BattleObject";
import Firework from "./Firework";
import type Point from "./Point";


class Bullet extends BattleObject {
  /** 子弹发射方向 */
  angle: number
  /** 是否存在 */
  existed = true
  /** 击中火焰 */
  firework: Firework
  /** 速度 */
  speed: number

  constructor({ x, y, r, angle, speed }: { x: number; y: number; r: number; angle: number; speed: number }) {
    super({ x, y, w: r, h: r })
    this.angle = angle
    this.existed = true
    this.speed = speed
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 渲染子弹
    ctx.save()
    ctx.fillStyle = 'red'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.w / 2, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
    this.move(this.speed / Battle.fps)
  }

  move(delta: number) {
    const hitPoint = this.murderElement();
    if (hitPoint) {
      this.hit(hitPoint)
    } else {
      ({ x: this.x, y: this.y } = Bullet.movePointFromAngle({ x: this.x, y: this.y }, this.angle, delta))
      this.existed = Bullet.boundaryLimit({ x: this.x, y: this.y })
    }
  }

  hit(point: Point) {
    // 子弹消失
    this.existed = false
    // 创建击中焰火
    const { x, y } = point
    const { w, h } = this
    this.firework = new Firework({ x, y, w, h })
  }

  murderElement() {
    // 由于子弹每帧往前移动speed距离，可能会穿过一些小元素，因此需要判断子弹是否穿过了元素
    // 如果下一帧的移动规矩会跟元素交叉，就消除该元素，并把子弹位置设置为交叉点
    const deltas = BattleObject.getNumbersWithInterval(0, this.speed / Battle.fps, 1)
    const trackPoints = deltas.map(delta => Bullet.movePointFromAngle({ x: this.x, y: this.y }, this.angle, delta))

    let el: Element | null
    const hitPoint = trackPoints.find(point => {
      el = BattleObject.getElementFromPoint(point)
      return Boolean(el)
    })
    if (el && hitPoint) {
      this.hit(hitPoint)
      el.remove()
      return hitPoint
    }
  }
}

export default Bullet
