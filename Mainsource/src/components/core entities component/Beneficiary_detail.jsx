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

const Beneficiary_detail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [totalRecords, setTotalRecords] = useState("");
  const [beneficiary, setBeneficiary] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewBeneficiary, setViewBeneficiary] = useState(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    beneficiary_id: true,
    name: true,
    email: true,
    phone: true,
    city: true,
    country: true,
    address: true,
    status: true,
  });
  const [statusFilter, setStatusFilter] = useState("");
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  };
  const [dateFilter, setDateFilter] = useState(getToday());
  const [email, setEmail] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isDateTouched, setIsDateTouched] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState("");

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editingBeneficiaryId, setEditingBeneficiaryId] = useState(null);

  const storedDetatis = localStorage.getItem("cargouser");
  console.log("storedDetatis.... : ", storedDetatis);
  const parsedDetails = JSON.parse(storedDetatis);
  console.log("....parsedDetails.... : ", parsedDetails);
  const userid = parsedDetails ? parsedDetails.id : null;
  console.log("userid.... : ", userid);

  const validateAddForm = () => {
    let errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }
    if (!city.trim()) {
      errors.city = "City is required";
    }
    if (!country.trim()) {
      errors.country = "Country is required";
    }
    if (!phone.trim()) {
      errors.phone = "Phone Number is required";
    } else if (!/^[0-9]{10}$/.test(phone)) {
      errors.phone = "Enter a valid 10-digit phone number";
    }
    if (address.trim() === "") {
      errors.address = "Address is required";
    }
    if (status === "") {
      errors.status = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    let errors = {};

    if (!editName.trim()) {
      errors.editName = "Name is required";
    }
    if (!editEmail.trim()) {
      errors.editEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) {
      errors.editEmail = "Enter a valid email address";
    }
    if (!editCity.trim()) {
      errors.editCity = "City is required";
    }
    if (!editCountry.trim()) {
      errors.editCountry = "Country is required";
    }
    if (!editPhone.trim()) {
      errors.editPhone = "Phone Number is required";
    } else if (!/^[0-9]{10}$/.test(editPhone)) {
      errors.editPhone = "Enter a valid 10-digit phone number";
    }
    if (editAddress.trim() === "") {
      errors.editAddress = "Address is required";
    }
    if (editStatus === "") {
      errors.editStatus = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    fetchBeneficiary();
  }, []);

  // list
  const fetchBeneficiary = async () => {
    console.log("fetch Beneficiary called");
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `api/beneficiary/view-beneficiary`
      );

      console.log("Beneficiary API Response:", response.data);

      if (response.data?.status === true || response.data?.success === true) {
        const customerData = response.data.data || [];
        setBeneficiary(customerData);
        setTotalRecords(customerData.length);
      } else {
        setBeneficiary([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Fetch Beneficiary error:", error);
      setBeneficiary([]);
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
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        country: country.trim(),
        status: status,
        createdBy: userid,
      };

      const response = await axiosInstance.post(
        "api/beneficiary/create-beneficiary",
        formdata
      );

      if (response.data?.success || response.data?.status) {
        toast.success("Beneficiary created successfully");

        fetchBeneficiary();
        closeAddModal();

        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setCity("");
        setCountry("");
        setStatus("");

      } else {
        toast.error("Failed to create Beneficiary");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating Beneficiary");
    }
  };

  // edit
  const openEditModal = async (row) => {
    const beneficiaryId = row._id;

    if (!beneficiaryId) {
      toast.error("Invalid Beneficiary ID");
      return;
    }

    try {
      setEditingBeneficiaryId(beneficiaryId);
      setIsEditModalOpen(true);
      setIsAnimating(true);

      const response = await axiosInstance.get(
        `api/beneficiary/view-beneficiary/${beneficiaryId}`
      );

      if (response.data?.success || response.data?.status) {
        const data = response.data.data;

        setEditName(data.name);
        setEditEmail(data.email);
        setEditPhone(data.phone);
        setEditAddress(data.address);
        setEditCity(data.city);
        setEditCountry(data.country);
        setEditStatus(String(data.status));
      }

    } catch (err) {
      toast.error("Unable to fetch Beneficiary details");
    }
  };

  // Update
  const handleUpdate = async () => {
    if (!validateEditForm()) return;

    try {
      const response = await axiosInstance.put(
        `api/beneficiary/edit-beneficiary/${editingBeneficiaryId}`,
        {
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          address: editAddress.trim(),
          city: editCity.trim(),
          country: editCountry.trim(),
          status: editStatus,
          updatedBy: userid
        }
      );

      if (response.data?.success || response.data?.status) {
        toast.success("Beneficiary updated successfully");
        fetchBeneficiary();
        closeEditModal();
      } else {
        toast.error("Failed to update Beneficiary");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating Beneficiary");
    }
  };

  // delete
  const deleteBeneficiary = async (beneficiaryId) => {
    if (!beneficiaryId) {
      toast.error("Invalid Beneficiary ID");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this Beneficiary?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axiosInstance.delete(
        `api/beneficiary/delete-beneficiary/${beneficiaryId}`
      );

      if (response.data?.status === true || response.data?.success === true) {
        toast.success("Beneficiary deleted successfully");
        fetchBeneficiary();

      } else {
        toast.error(response.data?.message || "Failed to delete Beneficiary");
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
      toast.error("Error deleting Beneficiary");
    }
  };



  const resetFilters = () => {
    setStatusFilter("");
    setDateFilter(getToday());
    setIsDateTouched(false);
  };

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => {
      const newState = { ...prev, [key]: !prev[key] };

      const columnIndexMap = {
        Sno: 0,
        beneficiary_id: 1,
        name: 2,
        email:3,
        phone: 4,
        address: 5,
        city: 6,
        country: 7,
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
      title: "Beneficiary ID",
      data: null,
      render: (row) => row.beneficiary_id || "-",
    },
    {
      title: "Name",
      data: null,
      render: (row) => row.name || "-",
    },
    {
      title: "Email",
      data: null,
      render: (row) => row.email || "-",
    },
    {
      title: "Phone Number",
      data: null,
      render: (row) => row.phone || "-",
    },
    {
      title: "Address",
      data: null,
      render: (row) => row.address || "-",
    },
    {
      title: "City",
      data: null,
      render: (row) => row.city || "-",
    },
    {
      title: "Country",
      data: null,
      render: (row) => row.country || "-",
    },
    {
      title: "Status",
      data: "status",
      render: (data) => {
        const isActive = String(data) === "1";

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
                      setViewBeneficiary(row);
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
                      deleteBeneficiary(row._id);
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

  const data = beneficiary.filter((item) => {
    const itemDate = item.createdAt?.split("T")[0];

    return (
      (statusFilter ? String(item.status) === statusFilter : true) &&
      (isDateTouched ? itemDate === dateFilter : true)
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

          <p className="text-sm md:text-md text-[#057fc4]">Beneficiary</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-5 mb-3 mt-3 shadow-sm">
          <div className="flex flex-wrap items-end gap-3 justify-between">

            {/* Left Side Filters */}
            <div className="flex flex-wrap md:flex-nowrap items-end gap-3">

              {/* Status Filter */}
              <div className="gap-2">
                <label className="text-sm font-medium text-gray-600 p-1">Status</label>
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
              <div className="flex justify-start items-center ">
                <div className="relative">
                  <button
                    onClick={() => setShowCustomize(!showCustomize)}
                    className="border px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-[#d5eeff] bg-[#e6f2fa] text-[#057fc4]"
                  >
                    <BiCustomize className="text-[#046fac]" />Customize
                  </button>

                  {showCustomize && (
                    <div className="absolute right-0 left-0 mt-2 bg-white rounded-xl shadow-lg w-52 h-52 p-3 z-50 overflow-x-auto">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium  text-sm">Customize Columns</p>
                        <button onClick={() => setShowCustomize(false)}>✕</button>
                      </div>

                      {Object.keys(visibleColumns)
                        .filter(col => col !== "Sno")
                        .map((col) => (

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
                <p className="text-2xl md:text-3xl font-medium">Add Beneficiary</p>



                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                  <div className="">
                    <label
                      htmlFor="roleName"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setFormErrors({ ...formErrors, name: "" });
                      }}
                      placeholder="Enter name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.name}
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
                      Email <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormErrors({ ...formErrors, email: "" });
                      }}
                      placeholder="Enter email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.email}
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
                      Phone Number <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="number"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setFormErrors({ ...formErrors, phone: "" });
                      }}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.phone}
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
                      Address <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <textarea
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setFormErrors({ ...formErrors, address: "" })
                      }}
                      placeholder="Enter address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.address}
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
                      City <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setFormErrors({ ...formErrors, city: "" });
                      }}
                      placeholder="Enter city"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.city}
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
                      Country <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setFormErrors({ ...formErrors, country: "" });
                      }}
                      placeholder="Enter country"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.country && (
                      <p className="text-red-500 text-sm mb-4 mt-1">
                        {formErrors.country}
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
                <p className="text-2xl md:text-3xl font-medium">Edit Beneficiary</p>

                <div className="mt-10  rounded-lg ">
                  <div className="bg-white  rounded-xl w-full">

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          placeholder="Enter name"
                          value={editName}
                          onChange={(e) => {
                            setEditName(e.target.value);
                            setFormErrors({ ...formErrors, editName: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editName && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          placeholder="Enter email"
                          value={editEmail}
                          onChange={(e) => {
                            setEditName(e.target.value);
                            setFormErrors({ ...formErrors, editEmail: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editEmail && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editEmail}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="number"
                          placeholder="Enter phone number"
                          value={editPhone}
                          onChange={(e) => {
                            setEditPhone(e.target.value);
                            setFormErrors({ ...formErrors, editPhone: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editPhone && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editPhone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <textarea
                          type="text"
                          placeholder="Enter address"
                          value={editAddress}
                          onChange={(e) => {
                            setEditAddress(e.target.value);
                            setFormErrors({ ...formErrors, editAddress: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editAddress && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editAddress}
                          </p>
                        )}
                      </div>
                    </div>


                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          placeholder="Enter city"
                          value={editCity}
                          onChange={(e) => {
                            setEditCity(e.target.value);
                            setFormErrors({ ...formErrors, editCity: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editCity && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editCity}
                          </p>
                        )}
                      </div>
                    </div>


                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          placeholder="Enter country"
                          value={editCountry}
                          onChange={(e) => {
                            setEditCountry(e.target.value);
                            setFormErrors({ ...formErrors, editCountry: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formErrors.editCountry && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.editCountry}
                          </p>
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
                            setFormErrors({ ...formErrors, editStatus: "" })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select status</option>
                          <option value="1">Active</option>
                          <option value="0">InActive</option>
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
        {viewModalOpen && viewBeneficiary && (
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
                Beneficiary Details
              </h2>

              <div className="space-y-4 text-sm text-gray-700">

                {/* beneficiary ID */}
                <div className="flex justify-between ">
                  <span className="font-medium">Beneficiary ID</span>
                  <span>{viewBeneficiary.beneficiary_id}</span>
                </div>

                {/* Name */}
                <div className="flex justify-between ">
                  <span className="font-medium">Name</span>
                  <span>{viewBeneficiary.name}</span>
                </div>

                {/* phone number */}
                <div className="flex justify-between ">
                  <span className="font-medium">Phone Number</span>
                  <span>{viewBeneficiary.phone}</span>
                </div>

                {/* address */}
                <div className="flex justify-between ">
                  <span className="font-medium">Address</span>
                  <span>{viewBeneficiary.address}</span>
                </div>

                {/* city */}
                <div className="flex justify-between ">
                  <span className="font-medium">City</span>
                  <span>{viewBeneficiary.city}</span>
                </div>

                {/* country */}
                <div className="flex justify-between ">
                  <span className="font-medium">Country</span>
                  <span>{viewBeneficiary.country}</span>
                </div>


                {/* Status */}
                <div className="flex justify-between ">
                  <span className="font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                                              ${viewBeneficiary.status === 1 || viewBeneficiary.status === "1"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {viewBeneficiary.status === 1 || viewBeneficiary.status === "1"
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

export default Beneficiary_detail;

