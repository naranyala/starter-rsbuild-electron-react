import clsx from 'clsx';
import type React from 'react';
import { Component } from 'react';
import 'winbox/dist/css/winbox.min.css';
import Card from '@renderer/components/ui/Card/Card';
import TabFilter from '@renderer/components/ui/TabFilter/TabFilter';
import { menuData } from '@renderer/data/menu-data';
import {
  AppContainer,
  CardsList,
  Footer,
  MainContainer,
  MainNoNavbar,
  NoResults,
  SearchContainer,
  SearchInput,
  SidebarBackdrop,
  SidebarCollapseBtn,
  SidebarContainer,
  SidebarEmpty,
  SidebarHeader,
  SidebarHomeBtn,
  SidebarSectionHeader,
  SidebarSectionTitle,
  SidebarToggle,
  SidebarWindowBtn,
  SidebarWindowIndicator,
  SidebarWindows,
  SidebarWindowTitle,
  WinboxContainer,
} from '@renderer/styles';
import type { MenuItem } from '@renderer/types';
import { getWindow, isWindowMinimized, isWindowActive, toggleWindow } from '@renderer/use-cases/window-factory';

interface WindowInfo {
  id: string;
  title: string;
}

interface AppState {
  searchTerm: string;
  activeTab: string;
  isSidebarOpen: boolean;
  isWindowListExpanded: boolean;
  openedWindows: WindowInfo[];
}

