// ============================================================================
// GOOBER + CLSX STYLING SYSTEM
// ============================================================================

import { type ClassValue, clsx } from 'clsx';
import { css, styled as gooberStyled } from 'goober';

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
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
  },
  shadows: {
    default: '0 4px 12px rgba(0, 0, 0, 0.3)',
    hover: '0 6px 16px rgba(0, 0, 0, 0.4)',
    focus: '0 0 0 3px rgba(102, 126, 234, 0.3)',
  },
  sidebar: {
    width: 280,
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1200px',
    desktop: '1400px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
  },
} as const;

// ============================================================================
// CLSX HELPER FUNCTIONS
// ============================================================================

export function cx(...values: (ClassValue | undefined | null | false)[]): string {
  return clsx(values);
}

// ============================================================================
// GLOBAL STYLES
// ============================================================================

export function injectGlobalStyles(): void {
  gooberStyled('global')`
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
      --success: ${theme.colors.success};
      --warning: ${theme.colors.warning};
      --error: ${theme.colors.error};
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
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
      border: none;
      background: none;
      cursor: pointer;
    }

    input, textarea, select {
      font-family: inherit;
    }
  `;
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

export const AppContainer = gooberStyled('div')`
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

export const SidebarContainer = gooberStyled('aside')`
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

export const MainContainer = gooberStyled('main')`
  flex: 1;
  margin-left: ${theme.sidebar.width}px;
  min-height: 100vh;
  position: relative;
  z-index: 5;
`;

export const WinboxContainer = gooberStyled('div')`
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

export const SidebarHeader = gooberStyled('header')`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
`;

export const SidebarHomeBtn = gooberStyled('button')`
  background: transparent;
  border: none;
  color: ${theme.colors.textPrimary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  transition: background-color 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background-color: ${theme.colors.bgTertiary};
  }
`;

export const SidebarWindows = gooberStyled('div')`
  padding: ${theme.spacing.md};
  flex: 1;
  overflow-y: auto;
`;

export const SidebarSectionHeader = gooberStyled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.sm};
`;

export const SidebarSectionTitle = gooberStyled('div')`
  font-size: 11px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const SidebarCollapseBtn = gooberStyled('button')`
  background: transparent;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.textPrimary};
  }
`;

interface SidebarWindowBtnProps {
  $isActive?: boolean;
}

export const SidebarWindowBtn = gooberStyled('button')<SidebarWindowBtnProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xs};
  background: ${(props) => (props.$isActive ? theme.colors.bgTertiary : 'transparent')};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.textPrimary};
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s ease;
  text-align: left;

  &:hover {
    background-color: ${theme.colors.bgTertiary};
  }
`;

export const SidebarWindowTitle = gooberStyled('span')`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SidebarWindowIndicator = gooberStyled('span')`
  margin-left: ${theme.spacing.sm};
  font-size: 10px;
`;

export const SidebarEmpty = gooberStyled('div')`
  padding: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: 12px;
`;

export const SidebarToggle = gooberStyled('button')`
  position: fixed;
  top: ${theme.spacing.md};
  left: ${theme.spacing.md};
  z-index: 101;
  background: ${theme.colors.bgTertiary};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.textPrimary};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.cardHover};
  }
`;

export const SidebarBackdrop = gooberStyled('button')`
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

export const MainNoNavbar = gooberStyled('div')`
  padding: ${theme.spacing.lg};
  max-width: 100%;
  margin: 0 auto;
  flex: 1;
  width: calc(100% - 40px);
`;

export const SearchContainer = gooberStyled('div')`
  text-align: left;
  width: 100%;
`;

export const SearchInput = gooberStyled('input')`
  width: 100%;
  padding: 12px ${theme.spacing.md};
  font-size: 16px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.lg};
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background-color: ${theme.colors.bgSecondary};
  color: ${theme.colors.textPrimary};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: ${theme.shadows.focus};
  }

  &::placeholder {
    color: ${theme.colors.textSecondary};
  }
`;

export const CardsList = gooberStyled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.sm};

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }

  @media (min-width: 768px) and (max-width: 1199px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: ${theme.spacing.md};
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: ${theme.spacing.md};
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
    gap: ${theme.spacing.lg};
  }
`;

export const SimpleCard = gooberStyled('button')`
  background: ${theme.colors.cardBg};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
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
    box-shadow: ${theme.shadows.hover};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: ${theme.shadows.focus};
  }
