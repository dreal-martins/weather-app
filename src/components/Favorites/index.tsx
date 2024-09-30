import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherData } from "service/weather";
import { AppStore } from "store";
import {
  loadFavoriteCities,
  toggleFavoriteCity,
} from "store/reducers/favoriteReducer";
import { kelvinToCelcius } from "utils/general";
import FavouriteItem from "./FavouriteItem";

import WeatherModal from "components/CityList/WeatherModal";

const Favorite: React.FC = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: AppStore) => state.favorites.favorites);
  const [weatherData, setWeatherData] = React.useState<{ [key: string]: any }>(
    {}
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCity, setSelectedCity] = React.useState<string>("");

  const openCityModal = (city: string) => {
    setSelectedCity(city);
    setIsModalOpen(true);
  };

  useEffect(() => {
    dispatch(loadFavoriteCities());

    const savedWeatherData = JSON.parse(
      localStorage.getItem("favouriteWeatherData") || "{}"
    );
    setWeatherData(savedWeatherData);
  }, [dispatch]);

  const removeCity = (city: string) => {
    const updatedFavorites = favorites.filter((fav) => fav !== city);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    dispatch(toggleFavoriteCity(updatedFavorites));
    const updatedWeatherData = { ...weatherData };
    delete updatedWeatherData[city];
    setWeatherData(updatedWeatherData);
    localStorage.setItem(
      "favouriteWeatherData",
      JSON.stringify(updatedWeatherData)
    );
  };

  useEffect(() => {
    const fetchWeatherForCities = async () => {
      if (favorites.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        const weatherResponses = await Promise.all(
          favorites.map((city) => fetchWeatherData(city))
        );

        const newWeatherData: { [key: string]: any } = {};
        weatherResponses.forEach((response, index) => {
          if (response && response.main) {
            newWeatherData[favorites[index]] = response;
          } else {
            newWeatherData[favorites[index]] = null;
          }
        });

        setWeatherData(newWeatherData);
        localStorage.setItem(
          "favouriteWeatherData",
          JSON.stringify(newWeatherData)
        );
      } catch (error) {
        setError("Failed to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherForCities();
  }, [favorites]);

  return (
    <div className="bg-blue-50 shadow-lg rounded-2xl p-6 w-full transition-all duration-300 ease-in-out lg:max-w-4xl mx-auto">
      <h2 className="font-semibold text-xl text-blue-700 pb-2">
        Favorite Cities
      </h2>

      {favorites.length === 0 && <p>No favorite cities added.</p>}

      <ul className="grid gap-6 sm:grid-cols-4 lg:grid-cols-5 relative">
        {favorites.map((city) => (
          <FavouriteItem
            key={city}
            city={city}
            weatherCode={weatherData[city]?.weather?.[0]?.id || 0}
            temp={kelvinToCelcius(weatherData[city]?.main?.temp || 0)}
            main={weatherData[city]?.weather?.[0]?.main || "N/A"}
            removeCity={removeCity}
            onClick={() => openCityModal(city)}
          />
        ))}
      </ul>
      <WeatherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCity={selectedCity}
        weatherData={weatherData}
      />
    </div>
  );
};

export default Favorite;
