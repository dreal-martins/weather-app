import React, { useEffect, useState } from "react";
import { fetchWeatherData } from "service/weather";
import { kelvinToCelcius } from "utils/general";
import CityListItem from "./CityListItem";
import WeatherModal from "./WeatherModal";

const CityList: React.FC = () => {
  const [cities, setCities] = useState<string[]>([
    "Tokyo",
    "Delhi",
    "Shanghai",
    "São Paulo",
    "Mumbai",
    "Mexico City",
    "Cairo",
    "Dhaka",
    "Osaka",
    "New York City",
    "Karachi",
    "Chengdu",
    "Istanbul",
    "Buenos Aires",
    "Kolkata",
  ]);

  const [weatherData, setWeatherData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitial, setIsInitial] = useState<boolean>(true);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (city: string) => {
    setSelectedCity(city);
    setIsModalOpen(true);
  };

  const fetchWeatherForCities = async () => {
    setLoading(true);
    setError(null);

    const weatherResponses = await Promise.all(cities.map(fetchWeatherData));
    const newWeatherData = weatherResponses.reduce((acc, response, index) => {
      acc[cities[index]] = response?.main ? response : null;
      return acc;
    }, {} as { [key: string]: any });

    setWeatherData(newWeatherData);
    localStorage.setItem("cityList", JSON.stringify(newWeatherData));
    setLoading(false);
  };

  const removeCity = (city: string) => {
    const updatedCities = cities.filter((c) => c !== city);
    setCities(updatedCities);
    const updatedWeatherData = { ...weatherData };
    delete updatedWeatherData[city];
    setWeatherData(updatedWeatherData);
    localStorage.setItem("cityList", JSON.stringify(updatedWeatherData));
  };

  useEffect(() => {
    const loadWeatherFromLocalStorage = () => {
      const cachedWeatherData = JSON.parse(
        localStorage.getItem("cityList") || "{}"
      );
      setWeatherData(cachedWeatherData);
    };

    if (!navigator.onLine || isInitial) {
      loadWeatherFromLocalStorage();
      setIsInitial(false);
    } else {
      fetchWeatherForCities();
    }
  }, [isInitial]);

  return (
    <div className="bg-blue-50 shadow-lg rounded-2xl p-6 w-full transition-all duration-300 ease-in-out lg:max-w-4xl mx-auto">
      <h2 className="font-semibold text-xl text-blue-700 mb-4">
        Largest Cities by Population
      </h2>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-4 lg:grid-cols-5 relative">
        {cities.map((city) => (
          <CityListItem
            key={city}
            city={city}
            weatherCode={weatherData[city]?.weather?.[0]?.id || 0}
            temp={kelvinToCelcius(weatherData[city]?.main?.temp || 0)}
            main={weatherData[city]?.weather?.[0]?.main || "N/A"}
            removeCity={removeCity}
            showModal={() => showModal(city)}
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

export default CityList;
