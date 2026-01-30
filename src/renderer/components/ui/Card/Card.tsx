import { Component } from 'react';
import WinBox from 'winbox/src/js/winbox';
import { generateTheme, generateWindowContent } from '../../../lib/window-generator';
import type { CardProps, FuzzySearchResult } from '../../../types/index';

// Simple fuzzy search function
const fuzzySearch = (text: string, query: string): FuzzySearchResult => {
  if (!query) return { matches: true, highlightedText: text };

  const _lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  let matchFound = true;
  let highlightedText = '';
  let queryIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const lowerChar = char.toLowerCase();

    if (queryIndex < lowerQuery.length && lowerChar === lowerQuery[queryIndex]) {
      highlightedText += `<mark>${char}</mark>`;
      queryIndex++;
    } else {
      highlightedText += char;
    }
  }

  // Check if all query characters were found in sequence
  matchFound = queryIndex === lowerQuery.length;

  return { matches: matchFound, highlightedText };
};

class Card extends Component<CardProps> {
  handleCardClick = () => {
    const { title } = this.props;

    // Generate dynamic content and theme based on the title
    const dynamicContent = generateWindowContent(title);
    const windowTheme = generateTheme(title);

    // Create a WinBox window with the generated content
    const winbox = new WinBox({
      title: title,
      html: `<div class="winbox-content"><h3 style="color: ${windowTheme.color};">${title}</h3><div style="color: ${windowTheme.color};" class="winbox-dynamic-content">Loading content...</div></div>`,
      width: '500px',
      height: '400px',
      x: 'center',
      y: 'center',
      class: 'modern',
      background: windowTheme.bg,
      border: 4,
    });

    // Set the content after the window is created using WinBox's body property
    setTimeout(() => {
      if (winbox?.body) {
        const contentDiv = winbox.body.querySelector('.winbox-dynamic-content');
        if (contentDiv) {
          contentDiv.innerHTML = dynamicContent;
        } else {
          // If we can't find the specific div, replace all content in the body
          winbox.body.innerHTML = `<div class="winbox-content"><h3 style="color: ${windowTheme.color};">${title}</h3><div style="color: ${windowTheme.color};">${dynamicContent}</div></div>`;
        }
      }
    }, 10);
  };

  render() {
    const { title, searchTerm } = this.props;

    // Process title for highlighting
    const processedTitle = fuzzySearch(title, searchTerm);

    return (
      <button
        type="button"
        className="simple-card"
        onClick={this.handleCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleCardClick();
          }
        }}
        tabIndex={0}
      >
        <h3
          className="simple-card-title"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Generated content is safe as it comes from our internal data
          dangerouslySetInnerHTML={{
            __html: processedTitle.matches ? processedTitle.highlightedText : title,
          }}
        />
      </button>
    );
  }
}

export default Card;
