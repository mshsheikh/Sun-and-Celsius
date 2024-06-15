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
            hidePopularCities(); // Hide the popular cities section
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
    document.getElementById('forecast-date').textContent = `Date: ${data.location.localtime}`;
    const iconUrl = data.current.condition.icon;
    document.getElementById('weather-icon').innerHTML = `<img src="${iconUrl}" alt="Weather icon">`;

    document.getElementById('air-quality').textContent = `Air Quality: ${data.current.air_quality}`;
    document.getElementById('sunrise').textContent = `Sunrise: ${data.current.sunrise}`;
    document.getElementById('sunset').textContent = `Sunset: ${data.current.sunset}`;
    document.getElementById('uv-index').textContent = `UV Index: ${data.current.uv}`;

    const weatherInfo = document.querySelector('.weather-info');
    weatherInfo.classList.remove('hidden');
    weatherInfo.classList.add('visible');

    const additionalInfo = document.querySelector('.additional-info');
    additionalInfo.classList.remove('hidden');
    additionalInfo.classList.add('visible');
}

function updateBackgroundGradient(data) {
    let gradientColors;

    if (data.current.temp_c > 30) {
        // Hot weather
        gradientColors = ['#ff7e5f', '#feb47b'];
    } else if (data.current.temp_c > 20) {
        // Warm weather
        gradientColors = ['#ff9a9e', '#fad0c4'];
    } else if (data.current.temp_c > 10) {
        // Mild weather
        gradientColors = ['#a18cd1', '#fbc2eb'];
    } else {
        // Cold weather
        gradientColors = ['#667eea', '#764ba2'];
    }

    document.body.style.background = `linear-gradient(270deg, ${gradientColors.join(', ')})`;
}

function hidePopularCities() {
    const popularCitiesSection = document.querySelector('.random-cities');

    popularCitiesSection.classList.add('hidden-section');

    // Optionally, you can remove the element from the DOM after animation
    setTimeout(() => {
        popularCitiesSection.style.display = 'none';
    }, 500); // Match the duration of the slideOutSection animation
}

// Initialize with random city weather on page load
document.addEventListener('DOMContentLoaded', getRandomCitiesWeather);

function getRandomCitiesWeather() {
    const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'];
    const apiKey = 'b8aa09d2a5194d90af3235023241406'; // Replace with your WeatherAPI key

    cities.forEach(city => {
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const cityWeatherDiv = document.createElement('div');
                cityWeatherDiv.classList.add('city-weather');
                cityWeatherDiv.innerHTML = `
                    <img src="${data.current.condition.icon}" alt="Weather icon">
                    <div>
                        <h4>${data.location.name}</h4>
                        <p>${data.current.temp_c} °C (${data.current.temp_f} °F)</p>
                    </div>
                `;
                document.getElementById('random-cities-weather').appendChild(cityWeatherDiv);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    });
}
