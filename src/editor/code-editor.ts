/**
 * CodeEditor - Toggleable code editor panel for diagram syntax.
 */
import { Canvas } from '../core/canvas';
import { CodeParser } from './code-parser';

export class CodeEditor {
  private panel: HTMLElement;
  private textarea: HTMLTextAreaElement;
  private renderBtn: HTMLButtonElement;
  private closeBtn: HTMLElement;
  private canvas: Canvas;
  private parser: CodeParser;

  /** Whether the panel is visible */
  public visible: boolean = false;

  /** Callback when code is rendered */
  public onRender: (() => void) | null = null;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.parser = new CodeParser();
    this.panel = document.getElementById('code-panel')!;
    this.textarea = document.getElementById('code-editor') as HTMLTextAreaElement;
    this.renderBtn = document.getElementById('code-render-btn') as HTMLButtonElement;
    this.closeBtn = document.getElementById('code-panel-close')!;

    this.setupEvents();
  }

  /**
   * Set up event listeners for the code editor panel.
   */
  private setupEvents(): void {
    // Render button
    this.renderBtn.addEventListener('click', () => this.renderCode());

    // Close button
    this.closeBtn.addEventListener('click', () => this.hide());

    // Ctrl+Enter to render
    this.textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.renderCode();
      }
    });
  }

  /**
   * Toggle the code editor panel visibility.
   */
  public toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Show the code editor panel.
   */
  public show(): void {
    this.panel.style.display = 'flex';
    this.visible = true;
  }

  /**
   * Hide the code editor panel.
   */
  public hide(): void {
    this.panel.style.display = 'none';
    this.visible = false;
  }

  /**
   * Parse the code and render shapes on the canvas.
   */
  public renderCode(): void {
    const code = this.textarea.value.trim();
    if (!code) return;

    try {
      const result = this.parser.parse(code);
      const shapes = this.parser.toShapes(result);

      // Clear existing shapes and add new ones
      this.canvas.clear();
      for (const shape of shapes) {
        this.canvas.addShape(shape);
      }

      // Fit to view
      const bounds = this.canvas.getContentBounds();
      if (bounds) {
        const padding = 60;
        const contentW = bounds.maxX - bounds.minX + padding * 2;
        const contentH = bounds.maxY - bounds.minY + padding * 2;
        const scaleX = this.canvas.width / contentW;
        const scaleY = this.canvas.height / contentH;
        const zoom = Math.min(scaleX, scaleY, 1.5);

        this.canvas.camera.zoom = zoom;
        this.canvas.camera.x =
          this.canvas.width / 2 - ((bounds.minX + bounds.maxX) / 2) * zoom;
        this.canvas.camera.y =
          this.canvas.height / 2 - ((bounds.minY + bounds.maxY) / 2) * zoom;
      }

      this.canvas.dirty = true;
      this.onRender?.();
    } catch (err) {
      console.error('Failed to parse diagram code:', err);
    }
  }

  /**
   * Set the code editor content.
   */
  public setCode(code: string): void {
    this.textarea.value = code;
  }

  /**
   * Get the current code content.
   */
  public getCode(): string {
    return this.textarea.value;
  }
}
