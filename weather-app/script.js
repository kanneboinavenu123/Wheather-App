const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');

const cityNameEl = document.getElementById('city-name');
const tempEl = document.getElementById('temperature');
const descEl = document.getElementById('weather-description');
const windEl = document.getElementById('wind-speed');

// WMO Weather interpretation codes (WW)
const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    95: 'Thunderstorm'
};

function getWeatherDescription(code) {
    if (weatherCodes[code]) {
        return weatherCodes[code];
    }
    return 'Unknown weather';
}

async function fetchWeather(city) {
    try {
        // Reset UI
        weatherInfo.classList.add('hidden');
        errorMessage.classList.add('hidden');
        loading.classList.remove('hidden');

        // Geocoding API to get coordinates
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found');
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Weather API
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();
        
        const current = weatherData.current_weather;

        // Update UI
        cityNameEl.textContent = `${name}, ${country}`;
        tempEl.textContent = Math.round(current.temperature);
        descEl.textContent = getWeatherDescription(current.weathercode);
        windEl.textContent = `${current.windspeed} km/h`;

        loading.classList.add('hidden');
        weatherInfo.classList.remove('hidden');
    } catch (error) {
        loading.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        console.error("Error fetching weather:", error);
    }
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});

// Load default city
fetchWeather('New York');
