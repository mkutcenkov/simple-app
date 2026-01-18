export function getWeatherCondition(code) {
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
