/**
 * Rectangle - A standard rectangle shape with optional rounded corners.
 */
import { BaseShape } from './base';

export class Rectangle extends BaseShape {
  public type = 'rectangle';
  /** Corner radius for rounded rectangle */
  public cornerRadius: number = 0;

  constructor(
    x: number = 0,
    y: number = 0,
    width: number = 120,
    height: number = 80,
    cornerRadius: number = 0
  ) {
    super(x, y, width, height);
    this.cornerRadius = cornerRadius;
  }

  public containsPoint(px: number, py: number): boolean {
    return (
      px >= this.x &&
      px <= this.x + this.width &&
      py >= this.y &&
      py <= this.y + this.height
    );
  }

  public clone(): Rectangle {
    const rect = new Rectangle(this.x, this.y, this.width, this.height, this.cornerRadius);
    rect.id = this.id;
    rect.rotation = this.rotation;
    rect.fill = this.fill;
    rect.stroke = this.stroke;
    rect.strokeWidth = this.strokeWidth;
    rect.opacity = this.opacity;
    return rect;
  }

  public serialize(): Record<string, unknown> {
    return {
      ...super.serialize(),
      cornerRadius: this.cornerRadius,
    };
  }
}
