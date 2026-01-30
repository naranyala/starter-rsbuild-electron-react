// Base types for modular window use-cases
// Defines the structure for window configuration and content generation

export interface WindowTheme {
  name: string;
  bg: string;
  color: string;
}

export interface WindowDimensions {
  width: string;
  height: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
}

export interface WindowPosition {
  x: string | number;
  y: string | number;
}

export interface WindowConfig {
  id: string;
  title: string;
  dimensions: WindowDimensions;
  position?: WindowPosition;
  theme: WindowTheme;
  className?: string;
  border?: number;
  modal?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: WinBox specific options
  additionalOptions?: Record<string, any>;
}

export interface ContentSection {
  type: 'paragraph' | 'heading' | 'list' | 'custom';
  content: string;
  items?: string[]; // For list type
  level?: number; // For heading type (h1, h2, h3, etc.)
}

export interface UseCaseMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  searchableTerms: string[]; // Additional terms for fuzzy search
}

export interface UseCase {
  metadata: UseCaseMetadata;
  windowConfig: WindowConfig;
  generateContent: () => ContentSection[] | string;
  generateTheme?: () => WindowTheme;
  onWindowOpen?: () => void;
  onWindowClose?: () => void;
}

// Registry type for storing use-cases
export type UseCaseRegistry = Map<string, UseCase>;

// Factory function type for creating window content
export type ContentGenerator = (title: string, context?: Record<string, unknown>) => string;
