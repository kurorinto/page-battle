interface Rocket {
  ready?: boolean
  type: 'image'
  image: HTMLImageElement
  x: number
  y: number
  w: number
  h: number
}

class Game {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  rocket: Rocket

  constructor(container: HTMLElement) {
    // 创建画布
    this.canvas = document.createElement('canvas')
    container.appendChild(this.canvas)
    // 获取上下文
    this.ctx = this.canvas.getContext("2d")
    // 加载图片
    this.rocket = {
      x: 100,
      y: 100,
      w: 30,
      h: 30,
      type: 'image',
      image: new Image()
    }
    this.rocket.image.src = 'https://sitecdn.zcycdn.com/f2e-assets/f57001d7-905a-4d36-b224-08ad69901ab2.svg'
    this.rocket.image.onload = () => {
      this.rocket.ready = true
    }
    // 屏幕尺寸变化
    this.resizeCanvas()
    this.bindEvents()
    // 游戏开始
    this.animate()
  }

  keydownHandler(e: KeyboardEvent) {
    const key = e.key
    if (['ArrowUp', 'w', 'W', 'ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D', ' '].includes(key)) {
      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          this.rocket.y -= 1
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.rotate(this.rocket, -10)
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.rotate(this.rocket, 10)
          break
      }
      e.preventDefault()
    }
  }

  bindEvents() {
    window.addEventListener("resize", this.resizeCanvas.bind(this))
    window.addEventListener('keydown', this.keydownHandler.bind(this))
  }

  unbindEvents() {
    window.removeEventListener("resize", this.resizeCanvas.bind(this))
    window.removeEventListener('keydown', this.keydownHandler.bind(this))
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  /** 旋转 */
  rotate(obj: Rocket, deg: number) {
    // 旋转时，变化中心 -> 旋转 -> 变换回来
    this.ctx.translate(obj.x + obj.w / 2, obj.y + obj.h / 2)
    this.ctx.rotate(deg * Math.PI / 180)
    this.ctx.translate(-(obj.x + obj.w / 2), -(obj.y + obj.h / 2))
  }

  /** 绘制 */
  draw(obj: Rocket) {
    obj.ready && this.ctx.drawImage(obj.image, obj.x, obj.y, 30, 30)
  }

  /** 渲染画布 */
  render() {
    this.clear()
    // 渲染火箭
    this.draw(this.rocket)
  }

  /** 动画 */
  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.render()
  }

  /** 清空画布 */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /** 销毁 */
  destroy() {
    this.clear()
    this.canvas.remove()
    this.unbindEvents()
  }
}

export default Game
