import type React from 'react';
import { Component } from 'react';
import '@styles/components/App.css';
import 'winbox/dist/css/winbox.min.css';
import Card from '@renderer/components/ui/Card/Card';
import { menuData } from '@renderer/data/menu-data';
import type { FuzzySearchResult, MenuItem } from '@renderer/types';

interface AppState {
  searchTerm: string;
}

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

class Main extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  render() {
    // Filter cards based on search term
    const filteredCards = menuData.filter((card: MenuItem, _index: number) => {
      const titleMatch = fuzzySearch(card.title, this.state.searchTerm).matches;
      return titleMatch;
    });

    return (
      <div className="App">
        <main className="App-main-no-navbar">
          <div className="search-container-no-navbar">
            <input
              type="text"
              className="search-input"
              placeholder="Search topics..."
              value={this.state.searchTerm}
              onChange={this.handleSearchChange}
            />
            <div className="cards-list">
              {filteredCards.length > 0 ? (
                filteredCards.map((card: MenuItem, index: number) => (
                  <Card
                    key={card.id || index}
                    id={card.id}
                    index={index}
                    title={card.title}
                    content={card.content}
                    searchTerm={this.state.searchTerm}
                  />
                ))
              ) : (
                <div className="no-results">No matching topics found</div>
              )}
            </div>
          </div>
        </main>
        <footer className="App-footer">
          <p>
            Get started by editing <code>src/components/Main/Main.tsx</code> and save to reload.
          </p>
        </footer>
      </div>
    );
  }
}

export default Main;
