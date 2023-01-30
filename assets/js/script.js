const API_KEY = "660aa8849ea3b1454ead266471178eb3";
let searchBtn = document.querySelector("#search-btn");
let cityInput = document.querySelector("#city-search");
let currentWeatherDiv = document.querySelector("#current-weather");

const getWeatherData = (city) => {
    return new Promise((resolve, reject) => {
        let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data.cod === "200") {
                    console.log(data);
                    resolve(data);
                } else {
                    reject(data.message);
                }
            })
            .catch((error) => reject(error));
    });
};

// weather class
// creates an object for the data given, and instantiates the following properties
// cityName, forecastDate, temperature, humidity, windspeed
class Weather {
    constructor(cityName, forecastDate, temperature, humidity, windSpeed) {
        this.cityName = cityName;
        this.forecastDate = forecastDate;
        this.temperature = temperature;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
    }

    // updates the current weather for today's date
    // checks if the elements are already in the html, otherwise it creates it
    updateCurrentWeather(data) {
        console.log(data);
        this.cityName = data.city.name;
        this.forecastDate = new Date(data.list[0].dt_txt);
        this.temperature = data.list[0].main.temp;
        this.humidity = data.list[0].main.humidity;
        this.windSpeed = data.list[0].wind.speed;

        let month = this.forecastDate.getMonth() + 1;
        let day = this.forecastDate.getDate();
        let year = this.forecastDate.getFullYear();

        // convert temp from K to C
        let tempCelsius = this.temperature - 273.15;

        // create city and date elements
        let city = document.querySelector('#city');
        if (!city) {
            city = document.createElement('p');
            city.id = 'city';
            currentWeatherDiv.appendChild(city);
        }
        city.textContent = `${this.cityName} (${month}/${day}/${year})`;

        // create temperature element
        let temperature = document.querySelector('#temperature');
        if (!temperature) {
            temperature = document.createElement('p');
            temperature.id = 'temperature';
            currentWeatherDiv.appendChild(temperature);
        }
        temperature.textContent = `Temperature: ${tempCelsius.toFixed(1)}°C`;

        // create wind speed element
        let windSpeed = document.querySelector('#windSpeed');
        if (!windSpeed) {
            windSpeed = document.createElement('p');
            windSpeed.id = 'windSpeed';
            currentWeatherDiv.appendChild(windSpeed);
        }
        windSpeed.textContent = `Wind Speed: ${this.windSpeed}MPH`;

        // create humidity element
        let humidity = document.querySelector('#humidity');
        if (!humidity) {
            humidity = document.createElement('p');
            humidity.id = 'humidity';
            currentWeatherDiv.appendChild(humidity);
        }
        humidity.textContent = `Humidity: ${this.humidity}%`;
    }


    update5DayForecast() {

    }

}

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let city = cityInput.value;
    getWeatherData(city)
        .then((data) => {
            let weather = new Weather(data);
            weather.updateCurrentWeather(data);
            weather.update5DayForecast();
        })
        .catch((error) => console.error(error));
});
