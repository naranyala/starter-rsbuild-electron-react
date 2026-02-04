/**
 * Enhanced Main Component with Improved Responsive Design and Global Window Store
 * Features responsive sidebar, card list, and centralized window management
 */

import clsx from 'clsx';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import 'winbox/dist/css/winbox.min.css';
import Card from '@renderer/components/ui/Card/Card';
import TabFilter from '@renderer/components/ui/TabFilter/TabFilter';
import { menuData } from '@renderer/data/menu-data';
import {
  AppContainer,
  CardsList,
  MainNoNavbar,
  NoResults,
  ResponsiveMainContainer,
  SearchContainer,
  SearchInput,
  SidebarBackdrop,
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
  SidebarWindowTitleSpan,
  SidebarWrapper,
  WinboxContainer,
} from '@renderer/lib/styled';
import { useWindowStore, type WindowInfo } from '@renderer/store/window-store';
import type { MenuItem } from '@renderer/types';
import {
  getWindow,
  getWindowByTitle,
  isWindowMinimized,
  maximizeWindow,
  minimizeAll,
  toggleWindow,
} from '@renderer/use-cases/window-factory';

type MainProps = {};

const Main: React.FC<MainProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const windowStore = useWindowStore();
  const globalWindowRef = useRef(typeof window !== 'undefined' ? window : null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Initialize event listeners
  useEffect(() => {
    const globalWindow = globalWindowRef.current;
    if (!globalWindow) return;

    const handleWindowClosed = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id && windowStore) {
        windowStore.removeWindow(customEvent.detail.id);
      }
    };

    const handleWindowFocused = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string; title: string }>;
      if (customEvent.detail?.id && windowStore) {
        windowStore.focusWindow(customEvent.detail.id);
      }
    };

    globalWindow.addEventListener('window-closed', handleWindowClosed);
    globalWindow.addEventListener('focus-window', handleWindowFocused);

    // Setup resize handler
    if (globalWindow.ResizeObserver) {
      resizeObserverRef.current = new globalWindow.ResizeObserver(() => {
        // On mobile screens, close sidebar when resizing to larger screens
        if (globalWindow.innerWidth >= 768 && isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      });
      resizeObserverRef.current.observe(globalWindow.document.body);
    }

    return () => {
      globalWindow.removeEventListener('window-closed', handleWindowClosed);
      globalWindow.removeEventListener('focus-window', handleWindowFocused);

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [isSidebarOpen, windowStore]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleCardClick = (id: string, title: string) => {
    if (windowStore) {
      // Create window info
      const windowInfo: WindowInfo = {
        id,
        title,
        minimized: false,
        active: true,
        createdAt: new Date(),
        lastFocused: new Date(),
      };

      windowStore.addWindow(windowInfo);

      // Dispatch event to create the actual window
      const event = new CustomEvent('window-created', { detail: windowInfo });
      if (globalWindowRef.current) {
        globalWindowRef.current.dispatchEvent(event);
      }
    }
  };

  const goHome = () => {
    setSearchTerm('');
    setActiveTab('all');
    closeSidebar();
    minimizeAll();
  };

  const handleFocusWindow = (windowInfo: WindowInfo) => {
    let existingWindow = getWindow(windowInfo.id);
    if (!existingWindow) {
      existingWindow = getWindowByTitle(windowInfo.title);
    }
    if (existingWindow) {
      if (existingWindow.isMinimized && existingWindow.minimize) {
        existingWindow.minimize();
      }
      if (existingWindow.focus) {
        existingWindow.focus();
      }
      if (existingWindow.maximize) {
        existingWindow.maximize();
      }
    } else {
      if (globalWindowRef.current) {
        const event = new CustomEvent('focus-window', {
          detail: { id: windowInfo.id, title: windowInfo.title },
        });
        globalWindowRef.current.dispatchEvent(event);
      }
    }
  };

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
    const titleMatch = fuzzySearch(card.title, searchTerm);
    const tabMatch = activeTab === 'all' || card.category === activeTab;
    return titleMatch && tabMatch;
  });

  // Get window store data
  const windows = windowStore?.windows || [];
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <AppContainer>
      <SidebarToggle type="button" onClick={toggleSidebar} aria-label="Toggle sidebar">
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

      {isMobile && isSidebarOpen && (
        <SidebarBackdrop type="button" aria-label="Close sidebar" onClick={closeSidebar} />
      )}

      <SidebarContainer className={isMobile && !isSidebarOpen ? 'sidebar-hidden' : ''}>
        <SidebarWrapper
          $isOpen={isSidebarOpen}
          $isMobile={isMobile}
          className={clsx('sidebar', {
            'sidebar-open': isMobile ? isSidebarOpen : true,
          })}
        >
          <SidebarHeader>
            <SidebarHomeBtn type="button" onClick={goHome}>
              HOME
            </SidebarHomeBtn>
          </SidebarHeader>

          {/* Windows List */}
          <SidebarWindows>
            <SidebarSectionHeader>
              <SidebarSectionTitle>WINDOWS ({windows.length})</SidebarSectionTitle>
            </SidebarSectionHeader>

            {windows.length > 0 ? (
              windows.map((windowInfo) => {
                const minimized = windowInfo.minimized;
                const isActive = windowStore?.activeWindowId === windowInfo.id;

                return (
                  <SidebarWindowBtn
                    type="button"
                    key={windowInfo.id}
                    $isActive={isActive}
                    onClick={() => handleFocusWindow(windowInfo)}
                  >
                    <SidebarWindowTitleSpan>{windowInfo.title}</SidebarWindowTitleSpan>
                    <SidebarWindowIndicator>{minimized ? '○' : '●'}</SidebarWindowIndicator>
                  </SidebarWindowBtn>
                );
              })
            ) : (
              <SidebarEmpty>No windows open</SidebarEmpty>
            )}
          </SidebarWindows>
        </SidebarWrapper>
      </SidebarContainer>

      <WinboxContainer id="winbox-mount-point" />

      {/* Main content area that respects sidebar width */}
      <ResponsiveMainContainer $isMobile={isMobile}>
        <MainNoNavbar>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <TabFilter tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
            <CardsList>
              {filteredCards.length > 0 ? (
                filteredCards.map((card: MenuItem, index: number) => (
                  <Card
                    key={card.id || index}
                    id={card.id}
                    index={index}
                    title={card.title}
                    content={card.content}
                    onClick={handleCardClick}
                  />
                ))
              ) : (
                <NoResults>No matching topics found</NoResults>
              )}
            </CardsList>
          </SearchContainer>
        </MainNoNavbar>
      </ResponsiveMainContainer>
    </AppContainer>
  );
};

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

export default Main;
