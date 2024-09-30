import { createAsyncThunk } from "@reduxjs/toolkit";
import { setIsInitial, setIsLoading } from "./reducers/appReducer";
import { getNextSevenDays, kelvinToCelcius } from "utils/general";
import { fetchExtendedForecastData, fetchWeatherData } from "service/weather";
import { ExtendedForecastData, WeatherData } from "types";

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (
    city: string | { lat: number; lng: number },
    { dispatch, rejectWithValue }
  ) => {
    dispatch(setIsLoading(true));

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetchWeatherData(city),
        fetchExtendedForecastData(city),
      ]);

      dispatch(setIsLoading(false));

      if (weatherResponse.cod === 200) {
        dispatch(setIsInitial(false));
        return { weather: weatherResponse, forecast: forecastResponse };
      }

      return rejectWithValue(weatherResponse.message);
    } catch (error) {
      dispatch(setIsLoading(false));
      return rejectWithValue("Error fetching weather data");
    }
  }
);

export const transformWeatherData = (
  res: any
): {
  weather: WeatherData;
  forecast: ExtendedForecastData[];
} => {
  const weather = res.weather as WeatherData;
  const forecast: ExtendedForecastData[] = [];

  weather.weather = res.weather.weather[0];
  weather.main = {
    ...weather.main,
    temp: kelvinToCelcius(weather.main.temp),
    feels_like: kelvinToCelcius(weather.main.feels_like),
    temp_max: kelvinToCelcius(weather.main.temp_max),
    temp_min: kelvinToCelcius(weather.main.temp_min),
  };
  weather.wind.speed = Math.round(weather.wind.speed * 3.6);

  const next7Days = getNextSevenDays();

  for (let index = 0; index < Math.min(res.forecast.list.length, 7); index++) {
    const i = res.forecast.list[index];

    if (
      i.main.temp &&
      i.main.temp_max !== undefined &&
      i.main.temp_min !== undefined
    ) {
      forecast.push({
        day: next7Days[index],
        temp: {
          temp_max: kelvinToCelcius(i.main.temp_max),
          temp_min: kelvinToCelcius(i.main.temp_min),
        },
        weather: {
          id: i.weather[0]?.id,
          main: i.weather[0]?.main,
        },
      });
    }
  }

  return {
    weather,
    forecast,
  };
};
