/**
 * FreehandShape - A freehand drawing path with optional bezier smoothing.
 */
import { BaseShape } from './base';

export interface SmoothPoint {
  x: number;
  y: number;
  cpx: number;  // Control point X for quadratic bezier
  cpy: number;  // Control point Y for quadratic bezier
}

export class FreehandShape extends BaseShape {
  public type = 'freehand';
  /** Raw points from mouse/touch input */
  public points: Array<{ x: number; y: number }> = [];
  /** Smoothed bezier curve points */
  public smoothedPoints: SmoothPoint[] = [];
  /** Whether the path has been smoothed */
  public smoothed: boolean = true;

  constructor() {
    super(0, 0, 0, 0);
  }

  /**
   * Add a point to the freehand path.
   */
  public addPoint(x: number, y: number): void {
    this.points.push({ x, y });
    this.updateBounds();
  }

  /**
   * Update the bounding box from all points.
   */
  public updateBounds(): void {
    if (this.points.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of this.points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }

    this.x = minX;
    this.y = minY;
    this.width = maxX - minX || 1;
    this.height = maxY - minY || 1;
  }

  /**
   * Smooth the raw points into bezier curves.
   * Uses a simple averaging algorithm for control points.
   */
  public smooth(): void {
    if (this.points.length < 3) {
      this.smoothed = false;
      return;
    }

    this.smoothedPoints = [];
    this.smoothed = true;

    // First point
    this.smoothedPoints.push({
      x: this.points[0].x,
      y: this.points[0].y,
      cpx: this.points[0].x,
      cpy: this.points[0].y,
    });

    // Middle points with smoothed control points
    for (let i = 1; i < this.points.length - 1; i++) {
      const prev = this.points[i - 1];
      const curr = this.points[i];
      const next = this.points[i + 1];

      // Control point is the current point
      // End point is the midpoint between current and next
      const midX = (curr.x + next.x) / 2;
      const midY = (curr.y + next.y) / 2;

      this.smoothedPoints.push({
        x: midX,
        y: midY,
        cpx: curr.x,
        cpy: curr.y,
      });
    }

    // Last point
    const last = this.points[this.points.length - 1];
    this.smoothedPoints.push({
      x: last.x,
      y: last.y,
      cpx: last.x,
      cpy: last.y,
    });
  }

  public containsPoint(px: number, py: number): boolean {
    // Check if point is near any segment of the path
    const threshold = Math.max(this.strokeWidth, 6);

    for (let i = 1; i < this.points.length; i++) {
      const dist = this.pointToSegmentDist(
        px, py,
        this.points[i - 1].x, this.points[i - 1].y,
        this.points[i].x, this.points[i].y
      );
      if (dist <= threshold) return true;
    }
    return false;
  }

  private pointToSegmentDist(
    px: number, py: number,
    x1: number, y1: number,
    x2: number, y2: number
  ): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);

    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
  }

  /**
   * Move the entire freehand path by a delta.
   */
  public move(dx: number, dy: number): void {
    for (const p of this.points) {
      p.x += dx;
      p.y += dy;
    }
    for (const sp of this.smoothedPoints) {
      sp.x += dx;
      sp.y += dy;
      sp.cpx += dx;
      sp.cpy += dy;
    }
    this.x += dx;
    this.y += dy;
  }

  public clone(): FreehandShape {
    const f = new FreehandShape();
    f.id = this.id;
    f.points = this.points.map(p => ({ ...p }));
    f.smoothedPoints = this.smoothedPoints.map(sp => ({ ...sp }));
    f.smoothed = this.smoothed;
    f.stroke = this.stroke;
    f.strokeWidth = this.strokeWidth;
    f.opacity = this.opacity;
    f.x = this.x;
    f.y = this.y;
    f.width = this.width;
    f.height = this.height;
    return f;
  }

  public serialize(): Record<string, unknown> {
    return {
      ...super.serialize(),
      points: this.points,
      smoothedPoints: this.smoothedPoints,
      smoothed: this.smoothed,
    };
  }
}
