/**
 * LineShape - A line or arrow connector between two points.
 * Can optionally connect to shapes and display arrowheads.
 */
import { BaseShape } from './base';

export class LineShape extends BaseShape {
  public type = 'line';
  /** Start point X */
  public x1: number;
  /** Start point Y */
  public y1: number;
  /** End point X */
  public x2: number;
  /** End point Y */
  public y2: number;
  /** Whether to draw an arrowhead at the end */
  public arrowHead: boolean = true;
  /** Whether the line is curved */
  public curved: boolean = false;
  /** Control point for quadratic bezier curve */
  public controlPoints: { cpx: number; cpy: number } | null = null;
  /** Optional label displayed on the line */
  public label: string = '';
  /** ID of the source shape (for connections) */
  public sourceId: string | null = null;
  /** ID of the target shape (for connections) */
  public targetId: string | null = null;

  constructor(
    x1: number = 0,
    y1: number = 0,
    x2: number = 100,
    y2: number = 100
  ) {
    // For BaseShape, we store the bounding box
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);
    super(minX, minY, maxX - minX || 1, maxY - minY || 1);

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  /**
   * Update the bounding box after moving endpoints.
   */
  public updateBounds(): void {
    const minX = Math.min(this.x1, this.x2);
    const minY = Math.min(this.y1, this.y2);
    const maxX = Math.max(this.x1, this.x2);
    const maxY = Math.max(this.y1, this.y2);
    this.x = minX;
    this.y = minY;
    this.width = maxX - minX || 1;
    this.height = maxY - minY || 1;
  }

  public containsPoint(px: number, py: number): boolean {
    // Distance from point to line segment
    const dist = this.pointToSegmentDistance(px, py, this.x1, this.y1, this.x2, this.y2);
    return dist <= Math.max(this.strokeWidth, 6);
  }

  /**
   * Calculate the distance from a point to a line segment.
   */
  private pointToSegmentDistance(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;

    if (lenSq === 0) {
      return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    }

    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));

    const projX = x1 + t * dx;
    const projY = y1 + t * dy;

    return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
  }

  /**
   * Move the entire line by a delta.
   */
  public move(dx: number, dy: number): void {
    this.x1 += dx;
    this.y1 += dy;
    this.x2 += dx;
    this.y2 += dy;
    if (this.controlPoints) {
      this.controlPoints.cpx += dx;
      this.controlPoints.cpy += dy;
    }
    this.updateBounds();
  }

  public clone(): LineShape {
    const l = new LineShape(this.x1, this.y1, this.x2, this.y2);
    l.id = this.id;
    l.arrowHead = this.arrowHead;
    l.curved = this.curved;
    l.controlPoints = this.controlPoints
      ? { ...this.controlPoints }
      : null;
    l.label = this.label;
    l.sourceId = this.sourceId;
    l.targetId = this.targetId;
    l.stroke = this.stroke;
    l.strokeWidth = this.strokeWidth;
    l.opacity = this.opacity;
    return l;
  }

  public serialize(): Record<string, unknown> {
    return {
      ...super.serialize(),
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      arrowHead: this.arrowHead,
      curved: this.curved,
      controlPoints: this.controlPoints,
      label: this.label,
      sourceId: this.sourceId,
      targetId: this.targetId,
    };
  }
}
