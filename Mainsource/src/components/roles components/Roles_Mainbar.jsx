import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { TfiPencilAlt } from "react-icons/tfi";
import ReactDOMServer from "react-dom/server";
import { RiDeleteBin6Line } from "react-icons/ri";
import aryu_logo from "../../assets/aryu_logo.svg";
import { FaEye } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io"

// import DT from "datatables.net-dt";
// import "datatables.net-responsive-dt/css/responsive.dataTables.css";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { IoIosArrowForward } from "react-icons/io";
import { createRoot } from "react-dom/client";
import { useNavigate } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { API_URL } from "../../Config";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


const Roles_Mainbar = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRole, setViewRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [roleFilter, setRoleFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  };
  const [dateFilter, setDateFilter] = useState(getToday());
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState("");
  const [editRoleName, setEditRoleName] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const validateAddForm = () => {
    let errors = {};

    if (!roleName.trim()) {
      errors.roleName = "Role name is required";
    } else if (roleName.length < 3) {
      errors.roleName = "Role name must be at least 3 characters";
    }

    if (status === "") {
      errors.status = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditForm = () => {
    let errors = {};

    if (!editRoleName.trim()) {
      errors.editRoleName = "Role name is required";
    } else if (editRoleName.length < 3) {
      errors.editRoleName = "Role name must be at least 3 characters";
    }

    if (editStatus === "") {
      errors.editStatus = "Status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // create

    const handleAddSubmit = async (e) => {
      e.preventDefault();
  
      if (!validateCreateForm()) {
        return;
      }
  
      if (submitting) return;
      setSubmitting(true);
  
      try {
        const formdata = {
          company_id: pssCompany,
          role_name,
          status,
          department_id: department,
          created_by: userid,
        };
  
        const response = await axiosInstance.post(
          `${API_URL}api/roles/create-roles`,
          formdata
        );
  
        if (response.data.status === true || response.data.success === true) {
          toast.success("Role created successfully");
          fetchRoles();
          setDepartment("");
          closeAddModal();
        } else {
          toast.error("Failed to create role");
        }
      } catch (err) {
        toast.error("Error creating role");
      } finally {
        setSubmitting(false);
      }
    };

  // edit

    const handleUpdate = async () => {
      if (!validateEditForm()) {
        return;
      }
  
      try {
        const response = await axiosInstance.post(
          `${API_URL}api/roles/edit-roles/${editingRoleId}`,
          { 
            role_name: roleDetails.role_name,
            department_id: roleDetails.department_id,
            company_id: roleDetails.company_id,
            status: roleDetails.status,
            updated_by: userid,
          }
        );
  
        if (response.data.status || response.data.success) {
          toast.success("Role updated successfully");
          closeEditModal();
          fetchRoles();
        } else {
          toast.error("Failed to update role");
        }
      } catch (err) {
        toast.error("Error updating role");
      }
    };
  const openViewModal = async (row) => {
    const response = await axiosInstance.get(
      `${API_URL}api/role/edit/${row.id}`
    );

    if (response.data?.status) {
      setViewContact(response.data.data);
      setViewModalOpen(true);
    }
  };
  // delete
  const deleteRoles = (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this role?",
      icon: "warning",
      showCancelButton: true,

      cancelButtonText: "Cancel",
      confirmButtonText: "Yes, delete it!",

      //    confirmButtonColor: "#DF3A3A", 
      // cancelButtonColor: "#ffffff", 

      // customClass: {
      //   popup: "custom-swal-popup",
      //   title: "custom-swal-title",
      //   htmlContainer: "custom-swal-text",
      //   confirmButton: "custom-swal-confirm",
      //   cancelButton: "custom-swal-cancel",
      //   icon: "custom-swal-icon"
      // }
    }).then((result) => {
      if (result.isConfirmed) {

        axiosInstance.delete(`${API_URL}api/roles/delete-roles`, {
          data: { 
            record_id: roleId
          }
        })
          .then((response) => {
            console.log("Delete response:", response.data);
            if (response.data.status === true || response.data.success === true) {
              toast.success("Role has been deleted.");
              fetchRoles(); // Refresh the roles list

            } else {
              Swal.fire("Error!", response.data.message || "Failed to delete role.", "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting role:", error);
            Swal.fire("Error!", "Failed to delete role.", "error");
          });
      }
    });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // list
  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}api/roles/view-roles`);

      console.log("...RoleFetching All.... : ", response.data);

      if (response.data.status === true) {
        // roles
        setRoles(response.data.data || []);
        setTotalRecords(response.data.data.length || 0);

        // departments (from SAME API)
        const activeDepartments = (response.data.departments || []).filter(
          (dept) => dept.status === "1" || dept.status === 1
        );

        setDepartments(activeDepartments);
        //  set pss company options
        const pssCompanyOptions = response.data.psscompany.map((company) => ({
          label: company.name,
          value: company.id,
        }));

        setPssCompanyOptions(pssCompanyOptions);
      } else {
        setRoles([]);
        setPssCompanyOptions([]);
        setDepartments([]);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error("Failed to fetch roles", err);
      setRoles([]);
      setDepartments([]);
      setPssCompanyOptions([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Open and close modals
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

  const openEditModal = async (row) => {


    try {
      setEditingRoleId(row.id);
      setIsEditModalOpen(true);
      setIsAnimating(true);

      const response = await axiosInstance.get(
        `${API_URL}api/role/edit/${row.id}`
      );

      console.log("openEditModal response", response.data);

      if (response.data?.status === true) {
        const data = response.data.data;

        console.log(
          "Edit dept value:",
          roleDetails.department_id,
          typeof roleDetails.department_id
        );

        //    setRoleDetails({
        //   role_name: row.role_name,
        // department_id: row.department_id?.toString(),
        // company_id: row.company_id, 
        // status: row.status?.toString(),
        // });
        setRoleDetails({
          role_name: data.role_name,
          department_id: Number(data.department_id), // ✅ force number
          company_id: data.company_id,
          status: Number(data.status),
        });
      }
      else {
        toast.error("Failed to load role details");
      }
    } catch (err) {
      console.error("Edit fetch error:", err);
      toast.error("Unable to fetch role details");
    }
  };

  const closeEditModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsEditModalOpen(false), 250);
  };

  const columns = [
    {
      header: "Sno",
      field: "Sno",
    },
    {
      header: "Name",
      field: "name",
    },
    {
      header: "Status",
      field: "status",
      render: (data) => {
        const isActive = Number(data) === 1;

        return `
        <div style="
          display:inline-block;
          padding:4px 10px;
          border-radius:50px;
          font-size:12px;
          font-weight:600;
          background:${isActive ? "#e6fffa" : "#ffe5e5"};
          color:${isActive ? "green" : "red"};
        ">
          ${isActive ? "Active" : "Inactive"}
        </div>
      `;
      },
    },
    {
      header: "Action",
      field: null,
      render: (data, type, row) => {
        const id = `actions-${row.Sno}`;

        setTimeout(() => {
          const container = document.getElementById(id);
          if (container) {
            if (!container._root) {
              container._root = createRoot(container);
            }

            container._root.render(
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setViewRole(row);
                    setViewModalOpen(true);
                  }}
                  className="p-1 bg-blue-50 text-blue-600 rounded-md"
                >
                  <FaEye />
                </button>

                <TfiPencilAlt
                  className="cursor-pointer"
                  onClick={() => openEditModal(row)}
                />

                <MdOutlineDeleteOutline
                  className="text-red-600 cursor-pointer"
                  onClick={() => deleteRoles(row._id)}
                />
              </div>,
              container
            );
          }
        }, 0);

        return `<div id="${id}"></div>`;
      },
    },
  ];

  const resetFilters = () => {
    setRoleFilter("");
    setStatusFilter("");
    setDateFilter(""); // reset to today
  };

  const rawData = [
    { Sno: 1, role_name: "Writer", Status: 0, date: "2026-02-01" },
    { Sno: 2, role_name: "Editor", Status: 1, date: "2026-02-02" },
    { Sno: 3, role_name: "Editor", Status: 1, date: "2026-02-03" },
  ];

  const data = roles.filter((item) => {
    return (
      (roleFilter ? item.role_name === roleFilter : true) &&
      (statusFilter ? String(item.status) === statusFilter : true) &&
      (dateFilter ? item.date === dateFilter : true)
    );
  });




  return (
    <div className="bg-gray-100 flex flex-col justify-between w-screen min-h-screen px-5 pt-2 md:pt-4">
      <div>
        <Mobile_Sidebar />
        <div className="flex  gap-2 mt-2 md:mt-0 ms-5 items-center">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className="text-sm md:text-md text-[#057fc4]">Roles</p>
        </div>


        {/* Filters */}
        <div className="bg-white rounded-xl p-5 mb-3 mt-3 shadow-sm">
          <div className="flex flex-wrap items-end gap-3 justify-between">

            {/* Left Side Filters */}
            <div className="flex flex-wrap gap-3">

              {/* Role Filter */}
              <div className="gap-2">
                <label className="text-sm font-medium text-gray-600 p-1">Role</label>
                <select
                  className="mt-1 px-3 py-2 border rounded-lg min-w-[140px]"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="Writer">Writer</option>
                  <option value="Editor">Editor</option>
                </select>
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

        {/* new */}
        <div className="bg-white datatable-container md:mt-4">

          <div className="table-scroll-container" id="datatable">
            <DataTable
              className="mt-2 md:mt-8"
              value={data}
              paginator
              // rows={rows}
              // first={(page - 1) * rows}
              // onPage={onPageChange}
              // totalRecords={totalRecords}
              rowsPerPageOptions={[10, 25, 50, 100]}
              // globalFilter={globalFilter}
              showGridlines
              resizableColumns
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
              paginatorClassName="custom-paginator"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            // loading={loading}
            >

              {/* Render only selected columns */}
              {columns.map((col, index) => (
                <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  body={col.body}
                  style={col.style}
                />
              ))}
            </DataTable>
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
                <p className="text-2xl md:text-3xl font-medium">Add Role</p>
                <div className="mt-2 md:mt-8 flex justify-between items-center ">
                  <div className="">
                    <label
                      htmlFor="roleName"
                      className="block text-[15px] md:text-md font-medium mb-2 mt-3"
                    >
                      Role Name <span className="text-red-500">*</span>
                    </label>

                  </div>
                  <div className="w-[60%] md:w-[50%]">
                    <input
                      type="text"
                      id="role_name"
                      value={roleName}
                      placeholder="Enter role name"
                      onChange={(e) => {
                        setRoleName(e.target.value);
                        setFormErrors({ ...formErrors, roleName: "" });
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                    />

                    {formErrors.roleName && (
                      <p className="text-red-500 text-sm mb-4 mt-1">{formErrors.roleName}</p>
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
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Select a status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>

                    {formErrors.status && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.status}</p>
                    )}

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
                    onClick={handleAddSubmit}
                    className="bg-[#067fc4] hover:bg-[#2d93cf] text-white px-4 md:px-5 py-2 font-semibold rounded-full"
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
                <p className="text-2xl md:text-3xl font-medium">Edit Roles</p>

                <div className="mt-10  rounded-lg ">
                  <div className="bg-white  rounded-xl w-full">

                    <div className="mt-8 flex justify-between items-center">
                      <label className="block text-[15px] md:text-md font-medium mb-2">
                        Role Name <span className="text-red-500">*</span>
                      </label>
                      <div className="w-[60%] md:w-[50%]">
                        <input
                          type="text"
                          placeholder="Enter role name"
                          value={editRoleName}
                          onChange={(e) => {
                            setEditRoleName(e.target.value);
                            setFormErrors({ ...formErrors, editRoleName: "" });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {formErrors.editRoleName && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.editRoleName}</p>
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
                          className="w-full px-3 py-2 border rounded-lg"
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
        {viewModalOpen && viewRole && (
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
                Role Details
              </h2>

              <div className="space-y-4 text-sm text-gray-700">

                {/* Name */}
                <div className="flex justify-between ">
                  <span className="font-medium">Role Name</span>
                  <span>{viewRole.role_name}</span>
                </div>


                {/* Status */}
                <div className="flex justify-between ">
                  <span className="font-medium">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                              ${viewRole.status === 1 || viewRole.status === "1"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {viewRole.status === 1 || viewRole.status === "1"
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

export default Roles_Mainbar;

