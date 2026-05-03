/**
 * Toolbar - Top toolbar with shape tools, color pickers, zoom controls, and action buttons.
 */
import { Canvas } from '../core/canvas';
import { ToolManager } from '../tools/tool-manager';

export class Toolbar {
  private container: HTMLElement;
  private canvas: Canvas;
  private toolManager: ToolManager;

  /** Callbacks for various actions */
  public onUndo: (() => void) | null = null;
  public onRedo: (() => void) | null = null;
  public onExportPNG: (() => void) | null = null;
  public onExportSVG: (() => void) | null = null;
  public onExportJSON: (() => void) | null = null;
  public onImportJSON: (() => void) | null = null;
  public onToggleTheme: (() => void) | null = null;
  public onToggleCodePanel: (() => void) | null = null;
  public onClearCanvas: (() => void) | null = null;

  constructor(container: HTMLElement, canvas: Canvas, toolManager: ToolManager) {
    this.container = container;
    this.canvas = canvas;
    this.toolManager = toolManager;
    this.render();
  }

  /**
   * Build the toolbar DOM.
   */
  private render(): void {
    this.container.innerHTML = '';

    // Left section: tool buttons
    const leftGroup = this.createGroup('toolbar-group');

    // Select tool
    leftGroup.appendChild(this.createToolButton('select', 'Select (V)', 'pointer'));
    // Rectangle tool
    leftGroup.appendChild(this.createToolButton('draw-rectangle', 'Rectangle (R)', 'rect'));
    // Ellipse tool
    leftGroup.appendChild(this.createToolButton('draw-ellipse', 'Ellipse (E)', 'ellipse'));
    // Diamond tool
    leftGroup.appendChild(this.createToolButton('draw-diamond', 'Diamond (D)', 'diamond'));
    // Line tool
    leftGroup.appendChild(this.createToolButton('line', 'Line (L)', 'line'));
    // Text tool
    leftGroup.appendChild(this.createToolButton('text', 'Text (T)', 'text'));
    // Freehand tool
    leftGroup.appendChild(this.createToolButton('freehand', 'Freehand (F)', 'freehand'));

    this.container.appendChild(leftGroup);

    // Separator
    this.container.appendChild(this.createSeparator());

    // Color section
    const colorGroup = this.createGroup('toolbar-group');

    // Fill color
    const fillLabel = document.createElement('label');
    fillLabel.className = 'toolbar-label';
    fillLabel.textContent = 'Fill';
    const fillColor = document.createElement('input');
    fillColor.type = 'color';
    fillColor.id = 'fill-color';
    fillColor.value = '#ffffff';
    fillColor.title = 'Fill color';
    fillColor.addEventListener('input', () => this.onFillColorChange(fillColor.value));
    fillLabel.appendChild(fillColor);
    colorGroup.appendChild(fillLabel);

    // Stroke color
    const strokeLabel = document.createElement('label');
    strokeLabel.className = 'toolbar-label';
    strokeLabel.textContent = 'Stroke';
    const strokeColor = document.createElement('input');
    strokeColor.type = 'color';
    strokeColor.id = 'stroke-color';
    strokeColor.value = '#333333';
    strokeColor.title = 'Stroke color';
    strokeColor.addEventListener('input', () => this.onStrokeColorChange(strokeColor.value));
    strokeLabel.appendChild(strokeColor);
    colorGroup.appendChild(strokeLabel);

    // Stroke width
    const widthLabel = document.createElement('label');
    widthLabel.className = 'toolbar-label';
    widthLabel.textContent = 'Width';
    const strokeWidth = document.createElement('input');
    strokeWidth.type = 'range';
    strokeWidth.id = 'stroke-width';
    strokeWidth.min = '0';
    strokeWidth.max = '10';
    strokeWidth.value = '2';
    strokeWidth.title = 'Stroke width';
    strokeWidth.addEventListener('input', () => this.onStrokeWidthChange(Number(strokeWidth.value)));
    widthLabel.appendChild(strokeWidth);
    colorGroup.appendChild(widthLabel);

    this.container.appendChild(colorGroup);

    // Separator
    this.container.appendChild(this.createSeparator());

    // Action section
    const actionGroup = this.createGroup('toolbar-group');

    actionGroup.appendChild(this.createActionButton('Undo', 'Ctrl+Z', () => this.onUndo?.()));
    actionGroup.appendChild(this.createActionButton('Redo', 'Ctrl+Y', () => this.onRedo?.()));

    this.container.appendChild(actionGroup);

    // Separator
    this.container.appendChild(this.createSeparator());

    // Zoom section
    const zoomGroup = this.createGroup('toolbar-group');
    zoomGroup.appendChild(this.createActionButton('Zoom In', '+', () => this.zoomIn()));
    zoomGroup.appendChild(this.createActionButton('Zoom Out', '-', () => this.zoomOut()));
    zoomGroup.appendChild(this.createActionButton('Fit', 'Fit', () => this.zoomFit()));
    const zoomLabel = document.createElement('span');
    zoomLabel.className = 'toolbar-zoom-label';
    zoomLabel.id = 'zoom-label';
    zoomLabel.textContent = '100%';
    zoomGroup.appendChild(zoomLabel);

    this.container.appendChild(zoomGroup);

    // Separator
    this.container.appendChild(this.createSeparator());

    // Right section: export and settings
    const rightGroup = this.createGroup('toolbar-group toolbar-right');

    rightGroup.appendChild(this.createActionButton('Code', '</>', () => this.onToggleCodePanel?.()));
    rightGroup.appendChild(this.createActionButton('PNG', 'PNG', () => this.onExportPNG?.()));
    rightGroup.appendChild(this.createActionButton('SVG', 'SVG', () => this.onExportSVG?.()));
    rightGroup.appendChild(this.createActionButton('Save', 'Save', () => this.onExportJSON?.()));
    rightGroup.appendChild(this.createActionButton('Load', 'Load', () => this.onImportJSON?.()));
    rightGroup.appendChild(this.createActionButton('Clear', 'Clear', () => this.onClearCanvas?.()));
    rightGroup.appendChild(this.createActionButton('Theme', 'Theme', () => this.onToggleTheme?.()));

    this.container.appendChild(rightGroup);
  }

