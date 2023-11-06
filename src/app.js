// *******************************************
// Functions
// *******************************************

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayForecast(response) {
    // console.log(response.data);
    let forecastHTML = "";

    response.data.daily.forEach(function (day, index) {
        if (index < 6) {
            forecastHTML =
                forecastHTML +
                ` 
                  <div class="forecast-day-container">
                    <div class="forecast-day">${formatDayShort(day.time)}</div>
                    <div class="forecast-icon">
                      <img
                        src="${day.condition.icon_url}"
                        alt="${day.condition.description}"
                        width="75"
                      />
                    </div>
                    <div class="forecast-temps">
                      <span class="forecast-temp-max">${Math.round(
                          day.temperature.maximum
                      )}° </span>
                      <span class="forecast-temp-min">${Math.round(
                          day.temperature.minimum
                      )}°</span>
                    </div>
                  </div>
                `;
        }
    });

    let forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = forecastHTML;
}

function formatDate(date) {
    let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    let month = months[date.getMonth()];
    let day = date.getDate();
    let weekday = days[date.getDay()];
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    return `${weekday}, ${month} ${day}, ${hours}:${minutes}`;
}

function formatDayShort(timestamp) {
    let date = new Date(timestamp * 1000);
    let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

    return weekdays[date.getDay()];
}

function getForecastCity(city) {
    let apiUrlForecast =
        baseApiUrlForecast +
        "query=" +
        city +
        "&key=" +
        apiKey +
        "&units=" +
        unitSystem;
    // console.log(apiUrl);
    axios.get(apiUrlForecast).then(displayForecast);
}

function getPosition(event) {
    navigator.geolocation.getCurrentPosition(searchPosition);
}

function handleSearchSubmit(event) {
    event.preventDefault();
    let searchInput = document.querySelector("#search-form-input");
    searchCity(searchInput.value, unitSystem);
}

function refreshWeather(response) {
    // console.log(response.data);
    let cityElement = document.querySelector("#city");
    let timeElement = document.querySelector("#time");
    let date = new Date(response.data.time * 1000);
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windSpeedElement = document.querySelector("#wind-speed");
    let weatherAppUnitElement = document.querySelector("#temperature-unit");
    let windSpeedUnit = null;
    if (unitSystem === "metric") {
        // console.log("is metric");
        windSpeedUnit = "m/s";
        weatherAppUnitElement.innerHTML = "°C";
    } else if (unitSystem === "imperial") {
        // console.log("is imperial");
        windSpeedUnit = "mi/h";
        weatherAppUnitElement.innerHTML = "°F";
    }
    let iconElement = document.querySelector("#icon");
    let temperatureElement = document.querySelector("#temperature");
    let feelsLikeElement = document.querySelector("#feels-like");
    city = response.data.city;

    cityElement.innerHTML = city;
    timeElement.innerHTML = `Last updated: ${formatDate(date)}`;
    descriptionElement.innerHTML = capitalizeFirstLetter(
        response.data.condition.description
    );
    humidityElement.innerHTML = `Humidity: <strong>${response.data.temperature.humidity}%</strong> `;
    windSpeedElement.innerHTML = ` Wind: <strong>${Math.round(
        response.data.wind.speed
    )} ${windSpeedUnit}</strong>`;
    iconElement.innerHTML = `
      <img
        src="${response.data.condition.icon_url}"
        alt="${response.data.condition.description}"
        class="weather-app-icon"
      />`;
    temperatureElement.innerHTML = Math.round(
        response.data.temperature.current
    );
    feelsLikeElement.innerHTML = `Feels like: ${Math.round(
        response.data.temperature.feels_like
    )}°`;

    getForecastCity(response.data.city);
}

function searchCity(city) {
    let apiUrl =
        baseApiUrlCurrent +
        "query=" +
        city +
        "&key=" +
        apiKey +
        "&units=" +
        unitSystem;
    // console.log(apiUrl);
    axios.get(apiUrl).then(refreshWeather);
}

function searchPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let apiUrl =
        baseApiUrlCurrent +
        "lon=" +
        lon +
        "&lat=" +
        lat +
        "&key=" +
        apiKey +
        "&units=" +
        unitSystem;
    // console.log(apiUrl);
    axios.get(apiUrl).then(refreshWeather);
}

function switchUnits(event) {
    event.preventDefault();
    // trim is necessary to remove line break and tabs from original html
    if (unitBtnElement.innerHTML.trim() === "Convert to °F") {
        unitSystem = "imperial";
        unitBtnElement.innerHTML = "Convert to °C";
    } else if (unitBtnElement.innerHTML.trim() === "Convert to °C") {
        unitSystem = "metric";
        unitBtnElement.innerHTML = "Convert to °F";
    }
    searchCity(city, unitSystem);
}

// *******************************************
// Global variables
// *******************************************

let unitSystem = "metric";
let city = "Munich";

let apiKey = "bd6b645te7b552aa0f390e2137b8oe0e";
let baseApiUrlCurrent = "https://api.shecodes.io/weather/v1/current?";
let baseApiUrlForecast = "https://api.shecodes.io/weather/v1/forecast?";

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

// *******************************************
// Main program
// *******************************************

let unitBtnElement = document.querySelector("#unit-btn");
unitBtnElement.addEventListener("click", switchUnits);

let getPositionElement = document.querySelector("#get-position-btn");
getPositionElement.addEventListener("click", getPosition);

// Search for Munich as default city when loading the page
searchCity(city);
