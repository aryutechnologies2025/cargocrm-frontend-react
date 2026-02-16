import React from "react";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import medics_logo from "../assets/medics_logo.svg";
import { IoPeopleOutline } from "react-icons/io5";
import { BsCalendar2Check } from "react-icons/bs";
import { FaRegMessage } from "react-icons/fa6";
import { GrMoney } from "react-icons/gr";
import { TbUrgent } from "react-icons/tb";
import { CiMoneyCheck1 } from "react-icons/ci";
import { MdLogout } from "react-icons/md";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { CiDeliveryTruck, CiBoxList } from "react-icons/ci";

const Mobile_Sidebar = () => {
  let navigate = useNavigate();

  const [hamburgerIconClicked, setHamburgerIconClicked] = useState(false);
  const [selectAnyOneClicked, setSelectAnyOneClicked] = useState(false);

  const onClickSidebarMenu = (label) => {
    navigate(`/${label.toLowerCase()}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const onClickHamburgerIcon = () => {
    setHamburgerIconClicked(!hamburgerIconClicked);
  };

  useEffect(() => {
    if (hamburgerIconClicked) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on component unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [hamburgerIconClicked]);
  return (
    <div>
      <div className="flex my-3 justify-start items-center w-full md:hidden">
        <GiHamburgerMenu className="text-xl" onClick={onClickHamburgerIcon} />
      </div>

      {hamburgerIconClicked && (
        <div className="fixed block md:hidden h-screen  inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 backdrop-blur-sm bg-opacity-25"
            onClick={() => setHamburgerIconClicked(false)}
          ></div>

          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-[70vw] sm:w-[50vw] bg-white shadow-lg transform transition-transform duration-1000 ease-in-out${
              hamburgerIconClicked ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Close Button */}
              <div className="flex mt-4 ps-5">
                <IoClose
                  className="text-2xl"
                  onClick={() => setHamburgerIconClicked(false)}
                />
              </div>

              {/* Logo */}
              <div className="flex items-center justify-center">
                <img src={medics_logo} alt="" className="w-20 h-10" />
              </div>

              {/* Sidebar Menu */}
              <div className="flex-grow overflow-y-auto w-full flex flex-col justify-start">
                <div className="flex flex-col gap-1 mt-3 px-4">
                  <div
                    onClick={() => onClickSidebarMenu("Dashboard")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <CiBoxList />
                    </div>
                    <p>Dashboard</p>
                  </div>

                  <div
                    onClick={() => setSelectAnyOneClicked(!selectAnyOneClicked)}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <IoPeopleOutline />
                    </div>
                    <p>Employee</p>
                    {selectAnyOneClicked ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}{" "}
                  </div>

                  {selectAnyOneClicked && (
                    <div
                      className={`overflow-hidden w-full transition-all duration-700 ease-in-out ${
                        selectAnyOneClicked
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="flex gap-2  items-start  ms-10 flex-col text-sm font-medium text-gray-500">
                        <button
                          onClick={() => onClickSidebarMenu("roles")}
                          className="hover:bg-blue-100 px-2 py-1 rounded-full"
                        >
                          Roles
                        </button>
                        <button
                          onClick={() => onClickSidebarMenu("permission")}
                          className="hover:bg-blue-100 px-2 py-1 rounded-full"
                        >
                          Permission
                        </button>
                        <button
                          onClick={() => onClickSidebarMenu("employees")}
                          className="hover:bg-blue-100 px-2 py-1 rounded-full"
                        >
                          Employees
                        </button>
                      </div>
                    </div>
                  )}

                  <div
                    onClick={() => onClickSidebarMenu("Vacancies")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <TbUrgent />
                    </div>
                    <p>Vacancies</p>
                  </div>
                  <div
                    onClick={() => onClickSidebarMenu("Attendance")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <BsCalendar2Check />
                    </div>
                    <p>Attendance</p>
                  </div>
                  <div
                    onClick={() => onClickSidebarMenu("Leaves")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <CiDeliveryTruck />
                    </div>
                    <p>Leaves</p>
                  </div>
                  <div
                    onClick={() => onClickSidebarMenu("Payroll")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <CiMoneyCheck1 />
                    </div>
                    <p>Payroll</p>
                  </div>
                  <div
                    onClick={() => onClickSidebarMenu("Finance")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <GrMoney />
                    </div>
                    <p>Finance</p>
                  </div>
                  <div
                    onClick={() => onClickSidebarMenu("Message")}
                    className="flex items-center w-full hover:bg-blue-100 hover:text-[#4F46E5] px-3 py-2 rounded-lg gap-2 text-gray-500 text-sm font-medium cursor-pointer"
                  >
                    <div className="flex items-center justify-center h-5 w-5">
                      <FaRegMessage />
                    </div>
                    <p>Message</p>
                  </div>
                </div>

                <hr className="my-3 mx-4 border-gray-300" />

                {/* Settings */}
                <div className="mt-3 px-4">
                  <div className="flex items-center hover:bg-blue-100 px-3 py-2 hover:text-[#4F46E5] rounded-lg gap-3 text-gray-500 text-sm font-medium cursor-pointer">
                    <IoSettingsOutline />
                    <p className="text-sm">Settings</p>
                  </div>
                </div>

                {/* Logout */}
                <div className="bg-blue-500 rounded-full mb-3 text-white w-fit mx-7">
                  <div className="flex gap-3 items-center px-3 py-2">
                    <div className="flex items-center justify-center h-5 w-5">
                      <MdLogout />
                    </div>
                    <p className="text-sm">Logout</p>
                  </div>
                </div>
              </div>

              {/* User Section */}
              <div>
                <hr className="border-gray-300" />
                <div className="flex items-center gap-3 px-4 py-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-500"></div>
                  <div className="flex flex-col">
                    <p className="text-xs font-medium text-gray-500">
                      Welcome back
                    </p>
                    <p className="font-medium text-sm">Leo Das</p>
                  </div>
                  <IoIosArrowForward className="ml-auto text-gray-600 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mobile_Sidebar;