  private createGroup(className: string): HTMLDivElement {
    const group = document.createElement('div');
    group.className = className;
    return group;
  }

  private createSeparator(): HTMLDivElement {
    const sep = document.createElement('div');
    sep.className = 'toolbar-separator';
    return sep;
  }

  private createToolButton(toolName: string, title: string, icon: string): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = 'toolbar-btn tool-btn';
    btn.dataset.tool = toolName;
    btn.title = title;

    // Create SVG icon
    const svg = this.createToolIcon(icon);
    btn.appendChild(svg);

    btn.addEventListener('click', () => {
      // Remove active class from all tool buttons
      this.container.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Handle draw tool variants
      if (toolName.startsWith('draw-')) {
        const shapeType = toolName.replace('draw-', '') as 'rectangle' | 'ellipse' | 'diamond';
        this.toolManager.setTool('draw');
        // Update the draw tool's shape type
        const drawTool = this.toolManager.activeTool as any;
        if (drawTool && drawTool.shapeType !== undefined) {
          drawTool.shapeType = shapeType;
        }
      } else {
        this.toolManager.setTool(toolName);
      }
    });

    return btn;
  }

  private createToolIcon(icon: string): SVGSVGElement {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');

    switch (icon) {
      case 'pointer':
        svg.innerHTML = '<path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/>';
        break;
      case 'rect':
        svg.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2"/>';
        break;
      case 'ellipse':
        svg.innerHTML = '<ellipse cx="12" cy="12" rx="10" ry="7"/>';
        break;
      case 'diamond':
        svg.innerHTML = '<path d="M12 2l10 10-10 10L2 12z"/>';
        break;
      case 'line':
        svg.innerHTML = '<line x1="5" y1="19" x2="19" y2="5"/><polyline points="12 5 19 5 19 12"/>';
        break;
      case 'text':
        svg.innerHTML = '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>';
        break;
      case 'freehand':
        svg.innerHTML = '<path d="M3 17c3-3 3-6 6-6s3 3 6 3 3-3 6-3"/>';
        break;
    }

    return svg;
  }

  private createActionButton(label: string, title: string, onClick: () => void): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = 'toolbar-btn';
    btn.textContent = label;
    btn.title = title;
    btn.addEventListener('click', onClick);
    return btn;
  }

  /**
   * Update the zoom label.
   */
  public updateZoomLabel(): void {
    const label = document.getElementById('zoom-label');
    if (label) {
      label.textContent = `${Math.round(this.canvas.camera.zoom * 100)}%`;
    }
  }

  /**
   * Zoom in.
   */
  private zoomIn(): void {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    this.canvas.camera.zoomAt(cx, cy, 1.2);
    this.canvas.dirty = true;
    this.updateZoomLabel();
  }

  /**
   * Zoom out.
   */
  private zoomOut(): void {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    this.canvas.camera.zoomAt(cx, cy, 0.8);
    this.canvas.dirty = true;
    this.updateZoomLabel();
  }

  /**
   * Fit all content in the viewport.
   */
  private zoomFit(): void {
    const bounds = this.canvas.getContentBounds();
    if (!bounds) {
      this.canvas.camera.reset();
    } else {
      const padding = 50;
      const contentW = bounds.maxX - bounds.minX + padding * 2;
      const contentH = bounds.maxY - bounds.minY + padding * 2;
      const scaleX = this.canvas.width / contentW;
      const scaleY = this.canvas.height / contentH;
      const zoom = Math.min(scaleX, scaleY, 2);

      this.canvas.camera.zoom = zoom;
      this.canvas.camera.x =
        this.canvas.width / 2 - ((bounds.minX + bounds.maxX) / 2) * zoom;
      this.canvas.camera.y =
        this.canvas.height / 2 - ((bounds.minY + bounds.maxY) / 2) * zoom;
    }
    this.canvas.dirty = true;
    this.updateZoomLabel();
  }

  /**
   * Handle fill color change - update selected shapes.
   */
  private onFillColorChange(color: string): void {
    for (const shape of this.canvas.selectedShapes) {
      shape.fill = color;
    }
    this.canvas.dirty = true;
  }

  /**
   * Handle stroke color change - update selected shapes.
   */
  private onStrokeColorChange(color: string): void {
    for (const shape of this.canvas.selectedShapes) {
      shape.stroke = color;
    }
    this.canvas.dirty = true;
  }

  /**
   * Handle stroke width change - update selected shapes.
   */
  private onStrokeWidthChange(width: number): void {
    for (const shape of this.canvas.selectedShapes) {
      shape.strokeWidth = width;
    }
    this.canvas.dirty = true;
  }

  /**
   * Update toolbar to reflect the currently selected shape's properties.
   */
  public updateFromSelection(): void {
    if (this.canvas.selectedShapes.length === 1) {
      const shape = this.canvas.selectedShapes[0];
      const fillColor = document.getElementById('fill-color') as HTMLInputElement;
      const strokeColor = document.getElementById('stroke-color') as HTMLInputElement;
      const strokeWidth = document.getElementById('stroke-width') as HTMLInputElement;

      if (fillColor) fillColor.value = shape.fill || '#ffffff';
      if (strokeColor) strokeColor.value = shape.stroke || '#333333';
      if (strokeWidth) strokeWidth.value = String(shape.strokeWidth);
    }
  }
}
