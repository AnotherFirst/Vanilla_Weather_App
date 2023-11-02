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

    temperatureElement.innerHTML = Math.round(
        response.data.temperature.current
    );
    weatherAppUnitElement.value = cityElement.innerHTML = response.data.city;
    descriptionElement.innerHTML = response.data.condition.description;
    humidityElement.innerHTML = response.data.temperature.humidity + "%";
    windSpeedElement.innerHTML = `${response.data.wind.speed}${windSpeedUnit}`;
    timeElement.innerHTML = formatDate(date);
    iconElement.innerHTML = `<img
              src="${response.data.condition.icon_url}"
              alt="weather icon"
              class="weather-app-icon"
          />`;
}

function formatDate(date) {
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
    ];
    let day = days[date.getDay()];
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    // Tuesday 18:00
    return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
    // let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${unitSystem}`;
    let apiUrl =
        baseApiURL +
        "query=" +
        city +
        "&key=" +
        apiKey +
        "&units=" +
        unitSystem;
    // console.log(apiUrl);
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

// *******************************************
// Global variables
// *******************************************

let unitSystem = "metric";
let city = "Miami";

let apiKey = "bd6b645te7b552aa0f390e2137b8oe0e";
let baseApiURL = "https://api.shecodes.io/weather/v1/current?";

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

// *******************************************
// Main program
// *******************************************

let unitBtnElement = document.querySelector("#unitBtn");
unitBtnElement.addEventListener("click", switchUnits);

// Search for Miami as default city when loading the page
searchCity(city);
