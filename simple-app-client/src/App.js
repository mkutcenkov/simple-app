import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import FavoritesSidebar from './components/FavoritesSidebar';

// Fix for leaflet marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to change map view
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

function App() {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [showForecast, setShowForecast] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  // Default center: London
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);

  useEffect(() => {
    const fetchCities = async () => {
      if (query.length < 2) {
        setCities([]);
        setFocusedIndex(-1);
        return;
      }
      try {
        const lang = navigator.language.split('-')[0];
        const response = await fetch(`/api/cities?query=${encodeURIComponent(query)}&language=${lang}`);
        const data = await response.json();
        setCities(data.results || []);
        setFocusedIndex(-1);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    const timeoutId = setTimeout(fetchCities, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setMapCenter([city.latitude, city.longitude]);
    setQuery(`${city.name}, ${city.country}`);
    setShowDropdown(false);
    setFocusedIndex(-1);
    setShowForecast(false);
    setForecast(null);
    fetchWeather(city.latitude, city.longitude);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || cities.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < cities.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < cities.length) {
        handleSelectCity(cities[focusedIndex]);
      }
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await response.json();
      setWeather(data.current_weather);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const fetchForecast = async () => {
    if (!selectedCity) return;
    try {
      const response = await fetch(`/api/forecast?lat=${selectedCity.latitude}&lon=${selectedCity.longitude}`);
      const data = await response.json();
      setForecast(data.daily);
      setShowForecast(true);
    } catch (error) {
      console.error("Error fetching forecast:", error);
    }
  };

  const handleToggleForecast = () => {
    if (showForecast) {
      setShowForecast(false);
    } else {
      fetchForecast();
    }
  };

  return (
    <div className="app-container">
      <div className="map-container">
        <div className="search-box" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search city worldwide..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
        />
        {showDropdown && cities.length > 0 && (
          <ul className="dropdown">
            {cities.map((city, index) => (
              <li 
                key={city.id} 
                onClick={() => handleSelectCity(city)}
                className={index === focusedIndex ? 'focused' : ''}
              >
                {city.name}, {city.admin1 && `${city.admin1}, `}{city.country}
              </li>
            ))}
          </ul>
        )}
      </div>

        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={mapCenter} />
          {selectedCity && (
            <Marker position={[selectedCity.latitude, selectedCity.longitude]}>
              <Popup>
                <div className="weather-popup">
                  <h3>{selectedCity.name}</h3>
                  {weather ? (
                    <div>
                      <p>Temperature: {weather.temperature}°C</p>
                      <p>Wind Speed: {weather.windspeed} km/h</p>
                      <p>Condition: {getWeatherCondition(weather.weathercode)}</p>
                      
                      <button className="forecast-btn" onClick={handleToggleForecast}>
                        {showForecast ? "Hide Forecast" : "Show 5-Day Forecast"}
                      </button>

                      {showForecast && forecast && (
                        <div className="forecast-list">
                          <h4>5-Day Forecast</h4>
                          <ul>
                            {forecast.time.slice(0, 5).map((date, i) => (
                              <li key={date}>
                                <strong>{date}:</strong> {forecast.temperature_2m_min[i]}°C - {forecast.temperature_2m_max[i]}°C, {getWeatherCondition(forecast.weathercode[i])}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>Loading weather...</p>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      <FavoritesSidebar onSelectCity={handleSelectCity} />
    </div>
  );
}

function getWeatherCondition(code) {
  const conditions = {
    0: 'Clear sky',
    1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Drizzle: Light', 53: 'Drizzle: Moderate', 55: 'Drizzle: Dense intensity',
    61: 'Rain: Slight', 63: 'Rain: Moderate', 65: 'Rain: Heavy intensity',
    71: 'Snow fall: Slight', 73: 'Snow fall: Moderate', 75: 'Snow fall: Heavy intensity',
    95: 'Thunderstorm: Slight or moderate',
  };
  return conditions[code] || 'Unknown';
}

export default App;