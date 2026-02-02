// Goober CSS-in-JS setup for the application
import { glob, styled } from 'goober';

// ============================================================================
// THEME / DESIGN TOKENS
// ============================================================================

export const theme = {
  colors: {
    bgPrimary: '#1a1a1a',
    bgSecondary: '#252525',
    bgTertiary: '#2d2d2d',
    textPrimary: '#e0e0e0',
    textSecondary: '#a0a0a0',
    border: '#404040',
    cardBg: '#2d2d2d',
    cardHover: '#3a3a3a',
    accent: '#667eea',
    highlightBg: '#ffd700',
    highlightText: '#000',
  },
  shadows: {
    default: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  sidebar: {
    width: 280,
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1200px',
    desktop: '1400px',
  },
} as const;

// ============================================================================
// GLOBAL STYLES
// ============================================================================

export function injectGlobalStyles(): void {
  glob`
    :root {
      --bg-primary: ${theme.colors.bgPrimary};
      --bg-secondary: ${theme.colors.bgSecondary};
      --bg-tertiary: ${theme.colors.bgTertiary};
      --text-primary: ${theme.colors.textPrimary};
      --text-secondary: ${theme.colors.textSecondary};
      --border-color: ${theme.colors.border};
      --card-bg: ${theme.colors.cardBg};
      --card-hover: ${theme.colors.cardHover};
      --shadow: ${theme.shadows.default};
      --highlight-bg: ${theme.colors.highlightBg};
      --highlight-text: ${theme.colors.highlightText};
      --accent-color: ${theme.colors.accent};
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", 
                   "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", 
                   sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: ${theme.colors.bgPrimary};
      color: ${theme.colors.textPrimary};
      min-height: 100vh;
    }

    #root {
      min-height: 100vh;
    }

    code {
      font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    }

    button {
      font-family: inherit;
    }
  `;
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

export const AppContainer = styled('div')`
  text-align: center;
  background-color: ${theme.colors.bgPrimary};
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  color: ${theme.colors.textPrimary};
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  position: relative;
`;

export const SidebarContainer = styled('div')`
  position: fixed;
  left: 0;
  top: 0;
  width: ${theme.sidebar.width}px;
  height: 100vh;
  z-index: 10;
  flex-shrink: 0;
  background-color: ${theme.colors.bgSecondary};
  display: flex;
  flex-direction: column;
`;

export const MainContainer = styled('main')`
  flex: 1;
  margin-left: ${theme.sidebar.width}px;
  min-height: 100vh;
  position: relative;
  z-index: 5;
`;

export const WinboxContainer = styled('div')`
  position: fixed;
  left: ${theme.sidebar.width}px;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  pointer-events: none;
  overflow: hidden;

  & .wb {
    position: absolute !important;
    pointer-events: auto;
    z-index: 101 !important;
    max-width: calc(100vw - ${theme.sidebar.width}px) !important;
    left: unset !important;
  }

  & .wb.max {
    left: 0 !important;
    top: 0 !important;
    width: calc(100vw - ${theme.sidebar.width}px) !important;
    height: 100vh !important;
    max-width: unset !important;
    z-index: 102 !important;
  }

  & .wb.min {
    left: 0 !important;
    width: auto !important;
    height: auto !important;
  }
`;

// ============================================================================
// SIDEBAR COMPONENTS
// ============================================================================

export const SidebarHeader = styled('div')`
  padding: 16px;
  border-bottom: 1px solid ${theme.colors.border};
`;

export const SidebarHomeBtn = styled('button')`
  background: transparent;
  border: none;
  color: ${theme.colors.textPrimary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background-color: ${theme.colors.bgTertiary};
  }
`;

export const SidebarWindows = styled('div')`
  padding: 16px;
  flex: 1;
  overflow-y: auto;
`;

export const SidebarSectionHeader = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const SidebarSectionTitle = styled('div')`
  font-size: 11px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const SidebarCollapseBtn = styled('button')`
  background: transparent;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.textPrimary};
  }
`;

export const SidebarWindowBtn = styled('button')<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 4px;
  background: ${(props) => (props.isActive ? theme.colors.bgTertiary : 'transparent')};
  border: none;
  border-radius: 4px;
  color: ${theme.colors.textPrimary};
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s ease;
  text-align: left;

  &:hover {
    background-color: ${theme.colors.bgTertiary};
  }
`;

