import React, { useState, useEffect } from 'react';
import WeatherCard from './WeatherCard';
import './FavoritesSidebar.css';

function FavoritesSidebar({ onSelectCity }) {
  const [favorites, setFavorites] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [expandedCityId, setExpandedCityId] = useState(null);

  // Fetch favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        // For each favorite, fetch current weather
        const favoritesWithWeather = await Promise.all(data.map(async (city) => {
          try {
            const weatherRes = await fetch(`/api/weather?lat=${city.latitude}&lon=${city.longitude}`);
            const weatherData = await weatherRes.json();
            return { ...city, weather: weatherData.current_weather };
          } catch (e) {
            return { ...city, weather: null };
          }
        }));
        setFavorites(favoritesWithWeather);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const handleSearch = async (val) => {
    setQuery(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      const lang = navigator.language.split('-')[0];
      const response = await fetch(`/api/cities?query=${encodeURIComponent(val)}&language=${lang}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Error searching cities:", error);
    }
  };

  const addFavorite = async (city) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: city.name,
          latitude: city.latitude,
          longitude: city.longitude,
          country: city.country,
          admin1: city.admin1
        })
      });

      if (response.ok) {
        setQuery('');
        setSearchResults([]);
        fetchFavorites(); // Refresh list
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFavorite = async (id, e) => {
    e.stopPropagation(); // Prevent clicking the item
    try {
      await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      setFavorites(favorites.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const toggleExpand = (id, e) => {
      e.stopPropagation();
      setExpandedCityId(expandedCityId === id ? null : id);
  };

  return (
    <div className="sidebar">
      <h2>Favorite Cities</h2>
      
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Add city..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <ul className="sidebar-dropdown">
            {searchResults.map(city => (
              <li key={city.id} onClick={() => addFavorite(city)}>
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="favorites-list">
        {favorites.map(city => (
          <div key={city.id} className="favorite-item-container">
            <div className="favorite-item" onClick={() => onSelectCity(city)}>
              <div className="favorite-info">
                <span className="city-name">{city.name}</span>
                {city.weather ? (
                  <span className="city-temp">{city.weather.temperature}°C</span>
                ) : (
                  <span className="city-loading">...</span>
                )}
              </div>
              <div className="favorite-actions">
                  <button className="expand-btn" onClick={(e) => toggleExpand(city.id, e)}>
                      {expandedCityId === city.id ? '▲' : '▼'}
                  </button>
                  <button className="remove-btn" onClick={(e) => removeFavorite(city.id, e)}>×</button>
              </div>
            </div>
            {expandedCityId === city.id && (
                <div className="favorite-details">
                    <WeatherCard city={city} currentWeather={city.weather} />
                </div>
            )}
          </div>
        ))}
        {favorites.length === 0 && <p className="empty-msg">No favorites yet.</p>}
      </div>
    </div>
  );
}

export default FavoritesSidebar;
