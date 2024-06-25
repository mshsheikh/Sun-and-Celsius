document.addEventListener("DOMContentLoaded", () => {
  const cityCountryMapping = {
    "New York": "USA",
    London: "UK",
    Paris: "France",
    Sydney: "Australia",
    Tokyo: "Japan",
    Moscow: "Russia",
    Berlin: "Germany",
    Shanghai: "China",
    Rome: "Italy",
    Toronto: "Canada",
    Beijing: "China",
    Cairo: "Egypt",
    Bangkok: "Thailand",
    Phuket: "Thailand",
    Dubai: "UAE",
    Austin: "USA",
    Boston: "USA",
    "San Jose": "USA",
    Chicago: "USA",
    Istanbul: "Turkey",
    Madrid: "Spain",
    Mumbai: "India",
    Lagos: "Nigeria",
    Jakarta: "Indonesia",
  };

  const allCities = Object.keys(cityCountryMapping);
  const apiKey = "b8aa09d2a5194d90af3235023241406";
  const popularCitiesSection = document.querySelector(".slider");
  const popularCitiesHeading = document.getElementById(
    "popular-cities-heading"
  );
  const slideDuration = 2.6; // seconds
  let currentSlide = 0;
  let intervalId;

  function getRandomCities(cities, num) {
    const shuffled = cities.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  async function fetchWeatherForCity(city) {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  }

  async function displayRandomCitiesWeather() {
    const cities = getRandomCities(allCities, 5);
    const promises = cities.map((city) => fetchWeatherForCity(city));
    const results = await Promise.all(promises);

    results.forEach((data) => {
      const cityTime = new Date(data.location.localtime);
      const hours = cityTime.getHours() % 12 || 12;
      const minutes = cityTime.getMinutes().toString().padStart(2, "0");
      const ampm = cityTime.getHours() >= 12 ? "PM" : "AM";
      const country = cityCountryMapping[data.location.name];
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.innerHTML = `
        <div class="weather-card">
          <img src="${data.current.condition.icon}" alt="Weather icon">
          <h3>${data.location.name}</h3>
          <p class="country">${country}</p>
          <p class="temperature-details"><span class="temperature">${data.current.temp_c}°C</span></p>
          <p>${hours}:${minutes} ${ampm}</p>
        </div>
      `;
      popularCitiesSection.appendChild(slide);
    });

    startSlider();
  }

  function startSlider() {
    intervalId = setInterval(() => {
      showNextSlide();
    }, slideDuration * 1000);
    showNextSlide();
  }

  function showNextSlide() {
    const slides = document.querySelectorAll(".slide");
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
    updateSlideTransforms();
  }

  function updateSlideTransforms() {
    const slides = document.querySelectorAll(".slide");
    const angle = 360 / slides.length;
    slides.forEach((slide, index) => {
      const offset = index - currentSlide;
      slide.style.transform = `rotateY(${offset * angle}deg) translateZ(100px)`;
    });
  }

  displayRandomCitiesWeather();

  document.getElementById("search-button").addEventListener("click", () => {
    const city = document.getElementById("city-input").value;
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        updateWeatherInfo(data);
        updateBackgroundGradient(data);
        hidePopularCities();
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  });

  function updateWeatherInfo(data) {
    document.getElementById("city-name").textContent = data.location.name;
    document.getElementById(
      "temperature"
    ).innerHTML = `Temperature: <span class="temperature">${data.current.temp_c}°C</span>`;
    document.getElementById(
      "feels-like"
    ).textContent = `Feels like: ${data.current.feelslike_c}°C`;
    document.getElementById(
      "wind-speed"
    ).textContent = `Wind speed: ${data.current.wind_kph} kph`;
    document.getElementById(
      "rain"
    ).textContent = `Rain: ${data.current.precip_mm} mm`;
    const cityTime = new Date(data.location.localtime);
    const hours = cityTime.getHours() % 12 || 12;
    const minutes = cityTime.getMinutes().toString().padStart(2, "0");
    const ampm = cityTime.getHours() >= 12 ? "PM" : "AM";
    const date = cityTime.toLocaleDateString();
    document.getElementById("forecast-date").textContent = `Date: ${date}`;
    document.getElementById(
      "forecast-time"
    ).textContent = `Time: ${hours}:${minutes} ${ampm}`;
    document.getElementById(
      "weather-icon"
    ).innerHTML = `<img src="${data.current.condition.icon}" alt="Weather icon">`;
    document.querySelector(".weather-info").classList.add("visible");
  }

  function updateBackgroundGradient(data) {
    const condition = data.current.condition.text.toLowerCase();
    let gradient;
    if (condition.includes("rain")) {
      gradient = "linear-gradient(270deg, #00c6ff, #0072ff)";
    } else if (condition.includes("cloud")) {
      gradient = "linear-gradient(270deg, #bdc3c7, #2c3e50)";
    } else if (condition.includes("clear")) {
      gradient = "linear-gradient(270deg, #ff9800, #ffeb3b)";
    } else {
      gradient = "linear-gradient(270deg, #4caf50, #8bc34a)";
    }
    document.body.style.background = gradient;
  }

  function hidePopularCities() {
    popularCitiesHeading.style.display = "none";
    popularCitiesSection.style.display = "none";
  }
});
