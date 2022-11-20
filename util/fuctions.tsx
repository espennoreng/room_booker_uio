const roundToNearest15 = (date: any) => {
  const minutes = 15;
  const ms = 1000 * 60 * minutes;
  return new Date(Math.ceil(date.getTime() / ms) * ms);
};

const getAvailableRooms = (selectedBuilding: string, setLoading: any) => {
  setLoading(true);
  const duration = 2;
  // tomorrow
  const startDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1
  );

  const requestRooms = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: process.env.NEXT_PUBLIC_PASS,
      username: process.env.NEXT_PUBLIC_USER,
      date: startDate,
      duration: duration,
      building: selectedBuilding,
    }),
  };
  let data = fetch("http://127.0.0.1:5000/get-rooms", requestRooms)
    .then((res) => res.json())
    .then((data) => {
      setLoading(false);
      return data;
    });

  return data;
};

const updateRoom = () => {
  const requestRooms = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: process.env.NEXT_PUBLIC_PASS,
      username: process.env.NEXT_PUBLIC_USER,
    }),
  };
  fetch("http://127.0.0.1:5000/update-rooms", requestRooms)
    .then((res) => res.json())

    .then((data) => {
      console.log(data);
    });
};

export { roundToNearest15, getAvailableRooms, updateRoom };
