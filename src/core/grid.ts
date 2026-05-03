/**
 * Grid - Renders a background grid on the canvas.
 */
import { Camera } from './camera';

export class Grid {
  /** Base grid size in world pixels */
  public gridSize: number = 20;
  /** Whether the grid is visible */
  public visible: boolean = true;

  /**
   * Draw the grid on the canvas.
   * @param ctx - Canvas 2D context (already has camera transform applied)
   * @param camera - Camera instance for calculating visible area
   * @param width - Canvas width in screen pixels
   * @param height - Canvas height in screen pixels
   */
  public draw(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    width: number,
    height: number
  ): void {
    if (!this.visible) return;

    // Calculate visible world bounds
    const topLeft = camera.screenToWorld(0, 0);
    const bottomRight = camera.screenToWorld(width, height);

    const startX = Math.floor(topLeft.x / this.gridSize) * this.gridSize;
    const startY = Math.floor(topLeft.y / this.gridSize) * this.gridSize;
    const endX = Math.ceil(bottomRight.x / this.gridSize) * this.gridSize;
    const endY = Math.ceil(bottomRight.y / this.gridSize) * this.gridSize;

    // Determine if we should draw major grid lines (every 5 cells)
    const majorEvery = 5;
    const majorSize = this.gridSize * majorEvery;

    // Draw minor grid lines
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 0.5 / camera.zoom;
    ctx.beginPath();

    for (let x = startX; x <= endX; x += this.gridSize) {
      // Skip if this is a major grid line
      if (Math.abs(x % majorSize) < 0.01) continue;
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += this.gridSize) {
      if (Math.abs(y % majorSize) < 0.01) continue;
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();

    // Draw major grid lines
    ctx.strokeStyle = 'rgba(180, 180, 180, 0.5)';
    ctx.lineWidth = 1 / camera.zoom;
    ctx.beginPath();

    const majorStartX = Math.floor(topLeft.x / majorSize) * majorSize;
    const majorStartY = Math.floor(topLeft.y / majorSize) * majorSize;
    const majorEndX = Math.ceil(bottomRight.x / majorSize) * majorSize;
    const majorEndY = Math.ceil(bottomRight.y / majorSize) * majorSize;

    for (let x = majorStartX; x <= majorEndX; x += majorSize) {
      ctx.moveTo(x, majorStartY);
      ctx.lineTo(x, majorEndY);
    }
    for (let y = majorStartY; y <= majorEndY; y += majorSize) {
      ctx.moveTo(majorStartX, y);
      ctx.lineTo(majorEndX, y);
    }
    ctx.stroke();
  }
}
