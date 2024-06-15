document.getElementById('search-button').addEventListener('click', getWeather);

function getWeather() {
    const city = document.getElementById('city-input').value;
    const apiKey = 'b8aa09d2a5194d90af3235023241406'; // Replace with your WeatherAPI key
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    console.log('Fetching weather data for:', city); // Logging city name

    fetch(apiUrl)
        .then(response => {
            console.log('API response status:', response.status); // Logging response status
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data received:', data); // Logging received data
            updateWeatherInfo(data);
            updateBackgroundGradient(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function updateWeatherInfo(data) {
    document.getElementById('city-name').textContent = data.location.name;
    document.getElementById('temperature').textContent = `Temperature: ${data.current.temp_c} °C (${data.current.temp_f} °F)`;
    document.getElementById('feels-like').textContent = `Feels like: ${data.current.feelslike_c} °C (${data.current.feelslike_f} °F)`;
    document.getElementById('wind-speed').textContent = `Wind speed: ${data.current.wind_kph} kph`;
    document.getElementById('rain').textContent = data.current.precip_mm ? `Rain: ${data.current.precip_mm} mm` : 'Rain: 0 mm';
    const iconUrl = data.current.condition.icon;
    document.getElementById('weather-icon').innerHTML = `<img src="${iconUrl}" alt="Weather icon">`;

    const weatherInfo = document.querySelector('.weather-info');
    weatherInfo.classList.remove('hidden');
    weatherInfo.classList.add('visible');
}

function updateBackgroundGradient(data) {
    let gradientColors;

    if (data.current.temp_c > 30) {
        // Hot weather
        gradientColors = ['#ff7e5f', '#feb47b'];
    } else if (data.current.temp_c <= 30 && data.current.temp_c > 15) {
        // Warm weather
        gradientColors = ['#4facfe', '#00f2fe'];
    } else {
        // Cold weather
        gradientColors = ['#1a2a6c', '#b21f1f', '#fdbb2d'];
    }

    const newGradient = `linear-gradient(270deg, ${gradientColors.join(', ')}, #4facfe)`;
    document.body.style.background = newGradient;
    document.body.style.backgroundSize = '1600% 100%';
    document.body.style.animation = 'none';
    setTimeout(() => {
        document.body.style.animation = 'backgroundAnimation 60s ease infinite';
    }, 10); // Restart animation to apply new colors
}