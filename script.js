"use strict";
const kontejner = document.querySelector(".container");
const error = document.querySelector(".error");
const search = document.querySelector(".search");

let weatherData;

const conditionMapping = {
  Sunny: ["Sunny", "Clear"],
  "Partly Cloudy": ["Partly Cloudy"],
  Cloudy: ["Cloudy", "Overcast ", "Mist", "Fog", "Freezing Fog"],
  Rain: [
    "Patchy Rain Possible ",
    "Patchy Light Drizzle",
    "Light Drizzle",
    "Patchy Light Rain",
    "Light Rain",
    "Moderate Rain at Times",
    "Moderate Rain",
    "Heavy Rain at Times",
    "Heavy Rain",
    "Light Freezing Rain",
    "Moderate or Heavy Freezing Rain",
    "Light Rain Shower ",
    "Moderate or Heavy Rain Shower",
    "Patchy rain nearby",
  ],
  Thunderstorm: [
    "Thundery Outbreaks Possible",
    "Patchy Light Rain with Thunder",
    "Moderate or Heavy Rain with Thunder",
  ],
  Snow: [
    "Patchy Snow Possible ",
    "Patchy Sleet Possible",
    "Patchy Freezing Drizzle Possible",
    "Blowing Snow",
    "Blizzard",
    "Light Sleet",
    "Moderate or Heavy Sleet",
    "Patchy Light Snow",
    "Light Snow ",
    "Patchy Moderate Snow",
    "Moderate Snow ",
    "Patchy Heavy Snow",
    "Heavy Snow",
    "Ice Pellets",
    "Light Sleet Showers ",
    "Moderate or Heavy Sleet Showers",
    "Light Snow Showers",
    "Moderate or Heavy Snow Showers",
    "Light Showers of Ice Pellets",
    "Moderate or Heavy Showers of Ice Pellets",
    "Patchy Light Snow with Thunder",
    "Moderate or Heavy Snow with Thunder",
  ],
};
const clearPreviousResults = function () {
  // Clear all the sections where data is rendered
  error.innerHTML = "";
  document.querySelector(".starter").innerHTML = "";
  document.querySelector(".location-date").innerHTML = "";
  document.querySelector(".weather-info").innerHTML = "";
  document.querySelector(".weather-conditions").innerHTML = "";
  document.querySelector(".weather-forecast").innerHTML = "";
};
const renderError = function (
  message = "No city found for your query! Please try again!"
) {
  clearPreviousResults();
  error.innerHTML = "";
  const markup = `
  <p class="error-text">
  ${message}
  </p>
  `;
  error.insertAdjacentHTML("beforeend", markup);
};

