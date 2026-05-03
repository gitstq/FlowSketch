/**
 * BaseTool - Abstract base class for all tools.
 * Provides default no-op implementations for all event handlers.
 */
import { Canvas } from '../core/canvas';

export abstract class BaseTool {
  /** Tool display name */
  public abstract name: string;
  /** Tool cursor style */
  public cursor: string = 'default';

  /**
   * Called when the tool is activated.
   */
  public activate(): void {
    // Update cursor
    const container = document.getElementById('canvas-container');
    if (container) container.style.cursor = this.cursor;
  }

  /**
   * Called when the tool is deactivated.
   */
  public deactivate(): void {
    // Reset cursor
    const container = document.getElementById('canvas-container');
    if (container) container.style.cursor = 'default';
  }

  public abstract onMouseDown(e: MouseEvent, canvas: Canvas): void;
  public abstract onMouseMove(e: MouseEvent, canvas: Canvas): void;
  public abstract onMouseUp(e: MouseEvent, canvas: Canvas): void;

  public onWheel(_e: WheelEvent, _canvas: Canvas): void {
    // Default: no-op
  }

  public onKeyDown(_e: KeyboardEvent, _canvas: Canvas): void {
    // Default: no-op
  }

  public onKeyUp(_e: KeyboardEvent, _canvas: Canvas): void {
    // Default: no-op
  }
}
