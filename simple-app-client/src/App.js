import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import FavoritesSidebar from './components/FavoritesSidebar';
import WeatherCard from './components/WeatherCard';

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
                <div className="weather-popup-container">
                  <WeatherCard 
                    city={selectedCity} 
                    currentWeather={weather} 
                  />
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

export default App;