import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { FaBox, FaCheckCircle, FaClock } from "react-icons/fa";

const Dashboard_Mainbar = () => {
  const [value, onChange] = useState(new Date());
  let navigate = useNavigate();

  const dashboardData = [
    {
      title: "Total Orders",
      value: 120,
      icon: <FaBox size={28} />,
      color: "bg-blue-500",
    },
    {
      title: "Orders Delivered",
      value: 85,
      icon: <FaCheckCircle size={28} />,
      color: "bg-green-500",
    },
    {
      title: "Pending Orders",
      value: 15,
      icon: <FaClock size={28} />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="w-screen min-h-screen flex flex-col justify-between bg-gray-100 md:px-5 px-5 pt-2 md:pt-3">
      <div>
        <Mobile_Sidebar />

        {/* Breadcrumb */}
        <div className="flex mt-2 md:mt-0 gap-2 items-center ms-5">
          <p className="text-xs md:text-sm text-[#067fc4] font-medium">Dashboard</p>
          <p>{">"}</p>
        </div>



        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 px-4 md:px-6">
          {dashboardData.map((item, index) => (
            <div
              key={index}
              className="shine-card bg-white rounded-xl shadow-md p-5 flex items-center justify-between hover:shadow-xl transition duration-300"
            >
              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>
                <h2 className="text-2xl font-bold mt-1">{item.value}</h2>
              </div>

              <div className={`text-white p-3 rounded-full ${item.color}`}>
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard_Mainbar;