const loadSearchResult = async function (country) {
  try {
    clearPreviousResults();
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=ff2ee75c4a9d4f738bc222825241209&q=${country}&days=4&aqi=no&alerts=no`
    );

    // If response is not ok, handle the error based on the status code
    if (!res.ok) {
      const message =
        res.status === 400 ? "City not found!" : `Error: ${res.status}`;
      throw new Error(message);
    }

    const data = await res.json();
    weatherData = data;
  } catch (err) {
    weatherData = null;
    renderError(err.message);
  }
};

const init = async function (query) {
  clearPreviousResults();
  await loadSearchResult(query);
  if (!weatherData) return;
  renderLocationDate();
  renderWeatherInfo();
  renderWeatherConditions();
  renderForecast();
};

search.addEventListener("submit", async function (e) {
  e.preventDefault();
  const query = getQuery();
  await init(query);
});

const formatDate = function (curDate) {
  const date = new Date(curDate);

  const optionsWeekday = { weekday: "long" };
  const optionsDayMonth = { day: "numeric", month: "short" };

  // Get formatted weekday and day/month parts
  const weekday = Intl.DateTimeFormat("en-GB", optionsWeekday).format(date);
  const dayMonth = Intl.DateTimeFormat("en-GB", optionsDayMonth).format(date);

  // Combine them with a comma
  const formattedDate = `${weekday}, ${dayMonth}`;
  return formattedDate;
};

const renderLocationDate = function () {
  if (!weatherData) return;

  const markup = `
     
        <div class="location">
          <ion-icon class="location-icon" name="location-outline"></ion-icon>
          <p class="location-name">${weatherData.location.name}/${
    weatherData.location.country
  }</p>
        </div>
        <div class="date">${formatDate(weatherData.location.localtime)}</div>
       `;
  document
    .querySelector(".location-date")
    .insertAdjacentHTML("beforeend", markup);
};

const getGeneralCondition = function (specificCondition) {
  const conditions = Object.keys(conditionMapping);
  for (const el of conditions) {
    if (conditionMapping[el].includes(specificCondition)) {
      return el; // Return the matched general condition
    }
  }
  return "Partly cloudy"; // Default if no match is found
};

// const getConditionImage = function (condition) {
//   // Normalize to lowercase for comparison
//   const normalizedCondition = condition.toLowerCase();

//   if (normalizedCondition === "sunny") return "icons/sunny.png";
//   if (normalizedCondition === "cloudy") return "icons/cloudy.png";
//   if (normalizedCondition === "rain") return "icons/rain.png";
//   if (normalizedCondition === "thunderstorm") return "icons/thunderstorm.png";
//   if (normalizedCondition === "snow") return "icons/snow.png";
//   if (normalizedCondition === "partly cloudy") return "icons/partly-cloudy.png";

//   return "icons/partly-cloudy.png";
// };
const conditionImageMap = {
  sunny: "icons/sunny.png",
  cloudy: "icons/cloudy.png",
  rain: "icons/rain.png",
  thunderstorm: "icons/thunderstorm.png",
  snow: "icons/snow.png",
  "partly cloudy": "icons/partly-cloudy.png",
};

const getConditionImage = function (condition) {
  return (
    conditionImageMap[condition.toLowerCase()] || "icons/partly-cloudy.png"
  );
};

const renderWeatherInfo = function () {
  if (!weatherData) return;

  const generalCondition = getGeneralCondition(
    weatherData.current.condition.text
  );
  const imgSrc = getConditionImage(generalCondition);

  const markup = `
    
      <div class="weather-img">
        <img class="img" src="${imgSrc}" alt="weather image" />
      </div>
      <div class="weather-text">
        <p class="temp">${weatherData.current.temp_c} °C</p>
        <p class="weather-type">${generalCondition}</p>
      </div>
    `;

  document
    .querySelector(".weather-info")
    .insertAdjacentHTML("beforeend", markup);
};

const renderWeatherConditions = function () {
  if (!weatherData) return;

  const markup = `

        <div class="humidity">
          <div class="humidity-container">
            <ion-icon class="water-icon" name="water-outline"></ion-icon>
            <p class="humidity-text">Humidity</p>
          </div>
          <p>${weatherData.current.humidity}%</p>
        </div>
        <div class="Wind-speed">
          <div class="Wind-speed-container">
            <ion-icon class="wind-icon" name="shuffle-outline"></ion-icon>
            <p class="Wind-speed-text">Wind speed</p>
          </div>
            <p>${weatherData.current.wind_kph}km/h</p>
          </div>
      `;
  document
    .querySelector(".weather-conditions")
    .insertAdjacentHTML("beforeend", markup);
};

const formatForcastDate = function (forcastDate) {
  const date = new Date(forcastDate);
  const options = { day: "numeric", month: "short" };
  const formattedForcastDate = Intl.DateTimeFormat("en-GB", options).format(
    date
  );
  return formattedForcastDate;
};

const renderForecast = function () {
  if (!weatherData) return;
  const forecastDay = weatherData.forecast.forecastday;
  const day1 = forecastDay[1];
  const day2 = forecastDay[2];
  const day3 = forecastDay[3];
  const markup = `

          <div class="day-1">
            <p class="day-text">${formatForcastDate(day1.date)}</p>
            <img class="day-img"  src="${getConditionImage(
              getGeneralCondition(day1.day.condition.text)
            )}" alt="">
            <p class="day-temp">${day1.day.maxtemp_c} °C</p>
          </div>
          <div class="day-2">
            <p class="day-text">${formatForcastDate(day2.date)}</p>
            <img class="day-img" src="${getConditionImage(
              getGeneralCondition(day2.day.condition.text)
            )}" alt="">
            <p class="day-temp">${day2.day.maxtemp_c} °C</p>
          </div>
          <div class="day-3">
            <p class="day-text">${formatForcastDate(day3.date)}</p>
            <img class="day-img" src="${getConditionImage(
              getGeneralCondition(day3.day.condition.text)
            )}" alt="">
            <p class="day-temp">${day3.day.maxtemp_c} °C</p>
          </div>
        `;

  document
    .querySelector(".weather-forecast")
    .insertAdjacentHTML("beforeend", markup);
};

// const renderForecastDay = function (forecastDay) {
//   return `
//     <div class="forecast-day">
//       <p class="day-text">${formatForcastDate(forecastDay.date)}</p>
//       <img class="day-img" src="${getConditionImage(
//         getGeneralCondition(forecastDay.day.condition.text)
//       )}" alt="">
//       <p class="day-temp">${forecastDay.day.maxtemp_c} °C</p>
//     </div>
//   `;
// };

// const renderForecast = function () {
//   if (!weatherData) return;

//   const forecastDaysMarkup = weatherData.forecast.forecastday
//     .slice(1, 4) // Get days 1, 2, and 3
//     .map(renderForecastDay) // Map each day to the HTML
//     .join(""); // Join the HTML strings

//   // document.querySelector(".weather-forecast").innerHTML = forecastDaysMarkup;
//   document
//     .querySelector(".weather-forecast")
//     .insertAdjacentHTML("beforeend", forecastDaysMarkup);
// };

const clearInput = function () {
  document.querySelector(".search-field").value = "";
};

const getQuery = function () {
  const query = document.querySelector(".search-field").value;
  clearInput();
  return query;
};
