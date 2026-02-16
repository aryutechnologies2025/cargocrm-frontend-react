import React, { useEffect, useState } from "react";
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
import { BiCustomize } from "react-icons/bi";
DataTable.use(DT);

const Event_detail = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewEvent, setViewEvent] = useState(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    Sno: true,
    event_id: true,
    event_name: true,
    run_no: true,
    tracking_no: true,
    quantity: true,
    weight: true,
    event_date: true,
    event_time: true,
    created_by: true,
    status: true,
  });

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => {
      const newState = { ...prev, [key]: !prev[key] };

      const columnIndexMap = {
        Sno: 0,
        event_id: 1,
        event_name: 2,
        run_no: 3,
        tracking_no: 4,
        quantity: 5,
        weight: 6,
        event_date: 7,
        event_time: 8,
        created_by: 9,
        status: 10,
      };

      const index = columnIndexMap[key];

      if (window.contactTable && index !== undefined) {
        window.contactTable.column(index).visible(newState[key]);
      }

      return newState;
    });
  };


  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };


  useEffect(() => {
    const table = document.querySelector(".datatable-container");

    const handleClick = (e) => {
      if (e.target.classList.contains("edit-btn")) {
        const row = JSON.parse(e.target.getAttribute("data-row"));
        openEditModal(row);
      }
    };

    table?.addEventListener("click", handleClick);

    return () => table?.removeEventListener("click", handleClick);
  }, []);



  const closeAddModal = () => {
    setIsAnimating(false);
    setErrors({});
    setTimeout(() => setIsAddModalOpen(false), 250);
  };

  const openEditModal = (event_id, event_name, run_no, tracking_no, quantity, weight, event_date, event_time, created_by, status) => {
    setSelectedEvent(event_id, event_name, run_no, tracking_no, quantity, weight, event_date, event_time, created_by, status);
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };


  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
  };

  const columns = [
    {
      title: "Sno",
      data: "Sno",
    },
    {
      title: "Event ID",
      data: "event_id",
    },
    {
      title: "Event Name",
      data: "event_name",
    },
    {
      title: "Run Number",
      data: "run_no",
    },
    {
      title: "Tracking Number",
      data: "tracking_no",
    },
    {
      title: "Quantity",
      data: "quantity",
    },
    {
      title: "Weight",
      data: "weight",
    },
    {
      title: "Event Date",
      data: "event_date",
    },
    {
      title: "Event Time",
      data: "event_time",
    },
    {
      title: "Created By",
      data: "created_by",
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
                      setViewEvent(row);
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
                        row.event_id,
                        row.event_name,
                        row.run_no,
                        row.tracking_no,
                        row.quantity,
                        row.weight,
                        row.event_date,
                        row.event_time,
                        row.created_by,
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
      event_id: "R78009",
      event_name: "test",
      run_no: "JU900",
      tracking_no: "HJK9000",
      quantity: "9",
      weight: "17kg",
      event_date: "9-12-2025",
      event_time: "3:00:10",
      created_by: "Cargo",
      status: "1"
    },
    {
      Sno: 2,
      event_id: "R78009",
      event_name: "test",
      run_no: "JU900",
      tracking_no: "HJK9000",
      quantity: "9",
      weight: "17kg",
      event_date: "9-12-2025",
      event_time: "3:00:10",
      created_by: "Cargo",
      status: "1"
    },
    {
      Sno: 3,
      event_id: "R78009",
      event_name: "test",
      run_no: "JU900",
      tracking_no: "HJK9000",
      quantity: "9",
      weight: "17kg",
      event_date: "9-12-2025",
      event_time: "3:00:10",
      created_by: "Cargo",
      status: "1"
    }
  ]
  return (
    <div className="bg-gray-100 flex flex-col justify-between w-screen min-h-screen px-5 pt-2 md:pt-4">
      <div>
        <Mobile_Sidebar />
        <div className="flex gap-2 mt-2 md:mt-0 ms-5 items-center">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className="text-sm md:text-md text-[#057fc4]">Event</p>
        </div>
        {/* Add Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={openAddModal}
            className="bg-[#057fc4] px-3 py-2 text-white w-20 rounded-2xl"
          >
            Add
          </button>
        </div>

        <div className="datatable-container">

           <div className="flex justify-start items-center ">
            <div className="relative">
              <button
                onClick={() => setShowCustomize(!showCustomize)}
                className="border px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#d5eeff] bg-[#e6f2fa] text-[#057fc4]"
              >
                <BiCustomize className="text-[#046fac]" />Customize
              </button>

              {showCustomize && (
                <div className="absolute right-0 left-0 mt-2 bg-white rounded-xl shadow-lg w-52 p-3 z-50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-medium  text-sm">Customize Columns</p>
                    <button onClick={() => setShowCustomize(false)}>✕</button>
                  </div>

                  {Object.keys(visibleColumns).map((col) => (
                    <label
                      key={col}
                      className="flex items-center gap-2 text-sm py-1 cursor-pointer hover:bg-gray-50 px-2 rounded-md"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns[col]}
                        onChange={() => toggleColumn(col)}
                      />
                      {col}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
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
               ref={(el) => (window.contactTable = el?.dt())}
            />
          </div>
        </div>


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
                <p className="text-2xl md:text-3xl font-medium">Add Event</p>



                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                  <div className="">
                    <label
                      htmlFor="roleName"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Event ID <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      id="event_id"
                      name="event_id"
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
                {/* {error.rolename && <p className="error">{error.rolename}</p>} */}

                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                  <div className="">
                    <label
                      htmlFor="roleName"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Event Name <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      id="event_name"
                      name="event_name"
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
                      Run Number <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="number"
                      id="run_no"
                      name="run_no"
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
                      Tracking Number<span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      id="tracking_no"
                      name="tracking_no"
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
                      Quantity <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      id="quantity"
                      name="quantity"
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
                      Weight <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      id="weight"
                      name="weight"
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
                      Event Date <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      id="event_date"
                      name="event_date"
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
                      Event TIme <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      id="event_time"
                      name="event_time"
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
                      Created By <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      id="created_by"
                      name="created_by"
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
                <p className="text-2xl md:text-3xl font-medium">Edit Parcel</p>

                <div className="mt-10  rounded-lg ">
                  <div className="bg-white  rounded-xl w-full">

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Event ID <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          value={selectedEvent?.event_id}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Event Name<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          value={selectedEvent?.event_name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Run Number<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="number"
                          value={selectedEvent?.run_no}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>


                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Tracking Number <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          value={selectedEvent?.tracking_no}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>


                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          value={selectedEvent?.quantity}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Weight <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          value={selectedEvent?.weight}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Event Date <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          value={selectedEvent?.event_date}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Event Time <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          value={selectedEvent?.event_time}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Created By <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          value={selectedEvent?.created_by}
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
                          value={selectedEvent?.status}
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

        {/* view */}
        {viewModalOpen && viewEvent && (
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
                Event Details
              </h2>

              <div className="space-y-4 text-sm text-gray-700">

                {/* event id */}
                <div className="flex justify-between ">
                  <span className="font-medium">Event ID</span>
                  <span>{viewEvent.event_id}</span>
                </div>

                {/* event name */}
                <div className="flex justify-between ">
                  <span className="font-medium">Event Name</span>
                  <span>{viewEvent.event_name}</span>
                </div>

                {/* run no */}
                <div className="flex justify-between ">
                  <span className="font-medium">Run No</span>
                  <span>{viewEvent.run_no}</span>
                </div>

                {/* tracking no */}
                <div className="flex justify-between ">
                  <span className="font-medium">Tracking No</span>
                  <span>{viewEvent.tracking_no}</span>
                </div>

                {/* quantity */}
                <div className="flex justify-between ">
                  <span className="font-medium">Quantity</span>
                  <span>{viewEvent.quantity}</span>
                </div>

                {/* weight */}
                <div className="flex justify-between ">
                  <span className="font-medium">Weight</span>
                  <span>{viewEvent.weight}</span>
                </div>
                {/* event date */}
                <div className="flex justify-between ">
                  <span className="font-medium">Event Date</span>
                  <span>{viewEvent.event_date}</span>
                </div>
                {/* event time */}
                <div className="flex justify-between ">
                  <span className="font-medium">Event Time</span>
                  <span>{viewEvent.event_time}</span>
                </div>
                {/* created by */}
                <div className="flex justify-between ">
                  <span className="font-medium">Created By</span>
                  <span>{viewEvent.created_by}</span>
                </div>


                {/* Status */}
                <div className="flex justify-between ">
                  <span className="font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                                              ${viewEvent.status === 1 || viewEvent.status === "1"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {viewEvent.status === 1 || viewEvent.status === "1"
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

export default Event_detail;

