import { useSelector } from "react-redux";
import Header from "../../components/Header";
import { AppStore } from "store";
import Search from "components/Search";
import CurrentWeather from "components/CurrentWeather";
import Forecast from "components/Forecast";
import CityList from "components/CityList";
import Favorite from "components/Favorites";

const Home = () => {
  const isDarkMode = useSelector((state: AppStore) => state.app.darkMode);

  return (
    <div
      className={` ${
        isDarkMode
          ? "bg-dark-gradient text-white"
          : "bg-light-gradient text-black"
      } p-4 flex justify-center items-center lg:px-[10rem] flex-col gap-5`}
    >
      <Header />
      <Search />
      <CurrentWeather />
      <Forecast />
      <Favorite />
      <CityList />
    </div>
  );
};

export default Home;
