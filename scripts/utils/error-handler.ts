import { Logger } from './logger';

/**
 * Error handling utilities
 */

export class ErrorHandler {
  /**
   * Handles an error with proper logging and cleanup
   */
  static handleError(error: unknown, context: string = 'Unknown'): void {
    const errorMessage = this.formatError(error);
    
    Logger.error(`${context} - ${errorMessage}`);
    
    // Perform any necessary cleanup here
    this.performCleanup();
  }

  /**
   * Formats an error for consistent logging
   */
  private static formatError(error: unknown): string {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}`;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return `Unknown error: ${JSON.stringify(error)}`;
  }

  /**
   * Performs cleanup operations when an error occurs
   */
  private static performCleanup(): void {
    // Add any cleanup logic here if needed
    Logger.debug('Performed error cleanup operations');
  }

  /**
   * Wraps an async function with error handling
   */
  static async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, context);
      return null;
    }
  }
}