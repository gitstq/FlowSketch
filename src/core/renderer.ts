/**
 * Renderer - Contains all shape rendering functions.
 * Each function draws a specific shape type onto the canvas.
 */
import { BaseShape } from '../shapes/base';
import { Rectangle } from '../shapes/rectangle';
import { Ellipse } from '../shapes/ellipse';
import { Diamond } from '../shapes/diamond';
import { TextShape } from '../shapes/text';
import { LineShape } from '../shapes/line';
import { FreehandShape } from '../shapes/freehand';

/**
 * Draw a selection outline and resize handles around a shape.
 */
export function drawSelectionHandles(
  ctx: CanvasRenderingContext2D,
  shape: BaseShape,
  zoom: number
): void {
  const padding = 4 / zoom;
  const handleSize = 8 / zoom;
  const x = shape.x - padding;
  const y = shape.y - padding;
  const w = shape.width + padding * 2;
  const h = shape.height + padding * 2;

  // Draw selection border (dashed)
  ctx.save();
  ctx.strokeStyle = '#4a90d9';
  ctx.lineWidth = 1.5 / zoom;
  ctx.setLineDash([6 / zoom, 4 / zoom]);
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);
  ctx.restore();

  // Draw 8 resize handles
  const handles = getHandlePositions(shape, padding);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#4a90d9';
  ctx.lineWidth = 1.5 / zoom;
  for (const hp of handles) {
    ctx.fillRect(
      hp.x - handleSize / 2,
      hp.y - handleSize / 2,
      handleSize,
      handleSize
    );
    ctx.strokeRect(
      hp.x - handleSize / 2,
      hp.y - handleSize / 2,
      handleSize,
      handleSize
    );
  }
}

/**
 * Get the positions of the 8 resize handles for a shape.
 */
export function getHandlePositions(
  shape: BaseShape,
  padding: number = 4
): Array<{ x: number; y: number; cursor: string }> {
  const x = shape.x - padding;
  const y = shape.y - padding;
  const w = shape.width + padding * 2;
  const h = shape.height + padding * 2;

  return [
    { x: x, y: y, cursor: 'nwse-resize' },           // top-left
    { x: x + w / 2, y: y, cursor: 'ns-resize' },      // top-center
    { x: x + w, y: y, cursor: 'nesw-resize' },         // top-right
    { x: x + w, y: y + h / 2, cursor: 'ew-resize' },  // middle-right
    { x: x + w, y: y + h, cursor: 'nwse-resize' },     // bottom-right
    { x: x + w / 2, y: y + h, cursor: 'ns-resize' },  // bottom-center
    { x: x, y: y + h, cursor: 'nesw-resize' },         // bottom-left
    { x: x, y: y + h / 2, cursor: 'ew-resize' },      // middle-left
  ];
}

/**
 * Main shape rendering dispatcher.
 */
export function renderShape(
  ctx: CanvasRenderingContext2D,
  shape: BaseShape
): void {
  ctx.save();
  ctx.globalAlpha = shape.opacity;

  if (shape instanceof Rectangle) {
    renderRectangle(ctx, shape);
  } else if (shape instanceof Ellipse) {
    renderEllipse(ctx, shape);
  } else if (shape instanceof Diamond) {
    renderDiamond(ctx, shape);
  } else if (shape instanceof TextShape) {
    renderText(ctx, shape);
  } else if (shape instanceof LineShape) {
    renderLine(ctx, shape);
  } else if (shape instanceof FreehandShape) {
    renderFreehand(ctx, shape);
  }

  ctx.restore();
}

/**
 * Render a rectangle shape.
 */
function renderRectangle(ctx: CanvasRenderingContext2D, shape: Rectangle): void {
  const { x, y, width, height, fill, stroke, strokeWidth, cornerRadius } = shape;
  const r = Math.min(cornerRadius, width / 2, height / 2);

  ctx.beginPath();
  if (r > 0) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r);
    ctx.lineTo(x + width, y + height - r);
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
    ctx.lineTo(x + r, y + height);
    ctx.arcTo(x, y + height, x, y + height - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
  } else {
    ctx.rect(x, y, width, height);
  }
  ctx.closePath();

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke && strokeWidth > 0) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

/**
 * Render an ellipse shape.
 */
