import { AES, enc } from "crypto-js";
import type { NextPage } from "next";
import ShowBookInfo from "../components/showBookInfo";

const Home: NextPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <ShowBookInfo />
    </div>
  );
};

export default Home;
