// Shared TypeScript interfaces for the application

export interface MenuItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface FuzzySearchResult {
  matches: boolean;
  highlightedText: string;
}

export interface CardProps {
  id?: string;
  title: string;
  content: string;
  index: number;
  searchTerm: string;
}

export interface Theme {
  name: string;
  bg: string;
  color: string;
}
