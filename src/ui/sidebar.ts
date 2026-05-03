/**
 * Sidebar - Left panel with a shape palette for drag-and-drop shape creation.
 */
import { Canvas } from '../core/canvas';
import { Rectangle } from '../shapes/rectangle';
import { Ellipse } from '../shapes/ellipse';
import { Diamond } from '../shapes/diamond';
import { TextShape } from '../shapes/text';
import { LineShape } from '../shapes/line';

interface ShapeTemplate {
  type: string;
  label: string;
  icon: string;
  create: () => { shape: any; offsetX: number; offsetY: number };
}

export class Sidebar {
  private container: HTMLElement;
  private canvas: Canvas;

  /** Shape templates available in the palette */
  private templates: ShapeTemplate[] = [
    {
      type: 'rectangle',
      label: 'Rectangle',
      icon: 'rect',
      create: () => ({
        shape: new Rectangle(0, 0, 120, 80),
        offsetX: 60,
        offsetY: 40,
      }),
    },
    {
      type: 'ellipse',
      label: 'Ellipse',
      icon: 'ellipse',
      create: () => ({
        shape: new Ellipse(0, 0, 120, 80),
        offsetX: 60,
        offsetY: 40,
      }),
    },
    {
      type: 'diamond',
      label: 'Diamond',
      icon: 'diamond',
      create: () => ({
        shape: new Diamond(0, 0, 120, 80),
        offsetX: 60,
        offsetY: 40,
      }),
    },
    {
      type: 'text',
      label: 'Text',
      icon: 'text',
      create: () => ({
        shape: new TextShape(0, 0, 'Text'),
        offsetX: 10,
        offsetY: 10,
      }),
    },
    {
      type: 'line',
      label: 'Line',
      icon: 'line',
      create: () => ({
        shape: new LineShape(0, 0, 100, 100),
        offsetX: 0,
        offsetY: 0,
      }),
    },
  ];

  constructor(container: HTMLElement, canvas: Canvas) {
    this.container = container;
    this.canvas = canvas;
    this.render();
  }

  /**
   * Build the sidebar DOM.
   */
  private render(): void {
    this.container.innerHTML = '';

    const title = document.createElement('div');
    title.className = 'sidebar-title';
    title.textContent = 'Shapes';
    this.container.appendChild(title);

    const shapeList = document.createElement('div');
    shapeList.className = 'sidebar-shapes';

    for (const template of this.templates) {
      const item = document.createElement('div');
      item.className = 'sidebar-shape-item';
      item.draggable = true;
      item.title = `Drag to add ${template.label}`;

      // Create a small preview canvas
      const preview = document.createElement('canvas');
      preview.width = 48;
      preview.height = 36;
      preview.className = 'sidebar-shape-preview';
      this.drawPreview(preview, template.type);

      const label = document.createElement('span');
      label.className = 'sidebar-shape-label';
      label.textContent = template.label;

      item.appendChild(preview);
      item.appendChild(label);

      // Drag events
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('application/flowsketch', template.type);
        e.dataTransfer!.effectAllowed = 'copy';
      });

      // Click to add shape at center of viewport
      item.addEventListener('dblclick', () => {
        const world = this.canvas.camera.screenToWorld(
          this.canvas.width / 2,
          this.canvas.height / 2
        );
        const { shape, offsetX, offsetY } = template.create();
        shape.x = world.x - offsetX;
        shape.y = world.y - offsetY;
        this.canvas.addShape(shape);
        this.canvas.selectShape(shape, false);
      });

      shapeList.appendChild(item);
    }

    this.container.appendChild(shapeList);
  }

  /**
   * Draw a small preview of a shape type on a canvas element.
   */
  private drawPreview(canvas: HTMLCanvasElement, type: string): void {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 48, 36);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1.5;
    ctx.fillStyle = 'rgba(100, 150, 255, 0.15)';

    switch (type) {
      case 'rectangle':
        ctx.fillRect(6, 6, 36, 24);
        ctx.strokeRect(6, 6, 36, 24);
        break;
      case 'ellipse':
        ctx.beginPath();
        ctx.ellipse(24, 18, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(24, 4);
        ctx.lineTo(44, 18);
        ctx.lineTo(24, 32);
        ctx.lineTo(4, 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 'text':
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Aa', 24, 18);
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(8, 28);
        ctx.lineTo(40, 8);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(40, 8);
        ctx.lineTo(32, 10);
        ctx.lineTo(38, 16);
        ctx.closePath();
        ctx.fillStyle = '#666';
        ctx.fill();
        break;
    }
  }

  /**
   * Handle a drop event on the canvas.
   */
  public handleDrop(e: DragEvent): void {
    const shapeType = e.dataTransfer?.getData('application/flowsketch');
    if (!shapeType) return;

    const template = this.templates.find(t => t.type === shapeType);
    if (!template) return;

    const rect = this.canvas.canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = this.canvas.camera.screenToWorld(screenX, screenY);

    const { shape, offsetX, offsetY } = template.create();
    shape.x = world.x - offsetX;
    shape.y = world.y - offsetY;
    this.canvas.addShape(shape);
    this.canvas.selectShape(shape, false);
  }
}
