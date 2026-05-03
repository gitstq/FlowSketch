/**
 * FreehandTool - Click and drag to draw freehand paths.
 * Smooths the path using bezier curves on mouse up.
 */
import { Canvas } from '../core/canvas';
import { BaseTool } from './base-tool';
import { FreehandShape } from '../shapes/freehand';

export class FreehandTool extends BaseTool {
  public name = 'freehand';
  public cursor = 'crosshair';

  /** Whether we are currently drawing */
  private drawing = false;
  /** The freehand shape being drawn */
  private currentPath: FreehandShape | null = null;

  onMouseDown(e: MouseEvent, canvas: Canvas): void {
    if (e.button !== 0) return;

    const rect = canvas.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = canvas.camera.screenToWorld(screenX, screenY);

    this.drawing = true;
    this.currentPath = new FreehandShape();
    this.currentPath.addPoint(world.x, world.y);
    canvas.addShape(this.currentPath);
  }

  onMouseMove(e: MouseEvent, canvas: Canvas): void {
    if (!this.drawing || !this.currentPath) return;

    const rect = canvas.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = canvas.camera.screenToWorld(screenX, screenY);

    this.currentPath.addPoint(world.x, world.y);
    canvas.dirty = true;
  }

  onMouseUp(_e: MouseEvent, canvas: Canvas): void {
    if (!this.drawing) return;
    this.drawing = false;

    if (this.currentPath) {
      // Smooth the path
      this.currentPath.smooth();
      this.currentPath.updateBounds();
      canvas.dirty = true;
    }

    this.currentPath = null;
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
