/**
 * SelectTool - Handles shape selection, moving, and resizing.
 * Also handles canvas panning with middle mouse or space+drag.
 */
import { Canvas } from '../core/canvas';
import { BaseTool } from './base-tool';
import { BaseShape } from '../shapes/base';
import { LineShape } from '../shapes/line';
import { FreehandShape } from '../shapes/freehand';

export class SelectTool extends BaseTool {
  public name = 'select';
  public cursor = 'default';

  /** Whether we are currently dragging */
  private dragging = false;
  /** Whether we are resizing via a handle */
  private resizing = false;
  /** Whether we are panning the canvas */
  private panning = false;
  /** Whether space is held (for pan mode) */
  private spaceHeld = false;
  /** Start position of drag in world coords */
  private dragStartX = 0;
  private dragStartY = 0;
  /** Original positions of shapes being moved */
  private originalPositions: Map<string, { x: number; y: number }> = new Map();
  /** Handle index being dragged */
  private handleIndex = -1;
  /** Shape being resized */
  private resizeShape: BaseShape | null = null;
  /** Original bounds of shape being resized */
  private resizeOriginal = { x: 0, y: 0, w: 0, h: 0 };
  /** Multi-selection bounding box */
  private selectionBox: { startX: number; startY: number; endX: number; endY: number } | null = null;
  /** Pan start position */
  private panStartX = 0;
  private panStartY = 0;
  /** Pan start camera position */
  private panCamX = 0;
  private panCamY = 0;

  activate(): void {
    super.activate();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  deactivate(): void {
    super.deactivate();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.spaceHeld = false;
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Space' && !this.spaceHeld) {
      this.spaceHeld = true;
      const container = document.getElementById('canvas-container');
      if (container) container.style.cursor = 'grab';
    }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    if (e.code === 'Space') {
      this.spaceHeld = false;
      const container = document.getElementById('canvas-container');
      if (container) container.style.cursor = this.cursor;
    }
  };

  onMouseDown(e: MouseEvent, canvas: Canvas): void {
    const rect = canvas.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = canvas.camera.screenToWorld(screenX, screenY);

    // Middle mouse button or space+left click = pan
    if (e.button === 1 || (e.button === 0 && this.spaceHeld)) {
      this.panning = true;
      this.panStartX = screenX;
      this.panStartY = screenY;
      this.panCamX = canvas.camera.x;
      this.panCamY = canvas.camera.y;
      const container = document.getElementById('canvas-container');
      if (container) container.style.cursor = 'grabbing';
      e.preventDefault();
      return;
    }

    if (e.button !== 0) return;

    // Check resize handles first
    const handle = canvas.hitTestHandles(world.x, world.y);
    if (handle) {
      this.resizing = true;
      this.handleIndex = handle.handleIndex;
      this.resizeShape = handle.shape;
      this.resizeOriginal = {
        x: handle.shape.x,
        y: handle.shape.y,
        w: handle.shape.width,
        h: handle.shape.height,
      };
      return;
    }

    // Check shape hit
    const hitShape = canvas.hitTest(world.x, world.y);

    if (hitShape) {
      // Select the shape
      canvas.selectShape(hitShape, e.shiftKey);
      this.dragging = true;
      this.dragStartX = world.x;
      this.dragStartY = world.y;

      // Store original positions of all selected shapes
      this.originalPositions.clear();
      for (const shape of canvas.selectedShapes) {
        this.originalPositions.set(shape.id, { x: shape.x, y: shape.y });
      }
    } else {
      // Clicked on empty space - start selection box or deselect
      if (!e.shiftKey) {
        canvas.clearSelection();
      }
      this.selectionBox = {
        startX: world.x,
        startY: world.y,
        endX: world.x,
        endY: world.y,
      };
    }
  }

  onMouseMove(e: MouseEvent, canvas: Canvas): void {
    const rect = canvas.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = canvas.camera.screenToWorld(screenX, screenY);

    if (this.panning) {
      const dx = screenX - this.panStartX;
      const dy = screenY - this.panStartY;
      canvas.camera.x = this.panCamX + dx;
      canvas.camera.y = this.panCamY + dy;
      canvas.dirty = true;
      return;
    }

    if (this.resizing && this.resizeShape) {
      this.performResize(world.x, world.y, canvas);
      canvas.dirty = true;
      return;
    }

    if (this.dragging) {
      const dx = world.x - this.dragStartX;
      const dy = world.y - this.dragStartY;

      for (const shape of canvas.selectedShapes) {
        const orig = this.originalPositions.get(shape.id);
        if (orig) {
          if (shape instanceof LineShape) {
            shape.move(dx, dy);
          } else if (shape instanceof FreehandShape) {
            shape.move(dx, dy);
          } else {
            shape.x = orig.x + dx;
            shape.y = orig.y + dy;
          }
        }
      }
      canvas.dirty = true;
      return;
    }

    if (this.selectionBox) {
      this.selectionBox.endX = world.x;
      this.selectionBox.endY = world.y;
      canvas.dirty = true;
      // Draw selection box on canvas (handled in render)
      return;
    }

    // Update cursor based on what's under the mouse
    const handle = canvas.hitTestHandles(world.x, world.y);
    if (handle) {
      const cursors = ['nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize',
                        'nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize'];
      const container = document.getElementById('canvas-container');
      if (container) container.style.cursor = cursors[handle.handleIndex];
    } else {
      const hit = canvas.hitTest(world.x, world.y);
      const container = document.getElementById('canvas-container');
      if (container) container.style.cursor = hit ? 'move' : 'default';
    }
  }

