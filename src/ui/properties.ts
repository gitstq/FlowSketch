/**
 * Properties Panel - Right panel for editing selected shape properties.
 */
import { Canvas } from '../core/canvas';
import { BaseShape } from '../shapes/base';
import { TextShape } from '../shapes/text';
import { LineShape } from '../shapes/line';
import { Rectangle } from '../shapes/rectangle';

export class PropertiesPanel {
  private container: HTMLElement;
  private canvas: Canvas;

  constructor(container: HTMLElement, canvas: Canvas) {
    this.container = container;
    this.canvas = canvas;
    this.renderEmpty();
  }

  /**
   * Render the panel when no shape is selected.
   */
  private renderEmpty(): void {
    this.container.innerHTML = `
      <div class="properties-title">Properties</div>
      <div class="properties-empty">Select a shape to edit its properties</div>
    `;
  }

  /**
   * Update the panel to show properties of the currently selected shape.
   */
  public update(): void {
    const shapes = this.canvas.selectedShapes;
    if (shapes.length === 0) {
      this.renderEmpty();
      return;
    }

    if (shapes.length > 1) {
      this.container.innerHTML = `
        <div class="properties-title">Properties</div>
        <div class="properties-info">${shapes.length} shapes selected</div>
      `;
      return;
    }

    const shape = shapes[0];
    this.renderShapeProperties(shape);
  }

  /**
   * Render property editors for a single shape.
   */
  private renderShapeProperties(shape: BaseShape): void {
    this.container.innerHTML = '';

    const title = document.createElement('div');
    title.className = 'properties-title';
    title.textContent = `${shape.type.charAt(0).toUpperCase() + shape.type.slice(1)} Properties`;
    this.container.appendChild(title);

    // Position
    this.addNumberInput('X', shape.x, (val) => { shape.x = val; this.canvas.dirty = true; });
    this.addNumberInput('Y', shape.y, (val) => { shape.y = val; this.canvas.dirty = true; });

    // Size
    this.addNumberInput('Width', shape.width, (val) => { shape.width = val; this.canvas.dirty = true; });
    this.addNumberInput('Height', shape.height, (val) => { shape.height = val; this.canvas.dirty = true; });

    // Fill color
    this.addColorInput('Fill', shape.fill, (val) => { shape.fill = val; this.canvas.dirty = true; });

    // Stroke color
    this.addColorInput('Stroke', shape.stroke, (val) => { shape.stroke = val; this.canvas.dirty = true; });

    // Stroke width
    this.addNumberInput('Stroke Width', shape.strokeWidth, (val) => { shape.strokeWidth = val; this.canvas.dirty = true; }, 0, 20, 0.5);

    // Opacity
    this.addNumberInput('Opacity', shape.opacity, (val) => { shape.opacity = val; this.canvas.dirty = true; }, 0, 1, 0.05);

    // Type-specific properties
    if (shape instanceof Rectangle) {
      this.addNumberInput('Corner Radius', shape.cornerRadius, (val) => { shape.cornerRadius = val; this.canvas.dirty = true; }, 0, 50, 1);
    }

    if (shape instanceof TextShape) {
      this.addTextInput('Text', shape.text, (val) => {
        shape.text = val;
        shape.measureText(this.canvas.ctx);
        this.canvas.dirty = true;
      });
      this.addNumberInput('Font Size', shape.fontSize, (val) => {
        shape.fontSize = val;
        shape.measureText(this.canvas.ctx);
        this.canvas.dirty = true;
      }, 8, 72, 1);
    }

    if (shape instanceof LineShape) {
      this.addCheckbox('Arrow', shape.arrowHead, (val) => { shape.arrowHead = val; this.canvas.dirty = true; });
      this.addCheckbox('Curved', shape.curved, (val) => {
        shape.curved = val;
        if (val) {
          const mx = (shape.x1 + shape.x2) / 2;
          const my = (shape.y1 + shape.y2) / 2;
          const dx = shape.x2 - shape.x1;
          const dy = shape.y2 - shape.y1;
          shape.controlPoints = { cpx: mx - dy * 0.3, cpy: my + dx * 0.3 };
        } else {
          shape.controlPoints = null;
        }
        this.canvas.dirty = true;
      });
      if (shape.label !== undefined) {
        this.addTextInput('Label', shape.label, (val) => { shape.label = val; this.canvas.dirty = true; });
      }
    }

    // ID display
    const idRow = document.createElement('div');
    idRow.className = 'property-row';
    const idLabel = document.createElement('label');
    idLabel.textContent = 'ID';
    const idValue = document.createElement('span');
    idValue.className = 'property-id';
    idValue.textContent = shape.id;
    idRow.appendChild(idLabel);
    idRow.appendChild(idValue);
    this.container.appendChild(idRow);
  }

  /**
   * Add a number input row.
   */
  private addNumberInput(
    label: string,
    value: number,
    onChange: (val: number) => void,
    min?: number,
    max?: number,
    step?: number
  ): void {
    const row = document.createElement('div');
    row.className = 'property-row';

    const lbl = document.createElement('label');
    lbl.textContent = label;

    const input = document.createElement('input');
    input.type = 'number';
    input.value = String(value);
    if (min !== undefined) input.min = String(min);
    if (max !== undefined) input.max = String(max);
    if (step !== undefined) input.step = String(step);

    input.addEventListener('input', () => {
      const val = parseFloat(input.value);
      if (!isNaN(val)) onChange(val);
    });

    row.appendChild(lbl);
    row.appendChild(input);
    this.container.appendChild(row);
  }

  /**
   * Add a text input row.
   */
  private addTextInput(label: string, value: string, onChange: (val: string) => void): void {
    const row = document.createElement('div');
    row.className = 'property-row';

    const lbl = document.createElement('label');
    lbl.textContent = label;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;

    input.addEventListener('input', () => {
      onChange(input.value);
    });

    row.appendChild(lbl);
    row.appendChild(input);
    this.container.appendChild(row);
  }

  /**
   * Add a color input row.
   */
  private addColorInput(label: string, value: string, onChange: (val: string) => void): void {
    const row = document.createElement('div');
    row.className = 'property-row';

    const lbl = document.createElement('label');
    lbl.textContent = label;

    const input = document.createElement('input');
    input.type = 'color';
    input.value = value;

    input.addEventListener('input', () => {
      onChange(input.value);
    });

    row.appendChild(lbl);
    row.appendChild(input);
    this.container.appendChild(row);
  }

  /**
   * Add a checkbox row.
   */
  private addCheckbox(label: string, value: boolean, onChange: (val: boolean) => void): void {
    const row = document.createElement('div');
    row.className = 'property-row';

    const lbl = document.createElement('label');
    lbl.textContent = label;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = value;

    input.addEventListener('change', () => {
      onChange(input.checked);
    });

    row.appendChild(lbl);
    row.appendChild(input);
    this.container.appendChild(row);
  }
}
