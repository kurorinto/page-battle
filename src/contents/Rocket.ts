import throttle from 'lodash/throttle'
import Battle from "./Battle"
import BattleObject from "./BattleObject"
import Bullet from "./Bullet"
import Point from "./Point"
import Laser from './Laser'

class Rocket extends BattleObject {
  /** 绘制线条 */
  lines: Point[][] = []
  /** 绘制色 */
  color = '#20242C'
  /** 填充色 */
  bg = '#ffffff'
  /** 朝向角度 */
  private _angle: number
  /** 每秒加速度 */
  accelerated = 0
  acceleratedX = 0
  acceleratedY = 0
  /** 每秒减速度 */
  deceleratedX = 0
  deceleratedY = 0
  /** 前进速度 */
  speedX = 0
  speedY = 0
  /** 角度旋转速度 */
  degSpeed = 5
  /** 子弹 */
  bullets: Bullet[] = []
  /** 子弹半径 */
  bulletRadius = 5
  /** 子弹速度 */
  bulletSpeed = 15
  /** 射速 */
  firingRate = 100
  /** 激光 */
  laser: Laser
  /** 激光半径 */
  laserRadius = 1
  /** 枪口位置 */
  muzzle: Point

  /** 朝向角度 */
  set angle(angle: number) {
    // 激光跟随
    if (this.laser) {
      this.laser.start = Rocket.movePointFromAngle(new Point(this.x, this.y), angle, this.w / 2 + this.bulletRadius / 2)
      this.laser.angle = angle
    }
    this._angle = angle
  }
  get angle() {
    return this._angle
  }

  constructor({ x, y, w, h, angle = 0 }: { x: number; y: number; w: number; h: number; angle?: number }) {
    super({ x, y, w, h })

    this.angle = angle
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
    // 初始化枪口位置
    this.getMuzzlePosition()
    this.rotate(angle)
    this.fire = throttle(this.fire.bind(this), this.firingRate, { trailing: false });
    this.createLase()
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 移动火箭
    this.move()
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
        bullet.draw(ctx)
      }
      if (bullet.firework) {
        bullet.firework.draw(ctx)
      }
    })
    // 渲染激光
    if (this.laser.lasing) {
      this.laser.draw(ctx)
    }
    if (this.laser.fireworks.length) {
      // 过滤已经消失的焰火
      this.laser.fireworks = this.laser.fireworks.filter(firework => {
        return firework.blastLines.some(blastLine => blastLine.existed)
      })
      this.laser.fireworks.forEach((firework) => {
        firework.draw(ctx)
      })
    }
  }

  getDecelerated(speed: number) {
    return -speed * 2
  }

  rotate(angle: number) {
    this.lines = this.lines.map((line) => {
      return line.map((point) => {
        return Rocket.rotatePoint(point, new Point(this.x, this.y), angle)
      })
    })
    // 保存当前角度
    this.angle += angle
  }

  move() {
    // 当前帧率得到时间间隔
    const deltaSecond = 1 / Battle.fps
    // 理论加速度分量
    this.acceleratedX = -this.accelerated * Math.sin((this.angle * Math.PI) / 180)
    this.acceleratedY = this.accelerated * Math.cos((this.angle * Math.PI) / 180)
    // 理论减速度分量
    this.deceleratedX = this.getDecelerated(this.speedX)
    this.deceleratedY = this.getDecelerated(this.speedY)
    // 实际加速度
    const ax = this.acceleratedX + this.deceleratedX
    const ay = this.acceleratedY + this.deceleratedY
    this.speedX += ax * deltaSecond
    this.speedY += ay * deltaSecond
    // 当前帧移动的距离 x = v0 * t + 1/2 * a * t^2
    const deltaX = this.speedX * deltaSecond + 0.5 * ax * deltaSecond * deltaSecond
    const deltaY = this.speedY * deltaSecond + 0.5 * ay * deltaSecond * deltaSecond
    // 保存当前位置
    this.x += deltaX
    this.y += deltaY
    // 边界检测
    const isXOut = this.lines.every(line => {
      return line.every(point => {
        return point.x > window.innerWidth || point.x < 0
      })
    })
    const isYOut = this.lines.every(line => {
      return line.every(point => {
        return point.y > window.innerHeight || point.y < 0
      })
    })
    // 移动所有点
    this.lines = this.lines.map((line) => {
      return line.map((point) => {
        const newPoint = new Point(point.x + deltaX, point.y + deltaY)
        if (isXOut) {
          if (newPoint.x > window.innerWidth) {
            newPoint.x = newPoint.x - window.innerWidth
          }
          if (newPoint.x < 0) {
            newPoint.x = newPoint.x + window.innerWidth
          }
        }
        if (isYOut) {
          if (newPoint.y > window.innerHeight) {
            newPoint.y = newPoint.y - window.innerHeight
          }
          if (newPoint.y < 0) {
            newPoint.y = newPoint.y + window.innerHeight
          }
        }
        return newPoint
      })
    });
    // 超出移动中心点
    if (isXOut) {
      if (this.x > window.innerWidth) {
        this.x = this.x - window.innerWidth
      }
      if (this.x < 0) {
        this.x = this.x + window.innerWidth
      }
    }
    if (isYOut) {
      if (this.y > window.innerHeight) {
        this.y = this.y - window.innerHeight
      }
      if (this.y < 0) {
        this.y = this.y + window.innerHeight
      }
    }
    this.getMuzzlePosition()
    // 移动激光
    this.laser.start = this.muzzle
  }

  fire() {
    const { x, y } = this.muzzle;
    this.bullets.push(new Bullet({ x, y, angle: this.angle, r: this.bulletRadius, speed: this.bulletSpeed }));
  }

  createLase() {
    const laserStart = this.muzzle
    this.laser = new Laser(laserStart, this.angle, this.laserRadius);
  }

  // 计算枪口位置
  getMuzzlePosition() {
    this.muzzle = Rocket.movePointFromAngle(new Point(this.x, this.y), this.angle, this.w / 2 + this.bulletRadius / 2)
  }
}

export default Rocket
