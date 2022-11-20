import React, { useContext, useEffect, useRef, useState } from "react";
import { buildings } from "../util/data";
import { BookingContext } from "./bookRoom";
import SelectTime from "./selectDateAndTime";

const SelectBuildingAndTime = () => {
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

  const [buildingSearch, setBuildingSearch] = useState("");

  return (
    <div className="mt-6">
      {/* Select building */}
      <h2 className="text-md font-medium text-gray-700">Select Building</h2>
      <div className="mt-2 grid grid-cols-12 ">
        <div className="pl-4 py-3 col-span-2 bg-gray-100 rounded-l-lg items-center flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-gray-800"
          >
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
          </svg>
        </div>

        <input
          type="text"
          className="col-span-10 bg-gray-100 after:block focus:outline-none focus:border-blue-500 peer w-full border-lg rounded-r-lg pr-4 py-4 text-gray-700 bg-gray-100 gap-4 "
          placeholder="Search for building"
          value={buildingOpen ? buildingSearch : building}
          onChange={(e) => {
            setBuildingSearch(e.target.value);
            setBuildingOpen(true);
          }}
        />
        <div className="mt-2 hidden peer-focus:block active:block col-span-12">
          <ul className="bg-gray-100 rounded-lg max-h-36 overflow-auto scrollbar">
            {buildings.filter((building) =>
              building.toLowerCase().includes(buildingSearch.toLowerCase())
            ).length > 0 ? (
              buildings
                .filter((building) =>
                  building.toLowerCase().includes(buildingSearch.toLowerCase())
                )
                .map((building, index) => (
                  <li
                    key={index}
                    className="buildingList"
                    id={building}
                    onClick={(e) => {
                      setBuildingSearch(e.currentTarget.id);
                      setBuilding(e.currentTarget.id);
                      setBuildingOpen(false);
                    }}
                  >
                    {building}
                  </li>
                ))
            ) : (
              <li
                className="buildingList"
                onClick={(e) => {
                  setBuildingSearch(e.currentTarget.id);
                  setBuildingOpen(false);
                }}
              >
                No buildings found
              </li>
            )}
          </ul>
        </div>
      </div>
      <SelectTime />
    </div>
  );
};

export default SelectBuildingAndTime;
