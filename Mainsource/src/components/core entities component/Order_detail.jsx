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
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../api/axiosInstance";

const Order_detail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [totalRecords, setTotalRecords] = useState("");
  const [order, setOrder] = useState([]);
  console.log("order", order)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [senderList, setSenderList] = useState([]);
  const [beneficiaryList, setBeneficiaryList] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    tracking_number: true,
    sender_id: true,
    beneficiary_id: true,
    cargo_mode: true,
    packed: true,
    created_by: true,
    createdAt: true,
    status: true,
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [beneficiaryFilter, setBeneficiaryFilter] = useState("");
  const [senderFilter, setSenderFilter] = useState("");
  const [createdByFilter, setCreatedByFilter] = useState("");
  const [createdDateFilter, setCreatedDateFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  };
  const [isDateTouched, setIsDateTouched] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [senderId, setSenderId] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [cargoMode, setCargoMode] = useState("");
  const [packed, setPacked] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [status, setStatus] = useState("");

  const [editSenderId, setEditSenderId] = useState("");
  const [editBeneficiaryId, setEditBeneficiaryId] = useState("");
  const [editCargoMode, setEditCargoMode] = useState("");
  const [editPacked, setEditPacked] = useState("");
  const [editCreatedBy, setEditCreatedBy] = useState("");
  const [editCreatedDate, setEditCreatedDate] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);


  const storedDetatis = localStorage.getItem("cargouser");
  console.log("storedDetatis.... : ", storedDetatis);
  const parsedDetails = JSON.parse(storedDetatis);
  console.log("....parsedDetails.... : ", parsedDetails);
  const userid = parsedDetails ? parsedDetails.id : null;
  console.log("userid.... : ", userid);


  const validateAddForm = () => {
    let errors = {};

    if (!senderId.trim()) {
      errors.senderId = "Sender ID is required";
    }
    if (!beneficiaryId.trim()) {
      errors.beneficiaryId = "Beneficiary ID is required";
    }
    if (!cargoMode.trim()) {
      errors.cargoMode = "Cargo Mode is required";
    }
    if (!packed.trim()) {
      errors.packed = "Packed is required";
    }
    if (status === "") {
      errors.status = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    let errors = {};

    if (!editSenderId.trim()) {
      errors.editSenderId = "Sender ID is required";
    }
    if (!editBeneficiaryId.trim()) {
      errors.editBeneficiaryId = "Beneficiary ID is required";
    }
    if (!editCargoMode.trim()) {
      errors.editCargoMode = "Cargo Mode is required";
    }
    if (!editPacked.trim()) {
      errors.editPacked = "Packed is required";
    }
    if (editStatus === "") {
      errors.editStatus = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  useEffect(() => {
    fetchOrder();
  }, []);

  // list
  const fetchOrder = async () => {
    console.log("fetch order called");
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `api/orders/view-orders`
      );

      console.log("Order API Response:", response.data);

      if (response.data?.status === true || response.data?.success === true) {
        const orderData = response.data.data || [];
        setOrder(orderData);
        setTotalRecords(orderData.length);
      } else {
        setOrder([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Fetch order error:", error);
      setOrder([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // create
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!validateAddForm()) return;

    try {
      const formdata = {
        sender_id: senderId,
        beneficiary_id: beneficiaryId,
        cargo_mode: cargoMode,
        packed: packed,
        status: Number(status),
        created_by: userid
      };

      const response = await axiosInstance.post(
        `api/orders/create-orders`,
        formdata
      );

      if (response.data?.status || response.data?.success) {
        toast.success("Order created successfully");

        await fetchOrder();   // refresh table
        closeAddModal();

        // reset form
        setSenderId("");
        setBeneficiaryId("");
        setCargoMode("");
        setPacked("");
        setStatus("");

      } else {
        toast.error("Failed to create order");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating order");
    }
  };

  // edit
  const openEditModal = async (row) => {
    const orderId = row._id;

    if (!orderId) {
      toast.error("Invalid order ID");
      return;
    }

    try {
      setEditingOrderId(orderId);
      setIsEditModalOpen(true);
      setIsAnimating(true);

      const response = await axiosInstance.get(
        `api/orders/view-orders/${orderId}`
      );

      if (response.data?.status === true || response.data?.success === true) {
        const data = response.data.data;

        setEditName(data.name);
        setEditEmail(data.email);
        setEditPhone(data.phone);
        setEditAddress(data.address);
        setEditStatus(String(data.status));
      }

    } catch (err) {
      toast.error("Unable to fetch order details");
    }
  };

  // Update
  const handleUpdate = async () => {
    if (!validateEditForm()) return;

    try {
      const response = await axiosInstance.put(
        `api/orders/edit-orders/${editingOrderId}`,
        {
          sender_id: editSenderId,
          beneficiary_id: editBeneficiaryId,
          cargo_mode: editCargoMode,
          packed: editPacked,
          status: Number(editStatus),
          updated_by: userid
        }
      );

      if (response.data?.status || response.data?.success) {
        toast.success("Order updated successfully");
        await fetchOrder();
        closeEditModal();
      } else {
        toast.error("Failed to update order");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating order");
    }
  };

  // delete
  const deleteOrder = async (orderId) => {
    if (!orderId) {
      toast.error("Invalid order ID");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this order?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axiosInstance.delete(
        `api/orders/delete-orders/${orderId}`
      );

      if (response.data?.status === true || response.data?.success === true) {
        toast.success("Order deleted successfully");
        fetchOrder();

      } else {
        toast.error(response.data?.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
      toast.error("Error deleting order");
    }
  };

  const resetFilters = () => {
    setStatusFilter("");
    setBeneficiaryFilter("");
    setSenderFilter("");
    setCreatedByFilter("");
    setCreatedDateFilter("");
    setDateFilter("");
  };

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => {
      const newState = { ...prev, [key]: !prev[key] };

      const columnIndexMap = {
        Sno: 0,
        tracking_number: 1,
        sender_id: 2,
        beneficiary_id: 3,
        cargo_mode: 4,
        packed: 5,
        created_by: 6,
        createdAt: 7,
        status: 8,
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

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
  };

  const columns = [
    {
      title: "Sno",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
      }
    },
    {
      title: "Tracking Number",
      data: null,
      render: (row) => row.tracking_number || "-",
    },
    {
      title: "Sender ID",
      data: null,
      render: (row) =>
        typeof row.sender_id === "object"
          ? row.sender_id?._id || "-"
          : row.sender_id || "-",
    },
    {
      title: "Beneficiary ID",
      data: null,
      render: (row) =>
        typeof row.beneficiary_id === "object"
          ? row.beneficiary_id?._id || "-"
          : row.beneficiary_id || "-",
    },
    {
      title: "Cargo Mode",
      data: null,
      render: (row) => row.cargo_mode || "-",
    },
    {
      title: "Packed",
      data: null,
      render: (row) => row.packed || "-",
    },
    {
      title: "Created By",
      data: null,
      render: (row) =>
        typeof row.created_by === "object"
          ? row.created_by?.name || row.created_by?._id || "-"
          : row.created_by || "-",
    },
    {
      title: "Created Date",
      data: null,
      render: (row) => {
        if (!row.createdAt) return "-";
        const date = new Date(row.createdAt);
        return date.toLocaleDateString();
      },
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
                      setViewOrder(row);
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
                      deleteOrder(row._id);
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
  console.log("columns", columns)


  const data = order.filter((item) => {
    const itemDate = item.createdAt
      ? new Date(item.createdAt).toISOString().split("T")[0]
      : "";

    return (
      (!statusFilter || String(item.status) === statusFilter) &&
      (!dateFilter || itemDate === dateFilter)
    );
  });
  console.log("order:", order);
  console.log("dateFilter:", dateFilter);
  console.log("statusFilter:", statusFilter);
  console.log("data", data)

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

          <p className="text-sm md:text-md text-[#057fc4]">Order</p>
        </div>

        {/* filter */}
        <div className="bg-white rounded-xl p-5 mb-3 mt-3 shadow-sm">

          <div className="flex items-end">

            {/* LEFT SIDE FILTERS */}
            <div className="flex flex-wrap gap-3 flex-1">

              {/* Beneficiary Filter */}
              <div>
                <label className="text-sm font-medium text-gray-600 p-1">Beneficiary ID</label>
                <select
                  className="mt-1 px-3 py-2 border rounded-lg min-w-[140px]"
                  value={beneficiaryFilter}
                  onChange={(e) => setBeneficiaryFilter(e.target.value)}
                >
                  <option value="">Select Beneficiary ID</option>
                  <option value="0">96F5741425</option>
                  <option value="1">96F5741424</option>
                </select>
              </div>

              {/* Sender Filter */}
              <div>
                <label className="text-sm font-medium text-gray-600 p-1">Sender ID</label>
                <select
                  className="mt-1 px-3 py-2 border rounded-lg min-w-[140px]"
                  value={senderFilter}
                  onChange={(e) => setSenderFilter(e.target.value)}
                >
                  <option value="">Select Sender ID</option>
                  <option value="0">22_cargo</option>
                  <option value="1">22_cargo</option>
                </select>
              </div>

              {/* Created By */}
              <div>
                <label className="text-sm font-medium text-gray-600 p-1">Created By</label>
                <select
                  className="mt-1 px-3 py-2 border rounded-lg min-w-[140px]"
                  value={createdByFilter}
                  onChange={(e) => setCreatedByFilter(e.target.value)}
                >
                  <option value="">Select created by</option>
                  <option value="Admin">Admin</option>
                  <option value="Agent">Agent</option>
                </select>
              </div>

              {/* Created Date */}
              <div>
                <label className="text-sm font-medium text-gray-600 p-1">Created Date</label>
                <input
                  className="mt-1 px-3 py-2 border rounded-lg min-w-[140px]"
                  type="date"
                  value={createdDateFilter}
                  onChange={(e) => setCreatedDateFilter(e.target.value)}
                />
              </div>

              {/* Status */}
              <div>
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

              {/* Date */}
              <div>
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

              {/* Customize */}
              <div className="flex items-end">
                <div className="relative">
                  <button
                    onClick={() => setShowCustomize(!showCustomize)}
                    className="border px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#d5eeff] bg-[#e6f2fa] text-[#057fc4]"
                  >
                    <BiCustomize className="text-[#046fac]" />
                    Customize
                  </button>

                  {showCustomize && (
                    <div className="absolute mt-2 bg-white rounded-xl shadow-lg w-52 p-3 z-50">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-sm">Customize Columns</p>
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

            {/* RIGHT SIDE ADD BUTTON */}
            <div className="ml-4">
              <button
                onClick={openAddModal}
                className="bg-[#057fc4] hover:bg-[#2d93cf] px-4 py-2 text-white rounded-xl"
              >
                Add
              </button>
            </div>

          </div>
        </div>


        <div className=" bg-white datatable-container">
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
              className="display nowrap  bg-white"
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
                <p className="text-2xl md:text-3xl font-medium">Add Order</p>

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div>
                    <label
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Sender ID <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <div className="w-[60%] md:w-[50%]">
                    <select
                      value={senderId}
                      onChange={(e) => {
                        setSenderId(e.target.value);
                        setFormErrors({ ...formErrors, senderId: "" });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
      focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select Sender ID</option>
                      <option value="S001">S001</option>
                      <option value="S002">S002</option>
                      <option value="S003">S003</option>
                    </select>

                    {formErrors.senderId && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.senderId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div>
                    <label
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Beneficiary ID <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <div className="w-[60%] md:w-[50%]">
                    <select
                      value={beneficiaryId}
                      onChange={(e) => {
                        setBeneficiaryId(e.target.value);
                        setFormErrors({ ...formErrors, beneficiaryId: "" });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
      focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select Beneficiary ID</option>
                      <option value="101">101</option>
                      <option value="102">102</option>
                      <option value="103">103</option>
                    </select>

                    {formErrors.beneficiaryId && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.beneficiaryId}
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
                      Cargo Mode <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">

                    <select
                      type="text"
                      value={cargoMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      onChange={(e) => {
                        setCargoMode(e.target.value);
                        setFormErrors({ ...formErrors, cargoMode: "" });
                      }}
                    >
                      <option>Select cargo mode</option>
                      <option value="Air">Air</option>
                      <option value="Sea">Sea</option>
                    </select>
                    {formErrors.cargoMode && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.cargoMode}
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
                      Packed <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <div className="flex items-center gap-6">

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="packed"
                          value="Yes"
                          checked={packed === "Yes"}
                          onChange={(e) => {
                            setPacked(e.target.value);
                            setFormErrors({ ...formErrors, packed: "" });
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        Yes
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="packed"
                          value="No"
                          checked={packed === "No"}
                          onChange={(e) => {
                            setPacked(e.target.value);
                            setFormErrors({ ...formErrors, packed: "" });
                          }}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        No
                      </label>

                    </div>
                    {formErrors.packed && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.packed}
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
                <p className="text-2xl md:text-3xl font-medium">Edit Order</p>

                <div className="mt-10  rounded-lg ">
                  <div className="bg-white  rounded-xl w-full">

                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <div>
                        <label
                          className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                        >
                          Sender ID <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-[60%] md:w-[50%]">
                        <select
                          value={editSenderId}
                          onChange={(e) => {
                            setEditSenderId(e.target.value);
                            setFormErrors({ ...formErrors, editSenderId: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg 
      focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="">Select Sender ID</option>
                          <option value="S001">S001</option>
                          <option value="S002">S002</option>
                          <option value="S003">S003</option>
                        </select>

                        {formErrors.editSenderId && (
                          <p className="text-red-500 text-sm mb-4 mt-1">
                            {formErrors.editSenderId}
                          </p>
                        )}
                      </div>
                    </div>


                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <div>
                        <label
                          className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                        >
                          Beneficiary ID <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-[60%] md:w-[50%]">
                        <select
                          value={editBeneficiaryId}
                          onChange={(e) => {
                            setEditBeneficiaryId(e.target.value);
                            setFormErrors({ ...formErrors, editBeneficiaryId: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg 
      focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="">Select Beneficiary ID</option>
                          <option value="101">101</option>
                          <option value="102">102</option>
                          <option value="103">103</option>
                        </select>

                        {formErrors.editBeneficiaryId && (
                          <p className="text-red-500 text-sm mb-4 mt-1">
                            {formErrors.editBeneficiaryId}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Cargo Mode <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <select
                          value={editCargoMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          onChange={(e) => {
                            setEditCargoMode(e.target.value);
                            setFormErrors({ ...formErrors, editCargoMode: "" });
                          }}
                        >
                          <option >Select cargo mode</option>
                          <option value="Admin">Air</option>
                          <option value="Manager">Sea</option>
                        </select>
                        {formErrors.editCargoMode && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editCargoMode}
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
                          Packed <span className="text-red-500">*</span>
                        </label>

                      </div>
                      <div className="w-[60%] md:w-[50%]">
                        <div className="flex items-center gap-6">

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="packed"
                              value="Yes"
                              checked={editPacked === "Yes"}
                              onChange={(e) => {
                                setEditPacked(e.target.value);
                                setFormErrors({ ...formErrors, editPacked: "" });
                              }}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            Yes
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="packed"
                              value="No"
                              checked={editPacked === "No"}
                              onChange={(e) => {
                                setEditPacked(e.target.value);
                                setFormErrors({ ...formErrors, editPacked: "" });
                              }}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            No
                          </label>

                        </div>
                        {formErrors.editPacked && (
                          <p className="text-red-500 text-sm mb-4 mt-1">
                            {formErrors.editPacked}
                          </p>
                        )}
                      </div>
                    </div>


                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">Status <span className="text-red-500">*</span></label>
                      <div className="w-[60%] md:w-[50%]">
                        <select
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
        {viewModalOpen && viewOrder && (
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
                Order Details
              </h2>

              <div className="space-y-4 text-sm text-gray-700">

                {/* First Name */}
                <div className="flex justify-between ">
                  <span className="font-medium">Tracking No</span>
                  <span>{viewOrder.tracking_number}</span>
                </div>

                {/* Last Name */}
                <div className="flex justify-between ">
                  <span className="font-medium">Sender ID</span>
                  <span>{viewOrder.sender_id}</span>
                </div>

                {/* email */}
                <div className="flex justify-between ">
                  <span className="font-medium">Beneficiary ID</span>
                  <span>{viewOrder.beneficiary_id}</span>
                </div>

                {/* phone number */}
                <div className="flex justify-between ">
                  <span className="font-medium">Cargo Mode</span>
                  <span>{viewOrder.cargo_mode}</span>
                </div>

                {/* role */}
                <div className="flex justify-between ">
                  <span className="font-medium">Packed</span>
                  <span>{viewOrder.packed}</span>
                </div>
                {/* role */}
                <div className="flex justify-between ">
                  <span className="font-medium">Created By</span>
                  <span>{viewOrder.created_by}</span>
                </div>
                {/* role */}
                <div className="flex justify-between ">
                  <span className="font-medium">Created Date</span>
                  <span>{new Date(viewOrder.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Status */}
                <div className="flex justify-between ">
                  <span className="font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                                              ${viewOrder.status === 1 || viewOrder.status === "1"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {viewOrder.status === 1 || viewOrder.status === "1"
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

export default Order_detail;

