import { AES, enc } from "crypto-js";
import type { NextPage } from "next";
import BookRoom from "../components/bookRoom";
import ShowBookInfo from "../components/showBookInfo";

const Home: NextPage = () => {
  return (
    <>
      <ShowBookInfo />
    </>
  );
};

export default Home;
