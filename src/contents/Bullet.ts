import BattleObject from "./BattleObject";

class Bullet extends BattleObject {
  /** 子弹发射方向 */
  deg: number

  constructor({ x, y, w = 10, h = 10, deg }: { x: number; y: number; w?: number; h?: number; deg: number }) {
    super({ x, y, w, h })
    this.deg = deg
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
  }
}

export default Bullet
