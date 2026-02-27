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
import { IoIosCloseCircle } from "react-icons/io";
import { BiCustomize } from "react-icons/bi";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { Dropdown } from "primereact/dropdown";
import Swal from "sweetalert2";
DataTable.use(DT);
import { MultiSelect } from "primereact/multiselect";

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
  const [statusFilter, setStatusFilter] = useState("");
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const [dateFilter, setDateFilter] = useState(getToday());
  const [formErrors, setFormErrors] = useState({});
  
  // Add form states
  const [eventId, setEventId] = useState("");
  const [eventMark, setEventMark] = useState("");
  const [runId, setRunId] = useState("");
  const [trackingId, setTrackingId] = useState([]);
  const [quality, setQuality] = useState("");
  const [weight, setWeight] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventCreatedby, setEventCreatedby] = useState("");
  const [status, setStatus] = useState("");

  // New state for tracking autofill
  const [selectedTrackingNumbers, setSelectedTrackingNumbers] = useState([]);
  const [isLoadingAutoFill, setIsLoadingAutoFill] = useState(false);

  // Edit form states
  const [editEventId, setEditEventId] = useState("");
  const [editEventName, setEditEventName] = useState("");
  const [editRunId, setEditRunId] = useState("");
  const [editRunNo, setEditRunNo] = useState("");
  const [editTrackingId, setEditTrackingId] = useState("");
  const [editTrackingNo, setEditTrackingNo] = useState("");
  const [editEventMark, setEditEventMark] = useState("");
  const [editQuality, setEditQuality] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [editEventTime, setEditEventTime] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const [event, setEvent] = useState([]);
  const [EventMastersOptions, setEventMastersOptions] = useState([]);
  console.log("test",EventMastersOptions);
  const [orderOption, setOrderOptions] = useState([]);
  const [containerOption, setContainerOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const storedDetatis = localStorage.getItem("cargouser");
  const parsedDetails = JSON.parse(storedDetatis);
  const userid = parsedDetails ? parsedDetails.id : null;

  const fetchPieceAndWeight = async (trackingNumbers) => {
    if (!trackingNumbers || trackingNumbers.length === 0) {
      setQuality("");
      setWeight("");
      return;
    }

    setIsLoadingAutoFill(true);
    try {
      const params = new URLSearchParams();
      trackingNumbers.forEach(tn => params.append('tracking_numbers[]', tn));
      
      const response = await axiosInstance.get(
        `api/orders/get-piece-and-weight-in-parcel?${params.toString()}`
      );

      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        setQuality(data.total_piece_number.toString());
        setWeight(data.total_weight.toString());
        
        // toast.success(`Auto-filled: ${data.total_piece_number} pieces, ${data.total_weight} weight`);
      } else {
        toast.error("Failed to fetch piece and weight data");
      }
    } catch (error) {
      console.error("Error fetching piece and weight:", error);
      toast.error(error.response?.data?.message || "Error fetching piece and weight");
    } finally {
      setIsLoadingAutoFill(false);
    }
  };

  const handleTrackingNumberChange = (e) => {
    const selectedIds = e.value;
    setTrackingId(selectedIds);
    
    const selectedTrackings = orderOption
      .filter(option => selectedIds.includes(option.id))
      .map(option => option.tracking_number);
    
    setSelectedTrackingNumbers(selectedTrackings);
    
    setQuality("");
    setWeight("");
    setFormErrors({ ...formErrors, trackingNo: "" });
    
    if (selectedTrackings.length > 0) {
      fetchPieceAndWeight(selectedTrackings);
    }
  };

  const validateAddForm = () => {
    let errors = {};

    if (!eventId) {
      errors.eventName = "Event Name is required";
    }
    if (!runId) {
      errors.runNo = "Run Number is required";
    }
    if (!trackingId || trackingId.length === 0) {
      errors.trackingNo = "At least one Tracking Number is required";
    }
    if (!quality) {
      errors.quality = "Quantity is required";
    }
    if (!weight) {
      errors.weight = "Weight is required";
    }
    if (!eventDate) {
      errors.eventDate = "Event Date is required";
    }
    if (!eventTime) {
      errors.eventTime = "Event Time is required";
    }
    if (!eventMark) {
      errors.event = "Event is required";
    }
    if (status === "") {
      errors.status = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    let errors = {};

    if (!editEventId) {
      errors.editEventId = "Event Name is required";
    }
    if (!editRunId) {
      errors.editRunId = "Run Number is required";
    }
    // if (!editTrackingId) {
    //   errors.editTrackingId = "Tracking Number is required";
    // }
    if (!editQuality) {
      errors.editQuality = "Quantity is required";
    }
    if (!editWeight) {
      errors.editWeight = "Weight is required";
    }
    if (!editEventDate) {
      errors.editEventDate = "Event Date is required";
    }
    if (!editEventTime) {
      errors.editEventTime = "Event Time is required";
    }
    if (!editEventMark) {
      errors.editEventMark = "Event is required";
    }
    if (editStatus === "") {
      errors.editStatus = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/events/view-events`);
      if (response.data?.success || response.data?.status) {
        const apiData = response.data.events || [];
        console.log("apiData",apiData);
        setEvent(apiData);
        setEventCreatedby(response.data.createdBy || "");
        setEventMastersOptions(response.data.eventMasters || []);
        setOrderOptions(response.data.orders || []);
        setContainerOptions(response.data.containers || []);
      } else {
        setEvent([]);
        setEventMastersOptions([]);
        setOrderOptions([]);
        setContainerOptions([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setEvent([]);
      setEventMastersOptions([]);
      setOrderOptions([]);
      setContainerOptions([]);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddForm()) return;
    
    try {
      const payload = {
        event_name: eventId,
        run_number: runId,
        tracking_number: trackingId, // This will be an array of IDs
        event: eventMark,
        quantity: quality,
        weight: weight,
        event_date: eventDate,
        event_time: eventTime,
        created_by: userid,
        status: status,
      };

      const response = await axiosInstance.post(
        `api/events/create-events`,
        payload,
      );

      if (response.data?.status || response.data?.success) {
        toast.success("Event created successfully");
        fetchEvent();
        resetAddForm();
        closeAddModal();
      } else {
        toast.error("Failed to create event");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating event");
    }
  };

  const handleUpdate = async () => {
    if (!validateEditForm()) return;

    try {
      const payload = {
        event_name: editEventId,
        run_number: editRunId,
        // tracking_number: editTrackingId,
        event: editEventMark,
        quantity: editQuality,
        weight: editWeight,
        event_date: editEventDate,
        event_time: editEventTime,
        created_by: selectedEvent?.created_by || userid,
        status: editStatus,
      };

      const response = await axiosInstance.put(
        `api/events/edit-events/${selectedEvent?.id}`,
        payload
      );

      if (response.data?.status === true || response.data?.success === true) {
        toast.success("Event updated successfully");
        fetchEvent();
        closeEditModal();
      } else {
        toast.error("Failed to update event");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating event");
    }
  };

  const deleteEvent = async (eventId) => {
    if (!eventId) {
      toast.error("Invalid event ID");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this event?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axiosInstance.delete(
        `api/events/delete-events/${eventId}`,
      );

      if (response.data?.status === true || response.data?.success === true) {
        toast.success("Event deleted successfully");
        fetchEvent();
      } else {
        toast.error(response.data?.message || "Failed to delete event");
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
      toast.error("Error deleting event");
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
    resetAddForm();
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setErrors({});
    setTimeout(() => {
      setIsAddModalOpen(false);
      resetAddForm();
    }, 250);
  };

  const openEditModal = (row) => {
    console.log("row", row);
    setSelectedEvent(row);
    
    // Find the matching IDs from options
    const eventMasterOption = EventMastersOptions?.find(
      option => option.name === row.event_name
    );
    
    const containerOption_item = containerOption?.find(
      option => option.run_number === row.run_number
    );
    
    const orderOption_item = orderOption?.find(
      option => option.tracking_number === row.tracking_number
    );
    
    // Set all edit fields with the row data
    setEditEventId(row?.event_id || "");
    setEditEventName(row.event_name || "");
    setEditRunId(row?.run_id || "");
    setEditRunNo(row.run_number || "");
    setEditTrackingId(row?.tracking_id || "");
    setEditTrackingNo(row.tracking_number || "");
    setEditEventMark(row.event || "");
    setEditQuality(row.quantity || "");
    setEditWeight(row.weight || "");
    setEditEventDate(row.event_date ? row.event_date.split('T')[0] : "");
    setEditEventTime(row.event_time || "");
    setEditStatus(row.status || "");
    
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setFormErrors({});
    setTimeout(() => {
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      resetEditForm();
    }, 250);
  };

  const resetAddForm = () => {
    setEventId("");
    setRunId("");
    setTrackingId([]);
    setSelectedTrackingNumbers([]);
    setQuality("");
    setWeight("");
    setEventDate("");
    setEventTime("");
    setEventMark("");
    setStatus("");
    setFormErrors({});
  };

  const resetEditForm = () => {
    setEditEventId("");
    setEditEventName("");
    setEditRunId("");
    setEditRunNo("");
    setEditTrackingId("");
    setEditTrackingNo("");
    setEditEventMark("");
    setEditQuality("");
    setEditWeight("");
    setEditEventDate("");
    setEditEventTime("");
    setEditStatus("");
    setFormErrors({});
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

  const columns = [
    {
      title: "Sno",
      data: null,
      render: function (data, type, row, meta) {
        return meta.row + 1;
            },
          },
          {
            title: "Event Name",
            data: "event_name" || "-",
          },
          {
            title: "Run Number",
            data: "run_number" || "-",
          },
          {
            title: "Tracking Number",
            data: null,
            render: (data, type, row) => {
        if (!row.tracking_number || row.tracking_number.length === 0) {
          return "-";
        }
        return row.tracking_number
          .map(item => item.tracking_number)
          .join(", ");
            },
          },
          {
            title: "Quantity",
            data: "quantity" || "-",
          },
          {
            title: "Weight",
            data: "weight" || "-",
          },
          {
            title: "Event Date",
            data: null,
            render: (row) => {
        if (!row.event_date) return "-";
        return new Date(row.event_date).toLocaleDateString();
      },
    },
    {
      title: "Event Time",
      data: "event_time" || "-",
    },
    {
      title: "Created By",
      data: "created_by" || "-",
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
        const id = `actions-${row.id || Math.random()}`;
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
                      openEditModal(row);
                    }}
                  />
                  <MdOutlineDeleteOutline
                    className="text-red-600 text-xl cursor-pointer"
                    onClick={() => {
                      deleteEvent(row.id);
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
          <p className="text-gray-500">{">"}</p>
          <p className="text-sm md:text-md text-[#057fc4]">Cargo Movement Event</p>
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
                  <option value="0">Active</option>
                  <option value="1">Inactive</option>
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
                    <div className="absolute left-0 mt-2 bg-white rounded-xl shadow-lg w-52 p-3 z-50">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-sm">
                          Customize Columns
                        </p>
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
          <div className="table-scroll-container">
            <DataTable
              data={event}
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
            <div className="absolute inset-0" onClick={closeAddModal}></div>

            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[45vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Close"
                onClick={closeAddModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="px-5 lg:px-14 py-2 md:py-10">
                <p className="text-2xl md:text-3xl font-medium">Add Cargo Movement</p>

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div>
                    <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                      Event Name <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <Dropdown
                      value={eventId}
                      options={EventMastersOptions}
                      onChange={(e) => {
                        setEventId(e.value);
                        setFormErrors({ ...formErrors, eventName: "" });
                      }}
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Select Event Name"
                      filter
                      className="w-full border border-gray-300 rounded-lg"
                    />
                    {formErrors.eventName && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.eventName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div>
                    <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                      Run Number <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <Dropdown
                      value={runId}
                      options={containerOption}
                      onChange={(e) => {
                        setRunId(e.value);
                        setFormErrors({ ...formErrors, runNo: "" });
                      }}
                      optionLabel="run_number"
                      optionValue="id"
                      placeholder="Select Run Number"
                      filter
                      className="w-full border border-gray-300 rounded-lg"
                    />
                    {formErrors.runNo && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.runNo}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div>
                    <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                      Tracking Number <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <MultiSelect
                      value={trackingId}
                      onChange={handleTrackingNumberChange}
                      options={orderOption}
                      optionLabel="tracking_number"
                      optionValue="id"
                      placeholder="Select Tracking Number"
                      filter
                      className="w-full border border-gray-300 rounded-lg"
                      disabled={isLoadingAutoFill}
                      showClear
                    />
                    {/* {isLoadingAutoFill && (
                      <p className="text-blue-500 text-sm mt-1">Loading piece and weight data...</p>
                    )} */}
                    {formErrors.trackingNo && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.trackingNo}
                      </p>
                    )}
                    
                    {/* Display selected tracking numbers */}
                    {selectedTrackingNumbers.length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 font-medium">Selected Tracking Numbers:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTrackingNumbers.map((tn, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {tn}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div>
                    <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="number"
                      value={quality}
                      onChange={(e) => {
                        setQuality(e.target.value);
                        setFormErrors({ ...formErrors, quality: "" });
                      }}
                      placeholder="Piece Number"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoadingAutoFill ? 'bg-gray-100' : ''}`}
                      disabled={isLoadingAutoFill}
                      readOnly 
                    />
                    {formErrors.quality && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.quality}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div>
                    <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                      Weight <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => {
                        setWeight(e.target.value);
                        setFormErrors({ ...formErrors, weight: "" });
                      }}
                      placeholder="Weight"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoadingAutoFill ? 'bg-gray-100' : ''}`}
                      disabled={isLoadingAutoFill}
                      readOnly 
                    />
                    {formErrors.weight && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.weight}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div>
                    <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                      Event Date <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => {
                        setEventDate(e.target.value);
                        setFormErrors({ ...formErrors, eventDate: "" });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.eventDate && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.eventDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div>
                    <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                      Event Time <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => {
                        setEventTime(e.target.value);
                        setFormErrors({ ...formErrors, eventTime: "" });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.eventTime && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.eventTime}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div>
                    <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                      Event <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="eventMark"
                        value="public"
                        checked={eventMark === "public"}
                        onChange={(e) => {
                          setEventMark(e.target.value);
                          setFormErrors({ ...formErrors, event: "" });
                        }}
                        className="mr-2"
                      />
                      <label className="block text-[15px] md:text-md font-medium mr-4">
                        Public
                      </label>
                      <input
                        type="radio"
                        name="eventMark"
                        value="private"
                        checked={eventMark === "private"}
                        onChange={(e) => {
                          setEventMark(e.target.value);
                          setFormErrors({ ...formErrors, event: "" });
                        }}
                        className="mr-2"
                      />
                      <label className="block text-[15px] md:text-md font-medium">
                        Private
                      </label>
                    </div>
                    {formErrors.event && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.event}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div>
                    <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
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
                    disabled={isLoadingAutoFill}
                  >
                    {isLoadingAutoFill ? "Loading..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && selectedEvent && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm bg-opacity-50 z-50">
            <div className="absolute inset-0" onClick={closeEditModal}></div>

            <div
              className={`fixed top-0 right-0 h-screen overflow-y-auto w-screen sm:w-[90vw] md:w-[53vw] bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
                isAnimating ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full mt-2 ms-2 border-2 transition-all duration-500 bg-white border-gray-300 flex items-center justify-center cursor-pointer"
                title="Close"
                onClick={closeEditModal}
              >
                <IoIosArrowForward className="w-3 h-3" />
              </div>

              <div className="px-5 lg:px-14 py-10">
                <p className="text-2xl md:text-3xl font-medium">Edit Event</p>

                <div className="mt-10 rounded-lg">
                  <div className="bg-white rounded-xl w-full">
                    {/* Event Name Dropdown */}
                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Event Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          value={editEventId}
                          options={EventMastersOptions}
                          onChange={(e) => {
                            setEditEventId(e.value);
                            const selectedOption = EventMastersOptions.find(
                              option => option.id === e.value
                            );
                            setEditEventName(selectedOption?.name || "");
                            setFormErrors({ ...formErrors, editEventId: "" });
                          }}
                          optionLabel="name"
                          optionValue="id"
                          placeholder="Select Event Name"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                        {formErrors.editEventId && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editEventId}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Run Number Dropdown */}
                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Run Number <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          value={editRunId}
                          options={containerOption}
                          onChange={(e) => {
                            setEditRunId(e.value);
                            const selectedOption = containerOption.find(
                              option => option.id === e.value
                            );
                            setEditRunNo(selectedOption?.run_number || "");
                            setFormErrors({ ...formErrors, editRunId: "" });
                          }}
                          optionLabel="run_number"
                          optionValue="id"
                          placeholder="Select Run Number"
                          className="w-full border border-gray-300 rounded-lg"
                        />
                        {formErrors.editRunId && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editRunId}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Tracking Number Dropdown */}
                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Tracking Number <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        {/* <Dropdown
                        disabled
                          value={editTrackingId}
                          options={orderOption}
                          onChange={(e) => {
                            setEditTrackingId(e.value);
                            const selectedOption = orderOption.find(
                              option => option.id === e.value
                            );
                            setEditTrackingNo(selectedOption?.tracking_number || "");
                            setFormErrors({ ...formErrors, editTrackingId: "" });
                          }}
                          optionLabel="tracking_number"
                          optionValue="id"
                          placeholder="Select Tracking Number"
                          className="w-full border border-gray-300 rounded-lg"
                        /> */}
                        {/* {formErrors.editTrackingId && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editTrackingId}
                          </p>
                        )} */}
                        
                        {/* Display selected tracking numbers */}
                        {Array.isArray(editTrackingNo) && editTrackingNo.length > 0 && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 font-medium">Selected Tracking Numbers:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {editTrackingNo.map((item, index) => (
                                <span key={item._id || index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {item.tracking_number}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    

                              {/* Quantity Input */}
                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                        disabled
                          type="number"
                          value={editQuality}
                          onChange={(e) => {
                            setEditQuality(e.target.value);
                            setFormErrors({ ...formErrors, editQuality: "" });
                          }}
                          placeholder="Enter quantity"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editQuality && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editQuality}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Weight Input */}
                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Weight <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                        disabled
                          type="text"
                          value={editWeight}
                          onChange={(e) => {
                            setEditWeight(e.target.value);
                            setFormErrors({ ...formErrors, editWeight: "" });
                          }}
                          placeholder="Enter weight"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editWeight && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editWeight}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Event Date Input */}
                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Event Date <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="date"
                          value={editEventDate}
                          onChange={(e) => {
                            setEditEventDate(e.target.value);
                            setFormErrors({ ...formErrors, editEventDate: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editEventDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editEventDate}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Event Time Input */}
                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Event Time <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="time"
                          value={editEventTime}
                          onChange={(e) => {
                            setEditEventTime(e.target.value);
                            setFormErrors({ ...formErrors, editEventTime: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editEventTime && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editEventTime}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Event Radio Buttons */}
                              <div className="mt-8 flex justify-between items-center">
                                <label className="block text-[15px] md:text-md font-medium mb-2">
                                Event <span className="text-red-500">*</span>
                                </label>
                                <div className="w-[60%] md:w-[50%]">
                                <div className="flex items-center">
                                  <input
                                  type="radio"
                                  name="editEventMark"
                                  value="public"
                                  checked={editEventMark === "public"}
                                  onChange={(e) => {
                                    setEditEventMark(e.target.value);
                                    setFormErrors({ ...formErrors, editEventMark: "" });
                                  }}
                                  className="mr-2"
                                  />
                                  <label className="block text-[15px] md:text-md font-medium mr-4">
                                  Public
                                  </label>
                                  <input
                                  type="radio"
                                  name="editEventMark"
                                  value="private"
                                  checked={editEventMark === "private"}
                                  onChange={(e) => {
                                    setEditEventMark(e.target.value);
                                    setFormErrors({ ...formErrors, editEventMark: "" });
                                  }}
                                  className="mr-2"
                                  />
                                  <label className="block text-[15px] md:text-md font-medium">
                                  Private
                                  </label>
                                </div>
                                {formErrors.editEventMark && (
                                  <p className="text-red-500 text-sm mt-1">
                                  {formErrors.editEventMark}
                                  </p>
                                )}
                                </div>
                              </div>

                    {/* Status Dropdown */}
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
                          <p className="text-red-500 text-sm mt-1">
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
        {viewModalOpen && viewEvent && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="relative bg-white w-[95%] md:w-[500px] rounded-xl shadow-lg p-6">
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
                <div className="flex justify-between">
                  <span className="font-medium">Event Name</span>
                  <span>{viewEvent.event_name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Run No</span>
                  <span>{viewEvent.run_number}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Tracking No</span>
                  <span>{viewEvent.tracking_number}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Event</span>
                  <span>{viewEvent.event}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Quantity</span>
                  <span>{viewEvent.quantity}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Weight</span>
                  <span>{viewEvent.weight}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Event Date</span>
                  <span>{new Date(viewEvent.event_date).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Event Time</span>
                  <span>{viewEvent.event_time}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Created By</span>
                  <span>{viewEvent.created_by}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      viewEvent.status === "1"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {viewEvent.status === "1" ? "Active" : "Inactive"}
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