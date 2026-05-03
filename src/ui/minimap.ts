/**
 * Minimap - Small overview of the entire canvas with a viewport indicator.
 */
import { Canvas } from '../core/canvas';

export class Minimap {
  private container: HTMLElement;
  private minimapCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private canvas: Canvas;

  /** Minimap dimensions */
  private width = 180;
  private height = 130;
  /** Whether the minimap is visible */
  public visible: boolean = true;

  constructor(container: HTMLElement, canvas: Canvas) {
    this.container = container;
    this.canvas = canvas;
    this.minimapCanvas = container.querySelector('canvas')!;
    this.ctx = this.minimapCanvas.getContext('2d')!;

    this.minimapCanvas.width = this.width;
    this.minimapCanvas.height = this.height;

    // Click on minimap to navigate
    this.minimapCanvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.minimapCanvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.minimapCanvas.addEventListener('mouseup', () => this.dragging = false);
    this.minimapCanvas.addEventListener('mouseleave', () => this.dragging = false);
  }

  /** Whether user is dragging the viewport on the minimap */
  private dragging = false;

  /**
   * Update the minimap rendering.
   */
  public update(): void {
    if (!this.visible) return;

    const ctx = this.ctx;
    const bounds = this.canvas.getContentBounds();

    ctx.clearRect(0, 0, this.width, this.height);

    // Background
    ctx.fillStyle = this.canvas.darkMode ? '#2a2a2a' : '#f5f5f5';
    ctx.fillRect(0, 0, this.width, this.height);

    if (!bounds) {
      // No content - just draw a message
      ctx.fillStyle = '#999';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No content', this.width / 2, this.height / 2);
      return;
    }

    // Calculate scale to fit all content
    const padding = 10;
    const contentW = bounds.maxX - bounds.minX;
    const contentH = bounds.maxY - bounds.minY;
    const scaleX = (this.width - padding * 2) / contentW;
    const scaleY = (this.height - padding * 2) / contentH;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (this.width - contentW * scale) / 2;
    const offsetY = (this.height - contentH * scale) / 2;

    // Draw shapes as small rectangles
    ctx.fillStyle = this.canvas.darkMode ? '#555' : '#bbb';
    ctx.strokeStyle = this.canvas.darkMode ? '#777' : '#999';
    ctx.lineWidth = 0.5;

    for (const shape of this.canvas.shapes) {
      const sx = offsetX + (shape.x - bounds.minX) * scale;
      const sy = offsetY + (shape.y - bounds.minY) * scale;
      const sw = shape.width * scale;
      const sh = shape.height * scale;

      ctx.fillRect(sx, sy, Math.max(sw, 2), Math.max(sh, 2));
      ctx.strokeRect(sx, sy, Math.max(sw, 2), Math.max(sh, 2));
    }

    // Draw viewport rectangle
    const cam = this.canvas.camera;
    const vpTopLeft = cam.screenToWorld(0, 0);
    const vpBottomRight = cam.screenToWorld(this.canvas.width, this.canvas.height);

    const vpX = offsetX + (vpTopLeft.x - bounds.minX) * scale;
    const vpY = offsetY + (vpTopLeft.y - bounds.minY) * scale;
    const vpW = (vpBottomRight.x - vpTopLeft.x) * scale;
    const vpH = (vpBottomRight.y - vpTopLeft.y) * scale;

    ctx.strokeStyle = '#4a90d9';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(vpX, vpY, vpW, vpH);
    ctx.fillStyle = 'rgba(74, 144, 217, 0.1)';
    ctx.fillRect(vpX, vpY, vpW, vpH);

    // Store for click handling
    this._offsetX = offsetX;
    this._offsetY = offsetY;
    this._scale = scale;
    this._bounds = bounds;
  }

  // Stored values for click-to-navigate
  private _offsetX = 0;
  private _offsetY = 0;
  private _scale = 1;
  private _bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

  /**
   * Navigate to the clicked position on the minimap.
   */
  private onMouseDown(e: MouseEvent): void {
    this.dragging = true;
    this.navigateTo(e);
  }

  private onMouseMove(e: MouseEvent): void {
    if (this.dragging) {
      this.navigateTo(e);
    }
  }

  private navigateTo(e: MouseEvent): void {
    const rect = this.minimapCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Convert minimap coordinates to world coordinates
    const worldX = (mx - this._offsetX) / this._scale + this._bounds.minX;
    const worldY = (my - this._offsetY) / this._scale + this._bounds.minY;

    // Center the camera on this world position
    this.canvas.camera.x = this.canvas.width / 2 - worldX * this.canvas.camera.zoom;
    this.canvas.camera.y = this.canvas.height / 2 - worldY * this.canvas.camera.zoom;
    this.canvas.dirty = true;
  }
}
