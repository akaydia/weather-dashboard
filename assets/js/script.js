const API_KEY = "660aa8849ea3b1454ead266471178eb3";

function getWeatherData(city) {
  return new Promise((resolve, reject) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.cod === 200) {
          resolve(data);
        } else {
          reject(data.message);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

function updateWeather(data) {
  // update current weather data on the page
  let cityName = data.name;
  let temperature = data.main.temp;
  let humidity = data.main.humidity;
  let windSpeed = data.wind.speed;

  let weatherContainer = document.querySelector("#current-weather");
  let cityHeader = document.createElement("h2");
  cityHeader.innerText = cityName;
  weatherContainer.appendChild(cityHeader);

  let temperatureP = document.createElement("p");
  temperatureP.innerText = `Temperature: ${temperature}`;
  weatherContainer.appendChild(temperatureP);

  let windSpeedP = document.createElement("p");
  windSpeedP.innerText = `Wind Speed: ${windSpeed}`;
  weatherContainer.appendChild(windSpeedP);

  let humidityP = document.createElement("p");
  humidityP.innerText = `Humidity: ${humidity}`;
  weatherContainer.appendChild(humidityP);
}

function handleSearch(event) {
  event.preventDefault();

  let city = document.querySelector("#city-search").value;

  getWeatherData(city)
    .then(data => {
      updateWeather(data);
      console.log(data);
    })
    .catch(error => {
      console.error(error);
    });
}

document.querySelector("form").addEventListener("submit", handleSearch);
