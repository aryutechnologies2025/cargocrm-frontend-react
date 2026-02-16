import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar_style.css";
import { Line, Circle } from "rc-progress";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";

const Dashboard_Mainbar = () => {
  const [value, onChange] = useState(new Date());

  let navigate = useNavigate();

  return (
    <div className=" w-screen min-h-screen flex flex-col justify-between bg-gray-100 md:px-5 px-5 pt-2 md:pt-3 ">
      <div>
        <Mobile_Sidebar />

        <div className="flex mt-2 md:mt-0 gap-2 items-center ms-5">
          <p className="text-sm text-[#067fc4]">Dashboard</p>
          <p>{">"}</p>
        </div>

        
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard_Mainbar;
