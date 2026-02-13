import React, { useState } from "react";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      const data = await response.json();

      if (response.ok) {
        setWeather(data);
      } else {
        setError(data.message || "City not found 😢");
      }
    } catch (err) {
      setError("Something went wrong 😢");
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );

          const data = await response.json();

          if (response.ok) {
            setWeather(data);
          } else {
            setError(data.message || "Location weather not found 😢");
          }
        } catch (err) {
          setError("Something went wrong 😢");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError("Location permission denied ❌");
      }
    );
  };

  const getBackground = () => {
  if (!weather) return "from-blue-400 to-blue-600";

  const condition = weather.weather[0].main;

  switch (condition) {
    case "Clear":
      return "from-yellow-400 to-orange-500";

    case "Clouds":
      return "from-gray-400 to-gray-600";

    case "Rain":
      return "from-blue-700 to-blue-900";

    case "Snow":
      return "from-cyan-200 to-blue-300";

    case "Thunderstorm":
      return "from-gray-700 to-black";

    case "Mist":
    case "Haze":
      return "from-gray-300 to-gray-500";

    default:
      return "from-blue-400 to-blue-600";
  }
};

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-r ${getBackground()} transition-all duration-700`}>
      <div className='bg-white p-8 rounded-2xl shadow-xl w-80 text-center'>
        <h1 className='text-2xl font-bold mb-4'>Weather App 🌤️</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            getWeather();
          }}
        >
          <input type="text"
            placeholder='Enter city Name'
            className='border p-2 w-full rounded mb-3'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button
           type="submit"
           disabled={loading}
            className='bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition'>
              {loading ? "loading..." : "Search" }
            </button>
        </form>
  <button
          type="button"
          onClick={getLocationWeather}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded w-full mt-2 hover:bg-green-600 transition disabled:bg-gray-400"
        >
          📍 Use My Location
        </button>
        
        {loading && (
          <div className='flex justify-center mt-4'>
            <div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          </div>
        )}

        {error && (
          <p className='text-red-500'>{error}</p>
        )}

        {weather && (
          <div className='mt-4 text-left'>
            <h2 className='text-lg font-semibold'>{weather.name}</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
              className="mx-auto"
            />
            <p className="capitalize">
              {weather.weather[0].description}
            </p>
            <p>🌡️ Temp: {Math.floor(weather.main.temp)} °C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>🌪️ Pressure: {weather.main.pressure} hPa</p>
            <p>🌬️ Wind: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>

  )
}

export default App