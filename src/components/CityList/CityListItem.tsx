import React from "react";
import Temperature from "../CurrentWeather/Temperature";
import WeatherIcon from "../CurrentWeather/WeatherIcon";
// import { LiaTimesCircleSolid } from "react-icons/lia";

interface IForecastItemProps {
  city: string;
  weatherCode: number;
  temp: number;
  main: string;
  removeCity: (city: string) => void;
  showModal: () => void;
}

const CityListItem: React.FC<IForecastItemProps> = ({
  city,
  weatherCode,
  temp,
  main,
  showModal,
  // removeCity,
}) => (
  <div
    onClick={showModal}
    className="relative flex flex-col items-center border-2 rounded-lg p-3 cursor-pointer mt-2 lg:mt-0"
  >
    <h6 className="font-semibold text-lg text-blue-600">{city}</h6>
    <WeatherIcon code={weatherCode} />
    <p className="font-semibold text-lg text-blue-500">{main}</p>
    <span className="text-lg text-blue-500 w-20 text-center">
      <Temperature value={temp} />
      <sup>&deg;</sup>
    </span>
    {/* <LiaTimesCircleSolid
      onClick={() => removeCity(city)}
      className="absolute -top-3 -right-4 text-red-600 text-2xl font-bold cursor-pointer"
    /> */}
  </div>
);

export default CityListItem;
