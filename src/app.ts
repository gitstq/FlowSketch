/**
 * App - Main application class.
 * Initializes all components, wires up events, and manages the application lifecycle.
 */
import { Canvas } from './core/canvas';
import { Camera } from './core/camera';
import { ToolManager } from './tools/tool-manager';
import { SelectTool } from './tools/select-tool';
import { DrawTool } from './tools/draw-tool';
import { TextTool } from './tools/text-tool';
import { LineTool } from './tools/line-tool';
import { FreehandTool } from './tools/freehand-tool';
import { Toolbar } from './ui/toolbar';
import { Sidebar } from './ui/sidebar';
import { PropertiesPanel } from './ui/properties';
import { Minimap } from './ui/minimap';
import { CodeEditor } from './editor/code-editor';
import { PngExport } from './export/png-export';
import { SvgExport } from './export/svg-export';
import { JsonExport } from './export/json-export';
import { LocalStorage } from './storage/local-storage';
import { BaseShape } from './shapes/base';
import { LineShape } from './shapes/line';
import { FreehandShape } from './shapes/freehand';

export class App {
  /** Main canvas engine */
  public canvas: Canvas;
  /** Tool manager */
  public toolManager: ToolManager;
  /** Toolbar UI */
  public toolbar: Toolbar;
  /** Sidebar UI */
  public sidebar: Sidebar;
  /** Properties panel UI */
  public propertiesPanel: PropertiesPanel;
  /** Minimap UI */
  public minimap: Minimap;
  /** Code editor panel */
  public codeEditor: CodeEditor;
  /** Local storage persistence */
  public storage: LocalStorage;

  /** Undo/redo history */
  private undoStack: Array<{ shapes: BaseShape[]; camera: { x: number; y: number; zoom: number } }> = [];
  private redoStack: Array<{ shapes: BaseShape[]; camera: { x: number; y: number; zoom: number } }> = [];
  private maxHistory = 50;
  private lastSaveState: string = '';

  /** Dark mode state */
  private darkMode: boolean = false;

  /** Minimap update throttle */
  private minimapDirty = false;

  constructor() {
    // Initialize canvas
    const canvasEl = document.getElementById('main-canvas') as HTMLCanvasElement;
    this.canvas = new Canvas(canvasEl);

    // Initialize tool manager
    this.toolManager = new ToolManager(this.canvas);
    this.registerTools();

    // Initialize UI components
    const toolbarEl = document.getElementById('toolbar')!;
    this.toolbar = new Toolbar(toolbarEl, this.canvas, this.toolManager);
    this.setupToolbarCallbacks();

    const sidebarEl = document.getElementById('sidebar')!;
    this.sidebar = new Sidebar(sidebarEl, this.canvas);

    const propertiesEl = document.getElementById('properties-panel')!;
    this.propertiesPanel = new PropertiesPanel(propertiesEl, this.canvas);

    const minimapEl = document.getElementById('minimap')!;
    this.minimap = new Minimap(minimapEl, this.canvas);

    this.codeEditor = new CodeEditor(this.canvas);

    // Initialize storage
    this.storage = new LocalStorage(this.canvas);

    // Set up event listeners
    this.setupCanvasEvents();
    this.setupKeyboardShortcuts();
    this.setupDragAndDrop();
    this.setupSelectionSync();

    // Set default tool
    this.toolManager.setTool('select');

    // Load auto-saved state
    const hasAutoSave = this.storage.loadAutoSave();
    if (hasAutoSave) {
      this.saveState();
    }

    // Start auto-save
    this.storage.startAutoSave();

    // Start minimap update loop
    this.startMinimapLoop();

    // Handle window resize
    window.addEventListener('resize', () => {
      this.canvas.resize();
      this.canvas.dirty = true;
    });
  }

  /**
   * Register all tools with the tool manager.
   */
  private registerTools(): void {
    this.toolManager.registerTool('select', new SelectTool());
    this.toolManager.registerTool('draw', new DrawTool('rectangle'));
    this.toolManager.registerTool('text', new TextTool());
    this.toolManager.registerTool('line', new LineTool());
    this.toolManager.registerTool('freehand', new FreehandTool());
  }