export const SidebarWindowTitle = styled('span')`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SidebarWindowIndicator = styled('span')`
  margin-left: 8px;
  font-size: 10px;
`;

export const SidebarEmpty = styled('div')`
  padding: 20px;
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: 12px;
`;

export const SidebarToggle = styled('button')`
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 101;
  background: ${theme.colors.bgTertiary};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.textPrimary};
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.cardHover};
  }
`;

export const SidebarBackdrop = styled('button')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  border: none;
  cursor: pointer;
`;

// ============================================================================
// MAIN CONTENT COMPONENTS
// ============================================================================

export const MainNoNavbar = styled('div')`
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
  flex: 1;
  width: calc(100% - 40px);
`;

export const SearchContainer = styled('div')`
  text-align: left;
  width: 100%;
`;

export const SearchInput = styled('input')`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  margin-bottom: 20px;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background-color: ${theme.colors.bgSecondary};
  color: ${theme.colors.textPrimary};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
  }

  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
`;

export const CardsList = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 15px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
    gap: 25px;
  }
`;

export const SimpleCard = styled('button')`
  background: ${theme.colors.cardBg};
  border-radius: 6px;
  padding: 15px 20px;
  box-shadow: ${theme.shadows.default};
  border: 1px solid ${theme.colors.border};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  width: 100%;

  &:hover {
    background: ${theme.colors.cardHover};
    border-color: ${theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
  }
`;

export const SimpleCardTitle = styled('h3')`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  line-height: 1.4;
`;

export const NoResults = styled('div')`
  text-align: center;
  padding: 60px 20px;
  color: ${theme.colors.textSecondary};
  font-size: 16px;
`;

// ============================================================================
// TAB FILTER COMPONENTS
// ============================================================================

export const TabFilterContainer = styled('div')`
  margin-bottom: 20px;
  width: 100%;
`;

export const TabFilterInner = styled('div')`
  display: flex;
  background-color: ${theme.colors.bgSecondary};
  border-radius: 6px;
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
  box-shadow: ${theme.shadows.default};
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

export const TabItem = styled('button')<{ isActive?: boolean }>`
  flex: 1;
  min-width: 100px;
  padding: 12px 16px;
  background: ${(props) => (props.isActive ? theme.colors.accent : 'transparent')};
  border: none;
  color: ${(props) => (props.isActive ? 'white' : theme.colors.textSecondary)};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.isActive ? theme.colors.accent : theme.colors.bgTertiary)};
    color: ${(props) => (props.isActive ? 'white' : theme.colors.textPrimary)};
  }

  &:not(:last-child) {
    border-right: 1px solid ${theme.colors.border};
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 13px;
    min-width: 80px;
    flex: 1 0 auto;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 12px;
    min-width: 60px;
  }

  @media (min-width: 769px) and (max-width: 1199px) {
    padding: 14px 18px;
    font-size: 15px;
  }

  @media (min-width: 1200px) {
    padding: 16px 20px;
    font-size: 16px;
  }
`;

// ============================================================================
// FOOTER
// ============================================================================

export const Footer = styled('footer')`
  padding: 20px;
  background-color: ${theme.colors.bgSecondary};
  text-align: center;
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  margin-top: 40px;

  & code {
    background-color: ${theme.colors.bgTertiary};
    padding: 2px 6px;
    border-radius: 3px;
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    font-size: 12px;
  }
`;

// ============================================================================
// WINBOX CONTENT STYLES
// ============================================================================

export const WinboxContent = styled('div')`
  padding: 20px;
  max-height: calc(100% - 40px);
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;

  & h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
  }

  & h4 {
    margin: 16px 0 8px 0;
    font-size: 15px;
    font-weight: 600;
  }

  & p {
    margin: 0 0 12px 0;
    color: ${theme.colors.textSecondary};
  }

  & ul {
    margin: 8px 0;
    padding-left: 20px;
  }

  & li {
    margin: 4px 0;
    color: ${theme.colors.textSecondary};
  }
`;

export const WinboxDynamicContent = styled('div')`
  color: inherit;
`;
