# Design: UI Fixes (Search Overlap & Keyboard Nav)

## 1. Requirement Analysis
Two specific UX issues identified:
1.  **Visual Bug**: The main map search box overlaps with the Leaflet zoom controls (top-left).
2.  **Usability Gap**: The "Favorite Cities" sidebar search does not support keyboard navigation (Arrow keys/Enter) for selecting results.

## 2. Design Proposal

### 2.1. Fix Search Box Overlap
**Goal**: Move the search box to a position where it does not conflict with map controls.

**Approach**:
-   Modify `simple-app-client/src/App.css`.
-   Change the positioning of `.search-box`.
-   **Proposed Style**: Center the search box horizontally at the top of the map.
    ```css
    .search-box {
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      /* ... */
    }
    ```
-   This avoids the top-left (zoom) and bottom-right (attribution) corners.

### 2.2. Sidebar Keyboard Navigation
**Goal**: Allow users to use Up/Down arrows to highlight a city in the favorites search dropdown and Enter to add it.

**Approach**:
-   **Component**: `simple-app-client/src/components/FavoritesSidebar.js`
-   **State**: Add `focusedIndex` (default `-1`).
-   **Logic**:
    -   Add `handleKeyDown(e)` to the search input.
    -   **ArrowDown**: Increment `focusedIndex` (max: `results.length - 1`).
    -   **ArrowUp**: Decrement `focusedIndex` (min: `0`).
    -   **Enter**: If `focusedIndex >= 0`, trigger `addFavorite(searchResults[focusedIndex])`.
    -   Reset `focusedIndex` to `-1` when search query changes.
-   **Styling**:
    -   Update `simple-app-client/src/components/FavoritesSidebar.css`.
    -   Add `.sidebar-dropdown li.focused` style (e.g., background color change) to visually indicate selection.

## 3. Implementation Plan
1.  **CSS Update**: Edit `App.css` to recenter the main search box.
2.  **Sidebar Logic**: Update `FavoritesSidebar.js` to implement `focusedIndex` and `handleKeyDown`.
3.  **Sidebar Style**: Update `FavoritesSidebar.css` to style the focused item.
4.  **Verification**:
    -   Check map visually to ensure no overlap.
    -   Test keyboard navigation in the sidebar (Down -> Down -> Up -> Enter adds city).
