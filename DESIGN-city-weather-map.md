# DESIGN: City Weather Map

## 1. Overview
This feature adds a "City Weather Map" capabilities to the Simple App. Users can search for cities worldwide, view them on an interactive map, and retrieve current weather information. Per requirements, the ASP.NET backend will act as a proxy for all external data fetching, ensuring the frontend remains thin and secure.

**Update:** We are adding a 5-day forecast feature.

## 2. Architecture

### 2.1. High-Level Diagram
```mermaid
[User] --(Browser)--> [React Frontend]
[React Frontend] --(HTTP/JSON)--> [ASP.NET Backend]
[ASP.NET Backend] --(HTTP)--> [Open-Meteo Geocoding API]
[ASP.NET Backend] --(HTTP)--> [Open-Meteo Weather API]
```

### 2.2. Backend (ASP.NET Core)
The backend will introduce a structured API layer. Since the current `Program.cs` is minimal, we will refactor it slightly to support Controllers or Minimal API endpoints.

**New Endpoints:**
*   `GET /api/cities?query={text}`
    *   **Purpose:** Proxies requests to an external Geocoding service. Supports multi-language search.
    *   **Source:** `https://geocoding-api.open-meteo.com/v1/search?name={text}&count=10&format=json`
    *   **Response:** List of cities with Name, Latitude, Longitude, Country. Name is returned in a language matching the query or default.
*   `GET /api/weather?lat={lat}&lon={lon}`
    *   **Purpose:** Proxies requests to an external Weather service.
    *   **Source:** `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true`
    *   **Response:** Current temperature, wind speed, weather code.
*   **[NEW]** `GET /api/forecast?lat={lat}&lon={lon}`
    *   **Purpose:** Proxies requests for a 5-day forecast.
    *   **Source:** `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
    *   **Response:** Daily max/min temperatures and weather codes for the next 7 days (frontend will filter/show 5).

### 2.3. Frontend (React)
We will add a new set of components.
*   **Main Layout:** A split-view or overlaid UI with the Search bar and the Map.
*   **Components:**
    *   `CitySearch`: An input field with a debounce mechanism. Displays a dropdown of results fetched from `/api/cities`.
    *   `MapViewer`: Uses `react-leaflet` to display an OpenStreetMap.
        *   Updates center/zoom when a city is selected.
        *   Displays a Marker for the selected city.
        *   Displays a Popup on the marker with weather data.
    *   **[NEW]** `ForecastView`: A list or table inside the Popup (or a separate modal) showing 5-day forecast.

## 3. Data Model

### 3.1. City DTO (Backend & Frontend)
```json
{
  "id": 12345,
  "name": "Berlin",
  "latitude": 52.52,
  "longitude": 13.41,
  "country": "Germany",
  "admin1": "Berlin" 
}
```

### 3.2. Weather DTO
```json
{
  "temperature": 21.5,
  "windspeed": 10.2,
  "weathercode": 3,
  "is_day": 1
}
```

### 3.3. Forecast DTO (Backend & Frontend)
```json
{
  "daily": {
    "time": ["2023-10-27", "2023-10-28", ...],
    "temperature_2m_max": [15.2, 16.0, ...],
    "temperature_2m_min": [8.1, 9.5, ...],
    "weathercode": [3, 1, ...]
  }
}
```

## 4. UI/UX
*   **Initial State:** Full-screen map. Search bar.
*   **Search:** User types "Par". Dropdown appears.
*   **Selection:** User clicks "Paris, France". Pin drops.
*   **Weather:** Popup displays current weather.
*   **[NEW] Forecast:**
    *   Inside the popup, a button "Show 5-Day Forecast" appears.
    *   Clicking it expands the popup (or replaces content) to show a list of next 5 days: "Date: Max/Min °C, Condition".

## 5. Implementation Plan

### Phase 1: Backend Update
1.  Add `GET /api/forecast` to `Program.cs`.

### Phase 2: Frontend Update
1.  Update `App.js` to add state for `forecastData` and `showForecast`.
2.  Implement `fetchForecast` function.
3.  Add "Show 5-Day Forecast" button to the popup.
4.  Render the forecast list when available.

### Phase 3: Integration & Polish
1.  Style the list to fit in the popup.
2.  Ensure button toggles or loads data correctly.

## 6. Testing Strategy
*   **Unit Tests:** Verify endpoint returns JSON.
*   **Manual Verification:** Click button -> Verify 5 entries appear.