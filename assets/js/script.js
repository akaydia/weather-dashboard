window.onload = function () {
    // variables
    const API_KEY = "660aa8849ea3b1454ead266471178eb3";
    let searchBtn = document.querySelector("#search-btn");
    let cityInput = document.querySelector("#city-search");
    let currentWeatherDiv = document.querySelector("#current-weather");
    let searchHistory = document.getElementById("search-history");

    let getWeatherData = (city) => {
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
        } // constructor (cityName, forecastDate, temperature, humidity, windSpeed)

        // updates the current weather for today's date
        // checks if the elements are already in the html, otherwise it creates it
        updateCurrentWeather(data) {
            let icon = document.createElement('img');
            icon.src = `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;

            currentWeatherDiv.style.border = "solid 1px black";
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
                city = document.createElement('h3');
                city.id = 'city';
                currentWeatherDiv.appendChild(city);
            }
            city.textContent = `${this.cityName} (${month}/${day}/${year})`;
            city.appendChild(icon);

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
            windSpeed.textContent = `Wind: ${(this.windSpeed * 1.60934).toFixed(1)} KMH`;

            // create humidity element
            let humidity = document.querySelector('#humidity');
            if (!humidity) {
                humidity = document.createElement('p');
                humidity.id = 'humidity';
                currentWeatherDiv.appendChild(humidity);
            }
            humidity.textContent = `Humidity: ${this.humidity}%`;
        } // updateCurrentWeather

        // updates to show the 5 day forecast of a given city
        update5DayForecast(data) {
            let dayForecastHeader = document.querySelector("#dayForecastHeader")
            if (!dayForecastHeader) {
                dayForecastHeader = document.createElement('h3');
                dayForecastHeader.id = 'dayForecastHeader';
            }
            dayForecastHeader.textContent = `5-day forecast`;
            let wrapper5DayForecast = document.getElementById("5-day-forecast")
            wrapper5DayForecast.insertBefore(dayForecastHeader, wrapper5DayForecast.firstChild);

            let forecastData = data.list.filter(weather => {
                return weather.dt_txt.includes('12:00:00');
            });
            let forecastDiv = document.querySelector('#forecast');

            if (!forecastDiv) {
                forecastDiv = document.createElement('div');
                forecastDiv.id = 'forecast';
                document.body.appendChild(forecastDiv);
            } else {
                while (forecastDiv.firstChild) {
                    forecastDiv.removeChild(forecastDiv.firstChild);
                }
            }

            forecastData.forEach((weather) => {
                let icon = document.createElement('img');
                icon.src = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
                icon.classList.add("icon");

                let forecastDate = new Date(weather.dt_txt);
                let month = forecastDate.getMonth() + 1;
                let day = forecastDate.getDate();
                let year = this.forecastDate.getFullYear();

                let card = document.createElement('div');
                card.classList.add('card', 'col-md-2', 'm-3');

                // create date element
                let date = document.createElement('h3');
                date.textContent = `${month}/${day}/${year}`;
                card.appendChild(date);

                // create temperature element
                let temperature = document.createElement('p');
                temperature.textContent = `Temp: ${(weather.main.temp - 273.15).toFixed(1)}°C`;
                card.appendChild(temperature);

                // create wind speed element
                let windSpeed = document.createElement('p');
                windSpeed.textContent = `Wind: ${(weather.wind.speed * 1.60934).toFixed(1)} KMH`;
                card.appendChild(windSpeed);

                // create humidity element
                let humidity = document.createElement('p');
                humidity.textContent = `Humidity: ${weather.main.humidity}%`;
                card.appendChild(humidity);

                card.appendChild(icon);
                forecastDiv.appendChild(card);
            });
        } // update5DayForecast

    } // Weather class

    // Add city to search history
    searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let city = cityInput.value;
        let cityExists = false;
        let history = JSON.parse(localStorage.getItem("history")) || [];
        // check if city exists in search history
        history.forEach(function (element) {
            if (element === city) {
                cityExists = true;
            }
        });
        if (!cityExists) {
            history.push(city);
            localStorage.setItem("history", JSON.stringify(history));
        }
        getWeatherData(city)
            .then((data) => {
                let weather = new Weather();
                weather.updateCurrentWeather(data);
                weather.update5DayForecast(data);
                cityInput.value = "";
            })
            .catch((error) => console.log(error));
        addToSearchHistory(city);

    }); // searchbtn

    // Add city to search history
    let addToSearchHistory = (city) => {
        let buttonExists = false;
        // check if button exists
        let buttons = Array.from(searchHistory.children);
        buttons.forEach(function (element) {
            if (element.textContent === city) {
                buttonExists = true;
            }
        });

        if (!buttonExists) {
            let btn = document.createElement("button");
            btn.classList.add("btn-block");
            btn.textContent = city;
            btn.addEventListener("click", function (e) {
                getWeatherData(city)
                    .then((data) => {
                        let weather = new Weather();
                        weather.updateCurrentWeather(data);
                        weather.update5DayForecast(data);
                    })
                    .catch((error) => console.log(error));
            });
            searchHistory.appendChild(btn);
        }
    };

} // window.onload

