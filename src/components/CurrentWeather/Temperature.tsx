import React from "react";
import { useSelector } from "react-redux";
import { AppStore } from "store";
import { celciusToFahrenheit, TempUnit } from "utils/general";

interface ITemperatureProps {
  value: number;
}

const Temperature: React.FC<ITemperatureProps> = (props) => {
  const { degreeType } = useSelector((state: AppStore) => ({
    degreeType: state.app.tempUnit,
  }));

  if (degreeType === TempUnit.FAHRENHEIT) {
    return <>{celciusToFahrenheit(props.value)}</>;
  }
  return <>{props.value}</>;
};

export default Temperature;
