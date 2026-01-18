import React, { useState } from 'react';
import { getWeatherCondition } from '../utils/weather';
import './WeatherCard.css';

function WeatherCard({ city, currentWeather }) {
  const [showForecast, setShowForecast] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const fetchForecast = async () => {
    if (forecast) return; // Already loaded
    setLoadingForecast(true);
    try {
      const response = await fetch(`/api/forecast?lat=${city.latitude}&lon=${city.longitude}`);
      const data = await response.json();
      setForecast(data.daily);
    } catch (error) {
      console.error("Error fetching forecast:", error);
    } finally {
      setLoadingForecast(false);
    }
  };

  const handleToggleForecast = () => {
    if (!showForecast) {
        fetchForecast();
    }
    setShowForecast(!showForecast);
  };

  if (!currentWeather) {
      return <div className="weather-card-loading">Loading weather...</div>;
  }

  return (
    <div className="weather-card">
      <h3 className="weather-city-name">{city.name}</h3>
      <div className="weather-details">
        <p><strong>Temperature:</strong> {currentWeather.temperature}°C</p>
        <p><strong>Wind:</strong> {currentWeather.windspeed} km/h</p>
        <p><strong>Condition:</strong> {getWeatherCondition(currentWeather.weathercode)}</p>
      </div>

      <button 
        className="forecast-toggle-btn" 
        onClick={handleToggleForecast}
        disabled={loadingForecast}
      >
        {loadingForecast ? "Loading..." : (showForecast ? "Hide 5-Day Forecast" : "Show 5-Day Forecast")}
      </button>

      {showForecast && forecast && (
        <div className="forecast-list">
          <h4>5-Day Forecast</h4>
          <ul>
            {forecast.time.slice(0, 5).map((date, i) => (
              <li key={date} className="forecast-item">
                <span className="forecast-date">{date}</span>
                <span className="forecast-temp">
                    {forecast.temperature_2m_min[i]}°C / {forecast.temperature_2m_max[i]}°C
                </span>
                <span className="forecast-cond">
                    {getWeatherCondition(forecast.weathercode[i])}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WeatherCard;
