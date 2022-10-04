import { useEffect, useState } from "react";

const buildings = [
  "Atferdssenteret",
  "CAS",
  "Chateau Neuf",
  "Cort Adelers gate 30",
  "Det Norske Videnskaps-Akademi",
  "Det odontologiske fakultet",
  "Domus Academica",
  "Domus Biblioteca",
  "Domus Juridica",
  "Domus Media",
  "Domus Medica",
  "Domus Medica tilbygg",
  "Domus Nova",
  "Domus Odontologica",
  "Domus Theologica",
  "Eilert Sundts hus A",
  "Eilert Sundts hus B",
  "F3B",
  "Farmasibygningen",
  "Forskningsparken",
  "Forskningsveien 2B",
  "Frederik Holsts hus",
  "Fysikkbygningen",
  "Gaustadalléen 30",
  "Gaustadveien 69",
  "Geologibygningen",
  "Georg Morgenstiernes hus",
  "GSH - Georg Sverdrups hus",
  "Gullhaug torg 1",
  "Gullhaugveien 1-3",
  "Gydas vei 8",
  "Harald Schjelderups hus",
  "Harriet Holters hus",
  "Helga Engs hus",
  "HELSAM-rom",
  "Henrik Wergelands hus",
  "Historisk museum",
  "IfI sine kollokvierom",
  "Inven2 sine rom",
  "ISF sine rom",
  "Kabelgaten 32-40, Økern",
  "Kada testrom",
  "KHM sine møterom",
  "Kjemibygningen",
  "KLINMED-rom",
  "KNH - Kristen Nygaards hus",
  "KO - Kristian Ottosens hus",
  "Kollokvierom i Fysikkbygningen",
  "Kollokvierom i Georg Sverdrups hus",
  "Kollokvierom i Ole-Johan Dahls hus",
];

const roundToNearest15 = (date: any) => {
  const minutes = 15;
  const ms = 1000 * 60 * minutes;

  // 👇️ replace Math.round with Math.ceil to always round UP
  return new Date(Math.round(date.getTime() / ms) * ms);
};

