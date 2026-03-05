import React from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FaTruckLoading } from "react-icons/fa";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex">

      <div className="bg-gray-100 flex flex-col items-center justify-center gap-2 min-h-screen w-full">
       <div className="flex justify-center items-center gap-3">
         <p className="text-3xl md:text-6xl font-semibold text-gray-800">404</p>
         <p className="text-3xl md:text-6xl text-gray-800"><FaTruckLoading /></p>
       </div>
       

        <p className="font-semibold text-lg md:text-3xl">
          Shipment Route Not Found
        </p>

        <p className="text-gray-500 text-sm">
          Please navigate back to the Cargo Lord dashboard.
        </p>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-[#057fc4] mt-4 text-white px-4 py-2 rounded-2xl hover:bg-[#046aa3]"
        >
          Go To Dashboard
        </button>

      </div>
    </div>
  );
};

export default PageNotFound;