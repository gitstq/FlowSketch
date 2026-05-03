/**
 * LocalStorage - Auto-save and persistence using localStorage.
 */
import { Canvas } from '../core/canvas';
import { JsonExport, ProjectState } from '../export/json-export';

/** localStorage key for auto-save */
const AUTO_SAVE_KEY = 'flowsketch_autosave';
/** localStorage key for recent files list */
const RECENT_FILES_KEY = 'flowsketch_recent_files';
/** Maximum number of recent files to track */
const MAX_RECENT_FILES = 5;
/** Auto-save interval in milliseconds */
const AUTO_SAVE_INTERVAL = 30000;

export class LocalStorage {
  private canvas: Canvas;
  private autoSaveTimer: number | null = null;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  /**
   * Start the auto-save timer.
   */
  public startAutoSave(): void {
    this.stopAutoSave();
    this.autoSaveTimer = window.setInterval(() => {
      this.autoSave();
    }, AUTO_SAVE_INTERVAL);
  }

  /**
   * Stop the auto-save timer.
   */
  public stopAutoSave(): void {
    if (this.autoSaveTimer !== null) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * Manually save the current state to localStorage.
   */
  public autoSave(): void {
    try {
      const state = JsonExport.serialize(this.canvas);
      const json = JSON.stringify(state);
      localStorage.setItem(AUTO_SAVE_KEY, json);
    } catch (err) {
      console.warn('Auto-save failed:', err);
    }
  }

  /**
   * Load the auto-saved state from localStorage.
   * Returns true if a saved state was found and restored.
   */
  public loadAutoSave(): boolean {
    try {
      const json = localStorage.getItem(AUTO_SAVE_KEY);
      if (!json) return false;

      const state = JSON.parse(json) as ProjectState;
      JsonExport.deserialize(this.canvas, state);
      return true;
    } catch (err) {
      console.warn('Failed to load auto-save:', err);
      return false;
    }
  }

  /**
   * Clear the auto-saved state.
   */
  public clearAutoSave(): void {
    localStorage.removeItem(AUTO_SAVE_KEY);
  }

  /**
   * Add a file to the recent files list.
   */
  public addRecentFile(filename: string): void {
    try {
      let recent: string[] = JSON.parse(
        localStorage.getItem(RECENT_FILES_KEY) || '[]'
      );
      // Remove duplicate
      recent = recent.filter(f => f !== filename);
      // Add to front
      recent.unshift(filename);
      // Limit to max
      recent = recent.slice(0, MAX_RECENT_FILES);
      localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(recent));
    } catch {
      // Ignore errors
    }
  }

  /**
   * Get the list of recent files.
   */
  public getRecentFiles(): string[] {
    try {
      return JSON.parse(localStorage.getItem(RECENT_FILES_KEY) || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Clear the recent files list.
   */
  public clearRecentFiles(): void {
    localStorage.removeItem(RECENT_FILES_KEY);
  }
}
