/**
 * TextTool - Click to place text, with inline editing support.
 */
import { Canvas } from '../core/canvas';
import { BaseTool } from './base-tool';
import { TextShape } from '../shapes/text';

export class TextTool extends BaseTool {
  public name = 'text';
  public cursor = 'text';

  /** Active text input element */
  private inputEl: HTMLInputElement | null = null;
  /** Shape being edited */
  private editingShape: TextShape | null = null;

  onMouseDown(e: MouseEvent, canvas: Canvas): void {
    if (e.button !== 0) return;

    // If we have an active input, finish editing
    if (this.inputEl) {
      this.finishEditing(canvas);
      return;
    }

    const rect = canvas.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = canvas.camera.screenToWorld(screenX, screenY);

    // Check if clicking on an existing text shape
    const hit = canvas.hitTest(world.x, world.y);
    if (hit && hit instanceof TextShape) {
      this.startEditing(hit, canvas);
    } else {
      // Create a new text shape
      const textShape = new TextShape(world.x, world.y, 'Text');
      canvas.addShape(textShape);
      canvas.selectShape(textShape, false);
      this.startEditing(textShape, canvas);
    }
  }

  onMouseMove(_e: MouseEvent, _canvas: Canvas): void {
    // No-op for text tool
  }

  onMouseUp(_e: MouseEvent, _canvas: Canvas): void {
    // No-op for text tool
  }

  /**
   * Start inline editing of a text shape.
   */
  private startEditing(shape: TextShape, canvas: Canvas): void {
    this.editingShape = shape;

    // Create an input element positioned over the shape
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const screenPos = canvas.camera.worldToScreen(shape.x, shape.y);

    const input = document.createElement('input');
    input.type = 'text';
    input.value = shape.text;
    input.className = 'text-edit-input';
    input.style.left = `${screenPos.x}px`;
    input.style.top = `${screenPos.y}px`;
    input.style.fontSize = `${shape.fontSize * canvas.camera.zoom}px`;
    input.style.fontFamily = shape.fontFamily;
    input.style.color = shape.fill;
    input.style.minWidth = `${Math.max(shape.width * canvas.camera.zoom, 100)}px`;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.finishEditing(canvas);
      } else if (e.key === 'Escape') {
        this.cancelEditing();
      }
      e.stopPropagation();
    });

    input.addEventListener('blur', () => {
      // Small delay to allow click events to process
      setTimeout(() => {
        if (this.inputEl) {
          this.finishEditing(canvas);
        }
      }, 100);
    });

    container.appendChild(input);
    input.focus();
    input.select();

    this.inputEl = input;
  }

  /**
   * Finish editing and update the shape text.
   */
  private finishEditing(canvas: Canvas): void {
    if (this.inputEl && this.editingShape) {
      this.editingShape.text = this.inputEl.value || 'Text';

      // Recalculate dimensions
      this.editingShape.measureText(canvas.ctx);
      canvas.dirty = true;
    }
    this.cleanupInput();
  }

  /**
   * Cancel editing without saving.
   */
  private cancelEditing(): void {
    this.cleanupInput();
  }

  /**
   * Remove the input element.
   */
  private cleanupInput(): void {
    if (this.inputEl) {
      this.inputEl.remove();
      this.inputEl = null;
    }
    this.editingShape = null;
  }

  deactivate(): void {
    this.cleanupInput();
    super.deactivate();
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
