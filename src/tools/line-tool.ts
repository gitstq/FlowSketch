/**
 * LineTool - Click and drag to create a line/arrow connector.
 * Optionally snaps to shape edges.
 */
import { Canvas } from '../core/canvas';
import { BaseTool } from './base-tool';
import { LineShape } from '../shapes/line';
import { BaseShape } from '../shapes/base';

export class LineTool extends BaseTool {
  public name = 'line';
  public cursor = 'crosshair';

  /** Whether we are currently drawing a line */
  private drawing = false;
  /** Start position in world coordinates */
  private startX = 0;
  private startY = 0;
  /** The line being drawn */
  private currentLine: LineShape | null = null;
  /** Source shape (if snapping) */
  private sourceShape: BaseShape | null = null;

  onMouseDown(e: MouseEvent, canvas: Canvas): void {
    if (e.button !== 0) return;

    const rect = canvas.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = canvas.camera.screenToWorld(screenX, screenY);

    // Check if we're starting on a shape
    const hit = canvas.hitTest(world.x, world.y);
    if (hit && !(hit instanceof LineShape)) {
      this.sourceShape = hit;
      const center = this.getShapeEdgePoint(hit, world.x, world.y);
      this.startX = center.x;
      this.startY = center.y;
    } else {
      this.sourceShape = null;
      this.startX = world.x;
      this.startY = world.y;
    }

    this.drawing = true;
    this.currentLine = new LineShape(this.startX, this.startY, world.x, world.y);
    canvas.addShape(this.currentLine);
  }

  onMouseMove(e: MouseEvent, canvas: Canvas): void {
    if (!this.drawing || !this.currentLine) return;

    const rect = canvas.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = canvas.camera.screenToWorld(screenX, screenY);

    // Check if snapping to a target shape
    const hit = canvas.hitTest(world.x, world.y);
    if (hit && hit !== this.currentLine && !(hit instanceof LineShape)) {
      const center = this.getShapeEdgePoint(hit, world.x, world.y);
      this.currentLine.x2 = center.x;
      this.currentLine.y2 = center.y;
      this.currentLine.targetId = hit.id;
    } else {
      this.currentLine.x2 = world.x;
      this.currentLine.y2 = world.y;
      this.currentLine.targetId = null;
    }

    this.currentLine.updateBounds();
    canvas.dirty = true;
  }

  onMouseUp(_e: MouseEvent, canvas: Canvas): void {
    if (!this.drawing) return;
    this.drawing = false;

    if (this.currentLine) {
      // Set source ID if we started on a shape
      if (this.sourceShape) {
        this.currentLine.sourceId = this.sourceShape.id;
      }

      // If line is too short, remove it
      const dx = this.currentLine.x2 - this.currentLine.x1;
      const dy = this.currentLine.y2 - this.currentLine.y1;
      if (Math.sqrt(dx * dx + dy * dy) < 5) {
        canvas.removeShape(this.currentLine);
      }

      canvas.dirty = true;
    }

    this.currentLine = null;
    this.sourceShape = null;
  }

  /**
   * Get the point on the edge of a shape closest to a given world point.
   */
  private getShapeEdgePoint(
    shape: BaseShape,
    worldX: number,
    worldY: number
  ): { x: number; y: number } {
    const cx = shape.x + shape.width / 2;
    const cy = shape.y + shape.height / 2;

    // Calculate intersection with shape bounding box
    const dx = worldX - cx;
    const dy = worldY - cy;

    if (dx === 0 && dy === 0) {
      return { x: cx, y: cy - shape.height / 2 };
    }

    const hw = shape.width / 2;
    const hh = shape.height / 2;

    // Scale to edge
    const scaleX = hw / Math.abs(dx || 0.001);
    const scaleY = hh / Math.abs(dy || 0.001);
    const scale = Math.min(scaleX, scaleY);

    return {
      x: cx + dx * scale,
      y: cy + dy * scale,
    };
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