`;

export const SimpleCardTitle = gooberStyled('h3')`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  line-height: 1.4;
`;

export const NoResults = gooberStyled('div')`
  text-align: center;
  padding: 60px ${theme.spacing.lg};
  color: ${theme.colors.textSecondary};
  font-size: 16px;
`;

// ============================================================================
// TAB FILTER COMPONENTS
// ============================================================================

export const TabFilterContainer = gooberStyled('div')`
  margin-bottom: ${theme.spacing.lg};
  width: 100%;
`;

export const TabFilterInner = gooberStyled('div')`
  display: flex;
  background-color: ${theme.colors.bgSecondary};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
  box-shadow: ${theme.shadows.default};
  flex-wrap: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-wrap: wrap;
  }
`;

interface TabItemProps {
  $isActive?: boolean;
}

export const TabItem = gooberStyled('button')<TabItemProps>`
  flex: 1;
  min-width: 100px;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${(props) => (props.$isActive ? theme.colors.accent : 'transparent')};
  border: none;
  color: ${(props) => (props.$isActive ? 'white' : theme.colors.textSecondary)};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.$isActive ? theme.colors.accent : theme.colors.bgTertiary)};
    color: ${(props) => (props.$isActive ? 'white' : theme.colors.textPrimary)};
  }

  &:not(:last-child) {
    border-right: 1px solid ${theme.colors.border};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 10px ${theme.spacing.md};
    font-size: 13px;
    min-width: 80px;
    flex: 1 0 auto;
  }

  @media (max-width: 480px) {
    padding: 8px ${theme.spacing.sm};
    font-size: 12px;
    min-width: 60px;
  }

  @media (min-width: 769px) and (max-width: 1199px) {
    padding: 14px 18px;
    font-size: 15px;
  }

  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg} ${theme.spacing.xl};
    font-size: 16px;
  }
`;

// ============================================================================
// FOOTER
// ============================================================================

export const Footer = gooberStyled('footer')`
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.bgSecondary};
  text-align: center;
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.xl};

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

export const WinboxContent = gooberStyled('div')`
  padding: ${theme.spacing.lg};
  max-height: calc(100% - 40px);
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;

  & h3 {
    margin: 0 0 ${theme.spacing.md} 0;
    font-size: 18px;
    font-weight: 600;
  }

  & h4 {
    margin: ${theme.spacing.md} 0 ${theme.spacing.sm} 0;
    font-size: 15px;
    font-weight: 600;
  }

  & p {
    margin: 0 0 ${theme.spacing.sm} 0;
    color: ${theme.colors.textSecondary};
  }

  & ul {
    margin: ${theme.spacing.sm} 0;
    padding-left: 20px;
  }

  & li {
    margin: 4px 0;
    color: ${theme.colors.textSecondary};
  }
`;

export const WinboxDynamicContent = gooberStyled('div')`
  color: inherit;
`;

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

interface FlexProps {
  $direction?: 'row' | 'column';
  $justify?: string;
  $align?: string;
  $gap?: string;
  $flex?: string;
  $wrap?: boolean;
}

export const Flex = gooberStyled('div')<FlexProps>`
  display: flex;
  flex-direction: ${(props) => props.$direction || 'row'};
  justify-content: ${(props) => props.$justify || 'flex-start'};
  align-items: ${(props) => props.$align || 'stretch'};
  gap: ${(props) => props.$gap || '0'};
  flex: ${(props) => props.$flex || '0 0 auto'};
  flex-wrap: ${(props) => (props.$wrap ? 'wrap' : 'nowrap')};
`;

interface GridProps {
  $columns?: string;
  $rows?: string;
  $gap?: string;
  $minWidth?: string;
}

export const Grid = gooberStyled('div')<GridProps>`
  display: grid;
  grid-template-columns: ${(props) => props.$columns || 'repeat(auto-fill, minmax(300px, 1fr))'};
  grid-template-rows: ${(props) => props.$rows || 'auto'};
  gap: ${(props) => props.$gap || theme.spacing.md};
`;

interface SpacingProps {
  $p?: string;
  $px?: string;
  $py?: string;
  $m?: string;
  $mx?: string;
  $my?: string;
}

