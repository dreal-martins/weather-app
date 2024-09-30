import apiService from "./api";
const weatherUrl = process.env.REACT_APP_OPEN_WEATHER_MAP_URL;

export const fetchCities = async (search: string) => {
  const apiKey = process.env.REACT_APP_OPEN_CAGE_API_KEY;
  const url = `${
    process.env.REACT_APP_OPEN_CAGE_DATA_URL
  }/v1/json?q=${encodeURIComponent(search)}&key=${apiKey}&language=en&pretty=1`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();

    return data.results
      .filter((item: any) => item.components.city)
      .map((i: any) => `${i.components.city}, ${i.components.country}`);
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

export const fetchWeatherData = async (
  city: string | { lat: number; lng: number }
) => {
  let url = `/weather?q=${city}&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY}`;

  if (typeof city === "object") {
    url = `/weather?lat=${city.lat}&lon=${city.lng}&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY}`;
  }

  try {
    const response = await apiService(url, "get", null, {}, null, weatherUrl);
    return response;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const fetchExtendedForecastData = async (
  city: string | { lat: number; lng: number }
) => {
  let url = `/forecast?q=${city}&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY}`;

  if (typeof city === "object") {
    url = `/forecast?lat=${city.lat}&lon=${city.lng}&appid=${process.env.REACT_APP_OPEN_WEATHER_MAP_API_KEY}`;
  }

  try {
    const response = await apiService(url, "get", null, {}, null, weatherUrl);
    return response;
  } catch (error) {
    console.error("Error fetching extended forecast data:", error);
    throw error;
  }
};
