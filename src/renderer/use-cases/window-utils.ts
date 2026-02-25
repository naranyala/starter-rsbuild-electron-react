import type { ContentSection } from '../types';

export function contentSectionsToHtml(sections: ContentSection[] | string): string {
  if (typeof sections === 'string') {
    return sections;
  }

  return sections
    .map((section) => {
      switch (section.type) {
        case 'heading': {
          const level = section.level || 3;
          return `<h${level}>${section.content}</h${level}>`;
        }
        case 'paragraph':
          return `<p>${section.content}</p>`;
        case 'list': {
          const items = section.items?.map((item) => `<li>${item}</li>`).join('') || '';
          return `<h4>${section.content}</h4><ul>${items}</ul>`;
        }
        case 'custom':
          return section.content;
        default:
          return `<p>${section.content}</p>`;
      }
    })
    .join('');
}

export interface ThemeColors {
  bg: string;
  color: string;
}

const DARK_THEMES: ThemeColors[] = [
  { bg: '#2d2d2d', color: '#e0e0e0' },
  { bg: '#1a1a1a', color: '#e0e0e0' },
  { bg: '#252525', color: '#e0e0e0' },
  { bg: '#3a3a3a', color: '#ffffff' },
  { bg: '#202020', color: '#f0f0f0' },
  { bg: '#333333', color: '#dcdcdc' },
  { bg: '#282828', color: '#e8e8e8' },
  { bg: '#1e1e1e', color: '#f5f5f5' },
  { bg: '#2b2b2b', color: '#eaeaea' },
  { bg: '#222222', color: '#ededed' },
];

const LIGHT_THEMES: ThemeColors[] = [
  { bg: '#ffffff', color: '#333333' },
  { bg: '#f5f5f5', color: '#444444' },
  { bg: '#fafafa', color: '#222222' },
  { bg: '#f0f0f0', color: '#1a1a1a' },
  { bg: '#f8f8f8', color: '#2d2d2d' },
];

export function generateDarkTheme(title: string): ThemeColors {
  let hash = 0;
  const lowerTitle = title.toLowerCase();

  for (let i = 0; i < lowerTitle.length; i++) {
    hash = lowerTitle.charCodeAt(i) + ((hash << 5) - hash);
  }

  return DARK_THEMES[Math.abs(hash) % DARK_THEMES.length];
}

export function generateLightTheme(title: string): ThemeColors {
  let hash = 0;
  const lowerTitle = title.toLowerCase();

  for (let i = 0; i < lowerTitle.length; i++) {
    hash = lowerTitle.charCodeAt(i) + ((hash << 5) - hash);
  }

  return LIGHT_THEMES[Math.abs(hash) % LIGHT_THEMES.length];
}
