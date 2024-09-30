import { AimOutlined, SearchOutlined } from "@ant-design/icons";
import useFetch from "hooks/useFetch";
import React, { useEffect, useRef, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { useDispatch } from "react-redux";
import { fetchCities } from "service/weather";
import { toast } from "sonner";
import { AppDispatch } from "store";
import Suggestion from "./Suggestion";
import { fetchWeather } from "store/fetchWeather";
import { useClickOutside } from "hooks/useOutside";

const Search = () => {
  const suggestionRef = useRef<HTMLDivElement | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, fetchData } = useFetch<string[]>();
  const dispatch = useDispatch<AppDispatch>();

  useClickOutside(suggestionRef, () => setShowSuggestions(false));

  useEffect(() => {
    if (searchTerm.length < 3) {
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);
    const apiCall = () => fetchCities(searchTerm);
    fetchData(apiCall);
  }, [searchTerm]);

  useEffect(() => {
    if (data) {
      setSuggestions(data);
    }
  }, [data]);

  const showPosition = (position: any) => {
    dispatch(
      fetchWeather({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    );
  };

  const onSearchInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.length >= 3) {
      dispatch(fetchWeather(searchTerm));
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="w-full relative">
      <div className="relative">
        <DebounceInput
          className="bg-white flex border-none w-full p-4 rounded-full outline-none pl-[3rem] placeholder:text-lg text-lg"
          debounceTimeout={300}
          onChange={onSearchInputChanged}
          onKeyPress={handleKeyPress}
          value={searchTerm}
          placeholder="Search for location"
        />
        <SearchOutlined className="text-[#4a6fa1] text-[1.5rem] absolute top-[18px] left-4" />
        <AimOutlined
          className="text-[1.5rem] absolute top-4 right-6 text-black cursor-pointer"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(showPosition);
            } else {
              alert("Geolocation is not supported by this browser.");
            }
          }}
        />
      </div>
      {showSuggestions && (
        <div
          ref={suggestionRef}
          className="flex flex-col absolute top-[100%] rounded-2xl overflow-hidden w-full"
        >
          {suggestions?.slice(0, 6)?.map((s, i) => (
            <Suggestion
              key={i}
              label={s}
              hideSuggestionFn={() => {
                setShowSuggestions(false);
              }}
              selectSuggestionFn={(suggestion) => {
                setSearchTerm(suggestion);
                setShowSuggestions(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
