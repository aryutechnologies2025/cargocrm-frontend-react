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

const Parcel_detail = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewParcel, setViewParcel] = useState(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    Sno: true,
    parcel_id: true,
    order_id: true,
    piece_no: true,
    weight: true,
    dimensions: true,
    description: true,
    status: true,
  });
  const [statusFilter, setStatusFilter] = useState([]);
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  };
  const [dateFilter, setDateFilter] = useState(getToday());
  const [formErrors, setFormErrors] = useState({});
  const [orderId, setOrderId] = useState("");
  const [pieceNo, setPieceNo] = useState("");
  const [weight, setWeight] = useState("");
  const [dimension, setDimension] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const [editOrderId, setEditOrderId] = useState("");
  const [editPieceNo, setEditPieceNo] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editDimension, setEditDimension] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const validateAddForm = () => {
    let errors = {};

    if (!orderId.trim()) {
      errors.orderId = "Order ID is required";
    }
    if (!pieceNo.trim()) {
      errors.pieceNo = "Piece Number is required";
    }
    if (!weight.trim()) {
      errors.weight = "Weight is required";
    }
    if (!dimension.trim()) {
      errors.dimension = "Dimension is required";
    }
    if (description.trim() === "") {
      errors.description = "Description is required";
    }
    if (status === "") {
      errors.status = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    let errors = {};

    if (!editOrderId.trim()) {
      errors.editOrderId = "Order ID is required";
    }
    if (!editPieceNo.trim()) {
      errors.editPieceNo = "Piece Number is required";
    }
    if (!editWeight.trim()) {
      errors.editWeight = "Weight is required";
    }
    if (!editDimension.trim()) {
      errors.editDimension = "Dimension is required";
    }
    if (editDescription.trim() === "") {
      errors.editDescription = "Description is required";
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
      order_id: orderId,
      piece_no: pieceNo,
      weight: weight,
      dimensions: dimension,
      description: description,
      status: status,
    };

    console.log("Add Payload:", payload);

    //  Call your API here

    closeAddModal();
  };

  const handleUpdate = () => {
    if (!validateEditForm()) return;

    const payload = {
      id: selectedParcel._id,
      order_id: editOrderId,
      piece_no: editPieceNo,
      weight: editWeight,
      dimensions: editDimension,
      description: editDescription,
      status: editStatus,
    };

    console.log("Update Payload:", payload);

    //  Call update API here

    closeEditModal();
  };

  const resetFilters = () => {
    setStatusFilter("");
    setDateFilter("");
  };

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => {
      const newState = { ...prev, [key]: !prev[key] };

      const columnIndexMap = {
        Sno: 0,
        parcel_id: 1,
        order_id: 2,
        piece_no: 3,
        weight: 4,
        dimensions: 5,
        description: 6,
        status: 7,
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
    setSelectedParcel(row);
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };
  //   const openEditModal = (row) => {
  //   if (!row) return;

  //   setSelectedParcel(row);
  //   setEditOrderId(row.orderId || "");
  //   setEditPieceNo(row.pieceNo || "");
  //   setEditWeight(row.weight || "");
  //   setEditDimension(row.dimension || "");
  //   setEditDescription(row.description || "");
  //   setEditStatus(row.status !== undefined ? row.status.toString() : "");

  //   setIsEditModalOpen(true);
  //   setTimeout(() => setIsAnimating(true), 10);
  // };

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
      title: "Parcel ID",
      data: "parcel_id",
    },
    {
      title: "Order ID",
      data: "order_id",
    },
    {
      title: "Piece Number",
      data: "piece_no",
    },
    {
      title: "Weight",
      data: "weight",
    },
    {
      title: "Dimensions",
      data: "dimensions",
    },
    {
      title: "Description",
      data: "description",
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
                      setViewParcel(row);
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
                        row.parcel_id,
                        row.order_id,
                        row.piece_no,
                        row.weight,
                        row.dimensions,
                        row.description,
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

  const rawData = [
    { Sno: 1, parcel_id: "c77884", order_id: "22_cargo", piece_no: "23", weight: "10kg", dimensions: "5", description: "Cargo", status: 0, date: "2026-02-01" },
    { Sno: 2, parcel_id: "c77884", order_id: "22_cargo", piece_no: "23", weight: "10kg", dimensions: "5", description: "Cargo", status: 1, date: "2026-02-02" },
    { Sno: 3, parcel_id: "c77884", order_id: "22_cargo", piece_no: "23", weight: "10kg", dimensions: "5", description: "Cargo", status: 1, date: "2026-02-03" },
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

          <p className="text-sm md:text-md text-[#057fc4]">Parcel</p>
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
                <p className="text-2xl md:text-3xl font-medium">Add Parcel</p>



                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                  <div className="">
                    <label
                      htmlFor="roleName"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Order ID <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      value={orderId}
                      placeholder="Enter order ID"
                      onChange={(e) => {
                        setOrderId(e.target.value);
                        setFormErrors({ ...formErrors, orderId: ""}); // Validate role name dynamically
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.orderId && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.orderId}
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
                      Piece Number <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="number"
                      value={pieceNo}
                      placeholder="Enter piece number"
                      onChange={(e) => {
                        setPieceNo(e.target.value);
                        setFormErrors({ ...formErrors, pieceNo: ""}); // Validate role name dynamically
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.pieceNo && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.pieceNo}
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
                      Weight <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="number"
                      value={weight}
                      placeholder="Enter Weight"
                      onChange={(e) => {
                        setWeight(e.target.value);
                        setFormErrors({ ...formErrors, weight: ""}); // Validate role name dynamically
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.weight && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.weight}
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
                      Dimensions (L × W × H)<span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      value={dimension}
                      placeholder="Enter dimensions"
                      onChange={(e) => {
                        setDimension(e.target.value);
                        setFormErrors({ ...formErrors, dimension: ""}); // Validate role name dynamically
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.weight && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.weight}
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
                      Description <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <textarea
                      type="text"
                      value={description}
                      placeholder="Enter description"
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setFormErrors({ ...formErrors, description: ""}); // Validate role name dynamically
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.description}
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
                        setFormErrors({ ...formErrors, status: ""}); // Validate status dynamically
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
                <p className="text-2xl md:text-3xl font-medium">Edit Parcel</p>

                <div className="mt-10  rounded-lg ">
                  <div className="bg-white  rounded-xl w-full">


                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Order ID <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          placeholder="Enter order ID"
                          value={editOrderId}
                           onChange={(e) => {
                            setEditOrderId(e.target.value);
                            setFormErrors({ ...formErrors, editOrderId: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editOrderId && (
                          <p className="text-red-500 text-sm">{formErrors.editOrderId}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Piece Number<span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="number"
                          placeholder="Enter piece number"
                          value={editPieceNo}
                           onChange={(e) => {
                            setEditPieceNo(e.target.value);
                            setFormErrors({ ...formErrors, editPieceNo: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editPieceNo && (
                          <p className="text-red-500 text-sm">{formErrors.editPieceNo}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Weight <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          placeholder="Enter weight"
                          value={editWeight}
                          onChange={(e) => {
                            setEditWeight(e.target.value);
                            setFormErrors({ ...formErrors, editWeight: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editWeight && (
                          <p className="text-red-500 text-sm">{formErrors.editWeight}</p>
                        )}
                      </div>
                    </div>


                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Dimensions (L × W × H) <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          placeholder="Enter dimensions"
                          value={editDimension}
                          onChange={(e) => {
                            setEditDimension(e.target.value);
                            setFormErrors({ ...formErrors, editDimension: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editDimension && (
                          <p className="text-red-500 text-sm">{formErrors.editDimension}</p>
                        )}
                      </div>
                    </div>


                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <textarea
                          type="text"
                          placeholder="Enter description"
                          value={description}
                          onChange={(e) => {
                            setEditDescription(e.target.value);
                            setFormErrors({ ...formErrors, editDescription: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editDescription && (
                          <p className="text-red-500 text-sm">{formErrors.editDescription}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">Status <span className="text-red-500">*</span></label>
                      <div className="w-[60%] md:w-[50%]">
                        <select
                          name="status"
                          id="status"
                          value={status}
                          onChange={(e) => {
                            setStatus(e.target.value);
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
        {viewModalOpen && viewParcel && (
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
                Parcel Details
              </h2>

              <div className="space-y-4 text-sm text-gray-700">

                {/* parcel id */}
                <div className="flex justify-between ">
                  <span className="font-medium">Parcel ID</span>
                  <span>{viewParcel.parcel_id}</span>
                </div>

                {/* order id */}
                <div className="flex justify-between ">
                  <span className="font-medium">Order ID</span>
                  <span>{viewParcel.order_id}</span>
                </div>

                {/* phone no */}
                <div className="flex justify-between ">
                  <span className="font-medium">Piece no</span>
                  <span>{viewParcel.piece_no}</span>
                </div>

                {/* weight */}
                <div className="flex justify-between ">
                  <span className="font-medium">Weight</span>
                  <span>{viewParcel.weight}</span>
                </div>

                {/* dimensiona */}
                <div className="flex justify-between ">
                  <span className="font-medium">Dimensions</span>
                  <span>{viewParcel.dimensions}</span>
                </div>
                {/* description */}
                <div className="flex justify-between ">
                  <span className="font-medium">Description</span>
                  <span>{viewParcel.description}</span>
                </div>


                {/* Status */}
                <div className="flex justify-between ">
                  <span className="font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                                              ${viewParcel.status === 1 || viewParcel.status === "1"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {viewParcel.status === 1 || viewParcel.status === "1"
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

export default Parcel_detail;

