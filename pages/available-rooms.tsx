import { useEffect, useState } from "react";
import { getAvailableRooms } from "../firebase/db_functions";
import { updateRoom } from "../util/fuctions";

const AvailableRooms = () => {
  const [availableRooms, setAvailableRooms] = useState([] as any);
  const [allRooms, setAllRooms] = useState([] as any);
  const [last_updated, setLastUpdated] = useState("");
  const [search, setSearch] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState(
    "Kollokvierom i Ole-Johan Dahls hus"
  );

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAvailableRooms();
      setAvailableRooms(data.roomsWithStory);
      setLastUpdated(data.last_updated);
      setAllRooms(data.rooms);
    };
    fetchData();
  }, []);

  const findNeighbour = (room_id: number) => {
    // sort the rooms out of the id number
    const sorted_rooms = allRooms.sort(
      (a: any, b: any) => a.room_id - b.room_id
    );

    // find the index of the room
    const index = sorted_rooms.findIndex(
      (room: any) => room.room_id === room_id
    );

    // find the room before and after
    let before = sorted_rooms[index - 1];
    let after = sorted_rooms[index + 1];

    return [before, after];
  };

  return (
    <div>
      <div className="w-full h-screen flex flex-col mb-10">
        <div className="max-w-md mx-auto  p-4 bg-white m-10 ">
          <h1 className="text-2xl font-bold text-stone-700">
            Available rooms at the{" "}
            <span className="text-4xl text-blue-600">
              University of Oslo (IFI)
            </span>
          </h1>

          <input
            className="bg-stone-50 rounded p-4 mt-4 w-full border-2 border-stone-200 focus:outline-none focus:border-stone-500"
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />

          <p className="text-sm text-gray-500 mt-2">
            Last updated: {last_updated}
          </p>

          <div className="flex flex-col mt-2  overflow-y-auto h-[60rem] ">
            {availableRooms ? (
              <div className="flex flex-col ">
                {Object.keys(availableRooms).map((story: any) => (
                  <div key={story} className="flex flex-col ">
                    <ul className="flex flex-col gap-2 mt-2">
                      {availableRooms[story]
                        .filter(
                          (room: any) =>
                            room.room_name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            room.room_id
                              .toLowerCase()
                              .includes(search.toLowerCase())
                        )
                        .map((room: any) =>
                          room ? (
                            <li
                              key={room.room_id}
                              className="flex flex-col p-4 bg-gray-50 rounded-md hover:bg-gray-100"
                            >
                              <h1 className="text-lg font-bold text-stone-700">
                                {room.room_name} ({room.room_id})
                              </h1>
                              <p className="text-sm font-semibold text-green-600">
                                Available for {"<"} {room.available_duration}{" "}
                                {room.available_duration < 2 ? "hour" : "hours"}
                              </p>
                              <p className="text-sm font-normal text-stone-600">
                                {story}. floor
                              </p>

                              <p className="text-sm font-normal text-stone-600">
                                Neighbors:{" "}
                                {findNeighbour(room.room_id)
                                  .filter((room: any) => room)
                                  .map((room: any) =>
                                    room.room_name
                                      .replace("Kollokvierom", "")
                                      .trim()
                                  )
                                  .join(", ")}
                              </p>
                            </li>
                          ) : (
                            <p className="text-lg font-bold text-stone-700">
                              No rooms available
                            </p>
                          )
                        )}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-stone-700">
                  No available rooms
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableRooms;