  onMouseUp(e: MouseEvent, canvas: Canvas): void {
    if (this.panning) {
      this.panning = false;
      const container = document.getElementById('canvas-container');
      if (container) container.style.cursor = this.spaceHeld ? 'grab' : this.cursor;
      return;
    }

    if (this.resizing) {
      if (this.resizeShape) {
        this.resizeShape.normalize();
      }
      this.resizing = false;
      this.resizeShape = null;
      canvas.dirty = true;
      return;
    }

    if (this.dragging) {
      this.dragging = false;
      this.originalPositions.clear();
      return;
    }

    if (this.selectionBox) {
      // Select all shapes within the selection box
      const box = this.selectionBox;
      const minX = Math.min(box.startX, box.endX);
      const minY = Math.min(box.startY, box.endY);
      const maxX = Math.max(box.startX, box.endX);
      const maxY = Math.max(box.startY, box.endY);

      if (Math.abs(maxX - minX) > 2 || Math.abs(maxY - minY) > 2) {
        for (const shape of canvas.shapes) {
          const shapeCX = shape.x + shape.width / 2;
          const shapeCY = shape.y + shape.height / 2;
          if (
            shapeCX >= minX && shapeCX <= maxX &&
            shapeCY >= minY && shapeCY <= maxY
          ) {
            if (!canvas.selectedShapes.includes(shape)) {
              canvas.selectedShapes.push(shape);
            }
          }
        }
      }

      this.selectionBox = null;
      canvas.dirty = true;
    }
  }

  /**
   * Perform resize based on which handle is being dragged.
   */
  private performResize(mouseX: number, mouseY: number, canvas: Canvas): void {
    if (!this.resizeShape) return;

    const orig = this.resizeOriginal;
    const dx = mouseX - (orig.x + orig.w / 2);
    const dy = mouseY - (orig.y + orig.h / 2);

    switch (this.handleIndex) {
      case 0: // top-left
        this.resizeShape.x = Math.min(mouseX, orig.x + orig.w - 10);
        this.resizeShape.y = Math.min(mouseY, orig.y + orig.h - 10);
        this.resizeShape.width = orig.x + orig.w - this.resizeShape.x;
        this.resizeShape.height = orig.y + orig.h - this.resizeShape.y;
        break;
      case 1: // top-center
        this.resizeShape.y = Math.min(mouseY, orig.y + orig.h - 10);
        this.resizeShape.height = orig.y + orig.h - this.resizeShape.y;
        break;
      case 2: // top-right
        this.resizeShape.y = Math.min(mouseY, orig.y + orig.h - 10);
        this.resizeShape.width = Math.max(10, mouseX - orig.x);
        this.resizeShape.height = orig.y + orig.h - this.resizeShape.y;
        break;
      case 3: // middle-right
        this.resizeShape.width = Math.max(10, mouseX - orig.x);
        break;
      case 4: // bottom-right
        this.resizeShape.width = Math.max(10, mouseX - orig.x);
        this.resizeShape.height = Math.max(10, mouseY - orig.y);
        break;
      case 5: // bottom-center
        this.resizeShape.height = Math.max(10, mouseY - orig.y);
        break;
      case 6: // bottom-left
        this.resizeShape.x = Math.min(mouseX, orig.x + orig.w - 10);
        this.resizeShape.width = orig.x + orig.w - this.resizeShape.x;
        this.resizeShape.height = Math.max(10, mouseY - orig.y);
        break;
      case 7: // middle-left
        this.resizeShape.x = Math.min(mouseX, orig.x + orig.w - 10);
        this.resizeShape.width = orig.x + orig.w - this.resizeShape.x;
        break;
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

  onKeyDown(e: KeyboardEvent, canvas: Canvas): void {
    // Delete selected shapes
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Don't delete if we're editing text
      if (document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA') return;

      for (const shape of [...canvas.selectedShapes]) {
        canvas.removeShape(shape);
      }
    }

    // Select all
    if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      canvas.selectAll();
    }
  }
}
