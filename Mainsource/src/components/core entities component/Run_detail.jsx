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

const Run_detail = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedRun, setSelectedRun] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRun, setViewRun] = useState(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    Sno: true,
    run_id: true,
    run_no: true,
    mode: true,
    created_date: true,
    status: true,
  });
  const [statusFilter, setStatusFilter] = useState([]);
  const [cargoModeFilter, setCargoModeFilter] = useState([]);
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  };
  const [dateFilter, setDateFilter] = useState(getToday());
  const [formErrors, setFormErrors] = useState({});
  const [runNo, setRunNo] = useState("");
  const [mode, setMode] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [status, setStatus] = useState("");

  const [editRunNo, setEditRunNo] = useState("");
  const [editMode, setEditMode] = useState("");
  const [editCreatedDate, setEditCreatedDate] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const validateAddForm = () => {
    let errors = {};

    if (!runNo.trim()) {
      errors.runNo = "Run Number is required";
    }
    if (!mode.trim()) {
      errors.mode = "Mode is required";
    }
    if (!createdDate.trim()) {
      errors.createdDate = "Created Date is required";
    }
    if (status === "") {
      errors.status = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    let errors = {};

    if (!editRunNo.trim()) {
      errors.editRunNo = "Run number is required";
    }
    if (!editMode.trim()) {
      errors.editMode = "Mode is required";
    }
    if (!editCreatedDate.trim()) {
      errors.editCreatedDate = "Created Date is required";
    }
    if (editStatus === "") {
      errors.editStatus = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSubmit = () => {
    if (!validateAddForm()) return;

    const payload = {
      run_no: runNo,
      mode: mode,
      created_date: createdDate,
      status: status,
    };

    console.log("Add Payload:", payload);

    //  Call your API here

    closeAddModal();
  };

  const handleUpdate = () => {
    if (!validateEditForm()) return;

    const payload = {
      id: selectedRun._id,
      run_no: editRunNo,
      mode: editMode,
      created_date: editCreatedDate,
      status: editStatus,
    };

    console.log("Update Payload:", payload);

    //  Call update API here

    closeEditModal();
  };

  const resetFilters = () => {
    setStatusFilter("");
    setCargoModeFilter("");
    setDateFilter(""); // reset to today
    // setDateFilter(getToday());
  };

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => {
      const newState = { ...prev, [key]: !prev[key] };

      const columnIndexMap = {
        Sno: 0,
        run_id: 1,
        run_no: 2,
        mode: 3,
        created_date: 4,
        status: 5,
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

  const openEditModal = (row) => {
    setSelectedRun(row);
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
      title: "Run ID",
      data: "run_id",
    },
    {
      title: "Run Number",
      data: "run_no",
    },
    {
      title: "Mode",
      data: "mode",
    },
    {
      title: "Created Date",
      data: "created_date",
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
                      setViewRun(row);
                      setViewModalOpen(true);

                    }}
                    className="p-1 bg-blue-50 text-[#057fc4] rounded-[10px] hover:bg-[#DFEBFF]"
                  >
                    <FaEye />
                  </button>
                  <TfiPencilAlt
                    className="cursor-pointer "
                    onClick={() => {
                      openEditModal(row);
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

  const rawData = [
    { Sno: 1, run_id: "c77884", run_no: "96F5741425", mode: "Air", created_date: "5-4-2025", status: 0, date: "2026-02-01" },
    { Sno: 2, run_id: "c77884", run_no: "96F5741425", mode: "Air", created_date: "5-4-2025", status: 1, date: "2026-02-02" },
    { Sno: 3, run_id: "c77884", run_no: "96F5741425", mode: "Air", created_date: "5-4-2025", status: 1, date: "2026-02-03" },
  ];

  const data = rawData.filter((item) => {
    return (
      (statusFilter ? String(item.status) === statusFilter : true) &&
      (dateFilter ? item.date === dateFilter : true)
    );
  });
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

          <p className="text-sm md:text-md text-[#057fc4]">Run</p>
        </div>
        {/* Filters */}
        <div className="bg-white rounded-xl p-5 mb-3 mt-3 shadow-sm">
          <div className="flex flex-wrap items-end gap-3 justify-between">

            {/* Left Side Filters */}
            <div className="flex flex-wrap gap-3">

              {/* Status Filter */}
              <div className="gap-2">
                <label className="text-sm font-medium text-gray-600 p-1">Status</label>
                <select
                  className="mt-1 px-3 py-2 border rounded-lg min-w-[140px]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="0">Active</option>
                  <option value="1">Inactive</option>
                </select>
              </div>

              {/* cargo mode Filter */}
              <div className="gap-2">
                <label className="text-sm font-medium text-gray-600 p-1">Mode</label>
                <select
                  className="mt-1 px-3 py-2 border rounded-lg min-w-[140px]"
                  value={cargoModeFilter}
                  onChange={(e) => setCargoModeFilter(e.target.value)}
                >
                  <option value="">Select cargo mode</option>
                  <option value="0">Air</option>
                  <option value="1">Sea</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="gap-2">
                <label className="text-sm font-medium text-gray-600 p-1">Date</label>
                <input
                  type="date"
                  className="mt-1 px-3 py-2 border rounded-lg min-w-[160px]"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />

              </div>

              {/* Reset */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="bg-gray-300 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Reset
                </button>
              </div>

              {/* customize */}
              <div className="flex justify-start items-center  ">
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

            </div>

            {/* Right Side Add Button */}
            <div>
              <button
                onClick={openAddModal}
                className="bg-[#057fc4] hover:bg-[#2d93cf] px-4 py-2 text-white rounded-xl"
              >
                Add
              </button>
            </div>

          </div>
        </div>

        <div className="bg-white datatable-container">
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
                <p className="text-2xl md:text-3xl font-medium">Add Run</p>


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
                      value={runNo}
                      onChange={(e) => {
                        setRunNo(e.target.value);
                        setFormErrors({ ...formErrors, runNo: "" });
                      }}
                      placeholder="Enter run number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.runNo && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.runNo}
                      </p>
                    )}
                  </div>
                </div>


                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                  <div className="">
                    <label
                      htmlFor="roleName"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Mode<span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <select
                      value={mode}
                      onChange={(e) => {
                        setMode(e.target.value);
                        setFormErrors({ ...formErrors, mode: "" }); // Validate status dynamically
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select cargo mode</option>
                      <option value="1">Air</option>
                      <option value="0">Sea</option>
                    </select>
                    {formErrors.mode && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.mode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                  <div className="">
                    <label
                      htmlFor="roleName"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Created Date <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="date"
                      value={createdDate}
                      onChange={(e) => {
                        setCreatedDate(e.target.value);
                        setFormErrors({ ...formErrors, createdDate: "" }); // Validate role name dynamically
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.createdDate && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.createdDate}
                      </p>
                    )}
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
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        setFormErrors({ ...formErrors, status: "" });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a status</option>
                      <option value="1">Active</option>
                      <option value="0">InActive</option>
                    </select>
                    {formErrors.status && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.status}
                      </p>
                    )}
                  </div>
                </div>


                <div className="flex  justify-end gap-2 mt-5 md:mt-14">
                  <button
                    onClick={closeAddModal}
                    className="bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-[#067fc4] hover:bg-[#2d93cf] text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    onClick={handleAddSubmit}
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
                <p className="text-2xl md:text-3xl font-medium">Edit Run</p>

                <div className="mt-10  rounded-lg ">
                  <div className="bg-white  rounded-xl w-full">

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Run Number <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="number"
                          placeholder="Enter number"
                          value={editRunNo}
                          onChange={(e) => {
                            setEditRunNo(e.target.value);
                            setFormErrors({ ...formErrors, editRunNo: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editRunNo && (
                          <p className="text-red-500 text-sm">{formErrors.editRunNo}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Mode<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <select
                      value={editMode}
                      onChange={(e) => {
                        setEditMode(e.target.value);
                        setFormErrors({ ...formErrors, editMode: "" }); // Validate status dynamically
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select cargo mode</option>
                      <option value="1">Air</option>
                      <option value="0">Sea</option>
                    </select>
                        {formErrors.editMode && (
                          <p className="text-red-500 text-sm">{formErrors.editMode}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Created Date <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="date"
                          placeholder="Enter created date"
                          value={editCreatedDate}
                          onChange={(e) => {
                            setEditCreatedDate(e.target.value);
                            setFormErrors({ ...formErrors, editCreatedDate: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editCreatedDate && (
                          <p className="text-red-500 text-sm">{formErrors.editCreatedDate}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">Status <span className="text-red-500">*</span></label>
                      <div className="w-[60%] md:w-[50%]">
                        <select
                          name="status"
                          id="status"
                          value={editStatus}
                          onChange={(e) => {
                            setEditStatus(e.target.value);
                            setFormErrors({ ...formErrors, editStatus: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option>Select status</option>
                          <option value="1">Active</option>
                          <option value="0">InActive</option>
                        </select>
                        {formErrors.editStatus && (
                          <p className="text-red-500 text-sm mb-4">
                            {formErrors.editStatus}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-14">
                      <button
                        onClick={closeEditModal}
                        className=" bg-red-100  hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                      >
                        Cancel
                      </button>
                      <button
                        //  onClick={() => handleSave(roleDetails.id)}
                        onClick={handleUpdate}
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
        {viewModalOpen && viewRun && (
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
                User Details
              </h2>

              <div className="space-y-4 text-sm text-gray-700">

                {/* run id */}
                <div className="flex justify-between ">
                  <span className="font-medium">Run ID</span>
                  <span>{viewRun.run_id}</span>
                </div>

                {/* run no */}
                <div className="flex justify-between ">
                  <span className="font-medium">Run No</span>
                  <span>{viewRun.run_no}</span>
                </div>

                {/* mode */}
                <div className="flex justify-between ">
                  <span className="font-medium">Mode</span>
                  <span>{viewRun.mode}</span>
                </div>

                {/* created date */}
                <div className="flex justify-between ">
                  <span className="font-medium">Created Date</span>
                  <span>{viewRun.created_date}</span>
                </div>


                {/* Status */}
                <div className="flex justify-between ">
                  <span className="font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                                              ${viewRun.status === 1 || viewRun.status === "1"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {viewRun.status === 1 || viewRun.status === "1"
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

export default Run_detail;

