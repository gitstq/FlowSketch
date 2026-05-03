/**
 * Ellipse - A circle or ellipse shape.
 */
import { BaseShape } from './base';

export class Ellipse extends BaseShape {
  public type = 'ellipse';

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
    const rx = this.width / 2;
    const ry = this.height / 2;

    if (rx <= 0 || ry <= 0) return false;

    // Normalized distance from center
    const dx = (px - cx) / rx;
    const dy = (py - cy) / ry;
    return dx * dx + dy * dy <= 1;
  }

  public clone(): Ellipse {
    const e = new Ellipse(this.x, this.y, this.width, this.height);
    e.id = this.id;
    e.rotation = this.rotation;
    e.fill = this.fill;
    e.stroke = this.stroke;
    e.strokeWidth = this.strokeWidth;
    e.opacity = this.opacity;
    return e;
  }
}
