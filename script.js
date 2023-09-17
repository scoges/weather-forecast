var APIKey = "943028596f95a56ea44118254164c793";
var lastCitySearched;
var storedCities;
var cities = [];

if (localStorage.getItem("cities")) {
    storedCities = JSON.parse(localStorage.getItem("cities"));
    console.log(storedCities);
    lastCitySearched = storedCities[storedCities.length - 1];
    cities = storedCities;
}

renderLastCityInfo();
console.log("cities", cities);

document.getElementById("search-city").addEventListener("click", function (event) {
    event.preventDefault();

    var city = document.getElementById("city-input").value;
    console.log(city);

    var queryURL1 =
        "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;

    fetch(queryURL1)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            lat = response.coord.lat;
            lon = response.coord.lon;
            cities.push(city);
            localStorage.setItem("cities", JSON.stringify(cities));

            var cityList = document.getElementById("city-list");
            var cityItem = document.createElement("li");
            cityItem.className = "list-group-item city-item";
            cityItem.textContent = response.name;
            cityItem.setAttribute("lat", response.coord.lat);
            cityItem.setAttribute("lon", response.coord.lon);
            cityList.insertBefore(cityItem, cityList.firstChild);

            cityItem.addEventListener("click", function () {
                lat = this.getAttribute("lat");
                lon = this.getAttribute("lon");
                renderCityName(response);
                renderCityInfo(lat, lon);
            });
            renderCityName(response);
            renderCityInfo(lat, lon);
        });
});

function renderLastCityInfo() {
    var queryURL1 =
        "https://api.openweathermap.org/data/2.5/weather?q=" + lastCitySearched + "&units=imperial&appid=" + APIKey;

    fetch(queryURL1)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            lat = response.coord.lat;
            lon = response.coord.lon;

            renderCityName(response);
            renderCityInfo(lat, lon);
        });
}

function renderCityName(response) {
    var currentDate = new Date().toLocaleDateString("en-US");
    var cardTitle = document.querySelector(".card-title");
    cardTitle.textContent = `${response.name} (${currentDate})`;
    var weatherIcon = document.createElement("img");
    var iconCode = response.weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
    weatherIcon.setAttribute("src", iconUrl);
    cardTitle.appendChild(weatherIcon);
}

function renderCityInfo(lat, lon) {
    var queryURL2 =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;

    fetch(queryURL2)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            var temperatureInFahrenheit = response.current.temp;
            var temperatureInCelsius = fahrenheitToCelsius(temperatureInFahrenheit);

            document.getElementById("temperature").textContent = `Temperature: ${temperatureInCelsius} °C`;
            document.getElementById("humidity").textContent = `Humidity: ${response.current.humidity}%`;
            document.getElementById("wind-speed").textContent = `Wind Speed: ${response.current.wind_speed} MPH`;
            var uvIndexContainer = document.getElementById("uv-index");
            uvIndexContainer.textContent = "UV Index: ";
            var uviSpan = document.createElement("span");
            uviSpan.textContent = response.current.uvi;
            uvIndexContainer.appendChild(uviSpan);
            renderForecast(response);
        });
}

function renderForecast(response) {
    var forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";
    var days = response.daily.slice(1, 6);

    days.forEach(function (day) {
        var dayCard = document.createElement("div");
        dayCard.className = "card col-md-4 daycard";
        dayCard.style.backgroundColor = "lightblue";
        dayCard.style.marginRight = "5px";
        dayCard.style.fontSize = "15px";

        var dayCardBody = document.createElement("div");
        dayCardBody.className = "card-body";
        dayCard.appendChild(dayCardBody);

        var dayCardName = document.createElement("h6");
        dayCardName.className = "card-title";
        var datestamp = new Date(day.dt * 1000).toLocaleDateString("en-US");
        dayCardName.textContent = datestamp;
        dayCardBody.appendChild(dayCardName);

        var weatherIcon = document.createElement("img");
        var iconCode = day.weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + ".png";
        weatherIcon.setAttribute("src", iconUrl);
        dayCardBody.appendChild(weatherIcon);

        var dayTemp = document.createElement("p");
        var temperatureInFahrenheit = day.temp.max;
        var temperatureInCelsius = fahrenheitToCelsius(temperatureInFahrenheit);
        dayTemp.textContent = `Temp: ${temperatureInCelsius} °C`;
        dayCardBody.appendChild(dayTemp);

        var dayHumidity = document.createElement("p");
        dayHumidity.textContent = `Humidity: ${day.humidity}%`;
        dayCardBody.appendChild(dayHumidity);

        forecastContainer.appendChild(dayCard);
    });
}

function fahrenheitToCelsius(fahrenheit) {
    const celsius = (fahrenheit - 32) / 1.8;
    return celsius;
}


if (lastCitySearched) {
    renderLastCityInfo();
}