  /**
   * Set up toolbar button callbacks.
   */
  private setupToolbarCallbacks(): void {
    this.toolbar.onUndo = () => this.undo();
    this.toolbar.onRedo = () => this.redo();
    this.toolbar.onExportPNG = () => PngExport.downloadPNG(this.canvas);
    this.toolbar.onExportSVG = () => SvgExport.downloadSVG(this.canvas);
    this.toolbar.onExportJSON = () => {
      JsonExport.saveToFile(this.canvas);
      this.storage.addRecentFile('diagram.json');
    };
    this.toolbar.onImportJSON = async () => {
      const state = await JsonExport.loadFromFile();
      if (state) {
        JsonExport.deserialize(this.canvas, state);
        this.saveState();
        this.storage.autoSave();
      }
    };
    this.toolbar.onToggleTheme = () => this.toggleTheme();
    this.toolbar.onToggleCodePanel = () => this.codeEditor.toggle();
    this.toolbar.onClearCanvas = () => {
      if (confirm('Clear all shapes?')) {
        this.canvas.clear();
        this.saveState();
        this.canvas.dirty = true;
      }
    };

    // Update toolbar when tool changes
    this.toolManager.onToolChange = (toolName: string) => {
      // Highlight the correct tool button
      const btns = document.querySelectorAll('.tool-btn');
      btns.forEach(btn => btn.classList.remove('active'));

      let selector = `[data-tool="${toolName}"]`;
      if (toolName === 'draw') {
        // Find the currently active draw variant
        const drawTool = this.toolManager.activeTool as DrawTool;
        if (drawTool) {
          selector = `[data-tool="draw-${drawTool.shapeType}"]`;
        }
      }
      const activeBtn = document.querySelector(selector);
      if (activeBtn) activeBtn.classList.add('active');
    };
  }