const ShowBookInfo = () => {
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [dateAndTimeFrom, setDateAndTimeFrom] = useState<Date>(
    new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
  );
  const [dateAndTimeTo, setDateAndTimeTo] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number>(1);
  const [durationOpen, setDurationOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [buildingOpen, setBuildingOpen] = useState(false);
  const [buildingSearch, setBuildingSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomOpen, setRoomOpen] = useState(false);
  const [attendees, setAttendees] = useState<string[]>([]);
  const [attendee, setAttendee] = useState("");
  const [text, setText] = useState("Test");
  const [bookedInfo, setBookedInfo] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const [availableRooms, setAvailableRooms] = useState([]);

  const durations = [0.5, 1, 1.5, 2];

  useEffect(() => {
    // timeTo is time from + duration
    const timeTo = new Date(
      dateAndTimeFrom.getTime() + duration * 60 * 60 * 1000
    );
    const timeToRounded = roundToNearest15(timeTo);
    setDateAndTimeTo(timeToRounded);
  }, [dateAndTimeFrom, duration]);

  const getAvailableRooms = () => {
    setLoading(true);
    const requestRooms = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        date: roundToNearest15(dateAndTimeFrom),
        duration: duration,
        building: selectedBuilding,
      }),
    };

    fetch("https://book-uio-room-api.herokuapp.com/get-rooms", requestRooms)
      .then((res) => res.json())
      .then((data) => {
        if (data != null) {
          setAvailableRooms(data);
          if (data.length > 0) {
            setSelectedRoom(data[0]);
          }
        }
        setLoading(false);
      });
  };

  const bookRoom = () => {
    setLoading(true);
    const requestBook = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        date: roundToNearest15(dateAndTimeFrom),
        duration: duration,
        building: selectedBuilding,
        room: selectedRoom,
        attendees: attendees,
        text: text,
        title: "Scheduled meeting for a project",
      }),
    };

    fetch("https://book-uio-room-api.herokuapp.com/book", requestBook)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setActivePage(3);
        if (data.status === "success") {
          setBookedInfo(data.info);
        } else if (data.status === "failed" || data.status === "error") {
          setActivePage(4);
        }
        setLoading(false);
      });
  };

  const Page1 = () => (
    <div className="max-w-md mx-auto rounded border p-4 bg-white">
      {/* 👇️ div with this color: E0DBD4 */}
      <div className="w-full text-center">
        <h1 className="text-xl font-medium text-gray-800">
          Select building and time
        </h1>
      </div>{" "}
      <div className="flex flex-col mt-4">
        <label className="text-sm text-gray-700 font-medium mb-1">
          Building
        </label>
        <div>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Search for building"
            value={buildingOpen ? buildingSearch : selectedBuilding}
            onChange={(e) => {
              setBuildingSearch(e.target.value);
              setBuildingOpen(true);
            }}
          />

          <div className={buildingOpen ? "mt-1" : "hidden"}>
            <ul className="border rounded max-h-36 overflow-auto">
              {buildings
                .filter((building) =>
                  building.toLowerCase().includes(buildingSearch.toLowerCase())
                )
                .map((building, index) => (
                  <li
                    key={index}
                    className="buildingList"
                    id={building}
                    onClick={(e) => {
                      setSelectedBuilding(e.currentTarget.id);
                      setBuildingSearch(e.currentTarget.id);
                      setBuildingOpen(false);
                    }}
                  >
                    {building}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <label className="text-sm text-gray-700 font-medium mb-1">
          Date and time
        </label>

        <div className="flex flex-col justify-between gap">
          {/* Select time and date*/}
          <input
            type="datetime-local"
            className="w-1/2 border text-gray-700 text-sm font-medium py-2 px-4 rounded cursor-pointer"
            value={dateAndTimeFrom.toISOString().slice(0, -1).slice(0, 16)}
            onChange={(e) =>
              setDateAndTimeFrom(
                roundToNearest15(
                  new Date(
                    new Date(e.currentTarget.value).getTime() +
                      2 * 60 * 60 * 1000
                  )
                )
              )
            }
          />
          <div className="flex flex-row ">
            <span className="text-xs text-gray-500">
              {dateAndTimeFrom?.toLocaleDateString("en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-xs text-gray-500 ">
              {", "}
              at{" "}
              {dateAndTimeFrom
                ?.toISOString()
                .slice(0, -1)
                .split("T")[1]
                .slice(0, 5)}{" "}
              o&apos;clock
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <label className="text-sm text-gray-700 font-medium mb-1">
          Duration
        </label>
        <div>
          <button
            className="w-1/2 text-left border text-gray-700 text-sm font-medium py-2 px-4 rounded"
            onClick={() => setDurationOpen(!durationOpen)}
          >
            <span className="flex items-center justify-between">
              <span>{duration === 1 ? "1 hour" : `${duration} hours`}</span>
              <span className="text-gray-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </span>
          </button>
          <div className={durationOpen ? "w-1/2 mt-1" : "hidden"}>
            <ul className="border rounded max-h-36 overflow-auto">
              {durations.map((duration, index) => (
                <li
                  key={index}
                  className="buildingList"
                  onClick={(e) => {
                    setDurationOpen(!durationOpen);
                    setDuration(duration);
                  }}
                >
                  {duration === 1 ? "1 hour" : `${duration} hours`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-4">
        {/* Check availability */}
        <button
          className="w-full border text-gray-700 text-sm font-medium py-2 px-4 rounded hover:bg-gray-100"
          onClick={() => {
            if (selectedBuilding === "") {
              alert("Please select a building");
            } else if (!buildings.includes(buildingSearch)) {
              alert("Please select a valid building");
            } else {
              getAvailableRooms();
              setActivePage(2);
            }
          }}
          // onClick={() => setActivePage(2)}
        >
          Check availability
        </button>
      </div>
    </div>
  );
  const Page2 = () => (
    <div className="max-w-md mx-auto rounded border p-4 bg-white">
      {/* 👇️ div with this color: E0DBD4 */}
      <div className="w-full text-center">
        <h1 className="text-xl font-medium text-gray-800">
          {loading ? "Fetching available rooms..." : "Available rooms"}
        </h1>
      </div>
      <div>
        {loading ? (
          <div className="flex justify-center mt-10">
            <svg
              className="animate-spin -ml-1 mr-3 h-20 w-20 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
              ></path>
            </svg>
          </div>
        ) : (
          <div className="flex flex-col mt-4">
            {availableRooms.length > 0 ? (
              <>
                <label className="text-sm text-gray-700 font-medium mb-1">
                  Select room
                </label>
                <div>
                  <button
                    className="w-full text-left border text-gray-700 text-sm font-medium py-2 px-4 rounded"
                    onClick={() => setRoomOpen(!roomOpen)}
                  >
                    <span className="flex justify-between">
                      <span>{selectedRoom}</span>
                      <span className="text-gray-500">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </span>
                  </button>
                  <div className={roomOpen ? "mt-1" : "hidden"}>
                    <ul className="border rounded max-h-36 overflow-auto">
                      {availableRooms.map((room, index) => (
                        <li
                          key={index}
                          className="buildingList"
                          id={room}
                          onClick={(e) => {
                            setSelectedRoom(e.currentTarget.id);
                            setRoomOpen(false);
                          }}
                        >
                          {room}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-row justify-between mt-4">
                <button
                  className="w-full border text-gray-700 text-sm font-medium py-2 px-4 rounded hover:bg-gray-100"
                  onClick={() => setActivePage(1)}
                >
                  No rooms available. Edit search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {availableRooms.length > 0 && !loading && (
        <div className="flex flex-col justify-between mt-4">
          <label className="text-sm text-gray-700 font-medium mb-1">
            Add attendees
          </label>
          <div className="flex flex-row gap-4">
            <input
              type="text"
              className="w-full border text-gray-700 text-sm font-medium py-2 px-4 rounded"
              placeholder="Enter email"
              value={attendee}
              onChange={(e) => setAttendee(e.target.value)}
            />
            <button
              className="w-1/4 border text-gray-700 text-sm font-medium py-2 px-4 rounded hover:bg-gray-100"
              onClick={() => {
                if (attendee === "") {
                  alert("Please enter an email");
                } else if (!attendee.includes("@")) {
                  alert("Please enter a valid email");
                } else {
                  setAttendees([...attendees, attendee]);
                  setAttendee("");
                }
              }}
            >
              Add
            </button>
          </div>
          <ul>
            {attendees.map((attendee, index) => (
              <li key={index} className="flex flex-row  mt-1 ">
                <span
                  className="text-gray-500 text-sm peer hover:text-red-500 cursor-pointer peer"
                  onClick={() => {
                    setAttendees(attendees.filter((a) => a !== attendee));
                  }}
                >
                  {attendee}
                </span>
                <span className="text-gray-500 text-sm ml-2 peer hover:text-red-500 cursor-pointer peer">
                  x
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {availableRooms.length > 0 && !loading && (
        <>
          <div className="w-full flex flex-row justify-between mt-4 p-2 bg-gray-50 rounded">
            {
              //list all info here}
            }
            <ul className="w-full">
              <li className="flex flex-row justify-between">
                <span className="text-gray-700 text-sm">Building</span>
                <span className="text-gray-700 text-sm">
                  {selectedBuilding}
                </span>
              </li>
              <li className="flex flex-row justify-between">
                <span className="text-gray-700 text-sm">Room</span>
                <span className="text-gray-700 text-sm">{selectedRoom}</span>
              </li>
              <li className="flex flex-row justify-between">
                <span className="text-gray-700 text-sm">Date</span>
                <span className="text-gray-700 text-sm">
                  {dateAndTimeFrom.toLocaleDateString("en-GB", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </li>
              <li className="flex flex-row justify-between">
                <span className="text-gray-700 text-sm">Time</span>
                <span className="text-gray-700 text-sm">
                  {dateAndTimeFrom.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {dateAndTimeTo
                    ? dateAndTimeTo.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </li>
              <li className="flex flex-row justify-between">
                <span className="text-gray-700 text-sm">Attendees</span>
                <span className="text-gray-700 text-sm">
                  {attendees.length}
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-row justify-between mt-4 gap-4">
            <button
              className="w-full border text-gray-700 text-sm font-medium py-2 px-4 rounded hover:bg-gray-100"
              onClick={() => setActivePage(1)}
            >
              Go back
            </button>
            <button
              className="w-full  border text-gray-700 text-sm font-medium py-2 px-4 rounded hover:bg-gray-100
          
          "
              onClick={() => {
                bookRoom();
              }}
            >
              Book this room
            </button>
          </div>
        </>
      )}
    </div>
  );

  const Page3 = () => (
    <div className="max-w-md mx-auto rounded border p-4 bg-white">
      {/* 👇️ div with this color: E0DBD4 */}
      <div className="w-full text-center">
        <h1 className="text-xl font-medium text-gray-800">
          {loading ? "Booking the room..." : "Room booked!"}
        </h1>
      </div>
      <div>
        {loading ? (
          <div className="flex justify-center mt-10">
            <svg
              className="animate-spin -ml-1 mr-3 h-20 w-20 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z"
              ></path>
            </svg>
          </div>
        ) : (
          <div className="flex flex-col justify-between mt-4">
            <label className="text-sm text-gray-700 font-medium mb-1">
              Booking details
            </label>
            <ul className="w-full">
              <li className="flex flex-row justify-between">
                <span className="text-gray-700 text-sm">Building</span>
                <span className="text-gray-700 text-sm">
                  {bookedInfo.building}
                </span>
              </li>
              <li className="flex flex-row justify-between">
                <span className="text-gray-700 text-sm">Room</span>
                <span className="text-gray-700 text-sm">{bookedInfo.room}</span>
              </li>
              <li className="flex flex-row justify-between">
                <span className="text-gray-700 text-sm">Date</span>
                <span className="text-gray-700 text-sm">{bookedInfo.date}</span>
              </li>
              <li className="flex flex-row justify-between">
                <span className="text-gray-700 text-sm">Time</span>
                <span className="text-gray-700 text-sm">
                  {bookedInfo.start_time} - {bookedInfo.end_time}
                </span>
              </li>
              <li className="flex flex-row justify-between">
                <span className="text-gray-700 text-sm">Attendees</span>
                <span className="text-gray-700 text-sm">
                  {bookedInfo.attendees.map((attendee: any) => (
                    <span key={attendee}>{attendee}</span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between mt-4">
        <button
          className="w-full border text-gray-700 text-sm font-medium py-2 px-4 rounded hover:bg-gray-100"
          onClick={() => setActivePage(1)}
        >
          Book another room
        </button>
      </div>
    </div>
  );

  const Page4 = () => (
    <div className="max-w-md mx-auto rounded border p-4 bg-white">
      {/* 👇️ div with this color: E0DBD4 */}
      <div className="w-full text-center">
        <h1 className="text-xl font-medium text-gray-800">
          The booking failed. Please try again.
        </h1>
      </div>
      <div className="flex flex-row justify-between mt-4">
        <button
          className="w-full border text-gray-700 text-sm font-medium py-2 px-4 rounded hover:bg-gray-100"
          onClick={() => setActivePage(1)}
        >
          Try again
        </button>
      </div>
    </div>
  );

  switch (activePage) {
    case 1:
      return <div className="mt-10">{Page1()}</div>;
    case 2:
      return <div className="mt-10">{Page2()}</div>;
    case 3:
      return <div className="mt-10">{Page3()}</div>;
    case 4:
      return <div className="mt-10">{Page4()}</div>;

    default:
      return <Page1 />;
  }
};

export default ShowBookInfo;
