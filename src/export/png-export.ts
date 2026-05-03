/**
 * PNG Export - Render the canvas content to a PNG image.
 */
import { Canvas } from '../core/canvas';
import { renderShape } from '../core/renderer';

export class PngExport {
  /**
   * Export the canvas content as a PNG data URL.
   * @param transparent - If true, use transparent background; otherwise white.
   */
  public static exportToPNG(canvas: Canvas, transparent: boolean = false): string {
    // Create an offscreen canvas
    const bounds = canvas.getContentBounds();
    const padding = 20;

    let width: number, height: number, offsetX: number, offsetY: number;

    if (bounds) {
      width = bounds.maxX - bounds.minX + padding * 2;
      height = bounds.maxY - bounds.minY + padding * 2;
      offsetX = -bounds.minX + padding;
      offsetY = -bounds.minY + padding;
    } else {
      width = 800;
      height = 600;
      offsetX = 0;
      offsetY = 0;
    }

    const offscreen = document.createElement('canvas');
    const scale = 2; // 2x resolution for quality
    offscreen.width = width * scale;
    offscreen.height = height * scale;

    const ctx = offscreen.getContext('2d')!;
    ctx.scale(scale, scale);

    // Background
    if (!transparent) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    // Apply offset
    ctx.save();
    ctx.translate(offsetX, offsetY);

    // Draw all shapes
    for (const shape of canvas.shapes) {
      renderShape(ctx, shape);
    }

    ctx.restore();

    return offscreen.toDataURL('image/png');
  }

  /**
   * Download the canvas as a PNG file.
   */
  public static downloadPNG(canvas: Canvas, filename: string = 'diagram.png'): void {
    const dataUrl = this.exportToPNG(canvas, false);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }
}
