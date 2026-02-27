import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";
import { TfiPencilAlt } from "react-icons/tfi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa6";
import { IoIosArrowForward, IoIosCloseCircle } from "react-icons/io";
import { BiCustomize } from "react-icons/bi";
import { FcDownload } from "react-icons/fc";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axiosInstance from "../../api/axiosInstance";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
// import aryu_logo from "../../assets/aryu_logo.svg"; // Unused import commented out

DataTable.use(DT);

const OrderDetail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [senderList] = useState([]);
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
  const [senderOptions, setSenderOptions] = useState([]);
  const [beneficiaryOptions, setBeneficiaryOptions] = useState([]);
  const [beneficiaryFilter, setBeneficiaryFilter] = useState("");
  const [senderFilter, setSenderFilter] = useState("");
  const [createdByFilter, setCreatedByFilter] = useState("");
  const [createdDateFilter, setCreatedDateFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Form states
  const [senderId, setSenderId] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [cargoMode, setCargoMode] = useState("");
  const [packed, setPacked] = useState("");
  const [status, setStatus] = useState("");

  // Edit form states
  const [editSenderId, setEditSenderId] = useState("");
  const [editBeneficiaryId, setEditBeneficiaryId] = useState("");
  const [editCargoMode, setEditCargoMode] = useState("");
  const [editPacked, setEditPacked] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);

  // Get user from localStorage
  const storedDetails = localStorage.getItem("cargouser");
  const parsedDetails = storedDetails ? JSON.parse(storedDetails) : null;
  const userId = parsedDetails ? parsedDetails.id : null;

  // Order Details Table Component
  const OrderDetailsTable = ({ orderId, trackingOptions }) => {
    const selectedOrders = trackingOptions?.filter(
      (order) => order?.customerId?._id === orderId
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
          className={`px-2 py-1 rounded-full text-xs font-medium ${isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
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
                  Customer ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Phone No
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  City
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Country
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {selectedOrders.map((order, index) => (
                <tr key={order._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {order.customerId?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {order.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {order.email || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {order.phone || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {order.city || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                    {order.country || "N/A"}
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

  // Validation functions
  const validateAddForm = () => {
    const errors = {};

    if (!senderId?.trim()) {
      errors.senderId = "Sender ID is required";
    }
    if (!beneficiaryId?.trim()) {
      errors.beneficiaryId = "Beneficiary ID is required";
    }
    if (!cargoMode?.trim()) {
      errors.cargoMode = "Cargo Mode is required";
    }
    if (!packed?.trim()) {
      errors.packed = "Packed is required";
    }
    if (status === "") {
      errors.status = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    const errors = {};

    // if (!editSenderId?.trim()) {
    //   errors.editSenderId = "Sender ID is required";
    // }
    if (!editBeneficiaryId?.trim()) {
      errors.editBeneficiaryId = "Beneficiary ID is required";
    }
    if (!editCargoMode?.trim()) {
      errors.editCargoMode = "Cargo Mode is required";
    }
    if (!editPacked?.trim()) {
      errors.editPacked = "Packed is required";
    }
    if (editStatus === "") {
      errors.editStatus = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch orders
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/orders/all-order`,{
        params: {
          created_by: userId,
        },
      });
      console.log("Order API Response:", response.data);
      if (response.data?.success || response.data?.status) {
        const apiData = response.data.data || [];
        setOrder(apiData);
        setSenderOptions(response.data.customer || []);
      } else {
        setOrder([]);
        setSenderOptions([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrder([]);
      setSenderOptions([]);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch beneficiaries
  const fetchBeneficiary = async () => {
    // if (!senderId) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `api/orders/get-sender-by-beneficiary`,
        { params: { customerId: senderId || editSenderId } }
      );

      let beneficiaryData = [];
      if (response.data?.data) {
        beneficiaryData = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];
      }

      setBeneficiaryOptions(beneficiaryData);
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
      setBeneficiaryOptions([]);
      toast.error("Failed to fetch beneficiaries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (senderId || editSenderId) {
    fetchBeneficiary();
    // }
  }, [senderId, editSenderId]);

  useEffect(() => {
    fetchOrder();
  }, []);

  // Create order
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddForm()) return;

    try {
      const formData = {
        sender_id: senderId,
        beneficiary_id: beneficiaryId,
        cargo_mode: cargoMode,
        packed: packed,
        status: Number(status),
        created_by: userId
      };

      const response = await axiosInstance.post(
        `api/orders/create-orders`,
        formData
      );

      if (response.data?.status || response.data?.success) {
        toast.success("Order created successfully");
        await fetchOrder();
        closeAddModal();
        resetAddForm();
      } else {
        toast.error("Failed to create order");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating order");
    }
  };

  const handleViewOrder = (path)=>{
    navigate(`/form-order`, {
      state: {path},
    }); 
  }
  const handleAddOrder = (path)=>{
    navigate(`/form-order`, {
      state: {path},
    }); 
  }



  // Reset add form
  const resetAddForm = () => {
    setSenderId("");
    setBeneficiaryId("");
    setCargoMode("");
    setPacked("");
    setStatus("");
    setFormErrors({});
  };

  // Open edit modal
  const openEditModal = async (row) => {

    const orderId = row._id || row.id;
    if (!orderId) {
      toast.error("Invalid order ID");
      return;
    }

    try {
      setEditingOrderId(orderId);
      setIsEditModalOpen(true);
      setIsAnimating(true);

      const response = await axiosInstance.get(`api/orders/view-orders/${orderId}`);

      if (response.data?.status === true || response.data?.success === true) {
        const data = response.data.data;

        setEditSenderId(data.sender_id?._id);
        setEditBeneficiaryId(data.beneficiary_id?._id);
        setEditCargoMode(data.cargo_mode || row.cargo_mode);
        setEditPacked(data.packed || row.packed);
        setEditStatus(data.status?.toString() || row.status?.toString());
      }
    } catch (err) {
      toast.error("Unable to fetch order details");
      closeEditModal();
    }
  };

  // Update order
  const handleUpdate = async () => {
    // if (!validateEditForm()) return;

    try {
      const response = await axiosInstance.put(
        `api/orders/edit-orders/${editingOrderId}`,
        {
          sender_id: editSenderId,
          beneficiary_id: editBeneficiaryId,
          cargo_mode: editCargoMode,
          packed: editPacked,
          status: Number(editStatus),
          updated_by: userId
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

  // Delete order
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
      const response = await axiosInstance.delete(`api/orders/delete-orders/${orderId}`);

      if (response.data?.status === true || response.data?.success === true) {
        toast.success("Order deleted successfully");
        fetchOrder();
      } else {
        toast.error(response.data?.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting order");
    }
  };

  // Filter functions
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
      return newState;
    });
  };

  // Modal functions
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setFormErrors({});
    setTimeout(() => {
      setIsAddModalOpen(false);
      resetAddForm();
    }, 250);
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setFormErrors({});
    }, 250);
  };

  // Table columns
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
      data: (row) =>  row.orders?.[0]?.tracking_number || "-",
    },
    {
      title: "Sender ID",
      data: "customerName",
    },
    {
      title: "Beneficiary ID",
      data: (row) =>  row.beneficiaries?.[0]?.name || "-",
    },
    {
      title: "Cargo Mode",
      data: null,
      render: (row) => row.orders?.[0]?.cargo_mode || "-",
    },
   {
  title: "Packed",
  data: null,
  render: (row) => {
    const packed = row.orders?.[0]?.packed;

    const isActive = packed === 1 || packed === "1" || packed === "Yes";

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
        ${isActive ? "Yes" : "No"}
      </div>
    `;
  },
},
  
    // {
    //   title: "Created By",
    //   data: null,
    //   render: (row) => {
    //     if (!row.created_by) return "-";
    //     return typeof row.created_by === "object"
    //       ? row.created_by?.name || row.created_by?._id || "-"
    //       : row.created_by;
    //   },
    // },
    {
      title: "Created Date",
      data: null,
      render: (row) => {
        if (!row.orders?.[0]?.createdAt) return "-";
        return new Date(row.orders?.[0]?.createdAt).toLocaleDateString();
      },
    },
    {
      title: "Receipt",
      data: null,
      className: "text-center",
      createdCell: (row, rowData) => {
        const root = createRoot(row);

        root.render(
          <FcDownload
            size={22}
            className="cursor-pointer mx-auto block"
            onClick={() =>
              navigate("/pdf-download", { state: rowData })
            }
          />
        );
      }
    },
   
    {
      title: "Action",
      data: null,
      render: (data, type, row) => {
        const id = `actions-${row._id || Math.random()}`;
        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }
            container._root.render(
              <div className="action-container flex gap-4 items-center justify-center">
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
                  className="cursor-pointer text-gray-600 hover:text-blue-600"
                  // onClick={() => openEditModal(row)}
                   onClick={() => {
                 handleViewOrder(row);
                  }}
                />
                <MdOutlineDeleteOutline
                  className="text-red-600 text-xl cursor-pointer hover:text-red-800"
                  onClick={() => deleteOrder(row._id)}
                />
              </div>
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
          <p className="text-sm text-gray-500 cursor-pointer" onClick={() => navigate("/dashboard")}>
            Dashboard
          </p>
          <IoIosArrowForward className="w-3 h-3 text-gray-400" />
          <p className="text-sm md:text-md text-[#057fc4]">Order</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl p-5 mb-3 mt-3 shadow-sm">
          <div className="flex flex-wrap items-end gap-3">
            {/* Beneficiary Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 p-1">Beneficiary ID</label>
              <Dropdown
                value={beneficiaryFilter}
                options={beneficiaryOptions}
                onChange={(e) => setBeneficiaryFilter(e.value)}
                optionLabel="name"
                optionValue="id"
                placeholder="Select beneficiary"
                className="w-full border border-gray-300 rounded-lg min-w-[140px]"
              />
            </div>

            {/* Sender Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 p-1">Sender ID</label>
              <Dropdown
                value={senderFilter}
                options={senderOptions}
                onChange={(e) => setSenderFilter(e.value)}
                optionLabel="name"
                optionValue="id"
                placeholder="Select sender ID"
                className="w-full border border-gray-300 rounded-lg min-w-[140px]"
              />
            </div>

            {/* Created By */}
            <div>
              <label className="text-sm font-medium text-gray-600 p-1">Created By</label>
              <Dropdown
                value={createdByFilter}
                options={senderOptions}
                onChange={(e) => setCreatedByFilter(e.value)}
                optionLabel="name"
                optionValue="id"
                placeholder="Select creator"
                className="w-full border border-gray-300 rounded-lg min-w-[140px]"
              />
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
            <div>
              <button
                onClick={resetFilters}
                className="bg-gray-300 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                Reset
              </button>
            </div>

            {/* Customize */}
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
                      {col.replace(/_/g, ' ')}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Add Button */}
            <div className="ml-auto">
              <button
                onClick={() => {
                 handleAddOrder();
                  }}
                className="bg-[#057fc4] hover:bg-[#2d93cf] px-4 py-2 text-white rounded-xl"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white datatable-container">
          <div className="table-scroll-container">
            <DataTable
              data={order}
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
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
            <div className="absolute inset-0" onClick={closeAddModal}></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                onClick={closeAddModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="px-5 lg:px-14 py-2 md:py-10">
                <p className="text-2xl md:text-3xl font-medium">Add Order</p>

                <form onSubmit={handleAddSubmit}>
                  {/* Sender ID */}
                  <div className="mt-2 md:mt-8 flex justify-between items-center">
                    <label className="block text-[15px] md:text-md font-medium">
                      Sender ID <span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[50%]">
                      <Dropdown
                        value={senderId}
                        options={senderOptions}
                        onChange={(e) => {
                          setSenderId(e.value);
                          setFormErrors({ ...formErrors, senderId: "" });
                        }}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Select sender ID"
                        className="w-full border border-gray-300 rounded-lg"
                      />
                      {formErrors.senderId && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.senderId}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Details Table */}
                  {senderId && (
                    <div className="mt-4 ml-auto w-full">
                      <OrderDetailsTable
                        orderId={senderId}
                        trackingOptions={beneficiaryOptions}
                      />
                    </div>
                  )}

                  {/* Beneficiary ID */}
                  <div className="mt-2 md:mt-8 flex justify-between items-center">
                    <label className="block text-[15px] md:text-md font-medium">
                      Beneficiary ID <span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[50%]">
                      <Dropdown
                        value={beneficiaryId}
                        options={beneficiaryOptions}
                        onChange={(e) => {
                          setBeneficiaryId(e.value);
                          setFormErrors({ ...formErrors, beneficiaryId: "" });
                        }}
                        optionLabel="name"
                        optionValue="_id"
                        placeholder="Select Beneficiary ID"
                        className="w-full border border-gray-300 rounded-lg"
                      />
                      {formErrors.beneficiaryId && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.beneficiaryId}</p>
                      )}
                    </div>
                  </div>

                  {/* Cargo Mode */}
                  <div className="mt-2 md:mt-8 flex justify-between items-center">
                    <label className="block text-[15px] md:text-md font-medium">
                      Cargo Mode <span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[50%]">
                      <select
                        value={cargoMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        onChange={(e) => {
                          setCargoMode(e.target.value);
                          setFormErrors({ ...formErrors, cargoMode: "" });
                        }}
                      >
                        <option value="">Select cargo mode</option>
                        <option value="Air">Air</option>
                        <option value="Sea">Sea</option>
                      </select>
                      {formErrors.cargoMode && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.cargoMode}</p>
                      )}
                    </div>
                  </div>

                  {/* Packed */}
                  <div className="mt-2 md:mt-8 flex justify-between items-center">
                    <label className="block text-[15px] md:text-md font-medium">
                      Packed <span className="text-red-500">*</span>
                    </label>
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
                            className="w-4 h-4 text-blue-600"
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
                            className="w-4 h-4 text-blue-600"
                          />
                          No
                        </label>
                      </div>
                      {formErrors.packed && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.packed}</p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-2 md:mt-8 flex justify-between items-center">
                    <label className="block text-[15px] md:text-md font-medium">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="w-[60%] md:w-[50%]">
                      <select
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value);
                          setFormErrors({ ...formErrors, status: "" });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select status</option>
                        <option value="0">Active</option>
                        <option value="1">Inactive</option>
                      </select>
                      {formErrors.status && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.status}</p>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-2 mt-5 md:mt-14">
                    <button
                      type="button"
                      onClick={closeAddModal}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-5 py-1 md:py-2 font-semibold rounded-full"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#067fc4] hover:bg-[#2d93cf] text-white px-4 md:px-5 py-2 font-semibold rounded-full"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50">
            <div className="absolute inset-0" onClick={closeEditModal}></div>
            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[53vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${isAnimating ? "translate-x-0" : "translate-x-full"
                }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                onClick={closeEditModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="px-5 lg:px-14 py-10">
                <p className="text-2xl md:text-3xl font-medium">Edit Order</p>

                <div className="mt-10 rounded-lg">
                  <div className="bg-white rounded-xl w-full">
                    {/* Sender ID */}
                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium">
                        Sender ID <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          value={editSenderId}
                          options={senderOptions}
                          onChange={(e) => {
                            setEditSenderId(e.value);
                            setFormErrors({ ...formErrors, editSenderId: "" });
                          }}
                          optionLabel="name"
                          optionValue="id"
                          placeholder="Select sender ID"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                        {formErrors.editSenderId && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.editSenderId}</p>
                        )}
                      </div>
                    </div>

                    {/* Beneficiary ID */}
                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium">
                        Beneficiary ID <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          value={editBeneficiaryId}
                          options={beneficiaryOptions}
                          onChange={(e) => {
                            setEditBeneficiaryId(e.value);
                            setFormErrors({ ...formErrors, editBeneficiaryId: "" });
                          }}
                          optionLabel="name"
                          optionValue="_id"
                          placeholder="Select Beneficiary ID"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                        {formErrors.editBeneficiaryId && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.editBeneficiaryId}</p>
                        )}
                      </div>
                    </div>

                    {/* Cargo Mode */}
                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium">
                        Cargo Mode <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <select
                          value={editCargoMode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          onChange={(e) => {
                            setEditCargoMode(e.target.value);
                            setFormErrors({ ...formErrors, editCargoMode: "" });
                          }}
                        >
                          <option value="">Select cargo mode</option>
                          <option value="Air">Air</option>
                          <option value="Sea">Sea</option>
                        </select>
                        {formErrors.editCargoMode && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.editCargoMode}</p>
                        )}
                      </div>
                    </div>

                    {/* Packed */}
                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium">
                        Packed <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="editPacked"
                              value="Yes"
                              checked={editPacked === "Yes"}
                              onChange={(e) => {
                                setEditPacked(e.target.value);
                                setFormErrors({ ...formErrors, editPacked: "" });
                              }}
                              className="w-4 h-4 text-blue-600"
                            />
                            Yes
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="editPacked"
                              value="No"
                              checked={editPacked === "No"}
                              onChange={(e) => {
                                setEditPacked(e.target.value);
                                setFormErrors({ ...formErrors, editPacked: "" });
                              }}
                              className="w-4 h-4 text-blue-600"
                            />
                            No
                          </label>
                        </div>
                        {formErrors.editPacked && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.editPacked}</p>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium">
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
                          <p className="text-red-500 text-sm mt-1">{formErrors.editStatus}</p>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-14">
                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-5 py-1 md:py-2 font-semibold rounded-full"
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
        {viewModalOpen && viewOrder && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="relative bg-white w-[95%] md:w-[50%] h-[70%] rounded-xl shadow-lg p-6 overflow-x-auto">
              <button
                onClick={() => setViewModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
              >
                <IoIosCloseCircle size={28} />
              </button>

              <h2 className="text-xl font-semibold mb-6 text-[#057fc4]">Order View</h2>

              <div className="space-y-4 text-sm text-gray-700 w-full gap-4">
               
               <div className="w-full ">
                {/* customer */}
                <div className="space-y-4 mb-2">
                <h2 className="text-xl font-semibold mb-6 ">Customer Details</h2>
                <div className="flex justify-between">
                  <span className="font-medium">Customer Name</span>
                  <span>{viewOrder.customerName || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email</span>
                  <span>{viewOrder.customerEmail || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone Number</span>
                 
                  <span>{viewOrder.customerPhone || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Address</span>
                  <span>{viewOrder.customerAddress || "-"}</span>
                </div>
                <hr></hr>
                </div>
                
                {/* beneficiary */}
                <div className="space-y-4 mb-2">
                <h2 className="text-xl font-semibold mb-6 ">Beneficiary Details</h2>
                <div className="flex justify-between">
                  <span className="font-medium">Beneficiary Name</span>
                  <span>{viewOrder.beneficiaries?.[0]?.name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email</span>
                  <span>{viewOrder.beneficiaries?.[0]?.email || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone Number</span>
                 
                  <span>{viewOrder.beneficiaries?.[0]?.phone || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Address</span>
                  <span>{viewOrder.beneficiaries?.[0].address || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">City</span>
                  <span>{viewOrder.beneficiaries?.[0].city || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Country</span>
                  <span>{viewOrder.beneficiaries?.[0].country || "-"}</span>
                </div>
                <hr></hr>
                </div>
                </div>
                
                {/* parcel */}
                <div className="w-full ">
                <div className=" space-y-4 mb-2">
                <h2 className="text-xl font-semibold mb-6 ">Parcel Details</h2>
                <div className="flex justify-between">
                  <span className="font-medium">Piece Number</span>
                  <span>{viewOrder.parcels?.[0]?.piece_number || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Description </span>
                  <span>{viewOrder.parcels?.[0]?.description || "-"}</span>
                </div>

                 {/* PieceDetails */}
                <div className="pt-3 mt-3">
                  <span className="font-medium block mb-2">Piece Details</span>
                  {viewOrder.parcels?.[0]?.piece_details &&
                  viewOrder.parcels?.[0]?.piece_details.length > 0 ? (
                    viewOrder.parcels?.[0]?.piece_details.map((detail, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-3 rounded-lg mb-2 border border-gray-200"
                      >
                        <div className="font-semibold text-[#057fc4] mb-2">
                          Piece {index + 1}
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="flex justify-start gap-3">
                            <span className="text-gray-600">Weight:</span>
                            <span className="font-medium">{detail.weight}</span>
                          </div>
                          <div className="flex justify-start gap-3">
                            <span className="text-gray-600">Length:</span>
                            <span className="font-medium">{detail.length}</span>
                          </div>
                          <div className="flex justify-start gap-3">
                            <span className="text-gray-600">Width:</span>
                            <span className="font-medium">{detail.width}</span>
                          </div>
                          <div className="flex justify-start gap-3">
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
                <hr></hr>
                </div>

                
                 
                 {/* order details */}
                 <div className="space-y-4 mb-2">
                <h2 className="text-xl font-semibold mb-6 ">Order Details</h2>
                <div className="flex justify-between">
                  <span className="font-medium">Cargo Mode </span>
                  <span>{viewOrder.orders?.[0]?.cargo_mode || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Packed</span>
                  <span>{viewOrder.orders?.[0]?.packed || "-"}</span>
                </div>
                <hr></hr>
                </div>
                </div>
            
                
                
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetail;