import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "9505fd1df737e20152fbd78cdb289b6a";

const countryToCapital = {
  india: "Delhi",
  nepal: "Kathmandu",
  usa: "Washington",
  uk: "London",
  china: "Beijing",
  japan: "Tokyo",
  france: "Paris",
  germany: "Berlin",
  canada: "Ottawa",
  australia: "Canberra",
  italy: "Rome",
};

function App() {
  const [city, setCity] = useState("");           
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async (query) => {
    const normalized = query.toLowerCase();
    const cityQuery = countryToCapital[normalized] || query;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();
      if (data.cod !== 200) {
        throw new Error("City not found");
      }
      setWeather(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  return (
    <main className={error ? "error" : ""}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">
          <i className="fas fa-search"></i>
        </button>
      </form>

      {error && <p className="description">{error}</p>}

      {weather && (
        <section className="result">
          <div className="name">
            <img
              id="flag"
              src={`https://flagsapi.com/${weather.sys.country}/shiny/32.png`}
              alt="flag"
            />
            <figcaption id="cityName">{weather.name}</figcaption>
          </div>

          <figure className="temperature">
            <img
              id="weatherIcon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt="weather"
            />
            <figcaption>
              <span id="temp">{Math.round(weather.main.temp)}</span>
              <sup>°C</sup>
            </figcaption>
          </figure>

          <p className="description" id="description">
            {weather.weather[0].description}
          </p>

          <ul>
            <li>
              <span>Clouds</span>
              <i className="fas fa-cloud"></i>
              <span id="clouds">{weather.clouds.all}</span>%
            </li>
            <li>
              <span>Humidity</span>
              <i className="fas fa-tint"></i>
              <span id="humidity">{weather.main.humidity}</span>%
            </li>
            <li>
              <span>Wind</span>
              <i className="fas fa-wind"></i>
              <span id="wind">{(weather.wind.speed * 3.6).toFixed(1)}</span> km/h
            </li>
          </ul>
        </section>
      )}
    </main>
  );
}

export default App;
