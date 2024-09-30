import React from "react";
import Temperature from "../CurrentWeather/Temperature";
import WeatherIcon from "../CurrentWeather/WeatherIcon";
import { LiaTimesCircleSolid } from "react-icons/lia";

interface IForecastItemProps {
  city: string;
  weatherCode: number;
  temp: number;
  main: string;
  removeCity: (city: string) => void;
  onClick: () => void;
}

const FavouriteItem: React.FC<IForecastItemProps> = (props) => {
  const handleRemoveCity = (event: React.MouseEvent<SVGElement>) => {
    event.stopPropagation();
    props.removeCity(props.city);
  };

  return (
    <div
      onClick={props.onClick}
      className="relative flex flex-col items-center border-[2px] rounded-lg p-3 cursor-pointer mt-2 lg:mt-0"
    >
      <h6 className="font-semibold text-lg text-blue-600">{props.city}</h6>
      <WeatherIcon code={props.weatherCode} />
      <p className="font-semibold text-lg text-blue-500">{props.main}</p>
      <span className="text-lg text-blue-500 w-20 text-center">
        <Temperature value={props.temp} />
        <sup>&deg;</sup>
      </span>
      <LiaTimesCircleSolid
        onClick={handleRemoveCity}
        className="absolute -top-3 -right-4 text-red-600 text-[2rem] font-bold cursor-pointer"
      />
    </div>
  );
};

export default FavouriteItem;
