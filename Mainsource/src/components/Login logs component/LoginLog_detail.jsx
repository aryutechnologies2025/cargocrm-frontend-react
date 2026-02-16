import React, { useState } from "react";
import ReactDOM from "react-dom";
import { TfiPencilAlt } from "react-icons/tfi";
import ReactDOMServer from "react-dom/server";
import { RiDeleteBin6Line } from "react-icons/ri";
import aryu_logo from "../../assets/aryu_logo.svg";
import { MdOutlineDeleteOutline } from "react-icons/md";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { FaEye } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io"
DataTable.use(DT);

const LoginLog_detail = () => {
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedLog, setSelectedLog] = useState(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewLog, setViewLog] = useState(null);


    const openAddModal = () => {
        setIsAddModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
    };

    const closeAddModal = () => {
        setIsAnimating(false);
        setErrors({});
        setTimeout(() => setIsAddModalOpen(false), 250);
    };

    const openEditModal = (row) => {
        console.log("row", row);
        setSelectedLog(row);
        setIsEditModalOpen(true);
        setTimeout(() => setIsAnimating(true), 10);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const columns = [
        {
            title: "Sno",
            data: "Sno",
        },
        {
            title: "User ID",
            data: "user_id",
        },
        {
            title: "User Name",
            data: "user_name",
        },
        {
            title: "Login Time",
            data: "login_time",
        },
        {
            title: "IP Address",
            data: "ip_address",
        },
        {
            title: "Status",
            data: "status",
            render: (data) => {
                const textColor = data === 1 ? "red" : "green";
                const bgColor = data === 1 ? "#ffe5e5" : "#e6fffa";
                return ` <div style="display: inline-block; padding: 4px 8px; color: ${textColor}; background-color: ${bgColor}; border: 1px solid ${bgColor};  border-radius: 50px; text-align: center; width:100px; font-size: 10px; font-weight: 700;">
                  ${data === 1 ? "Inactive" : "Active"}
                </div>`;
            },
        },
        {
            title: "Action",
            data: null,
            render: (data, type, row) => {
                const id = `actions-${row.sno || Math.random()}`;
                setTimeout(() => {
                    const container = document.getElementById(id);
                    if (container) {
                        if (!container._root) {
                            container._root = createRoot(container);
                        }
                        container._root.render(
                            <div
                                className="action-container"
                                style={{
                                    display: "flex",
                                    gap: "15px",
                                    alignItems: "flex-end",
                                    justifyContent: "center",
                                }}
                            >
                                <div
                                    className="modula-icon-edit flex gap-2"
                                    style={{
                                        color: "#000",
                                    }}
                                >
                                    <button
                                        onClick={() => {
                                            setViewLog(row);
                                            setViewModalOpen(true);

                                        }}
                                        className="p-1 bg-blue-50 text-[#057fc4] rounded-[10px] hover:bg-[#DFEBFF]"
                                    >
                                        <FaEye />
                                    </button>
                                    <TfiPencilAlt
                                        className="cursor-pointer "
                                        onClick={() => {
                                            openEditModal(
                                                row._id,
                                                row.user_id,
                                                row.user_name,
                                                row.login_time,
                                                row.ip_address,
                                                row.status,
                                            );
                                        }}
                                    />
                                    <MdOutlineDeleteOutline
                                        className="text-red-600 text-xl cursor-pointer"
                                        onClick={() => {
                                            deleteRoles(row._id);
                                        }}
                                    />
                                </div>

                                {/* <div className="modula-icon-del" style={{
                      color: "red"
                    }}>
                      <RiDeleteBin6Line
                        onClick={() => handleDelete(row.id)}
                      />
                    </div> */}
                            </div>,
                            container
                        );
                    }
                }, 0);
                return `<div id="${id}"></div>`;
            },
        },
    ];

    const data = [
        {
            Sno: 1,
            user_id: "J33399",
            user_name: "Ias",
            login_time: "11:00:00",
            ip_address: "P998998",
            Status: 0,
        },
        {
            Sno: 2,
            user_id: "J33399",
            user_name: "Ias",
            login_time: "11:00:00",
            ip_address: "P998998",
            Status: 1,
        },
        {
            Sno: 3,
            user_id: "J33399",
            user_name: "Ias",
            login_time: "11:00:00",
            ip_address: "P998998",
            status: 1,
        },
    ];

    return (
        <div className="bg-gray-100 flex flex-col justify-between w-screen min-h-screen px-5 pt-2 md:pt-4">
            <div>
                <Mobile_Sidebar />
                <div className="flex  gap-2 mt-2 md:mt-0 ms-5 items-center">
                    <p
                        className="text-sm md:text-md text-gray-500"
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </p>
                    <p>{">"}</p>

                    <p className="text-sm md:text-md text-[#057fc4]">Login Logs</p>
                </div>
                {/* Add Button */}
                <div className="flex justify-end mt-8">
                    {/* <button
            onClick={openAddModal}
            className="bg-[#067fc4] px-3 py-2 text-white w-20 rounded-2xl"
          >
            Add
          </button> */}
                </div>

                <div className="datatable-container mt-5">
                    {/* Responsive wrapper for the table */}
                    <div className="table-scroll-container">
                        <DataTable
                            data={data}
                            columns={columns}
                            options={{
                                paging: true,
                                searching: true,
                                ordering: true,
                                scrollX: true, // Horizontal scrolling
                                responsive: true, // Enable responsiveness
                                autoWidth: false, // Disable auto width for proper column adjustments
                            }}
                            className="display nowrap bg-white"
                        />
                    </div>
                </div>

                {/* Add Modal */}
                {/* {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-xl w-96">
              <h2 className="text-lg font-semibold mb-4">Add Role</h2>
              <label
                htmlFor="roleName"
                className="block text-sm font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="roleName"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p>Status</p>
              <select
                name=""
                id=""
                className="w-full h-10 rounded-lg px-1 outline border-0 border-gray-300 outline-gray-300"
              >
                <option value="">Active</option>
                <option value="">Inactive</option>
              </select>
              <div className="flex justify-end gap-2 mt-8">
                <button
                  onClick={closeAddModal}
                  className="bg-gray-400 px-4 py-2 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button className="bg-blue-600 px-4 py-2 text-white rounded-lg">
                  Save
                </button>
              </div>
            </div>
          </div>
        )} */}

                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                        {/* Overlay */}
                        <div className="absolute inset-0 " onClick={closeAddModal}></div>

                        <div
                            className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                                }`}
                        >
                            <div
                                className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                                title="Toggle Sidebar"
                                onClick={closeAddModal}
                            >
                                <IoIosArrowForward className="w-3 h-3" />
                            </div>

                            <div className="px-5 lg:px-14 py-2 md:py-10">
                                <p className="text-2xl md:text-3xl font-medium">Add Login Logs</p>


                                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                                    <div className="">
                                        <label
                                            htmlFor="firstName"
                                            className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                                        >
                                            User ID <span className="text-red-500">*</span>
                                        </label>

                                    </div>
                                    <div className="w-[60%] md:w-[50%]">
                                        <input
                                            type="text"
                                            id="user_id"
                                            name="user_id"
                                            placeholder="Enter User ID"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>
                                </div>


                                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                                    <div className="">
                                        <label
                                            htmlFor="roleName"
                                            className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                                        >
                                            User Name <span className="text-red-500">*</span>
                                        </label>

                                    </div>
                                    <div className="w-[60%] md:w-[50%]">
                                        <input
                                            type="text"
                                            id="user_name"
                                            name="user_name"
                                            placeholder="Enter user name"
                                            // onChange={(e) => {
                                            //   setRoleName(e.target.value);
                                            //   validateRoleName(e.target.value); // Validate role name dynamically
                                            // }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {/* {errors.name && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {errors.name}
                      </p>
                    )} */}
                                    </div>
                                </div>

                                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                                    <div className="">
                                        <label
                                            htmlFor="roleName"
                                            className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                                        >
                                            Login Time <span className="text-red-500">*</span>
                                        </label>

                                    </div>
                                    <div className="w-[60%] md:w-[50%]">
                                        <input
                                            type="time"
                                            id="login_time"
                                            name="login_time"
                                            placeholder="Enter login time"
                                            // onChange={(e) => {
                                            //   setRoleName(e.target.value);
                                            //   validateRoleName(e.target.value); // Validate role name dynamically
                                            // }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {/* {errors.name && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {errors.name}
                      </p>
                    )} */}
                                    </div>
                                </div>

                                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                                    <div className="">
                                        <label
                                            htmlFor="roleName"
                                            className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                                        >
                                            IP address <span className="text-red-500">*</span>
                                        </label>

                                    </div>
                                    <div className="w-[60%] md:w-[50%]">
                                        <input
                                            type="number"
                                            id="ip_address"
                                            name="ip_address"
                                            placeholder="Enter Ip address"
                                            // onChange={(e) => {
                                            //   setRoleName(e.target.value);
                                            //   validateRoleName(e.target.value); // Validate role name dynamically
                                            // }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {/* {errors.name && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {errors.name}
                      </p>
                    )} */}
                                    </div>
                                </div>



                                <div className="mt-2 md:mt-8 flex justify-between items-center">
                                    <div className="">
                                        <label
                                            htmlFor="status"
                                            className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                                        >
                                            Status <span className="text-red-500">*</span>
                                        </label>

                                    </div>
                                    <div className="w-[60%] md:w-[50%]">
                                        <select
                                            name="status"
                                            id="status"
                                            // onChange={(e) => {
                                            //   setStatus(e.target.value);
                                            //   validateStatus(e.target.value); // Validate status dynamically
                                            // }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select a status</option>
                                            <option value="1">Active</option>
                                            <option value="0">InActive</option>
                                        </select>
                                        {/* {errors.status && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {errors.status}
                      </p>
                    )} */}
                                    </div>
                                </div>
                                {/* {error.status && <p className="error">{error.status}</p>} */}

                                <div className="flex  justify-end gap-2 mt-5 md:mt-14">
                                    <button
                                        onClick={closeAddModal}
                                        className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-[#067fc4] hover:bg-[#2d93cf] text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                                    // onClick={handlesubmit}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
                        {/* Overlay */}
                        <div className="absolute inset-0 " onClick={closeEditModal}></div>

                        <div
                            className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[53vw] bg-white shadow-lg  transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                                }`}
                        >
                            <div
                                className="w-6 h-6 rounded-full  mt-2 ms-2  border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                                title="Toggle Sidebar"
                                onClick={closeEditModal}
                            >
                                <IoIosArrowForward className="w-3 h-3" />
                            </div>

                            <div className="px-5 lg:px-14 py-10">
                                <p className="text-2xl md:text-3xl font-medium">Edit Login Logs</p>

                                <div className="mt-10  rounded-lg ">
                                    <div className="bg-white  rounded-xl w-full">

                                        <div className="mt-8 flex justify-between items-center">
                                            <label className="block text-[15px] md:text-md font-medium mb-2">
                                                User ID <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="text"
                                                    placeholder="Enter first name"
                                                    value={selectedLog?.user_id}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-between items-center">
                                            <label className="block text-[15px] md:text-md font-medium mb-2">
                                                User Name<span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="date"
                                                    placeholder="Enter last name"
                                                    value={selectedLog?.user_name}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-between items-center">
                                            <label className="block text-[15px] md:text-md font-medium mb-2">
                                                Login Time <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="email"
                                                    placeholder="Enter email"
                                                    value={selectedLog?.login_time}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-between items-center">
                                            <label className="block text-[15px] md:text-md font-medium mb-2">
                                                IP address <span className="text-red-500">*</span>
                                            </label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <input
                                                    type="number"
                                                    placeholder="Enter phone number"
                                                    value={selectedLog?.ip_address}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>


                                        <div className="mt-8 flex justify-between items-center">
                                            <label className="block text-[15px] md:text-md font-medium mb-2">Status <span className="text-red-500">*</span></label>
                                            <div className="w-[60%] md:w-[50%]">
                                                <select
                                                    name="status"
                                                    id="status"
                                                    value={selectedLog?.status}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="1">Active</option>
                                                    <option value="0">InActive</option>
                                                </select>
                                            </div>
                                        </div>
                                        {errors.status && (
                                            <p className="text-red-500 text-sm mb-4">
                                                {errors.status[0]}
                                            </p>
                                        )}

                                        <div className="flex justify-end gap-2 mt-14">
                                            <button
                                                onClick={closeEditModal}
                                                className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                //  onClick={() => handleSave(roleDetails.id)}
                                                className="bg-[#067fc4] hover:bg-[#2d93cf] text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {viewModalOpen && viewLog && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                        <div className="relative bg-white w-[95%] md:w-[500px] rounded-xl shadow-lg p-6">

                            {/* Close Icon */}
                            <button
                                onClick={() => setViewModalOpen(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
                            >
                                <IoIosCloseCircle size={28} />
                            </button>

                            <h2 className="text-xl font-semibold mb-6 text-[#057fc4]">
                                Login Logs Details
                            </h2>

                            <div className="space-y-4 text-sm text-gray-700">

                                {/* User ID */}
                                <div className="flex justify-between ">
                                    <span className="font-medium">User ID</span>
                                    <span>{viewLog.user_id}</span>
                                </div>

                                {/* User name */}
                                <div className="flex justify-between ">
                                    <span className="font-medium">User Name</span>
                                    <span>{viewLog.user_name}</span>
                                </div>

                                {/* Login Time */}
                                <div className="flex justify-between ">
                                    <span className="font-medium">Login Time</span>
                                    <span>{viewLog.login_time}</span>
                                </div>

                                {/* IP address */}
                                <div className="flex justify-between ">
                                    <span className="font-medium">IP Address</span>
                                    <span>{viewLog.ip_address}</span>
                                </div>

                                {/* Status */}
                                <div className="flex justify-between ">
                                    <span className="font-medium">Status</span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium
                      ${viewLog.status === 1 || viewLog.status === "1"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {viewLog.status === 1 || viewLog.status === "1"
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

            </div>

            <div>
                <Footer />
            </div>
        </div>
    );
};

export default LoginLog_detail;

