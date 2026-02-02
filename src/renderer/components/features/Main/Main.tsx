import type React from 'react';
import { Component } from 'react';
import '../../../assets/styles/components/App.css';
import 'winbox/dist/css/winbox.min.css';
import { menuData } from '../../../data/menu-data';
import type { MenuItem } from '../../../types';
import Card from '../../ui/Card/Card';
import TabFilter from '../../ui/TabFilter/TabFilter';

interface AppState {
  searchTerm: string;
  activeTab: string;
}

// Simple fuzzy search function - returns only boolean match
const fuzzySearch = (text: string, query: string): boolean => {
  if (!query) return true;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  let queryIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const lowerChar = text[i].toLowerCase();

    if (queryIndex < lowerQuery.length && lowerChar === lowerQuery[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === lowerQuery.length;
};

class Main extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      searchTerm: '',
      activeTab: 'all', // Default to showing all items
    };
  }

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleTabChange = (tabId: string) => {
    this.setState({ activeTab: tabId });
  };

  render() {
    // Define available tabs
    const tabs = [
      { id: 'all', label: 'All Integrations' },
      { id: 'framework', label: 'Framework' },
      { id: 'api', label: 'Native APIs' },
      { id: 'security', label: 'Security' },
      { id: 'performance', label: 'Performance' },
      { id: 'packaging', label: 'Packaging' },
      { id: 'development', label: 'Development' },
      { id: 'maintenance', label: 'Maintenance' },
    ];

    // Filter cards based on search term and active tab
    const filteredCards = menuData.filter((card: MenuItem) => {
      // Search filter
      const titleMatch = fuzzySearch(card.title, this.state.searchTerm);

      // Tab filter
      const tabMatch = this.state.activeTab === 'all' || card.category === this.state.activeTab;

      return titleMatch && tabMatch;
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
            <TabFilter
              tabs={tabs}
              activeTab={this.state.activeTab}
              onTabChange={this.handleTabChange}
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
            Get started by editing <code>src/renderer/components/features/Main/Main.tsx</code> and
            save to reload.
          </p>
        </footer>
      </div>
    );
  }
}

export default Main;
