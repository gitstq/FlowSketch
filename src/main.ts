/**
 * Main entry point for FlowSketch.
 * Initializes the application when the DOM is ready.
 */
import { App } from './app';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    const app = new App();
    console.log('FlowSketch initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize FlowSketch:', err);
  }
});
