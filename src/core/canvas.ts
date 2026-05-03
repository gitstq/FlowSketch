/**
 * Canvas - Main canvas rendering engine.
 * Manages the HTML5 canvas, rendering loop, and coordinates all drawing operations.
 */
import { Camera } from './camera';
import { Grid } from './grid';
import { renderShape, drawSelectionHandles } from './renderer';
import { BaseShape } from '../shapes/base';

export class Canvas {
  /** The HTML canvas element */
  public canvas: HTMLCanvasElement;
  /** 2D rendering context */
  public ctx: CanvasRenderingContext2D;
  /** Camera for pan/zoom */
  public camera: Camera;
  /** Background grid */
  public grid: Grid;
  /** All shapes on the canvas */
  public shapes: BaseShape[] = [];
  /** Currently selected shapes */
  public selectedShapes: BaseShape[] = [];
  /** Whether the canvas needs to be redrawn */
  public dirty: boolean = true;
  /** Animation frame ID */
  private animFrameId: number = 0;
  /** Device pixel ratio for HiDPI displays */
  private dpr: number = 1;
  /** Current canvas width in CSS pixels */
  public width: number = 0;
  /** Current canvas height in CSS pixels */
  public height: number = 0;
  /** Whether dark mode is active */
  public darkMode: boolean = false;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d')!;
    this.camera = new Camera();
    this.grid = new Grid();
    this.dpr = window.devicePixelRatio || 1;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Start the render loop
    this.startRenderLoop();
  }

  /**
   * Resize the canvas to fill its container.
   */
  public resize(): void {
    const container = this.canvas.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.dirty = true;
  }

  /**
   * Start the continuous render loop using requestAnimationFrame.
   */
  private startRenderLoop(): void {
    const loop = () => {
      if (this.dirty) {
        this.render();
        this.dirty = false;
      }
      this.animFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  /**
   * Stop the render loop.
   */
  public stopRenderLoop(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  /**
   * Mark the canvas as needing a redraw.
   */
  public markDirty(): void {
    this.dirty = true;
  }

  /**
   * Main render function - draws everything on the canvas.
   */
  public render(): void {
    const ctx = this.ctx;

    // Clear the canvas
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.fillStyle = this.darkMode ? '#1e1e1e' : '#ffffff';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();

    // Apply camera transform
    ctx.save();
    this.camera.applyTransform(ctx);

    // Draw grid
    this.grid.draw(ctx, this.camera, this.width, this.height);

    // Draw all shapes
    for (const shape of this.shapes) {
      renderShape(ctx, shape);
    }

    // Draw selection handles for selected shapes
    for (const shape of this.selectedShapes) {
      drawSelectionHandles(ctx, shape, this.camera.zoom);
    }

    ctx.restore();
  }

  /**
   * Hit test: find the topmost shape at the given world coordinates.
   */
  public hitTest(worldX: number, worldY: number): BaseShape | null {
    // Iterate in reverse (top-most shapes first)
    for (let i = this.shapes.length - 1; i >= 0; i--) {
      if (this.shapes[i].containsPoint(worldX, worldY)) {
        return this.shapes[i];
      }
    }
    return null;
  }

  /**
   * Hit test for resize handles of selected shapes.
   * Returns { shape, handleIndex } or null.
   */
  public hitTestHandles(
    worldX: number,
    worldY: number
  ): { shape: BaseShape; handleIndex: number } | null {
    const padding = 4 / this.camera.zoom;
    const handleSize = 8 / this.camera.zoom;

    for (const shape of this.selectedShapes) {
      const x = shape.x - padding;
      const y = shape.y - padding;
      const w = shape.width + padding * 2;
      const h = shape.height + padding * 2;

      const handles = [
        { x: x, y: y },
        { x: x + w / 2, y: y },
        { x: x + w, y: y },
        { x: x + w, y: y + h / 2 },
        { x: x + w, y: y + h },
        { x: x + w / 2, y: y + h },
        { x: x, y: y + h },
        { x: x, y: y + h / 2 },
      ];

      for (let i = 0; i < handles.length; i++) {
        const hx = handles[i].x;
        const hy = handles[i].y;
        if (
          worldX >= hx - handleSize &&
          worldX <= hx + handleSize &&
          worldY >= hy - handleSize &&
          worldY <= hy + handleSize
        ) {
          return { shape, handleIndex: i };
        }
      }
    }
    return null;
  }

  /**
   * Add a shape to the canvas.
   */
  public addShape(shape: BaseShape): void {
    this.shapes.push(shape);
    this.dirty = true;
  }

  /**
   * Remove a shape from the canvas.
   */
  public removeShape(shape: BaseShape): void {
    const idx = this.shapes.indexOf(shape);
    if (idx >= 0) {
      this.shapes.splice(idx, 1);
      const selIdx = this.selectedShapes.indexOf(shape);
      if (selIdx >= 0) this.selectedShapes.splice(selIdx, 1);
      this.dirty = true;
    }
  }

  /**
   * Select a shape (deselect others unless shift is held).
   */
  public selectShape(shape: BaseShape | null, addToSelection: boolean = false): void {
    if (!shape) {
      this.selectedShapes = [];
    } else if (addToSelection) {
      const idx = this.selectedShapes.indexOf(shape);
      if (idx >= 0) {
        this.selectedShapes.splice(idx, 1);
      } else {
        this.selectedShapes.push(shape);
      }
    } else {
      if (!this.selectedShapes.includes(shape)) {
        this.selectedShapes = [shape];
      }
    }
    this.dirty = true;
  }

  /**
   * Select all shapes.
   */
  public selectAll(): void {
    this.selectedShapes = [...this.shapes];
    this.dirty = true;
  }

  /**
   * Clear selection.
   */
  public clearSelection(): void {
    this.selectedShapes = [];
    this.dirty = true;
  }

  /**
   * Get the bounding box of all shapes.
   */
  public getContentBounds(): { minX: number; minY: number; maxX: number; maxY: number } | null {
    if (this.shapes.length === 0) return null;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const shape of this.shapes) {
      minX = Math.min(minX, shape.x);
      minY = Math.min(minY, shape.y);
      maxX = Math.max(maxX, shape.x + shape.width);
      maxY = Math.max(maxY, shape.y + shape.height);
    }
    return { minX, minY, maxX, maxY };
  }

  /**
   * Clear all shapes from the canvas.
   */
  public clear(): void {
    this.shapes = [];
    this.selectedShapes = [];
    this.dirty = true;
  }
}
