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
import axiosInstance from "../../api/axiosInstance";
DataTable.use(DT);
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const User_detail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [totalRecords, setTotalRecords] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
  console.log("statusFilter",statusFilter);
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  };
  const [dateFilter, setDateFilter] = useState(getToday());
  const [isDateTouched, setIsDateTouched] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState("");
  const [status, setStatus] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  console.log("editing User ID", editingUserId);

  //local storage 
  const storedDetatis = localStorage.getItem("cargouser");
  console.log("storedDetatis.... : ", storedDetatis);
  const parsedDetails = JSON.parse(storedDetatis);
  console.log("....parsedDetails.... : ", parsedDetails);
  const userid = parsedDetails ? parsedDetails.id : null;
  console.log("userid.... : ", userid);

  const roleOptions = roles;

  const validateAddForm = () => {
    let errors = {};

    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    }
    if (!phone.trim()) {
      errors.phone = "Phone Number is required";
    } else if (!/^[0-9]{10}$/.test(phone)) {
      errors.phone = "Enter a valid 10-digit phone number";
    }
    if (role === "") {
      errors.role = "Role is required";
    }
    if (status === "") {
      errors.status = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    let errors = {};

    if (!editFirstName.trim()) {
      errors.editFirstName = "First name is required";
    }
    if (!editLastName.trim()) {
      errors.editLastName = "Last name is required";
    }
    if (!editEmail.trim()) {
      errors.editEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) {
      errors.editEmail = "Enter a valid email address";
    }
    if (!editPassword.trim()) {
      errors.editPassword = "Password is required";
    }
    if (!editPhone.trim()) {
      errors.editPhone = "Phone Number is required";
    } else if (!/^[0-9]{10}$/.test(editPhone)) {
      errors.editPhone = "Enter a valid 10-digit phone number";
    }
    if (editRole === "") {
      errors.editRole = "Role is required";
    }
    if (editStatus === "") {
      errors.editStatus = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // list
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("api/users/get-users");

      if (response.data?.success) {

        const formattedUsers = response.data.users.map((user, index) => {
          const [first = "", last = ""] = user.name?.split(" ");

          return {
            ...user,
            sno: index + 1,
            first_name: first,
            last_name: last,
            role_id: user.role?._id,
            role_name: user.role?.name || "",
            status: String(user.status),
          };
        });

        setUsers(formattedUsers);

       
        if (response.data.role) {   
          const formattedRoles = response.data.role.map((r) => ({
            id: r._id,
            name: r.name,
          }));

          setRoles(formattedRoles);
        }

      } else {
        setUsers([]);
        setRoles([]);
      }

    } catch (error) {
      console.error("Fetch error:", error);
      setUsers([]);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  // create
  const handleAddSubmit = async (e) => {
    e.preventDefault();

    if (!validateAddForm()) return;
    if (submitting) return;

    setSubmitting(true);

    try {
      const formdata = {
        name: `${firstName} ${lastName}`,
        email: email,
        password: password,
        phone: phone,
        role: role, 
        status: status,
        createdBy: userid,
      };

      const response = await axiosInstance.post(
        "api/users/create-users",
        formdata
      );

      if (response.data?.status || response.data?.success) {
        toast.success("User created successfully");
        fetchUsers();
        closeAddModal();
      } else {
        toast.error("Failed to create user");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating user");
    } finally {
      setSubmitting(false);
    }
  };

  // edit
const openEditModal = async (row) => {
  const userId = row?._id;

  if (!userId) {
    toast.error("Invalid User ID");
    return;
  }

  try {
    setEditingUserId(userId);

    const response = await axiosInstance.get(
      `api/users/get-users/${userId}`
    );

    console.log("EDIT RESPONSE:", response.data);

    
    const data =
      response.data?.data ||
      response.data?.user ||
      response.data;

    if (!data || !data._id) {
      toast.error("User data not found");
      return;
    }

    const [first = "", last = ""] = (data.name || "").split(" ");

    setEditFirstName(first);
    setEditLastName(last);
    setEditEmail(data.email || "");
    setEditPhone(data.phone || "");
    setEditPassword("");
    setEditRole(data.role?._id || "");
    setEditStatus(String(data.status ?? ""));

    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);

  } catch (err) {
    console.error("EDIT ERROR:", err.response?.data || err);
    toast.error("Unable to fetch user details");
  }
};

  // update
  const handleUpdate = async () => {
    if (!validateEditForm()) return;

    try {
      const response = await axiosInstance.put(
        `api/users/edit-users/${editingUserId}`,
        {
          name: `${editFirstName} ${editLastName}`,
          email: editEmail,
          password: editPassword,
          phone: editPhone,
          role: editRole,
          status: editStatus,
          updatedBy: userid,
        }
      );

      if (response.data?.status || response.data?.success) {
        toast.success("User updated successfully");
        fetchUsers();   
        closeEditModal();
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating user");
    }
  };

  // view
const openViewModal = async (userId) => {
  if (!userId) {
    toast.error("Invalid User ID");
    return;
  }

  try {
    const response = await axiosInstance.get(
      `api/users/get-users/${userId}`,
      {
        headers: {
          "Cache-Control": "no-cache"
        }
      }
    );

    console.log("VIEW RESPONSE:", response.data);

    // 🔥 IMPORTANT: Handle multiple backend formats safely
    const data =
      response.data?.data ||
      response.data?.user ||
      response.data?.users ||
      response.data;

    if (!data || !data._id) {
      toast.error("User data not found");
      return;
    }

    const [first = "", last = ""] = (data.name || "").split(" ");

    setViewUser({
      ...data,
      first_name: first,
      last_name: last,
      role_name: data.role?.name || "",
    });

    setViewModalOpen(true);

  } catch (error) {
    console.error("VIEW ERROR:", error.response?.data || error);
    toast.error("Error fetching user details");
  }
};

  // delete
  const deleteUsers = async (userId) => {
    if (!userId) {
      toast.error("Invalid User ID");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axiosInstance.delete(
        `api/users/delete-users/${userId}`
      );

      if (response.data?.status === true || response.data?.success === true) {
        toast.success("User deleted successfully");
        fetchUsers(); // refresh table

      } else {
        toast.error(response.data?.message || "Failed to delete User");
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
      toast.error("Error deleting User");
    }
  };

const openAddModal = () => {

  setFirstName("");
  setLastName("");
  setEmail("");
  setPassword("");
  setPhone("");
  setRole("");
  setStatus("");
  setFormErrors({});

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


  const resetFilters = () => {
    setRoleFilter("");
    setStatusFilter("");
    setDateFilter(getToday());
    setIsDateTouched(false);
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
      title: "First Name",
      data: null,
      render: (row) => row.first_name || "-",
    },
    {
      title: "Last Name",
      data: null,
      render: (row) => row.last_name || "-",
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
      title: "Role",
      data: null,
      render: (row) => row.role_name || "-",
    },
    {
      title: "Status",
      data: "status",
      render: (data) => {
        const isActive = data === 1 || data === "1";

        const textColor = isActive ? "green" : "red";
        const bgColor = isActive ? "#e6fffa" : "#ffe5e5";

        return `
      <div style="
        display: inline-block;
        padding: 4px 8px;
        color: ${textColor};
        background-color: ${bgColor};
        border: 1px solid ${bgColor};
        border-radius: 50px;
        text-align: center;
        width:100px;
        font-size: 10px;
        font-weight: 700;
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
                      openViewModal(row._id);
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
                      deleteUsers(row._id);
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

  const data = users.filter((item) => {
    const itemDate = item.createdAt
      ? new Date(item.createdAt).toISOString().split("T")[0]
      : "";


    return (
      (!roleFilter || item.role_id === roleFilter) &&
      (!statusFilter || String(item.status) === statusFilter) &&
      (!isDateTouched ? true : itemDate === dateFilter) 
    );
  });



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

          <p className="text-sm md:text-md text-[#057fc4]">Users</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-5 mb-3 mt-3 shadow-sm">
          <div className="flex flex-wrap items-end gap-3 justify-between">

            {/* Left Side Filters */}
            <div className="flex flex-wrap gap-3">

              {/* Role Filter */}
              <div className="gap-2">
                <label className="text-sm font-medium text-gray-600 p-1">Role</label>
                <Dropdown
                  value={roleFilter}
                  options={roleOptions}
                  onChange={(e) => setRoleFilter(e.value)}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Select role"
                  className="border text-sm rounded-lg min-w-[140px]"
                />



              </div>

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
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setIsDateTouched(true);
                  }}
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
              key={data.length}
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
                <p className="text-2xl md:text-3xl font-medium">Add Users</p>

                <div className="mt-2 md:mt-8 flex justify-between items-center">
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Role <span className="text-red-500">*</span>
                    </label>
                  </div>

                  <div className="w-[60%] md:w-[50%]">

                    <Dropdown
                      value={role}
                      options={roleOptions}
                      onChange={(e) => setRole(e.value)}
                      optionLabel="name"
                      optionValue="id"
                      placeholder="Select role"
                      className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                    />

                    {formErrors.role && (<p className="text-red-500 text-sm mb-4 mt-1">{formErrors.role}</p>)}

                  </div>
                </div>

                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                  <div className="">
                    <label
                      htmlFor="firstName"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">


                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setFormErrors({ ...formErrors, firstName: "" });
                      }}
                      placeholder="Enter first name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                    />
                    {formErrors.firstName && (<p className="text-red-500 text-sm">{formErrors.firstName}</p>)}


                  </div>
                </div>


                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                  <div className="">
                    <label
                      htmlFor="roleName"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">


                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setFormErrors({ ...formErrors, lastName: "" });
                      }}
                      placeholder="Enter last name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                    />
                    {formErrors.lastName && (<p className="text-red-500 text-sm">{formErrors.lastName}</p>)}

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
                      type="email"
                      value={email}
                      autoComplete="off"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormErrors({ ...formErrors, email: "" });
                      }}
                      placeholder="Enter email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                    />
                    {formErrors.email && (<p className="text-red-500 text-sm">{formErrors.email}</p>)}

                  </div>
                </div>

                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                  <div className="">
                    <label
                      htmlFor="roleName"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="password"
                      value={password}
                      autoComplete="new-password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFormErrors({ ...formErrors, password: "" });
                      }}
                      placeholder="Enter password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                    />
                    {formErrors.password && (<p className="text-red-500 text-sm">{formErrors.password}</p>)}

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                    />
                    {formErrors.phone && (<p className="text-red-500 text-sm">{formErrors.phone}</p>)}

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                    >
                      <option value="">Select status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                    {formErrors.status && (<p className="text-red-500 text-sm">{formErrors.status}</p>)}

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
                <p className="text-2xl md:text-3xl font-medium">Edit User</p>

                <div className="mt-10  rounded-lg ">
                  <div className="bg-white  rounded-xl w-full">

                    <div className="mt-2 md:mt-8 flex justify-between items-center">
                      <div>
                        <label
                          htmlFor="role"
                          className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                        >
                          Role <span className="text-red-500">*</span>
                        </label>
                      </div>

                      <div className="w-[60%] md:w-[50%]">
                        <Dropdown
                          value={editRole}
                          options={roleOptions}
                          onChange={(e) => {
                            setEditRole(e.value);
                            setFormErrors({ ...formErrors, editRole: "" });
                          }}
                          optionLabel="name"
                          optionValue="id"
                          placeholder="Select role"
                          className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                        />
                        {formErrors.editRole && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.editRole}</p>
                        )}

                      </div>
                    </div>


                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">

                        <input
                          type="text"
                          value={editFirstName}
                          onChange={(e) => {
                            setEditFirstName(e.target.value);
                            setFormErrors({ ...formErrors, editFirstName: "" })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                        />
                        {formErrors.editFirstName && (
                          <p className="text-red-500 text-sm">{formErrors.editFirstName}</p>
                        )}

                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          placeholder="Enter last name"
                          value={editLastName}
                          onChange={(e) => {
                            setEditLastName(e.target.value);
                            setFormErrors({ ...formErrors, editLastName: "" })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                        />
                        {
                          formErrors.editLastName && (
                            <p className="text-red-500 text-sm ">{formErrors.editLastName}</p>
                          )
                        }
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="email"
                          placeholder="Enter email"
                          value={editEmail}
                          onChange={(e) => {
                            setEditEmail(e.target.value);
                            setFormErrors({ ...formErrors, editEmail: "" })
                          }}
                          autoComplete="off"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                        />
                        {formErrors.editEmail && (
                          <p className="text-red-500 text-sm ">{formErrors.editEmail}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="password"
                          placeholder="Enter password"
                          value={editPassword}
                          onChange={(e) => {
                            setEditPassword(e.target.value);
                            setFormErrors({ ...formErrors, editPassword: "" })
                          }}
                          autoComplete="new-password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                        />
                        {formErrors.editPassword && (
                          <p className="text-red-500 text-sm">{formErrors.editPassword}</p>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                        />
                        {formErrors.editPhone && (
                          <p className="text-red-500 text-sm ">{formErrors.editPhone}</p>
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
                            setFormErrors({ ...formErrors, editStatus: "" }); // clear error on change
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4] 
    ${formErrors.editStatus ? "border-red-500" : "border-gray-300"}`}
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
        {viewModalOpen && viewUser && (
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

                {/* First Name */}
                <div className="flex justify-between ">
                  <span className="font-medium">First Name</span>
                  <span>{viewUser.first_name}</span>
                </div>

                {/* Last Name */}
                <div className="flex justify-between ">
                  <span className="font-medium">Last Name</span>
                  <span>{viewUser.last_name}</span>
                </div>

                {/* email */}
                <div className="flex justify-between ">
                  <span className="font-medium">Email</span>
                  <span>{viewUser.email}</span>
                </div>

                {/* phone number */}
                <div className="flex justify-between ">
                  <span className="font-medium">Phone Number</span>
                  <span>{viewUser.phone}</span>
                </div>

                {/* role */}
                <div className="flex justify-between ">
                  <span className="font-medium">Role</span>
                  <span>{viewUser.role_name}</span>
                </div>


                {/* Status */}
                <div className="flex justify-between ">
                  <span className="font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                                      ${viewUser.status === 1 || viewUser.status === "1"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {viewUser.status === 1 || viewUser.status === "1"
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

export default User_detail;

