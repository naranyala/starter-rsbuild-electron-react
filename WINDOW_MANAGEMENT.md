# Enhanced Window Management and Responsive Design

This update introduces a comprehensive window management system with global state tracking and improved responsive design for the sidebar and card list.

## Features

### 1. Global Window Store
- **Centralized State Management**: All WinBox windows are now tracked in a global store
- **Window Tracking**: Each window's state (minimized, active, focused, etc.) is maintained
- **Event-Based Updates**: Windows communicate with the store through custom events
- **Window Lifecycle Management**: Creation, focus, minimize, restore, and close operations are tracked

### 2. Responsive Sidebar Design
- **Mobile-First Approach**: Sidebar collapses on mobile devices with toggle functionality
- **Smooth Transitions**: Animated sidebar opening/closing with CSS transitions
- **Flexible Layout**: Respects sidebar width in main content area
- **Improved UX**: Better touch targets and accessibility

### 3. Enhanced Window List
- **Real-time Updates**: Window list updates as windows are opened/closed
- **Visual Indicators**: Shows minimized/active status with indicators
- **Quick Actions**: Minimize all windows with a single button
- **Collapsible Sections**: Window list can be expanded/collapsed

### 4. Performance Optimizations
- **Efficient Rendering**: Only renders visible windows in the sidebar
- **Event Delegation**: Optimized event handling for window management
- **Memory Management**: Proper cleanup of event listeners

## Components

### Window Store (`src/renderer/store/window-store.ts`)
- `WindowInfo` interface for window state
- `WindowStore` interface with CRUD operations
- React hook `useWindowStore` for accessing global state
- Event listeners for window lifecycle events

### Main Component (`src/renderer/components/features/Main/Main.tsx`)
- Functional component with React hooks
- Responsive sidebar with mobile toggle
- Integrated window store for window management
- Improved card list with responsive grid

### Window Factory Updates (`src/renderer/use-cases/window-factory.ts`)
- Event dispatching for window lifecycle events
- Proper integration with global store
- Enhanced minimize/restore functionality

## Responsive Design Improvements

### Sidebar Behavior
- On desktop: Fixed sidebar with 280px width
- On mobile: Collapsible sidebar that slides in/out
- Smooth CSS transitions for better UX
- Backdrop overlay when sidebar is open on mobile

### Card List Layout
- Responsive grid that adapts to screen size
- Proper spacing and alignment on all devices
- Maintains readability on small screens

### WinBox Container
- Properly accounts for sidebar width
- Responsive positioning that works on all screen sizes
- Maintains window functionality across device sizes

## Usage

### Creating Windows
Windows are created through the Card component clicks and automatically tracked in the global store.

### Managing Windows
- Click on window titles in the sidebar to focus/restore
- Use the "Minimize All" button to minimize all windows
- The window list updates in real-time as windows are opened/closed

### Responsive Behavior
- On mobile devices, the sidebar collapses behind a toggle button
- Main content area adjusts to fill available space
- WinBox windows are properly positioned accounting for sidebar width

## Benefits

1. **Better Performance**: Centralized state reduces redundant operations
2. **Improved UX**: Visual indicators and quick actions for window management
3. **Responsive Design**: Works seamlessly across all device sizes
4. **Maintainable Code**: Clear separation of concerns and proper state management
5. **Accessibility**: Proper ARIA labels and keyboard navigation support

## Integration Points

- The window store integrates with existing WinBox functionality
- Event-based communication maintains loose coupling
- Backward compatibility with existing window operations
- Proper TypeScript typing throughout