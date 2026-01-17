# Design Proposal: Favorite Cities with SQLite & EF Core

## 1. Overview
We will add a "Favorite Cities" feature allowing users to maintain a persistent list of cities on the right side of the application. The list will display the city name and its current weather.

## 2. Architecture

### Backend (ASP.NET Core)
We will transition from a single `Program.cs` file to a more structured architecture to support Entity Framework and the Repository Pattern.

**Tech Stack:**
-   SQLite (Database)
-   Entity Framework Core (ORM)
-   Repository Pattern

**Components:**
1.  **Entities:**
    -   `City`: Stores `Id`, `Name`, `Latitude`, `Longitude`, `Country`, `Admin1`.
2.  **Data Layer:**
    -   `AppDbContext`: EF Core context.
    -   `Migrations`: To manage database schema.
3.  **Repository Layer (Registry Pattern):**
    -   `ICityRepository`: Interface for data access.
    -   `CityRepository`: Implementation using `AppDbContext`.
4.  **API Endpoints:**
    -   `GET /api/favorites`: Retrieve all saved cities.
    -   `POST /api/favorites`: Add a new city.
    -   `DELETE /api/favorites/{id}`: Remove a city.

### Frontend (React)
1.  **Layout:**
    -   Split the main view: Map (Left/Center) + Sidebar (Right).
    -   Responsive design (Sidebar moves to bottom on mobile).
2.  **Components:**
    -   `Sidebar`: Container for the favorites list.
    -   `FavoriteCityItem`: Displays name and fetches/displays current weather.
3.  **Interaction:**
    -   **Add:** specific search for adding, or "Add to Favorites" button on the main search/popup. The requirement says "User shall be able to search city for adding". This implies a dedicated search in the sidebar or a mode. We will add a "Search to Add" input in the sidebar.
    -   **Remove:** Delete button on each item.

## 3. Implementation Plan

### Step 1: Backend Setup
-   Install NuGet packages:
    -   `Microsoft.EntityFrameworkCore.Sqlite`
    -   `Microsoft.EntityFrameworkCore.Tools`
    -   `Microsoft.EntityFrameworkCore.Design`
-   Create folder structure: `Data`, `Models`, `Repositories`.
-   Implement `City` model and `AppDbContext`.
-   Implement `CityRepository`.
-   Register services in `Program.cs`.
-   Create `FavoritesEndpoints` (using Minimal APIs or Controllers).
-   Run Migrations.

### Step 2: Frontend Implementation
-   Create `Sidebar` component.
-   Add state management for favorites.
-   Implement API calls (`fetchFavorites`, `addFavorite`, `removeFavorite`).
-   Implement individual weather fetching for each favorite (using existing `/api/weather` or direct Open-Meteo).

### Step 3: Integration & Testing
-   Verify persistence (restart server).
-   Verify "Add" and "Remove" flows.
-   Verify layout responsiveness.

## 4. Database Schema (City)
```csharp
public class City
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Country { get; set; } = string.Empty;
    public string? Admin1 { get; set; } // Region/State
}
```
