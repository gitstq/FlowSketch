/**
 * Diamond - A diamond/rhombus shape, commonly used for decision nodes in flowcharts.
 */
import { BaseShape } from './base';

export class Diamond extends BaseShape {
  public type = 'diamond';

  constructor(
    x: number = 0,
    y: number = 0,
    width: number = 120,
    height: number = 80
  ) {
    super(x, y, width, height);
  }

  public containsPoint(px: number, py: number): boolean {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const hw = this.width / 2;
    const hh = this.height / 2;

    if (hw <= 0 || hh <= 0) return false;

    // Check if point is inside the diamond using the diamond equation
    // |x - cx| / hw + |y - cy| / hh <= 1
    const dx = Math.abs(px - cx) / hw;
    const dy = Math.abs(py - cy) / hh;
    return dx + dy <= 1;
  }

  public clone(): Diamond {
    const d = new Diamond(this.x, this.y, this.width, this.height);
    d.id = this.id;
    d.rotation = this.rotation;
    d.fill = this.fill;
    d.stroke = this.stroke;
    d.strokeWidth = this.strokeWidth;
    d.opacity = this.opacity;
    return d;
  }
}
