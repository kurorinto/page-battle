import BattleObject from "./BattleObject"
import Bullet from "./Bullet"
import Vector from "./Vector"
import throttle from 'lodash/throttle'

class Rocket extends BattleObject {
  /** 火箭朝向 */
  deg: number
  /** 火箭绘制线条 */
  lines: Vector[][] = []
  /** 子弹 */
  bullets: Bullet[] = []
  /** 火箭绘制颜色 */
  color = '#20242C'

  constructor({ x, y, w, h, deg = 0 }: { x: number; y: number; w: number; h: number; deg?: number }) {
    super({ x, y, w, h })

    this.deg = deg
    this.lines = [
      [
        new Vector(x - w / 2, y - h / 2),
        new Vector(x, y + h / 2),
        new Vector(x + w / 2, y - h / 2),
        new Vector(x, y - h / 4),
        new Vector(x - w / 2, y - h / 2),
      ],
      [
        new Vector(x, y - h / 4),
        new Vector(x, y + h / 2),
      ],
    ]
    this.rotate(deg)
    this.fire = throttle(this.fire.bind(this), 200, { trailing: false });
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 渲染火箭
    ctx.save()
    ctx.strokeStyle = this.color
    ctx.beginPath()
    this.lines.forEach((line) => {
      line.forEach(({ x, y }, i) => {
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
    })
    ctx.stroke()
    ctx.restore()
    // 渲染子弹
    this.bullets.forEach((bullet) => {
      if (bullet.safe) {
        bullet.move(12)
        bullet.draw(ctx)
      }
    })
  }

  rotate(deg: number) {
    this.lines = this.lines.map((line) => {
      return line.map((point) => {
        return Rocket.rotatePoint(point, new Vector(this.x, this.y), deg)
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
    ({ x: this.x, y: this.y } = Rocket.movePoint(new Vector(this.x, this.y), this.deg, delta))
  }

  fire() {
    const w = 5
    const h = 5
    const { x, y } = Rocket.movePoint(new Vector(this.x, this.y), this.deg, this.w / 2 + w / 2);

    this.bullets.push(new Bullet({ x, y, deg: this.deg, w, h }));
  }
}

export default Rocket
