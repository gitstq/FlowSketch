/**
 * Camera - Handles pan and zoom transformations for the canvas viewport.
 */
export class Camera {
  /** X offset of the camera (pan) */
  public x: number = 0;
  /** Y offset of the camera (pan) */
  public y: number = 0;
  /** Zoom level (1 = 100%) */
  public zoom: number = 1;
  /** Minimum zoom level */
  public minZoom: number = 0.1;
  /** Maximum zoom level */
  public maxZoom: number = 10;

  /**
   * Convert screen coordinates to world coordinates.
   */
  public screenToWorld(sx: number, sy: number): { x: number; y: number } {
    return {
      x: (sx - this.x) / this.zoom,
      y: (sy - this.y) / this.zoom,
    };
  }

  /**
   * Convert world coordinates to screen coordinates.
   */
  public worldToScreen(wx: number, wy: number): { x: number; y: number } {
    return {
      x: wx * this.zoom + this.x,
      y: wy * this.zoom + this.y,
    };
  }

  /**
   * Apply the camera transform to a canvas 2D context.
   */
  public applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.x, this.y);
    ctx.scale(this.zoom, this.zoom);
  }

  /**
   * Zoom towards a specific screen point (e.g., mouse cursor).
   */
  public zoomAt(screenX: number, screenY: number, factor: number): void {
    const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * factor));
    const ratio = newZoom / this.zoom;
    // Adjust pan so the point under the cursor stays fixed
    this.x = screenX - (screenX - this.x) * ratio;
    this.y = screenY - (screenY - this.y) * ratio;
    this.zoom = newZoom;
  }

  /**
   * Reset camera to default position and zoom.
   */
  public reset(): void {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
  }
}
