/**
 * ToolManager - Manages the current active tool and delegates mouse/keyboard events.
 */
import { Canvas } from '../core/canvas';
import { BaseTool } from './base-tool';

export class ToolManager {
  /** Currently active tool */
  public activeTool: BaseTool | null = null;
  /** Map of tool name to tool instance */
  private tools: Map<string, BaseTool> = new Map();
  /** Reference to the canvas */
  private canvas: Canvas;
  /** Callback when tool changes */
  public onToolChange: ((toolName: string) => void) | null = null;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  /**
   * Register a tool with a name.
   */
  public registerTool(name: string, tool: BaseTool): void {
    this.tools.set(name, tool);
  }

  /**
   * Switch to a tool by name.
   */
  public setTool(name: string): void {
    const tool = this.tools.get(name);
    if (tool) {
      // Deactivate current tool
      if (this.activeTool) {
        this.activeTool.deactivate();
      }
      this.activeTool = tool;
      tool.activate();
      this.onToolChange?.(name);
    }
  }

  /**
   * Get the name of the current tool.
   */
  public getCurrentToolName(): string {
    for (const [name, tool] of this.tools) {
      if (tool === this.activeTool) return name;
    }
    return '';
  }

  /**
   * Delegate mouse down event to the active tool.
   */
  public onMouseDown(e: MouseEvent): void {
    this.activeTool?.onMouseDown(e, this.canvas);
  }

  /**
   * Delegate mouse move event to the active tool.
   */
  public onMouseMove(e: MouseEvent): void {
    this.activeTool?.onMouseMove(e, this.canvas);
  }

  /**
   * Delegate mouse up event to the active tool.
   */
  public onMouseUp(e: MouseEvent): void {
    this.activeTool?.onMouseUp(e, this.canvas);
  }

  /**
   * Delegate mouse wheel event to the active tool.
   */
  public onWheel(e: WheelEvent): void {
    this.activeTool?.onWheel(e, this.canvas);
  }

  /**
   * Delegate key down event to the active tool.
   */
  public onKeyDown(e: KeyboardEvent): void {
    this.activeTool?.onKeyDown(e, this.canvas);
  }

  /**
   * Delegate key up event to the active tool.
   */
  public onKeyUp(e: KeyboardEvent): void {
    this.activeTool?.onKeyUp(e, this.canvas);
  }
}
