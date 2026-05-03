/**
 * BaseShape - Abstract base class for all diagram shapes.
 * Provides common properties and hit testing.
 */

/** Global counter for generating unique shape IDs */
let idCounter = 0;

export abstract class BaseShape {
  /** Unique identifier */
  public id: string;
  /** Shape type name */
  public abstract type: string;
  /** X position (top-left corner) */
  public x: number;
  /** Y position (top-left corner) */
  public y: number;
  /** Shape width */
  public width: number;
  /** Shape height */
  public height: number;
  /** Rotation angle in degrees */
  public rotation: number = 0;
  /** Fill color */
  public fill: string = '#ffffff';
  /** Stroke color */
  public stroke: string = '#333333';
  /** Stroke width */
  public strokeWidth: number = 2;
  /** Opacity (0-1) */
  public opacity: number = 1;

  constructor(x: number, y: number, width: number, height: number) {
    this.id = `shape_${++idCounter}_${Date.now()}`;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Check if a point (in world coordinates) is inside this shape.
   */
  public abstract containsPoint(px: number, py: number): boolean;

  /**
   * Clone this shape (deep copy).
   */
  public abstract clone(): BaseShape;

  /**
   * Serialize this shape to a plain object for JSON export.
   */
  public serialize(): Record<string, unknown> {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rotation: this.rotation,
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      opacity: this.opacity,
    };
  }

  /**
   * Normalize shape so width/height are positive.
   * Used after drawing from right-to-left or bottom-to-top.
   */
  public normalize(): void {
    if (this.width < 0) {
      this.x += this.width;
      this.width = -this.width;
    }
    if (this.height < 0) {
      this.y += this.height;
      this.height = -this.height;
    }
  }
}
