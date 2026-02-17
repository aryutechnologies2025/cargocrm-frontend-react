import React, { useState } from "react";
import ReactDOM from "react-dom";
import { TfiPencilAlt } from "react-icons/tfi";
import ReactDOMServer from "react-dom/server";
import { RiDeleteBin6Line } from "react-icons/ri";
import aryu_logo from "../../assets/aryu_logo.svg";
import { createRoot } from "react-dom/client";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
DataTable.use(DT);

const SystemSetting_detail = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedSystem, setSelectedSystem] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState("");
      const [logoPreview, setLogoPreview] = useState("");
        const [settings, setSettings] = useState({
    admin_email: "",
    gst_number: "",
    address: "",
  });

  // const roles = [
  //   { id: 1, name: "Writer" },
  //   { id: 2, name: "Reviewer" },
  // ];

  // Open and close modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeAddModal = () => {
    setIsAnimating(false);
    setErrors({});
    setTimeout(() => setIsAddModalOpen(false), 250);
  };

  const openEditModal = (row) => {
    console.log("row", row);
    setSelectedSystem(row);
    setIsEditModalOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const columns = [
    {
      title: "Sno",
      data: "Sno",
    },
    {
      title: "Company",
      data: "company",
    },
    {
      title: "Name",
      data: "name",
    },
    {
      title: "Email",
      data: "email",
    },
    {
      title: "Phone Number",
      data: "phone_no",
    },
    {
      title: "Website URL",
      data: "website_url",
    },
    {
      title: "Logo",
      data: "logo",
    },
    {
      title: "Instagram",
      data: "instagram",
    },
    {
      title: "Facebook",
      data: "facebook",
    },
    {
      title: "Youtube",
      data: "youtube"
    },
    {
      title: "Terms Condition",
      data: "terms_condition",
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
                  <TfiPencilAlt
                    className="cursor-pointer "
                    onClick={() => {
                      openEditModal(
                        row._id,
                        row.company,
                        row.name,
                        row.email,
                        row.phone_no,
                        row.website_url,
                        row.logo,
                        row.instagram,
                        row.youtube,
                        row.facebook,
                        row.linkedin,
                        row.terms_condition,
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
      company: "Aryu",
      name: "Barbie",
      email: "barbie@email.com",
      phone_no: "8596253614",
      website_url: "barbie.com",
      logo: "BARBIE",
      instagram: "barbie_21",
      youtube: "barbie page",
      facebook: "barbie_021",
      linkedin: "barbie_123",
      terms_condition: "condition",
      status: 0,
    },
    {
      Sno: 2,
      company: "Aryu",
      name: "Barbie",
      email: "barbie@email.com",
      phone_no: "8596253614",
      website_url: "barbie.com",
      logo: "BARBIE",
      instagram: "barbie_21",
      youtube: "barbie page",
      facebook: "barbie_021",
      linkedin: "barbie_123",
      terms_condition: "condition",
      status: 1,
    },
    {
      Sno: 3,
      company: "Aryu",
      name: "Barbie",
      email: "barbie@email.com",
      phone_no: "8596253614",
      website_url: "barbie.com",
      logo: "BARBIE",
      instagram: "barbie_21",
      youtube: "barbie page",
      facebook: "barbie_021",
      linkedin: "barbie_123",
      terms_condition: "condition",
      status: 1,
    },
  ];

  return (
    <div className="bg-gray-100 flex flex-col justify-between w-screen min-h-screen px-5 pt-2 md:pt-4">
      <div>
        <Mobile_Sidebar />
        <div className="flex  gap-2 mt-2 md:mt-0 items-center">
          <p
            className="text-sm text-gray-500"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <p>{">"}</p>

          <p className="text-sm md:text-md text-[#057fc4]">System Setting</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-3 md:p-6 mt-2 md:mt-4">
          <h2 className="text-2xl font-medium mb-6">General Setting</h2>

          <div className="flex flex-wrap gap-y-5 gap-x-14 md:mt-5">  
            
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label
                htmlFor="adminemail"
                className="block text-sm font-medium text-gray-700"
              >
                Company
              </label>
              <input
                type="text"
                name="company"
                value={settings.admin_email}
                // onChange={handleChange}
                placeholder="Enter Email"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label
                htmlFor="GST"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={settings.gst_number}
                // onChange={handleChange}
                placeholder="Enter GST Number"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={settings.address}
                // onChange={handleChange}
                placeholder="Enter Address"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="number"
                name="number"
                value={settings.address}
                // onChange={handleChange}
                placeholder="Enter Address"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Website URL
              </label>
              <input
                type="url"
                name="website"
                value={settings.address}
                // onChange={handleChange}
                placeholder="Enter Address"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Logo
              </label>
              <input
                type="file"
                name="logo"
                value={settings.address}
                // onChange={handleChange}
                placeholder="Enter Address"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Facebook
              </label>
              <input
                type="text"
                name="facebook"
                value={settings.address}
                // onChange={handleChange}
                placeholder="Enter Address"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={settings.address}
                // onChange={handleChange}
                placeholder="Enter Address"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Youtube
              </label>
              <input
                type="text"
                name="youtube"
                value={settings.address}
                // onChange={handleChange}
                placeholder="Enter Address"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                LinkedIn
              </label>
              <input
                type="text"
                name="linkedIn"
                value={settings.address}
                // onChange={handleChange}
                placeholder="Enter Address"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Terms and condition
              </label>
              <textarea
                type="text"
                name="terms"
                value={settings.address}
                // onChange={handleChange}
                placeholder="Enter Address"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>
          {/* DATE FORMAT */}
          <div>

            <hr className="border-t-2 border-gray mt-5  w-full"></hr>


            <h3 className="text-lg font-medium mb-2 mt-5">Date Format</h3>
            {["dd/MM/yyyy", "MM/dd/yyyy", "yyyy/MM/dd", "MM/dd/yy"].map(
              (format) => (
                <div key={format} className="flex gap-2 mb-2">
                  <input
                    type="radio"
                    // value={format}
                    // checked={dateFormat === format}
                    // onChange={(e) => setDateFormat(e.target.value)}
                  />
                  {/* <label>{format.toUpperCase()}</label> */}
                </div>
              )
            )}
          </div>

          {/* SAVE BUTTON */}
          {/* <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveSettings}
              disabled={saveLoading}
              className="bg-[#1ea600] text-white px-6 py-2 rounded-lg"
            >
              {saveLoading ? "Saving..." : "Save"}
            </button>
          </div> */}
        </div>




      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default SystemSetting_detail;


