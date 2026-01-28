import React, { Component } from 'react';
import './App.css';
import 'winbox/dist/css/winbox.min.css';
import WinBox from 'winbox/src/js/winbox';
import { menuData } from '../lib/renderer/menu-data';
import { generateTheme, generateWindowContent } from '../lib/renderer/window-generator';

// Simple fuzzy search function
const fuzzySearch = (text, query) => {
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

  // Check if all query characters were found in sequence
  matchFound = queryIndex === lowerQuery.length;

  return { matches: matchFound, highlightedText };
};

// Card component (with only title)
class Card extends Component {
  handleCardClick = () => {
    const { title, content, index } = this.props;

    // Define different themes for variety
    const themes = [
      { name: 'blue', bg: '#4a6cf7', color: 'white' },
      { name: 'green', bg: '#4ade80', color: 'black' },
      { name: 'purple', bg: '#a78bfa', color: 'white' },
      { name: 'red', bg: '#f87171', color: 'white' },
      { name: 'yellow', bg: '#fbbf24', color: 'black' },
      { name: 'indigo', bg: '#6366f1', color: 'white' },
    ];

    // Select a theme based on the index to have consistent colors
    const theme = themes[index % themes.length];

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
      if (winbox && winbox.body) {
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
      <div className="simple-card" onClick={this.handleCardClick}>
        <h3
          className="simple-card-title"
          dangerouslySetInnerHTML={{
            __html: processedTitle.matches ? processedTitle.highlightedText : title,
          }}
        />
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  handleSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  render() {
    // Filter cards based on search term
    const filteredCards = menuData.filter((card, index) => {
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
                filteredCards.map((card, index) => (
                  <Card
                    key={card.id || index}
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
            Get started by editing <code>src/App.js</code> and save to reload.
          </p>
        </footer>
      </div>
    );
  }
}

export default App;
