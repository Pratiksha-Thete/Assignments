
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");
const loading = document.getElementById("loading");
const weather = document.getElementById("weather");
const unitToggle = document.getElementById("unitToggle");

let isFahrenheit = false;
let lastWeatherData = null;

// Convert weather codes into simple descriptions
function getCondition(code) {
    if (code === 0) return "Clear sky ☀️";
    if ([1, 2, 3].includes(code)) return "Partly cloudy 🌤️";
    if ([45, 48].includes(code)) return "Foggy 🌫️";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle 🌦️";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return "Rainy 🌧️";
    }
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy ❄️";
    if ([95, 96, 99].includes(code)) return "Thunderstorm ⛈️";
    return "Unknown conditions";
}

// Convert Celsius to Fahrenheit when needed
function convertTemperature(celsius) {
    if (isFahrenheit) {
        return (celsius * 9 / 5) + 32;
    }

    return celsius;
}

// Display the weather on the page
function displayWeather(data) {
    lastWeatherData = data;

    const current = data.weather.current;
    const daily = data.weather.daily;

    document.getElementById("cityName").textContent =
        `${data.city.name}, ${data.city.country}`;

    document.getElementById("temperature").textContent =
        `${Math.round(convertTemperature(current.temperature_2m))}°${isFahrenheit ? "F" : "C"}`;

    document.getElementById("condition").textContent =
        getCondition(current.weather_code);

    document.getElementById("humidity").textContent =
        `Humidity: ${current.relative_humidity_2m}%`;

    document.getElementById("wind").textContent =
        `Wind Speed: ${current.wind_speed_10m} km/h`;

    // Display the 3-day forecast
    const forecast = document.getElementById("forecast");
    forecast.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        const date = new Date(daily.time[i] + "T00:00:00");

        const day = date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        const min = Math.round(
            convertTemperature(daily.temperature_2m_min[i])
        );

        const max = Math.round(
            convertTemperature(daily.temperature_2m_max[i])
        );

        forecast.innerHTML += `
            <div class="forecast-card">
                <h3>${day}</h3>
                <p>${getCondition(daily.weather_code[i])}</p>
                <p>${max}° / ${min}° ${isFahrenheit ? "F" : "C"}</p>
            </div>
        `;
    }

    unitToggle.textContent = isFahrenheit
        ? "Switch to °C"
        : "Switch to °F";

    weather.classList.remove("hidden");
}

// Fetch city coordinates and weather data
async function getWeather(city) {
    message.textContent = "";
    weather.classList.add("hidden");
    loading.classList.remove("hidden");

    try {
        // Step 1: Find the city
        const cityResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!cityResponse.ok) {
            throw new Error("Unable to search for the city.");
        }

        const cityData = await cityResponse.json();

        if (!cityData.results || cityData.results.length === 0) {
            throw new Error("City not found. Please try another city.");
        }

        const place = cityData.results[0];

        // Step 2: Get current weather and a 3-day forecast
        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
            `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
            `&forecast_days=3&timezone=auto`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        // Remember the latest searched city
        localStorage.setItem("lastCity", place.name);

        // Update the UI
        displayWeather({
            city: place,
            weather: weatherData
        });

    } catch (error) {
        message.textContent =
            error.message || "Something went wrong. Please try again.";

        weather.classList.add("hidden");
    } finally {
        loading.classList.add("hidden");
    }
}

// Search when the form is submitted
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
    }
});

// Switch between Celsius and Fahrenheit
unitToggle.addEventListener("click", function () {
    isFahrenheit = !isFahrenheit;

    if (lastWeatherData) {
        displayWeather(lastWeatherData);
    }
});

// Load the most recently searched city after refresh
window.addEventListener("DOMContentLoaded", function () {
    const savedCity = localStorage.getItem("lastCity");

    if (savedCity) {
        cityInput.value = savedCity;
        getWeather(savedCity);
    }
});
