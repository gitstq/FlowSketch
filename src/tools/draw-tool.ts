/**
 * DrawTool - Click and drag to create rectangle, ellipse, or diamond shapes.
 */
import { Canvas } from '../core/canvas';
import { BaseTool } from './base-tool';
import { BaseShape } from '../shapes/base';
import { Rectangle } from '../shapes/rectangle';
import { Ellipse } from '../shapes/ellipse';
import { Diamond } from '../shapes/diamond';

export type DrawShapeType = 'rectangle' | 'ellipse' | 'diamond';

export class DrawTool extends BaseTool {
  public name = 'draw';
  public cursor = 'crosshair';

  /** Which shape type to draw */
  public shapeType: DrawShapeType = 'rectangle';

  /** Whether we are currently drawing */
  private drawing = false;
  /** Start position in world coordinates */
  private startX = 0;
  private startY = 0;
  /** The shape being drawn */
  private currentShape: BaseShape | null = null;

  constructor(shapeType: DrawShapeType = 'rectangle') {
    super();
    this.shapeType = shapeType;
  }

  onMouseDown(e: MouseEvent, canvas: Canvas): void {
    if (e.button !== 0) return;

    const rect = canvas.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = canvas.camera.screenToWorld(screenX, screenY);

    this.startX = world.x;
    this.startY = world.y;
    this.drawing = true;

    // Create the shape
    this.currentShape = this.createShape(world.x, world.y, 0, 0);
    canvas.addShape(this.currentShape);
    canvas.selectShape(this.currentShape, false);
  }

  onMouseMove(e: MouseEvent, canvas: Canvas): void {
    if (!this.drawing || !this.currentShape) return;

    const rect = canvas.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = canvas.camera.screenToWorld(screenX, screenY);

    // Update shape dimensions
    const x = Math.min(this.startX, world.x);
    const y = Math.min(this.startY, world.y);
    const w = Math.abs(world.x - this.startX);
    const h = Math.abs(world.y - this.startY);

    this.currentShape.x = x;
    this.currentShape.y = y;
    this.currentShape.width = w;
    this.currentShape.height = h;

    canvas.dirty = true;
  }

  onMouseUp(_e: MouseEvent, canvas: Canvas): void {
    if (!this.drawing) return;
    this.drawing = false;

    // If shape is too small, give it a default size
    if (this.currentShape) {
      if (this.currentShape.width < 5 && this.currentShape.height < 5) {
        this.currentShape.width = 120;
        this.currentShape.height = 80;
      }
      this.currentShape.normalize();
      canvas.dirty = true;
    }

    this.currentShape = null;

    // Switch back to select tool after drawing
    // The app will handle this via a callback
  }

  /**
   * Create a shape instance based on the configured shape type.
   */
  private createShape(x: number, y: number, w: number, h: number): BaseShape {
    switch (this.shapeType) {
      case 'ellipse':
        return new Ellipse(x, y, w, h);
      case 'diamond':
        return new Diamond(x, y, w, h);
      case 'rectangle':
      default:
        return new Rectangle(x, y, w, h);
    }
  }

  onWheel(e: WheelEvent, canvas: Canvas): void {
    e.preventDefault();
    const rect = canvas.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    canvas.camera.zoomAt(screenX, screenY, factor);
    canvas.dirty = true;
  }
}
