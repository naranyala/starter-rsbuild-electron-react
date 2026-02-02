// Shared TypeScript interfaces for the application

export interface MenuItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface CardProps {
  id?: string;
  title: string;
  content: string;
  index: number;
  onClick?: (id: string, title: string) => void;
}

export interface Theme {
  name: string;
  bg: string;
  color: string;
}

// Content section types for use-cases
export interface ContentSection {
  type: 'paragraph' | 'list' | 'heading' | 'code' | 'custom';
  content: string;
  items?: string[];
  level?: number;
}

export interface WindowConfig {
  id: string;
  title: string;
  dimensions: {
    width: string;
    height: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
  };
  theme: WindowTheme;
  className: string;
  border: number;
  position?: {
    x: number | 'center';
    y: number | 'center';
  };
  modal?: boolean;
  additionalOptions?: Record<string, unknown>;
}

export interface UseCase {
  metadata: {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    searchableTerms: string[];
  };
  windowConfig: WindowConfig;
  generateContent: () => ContentSection[];
  generateTheme?: () => { bg: string; color: string };
  onWindowOpen?: () => void;
  onWindowClose?: () => void;
}

export interface WindowTheme {
  name: string;
  bg: string;
  color: string;
}

export interface UseCase {
  metadata: {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    searchableTerms: string[];
  };
  windowConfig: WindowConfig;
  generateContent: () => ContentSection[];
}
