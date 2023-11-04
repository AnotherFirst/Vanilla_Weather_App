// *******************************************
// Functions
// *******************************************

function refreshWeather(response) {
    // console.log(response.data);
    // console.log("inside refreshWeather: " + unitSystem);
    let temperatureElement = document.querySelector("#temperature");
    let weatherAppUnitElement = document.querySelector("#weather-app-unit");
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windSpeedElement = document.querySelector("#wind-speed");
    let timeElement = document.querySelector("#time");
    let date = new Date(response.data.time * 1000);
    let iconElement = document.querySelector("#icon");
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
    city = response.data.city;

    temperatureElement.innerHTML = Math.round(
        response.data.temperature.current
    );
    cityElement.innerHTML = city;
    descriptionElement.innerHTML = response.data.condition.description;
    humidityElement.innerHTML = `Humidity: <strong>${response.data.temperature.humidity}%</strong> `;
    windSpeedElement.innerHTML = `  Wind: <strong>${response.data.wind.speed}${windSpeedUnit}</strong>`;
    timeElement.innerHTML = formatDate(date) + ",";
    iconElement.innerHTML = `<img
              src="${response.data.condition.icon_url}"
              alt="weather icon"
              class="weather-app-icon"
          />`;
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
    // Tuesday 18:00
    return `${weekday}, ${month} ${day}, ${hours}:${minutes}`;
}

function searchCity(city) {
    // let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${unitSystem}`;
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
    // let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${unitSystem}`;

    // https://api.shecodes.io/weather/v1/current?lon={lon}&lat={lat}&key={key}

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
    console.log(apiUrl);
    axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
    event.preventDefault();
    let searchInput = document.querySelector("#search-form-input");
    searchCity(searchInput.value, unitSystem);
}

function switchUnits(event) {
    event.preventDefault();
    // console.log("event value " + unitBtnElement.value);
    if (unitBtnElement.value === "Switch to °F") {
        unitSystem = "imperial";
        unitBtnElement.value = "Switch to °C";
    } else if (unitBtnElement.value === "Switch to °C") {
        unitSystem = "metric";
        unitBtnElement.value = "Switch to °F";
    }
    searchCity(city, unitSystem);
    // console.log("return " + unitSystem);
    // return unitSystem;
}

function getPosition(event) {
    navigator.geolocation.getCurrentPosition(searchPosition);
}

// *******************************************
// Global variables
// *******************************************

let unitSystem = "metric";
let city = "Miami";

let apiKey = "bd6b645te7b552aa0f390e2137b8oe0e";
let baseApiUrlCurrent = "https://api.shecodes.io/weather/v1/current?";

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

// *******************************************
// Main program
// *******************************************

let unitBtnElement = document.querySelector("#unit-btn");
unitBtnElement.addEventListener("click", switchUnits);

let getPositionElement = document.querySelector("#get-position-btn");
getPositionElement.addEventListener("click", getPosition);

// Search for Miami as default city when loading the page
searchCity(city);