export const Spacing = gooberStyled('div')<SpacingProps>`
  padding: ${(props) => props.$p || '0'};
  padding-left: ${(props) => props.$px || '0'};
  padding-right: ${(props) => props.$px || '0'};
  padding-top: ${(props) => props.$py || '0'};
  padding-bottom: ${(props) => props.$py || '0'};
  margin: ${(props) => props.$m || '0'};
  margin-left: ${(props) => props.$mx || '0'};
  margin-right: ${(props) => props.$mx || '0'};
  margin-top: ${(props) => props.$my || '0'};
  margin-bottom: ${(props) => props.$my || '0'};
`;

interface TextProps {
  $size?: string;
  $weight?: number | string;
  $color?: string;
  $align?: string;
  $family?: string;
}

export const Text = gooberStyled('span')<TextProps>`
  font-size: ${(props) => props.$size || 'inherit'};
  font-weight: ${(props) => props.$weight || 'inherit'};
  color: ${(props) => props.$color || 'inherit'};
  text-align: ${(props) => props.$align || 'inherit'};
  font-family: ${(props) => props.$family || 'inherit'};
`;

// ============================================================================
// BUTTON VARIANTS (CLSX PATTERN)
// ============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  $variant?: ButtonVariant;
  $size?: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
}

export const Button = gooberStyled('button')<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  
  ${(props) => {
    switch (props.$variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.bgTertiary};
          color: ${theme.colors.textPrimary};
          border: 1px solid ${theme.colors.border};

          &:hover {
            background-color: ${theme.colors.cardHover};
            border-color: ${theme.colors.accent};
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.textPrimary};
          border: 1px solid transparent;

          &:hover {
            background-color: ${theme.colors.bgTertiary};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.error};
          color: white;
          border: 1px solid ${theme.colors.error};

          &:hover {
            opacity: 0.9;
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.accent};
          color: white;
          border: 1px solid ${theme.colors.accent};

          &:hover {
            background-color: #5a6fd6;
            border-color: #5a6fd6;
          }
        `;
    }
  }}
  
  ${(props) => {
    switch (props.$size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: 12px;
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: 16px;
        `;
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 14px;
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: ${theme.shadows.focus};
  }
`;

// ============================================================================
// CARD VARIANTS
// ============================================================================

type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardStyleProps {
  $variant?: CardVariant;
}

export const Card = gooberStyled('div')<CardStyleProps>`
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  transition: all 0.2s ease;
  
  ${(props) => {
    switch (props.$variant) {
      case 'elevated':
        return css`
          background-color: ${theme.colors.cardBg};
          border: none;
          box-shadow: ${theme.shadows.hover};
        `;
      case 'outlined':
        return css`
          background-color: transparent;
          border: 2px solid ${theme.colors.border};
          box-shadow: none;
        `;
      default:
        return css`
          background-color: ${theme.colors.cardBg};
          border: 1px solid ${theme.colors.border};
          box-shadow: ${theme.shadows.default};
        `;
    }
  }}

  &:hover {
    transform: translateY(-2px);
  }
`;

export const CardHeader = gooberStyled('div')`
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
`;

export const CardTitle = gooberStyled('h3')`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`;

export const CardContent = gooberStyled('div')`
  color: ${theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.6;
`;

export const CardFooter = gooberStyled('div')`
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
`;

// ============================================================================
// INPUT VARIANTS
// ============================================================================

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps {
  $size?: InputSize;
  $hasError?: boolean;
}

export const Input = gooberStyled('input')<InputProps>`
  width: 100%;
  border: 1px solid ${(props) => (props.$hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.bgSecondary};
  color: ${theme.colors.textPrimary};
  transition: all 0.2s ease;
  
  ${(props) => {
    switch (props.$size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: 12px;
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: 18px;
        `;
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 14px;
        `;
    }
  }}

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$hasError ? theme.colors.error : theme.colors.accent)};
    box-shadow: ${(props) => (props.$hasError ? `0 0 0 3px rgba(248, 113, 113, 0.3)` : theme.shadows.focus)};
  }

  &::placeholder {
    color: ${theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ============================================================================
// LABEL & HELP TEXT
// ============================================================================

export const Label = gooberStyled('label')`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.xs};
`;

export const HelpText = gooberStyled('span')`
  display: block;
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.xs};
`;

export const ErrorText = gooberStyled('span')`
  display: block;
  font-size: 12px;
  color: ${theme.colors.error};
  margin-top: ${theme.spacing.xs};
`;

// ============================================================================
// BARREL EXPORT
// ============================================================================

export * from './renderer-utils';
