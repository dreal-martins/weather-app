import DarkModeToggle from "react-dark-mode-toggle";
import { useSelector } from "react-redux";
import { toggleDarkMode } from "store/reducers/appReducer";
import { AppStore, useAppDispatch } from "store";

const Header = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useSelector((state: AppStore) => state.app.darkMode);

  return (
    <div className="flex justify-between items-center w-full">
      <h1 className="text-[2rem] font-bold">Weather App</h1>
      <DarkModeToggle
        checked={isDarkMode}
        onChange={() => dispatch(toggleDarkMode())}
        size={60}
      />
    </div>
  );
};

export default Header;
