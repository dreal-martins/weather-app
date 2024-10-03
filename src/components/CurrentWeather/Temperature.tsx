import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { AppStore } from "store";
import { TempUnit } from "types";
import { celciusToFahrenheit } from "utils/general";

interface ITemperatureProps {
  value: number;
}

const Temperature: React.FC<ITemperatureProps> = ({ value }) => {
  const degreeType = useSelector((state: AppStore) => state.app.tempUnit);

  const temperature = useMemo(() => {
    if (degreeType === TempUnit.FAHRENHEIT) {
      return celciusToFahrenheit(value);
    }
    return value;
  }, [degreeType, value]);

  return <>{temperature}</>;
};

export default Temperature;
