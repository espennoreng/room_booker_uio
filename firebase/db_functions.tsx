import db from "./firebase_config";
import { collection, getDocs } from "firebase/firestore/lite";

const getAllRooms = async () => {
  const roomsCol = collection(db, "rooms");
  const roomSnapshot = await getDocs(roomsCol);
  const roomList = roomSnapshot.docs.map((doc) => doc.data());
  return roomList;
};

const _roomsPerStory = (rooms: any) => {
  let roomsPerStory = {} as any;
  rooms.forEach((room: any) => {
    const story = parseInt(room.room_id.charAt(0));
    if (roomsPerStory[story]) {
      roomsPerStory[story].push(room);
    } else {
      roomsPerStory[story] = [room];
    }
  });
  return roomsPerStory;
};

const getAvailableRooms = async () => {
  const roomsCol = collection(db, "rooms");
  const roomSnapshot = await getDocs(roomsCol);
  let roomList: any = roomSnapshot.docs.map((doc) => doc.data());
  roomList = roomList.filter((room: any) => room.available === true);

  const roomsWithStory = _roomsPerStory(roomList);

  return {
    rooms: roomList,
    roomsWithStory: roomsWithStory,
    last_updated: roomList[roomList.length - 1].last_updated
      .toDate()
      .toLocaleString(),
  };
};

export { getAllRooms, getAvailableRooms };

// 3468 - 3408
