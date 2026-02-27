import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

const Beneficiary = ({ nextStep, prevStep, updateData, customerId }) => {
  console.log("benid", customerId);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [beneficiary, setBeneficiary] = useState({
    id: "",
    name: "",
    phone: "",
    city: "",
    email: "",
    country: "",
    address: "",
  });

  const validateAddForm = () => {
    const errors = {};

    if (!beneficiary.name?.trim()) {
      errors.name = "Name is required";
    }
    if (!beneficiary.phone?.trim()) {
      errors.phone = "Phone is required";
    }
    if (!beneficiary.email?.trim()) {
      errors.email = "Email is required";
    }
    if (!beneficiary.address?.trim()) {
      errors.address = "Address is required";
    }
    if (!beneficiary.city?.trim()) {
      errors.city = "City is required";
    }
    if (!beneficiary.country?.trim()) {
      errors.country = "Country is required";
    }


    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchBeneficiary = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `api/beneficiary/get-new-beneficiary-id/${customerId}`,
      );

      console.log(response.data);

      if (response.data?.success || response.data?.status) {
        const apiData = response.data.data || [];
        setBeneficiary({
          id: apiData._id,
          ...apiData,
        });
      }
    } catch (error) {
      console.error("Error fetching beneficiary:", error);
      toast.error("Failed to fetch beneficiary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchBeneficiary();
    }
  }, [customerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddForm()) return;

    try {
      const formData = {
        ...(beneficiary.id && { id: beneficiary.id }),
        name: beneficiary.name,
        email: beneficiary.email,
        phone: beneficiary.phone,
        address: beneficiary.address,
        city: beneficiary.city,
        country: beneficiary.country,
        customerId: customerId, // Use the prop directly
      };

      const response = await axiosInstance.post(
        `api/beneficiary/add-update-beneficiary`,
        formData,
      );

      if (response.data?.status || response.data?.success) {
        toast.success(beneficiary.id ? "Beneficiary updated successfully" : "Beneficiary created successfully");
        nextStep({
          id: customerId, // Pass back the customerId, not the beneficiary ID
        });
      } else {
        toast.error("Failed to create beneficiary");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating beneficiary");
    }
  };

  const handleBack = () => {
    prevStep({ id: customerId }); // Use customerId prop directly
  };

  return (
    <>
      <div className="p-4 w-full min-h-screen bg-white rounded-xl shadow">
        <div className="w-full">
          <div className="mt-2 md:mt-4 flex justify-between items-center ">
            <div className="">
              <label
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Beneficiary Name <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="w-[60%] md:w-[50%]">
              <input
                type="text"
                value={beneficiary.name}
                placeholder="Enter Beneficiary Name"
                onChange={(e) => {
                  setBeneficiary({ ...beneficiary, name: e.target.value });
                  setFormErrors((prevFormErrors) => ({ ...prevFormErrors, name: "" }));
                }}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>
          </div>
          <div className="mt-2 md:mt-4 flex justify-between items-center ">
            <div className="">
              <label
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Email <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="w-[60%] md:w-[50%]">
              <input
                type="email"
                value={beneficiary.email}
                placeholder="Enter Beneficiary Email"
                onChange={(e) => {
                  setBeneficiary({ ...beneficiary, email: e.target.value });
                  setFormErrors((prevFormErrors) => ({ ...prevFormErrors, email: "" }));
                }}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
          </div>
          <div className="mt-2 md:mt-4 flex justify-between items-center ">
            <div className="">
              <label
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Phone <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="w-[60%] md:w-[50%]">
              <input
                type="number"
                value={beneficiary.phone}
                placeholder="Enter Beneficiary Phone"
                onChange={(e) => {
                  setBeneficiary({ ...beneficiary, phone: e.target.value });
                  setFormErrors((prevFormErrors) => ({ ...prevFormErrors, phone: "" }));
                }}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="mt-2 md:mt-4 flex justify-between items-center ">
            <div className="">
              <label
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Address <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="w-[60%] md:w-[50%]">
              <textarea
                type="text"
                value={beneficiary.address}
                placeholder="Enter Beneficiary Address"
                onChange={(e) => {
                  setBeneficiary({ ...beneficiary, address: e.target.value });
                  setFormErrors((prevFormErrors) => ({ ...prevFormErrors, address: "" }));
                }}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
              {formErrors.address && (
                <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
              )}
            </div>
          </div>

          <div className="mt-2 md:mt-4 flex justify-between items-center ">
            <div className="">
              <label
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                City <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="w-[60%] md:w-[50%]">
              <input
                type="text"
                value={beneficiary.city}
                placeholder="Enter Beneficiary City"
                onChange={(e) => {
                  setBeneficiary({ ...beneficiary, city: e.target.value });
                  setFormErrors((prevFormErrors) => ({ ...prevFormErrors, city: "" }));
                }}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
              {formErrors.city && (
                <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
              )}
            </div>
          </div>

          <div className="mt-2 md:mt-4 flex justify-between items-center ">
            <div className="">
              <label
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Country <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="w-[60%] md:w-[50%]">
              <input
                type="text"
                value={beneficiary.country}
                placeholder="Enter Beneficiary Country"
                onChange={(e) => {
                  setBeneficiary({ ...beneficiary, country: e.target.value });
                  setFormErrors((prevFormErrors) => ({ ...prevFormErrors, country: "" }));
                }}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
              {formErrors.country && (
                <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
              )}
            </div>
          </div>

          {/* ... rest of the input fields (keep them as is) ... */}

          <div className="flex justify-end gap-3 mt-4">
            <button
              className="btn-primary mt-4 px-4 py-2 bg-[#057fc4] hover:bg-[#2d93cf] rounded-md text-white"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="btn-primary mt-4 px-4 py-2 bg-[#057fc4] hover:bg-[#2d93cf] rounded-md text-white"
              onClick={handleSubmit}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Beneficiary;