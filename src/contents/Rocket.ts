import Battle from "./Battle"
import BattleObject from "./BattleObject"
import Bullet from "./Bullet"
import Point from "./Point"
import throttle from 'lodash/throttle'

class Rocket extends BattleObject {
  /** 绘制线条 */
  lines: Point[][] = []
  /** 绘制色 */
  color = '#20242C'
  /** 填充色 */
  bg = '#ffffff'
  /** 朝向角度 */
  deg: number
  /** 每秒加速度 */
  accelerated = 0
  /** 前进速度 */
  speed = 0
  /** 最大速度 */
  maxSpeed = 10
  /** 角度旋转速度 */
  degSpeed = 5
  /** 子弹 */
  bullets: Bullet[] = []
  /** 子弹速度 */
  bulletSpeed = 15
  /** 减速度 */
  decelerated = -10

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
    const deltaSecond = (Date.now() - Battle.time) / 1000
    // 根据加速度计算速度
    this.speed = Math.max(Math.min(this.maxSpeed, this.speed + (this.accelerated + this.decelerated) * deltaSecond), 0)
    // 移动火箭
    this.move(this.speed)
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
