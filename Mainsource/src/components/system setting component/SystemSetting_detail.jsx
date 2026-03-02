import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import Mobile_Sidebar from "../Mobile_Sidebar";
import Footer from "../Footer";

const SystemSetting_detail = () => {
  const navigate = useNavigate();
  const [setting, setSetting] = useState({});
  const [loading, setLoading] = useState(false);
  const [teamAndCondition, setTeamAndCondition] = useState("");
  const [dateFormat, setDateFormat] = useState("dd/MM/yyyy");
  // Remove dateFormat and other fields since they're not in the backend model

  const fetchSetting = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/settings/view-setting`);
      console.log("response", response);
      
      // Check if response.data exists and has data
      if (response.data && response.data.settings) {
        const apiData = response.data.settings;
        setSetting(apiData);
        
        // Only set teamAndCondition since that's the only field in the model
        setTeamAndCondition(apiData.teamAndCondition || "");
      } else if (response.data && response.data[0]) {
        // Alternative response structure
        const apiData = response.data[0];
        setSetting(apiData);
        setTeamAndCondition(apiData.teamAndCondition || "");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSetting();
  }, []);

  const handleDateFormatChange = (e) => {
    const value = e.target.value;
    setDateFormat(value);
    setFormData(prev => ({
      ...prev,
      dateFormat: value
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create data object - only send teamAndCondition as per backend model
      const submitData = {
        teamAndCondition: teamAndCondition
      };

      console.log("Submitting data:", submitData);

      const response = await axiosInstance.post(
        `api/settings/create-setting`,
        submitData,
        {
          headers: {
            'Content-Type': 'application/json' // Using JSON since no file uploads
          }
        }
      );

      console.log("Save response:", response);

      if (response.data) {
        toast.success(response.data.message || "Settings saved successfully");
        fetchSetting(); // Refresh data
      } else {
        toast.error("Failed to save settings");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      
      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).join(", ");
        toast.error(errorMessages);
      } else {
        toast.error(err.response?.data?.message || "Failed to save settings");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col justify-between w-screen min-h-screen px-5 pt-2 md:pt-4">
      <div>
        <Mobile_Sidebar />
        <div className="flex gap-2 mt-2 md:mt-0 items-center">
          <p
            className="text-sm text-gray-500 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </p>
          <span className="text-gray-500">›</span>
          <p className="text-sm md:text-md text-[#057fc4]">System Setting</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-3 md:p-6 mt-2 md:mt-4">
          <h2 className="text-2xl font-medium mb-6">System Setting</h2>

          {loading && <div className="text-center py-4">Loading...</div>}
<div className="flex flex-wrap gap-y-5 gap-x-14 md:mt-5">
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                // value={formData.name}
                // onChange={handleInputChange}
                placeholder="Enter Name"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                // value={formData.email}
                // onChange={handleInputChange}
                placeholder="Enter Email"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label htmlFor="phone_no" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_no"
                name="phone_no"
                // value={formData.phone_no}
                // onChange={handleInputChange}
                placeholder="Enter Phone Number"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label htmlFor="website_url" className="block text-sm font-medium text-gray-700">
                Website URL
              </label>
              <input
                type="url"
                id="website_url"
                name="website_url"
                // value={formData.website_url}
                // onChange={handleInputChange}
                placeholder="Enter Website URL"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                Logo
              </label>
              <input
                type="file"
                id="logo"
                name="logo"
                // onChange={handleInputChange}
                accept="image/*"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                Facebook
              </label>
              <input
                type="text"
                id="facebook"
                name="facebook"
                // value={formData.facebook}
                // onChange={handleInputChange}
                placeholder="Enter Facebook URL"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                // value={formData.instagram}
                // onChange={handleInputChange}
                placeholder="Enter Instagram URL"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                Youtube
              </label>
              <input
                type="text"
                id="youtube"
                name="youtube"
                // value={formData.youtube}
                // onChange={handleInputChange}
                placeholder="Enter YouTube URL"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-[40%]">
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                // value={formData.linkedin}
                // onChange={handleInputChange}
                placeholder="Enter LinkedIn URL"
                className="border w-full border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>

          {/* DATE FORMAT */}
          <div>
            <hr className="border-t-2 border-gray mt-5 w-full"></hr>
            <h3 className="text-lg font-medium mb-2 mt-5">Date Format</h3>
            {["dd/MM/yyyy", "MM/dd/yyyy", "yyyy/MM/dd", "MM/dd/yy"].map(
              (format) => (
                <div key={format} className="flex gap-2 mb-2">
                  <input
                    type="radio"
                    id={`format-${format}`}
                    name="dateFormat"
                    // value={format}
                    checked={dateFormat === format}
                    onChange={handleDateFormatChange}
                  />
                  <label htmlFor={`format-${format}`}>{format}</label>
                </div>
              ),
            )}
          </div>

          <hr className="border-t-2 border-gray mt-5 w-full"></hr>
          {/* Only show the Terms and Condition field as per backend model */}
          <div className="flex flex-col gap-2 mt-5 w-full md:w-[60%]">
            <label htmlFor="teamAndCondition" className="block text-sm font-medium text-gray-700">
              Terms and Condition
            </label>
            <textarea
              id="teamAndCondition"
              name="teamAndCondition"
              value={teamAndCondition}
              onChange={(e) => setTeamAndCondition(e.target.value)}
              placeholder="Enter Terms and Conditions"
              rows="6"
              className="border w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#067fc4] focus:border-transparent"
            />
           
          </div>

          {/* Display current setting if exists */}
          {setting && setting._id && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Last updated:</span> {new Date(setting.updatedAt || setting.createdAt).toLocaleString()}
              </p>
            </div>
          )}

          {/* SAVE BUTTON */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-[#067fc4] hover:bg-[#2d93cf] text-white px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default SystemSetting_detail;