  /**
   * Set up canvas mouse event listeners.
   */
  private setupCanvasEvents(): void {
    const canvasEl = this.canvas.canvas;

    canvasEl.addEventListener('mousedown', (e) => {
      this.toolManager.onMouseDown(e);
    });

    canvasEl.addEventListener('mousemove', (e) => {
      this.toolManager.onMouseMove(e);
      this.minimapDirty = true;
    });

    canvasEl.addEventListener('mouseup', (e) => {
      this.toolManager.onMouseUp(e);
      // Save state after mouse up (for undo/redo)
      this.saveState();
    });

    canvasEl.addEventListener('wheel', (e) => {
      this.toolManager.onWheel(e);
      this.toolbar.updateZoomLabel();
      this.minimapDirty = true;
    }, { passive: false });

    // Prevent context menu on canvas
    canvasEl.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /**
   * Set up global keyboard shortcuts.
   */
  private setupKeyboardShortcuts(): void {
    window.addEventListener('keydown', (e) => {
      // Don't handle shortcuts when typing in inputs
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Tool shortcuts
      switch (e.key.toLowerCase()) {
        case 'v':
          this.toolManager.setTool('select');
          break;
        case 'r':
          this.toolManager.setTool('draw');
          (this.toolManager.activeTool as DrawTool).shapeType = 'rectangle';
          this.toolManager.onToolChange?.('draw');
          break;
        case 'e':
          this.toolManager.setTool('draw');
          (this.toolManager.activeTool as DrawTool).shapeType = 'ellipse';
          this.toolManager.onToolChange?.('draw');
          break;
        case 'd':
          if (!e.ctrlKey && !e.metaKey) {
            this.toolManager.setTool('draw');
            (this.toolManager.activeTool as DrawTool).shapeType = 'diamond';
            this.toolManager.onToolChange?.('draw');
          }
          break;
        case 'l':
          this.toolManager.setTool('line');
          break;
        case 't':
          this.toolManager.setTool('text');
          break;
        case 'f':
          this.toolManager.setTool('freehand');
          break;
      }

      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          this.redo();
        } else {
          this.undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        this.redo();
      }

      // Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        this.copySelected();
      }

      // Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        this.paste();
      }

      // Select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        this.canvas.selectAll();
      }

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        this.saveState();
      }

      // Escape - deselect
      if (e.key === 'Escape') {
        this.canvas.clearSelection();
        this.canvas.dirty = true;
      }

      // Delegate to active tool
      this.toolManager.onKeyDown(e);
    });

    window.addEventListener('keyup', (e) => {
      this.toolManager.onKeyUp(e);
    });
  }

  /**
   * Set up drag-and-drop from sidebar to canvas.
   */
  private setupDragAndDrop(): void {
    const container = document.getElementById('canvas-container')!;

    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'copy';
    });

    container.addEventListener('drop', (e) => {
      e.preventDefault();
      this.sidebar.handleDrop(e);
      this.saveState();
    });
  }

  /**
   * Sync selection state with the properties panel and toolbar.
   */
  private setupSelectionSync(): void {
    // Poll for selection changes (simple approach)
    let lastSelectionCount = 0;
    let lastSelectionIds = '';

    const checkSelection = () => {
      const count = this.canvas.selectedShapes.length;
      const ids = this.canvas.selectedShapes.map(s => s.id).join(',');

      if (count !== lastSelectionCount || ids !== lastSelectionIds) {
        lastSelectionCount = count;
        lastSelectionIds = ids;
        this.propertiesPanel.update();
        this.toolbar.updateFromSelection();
      }

      requestAnimationFrame(checkSelection);
    };

    requestAnimationFrame(checkSelection);
  }

  /**
   * Save current state to undo stack.
   */
  private saveState(): void {
    const state = this.captureState();
    const stateJson = JSON.stringify(state);

    // Only save if state has changed
    if (stateJson === this.lastSaveState) return;

    this.undoStack.push(state);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = [];
    this.lastSaveState = stateJson;
  }

  /**
   * Capture the current canvas state.
   */
  private captureState(): { shapes: BaseShape[]; camera: { x: number; y: number; zoom: number } } {
    // Deep clone shapes
    const clonedShapes = this.canvas.shapes.map(s => s.clone());
    return {
      shapes: clonedShapes,
      camera: {
        x: this.canvas.camera.x,
        y: this.canvas.camera.y,
        zoom: this.canvas.camera.zoom,
      },
    };
  }

  /**
   * Undo the last action.
   */
  private undo(): void {
    if (this.undoStack.length === 0) return;

    // Save current state to redo stack
    const currentState = this.captureState();
    this.redoStack.push(currentState);

    // Restore previous state
    const prevState = this.undoStack.pop()!;
    this.restoreState(prevState);
  }

  /**
   * Redo the last undone action.
   */
  private redo(): void {
    if (this.redoStack.length === 0) return;

    // Save current state to undo stack
    const currentState = this.captureState();
    this.undoStack.push(currentState);

    // Restore next state
    const nextState = this.redoStack.pop()!;
    this.restoreState(nextState);
  }

  /**
   * Restore a captured state.
   */
  private restoreState(state: { shapes: BaseShape[]; camera: { x: number; y: number; zoom: number } }): void {
    this.canvas.shapes = state.shapes.map(s => s.clone());
    this.canvas.selectedShapes = [];
    this.canvas.camera.x = state.camera.x;
    this.canvas.camera.y = state.camera.y;
    this.canvas.camera.zoom = state.camera.zoom;
    this.canvas.dirty = true;
    this.toolbar.updateZoomLabel();
    this.lastSaveState = JSON.stringify(state);
  }

  /**
   * Copy selected shapes to clipboard.
   */
  private copySelected(): void {
    if (this.canvas.selectedShapes.length === 0) return;

    const serialized = this.canvas.selectedShapes.map(s => s.serialize());
    try {
      // Use ClipboardItem for modern browsers
      navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([JSON.stringify(serialized)], { type: 'text/plain' }),
        }),
      ]).catch(() => {
        // Fallback: store in a variable
        (window as any).__flowsketch_clipboard = serialized;
      });
    } catch {
      (window as any).__flowsketch_clipboard = serialized;
    }
  }

  /**
   * Paste shapes from clipboard.
   */
  private paste(): void {
    const doPaste = (serialized: Record<string, unknown>[]) => {
      this.saveState();
      const offset = 20;

      for (const data of serialized) {
        const shape = this.deserializeShape(data);
        if (shape) {
          shape.x += offset;
          shape.y += offset;
          shape.id = `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          this.canvas.addShape(shape);
        }
      }
      this.canvas.dirty = true;
    };

    // Try clipboard API first
    try {
      navigator.clipboard.readText().then(text => {
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) doPaste(data);
        } catch {
          // Not valid JSON, try fallback
          const fallback = (window as any).__flowsketch_clipboard;
          if (fallback) doPaste(fallback);
        }
      }).catch(() => {
        const fallback = (window as any).__flowsketch_clipboard;
        if (fallback) doPaste(fallback);
      });
    } catch {
      const fallback = (window as any).__flowsketch_clipboard;
      if (fallback) doPaste(fallback);
    }
  }

  /**
   * Deserialize a shape from serialized data.
   */
  private deserializeShape(data: Record<string, unknown>): BaseShape | null {
    return JsonExport.deserializeShape(data);
  }

  /**
   * Toggle dark/light theme.
   */
  private toggleTheme(): void {
    this.darkMode = !this.darkMode;
    this.canvas.darkMode = this.darkMode;

    if (this.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    this.canvas.dirty = true;
  }

  /**
   * Start the minimap update loop.
   */
  private startMinimapLoop(): void {
    const updateMinimap = () => {
      if (this.minimapDirty) {
        this.minimap.update();
        this.minimapDirty = false;
      }
      requestAnimationFrame(updateMinimap);
    };
    requestAnimationFrame(updateMinimap);
  }
}
