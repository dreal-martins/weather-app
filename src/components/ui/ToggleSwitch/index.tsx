import React from "react";

interface IToggleSwitchProps {
  onClick: Function;
}

const ToggleSwitch: React.FC<IToggleSwitchProps> = (props) => {
  const [toggled, setToggled] = React.useState(false);

  return (
    <div
      className={`relative inline-block w-14 h-8 cursor-pointer rounded-full transition-all duration-300 ${
        toggled ? "bg-blue-500" : "bg-gray-300"
      }`}
      onClick={() => {
        setToggled((checked) => !checked);
        props.onClick();
      }}
    >
      <div
        className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          toggled ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>

      <span
        className={`absolute inset-y-0 left-2 flex items-center justify-center text-white font-semibold text-xs transition-all duration-300 ${
          toggled ? "opacity-100" : "opacity-0"
        }`}
      >
        C
      </span>
      <span
        className={`absolute inset-y-0 right-2 flex items-center justify-center text-white font-semibold text-xs transition-all duration-300 ${
          toggled ? "opacity-0" : "opacity-100"
        }`}
      >
        F
      </span>
    </div>
  );
};

export default ToggleSwitch;
