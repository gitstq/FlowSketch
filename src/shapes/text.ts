/**
 * TextShape - Editable text element on the canvas.
 */
import { BaseShape } from './base';

export class TextShape extends BaseShape {
  public type = 'text';
  /** The text content */
  public text: string = '';
  /** Font size in pixels */
  public fontSize: number = 16;
  /** Font family name */
  public fontFamily: string = 'sans-serif';
  /** Text alignment: left, center, right */
  public textAlign: CanvasTextAlign = 'left';
  /** Whether to show a background behind the text */
  public showBackground: boolean = false;
  /** Background fill color */
  public backgroundFill: string = '#ffffff';

  constructor(
    x: number = 0,
    y: number = 0,
    text: string = 'Text'
  ) {
    super(x, y, 100, 30);
    this.text = text;
  }

  public containsPoint(px: number, py: number): boolean {
    return (
      px >= this.x &&
      px <= this.x + this.width &&
      py >= this.y &&
      py <= this.y + this.height
    );
  }

  /**
   * Recalculate width/height based on text content.
   * Requires a canvas context for measurement.
   */
  public measureText(ctx: CanvasRenderingContext2D): void {
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    const lines = this.text.split('\n');
    const lineHeight = this.fontSize * 1.3;
    let maxWidth = 0;
    for (const line of lines) {
      const m = ctx.measureText(line);
      if (m.width > maxWidth) maxWidth = m.width;
    }
    this.width = maxWidth + 8;
    this.height = lines.length * lineHeight + 8;
  }

  public clone(): TextShape {
    const t = new TextShape(this.x, this.y, this.text);
    t.id = this.id;
    t.width = this.width;
    t.height = this.height;
    t.fontSize = this.fontSize;
    t.fontFamily = this.fontFamily;
    t.textAlign = this.textAlign;
    t.fill = this.fill;
    t.stroke = this.stroke;
    t.strokeWidth = this.strokeWidth;
    t.opacity = this.opacity;
    t.showBackground = this.showBackground;
    t.backgroundFill = this.backgroundFill;
    return t;
  }

  public serialize(): Record<string, unknown> {
    return {
      ...super.serialize(),
      text: this.text,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      textAlign: this.textAlign,
      showBackground: this.showBackground,
      backgroundFill: this.backgroundFill,
    };
  }
}
