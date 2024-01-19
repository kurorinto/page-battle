import BattleObject from "./BattleObject";
import Firework from "./Firework";


class Bullet extends BattleObject {
  /** 子弹发射方向 */
  deg: number
  /** 是否存在 */
  existed = true
  /** 击中rect */
  firework: Firework

  constructor({ x, y, w = 10, h = 10, deg }: { x: number; y: number; w?: number; h?: number; deg: number }) {
    super({ x, y, w, h })
    this.deg = deg
    this.existed = true
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
  }

  move(delta: number) {
    ({ x: this.x, y: this.y } = Bullet.movePointFromAngle({ x: this.x, y: this.y }, this.deg, delta))
    this.existed = Bullet.boundaryLimit({ x: this.x, y: this.y })
    this.murderElement()
  }

  hit() {
    // 子弹消失
    this.existed = false
    // 创建击中焰火
    const { x, y, w, h } = this
    this.firework = new Firework({ x, y, w, h })
  }

  murderElement() {
    const el = this.getElementFromPoint()
    if (el) {
      this.hit()
      el.remove()
    }
  }

  getElementFromPoint() {
    let el = document.elementFromPoint(this.x, this.y)
    if (!el) {
      return null
    }
    if (el.childElementCount) {
      return null
    }
    if (el.nodeType === Node.TEXT_NODE) {
      el = el.parentElement
    }
    // 只消除元素节点
    if (el.nodeType !== Node.ELEMENT_NODE) {
      return null
    }
    return el as HTMLElement
  }
}

export default Bullet
