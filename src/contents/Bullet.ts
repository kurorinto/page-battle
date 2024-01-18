import BattleObject from "./BattleObject";

class Bullet extends BattleObject {
  /** 子弹发射方向 */
  deg: number
  /** 是否越界 */
  safe = true

  constructor({ x, y, w = 10, h = 10, deg }: { x: number; y: number; w?: number; h?: number; deg: number }) {
    super({ x, y, w, h })
    this.deg = deg
    this.safe = true
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 渲染子弹
    ctx.save()
    ctx.fillStyle = 'red'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.w / 2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.restore()
  }

  move(delta: number) {
    ({ x: this.x, y: this.y } = Bullet.movePoint({ x: this.x, y: this.y }, this.deg, delta))
    this.safe = this.boundaryLimit()
    this.murderElement()
  }

  boundaryLimit() {
    if (this.x < 0 || this.x > window.innerWidth) {
      return false
    }
    if (this.y < 0 || this.y > window.innerHeight) {
      return false
    }
    return true
  }

  murderElement() {
    const el = this.getElementFromPoint()
    if (el) {
      el.remove()
    }
  }

  getElementFromPoint() {
    let el = document.elementFromPoint(this.x, this.y)
    if (!el) {
      return false
    }
    if (el.childElementCount) {
      return false
    }
    if (el.nodeType === Node.TEXT_NODE) {
      el = el.parentElement
    }
    return el
  }
}

export default Bullet