const fuzzySearch = (text: string, query: string): boolean => {
  if (!query) return true;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  let queryIndex = 0;

  for (let i = 0; i < lowerText.length; i++) {
    const lowerChar = lowerText[i];

    if (queryIndex < lowerQuery.length && lowerChar === lowerQuery[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === lowerQuery.length;
};

class Main extends Component<Record<string, never>, AppState> {
  private globalWindow: Window;

  constructor(props: Record<string, never>) {
    super(props);
    this.globalWindow = typeof window !== 'undefined' ? window : ({} as Window);
    this.state = {
      searchTerm: '',
      activeTab: 'all',
      isSidebarOpen: false,
      isWindowListExpanded: true,
      openedWindows: [],
    };
  }

  componentDidMount() {
    this.globalWindow.addEventListener('window-closed', this.handleWindowClosed as EventListener);
    this.globalWindow.addEventListener('focus-window', this.handleWindowFocused as EventListener);
  }

  componentWillUnmount() {
    this.globalWindow.removeEventListener(
      'window-closed',
      this.handleWindowClosed as EventListener
    );
    this.globalWindow.removeEventListener(
      'focus-window',
      this.handleWindowFocused as EventListener
    );
  }

  handleWindowFocused = (event: Event) => {
    const customEvent = event as CustomEvent<{ id: string; title: string }>;
    if (customEvent.detail?.id) {
      this.addWindow(customEvent.detail.id, customEvent.detail.title);
    }
  };

  handleWindowClosed = (event: Event) => {
    const customEvent = event as CustomEvent<{ id: string }>;
    if (customEvent.detail?.id) {
      this.removeWindow(customEvent.detail.id);
    }
  };

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleTabChange = (tabId: string) => {
    this.setState({ activeTab: tabId });
  };

  toggleSidebar = () => {
    this.setState(
      (prevState: Readonly<AppState>): AppState => ({
        ...prevState,
        isSidebarOpen: !prevState.isSidebarOpen,
      })
    );
  };

  closeSidebar = () => {
    this.setState(
      (prevState: Readonly<AppState>): AppState => ({
        ...prevState,
        isSidebarOpen: false,
      })
    );
  };

  toggleWindowList = () => {
    this.setState(
      (prevState: Readonly<AppState>): AppState => ({
        ...prevState,
        isWindowListExpanded: !prevState.isWindowListExpanded,
      })
    );
  };

  addWindow = (id: string, title: string) => {
    this.setState((prevState: Readonly<AppState>): AppState => {
      if (prevState.openedWindows.some((w) => w.id === id)) {
        return prevState;
      }
      return { ...prevState, openedWindows: [...prevState.openedWindows, { id, title }] };
    });
  };

  removeWindow = (id: string) => {
    this.setState(
      (prevState: Readonly<AppState>): AppState => ({
        ...prevState,
        openedWindows: prevState.openedWindows.filter((w) => w.id !== id),
      })
    );
  };

  handleCardClick = (id: string, title: string) => {
    this.addWindow(id, title);
  };

  goHome = () => {
    this.setState({ searchTerm: '', activeTab: 'all' });
    this.closeSidebar();
    this.minimizeAllWindows();
  };

  minimizeAllWindows = () => {
    import('@renderer/use-cases/window-factory').then(({ minimizeAll }) => {
      minimizeAll();
    });
  };

  handleFocusWindow = (windowInfo: WindowInfo) => {
    const existingWindow = getWindow(windowInfo.id);
    if (existingWindow) {
      // Toggle the window's minimized state
      toggleWindow(windowInfo.id);

      // If the window is minimized, we should focus it to bring it back
      if (isWindowMinimized(windowInfo.id)) {
        if (existingWindow.focus) {
          existingWindow.focus();
        }
      }
    } else {
      const event = new CustomEvent('focus-window', {
        detail: { id: windowInfo.id, title: windowInfo.title },
      });
      this.globalWindow.dispatchEvent(event);
    }
  };

  render() {
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

    const filteredCards = menuData.filter((card: MenuItem) => {
      const titleMatch = fuzzySearch(card.title, this.state.searchTerm);
      const tabMatch = this.state.activeTab === 'all' || card.category === this.state.activeTab;
      return titleMatch && tabMatch;
    });

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
      <AppContainer>
        <SidebarContainer>
          {isMobile && (
            <SidebarToggle type="button" onClick={this.toggleSidebar} aria-label="Toggle sidebar">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <title>Menu</title>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </SidebarToggle>
          )}

          {isMobile && this.state.isSidebarOpen && (
            <SidebarBackdrop type="button" aria-label="Close sidebar" onClick={this.closeSidebar} />
          )}

          <aside
            className={clsx('sidebar', {
              'sidebar-open': isMobile ? this.state.isSidebarOpen : true,
            })}
          >
            <SidebarHeader>
              <SidebarHomeBtn type="button" onClick={this.goHome}>
                HOME
              </SidebarHomeBtn>
            </SidebarHeader>
            <SidebarWindows>
              <SidebarSectionHeader>
                <SidebarSectionTitle>OPENED WINDOWS</SidebarSectionTitle>
                <SidebarCollapseBtn
                  type="button"
                  onClick={this.toggleWindowList}
                  aria-label={
                    this.state.isWindowListExpanded ? 'Collapse window list' : 'Expand window list'
                  }
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                    style={{
                      transform: this.state.isWindowListExpanded
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </SidebarCollapseBtn>
              </SidebarSectionHeader>
              {this.state.isWindowListExpanded &&
                (this.state.openedWindows.length > 0 ? (
                  this.state.openedWindows.map((windowInfo) => {
                    const minimized = isWindowMinimized(windowInfo.id);
                    const isActive = isWindowActive(windowInfo.id);
                    return (
                      <SidebarWindowBtn
                        type="button"
                        key={windowInfo.id}
                        isActive={isActive}
                        onClick={() => this.handleFocusWindow(windowInfo)}
                      >
                        <SidebarWindowTitle>{windowInfo.title}</SidebarWindowTitle>
                        <SidebarWindowIndicator>{minimized ? '○' : '●'}</SidebarWindowIndicator>
                      </SidebarWindowBtn>
                    );
                  })
                ) : (
                  <SidebarEmpty>No windows open</SidebarEmpty>
                ))}
            </SidebarWindows>
          </aside>
        </SidebarContainer>

        <WinboxContainer id="winbox-mount-point" />
        <MainContainer>
          <MainNoNavbar>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Search topics..."
                value={this.state.searchTerm}
                onChange={this.handleSearchChange}
              />
              <TabFilter
                tabs={tabs}
                activeTab={this.state.activeTab}
                onTabChange={this.handleTabChange}
              />
              <CardsList>
                {filteredCards.length > 0 ? (
                  filteredCards.map((card: MenuItem, index: number) => (
                    <Card
                      key={card.id || index}
                      id={card.id}
                      index={index}
                      title={card.title}
                      content={card.content}
                      onClick={this.handleCardClick}
                    />
                  ))
                ) : (
                  <NoResults>No matching topics found</NoResults>
                )}
              </CardsList>
            </SearchContainer>
          </MainNoNavbar>
          <Footer>
            <p>
              Get started by editing <code>src/renderer/components/features/Main/Main.tsx</code> and
              save to reload.
            </p>
          </Footer>
        </MainContainer>
      </AppContainer>
    );
  }
}

export default Main;
