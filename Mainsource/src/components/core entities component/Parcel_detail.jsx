import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { TfiPencilAlt } from "react-icons/tfi";
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
import { IoIosCloseCircle } from "react-icons/io";
import { BiCustomize } from "react-icons/bi";
import axiosInstance from "../../api/axiosInstance";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";

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
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Add form states
  const [orderId, setOrderId] = useState("");
  const [pieceNo, setPieceNo] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  // Edit form states
  const [editOrderId, setEditOrderId] = useState("");
  const [editPieceNo, setEditPieceNo] = useState("");
  const [editPieceDetails, setEditPieceDetails] = useState([]);
  const [editWeight, setEditWeight] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [editWidth, setEditWidth] = useState("");
  const [editLength, setEditLength] = useState("");
  const [editingParcelId, setEditingParcelId] = useState(null);
  const [orderOption, setOrderOption] = useState([]);
  const [parcel, setParcel] = useState([]);
  const [totalRecords, setTotalRecords] = useState("");
  const [trackingOption, setTrackingOption] = useState([]);
  const [pieceData, setPieceData] = useState([]);

  const OrderDetailsTable = ({ orderId, trackingOptions }) => {
    // Use filter to get all matching orders
    const selectedOrders =
      trackingOptions?.filter(
        (order) =>
          order._id === orderId ||
          order.order_id === orderId ||
          order.tracking_number === orderId,
      ) || [];

    if (!selectedOrders || selectedOrders.length === 0) return null;

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString();
    };

    const renderStatus = (status) => {
      const isActive = status === "1" || status === 1 || status === true;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    };

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Order Details ({selectedOrders.length} orders)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Tracking Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Sender ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Beneficiary ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Cargo Mode
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Packed
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Created Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {selectedOrders.map((order, index) => (
                <tr
                  key={order._id || index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {order.tracking_number || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {order.sender_id?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {order.beneficiary_id?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {order.cargo_mode || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {order.packed || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {renderStatus(order.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    setDateFilter(getToday());
  }, []);

  const validateAddForm = () => {
    let errors = {};

    if (!orderId) {
      errors.orderId = "Order ID is required";
    }

    

    if (!description) {
      errors.description = "Description is required";
    }
    if (status === "") {
      errors.status = "Status is required";
    }

    // Validate piece details if pieceNo is provided
    if (pieceNo && parseInt(pieceNo) > 0) {
      for (let i = 0; i < parseInt(pieceNo); i++) {
        if (!pieceData[i]?.weight) {
          errors[`weight-${i}`] = "Weight is required";
        }
        if (!pieceData[i]?.length) {
          errors[`length-${i}`] = "Length is required";
        }
        if (!pieceData[i]?.width) {
          errors[`width-${i}`] = "Width is required";
        }
        if (!pieceData[i]?.height) {
          errors[`height-${i}`] = "Height is required";
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    let errors = {};

    if (!editOrderId) {
      errors.editOrderId = "Order ID is required";
    }
    if (!editPieceNo) {
      errors.editPieceNo = "Piece Number is required";
    }
    if (!editDescription) {
      errors.editDescription = "Description is required";
    }
    if (editStatus === "") {
      errors.editStatus = "Status is required";
    }

    // Validate edit piece details
    if (editPieceNo && parseInt(editPieceNo) > 0 && editPieceDetails.length > 0) {
      for (let i = 0; i < parseInt(editPieceNo); i++) {
        if (!editPieceDetails[i]?.weight) {
          errors[`edit-weight-${i}`] = "Weight is required";
        }
        if (!editPieceDetails[i]?.length) {
          errors[`edit-length-${i}`] = "Length is required";
        }
        if (!editPieceDetails[i]?.width) {
          errors[`edit-width-${i}`] = "Width is required";
        }
        if (!editPieceDetails[i]?.height) {
          errors[`edit-height-${i}`] = "Height is required";
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchParcel = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get("api/parcels/view-parcels");

      if (response?.data?.status === true || response?.data?.success === true) {
        const apiDatas = response?.data?.data || [];

        // Extract orders from response
        let OrderList = [];
        if (Array.isArray(response?.data?.orders)) {
          OrderList = response?.data?.orders;
        } else if (
          response?.data?.orders &&
          typeof response?.data?.orders === "object"
        ) {
          OrderList = [response?.data?.orders];
        }

        setOrderOption(OrderList);
        setParcel(apiDatas);
        setTotalRecords(apiDatas.length);
      } else {
        setParcel([]);
        setOrderOption([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Fetch Parcel error:", error);
      setParcel([]);
      setOrderOption([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingDetails = async () => {
    try {
      const response = await axiosInstance.get(
        "api/parcels/view-tracking-detail",
        {
          params: {
            tracking_number: orderId,
          },
        },
      );

      let trackingData = [];
      if (Array.isArray(response?.data)) {
        trackingData = response?.data;
      } else if (response?.data && typeof response?.data === "object") {
        trackingData = [response?.data];
      }

      setTrackingOption(trackingData);
    } catch (error) {
      console.error("Fetch Tracking error:", error);
      setTrackingOption([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchTrackingDetails();
    } else {
      setTrackingOption([]);
    }
  }, [orderId]);

  useEffect(() => {
    fetchParcel();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddForm()) return;

    if (pieceNo < 1) {
        toast.error("Please add at least one piece");
        return;
      }
    
    const pieceDetails = pieceData.map((piece) => ({
      weight: piece.weight,
      length: piece.length,
      width: piece.width,
      height: piece.height,
    }));
    
    try {
      const formData = {
        order_id: orderId,
        piece_number: pieceNo,
        piece_details: pieceDetails,
        description,
        status,
      };

      const response = await axiosInstance.post(
        "api/parcels/create-parcels",
        formData,
      );

      // if (parseInt(pieceNo) < 1) {
      //   toast.error("Please add at least one piece");
      //   return;
      // }

      if (response?.data?.status === true || response?.data?.success === true) {
        toast.success("Parcel created successfully");
        fetchParcel();
        closeAddModal();

        // Reset form fields
        setOrderId("");
        setPieceNo("");
        setWeight("");
        setLength("");
        setWidth("");
        setHeight("");
        setDescription("");
        setStatus("");
        setPieceData([]);
      } else {
        toast.error(response?.data?.message || "Failed to create parcel");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating parcel");
    }
  };

  const handleUpdate = async () => {
    if (!validateEditForm()) return;
    
    const pieceDetails = editPieceDetails.map((piece) => ({
      weight: piece.weight,
      length: piece.length,
      width: piece.width,
      height: piece.height,
    }));
    
    try {
      const payload = {
        order_id: editOrderId,
        piece_number: editPieceNo,
        piece_details: pieceDetails,
        description: editDescription,
        status: editStatus,
      };

      const response = await axiosInstance.put(
        `api/parcels/edit-parcels/${editingParcelId}`,
        payload,
      );

      if (response.data?.success || response.data?.status) {
        toast.success("Parcel updated successfully");
        fetchParcel();
        closeEditModal();
      } else {
        toast.error("Failed to update parcel");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating parcel");
    }
  };

  const deleteParcel = async (parcelId) => {
    if (!parcelId) {
      toast.error("Invalid parcel ID");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this parcel?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axiosInstance.delete(
        `api/parcels/delete-parcels/${parcelId}`,
      );

      if (response.data?.status === true || response.data?.success === true) {
        toast.success("Parcel deleted successfully");
        fetchParcel();
      } else {
        toast.error(response.data?.message || "Failed to delete parcel");
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
      toast.error("Error deleting parcel");
    }
  };

  const resetFilters = () => {
    setStatusFilter("");
    setDateFilter(getToday());
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

  const closeAddModal = () => {
    setIsAnimating(false);
    setErrors({});
    setFormErrors({});
    setOrderId("");
    setPieceNo("");
    setPieceData([]);
    setDescription("");
    setStatus("");
    setTimeout(() => setIsAddModalOpen(false), 250);
  };

  const openEditModal = (row) => {
    if (!row) return;

    setSelectedParcel(row);
    setEditingParcelId(row.id || row._id);
    setEditOrderId(row.order_id?._id || "");
    setEditPieceNo(row.piece_number || "");
    setEditPieceDetails(row.piece_details || []);
    setEditDescription(row.description || "");
    setEditStatus(row.status !== undefined ? row.status.toString() : "");

    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setFormErrors({});
    setEditOrderId("");
    setEditPieceNo("");
    setEditPieceDetails([]);
    setEditDescription("");
    setEditStatus("");
    setTimeout(() => setIsEditModalOpen(false), 250);
  };

  const handlePieceDataChange = (index, field, value) => {
    const newPieceData = [...pieceData];
    if (!newPieceData[index]) {
      newPieceData[index] = { weight: "", length: "", width: "", height: "" };
    }
    newPieceData[index] = { ...newPieceData[index], [field]: value };
    setPieceData(newPieceData);
  };

  const handleEditPieceDetailChange = (index, field, value) => {
    const newEditPieceDetails = [...editPieceDetails];
    if (!newEditPieceDetails[index]) {
      newEditPieceDetails[index] = { weight: "", length: "", width: "", height: "" };
    }
    newEditPieceDetails[index] = { ...newEditPieceDetails[index], [field]: value };
    setEditPieceDetails(newEditPieceDetails);
  };

  const columns = [
    {
      title: "Sno",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
      },
    },
    {
      title: "Order ID",
      data: "tracking_number",
    },
    {
      title: "Piece Number",
      data: "piece_number",
    },
    {
      title: "Description",
      data: "description",
    },
    {
      title: "Status",
      data: "status",
      render: (data) => {
        const isActive = String(data) === "1" || data === 1 || data === true;
        const textColor = isActive ? "green" : "red";
        const bgColor = isActive ? "#e6fffa" : "#ffe5e5";

        return `
          <div style="
            display:inline-block;
            padding:4px 8px;
            color:${textColor};
            background-color:${bgColor};
            border:1px solid ${bgColor};
            border-radius:50px;
            text-align:center;
            width:100px;
            font-size:10px;
            font-weight:700;
          ">
            ${isActive ? "Active" : "Inactive"}
          </div>
        `;
      },
    },
    {
      title: "Action",
      data: null,
      render: (data, type, row) => {
        const id = `actions-${row._id || row.id || Math.random()}`;
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
                    className="cursor-pointer"
                    onClick={() => {
                      openEditModal(row);
                    }}
                  />
                  <MdOutlineDeleteOutline
                    className="text-red-600 text-xl cursor-pointer"
                    onClick={() => {
                      deleteParcel(row.id || row._id);
                    }}
                  />
                </div>
              </div>,
              container,
            );
          }
        }, 0);
        return `<div id="${id}"></div>`;
      },
    },
  ];

  return (
    <div className="bg-gray-100 flex flex-col justify-between w-screen min-h-screen px-5 pt-2 md:pt-4">
      <div>
        <Mobile_Sidebar />
        <div className="flex gap-2 mt-2 md:mt-0 ms-5 items-center">
          <p
            className="text-sm text-gray-500 cursor-pointer"
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
                <label className="text-sm font-medium text-gray-600 p-1">
                  Status
                </label>
                <select
                  className="mt-1 px-3 py-2 border rounded-lg min-w-[140px]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="gap-2">
                <label className="text-sm font-medium text-gray-600 p-1">
                  Date
                </label>
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
              <div className="flex justify-start items-center">
                <div className="relative">
                  <button
                    onClick={() => setShowCustomize(!showCustomize)}
                    className="border px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#d5eeff] bg-[#e6f2fa] text-[#057fc4]"
                  >
                    <BiCustomize className="text-[#046fac]" />
                    Customize
                  </button>

                  {showCustomize && (
                    <div className="absolute right-0 left-0 mt-2 bg-white rounded-xl shadow-lg w-52 p-3 z-50">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-sm">Customize Columns</p>
                        <button onClick={() => setShowCustomize(false)}>
                          ✕
                        </button>
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
                          {col.replace(/_/g, " ")}
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
              data={parcel}
              columns={columns}
              options={{
                paging: true,
                searching: true,
                ordering: true,
                scrollX: true,
                responsive: true,
                autoWidth: false,
              }}
              className="display nowrap bg-white"
              ref={(el) => (window.contactTable = el?.dt())}
            />
          </div>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            {/* Overlay */}
            <div className="absolute inset-0" onClick={closeAddModal}></div>

            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeAddModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="px-5 lg:px-14 py-2 md:py-10">
                <p className="text-2xl md:text-3xl font-medium">Add Parcel</p>

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div className="">
                    <label
                      htmlFor="orderId"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Order ID <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <Dropdown
                      value={orderId}
                      options={orderOption}
                      onChange={(e) => setOrderId(e.value)}
                      optionLabel="tracking_number"
                      optionValue="id"
                      placeholder="Select Order Id"
                      className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                    />
                    {formErrors.orderId && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.orderId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Details Table - Add Modal */}
                {orderId && trackingOption.length > 0 && (
                  <div className="mt-4 ml-auto w-[100%] md:w-[100%]">
                    <OrderDetailsTable
                      orderId={orderId}
                      trackingOptions={trackingOption}
                    />
                  </div>
                )}

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div className="">
                    <label
                      htmlFor="pieceNo"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Piece Number
                    </label>
                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="number"
                      id="pieceNo"
                      value={pieceNo}
                      placeholder="Enter piece number"
                      min="1"
                      onChange={(e) => {
                        const value = e.target.value;
                        setPieceNo(value);
                        // Reset piece data when piece number changes
                        const numPieces = parseInt(value) || 0;
                        const newPieceData = Array(numPieces)
                          .fill(null)
                          .map(() => ({
                            weight: "",
                            length: "",
                            width: "",
                            height: "",
                          }));
                        setPieceData(newPieceData);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {pieceNo && parseInt(pieceNo) > 0 && (
                  <div className="mt-4">
                    {/* Render input fields for each piece */}
                    {Array.from({ length: parseInt(pieceNo) }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="mb-6 p-4 border border-gray-200 rounded-lg"
                        >
                          <h3 className="text-md font-semibold mb-3">
                            Piece {index + 1}
                          </h3>
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <div className="w-full md:w-[22%]">
                              <label
                                htmlFor={`weight-${index}`}
                                className="block text-[15px] md:text-md font-medium mb-2"
                              >
                                Weight <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                id={`weight-${index}`}
                                value={pieceData[index]?.weight || ""}
                                placeholder="Enter Weight"
                                onChange={(e) => handlePieceDataChange(index, 'weight', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {formErrors[`weight-${index}`] && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formErrors[`weight-${index}`]}
                                </p>
                              )}
                            </div>

                            <div className="w-full md:w-[22%]">
                              <label
                                htmlFor={`length-${index}`}
                                className="block text-[15px] md:text-md font-medium mb-2"
                              >
                                Length <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                id={`length-${index}`}
                                value={pieceData[index]?.length || ""}
                                placeholder="Enter Length"
                                onChange={(e) => handlePieceDataChange(index, 'length', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {formErrors[`length-${index}`] && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formErrors[`length-${index}`]}
                                </p>
                              )}
                            </div>

                            <div className="w-full md:w-[22%]">
                              <label
                                htmlFor={`width-${index}`}
                                className="block text-[15px] md:text-md font-medium mb-2"
                              >
                                Width <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                id={`width-${index}`}
                                value={pieceData[index]?.width || ""}
                                placeholder="Enter Width"
                                onChange={(e) => handlePieceDataChange(index, 'width', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {formErrors[`width-${index}`] && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formErrors[`width-${index}`]}
                                </p>
                              )}
                            </div>

                            <div className="w-full md:w-[22%]">
                              <label
                                htmlFor={`height-${index}`}
                                className="block text-[15px] md:text-md font-medium mb-2"
                              >
                                Height <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                id={`height-${index}`}
                                value={pieceData[index]?.height || ""}
                                placeholder="Enter Height"
                                onChange={(e) => handlePieceDataChange(index, 'height', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {formErrors[`height-${index}`] && (
                                <p className="text-red-500 text-sm mt-1">
                                  {formErrors[`height-${index}`]}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div className="">
                    <label
                      htmlFor="description"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <textarea
                      id="description"
                      value={description}
                      placeholder="Enter description"
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setFormErrors({ ...formErrors, description: "" });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
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
                      id="status"
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        setFormErrors({ ...formErrors, status: "" });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                    {formErrors.status && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.status}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-5 md:mt-14">
                  <button
                    onClick={closeAddModal}
                    className="bg-red-100 hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
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
            <div className="absolute inset-0" onClick={closeEditModal}></div>

            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[53vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Toggle Sidebar"
                onClick={closeEditModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="px-5 lg:px-14 py-10">
                <p className="text-2xl md:text-3xl font-medium">Edit Parcel</p>

                <div className="mt-10 rounded-lg">
                  <div className="bg-white rounded-xl w-full">
                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Order ID <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          value={editOrderId}
                          options={orderOption}
                          onChange={(e) => setEditOrderId(e.value)}
                          optionLabel="tracking_number"
                          optionValue="id"
                          placeholder="Select Order Id"
                          className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                        />
                        {formErrors.editOrderId && (
                          <p className="text-red-500 text-sm">
                            {formErrors.editOrderId}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Details Table - Edit Modal */}
                    {editOrderId && trackingOption.length > 0 && (
                      <div className="mt-4 ml-auto w-[60%] md:w-[50%]">
                        <OrderDetailsTable
                          orderId={editOrderId}
                          trackingOptions={trackingOption}
                        />
                      </div>
                    )}

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
                            const value = e.target.value;
                            setEditPieceNo(value);
                            setFormErrors({ ...formErrors, editPieceNo: "" });
                            
                            // Reset edit piece details when number changes
                            const numPieces = parseInt(value) || 0;
                            if (numPieces > 0 && editPieceDetails.length === 0) {
                              const newEditPieceDetails = Array(numPieces)
                                .fill(null)
                                .map(() => ({
                                  weight: "",
                                  length: "",
                                  width: "",
                                  height: "",
                                }));
                              setEditPieceDetails(newEditPieceDetails);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editPieceNo && (
                          <p className="text-red-500 text-sm">
                            {formErrors.editPieceNo}
                          </p>
                        )}
                      </div>
                    </div>

                    {editPieceNo && parseInt(editPieceNo) > 0 && (
                      <div className="mt-4">
                        {/* Render input fields for each piece */}
                        {Array.from({ length: parseInt(editPieceNo) }).map(
                          (_, index) => (
                            <div
                              key={index}
                              className="mb-6 p-4 border border-gray-200 rounded-lg"
                            >
                              <h3 className="text-md font-semibold mb-3">
                                Piece {index + 1}
                              </h3>
                              <div className="flex flex-wrap justify-between items-center gap-2">
                                <div className="w-full md:w-[22%]">
                                  <label
                                    htmlFor={`edit-weight-${index}`}
                                    className="block text-[15px] md:text-md font-medium mb-2"
                                  >
                                    Weight <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    id={`edit-weight-${index}`}
                                    value={editPieceDetails[index]?.weight || ""}
                                    placeholder="Enter Weight"
                                    onChange={(e) => handleEditPieceDetailChange(index, 'weight', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  {formErrors[`edit-weight-${index}`] && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {formErrors[`edit-weight-${index}`]}
                                    </p>
                                  )}
                                </div>

                                <div className="w-full md:w-[22%]">
                                  <label
                                    htmlFor={`edit-length-${index}`}
                                    className="block text-[15px] md:text-md font-medium mb-2"
                                  >
                                    Length <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    id={`edit-length-${index}`}
                                    value={editPieceDetails[index]?.length || ""}
                                    placeholder="Enter Length"
                                    onChange={(e) => handleEditPieceDetailChange(index, 'length', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  {formErrors[`edit-length-${index}`] && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {formErrors[`edit-length-${index}`]}
                                    </p>
                                  )}
                                </div>

                                <div className="w-full md:w-[22%]">
                                  <label
                                    htmlFor={`edit-width-${index}`}
                                    className="block text-[15px] md:text-md font-medium mb-2"
                                  >
                                    Width <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    id={`edit-width-${index}`}
                                    value={editPieceDetails[index]?.width || ""}
                                    placeholder="Enter Width"
                                    onChange={(e) => handleEditPieceDetailChange(index, 'width', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  {formErrors[`edit-width-${index}`] && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {formErrors[`edit-width-${index}`]}
                                    </p>
                                  )}
                                </div>

                                <div className="w-full md:w-[22%]">
                                  <label
                                    htmlFor={`edit-height-${index}`}
                                    className="block text-[15px] md:text-md font-medium mb-2"
                                  >
                                    Height <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    id={`edit-height-${index}`}
                                    value={editPieceDetails[index]?.height || ""}
                                    placeholder="Enter Height"
                                    onChange={(e) => handleEditPieceDetailChange(index, 'height', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  {formErrors[`edit-height-${index}`] && (
                                    <p className="text-red-500 text-sm mt-1">
                                      {formErrors[`edit-height-${index}`]}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <textarea
                          placeholder="Enter description"
                          value={editDescription}
                          onChange={(e) => {
                            setEditDescription(e.target.value);
                            setFormErrors({
                              ...formErrors,
                              editDescription: "",
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        />
                        {formErrors.editDescription && (
                          <p className="text-red-500 text-sm">
                            {formErrors.editDescription}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <select
                          value={editStatus}
                          onChange={(e) => {
                            setEditStatus(e.target.value);
                            setFormErrors({ ...formErrors, editStatus: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select status</option>
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
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
                        className="bg-red-100 hover:bg-red-200 text-sm md:text-base text-red-600 px-5 md:px-5 py-1 md:py-2 font-semibold rounded-full"
                      >
                        Cancel
                      </button>
                      <button
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

        {/* View Modal */}
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
                {/* Order ID */}
                <div className="flex justify-between">
                  <span className="font-medium">Order ID</span>
                  <span>{viewParcel.order_id?.tracking_number}</span>
                </div>

                {/* Piece Number */}
                <div className="flex justify-between">
                  <span className="font-medium">Piece Number</span>
                  <span>{viewParcel.piece_number || viewParcel.piece_no}</span>
                </div>

                {/* PieceDetails */}
                <div className="border-t pt-3 mt-3">
                  <span className="font-medium block mb-2">Piece Details:</span>
                  {viewParcel.piece_details &&
                  viewParcel.piece_details.length > 0 ? (
                    viewParcel.piece_details.map((detail, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-3 rounded-lg mb-2 border border-gray-200"
                      >
                        <div className="font-semibold text-[#057fc4] mb-2">
                          Piece {index + 1}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Weight:</span>
                            <span className="font-medium">{detail.weight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Length:</span>
                            <span className="font-medium">{detail.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Width:</span>
                            <span className="font-medium">{detail.width}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Height:</span>
                            <span className="font-medium">{detail.height}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No piece details available
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="flex justify-between">
                  <span className="font-medium">Description</span>
                  <span>{viewParcel.description}</span>
                </div>

                {/* Status */}
                <div className="flex justify-between">
                  <span className="font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      viewParcel.status === 1 || viewParcel.status === "1"
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