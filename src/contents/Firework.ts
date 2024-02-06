import { getRandomInt } from "~utils";
import BattleObject from "./BattleObject";
import FireWorkLine from "./FireWorkLine";
import Point from "./Point";

class Firework extends BattleObject {
  /** 爆炸射线 */
  blastLines: FireWorkLine[] = []
  /** 射线速度 */
  blastLinesSpeed = 10
  colors = ['red', 'orange', 'yellow']

  constructor({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
    super({ x, y, w, h })
    this.createRandomLines()
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.blastLines = this.blastLines.map(line => Firework.moveLineFromPoint(line, { x: this.x, y: this.y }, this.blastLinesSpeed)).filter(item => item.existed)
    this.blastLines.forEach((line) => {
      line.color = this.colors[getRandomInt(0, 2)]
      line.draw(ctx)
    })
  }

  createRandomLines() {
    // 在爆炸点生成随机射线起点
    const points = [] as Point[];
    const { x, y, w, h } = this;
    const radius = Math.min(w, h) / 2;

    for (let angle = getRandomInt(0, 10); angle <= 360; angle += getRandomInt(20, 30)) {
      // 生成10-20之间的随机角度
      const rad = (angle * Math.PI) / 180
      const pointX = x + radius * Math.cos(rad);
      const pointY = y + radius * Math.sin(rad);
      points.push(new Point(pointX, pointY));
    }

    // 延长射线 射线长度随机在10 - 50
    this.blastLines = points.map((start) => {
      const length = getRandomInt(10, 50)
      const end = Firework.movePointFromPoint(start, { x: this.x, y: this.y }, length)
      return new FireWorkLine(start, end, this.colors[0])
    })
  }
}

export default Firework
