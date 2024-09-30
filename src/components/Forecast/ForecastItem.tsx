import React from "react";
import Temperature from "../CurrentWeather/Temperature";
import WeatherIcon from "../CurrentWeather/WeatherIcon";

interface IForecastItemProps {
  day: string;
  weatherCode: number;
  high: number;
  low: number;
  main: string;
}

const ForecastItem: React.FC<IForecastItemProps> = (props) => {
  return (
    <div className="flex flex-col items-center mt-4">
      <h6 className="font-semibold text-lg text-blue-600">{props.day}</h6>
      <WeatherIcon code={props.weatherCode} />
      <p className="font-semibold text-lg text-blue-500">{props.main}</p>
      <span className="text-lg text-blue-500 w-20 text-center">
        <Temperature value={props.high} />
        <sup>&deg;</sup>
        <small>/</small>
        <Temperature value={props.low} />
        <sup>&deg;</sup>
      </span>
    </div>
  );
};

export default ForecastItem;