function renderEllipse(ctx: CanvasRenderingContext2D, shape: Ellipse): void {
  const cx = shape.x + shape.width / 2;
  const cy = shape.y + shape.height / 2;
  const rx = shape.width / 2;
  const ry = shape.height / 2;

  ctx.beginPath();
  ctx.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2);
  ctx.closePath();

  if (shape.fill) {
    ctx.fillStyle = shape.fill;
    ctx.fill();
  }
  if (shape.stroke && shape.strokeWidth > 0) {
    ctx.strokeStyle = shape.stroke;
    ctx.lineWidth = shape.strokeWidth;
    ctx.stroke();
  }
}

/**
 * Render a diamond shape.
 */
function renderDiamond(ctx: CanvasRenderingContext2D, shape: Diamond): void {
  const cx = shape.x + shape.width / 2;
  const cy = shape.y + shape.height / 2;
  const hw = shape.width / 2;
  const hh = shape.height / 2;

  ctx.beginPath();
  ctx.moveTo(cx, cy - hh);       // top
  ctx.lineTo(cx + hw, cy);       // right
  ctx.lineTo(cx, cy + hh);       // bottom
  ctx.lineTo(cx - hw, cy);       // left
  ctx.closePath();

  if (shape.fill) {
    ctx.fillStyle = shape.fill;
    ctx.fill();
  }
  if (shape.stroke && shape.strokeWidth > 0) {
    ctx.strokeStyle = shape.stroke;
    ctx.lineWidth = shape.strokeWidth;
    ctx.stroke();
  }
}

/**
 * Render a text shape.
 */
function renderText(ctx: CanvasRenderingContext2D, shape: TextShape): void {
  if (!shape.text) return;

  ctx.font = `${shape.fontSize}px ${shape.fontFamily}`;
  ctx.fillStyle = shape.fill || '#000000';
  ctx.textAlign = shape.textAlign || 'left';
  ctx.textBaseline = 'top';

  // Handle multi-line text
  const lines = shape.text.split('\n');
  const lineHeight = shape.fontSize * 1.3;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], shape.x, shape.y + i * lineHeight);
  }

  // Draw text background if specified
  if (shape.showBackground) {
    const maxWidth = Math.max(...lines.map(l => ctx.measureText(l).width));
    const totalHeight = lines.length * lineHeight;
    ctx.fillStyle = shape.backgroundFill || '#ffffff';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(shape.x - 4, shape.y - 4, maxWidth + 8, totalHeight + 8);
    ctx.globalAlpha = 1;

    // Redraw text on top of background
    ctx.fillStyle = shape.fill || '#000000';
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], shape.x, shape.y + i * lineHeight);
    }
  }
}

/**
 * Render a line/connector shape.
 */
function renderLine(ctx: CanvasRenderingContext2D, shape: LineShape): void {
  const { x1, y1, x2, y2, stroke, strokeWidth, arrowHead } = shape;

  ctx.beginPath();
  ctx.moveTo(x1, y1);

  if (shape.curved && shape.controlPoints) {
    // Draw curved line using quadratic bezier
    ctx.quadraticCurveTo(
      shape.controlPoints.cpx,
      shape.controlPoints.cpy,
      x2,
      y2
    );
  } else {
    ctx.lineTo(x2, y2);
  }

  ctx.strokeStyle = stroke || '#000000';
  ctx.lineWidth = strokeWidth || 2;
  ctx.stroke();

  // Draw arrowhead at the end
  if (arrowHead) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLen = 12;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLen * Math.cos(angle - Math.PI / 6),
      y2 - headLen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x2 - headLen * Math.cos(angle + Math.PI / 6),
      y2 - headLen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = stroke || '#000000';
    ctx.fill();
  }

  // Draw label if present
  if (shape.label) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(shape.label, mx, my - 4);
  }
}

/**
 * Render a freehand drawing shape.
 */
function renderFreehand(ctx: CanvasRenderingContext2D, shape: FreehandShape): void {
  if (shape.points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(shape.points[0].x, shape.points[0].y);

  if (shape.smoothed && shape.smoothedPoints.length > 0) {
    // Draw smooth bezier curves
    for (let i = 1; i < shape.smoothedPoints.length; i++) {
      const prev = shape.smoothedPoints[i - 1];
      const curr = shape.smoothedPoints[i];
      ctx.quadraticCurveTo(prev.cpx, prev.cpy, curr.x, curr.y);
    }
  } else {
    // Draw raw line segments
    for (let i = 1; i < shape.points.length; i++) {
      ctx.lineTo(shape.points[i].x, shape.points[i].y);
    }
  }

  ctx.strokeStyle = shape.stroke || '#000000';
  ctx.lineWidth = shape.strokeWidth || 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}
