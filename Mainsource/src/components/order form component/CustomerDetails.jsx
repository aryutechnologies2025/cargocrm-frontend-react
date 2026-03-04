import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const CustomerDetails = ({ nextStep, updateData, customerId, isView }) => {
  console.log("CustomerDetails props:", { nextStep, updateData, customerId, isView });
  const [selectedCustomerID, setSelectedCustomerID] = useState(null);
  console.log("selectedCustomerID", selectedCustomerID)
  const id = customerId || selectedCustomerID;
  const navigate = useNavigate();
  const storedDetalis = localStorage.getItem("cargouser");
  const parsedDetails = JSON.parse(storedDetalis);
  const createdBy = parsedDetails.id;
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [beneficiaryErrors, setBeneficiaryErrors] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [customerOptions, setCustomerOptions] = useState([]);
  console.log("customerOptions", customerOptions)
  const [beneficiaryOptions, setBeneficiaryOptions] = useState([]);
  console.log("beneficiaryOptions", beneficiaryOptions)

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  console.log("selectedCustomer", selectedCustomer)
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [selectedBeneficiaryID, setSelectedBeneficiaryID] = useState(null);
  console.log("selectedBeneficiaryID", selectedBeneficiaryID)
  const [beneficiaryAutoFill, setBeneficiaryAutoFill] = useState({});
  console.log("beneficiaryAutoFill", beneficiaryAutoFill);
  const [customer, setCustomer] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postcode: "",
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
    postcode: "",
  });

 const [mode, setMode] = useState("new");


  const validateCustomerForm = () => {
    const errors = {};

    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const addressRegex = /^[A-Za-z0-9\s,.-]+$/;
    const cityCountryRegex = /^[A-Za-z\s]+$/;
    // const postcodeRegex = /^[0-9]{10}$/;


    if (!customer.name?.trim()) {
      errors.name = "Name is required";
    } else if (!nameRegex.test(customer.name)) {
      errors.name = "Name must contain only alphabets"
    }

    if (!customer.phone?.trim()) {
      errors.phone = "Phone is required";
    } else if (!phoneRegex.test(customer.phone)) {
      errors.phone = "Phone must be 10 digits";
    }

    if (!customer.email?.trim()) {
      errors.email = "Email is required";
    }

    if (!customer.address?.trim()) {
      errors.address = "Address is required";
    } else if (!addressRegex.test(!customer.address)) {
      errors.address = "Invalid address format"
    }

    if (!customer.city?.trim()) {
      errors.city = "City is required";
    } else if (!cityCountryRegex.test(!customer.city)) {
      errors.city = "City must contain only alphabets"
    }

    if (!customer.country?.trim()) {
      errors.country = "Country is required";
    } else if (!cityCountryRegex.test(!customer.country)) {
      errors.country = "Country must contain only alphabets"
    }

    // if (!customer.postcode?.trim()) {
    //   errors.postcode = "PostCode is required";
    // } 

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateBeneficiaryForm = () => {
    const errors = {};

    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const addressRegex = /^[A-Za-z0-9\s,.-]+$/;
    const cityCountryRegex = /^[A-Za-z\s]+$/;

    if (!beneficiary.name?.trim()) {
      errors.name = "Beneficiary name is required";
    } else if (!nameRegex.test(!beneficiary.name)) {
      errors.name = "Name must contain only alphabets"
    }

    if (!beneficiary.phone?.trim()) {
      errors.phone = "Beneficiary phone is required";
    }

    if (!beneficiary.email?.trim()) {
      errors.email = "Beneficiary email is required";
    }

    if (!beneficiary.address?.trim()) {
      errors.address = "Beneficiary address is required";
    } else if (!addressRegex.test(!!beneficiary.address)) {
      errors.address = "Invalid address format"
    }

    if (!beneficiary.city?.trim()) {
      errors.city = "Beneficiary city is required";
    } else if (!cityCountryRegex.test(!beneficiary.city)) {
      errors.city = "City must contain only alphabets"
    }

    if (!beneficiary.country?.trim()) {
      errors.country = "Beneficiary country is required";
    } else if (!cityCountryRegex.test(!beneficiary.country)) {
      errors.country = "Country must contain only alphabets"
    }

    // if (!beneficiary.postcode?.trim()) {
    //   errors.postcode = "Beneficiary Postcode is required";
    // }

    setBeneficiaryErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const fetchCustomerNames = async () => {
    try {
      const response = await axiosInstance.get(
        "api/customers/get-customer-name"
      );

      console.log("response customer", response);

      if (response.data?.success) {

        const customer = response.data.customer;


        const list = customer.map((data) => ({
          label: data.name,
          value: data._id,
          data: data,
        }));
       

        // console.log("list", list);

        setCustomerOptions(list);
      }
    } catch (error) {
      console.log("Customer dropdown error", error);
    }
  };

  useEffect(() => {
    fetchCustomerNames();
  }, []);
  const fetchBeneficiaryNames = async (selectedCustomerID) => {
    try {
      const response = await axiosInstance.get(
        "api/customers/get-beneficiary-name",{
          params: {
            id: selectedCustomerID
          }
        }
      );

      console.log("response beneficiary", response);

      if (response.data?.success) {

        const beneficiary = response.data.beneficiary;


        const Beneficiarylist = beneficiary.map((data) => ({
          label: data.name,
          value: data._id,
          data: data,
        }));

        // console.log("list", list);

        setBeneficiaryOptions(Beneficiarylist);
      }
    } catch (error) {
      console.log("Customer dropdown error", error);
    }
  };

  useEffect(() => {
    if (selectedCustomerID) {
      fetchBeneficiaryNames(selectedCustomerID);
    }
  }, [selectedCustomerID]);

  useEffect(() => {
  if (customerId) {
    setMode("new");
  }
}, [customerId]);

  const handleCustomerChange = async (e) => {
    const selected = e.value;

    setSelectedCustomer(selected);
    setSelectedCustomerID(selected.data.id)
    const customerData = customerOptions.find(
      (c) => c.value === selected
    )?.data;

    if (customerData) {
      setCustomer({
        id: customerData._id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        country: customerData.country,
        postcode: customerData.postcode,
      });

      fetchBeneficiaries(selected);
    }
  };

  const handleBeneficiaryChange = (e) => {
    const selected = e.value;
    setSelectedBeneficiary(selected);
    setSelectedBeneficiaryID(selected.data.id)

    const beneficiaryData = beneficiaryOptions.find(
      (b) => b.value === selected
    )?.data;

    if (beneficiaryData) {
      setBeneficiary({
        id: beneficiaryData._id,
        name: beneficiaryData.name,
        email: beneficiaryData.email,
        phone: beneficiaryData.phone,
        address: beneficiaryData.address,
        city: beneficiaryData.city,
        country: beneficiaryData.country,
        postcode: beneficiaryData.postcode,
      });
    }
  };

  const fetchBeneficiaries = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/customers/get-beneficiary-details",
        {
          params: {
            id: selectedBeneficiaryID,
          },
        }
      );

      console.log("Response beneficiary:", response.data);
      setBeneficiaryAutoFill(response.data.beneficiary);
      return response.data;
    } catch (error) {
      console.error("Beneficiary dropdown error:", error?.response?.data || error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (selectedBeneficiaryID) {
      fetchBeneficiaries();
    }
  }, [selectedBeneficiaryID]);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/customers/view-customerss/${id || selectedCustomerID}`);

      if (response.data?.success || response.data?.status) {
        const apiData = response.data.data || [];
        setCustomer({
          id: apiData._id,
          ...apiData
        });


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
    // // If mode is "existing" and a customer is selected, use the selected customer's ID
    // if (mode === "existing" && selectedCustomer) {
    //   const selectedCustomerId = selectedCustomer.value;
      
    //   // Create beneficiary with the selected customer ID
    //   await handleBeneficiarySubmit(selectedCustomerId);
    //   return;
    // }

    // For "new" mode or when no customer is selected, create new customer
    const formData = {
      ...(customer.id && { id: customer.id }),
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      country: customer.country,
      postcode: customer.postcode,
      created_by: createdBy,
      mode: mode
    };

    const response = await axiosInstance.post(
      `api/customers/create-customerss`,
      formData
    );

    console.log("response customer", response);

    if (response.data?.status || response.data?.success) {
      const customerResponseData = response.data.data;
      
      // Create beneficiary with the newly created customer ID
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
    // Prepare beneficiary data
    let beneficiaryData = {
      name: beneficiary.name,
      email: beneficiary.email,
      phone: beneficiary.phone,
      address: beneficiary.address,
      city: beneficiary.city,
      country: beneficiary.country,
      postcode: beneficiary.postcode,
      customerId: customerId,
      mode: mode
    };

    // If an existing beneficiary is selected in "existing" mode, include its ID
    if (mode === "existing" && selectedBeneficiary) {
      beneficiaryData.id = selectedBeneficiary.value;
    } else if (beneficiary.id) {
      beneficiaryData.id = beneficiary.id;
    }

    const response = await axiosInstance.post(
      `api/beneficiary/add-update-beneficiary`,
      beneficiaryData
    );
    
    console.log("Beneficiary add response:", response);

    if (response.data?.status || response.data?.success) {
      // Proceed to next step with customer ID and beneficiary ID
      nextStep({
        id: customerId,
        beneficiaryId: response.data.data._id
      });
      
      toast.success("Beneficiary saved successfully");
    } else {
      toast.error("Failed to create beneficiary");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Error creating beneficiary");
  }
};

  // const handleCustomerSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateCustomerForm()) return;

  //   try {
  //     const formData = {
  //       ...(customer.id && { id: customer.id }),
  //       name: customer.name,
  //       email: customer.email,
  //       phone: customer.phone,
  //       address: customer.address,
  //       city: customer.city,
  //       country: customer.country,
  //       postcode: customer.postcode,
  //       created_by: createdBy,
  //       mode: mode
  //     };

  //     const response = await axiosInstance.post(
  //       `api/customers/create-customerss`,
  //       formData
  //     );

  //     if (response.data?.status || response.data?.success) {
  //       const customerResponseData = response.data.data;

  //       if (mode === "existing" && selectedCustomer) {
  //         await handleBeneficiarySubmit(selectedCustomer.value);
  //         return;
  //       }
  //       // After customer is saved, save beneficiary
  //       await handleBeneficiarySubmit(customerResponseData._id);

  //       if (id) {
  //         toast.success("Customer updated successfully");
  //       } else {
  //         toast.success("Customer created successfully");
  //       }
  //     } else {
  //       toast.error("Failed to create customer");
  //     }
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Error creating customer");
  //   }
  // };

  // const handleBeneficiarySubmit = async (customerId, customerResponseData) => {
  //   if (!validateBeneficiaryForm()) return;

  //   try {
  //     const formData = {
  //       ...(beneficiary.id && { id: beneficiary.id }),
  //       name: beneficiary.name,
  //       email: beneficiary.email,
  //       phone: beneficiary.phone,
  //       address: beneficiary.address,
  //       city: beneficiary.city,
  //       country: beneficiary.country,
  //       postcode: beneficiary.postcode,
  //       customerId: customerId || customerResponseData._id,
  //     };

  //     const response = await axiosInstance.post(
  //       `api/beneficiary/add-update-beneficiary`,
  //       formData
  //     );
  //     console.log("Beneficiary add response:", response);


  //     if (response.data?.status || response.data?.success) {
  //       // Proceed to next step after both customer and beneficiary are saved
  //       nextStep({
  //         id: customerId,
  //         beneficiaryId: response.data.data._id
  //       });
  //       if (mode === "existing" && selectedBeneficiary) {
  //         nextStep({
  //           id: customerId,
  //           beneficiaryId: selectedBeneficiary.value
  //         });
  //         return;
  //       }
  //     } else {
  //       toast.error("Failed to create beneficiary");
  //     }
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Error creating beneficiary");
  //   }
  // };

  return (
    <>
      <div className="p-4 gap-3 flex flex-col flex-wrap md:flex-nowrap w-full min-h-screen bg-white rounded-xl shadow">

        {/* <div className="flex justify-end">
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
        </div> */}
        {!isView && (
        <div className="flex justify-between">
          <div className="flex gap-8 mb-4">
            

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="new"
                checked={mode === "new"}
                onChange={() => {
                  setMode("new");

                  setSelectedCustomer(null);
                  setSelectedBeneficiary(null);

                  setCustomer({
                    id: "",
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    city: "",
                    country: "",
                    postcode: "",
                  });

                  setBeneficiary({
                    id: "",
                    name: "",
                    phone: "",
                    email: "",
                    city: "",
                    country: "",
                    address: "",
                    postcode: "",
                  });
                }}
              />
              New
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="existing"
                checked={mode === "existing"}
                onChange={() => {
                  setMode("existing");
                }}
              />
              Existing
            </label>
          </div>
        </div>
        )}


        <div className="flex flex-wrap md:flex-nowrap w-full gap-3">

          {/* Customer Section */}
          <div className="w-full md:w-[50%] h-1/2 p-4 border border-[#057fc4] rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 text-[#057fc4]">Shipper Details</h3>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Name <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                {mode === "existing" ? (
                  <Dropdown
                    value={selectedCustomer}
                    options={customerOptions}
                    onChange={handleCustomerChange}
                    placeholder="Select Customer"
                    className="w-full border rounded-lg"
                  />
                ) : (
                  <input
                    type="text"
                    value={customer.name}
                    placeholder="Enter Name"
                    onChange={(e) => {
                      setCustomer({ ...customer, name: e.target.value });
                      setFormErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
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

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  PostCode <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="number"
                  value={customer.postcode}
                  placeholder="Enter PostCode"
                  onChange={(e) => {
                    setCustomer({ ...customer, postcode: e.target.value });
                    setFormErrors((prev) => ({ ...prev, postcode: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {/* {formErrors.postcode && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.postcode}</p>
                )} */}
              </div>
            </div>
          </div>


          {/* Beneficiary Section */}
          <div className="w-full md:w-[50%] h-1/2 p-4 border border-[#057fc4] rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 text-[#057fc4]">Consingee Details</h3>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Name <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                {mode === "existing" ? (
                  <Dropdown
                    value={selectedBeneficiary}
                    options={beneficiaryOptions}
                    onChange={handleBeneficiaryChange}
                    placeholder="Select Beneficiary"
                    className="w-full border rounded-lg"
                  />
                ) : (
                  <input
                    type="text"
                    value={beneficiary.name}
                    placeholder="Enter Name"
                    onChange={(e) => {
                      setBeneficiary({ ...beneficiary, name: e.target.value });
                      setBeneficiaryErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
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
                  value={beneficiary.email || beneficiaryAutoFill?.email || ""}
                  placeholder="Enter Email"
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
                  Phone Number <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="number"
                  value={beneficiary.phone || beneficiaryAutoFill?.phone || ""}
                  placeholder="Enter Phone"
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
                  value={beneficiary.address || beneficiaryAutoFill?.address || ""}
                  placeholder="Enter Address"
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
                  value={beneficiary.city || beneficiaryAutoFill?.city || ""}
                  placeholder="Enter City"
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
                  value={beneficiary.country || beneficiaryAutoFill?.country || ""}
                  placeholder="Enter Country"
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

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  PostCode <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="number"
                  value={beneficiary.postcode || beneficiaryAutoFill?.postcode || ""}
                  placeholder="Enter PostCode"
                  onChange={(e) => {
                    setBeneficiary({ ...beneficiary, postcode: e.target.value });
                    setBeneficiaryErrors((prev) => ({ ...prev, postcode: "" }));
                  }}
                  className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                />
                {beneficiaryErrors.postcode && (
                  <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.postcode}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4 bg-white p-4 ">
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