# Design: Reusable Weather Card Component

## 1. Goal
Create a reusable React component (`WeatherCard`) to display current weather and a toggleable 5-day forecast. This component will be used in two locations to ensure consistency and reduce code duplication:
1.  **Map Popup:** When a user clicks a city marker.
2.  **Favorites Sidebar:** When a user expands a favorite city item.

## 2. Architecture

### New Components
-   **`src/components/WeatherCard.js`**:
    -   **Props**: `city` (object), `currentWeather` (object).
    -   **State**: `showForecast` (boolean), `forecast` (array), `loadingForecast` (boolean).
    -   **Behavior**: Displays current weather immediately. Fetches forecast data from `/api/forecast` only when the user clicks "Show 5-Day Forecast".

### Utilities
-   **`src/utils/weather.js`**:
    -   Extract the `getWeatherCondition(code)` function from `App.js` into a shared utility file to be used by both `App.js` and `WeatherCard.js`.

### Refactoring
-   **`App.js`**:
    -   Remove inline weather rendering in the Leaflet `Popup`.
    -   Import and use `<WeatherCard />`.
-   **`components/FavoritesSidebar.js`**:
    -   Update list items to include an "Expand/Collapse" button.
    -   Render `<WeatherCard />` inside the expanded view of a favorite city.
    -   Preserve existing "Remove" and "Select on Map" functionality.

## 3. UI/UX Design

### Weather Card
-   **Header**: City Name.
-   **Current Weather**:
    -   Temperature (e.g., "25°C").
    -   Wind Speed (e.g., "15 km/h").
    -   Condition Text (e.g., "Partly Cloudy").
-   **Actions**:
    -   Button: "Show 5-Day Forecast" (Blue/Primary color). Switches to "Hide..." when active.
-   **Forecast Section** (Visible when toggled):
    -   List of 5 days.
    -   Each row: Date, Min/Max Temp, Condition text.

### Favorites Sidebar
-   **List Item**:
    -   **Default**: City Name, Current Temp (small), Expand Arrow (▼), Remove Button (×).
    -   **Expanded**: Shows the standard **Weather Card** below the list item header.

## 4. Implementation Plan
1.  Create `src/utils/weather.js` and move `getWeatherCondition` there.
2.  Create `src/components/WeatherCard.js` and `src/components/WeatherCard.css`.
3.  Refactor `App.js` to use the new component.
4.  Refactor `FavoritesSidebar.js` to support item expansion and use the new component.
5.  Verify functionality in both contexts.

## 5. Testing Strategy
-   **Unit/Component Check**:
    -   Verify `WeatherCard` renders current weather info correctly.
    -   Verify clicking "Show Forecast" triggers the API call and displays the list.
-   **Integration Check**:
    -   **Map**: Click a city -> Popup opens -> WeatherCard appears -> Forecast toggles.
    -   **Sidebar**: Add favorite -> Click expand arrow -> WeatherCard appears -> Forecast toggles.
