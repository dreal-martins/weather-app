import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as HighIcon } from "../../assets/high-icon.svg";
import { ReactComponent as HumidityIcon } from "../../assets/humidity-icon.svg";
import { ReactComponent as LowIcon } from "../../assets/low-icon.svg";
import { ReactComponent as PressureIcon } from "../../assets/pressure-icon.svg";
import { ReactComponent as WindIcon } from "../../assets/wind-icon.svg";
import { AppStore } from "store";
import { changeTempUnit } from "store/reducers/appReducer";
import { kmToMile, TempUnit } from "utils/general";
import ToggleSwitch from "components/ui/ToggleSwitch";
import WeatherIcon from "./WeatherIcon";
import Temperature from "./Temperature";
import { setWeatherData } from "store/reducers/weatherReducer";
import { toast } from "sonner";
import { toggleFavoriteCity } from "store/reducers/favoriteReducer";

const CurrentWeather: React.FC = () => {
  const { weather, degreeType, isInitial, isError } = useSelector(
    (store: AppStore) => ({
      weather: store.weather.weatherData,
      degreeType: store.app.tempUnit,
      isInitial: store.app.isInitial,
      isError: store.weather.isError,
    })
  );

  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [hasWeatherData, setHasWeatherData] = useState<boolean>(true);

  const saveWeatherDataToLocalStorage = (data: any) => {
    try {
      localStorage.setItem("weatherData", JSON.stringify(data));
    } catch (error) {
      toast.error("Failed to save weather data.");
    }
  };

  const getWeatherDataFromLocalStorage = () => {
    try {
      const cachedData = localStorage.getItem("weatherData");
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      toast.error("Failed to load cached data.");
      return null;
    }
  };

  const toggleFavorite = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

      if (isFavorite) {
        const updatedFavorites = favorites.filter(
          (fav: string) => fav !== weather.name
        );
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        dispatch(toggleFavoriteCity(updatedFavorites));
      } else {
        favorites.push(weather.name);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        dispatch(toggleFavoriteCity(favorites));
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      toast.error("Failed to update favorites.");
    }
  };

  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const isFav = favorites.some((fav: string) => fav === weather.name);
      setIsFavorite(isFav);
    } catch (error) {
      toast.error("Failed to load favorite cities.");
    }
  }, [weather.name]);

  useEffect(() => {
    if (isError) {
      toast.error("Cannot load weather for this place");
      const cachedWeatherData = getWeatherDataFromLocalStorage();
      if (cachedWeatherData) {
        dispatch(setWeatherData(cachedWeatherData));
      } else {
        setHasWeatherData(false);
      }
    }
  }, [isError, dispatch]);

  useEffect(() => {
    if (weather && weather.name) {
      saveWeatherDataToLocalStorage(weather);
      setHasWeatherData(true);
    }
  }, [weather]);

  useEffect(() => {
    if (navigator.onLine === false || isInitial) {
      const cachedWeatherData = getWeatherDataFromLocalStorage();
      if (cachedWeatherData) {
        dispatch(setWeatherData(cachedWeatherData));
      } else {
        setHasWeatherData(false);
      }
    }
  }, [isInitial, dispatch]);

  useEffect(() => {
    const cachedWeatherData = getWeatherDataFromLocalStorage();
    if (!cachedWeatherData) {
      setHasWeatherData(false);
    }
  }, []);

  if (!hasWeatherData) {
    return null;
  }

  return (
    <div className="bg-blue-50 shadow-lg rounded-2xl p-8 w-full lg:max-w-4xl transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-semibold text-xl text-blue-700">Current Weather</h1>
        <div className="lg:w-[15%] flex justify-between items-center">
          <ToggleSwitch onClick={() => dispatch(changeTempUnit())} />
          <button onClick={toggleFavorite} aria-label="Favorite location">
            {isFavorite ? (
              <span className="text-red-500 text-[1.5rem]">❤️</span>
            ) : (
              <span className="text-gray-400 text-[1.5rem]">🤍</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <h4 className="font-semibold text-3xl text-blue-600">
            {weather.name}
          </h4>
          <div className="flex items-center justify-center lg:justify-start">
            <WeatherIcon code={weather.weather?.id} big />
            <span className="font-light text-7xl text-blue-500 ml-4">
              <Temperature value={weather?.main?.temp} />
              <sup className="text-3xl">&deg;</sup>
            </span>
          </div>
          <h6 className="text-2xl text-blue-500 capitalize font-medium">
            {weather?.weather?.description}
          </h6>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          <p className="text-2xl text-blue-500 font-medium">
            Feels like <Temperature value={weather?.main?.feels_like} />
            <sup>&deg;</sup>
          </p>
          <div className="flex justify-around">
            <div className="flex items-center font-medium text-2xl text-blue-500">
              <HighIcon className="mr-2" />
              <Temperature value={weather?.main?.temp_max} />
              <sup>&deg;</sup>
            </div>
            <div className="flex items-center font-medium text-2xl text-blue-500">
              <LowIcon className="mr-2" />
              <Temperature value={weather?.main?.temp_min} />
              <sup>&deg;</sup>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HumidityIcon className="mr-2 w-6" />
              <span className="text-xl text-blue-500 font-medium">
                Humidity:
              </span>
            </div>
            <span className="text-xl text-blue-500 font-medium">
              {weather?.main?.humidity}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <WindIcon className="mr-2 w-6" />
              <span className="text-xl text-blue-500 font-medium">Wind:</span>
            </div>
            <span className="text-xl text-blue-500 font-medium">
              {degreeType === TempUnit?.CELCIUS
                ? weather?.wind?.speed
                : kmToMile(weather?.wind?.speed)}{" "}
              {degreeType === TempUnit?.CELCIUS ? "kph" : "mph"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <PressureIcon className="mr-2 w-6" />
              <span className="text-xl text-blue-500 font-medium">
                Pressure:
              </span>
            </div>
            <span className="text-xl text-blue-500 font-medium">
              {weather?.main?.pressure} hPa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
