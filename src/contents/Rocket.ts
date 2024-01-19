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
  acceleratedX = 0
  acceleratedY = 0
  /** 前进速度 */
  speedX = 0
  speedY = 0
  /** 最大速度 */
  maxSpeed = 10 * Math.sin(Math.PI / 4)
  /** 角度旋转速度 */
  degSpeed = 5
  /** 子弹 */
  bullets: Bullet[] = []
  /** 子弹速度 */
  bulletSpeed = 15
  /** 减速度 */
  deceleratedX = 0
  deceleratedY = 0

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
    // 加速度分量
    this.acceleratedX = -this.accelerated * Math.sin((this.deg * Math.PI) / 180)
    this.acceleratedY = this.accelerated * Math.cos((this.deg * Math.PI) / 180)
    // 减速度分量
    this.deceleratedX = this.getDecelerated(this.speedX)
    this.deceleratedY = this.getDecelerated(this.speedY)
    // 速度变化分量
    const deltaVX = (this.acceleratedX + this.deceleratedX) * deltaSecond
    const deltaVY = (this.acceleratedY + this.deceleratedY) * deltaSecond
    // 速度分量
    this.speedX = Math.max(Math.min(this.speedX + deltaVX, this.maxSpeed), -this.maxSpeed)
    this.speedY = Math.max(Math.min(this.speedY + deltaVY, this.maxSpeed), -this.maxSpeed)
    // 移动火箭
    this.move(this.speedX, this.speedY)
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

  getDecelerated(speed: number) {
    return -speed * 2
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

  move(deltaX: number, deltaY: number) {
    this.lines = this.lines.map((line) => {
      return line.map((point) => {
        return new Point(point.x + deltaX, point.y + deltaY)
      })
    });
    // 保存当前位置
    ({ x: this.x, y: this.y } = new Point(this.x + deltaX, this.y + deltaY))
  }

  fire() {
    const w = 5
    const h = 5
    const { x, y } = Rocket.movePointFromAngle(new Point(this.x, this.y), this.deg, this.w / 2 + w / 2);

    this.bullets.push(new Bullet({ x, y, deg: this.deg, w, h }));
  }
}

export default Rocket
