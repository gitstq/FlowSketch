/**
 * CodeParser - Parses a simple diagram syntax into shapes.
 *
 * Supported syntax:
 *   [Text]          -> Rectangle
 *   (Text)          -> Ellipse (rounded)
 *   {Text}          -> Diamond (decision)
 *   [[Text]]        -> Text shape
 *
 *   [A] --> [B]     -> Arrow from A to B
 *   [A] -->|Label| [B]  -> Labeled arrow
 *   [A] --- [B]     -> Line without arrow
 *
 *   Nodes on separate lines are auto-laid out left-to-right.
 */
import { Rectangle } from '../shapes/rectangle';
import { Ellipse } from '../shapes/ellipse';
import { Diamond } from '../shapes/diamond';
import { TextShape } from '../shapes/text';
import { LineShape } from '../shapes/line';
import { BaseShape } from '../shapes/base';

interface ParsedNode {
  id: string;
  label: string;
  type: 'rectangle' | 'ellipse' | 'diamond' | 'text';
}

interface ParsedEdge {
  from: string;
  to: string;
  label: string;
  hasArrow: boolean;
}

export interface ParseResult {
  nodes: ParsedNode[];
  edges: ParsedEdge[];
}

export class CodeParser {
  /**
   * Parse diagram code into nodes and edges.
   */
  public parse(code: string): ParseResult {
    const nodes: ParsedNode[] = [];
    const edges: ParsedEdge[] = [];
    const nodeMap = new Map<string, ParsedNode>();

    const lines = code.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    for (const line of lines) {
      // Try to parse as an edge (contains --> or ---)
      const arrowMatch = line.match(/^(.+?)\s*-->\|([^|]*)\|\s*(.+)$/);
      const arrowSimpleMatch = line.match(/^(.+?)\s*-->\s*(.+)$/);
      const lineMatch = line.match(/^(.+?)\s*---\s*(.+)$/);

      if (arrowMatch) {
        const from = this.parseNodeRef(arrowMatch[1].trim());
        const to = this.parseNodeRef(arrowMatch[3].trim());
        const label = arrowMatch[2].trim();
        this.addNode(from, nodes, nodeMap);
        this.addNode(to, nodes, nodeMap);
        edges.push({ from: from.id, to: to.id, label, hasArrow: true });
      } else if (arrowSimpleMatch) {
        const from = this.parseNodeRef(arrowSimpleMatch[1].trim());
        const to = this.parseNodeRef(arrowSimpleMatch[2].trim());
        this.addNode(from, nodes, nodeMap);
        this.addNode(to, nodes, nodeMap);
        edges.push({ from: from.id, to: to.id, label: '', hasArrow: true });
      } else if (lineMatch) {
        const from = this.parseNodeRef(lineMatch[1].trim());
        const to = this.parseNodeRef(lineMatch[2].trim());
        this.addNode(from, nodes, nodeMap);
        this.addNode(to, nodes, nodeMap);
        edges.push({ from: from.id, to: to.id, label: '', hasArrow: false });
      } else {
        // Parse as standalone node
        const node = this.parseNodeRef(line);
        this.addNode(node, nodes, nodeMap);
      }
    }

    return { nodes, edges };
  }

  /**
   * Parse a node reference like [Text], (Text), {Text}, [[Text]].
   */
  private parseNodeRef(text: string): ParsedNode {
    // Double brackets: [[Text]] -> text shape
    const doubleMatch = text.match(/^\[\[(.+)\]\]$/);
    if (doubleMatch) {
      return { id: doubleMatch[1], label: doubleMatch[1], type: 'text' };
    }

    // Square brackets: [Text] -> rectangle
    const squareMatch = text.match(/^\[(.+)\]$/);
    if (squareMatch) {
      return { id: squareMatch[1], label: squareMatch[1], type: 'rectangle' };
    }

    // Parentheses: (Text) -> ellipse
    const parenMatch = text.match(/^\((.+)\)$/);
    if (parenMatch) {
      return { id: parenMatch[1], label: parenMatch[1], type: 'ellipse' };
    }

    // Curly braces: {Text} -> diamond
    const curlyMatch = text.match(/^\{(.+)\}$/);
    if (curlyMatch) {
      return { id: curlyMatch[1], label: curlyMatch[1], type: 'diamond' };
    }

    // Default: treat as rectangle
    return { id: text, label: text, type: 'rectangle' };
  }

