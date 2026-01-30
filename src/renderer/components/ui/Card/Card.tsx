import type { CardProps, FuzzySearchResult } from '@renderer/types';
import { createWindowFromMenuItem, type UseCase, useCaseRegistry } from '@renderer/use-cases';
import { Component } from 'react';

// Simple fuzzy search function
const fuzzySearch = (text: string, query: string): FuzzySearchResult => {
  if (!query) return { matches: true, highlightedText: text };

  const lowerText = text.toLowerCase();
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

  matchFound = queryIndex === lowerQuery.length;

  return { matches: matchFound, highlightedText };
};

interface CardState {
  useCase: UseCase | null;
}

class Card extends Component<CardProps, CardState> {
  constructor(props: CardProps) {
    super(props);
    this.state = {
      useCase: null,
    };
  }

  componentDidMount() {
    // Look up the use-case from the registry based on the card id
    const { id } = this.props;
    if (id) {
      const useCase = useCaseRegistry.get(id);
      if (useCase) {
        this.setState({ useCase });
      }
    }
  }

  handleCardClick = () => {
    const { id, title, content } = this.props;
    const { useCase } = this.state;

    if (useCase) {
      // Use the modular use-case system
      createWindowFromMenuItem(id || '', title);
    } else {
      // Fallback to legacy behavior
      createWindowFromMenuItem(id || '', title, content);
    }
  };

  render() {
    const { title, searchTerm } = this.props;
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
