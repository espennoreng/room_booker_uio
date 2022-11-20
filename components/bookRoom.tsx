import React, { useRef } from "react";
import ConfirmBooking from "./confirmBooking";
import SelectBuildingAndTime from "./selectBuildingAndTime";
import SelectRoom from "./selectRoom";

const BookingContext = React.createContext({
  building: null as unknown as string,
  setBuilding: (building: string) => {},
  room: null as unknown as string,
  setRoom: (room: string) => {},
  dateAndTime: null as unknown as Date,
  setDateAndTime: (date: Date) => {},
  duration: null as unknown as number,
  setDuration: (duration: number) => {},
  activeComponent: null as unknown as number,
  setActiveComponent: (activeComponent: number) => {},
  buildingOpen: null as unknown as boolean,
  setBuildingOpen: (buildingOpen: boolean) => {},
});

const BookRoom = () => {
  const [building, setBuilding] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [dateAndTime, setDateAndTime] = React.useState(new Date());
  const [duration, setDuration] = React.useState(0);
  const [activeComponent, setActiveComponent] = React.useState(0);
  const [buildingOpen, setBuildingOpen] = React.useState(false);

  const Page = () => {
    switch (activeComponent) {
      case 0:
        return <SelectBuildingAndTime />;
      case 1:
        return <SelectRoom />;
      case 2:
        return <ConfirmBooking />;
      default:
        return <SelectBuildingAndTime />;
    }
  };

  return (
    <BookingContext.Provider
      value={{
        building,
        setBuilding,
        room,
        setRoom,
        dateAndTime,
        setDateAndTime,
        duration,
        setDuration,
        activeComponent,
        setActiveComponent,
        buildingOpen,
        setBuildingOpen,
      }}
    >
      <div className="w-full h-screen flex flex-col bg-gray-100 z-0">
        <div className="max-w-md mx-auto  p-4 bg-white m-10 rounded-lg">
          <h1 className="text-3xl font-bold">
            Book study room at the{" "}
            <span className="text-red-500">University of Oslo</span>
          </h1>
          <Page />
        </div>
      </div>
    </BookingContext.Provider>
  );
};

export default BookRoom;

export { BookingContext };
