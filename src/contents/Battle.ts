import Rocket from "./Rocket"

type Action = 'fire' | 'move' | 'rotate' | 'reRotate' | 'lase'

class Battle {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  rocket: Rocket
  downingActions: Array<Action> = []
  animationId: number
  static time = Date.now()

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
    // 开始计时
    Battle.time = Date.now()
  }

  addAction(action: Action) {
    if (!this.downingActions.includes(action)) {
      this.downingActions.push(action)
    }
  }

  removeAction(action: Action) {
    const index = this.downingActions.indexOf(action)
    if (index > -1) {
      this.downingActions.splice(index, 1)
    }
  }

  keydownHandler = (e: KeyboardEvent) => {
    const key = e.key
    if (['ArrowUp', 'w', 'W', 'ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D', ' ', 'c', 'C'].includes(key)) {
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
        // case 'c':
        // case 'C':
        //   this.addAction('lase')
        //   break
      }
      e.preventDefault()
      e.stopPropagation()
    }
  }

  keyupHandler = (e: KeyboardEvent) => {
    const key = e.key
    if (['ArrowUp', 'w', 'W', 'ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D', ' ', 'c', 'C'].includes(key)) {
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
        // case 'c':
        // case 'C':
        //   this.removeAction('lase')
        //   break
      }
      e.preventDefault()
      e.stopPropagation()
    }
  }

  bindEvents() {
    window.addEventListener("resize", this.resizeCanvas)
    window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('keypress', this.keydownHandler)
    window.addEventListener('keyup', this.keyupHandler)
  }

  unbindEvents() {
    window.removeEventListener("resize", this.resizeCanvas)
    window.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('keypress', this.keydownHandler)
    window.removeEventListener('keyup', this.keyupHandler)
  }

  resizeCanvas = () => {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  /** 渲染画布 */
  render() {
    this.clear()
    // 执行动作
    this.downingActions.forEach((action) => {
      switch (action) {
        case 'fire':
          this.rocket.fire()
          break
        case 'rotate':
          this.rocket.rotate(this.rocket.degSpeed)
          break
        case 'reRotate':
          this.rocket.rotate(-this.rocket.degSpeed)
          break
      }
    })
    if (this.downingActions.includes('move')) {
      this.rocket.accelerated = 20
    } else {
      this.rocket.accelerated = 0
    }
    if (this.downingActions.includes('lase')) {
      this.rocket.laser.setLasing(true)
    } else {
      this.rocket.laser.setLasing(false)
    }
    // 渲染火箭
    this.rocket.draw(this.ctx)
  }

  /** 动画 */
  animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this))
    this.render()
    Battle.time = Date.now()
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
    cancelAnimationFrame(this.animationId)
  }
}

export default Battle
