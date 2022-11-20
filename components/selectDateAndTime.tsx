import { useContext } from "react";
import { BookingContext } from "./bookRoom";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const SelectDateAndTime = () => {
  const {
    building,
    setBuilding,
    buildingOpen,
    setBuildingOpen,
    room,
    setRoom,
    dateAndTime,
    setDateAndTime,
    duration,
    setDuration,
    activeComponent,
    setActiveComponent,
  } = useContext(BookingContext);
  return (
    <div className="mt-4">
      <h1 className="text-md text-gray-800 font-medium mb-2">
        Select Date and Time
      </h1>

      <div
        className="bg-gray-100 p-4 rounded-lg w-full text-left text-gray-800 flex flex-row gap-7 cursor-text"
        date-rangepicker
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fill-rule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
            clip-rule="evenodd"
          />
        </svg>
        <Datetime
          value={dateAndTime}
          onChange={(e) => setDateAndTime(e)}
          dateFormat="DD/MM/YYYY"
          timeFormat="HH:mm"
          initialViewMode="days"
          inputProps={{
            placeholder: "Select Date and Time",
            className: "bg-gray-100 focus:outline-none w-full",
          }}
          isValidDate={(current) => {
            // after this date and max 7 days after
            return (
              current.isAfter(
                new Date(new Date().setDate(new Date().getDate() - 1))
              ) &&
              current.isBefore(new Date().setDate(new Date().getDate() + 7)) &&
              // between 7am and 8pm
              current.hour() >= 7 &&
              current.hour() <= 24
            );
          }}
        />
      </div>
    </div>
  );
};

export default SelectDateAndTime;
