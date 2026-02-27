import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { IoPeopleOutline } from "react-icons/io5";
import { CiBoxList } from "react-icons/ci";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import cargoLord from "../assets/cargoLord_logo.png";
import { MdOutlineCreditScore } from "react-icons/md";
import { MdContacts } from "react-icons/md";
import { TbLogs } from "react-icons/tb";
import axiosInstance from "../api/axiosInstance";
import { API_URL } from "../Config";
import { RiCustomerService2Line } from "react-icons/ri";
import { MdOutlineHouseSiding } from "react-icons/md";
import { MdEventAvailable } from "react-icons/md";
import { LiaShoppingBasketSolid } from "react-icons/lia";
import { GoContainer } from "react-icons/go";
import { GrStakeholder } from "react-icons/gr";


const Sidebar = () => {
  const [arrowClicked, setArrowClicked] = useState(() => {
    // Get the persisted state from localStorage
    const savedState = localStorage.getItem("sidebarState");
    return savedState === "true";
  });
  const [selectAnyOneClicked, setSelectAnyOneClicked] = useState(false);
  const [currentOpen, setCurrentOpen] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
   const storedDetalis = localStorage.getItem("cargouser");
  const parsedDetails = JSON.parse(storedDetalis);
  const role = parsedDetails.role;
  console.log("role", role);
  const toggleMenu = (menu) => {
    setCurrentOpen(currentOpen === menu ? null : menu);
  };
  const currentPath = location.pathname;
  let navigate = useNavigate();
  const [dropdownShow, setDropdownShow] = useState(false);

  const onClickArrow = () => {
    const newState = !arrowClicked;
    setArrowClicked(newState);
    localStorage.setItem("sidebarState", newState); // Persist the new state
  };

  const onClickSidebarMenu = async (label) => {

    if (label === "logout") {
      try {
        setButtonLoading(true);
        await logoutUser();
      } catch (err) {
        console.log("Logout error", err);
      } finally {
        setButtonLoading(false);
        navigate("/", { replace: true });
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      return;
    }

    // normal navigation
    navigate(`/${label.toLowerCase()}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  ;



  const isLoggingOut = useRef(false);

  const logoutUser = async () => {
    const storedUser = localStorage.getItem("cargouser");

    let loginLogId = null;

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      loginLogId = parsedUser.log_id;
    }

    console.log("loginLogId:", loginLogId);

    if (!loginLogId) {
      console.warn("No login log id found");
      return;
    }

    if (isLoggingOut.current) return;
    isLoggingOut.current = true;

    try {
      await axiosInstance.post("/api/auth/logout", {
        id: loginLogId,
      });

      console.log("Logout API success");
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  const onChangeSelect = (e) => {
    let value = e.target.value;
    let location = value.toLowerCase();
    navigate(`/${location}`);
  };

  return (
    <div>
      <section
        className={`bg-white max-md:hidden max-h-dvh transition-all duration-500 flex flex-col  ${arrowClicked ? "w-[60px]" : "w-52"
          }`}
      >
        <div className="fixed flex flex-col h-full">
          {/* Toggle Button */}
          <div
            className="flex justify-end items-center mt-3"
            onClick={onClickArrow}
            title="Toggle Sidebar"
          >
            <div
              className={`${arrowClicked ? "-me-3" : "-me-8"
                } w-6 h-6 rounded-full  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer`}
            >
              {arrowClicked ? (
                <IoIosArrowForward className="w-3 h-3" />
              ) : (
                <IoIosArrowBack className="w-3 h-3" />
              )}
            </div>
          </div>

          {arrowClicked ? (
            <div className="h-12 mt-6 ms-4 text-xl font-semibold">
              <p className="text-[#027dc4]">
                C<span className="text-[#00913f]">L</span>{" "}
              </p>
            </div>
          ) : (
            // <img src={medicsresearch_logo} alt="" className="h-12 w-24 ms-8" />
            <img src={cargoLord} alt="" className="h-12 w-24 ms-8" />
          )}

          {/* Sidebar Menu */}
          <div
            className={`${!arrowClicked && ""
              } flex-grow w-full flex flex-col mt-2 md:mt-5 justify-start ${arrowClicked ? "" : ""
              }`}
          >
            <div
              className={`flex gap-1  flex-col ${arrowClicked ? "items-center" : "items-start"
                }  `}
            >
              {/* dashboard */}
              {role !== "Agent" && (
              <div
                onClick={() => onClickSidebarMenu("Dashboard")}
                className={`flex items-center h-10 w-full ml-2 flex-grow ${arrowClicked ? "justify-center  " : "justify-normal"
                  } px-2 py-3 rounded-md gap-2 text-sm font-medium cursor-pointer ${currentPath === "/dashboard"
                    ? "bg-[#e6f2fa] text-[#057fc4]"
                    : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                  }`}
              >
                <CiBoxList />
                {!arrowClicked && <p className="text-sm">Dashboard</p>}
              </div>
              )}

              {/* order form
              <div
                onClick={() => onClickSidebarMenu("form-order")}
                className={`flex items-center h-10 w-full ml-2 flex-grow ${arrowClicked ? "justify-center  " : "justify-normal"
                  } px-2 py-3 rounded-md gap-2 text-sm font-medium cursor-pointer ${currentPath === "/form-order"
                    ? "bg-[#e6f2fa] text-[#057fc4]"
                    : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                  }`}
              >
                <GrStakeholder />
                {!arrowClicked && <p className="text-sm">OrderForm</p>}
              </div> */}

              


              {/* order */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>

                <div
                  onClick={() => toggleMenu("Order")}
                  className={`flex items-center w-full flex-grow
      ${arrowClicked ? "justify-center" : "justify-normal"}
      px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
      ${currentPath === "/parcel" || currentPath === "/order" || currentPath === "/collection" || currentPath === "/customer" || currentPath === "/beneficiary"
                      ? "bg-[#e6f2fa] text-[#057fc4] hover:text-[#057fc4]"
                      : "group text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                    }`}
                >
                  <LiaShoppingBasketSolid className="w-5" />

                  {!arrowClicked && (
                    <div className="flex items-center gap- justify-between w-full">
                      <span className="text-sm font-medium">Order</span>
                      {currentOpen === "Order" ||
                        currentPath === "/parcel" ||
                        currentPath === "/order" ||
                        currentPath === "/customer" ||
                        currentPath === "/beneficiary" ||
                        currentPath === "/collection" ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </div>
                  )}
                </div>

                {!arrowClicked && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${currentOpen === "Order" ||
                      currentPath === "/parcel" ||
                      currentPath === "/order" ||
                      currentPath === "/customer" ||
                      currentPath === "/beneficiary" ||
                      currentPath === "/collection"
                      ? "max-h-60 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="flex gap-2 ms-8 flex-col text-sm font-medium text-gray-500">

                      {/* <button
                        onClick={() => {
                          navigate("/customer");
                          setCurrentOpen("Order");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/customer"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Customer
                      </button>
                      <button
                        onClick={() => {
                          navigate("/beneficiary");
                          setCurrentOpen("Order");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/beneficiary"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Beneficiary
                      </button> */}
                      <button
                        onClick={() => {
                          navigate("/order");
                          setCurrentOpen("Order");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/order"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Order List
                      </button>
                      {/* <button
                        onClick={() => {
                          navigate("/parcel");
                          setCurrentOpen("Order");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/parcel"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Parcel / Pieces
                      </button> */}
                      <button
                        onClick={() => {
                          navigate("/collection");
                          setCurrentOpen("Order");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/collection"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Collection
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* run */}
              <div
                onClick={() => onClickSidebarMenu("Run")}
                className={`flex items-center h-10 w-full ml-2 flex-grow ${arrowClicked ? "justify-center  " : "justify-normal"
                  } px-2 py-3 rounded-md gap-2 text-sm font-medium cursor-pointer ${currentPath === "/run"
                    ? "bg-[#e6f2fa] text-[#057fc4]"
                    : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                  }`}
              >
                <GoContainer />
                {!arrowClicked && <p className="text-sm">Container Run</p>}
              </div>

              {/* events */}
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>

                <div
                  onClick={() => toggleMenu("Event")}
                  className={`flex items-center w-full flex-grow
      ${arrowClicked ? "justify-center" : "justify-normal"}
      px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
      ${currentPath === "/event-master" || currentPath === "/event"
                      ? "bg-[#e6f2fa] text-[#057fc4] hover:text-[#057fc4]"
                      : "group text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                    }`}
                >
                  <MdEventAvailable className="w-5" />

                  {!arrowClicked && (
                    <div className="flex items-center gap- justify-between w-full">
                      <span className="text-sm font-medium">Events</span>
                      {currentOpen === "Event" ||
                        currentPath === "/event-master" ||
                        currentPath === "/event" ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </div>
                  )}
                </div>

                {!arrowClicked && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${currentOpen === "Event" ||
                      currentPath === "/event-master" ||
                      currentPath === "/event"
                      ? "max-h-40 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="flex gap-2 ms-8 flex-col text-sm font-medium text-gray-500">

                      <button
                        onClick={() => {
                          navigate("/event-master");
                          setCurrentOpen("Event");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/event-master"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Event Master
                      </button>
                      <button
                        onClick={() => {
                          navigate("/event");
                          setCurrentOpen("Event");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/event"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Cargo Movement
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* user */}
              {role !== "Agent" && (
              <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>

                <div
                  onClick={() => toggleMenu("user")}
                  className={`flex items-center w-full flex-grow
      ${arrowClicked ? "justify-center" : "justify-normal"}
      px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
      ${currentPath === "/roles" || currentPath === "/users"
                      ? "bg-[#e6f2fa] text-[#057fc4] hover:text-[#057fc4]"
                      : "group text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                    }`}
                >
                  <IoPeopleOutline className="w-5" />

                  {!arrowClicked && (
                    <div className="flex items-center gap- justify-between w-full">
                      <span className="text-sm font-medium">User</span>
                      {currentOpen === "user" ||
                        currentPath === "/roles" ||
                        currentPath === "/users" ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </div>
                  )}
                </div>

                {!arrowClicked && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${currentOpen === "user" ||
                      currentPath === "/roles" ||
                      currentPath === "/users"
                      ? "max-h-40 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="flex gap-2 ms-8 flex-col text-sm font-medium text-gray-500">

                      <button
                        onClick={() => {
                          navigate("/roles");
                          setCurrentOpen("user");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/roles"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Roles
                      </button>
                      <button
                        onClick={() => {
                          navigate("/users");
                          setCurrentOpen("report");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/users"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Users
                      </button>
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* Receipt */}
              {/* <div
                onClick={() => onClickSidebarMenu("Receipt")}
                className={`flex items-center h-10 w-full ml-2 flex-grow ${arrowClicked ? "justify-center  " : "justify-normal"
                  } px-2 py-3 rounded-md gap-2 text-sm font-medium cursor-pointer ${currentPath === "/receipt"
                    ? "bg-[#e6f2fa] text-[#057fc4]"
                    : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                  }`}
              >
                <CiBoxList />
                {!arrowClicked && <p className="text-sm">Receipt</p>}
              </div> */}


              {/* Core entities */}
              {/* <div className={`w-full ${arrowClicked ? "px-0" : "px-2"}`}>

                <div
                  onClick={() => toggleMenu("core")}
                  className={`flex items-center w-full flex-grow
      ${arrowClicked ? "justify-center" : "justify-normal"}
      px-2 py-3 h-10 rounded-md gap-2 text-sm font-medium cursor-pointer
      ${currentPath === "/parcel" || currentPath === "/event" || currentPath === "/order" || currentPath === "/run"
                      ? "bg-[#e6f2fa] text-[#057fc4]"
                      : "group text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                    }`}
                >
                  <MdOutlineCreditScore className="w-5" />


                  {!arrowClicked && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium">Core Entities</span>
                      {currentOpen === "core" ||
                        currentPath === "/parcel" ||
                        currentPath === "/event" ||
                        currentPath === "/order" ||
                        currentPath === "/run" ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </div>
                  )}
                </div>

                {!arrowClicked && (
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${currentOpen === "core" ||
                      currentPath === "/parcel" ||
                      currentPath === "/event" ||
                      currentPath === "/order" ||
                      currentPath === "/run"
                      ? "max-h-60 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="flex gap-2 ms-8 flex-col text-sm font-medium text-gray-500">

                      <button
                        onClick={() => {
                          navigate("/order");
                          setCurrentOpen("core");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/order"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Order
                      </button>
                      <button
                        onClick={() => {
                          navigate("/parcel");
                          setCurrentOpen("core");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/parcel"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Parcel / Pieces
                      </button>
                      <button
                        onClick={() => {
                          navigate("/run");
                          setCurrentOpen("core");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/run"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Container Run
                      </button>
                      <button
                        onClick={() => {
                          navigate("/event");
                          setCurrentOpen("core");
                        }}
                        className={`w-full text-left px-2 py-1 rounded-md transition
            ${currentPath === "/event"
                            ? "text-[#057fc4]"
                            : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                          }`}
                      >
                        Event (Cargo)
                      </button>
                    </div>
                  </div>
                )}
              </div> */}

              {/* contact us */}
              {role !== "Agent" && (
              <div
                onClick={() => onClickSidebarMenu("contact-us")}
                className={`flex items-center h-10 w-full ml-2 flex-grow ${arrowClicked ? "justify-center  " : "justify-normal"
                  } px-2 py-3 rounded-md gap-2 text-sm font-medium cursor-pointer ${currentPath === "/contact-us"
                    ? "bg-[#e6f2fa] text-[#057fc4]"
                    : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                  } `}
              >
                <MdContacts />
                {!arrowClicked && <p className="text-sm">Contact Us</p>}
              </div>
              )}
              {/* audit log */}
              {role !== "Agent" && (
              <div
                onClick={() => onClickSidebarMenu("audit-logs")}
                className={`flex items-center h-10 w-full ml-2 flex-grow ${arrowClicked ? "justify-center  " : "justify-normal"
                  }  px-2 py-3 rounded-md gap-2 text-sm font-medium cursor-pointer ${currentPath === "/audit-logs"
                    ? "bg-[#e6f2fa] text-[#057fc4]"
                    : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                  }`}
              >
                <TbLogs />
                {!arrowClicked && <p className="text-sm">Audit Logs</p>}
              </div>
              )}

            </div>

            <hr className="my-5 mx-4 border-gray-300" />
            {/* setting */}
            
            <div className="w-[95%] px-2">
              {/* settings */}
              {role !== "Agent" && (
              <div onClick={() => onClickSidebarMenu("system-setting")} className="flex flex-col gap-6 ">

                {[{ icon: <IoSettingsOutline />, label: "System Setting" }].map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center ${arrowClicked ? "justify-center" : "justify-normal"
                        }  px-2 py-3 rounded-md gap-3 text-sm font-medium cursor-pointer ${currentPath === "/system-setting"
                          ? "bg-[#e6f2fa] text-[#057fc4]"
                          : "text-gray-500 hover:bg-[#e6f2fa] hover:text-[#057fc4]"
                        }`}
                    >
                      <div className="flex items-center justify-center h-5 w-5">
                        {item.icon}
                      </div>
                      {!arrowClicked && <p className="text-sm">{item.label}</p>}
                    </div>
                  )
                )}
              </div>
              )}

              {/* logout */}
              <div
                onClick={() => onClickSidebarMenu("logout")}
                className={`flex items-center ${arrowClicked ? "justify-center" : "justify-normal"
                  } px-2 py-3 gap-5 md:mt-2 items-center bg-[#067fc4] hover:bg-[#2d93cf] rounded-full cursor-pointer`}
              >
                <div className="text-white flex items-center p-1 justify-center">
                  <MdLogout />
                </div>
                {!arrowClicked && (
                  <p className="text-sm font-medium  text-white">Logout</p>
                )}
              </div>
            </div>
           
          </div>

          {/* User Section */}
          <div>
            <hr className="border-gray-300" />
            <div className="flex items-center gap-3 px-2 py-4">
              <div className="h-10 w-10 rounded-full bg-yellow-500"></div>
              {!arrowClicked && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-gray-500">
                      Welcome back
                    </p>
                  </div>
                  <p className="font-medium text-sm">Leo Das</p>
                </div>
              )}
              {!arrowClicked && (
                <IoIosArrowForward className="ml-auto text-gray-600 cursor-pointer" />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;
