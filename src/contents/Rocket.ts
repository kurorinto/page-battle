import BattleObject from "./BattleObject"
import Bullet from "./Bullet"
import Point from "./Point"
import throttle from 'lodash/throttle'

class Rocket extends BattleObject {
  /** 火箭朝向 */
  deg: number
  /** 火箭绘制线条 */
  lines: Point[][] = []
  /** 子弹 */
  bullets: Bullet[] = []
  /** 子弹速度 */
  bulletSpeed = 15
  /** 火箭绘制颜色 */
  color = '#20242C'
  bg = '#ffffff'

  constructor({ x, y, w, h, deg = 0 }: { x: number; y: number; w: number; h: number; deg?: number }) {
    super({ x, y, w, h })

    this.deg = deg
    this.lines = [
      [
        new Point(x - w / 2, y - h / 2),
        new Point(x, y + h / 2),
        new Point(x + w / 2, y - h / 2),
        new Point(x, y - h / 4),
        new Point(x - w / 2, y - h / 2),
      ],
      [
        new Point(x, y - h / 4),
        new Point(x, y + h / 2),
      ],
    ]
    this.rotate(deg)
    this.fire = throttle(this.fire.bind(this), 100, { trailing: false });
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 渲染火箭
    ctx.save()
    ctx.strokeStyle = this.color
    ctx.fillStyle = this.bg
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
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
    // 过滤 出边界消失和焰火消失的子弹
    this.bullets = this.bullets.filter(bullet => bullet.firework ? bullet.firework.blastLines.every(line => line.existed) : bullet.existed)
    // 渲染子弹
    this.bullets.forEach((bullet) => {
      if (bullet.existed) {
        bullet.move(this.bulletSpeed)
        bullet.draw(ctx)
      }
      if (bullet.firework) {
        bullet.firework.draw(ctx)
      }
    })
    console.log(this.bullets.length)
  }

  rotate(deg: number) {
    this.lines = this.lines.map((line) => {
      return line.map((point) => {
        return Rocket.rotatePoint(point, new Point(this.x, this.y), deg)
      })
    })
    // 保存当前角度
    this.deg += deg
  }

  move(delta: number) {
    this.lines = this.lines.map((line) => {
      return line.map((point) => {
        return Rocket.movePointFromAngle(point, this.deg, delta)
      })
    });
    // 保存当前位置
    ({ x: this.x, y: this.y } = Rocket.movePointFromAngle(new Point(this.x, this.y), this.deg, delta))
  }

  fire() {
    const w = 5
    const h = 5
    const { x, y } = Rocket.movePointFromAngle(new Point(this.x, this.y), this.deg, this.w / 2 + w / 2);

    this.bullets.push(new Bullet({ x, y, deg: this.deg, w, h }));
  }
}

export default Rocket
