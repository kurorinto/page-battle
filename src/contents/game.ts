import Rocket from "./Rocket"

class Game {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  rocket: Rocket
  downingActions: Array<'fire' | 'move' | 'rotate' | 'reRotate'> = []

  constructor(container: HTMLElement) {
    // 创建画布
    this.canvas = document.createElement('canvas')
    container.appendChild(this.canvas)
    // 获取上下文
    this.ctx = this.canvas.getContext("2d")
    // 加载图片
    this.rocket = new Rocket({
      x: 100,
      y: 100,
      w: 30,
      h: 30,
    })
    // 屏幕尺寸变化
    this.resizeCanvas()
    this.bindEvents()
    // 游戏开始
    this.animate()
  }

  addAction(action: 'fire' | 'move' | 'rotate' | 'reRotate') {
    if (!this.downingActions.includes(action)) {
      this.downingActions.push(action)
    }
  }

  removeAction(action: 'fire' | 'move' | 'rotate' | 'reRotate') {
    const index = this.downingActions.indexOf(action)
    if (index > -1) {
      this.downingActions.splice(index, 1)
    }
  }

  keydownHandler(e: KeyboardEvent) {
    const key = e.key
    if (['ArrowUp', 'w', 'W', 'ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D', ' '].includes(key)) {
      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          this.addAction('move')
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.addAction('reRotate')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.addAction('rotate')
          break
        case ' ':
          this.addAction('fire')
          break
      }
      // e.preventDefault()
    }
  }

  keyupHandler(e: KeyboardEvent) {
    const key = e.key
    if (['ArrowUp', 'w', 'W', 'ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D', ' '].includes(key)) {
      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          this.removeAction('move')
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.removeAction('reRotate')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.removeAction('rotate')
          break
        case ' ':
          this.removeAction('fire')
          break
      }
      // e.preventDefault()
    }
  }

  bindEvents() {
    window.addEventListener("resize", this.resizeCanvas.bind(this))
    window.addEventListener('keydown', this.keydownHandler.bind(this))
    window.addEventListener('keyup', this.keyupHandler.bind(this))
  }

  unbindEvents() {
    window.removeEventListener("resize", this.resizeCanvas.bind(this))
    window.removeEventListener('keydown', this.keydownHandler.bind(this))
    window.removeEventListener('keyup', this.keyupHandler.bind(this))
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  /** 渲染画布 */
  render() {
    this.clear()
    // 渲染火箭
    this.rocket.stroke(this.ctx)
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
