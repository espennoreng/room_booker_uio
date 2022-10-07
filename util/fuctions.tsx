const roundToNearest15 = (date: any) => {
  const minutes = 15;
  const ms = 1000 * 60 * minutes;
  return new Date(Math.ceil(date.getTime() / ms) * ms);
};

export { roundToNearest15 };
