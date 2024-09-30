import * as React from "react";
import { useAppDispatch } from "store";
import { fetchWeather } from "store/fetchWeather";

interface ISuggestionProps {
  label: string;
  hideSuggestionFn: Function;
  selectSuggestionFn: (suggestion: string) => void;
}

const Suggestion: React.FC<ISuggestionProps> = (props) => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    const cityName = props.label.split(",")[0];
    dispatch(fetchWeather(cityName));
    props.selectSuggestionFn(props.label);
    setTimeout(() => {
      props.hideSuggestionFn();
    }, 400);
  };

  return (
    <p
      className="p-2 block text-black text-left border-[1px] text-lg cursor-pointer hover:bg-blue-500 hover:text-white  bg-white z-20"
      onClick={onClick}
    >
      {props.label}
    </p>
  );
};

export default Suggestion;
