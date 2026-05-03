/**
 * JSON Export - Save and load full project state as JSON.
 */
import { Canvas } from '../core/canvas';
import { BaseShape } from '../shapes/base';
import { Rectangle } from '../shapes/rectangle';
import { Ellipse } from '../shapes/ellipse';
import { Diamond } from '../shapes/diamond';
import { TextShape } from '../shapes/text';
import { LineShape } from '../shapes/line';
import { FreehandShape } from '../shapes/freehand';

export interface ProjectState {
  version: string;
  camera: {
    x: number;
    y: number;
    zoom: number;
  };
  shapes: Record<string, unknown>[];
}

export class JsonExport {
  /**
   * Serialize the current project state to a JSON object.
   */
  public static serialize(canvas: Canvas): ProjectState {
    return {
      version: '1.0.0',
      camera: {
        x: canvas.camera.x,
        y: canvas.camera.y,
        zoom: canvas.camera.zoom,
      },
      shapes: canvas.shapes.map(shape => shape.serialize()),
    };
  }

  /**
   * Deserialize a JSON object and restore the project state.
   */
  public static deserialize(canvas: Canvas, state: ProjectState): void {
    // Restore camera
    if (state.camera) {
      canvas.camera.x = state.camera.x;
      canvas.camera.y = state.camera.y;
      canvas.camera.zoom = state.camera.zoom;
    }

    // Restore shapes
    canvas.clear();
    if (state.shapes) {
      for (const shapeData of state.shapes) {
        const shape = this.deserializeShape(shapeData);
        if (shape) {
          canvas.addShape(shape);
        }
      }
    }

    canvas.dirty = true;
  }

  /**
   * Deserialize a single shape from a plain object.
   */
  public static deserializeShape(data: Record<string, unknown>): BaseShape | null {
    const type = data.type as string;

    let shape: BaseShape;

    switch (type) {
      case 'rectangle': {
        const s = new Rectangle(
          data.x as number, data.y as number,
          data.width as number, data.height as number,
          (data.cornerRadius as number) || 0
        );
        shape = s;
        break;
      }
      case 'ellipse': {
        const s = new Ellipse(
          data.x as number, data.y as number,
          data.width as number, data.height as number
        );
        shape = s;
        break;
      }
      case 'diamond': {
        const s = new Diamond(
          data.x as number, data.y as number,
          data.width as number, data.height as number
        );
        shape = s;
        break;
      }
      case 'text': {
        const s = new TextShape(
          data.x as number, data.y as number,
          (data.text as string) || ''
        );
        s.fontSize = (data.fontSize as number) || 16;
        s.fontFamily = (data.fontFamily as string) || 'sans-serif';
        s.textAlign = (data.textAlign as CanvasTextAlign) || 'left';
        s.showBackground = (data.showBackground as boolean) || false;
        s.backgroundFill = (data.backgroundFill as string) || '#ffffff';
        shape = s;
        break;
      }
      case 'line': {
        const s = new LineShape(
          data.x1 as number, data.y1 as number,
          data.x2 as number, data.y2 as number
        );
        s.arrowHead = (data.arrowHead as boolean) ?? true;
        s.curved = (data.curved as boolean) || false;
        s.controlPoints = data.controlPoints as { cpx: number; cpy: number } | null;
        s.label = (data.label as string) || '';
        s.sourceId = (data.sourceId as string) || null;
        s.targetId = (data.targetId as string) || null;
        shape = s;
        break;
      }
      case 'freehand': {
        const s = new FreehandShape();
        s.points = (data.points as Array<{ x: number; y: number }>) || [];
        s.smoothedPoints = (data.smoothedPoints as any[]) || [];
        s.smoothed = (data.smoothed as boolean) || false;
        s.x = data.x as number;
        s.y = data.y as number;
        s.width = data.width as number;
        s.height = data.height as number;
        shape = s;
        break;
      }
      default:
        console.warn(`Unknown shape type: ${type}`);
        return null;
    }

    // Restore common properties
    if (data.id) shape.id = data.id as string;
    if (data.rotation !== undefined) shape.rotation = data.rotation as number;
    if (data.fill) shape.fill = data.fill as string;
    if (data.stroke) shape.stroke = data.stroke as string;
    if (data.strokeWidth !== undefined) shape.strokeWidth = data.strokeWidth as number;
    if (data.opacity !== undefined) shape.opacity = data.opacity as number;

    return shape;
  }

  /**
   * Save project state to a JSON file download.
   */
  public static saveToFile(canvas: Canvas, filename?: string): void {
    const state = this.serialize(canvas);
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename || 'diagram.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Load project state from a JSON file.
   * Returns a Promise that resolves with the loaded state.
   */
  public static loadFromFile(): Promise<ProjectState | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.addEventListener('change', () => {
        const file = input.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
          try {
            const state = JSON.parse(reader.result as string) as ProjectState;
            resolve(state);
          } catch (err) {
            console.error('Failed to parse JSON file:', err);
            resolve(null);
          }
        });
        reader.addEventListener('error', () => {
          resolve(null);
        });
        reader.readAsText(file);
      });

      input.addEventListener('cancel', () => resolve(null));
      input.click();
    });
  }
}
