import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import Temperature from "components/CurrentWeather/Temperature";
import WeatherIcon from "components/CurrentWeather/WeatherIcon";
import { ReactComponent as HighIcon } from "../../assets/high-icon.svg";
import { ReactComponent as HumidityIcon } from "../../assets/humidity-icon.svg";
import { ReactComponent as LowIcon } from "../../assets/low-icon.svg";
import { ReactComponent as PressureIcon } from "../../assets/pressure-icon.svg";
import { ReactComponent as WindIcon } from "../../assets/wind-icon.svg";
import { kelvinToCelcius } from "utils/general";

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  weatherData: { [key: string]: any };
}

const WeatherModal: React.FC<WeatherModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  weatherData,
}) => {
  console.log(selectedCity);
  const [notes, setNotes] = useState<
    { id: number; text: string; isEditing: boolean }[]
  >([]);
  const [newNote, setNewNote] = useState<string>("");

  useEffect(() => {
    if (selectedCity) {
      const storedNotes = JSON.parse(
        localStorage.getItem(`notes_${selectedCity}`) || "[]"
      );
      setNotes(storedNotes.map((note: any) => ({ ...note, isEditing: false })));
    }
  }, [selectedCity]);

  const handleAddNote = () => {
    if (newNote.trim() !== "") {
      const updatedNotes = [
        ...notes,
        { id: Date.now(), text: newNote, isEditing: false },
      ];
      setNotes(updatedNotes);
      localStorage.setItem(
        `notes_${selectedCity}`,
        JSON.stringify(updatedNotes)
      );
      setNewNote("");
    }
  };

  const handleEditToggle = (id: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, isEditing: !note.isEditing } : note
    );
    setNotes(updatedNotes);
  };

  const handleEditNote = (id: number, updatedText: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, text: updatedText } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${selectedCity}`, JSON.stringify(updatedNotes));
  };

  const handleDeleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${selectedCity}`, JSON.stringify(updatedNotes));
  };

  const weatherInfo = weatherData[selectedCity];
  console.log(weatherInfo);
  return (
    <Modal
      title={`Weather in ${selectedCity}`}
      open={isOpen}
      onOk={onClose}
      onCancel={onClose}
      width={460}
      className="modal"
      footer={""}
    >
      <div className="flex flex-col items-center text-center w-full gap-3">
        <h4 className="font-semibold text-3xl text-blue-500">{selectedCity}</h4>

        {weatherInfo ? (
          <>
            <div className="flex items-center justify-center lg:justify-start">
              <WeatherIcon code={weatherInfo.weather[0]?.id} big />
              <span className="font-light text-7xl text-blue-500 ml-4">
                <Temperature
                  value={kelvinToCelcius(weatherInfo.main?.temp || 0)}
                />
                <sup className="text-3xl">&deg;</sup>
              </span>
            </div>

            <h6 className="text-lg text-gray-500 capitalize">
              {weatherInfo.weather[0]?.description ||
                "No description available"}
            </h6>

            <div className="flex flex-col gap-3 w-full lg:w-[80%]">
              <p className="text-2xl text-blue-500 font-medium">
                Feels like{" "}
                <Temperature
                  value={kelvinToCelcius(weatherInfo.main?.feels_like || 0)}
                />
                <sup>&deg;</sup>
              </p>

              <div className="flex justify-between">
                <div className="flex items-center font-medium text-xl text-blue-500">
                  <HighIcon className="mr-2" />
                  <Temperature
                    value={kelvinToCelcius(weatherInfo.main?.temp_max || 0)}
                  />
                  <sup>&deg;</sup>
                </div>

                <div className="flex items-center font-medium text-xl text-blue-500">
                  <LowIcon className="mr-2" />
                  <Temperature
                    value={kelvinToCelcius(weatherInfo.main?.temp_min || 0)}
                  />
                  <sup>&deg;</sup>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <HumidityIcon className="mr-2 w-6" />
                    <span className="text-blue-500 text-lg font-medium">
                      Humidity:
                    </span>
                  </div>
                  <span className="text-blue-600 font-medium text-lg">
                    {weatherInfo.main?.humidity || 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <WindIcon className="mr-2 w-6" />
                    <span className="text-blue-500 text-lg font-medium">
                      Wind:
                    </span>
                  </div>
                  <p className="text-blue-500 font-medium text-lg">
                    {weatherInfo.wind?.speed
                      ? `${Math.round(weatherInfo.wind.speed * 3.6)} kph`
                      : "N/A"}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <PressureIcon className="mr-2 w-6" />
                    <span className="text-blue-500 text-lg font-medium">
                      Pressure:
                    </span>
                  </div>
                  <span className="text-blue-500 font-medium text-lg">
                    {weatherInfo.main?.pressure || 0} hPa
                  </span>
                </div>
              </div>

              <div className="mt-4 w-full">
                <h4 className="text-lg text-blue-500 font-semibold">Notes:</h4>
                <div className="flex flex-col space-y-2 w-full">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="flex flex-col bg-gray-100 p-4 rounded shadow-md mb-2 w-full break-words"
                    >
                      {note.isEditing ? (
                        <textarea
                          value={note.text}
                          onChange={(e) =>
                            handleEditNote(note.id, e.target.value)
                          }
                          className="border border-gray-300 p-2 rounded h-[5rem] w-full resize-none"
                          placeholder="Edit your note here..."
                        />
                      ) : (
                        <p className="text-gray-800 text-lg text-left">
                          {note.text}
                        </p>
                      )}
                      <div className="flex justify-end mt-2 space-x-2">
                        {note.isEditing ? (
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
                            onClick={() => handleEditToggle(note.id)}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition duration-200"
                            onClick={() => handleEditToggle(note.id)}
                          >
                            Edit
                          </button>
                        )}
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex mt-2">
                    <input
                      type="text"
                      placeholder="Add a note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-grow border border-gray-300 p-2 rounded"
                    />
                    <button
                      className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                      onClick={handleAddNote}
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    </Modal>
  );
};

export default WeatherModal;