  /**
   * Add a node to the list if it doesn't already exist.
   */
  private addNode(
    node: ParsedNode,
    nodes: ParsedNode[],
    nodeMap: Map<string, ParsedNode>
  ): void {
    if (!nodeMap.has(node.id)) {
      nodes.push(node);
      nodeMap.set(node.id, node);
    }
  }

  /**
   * Convert parse result into actual shapes with auto-layout.
   */
  public toShapes(result: ParseResult): BaseShape[] {
    const shapes: BaseShape[] = [];
    const shapeMap = new Map<string, BaseShape>();

    const nodeWidth = 120;
    const nodeHeight = 60;
    const hGap = 80;
    const vGap = 60;

    // Simple auto-layout: arrange nodes in a grid
    // First, determine layers using topological sort (BFS from root)
    const inDegree = new Map<string, number>();
    const adjacency = new Map<string, string[]>();

    for (const node of result.nodes) {
      inDegree.set(node.id, 0);
      adjacency.set(node.id, []);
    }

    for (const edge of result.edges) {
      adjacency.get(edge.from)?.push(edge.to);
      inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
    }

    // BFS to assign layers
    const layers: string[][] = [];
    const visited = new Set<string>();
    let queue = result.nodes
      .filter(n => (inDegree.get(n.id) || 0) === 0)
      .map(n => n.id);

    // If no root nodes (cycle), just use all nodes
    if (queue.length === 0 && result.nodes.length > 0) {
      queue = [result.nodes[0].id];
    }

    while (queue.length > 0) {
      layers.push([...queue]);
      for (const id of queue) visited.add(id);

      const nextQueue: string[] = [];
      for (const id of queue) {
        for (const neighbor of adjacency.get(id) || []) {
          if (!visited.has(neighbor)) {
            nextQueue.push(neighbor);
          }
        }
      }
      queue = nextQueue;
    }

    // Add any unvisited nodes to the last layer
    for (const node of result.nodes) {
      if (!visited.has(node.id)) {
        if (layers.length === 0) layers.push([]);
        layers[layers.length - 1].push(node.id);
      }
    }

    // Position nodes
    const startX = 100;
    const startY = 100;

    for (let layerIdx = 0; layerIdx < layers.length; layerIdx++) {
      const layer = layers[layerIdx];
      const layerHeight = layer.length * (nodeHeight + vGap) - vGap;
      const layerStartY = startY + (Math.max(...layers.map(l => l.length)) * (nodeHeight + vGap) - vGap - layerHeight) / 2;

      for (let nodeIdx = 0; nodeIdx < layer.length; nodeIdx++) {
        const nodeId = layer[nodeIdx];
        const node = result.nodes.find(n => n.id === nodeId);
        if (!node) continue;

        const x = startX + layerIdx * (nodeWidth + hGap);
        const y = layerStartY + nodeIdx * (nodeHeight + vGap);

        let shape: BaseShape;
        switch (node.type) {
          case 'ellipse':
            shape = new Ellipse(x, y, nodeWidth, nodeHeight);
            break;
          case 'diamond':
            shape = new Diamond(x, y, nodeWidth, nodeHeight);
            break;
          case 'text':
            shape = new TextShape(x + 10, y + 15, node.label);
            shape.width = nodeWidth;
            shape.height = nodeHeight;
            break;
          case 'rectangle':
          default:
            shape = new Rectangle(x, y, nodeWidth, nodeHeight);
            break;
        }

        // Add text label inside shape (except text shapes which already have it)
        if (node.type !== 'text') {
          const textShape = new TextShape(x + 10, y + nodeHeight / 2 - 8, node.label);
          textShape.fontSize = 14;
          textShape.fill = '#333333';
          shapes.push(textShape);
        }

        shapes.push(shape);
        shapeMap.set(nodeId, shape);
      }
    }

    // Create edges
    for (const edge of result.edges) {
      const fromShape = shapeMap.get(edge.from);
      const toShape = shapeMap.get(edge.to);
      if (!fromShape || !toShape) continue;

      const x1 = fromShape.x + fromShape.width;
      const y1 = fromShape.y + fromShape.height / 2;
      const x2 = toShape.x;
      const y2 = toShape.y + toShape.height / 2;

      const line = new LineShape(x1, y1, x2, y2);
      line.arrowHead = edge.hasArrow;
      line.label = edge.label;
      line.sourceId = fromShape.id;
      line.targetId = toShape.id;
      shapes.push(line);
    }

    return shapes;
  }
}
