import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppStore } from "store";
import ForecastItem from "./ForecastItem";
import { setForecastData } from "store/reducers/weatherReducer";
import { toast } from "sonner";

const Forecast: React.FC = () => {
  const dispatch = useDispatch();
  const { forecast, isInitial, isError } = useSelector((state: AppStore) => ({
    isInitial: state.app.isInitial,
    forecast: state.weather.extendedWeatherData,
    isError: state.weather.isError,
  }));

  const [hasForecastData, setHasForecastData] = useState<boolean>(true);

  const saveForecastDataToLocalStorage = (data: any) => {
    localStorage.setItem("forecastData", JSON.stringify(data));
  };

  const getForecastDataFromLocalStorage = () => {
    const cachedData = localStorage.getItem("forecastData");
    return cachedData ? JSON.parse(cachedData) : null;
  };

  useEffect(() => {
    if (isError) {
      toast.error("Cannot load forecast data");
      const cachedForecastData = getForecastDataFromLocalStorage();
      if (cachedForecastData) {
        dispatch(setForecastData(cachedForecastData));
      }
    }

    if (navigator.onLine === false || isInitial) {
      const cachedForecastData = getForecastDataFromLocalStorage();
      if (cachedForecastData) {
        dispatch(setForecastData(cachedForecastData));
      } else {
        setHasForecastData(false);
      }
    }
  }, [isError, isInitial, dispatch]);

  useEffect(() => {
    if (forecast && forecast.length > 0) {
      saveForecastDataToLocalStorage(forecast);
      setHasForecastData(true);
    } else {
      setHasForecastData(false);
    }
  }, [forecast]);

  useEffect(() => {
    const cachedForecastData = getForecastDataFromLocalStorage();
    if (!cachedForecastData) {
      setHasForecastData(false);
    }
  }, []);

  if (!hasForecastData) {
    return null;
  }

  return (
    <div className="bg-blue-50 shadow-md rounded-lg p-6 overflow-hidden max-w-4xl mx-auto">
      <h6 className="font-semibold text-xl text-blue-700">Extended Forecast</h6>
      <div className="flex justify-between overflow-x-auto gap-4 flex-wrap">
        {forecast.map((item, i) => (
          <ForecastItem
            key={i}
            day={item.day}
            high={item.temp.temp_max}
            low={item.temp.temp_min}
            weatherCode={item.weather.id}
            main={item.weather.main}
          />
        ))}
      </div>
    </div>
  );
};

export default Forecast;
