import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { InputText } from "primereact/inputtext";

const CustomerDetails = ({ nextStep, updateData, customerId }) => {
  const id = customerId;
  const navigate = useNavigate();
  const storedDetalis = localStorage.getItem("cargouser");
  const parsedDetails = JSON.parse(storedDetalis);
  const createdBy = parsedDetails.id;
  
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [beneficiaryErrors, setBeneficiaryErrors] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    created_by: ""
  });
  
  const [beneficiary, setBeneficiary] = useState({
    id: "",
    name: "",
    phone: "",
    city: "",
    email: "",
    country: "",
    address: "",
  });

  const validateCustomerForm = () => {
    const errors = {};

    if (!customer.name?.trim()) {
      errors.name = "Name is required";
    }
    if (!customer.phone?.trim()) {
      errors.phone = "Phone is required";
    }
    if (!customer.email?.trim()) {
      errors.email = "Email is required";
    }
    if (!customer.address?.trim()) {
      errors.address = "Address is required";
    }
    if (!customer.city?.trim()) {
      errors.city = "City is required";
    }
    if (!customer.country?.trim()) {
      errors.country = "Country is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateBeneficiaryForm = () => {
    const errors = {};

    if (!beneficiary.name?.trim()) {
      errors.name = "Beneficiary name is required";
    }
    if (!beneficiary.phone?.trim()) {
      errors.phone = "Beneficiary phone is required";
    }
    if (!beneficiary.email?.trim()) {
      errors.email = "Beneficiary email is required";
    }
    if (!beneficiary.address?.trim()) {
      errors.address = "Beneficiary address is required";
    }
    if (!beneficiary.city?.trim()) {
      errors.city = "Beneficiary city is required";
    }
    if (!beneficiary.country?.trim()) {
      errors.country = "Beneficiary country is required";
    }

    setBeneficiaryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/customers/view-customerss/${id}`);

      if (response.data?.success || response.data?.status) {
        const apiData = response.data.data || [];
        setCustomer({
          id: apiData._id,
          ...apiData
        });
        
        // If customer has associated beneficiary, fetch it
        if (apiData.beneficiaryId) {
          fetchBeneficiary(apiData.beneficiaryId);
        }
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Failed to fetch customer");
    } finally {
      setLoading(false);
    }
  };

  const fetchBeneficiary = async () => {
    try {
      const response = await axiosInstance.get(
        `api/beneficiary/get-new-beneficiary-id/${id}`
      );

      console.log("response ben", response);

      if (response.data?.success || response.data?.status) {
        const apiData = response.data.data || [];
        setBeneficiary({
          id: apiData._id,
          ...apiData,
        });
      }
    } catch (error) {
      console.error("Error fetching beneficiary:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomer();
      fetchBeneficiary();
    }
  }, [id]);

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!validateCustomerForm()) return;

    try {
      const formData = {
        ...(customer.id && { id: customer.id }),
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        country: customer.country,
        created_by: createdBy
      };

      const response = await axiosInstance.post(
        `api/customers/create-customerss`,
        formData
      );

      if (response.data?.status || response.data?.success) {
        const customerResponseData = response.data.data;
        
        // After customer is saved, save beneficiary
        await handleBeneficiarySubmit(customerResponseData._id);
        
        if (id) {
          toast.success("Customer updated successfully");
        } else {
          toast.success("Customer created successfully");
        }
      } else {
        toast.error("Failed to create customer");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating customer");
    }
  };

  const handleBeneficiarySubmit = async (customerId) => {
    if (!validateBeneficiaryForm()) return;

    try {
      const formData = {
        ...(beneficiary.id && { id: beneficiary.id }),
        name: beneficiary.name,
        email: beneficiary.email,
        phone: beneficiary.phone,
        address: beneficiary.address,
        city: beneficiary.city,
        country: beneficiary.country,
        customerId: customerId,
      };

      const response = await axiosInstance.post(
        `api/beneficiary/add-update-beneficiary`,
        formData
      );

      if (response.data?.status || response.data?.success) {
        // Proceed to next step after both customer and beneficiary are saved
        nextStep({
          id: customerId,
          beneficiaryId: response.data.data._id
        });
      } else {
        toast.error("Failed to create beneficiary");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating beneficiary");
    }
  };

  return (
    <>
      <div className="p-4 gap-3 flex flex-col flex-wrap md:flex-nowrap w-full min-h-screen bg-white rounded-xl shadow">
        
        <div className="flex justify-end">
          <div className="relative w-full md:w-64">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search Details"
              className="w-full pl-10 pr-3 py-2 rounded-md text-sm border border-[#D9D9D9] 
               focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
            />
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap w-full gap-3">
          {/* Customer Section */}
          <div className="w-full md:w-[50%] h-1/2 p-4 border border-[#c1c1c1] rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 text-[#057fc4]">Customer Details</h3>
            
            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Customer Name <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="text"
                  value={customer.name}
                  placeholder="Enter Customer Name"
                  onChange={(e) => {
                    setCustomer({ ...customer, name: e.target.value });
                    setFormErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Phone Number <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="number"
                  value={customer.phone}
                  placeholder="Enter Phone Number"
                  onChange={(e) => {
                    setCustomer({ ...customer, phone: e.target.value });
                    setFormErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Email <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="email"
                  value={customer.email}
                  placeholder="Enter Email"
                  onChange={(e) => {
                    setCustomer({ ...customer, email: e.target.value });
                    setFormErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Address <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <textarea
                  value={customer.address}
                  placeholder="Enter Address"
                  onChange={(e) => {
                    setCustomer({ ...customer, address: e.target.value });
                    setFormErrors((prev) => ({ ...prev, address: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {formErrors.address && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  City <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="text"
                  value={customer.city}
                  placeholder="Enter City"
                  onChange={(e) => {
                    setCustomer({ ...customer, city: e.target.value });
                    setFormErrors((prev) => ({ ...prev, city: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {formErrors.city && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Country <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="text"
                  value={customer.country}
                  placeholder="Enter Country"
                  onChange={(e) => {
                    setCustomer({ ...customer, country: e.target.value });
                    setFormErrors((prev) => ({ ...prev, country: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {formErrors.country && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
                )}
              </div>
            </div>
          </div>

          {/* Beneficiary Section */}
          <div className="w-full md:w-[50%] h-1/2 p-4 border border-[#c1c1c1] rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 text-[#057fc4]">Beneficiary Details</h3>
            
            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Beneficiary Name <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="text"
                  value={beneficiary.name}
                  placeholder="Enter Beneficiary Name"
                  onChange={(e) => {
                    setBeneficiary({ ...beneficiary, name: e.target.value });
                    setBeneficiaryErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {beneficiaryErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.name}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Email <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="email"
                  value={beneficiary.email}
                  placeholder="Enter Beneficiary Email"
                  onChange={(e) => {
                    setBeneficiary({ ...beneficiary, email: e.target.value });
                    setBeneficiaryErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {beneficiaryErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.email}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Phone <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="number"
                  value={beneficiary.phone}
                  placeholder="Enter Beneficiary Phone"
                  onChange={(e) => {
                    setBeneficiary({ ...beneficiary, phone: e.target.value });
                    setBeneficiaryErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {beneficiaryErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Address <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <textarea
                  value={beneficiary.address}
                  placeholder="Enter Beneficiary Address"
                  onChange={(e) => {
                    setBeneficiary({ ...beneficiary, address: e.target.value });
                    setBeneficiaryErrors((prev) => ({ ...prev, address: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {beneficiaryErrors.address && (
                  <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.address}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  City <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="text"
                  value={beneficiary.city}
                  placeholder="Enter Beneficiary City"
                  onChange={(e) => {
                    setBeneficiary({ ...beneficiary, city: e.target.value });
                    setBeneficiaryErrors((prev) => ({ ...prev, city: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {beneficiaryErrors.city && (
                  <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.city}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Country <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="text"
                  value={beneficiary.country}
                  placeholder="Enter Beneficiary Country"
                  onChange={(e) => {
                    setBeneficiary({ ...beneficiary, country: e.target.value });
                    setBeneficiaryErrors((prev) => ({ ...prev, country: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {beneficiaryErrors.country && (
                  <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.country}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4 bg-white p-4 sticky bottom-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Back
          </button>
          <button
            onClick={handleCustomerSubmit}
            className="px-6 py-2 rounded-lg bg-[#057fc4] text-white hover:bg-[#046aa4]"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerDetails;