/**
 * SVG Export - Convert canvas shapes to SVG format.
 */
import { Canvas } from '../core/canvas';
import { Rectangle } from '../shapes/rectangle';
import { Ellipse } from '../shapes/ellipse';
import { Diamond } from '../shapes/diamond';
import { TextShape } from '../shapes/text';
import { LineShape } from '../shapes/line';
import { FreehandShape } from '../shapes/freehand';
import { BaseShape } from '../shapes/base';

export class SvgExport {
  /**
   * Export the canvas content as an SVG string.
   */
  public static exportToSVG(canvas: Canvas): string {
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

    let svgContent = '';

    for (const shape of canvas.shapes) {
      svgContent += this.shapeToSVG(shape, offsetX, offsetY);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="white"/>
  ${svgContent}
</svg>`;
  }

  /**
   * Convert a single shape to SVG elements.
   */
  private static shapeToSVG(shape: BaseShape, offsetX: number, offsetY: number): string {
    const x = shape.x + offsetX;
    const y = shape.y + offsetY;
    const common = `fill="${shape.fill}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity}"`;

    if (shape instanceof Rectangle) {
      return `  <rect x="${x}" y="${y}" width="${shape.width}" height="${shape.height}" rx="${shape.cornerRadius}" ${common}/>\n`;
    }

    if (shape instanceof Ellipse) {
      const cx = x + shape.width / 2;
      const cy = y + shape.height / 2;
      return `  <ellipse cx="${cx}" cy="${cy}" rx="${shape.width / 2}" ry="${shape.height / 2}" ${common}/>\n`;
    }

    if (shape instanceof Diamond) {
      const cx = x + shape.width / 2;
      const cy = y + shape.height / 2;
      const points = `${cx},${y} ${x + shape.width},${cy} ${cx},${y + shape.height} ${x},${cy}`;
      return `  <polygon points="${points}" ${common}/>\n`;
    }

    if (shape instanceof TextShape) {
      const lines = shape.text.split('\n');
      let svg = '';
      for (let i = 0; i < lines.length; i++) {
        svg += `  <text x="${x}" y="${y + (i + 1) * shape.fontSize * 1.3}" font-size="${shape.fontSize}" font-family="${shape.fontFamily}" fill="${shape.fill}" opacity="${shape.opacity}">${this.escapeXml(lines[i])}</text>\n`;
      }
      return svg;
    }

    if (shape instanceof LineShape) {
      const x1 = shape.x1 + offsetX;
      const y1 = shape.y1 + offsetY;
      const x2 = shape.x2 + offsetX;
      const y2 = shape.y2 + offsetY;

      let svg = '';
      if (shape.curved && shape.controlPoints) {
        const cpx = shape.controlPoints.cpx + offsetX;
        const cpy = shape.controlPoints.cpy + offsetY;
        svg += `  <path d="M${x1},${y1} Q${cpx},${cpy} ${x2},${y2}" fill="none" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity}"/>\n`;
      } else {
        svg += `  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" opacity="${shape.opacity}"/>\n`;
      }

      if (shape.arrowHead) {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLen = 12;
        const p1x = x2 - headLen * Math.cos(angle - Math.PI / 6);
        const p1y = y2 - headLen * Math.sin(angle - Math.PI / 6);
        const p2x = x2 - headLen * Math.cos(angle + Math.PI / 6);
        const p2y = y2 - headLen * Math.sin(angle + Math.PI / 6);
        svg += `  <polygon points="${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}" fill="${shape.stroke}"/>\n`;
      }

      if (shape.label) {
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        svg += `  <text x="${mx}" y="${my - 4}" text-anchor="middle" font-size="12" fill="#333">${this.escapeXml(shape.label)}</text>\n`;
      }

      return svg;
    }

    if (shape instanceof FreehandShape) {
      if (shape.points.length < 2) return '';
      const points = shape.points.map(p => `${p.x + offsetX},${p.y + offsetY}`).join(' ');
      return `  <polyline points="${points}" fill="none" stroke="${shape.stroke}" stroke-width="${shape.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${shape.opacity}"/>\n`;
    }

    return '';
  }

  /**
   * Escape special XML characters.
   */
  private static escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Download the canvas as an SVG file.
   */
  public static downloadSVG(canvas: Canvas, filename: string = 'diagram.svg'): void {
    const svgString = this.exportToSVG(canvas);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }
}
