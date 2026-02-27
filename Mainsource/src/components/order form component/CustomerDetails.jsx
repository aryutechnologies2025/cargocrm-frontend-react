import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const CustomerDetails = ({ nextStep, updateData ,customerId}) => {
  const id = customerId;
  const navigate = useNavigate();
  // const location = useLocation();
  // const {path } = location.state || {};
  // console.log("location.state:", location.state);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [customer, setCustomer] = useState({
    id:"",
    name: "",
    email: "",
    phone: "",
    address: "",
    city:"",
    country:"",
  });

  const validateAddForm = () => {
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

   const fetchCustomer = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/customers/view-customerss/${id}`);

      if (response.data?.success || response.data?.status) {
        const apiData = response.data.data || [];
        setCustomer({
          id: apiData._id,
         ...apiData});

      } else {
        setCustomer([]);
      }
     
    } catch (error) {
      console.error("Error fetching orders:", error);
     
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    if(id){
    fetchCustomer();
    }
  },[id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddForm()) return;

    try {
      const formData = {
        ...(customer.id && { id: customer.id }),
        name: customer.name,
        email:customer.email,
        phone:customer.phone,
        address:customer.address,
        city:customer.city,
        country:customer.country
      };
      
      const response = await axiosInstance.post(
        `api/customers/create-customerss`,
        formData
      );
      console.log("first",response);

      if (response.data?.status || response.data?.success) {
        if(id){
          toast.success("Customer updated successfully");
        }else{
        toast.success("Customer created successfully");

        }
        nextStep({
          id: response.data.data._id ,});        
      } else {
        toast.error("Failed to create order");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating order");
    }
  };



  return (
    <>
      <div className="p-4 w-full min-h-screen bg-white rounded-xl shadow">
        <div className="w-full">
          
          <div className="mt-2 md:mt-4 flex justify-between items-center ">
            <div className="">
              <label
                htmlFor="roleName"
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Customer Name <span className="text-red-500">*</span>
              </label>

            </div>
            <div className="w-[60%] md:w-[50%]">
              <input
                type="text"
                id="name"
                value={customer.name}
                placeholder="Enter Customer Name"
                onChange={(e) => {
                  setCustomer({ ...customer, name: e.target.value });
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
                htmlFor="roleName"
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>

            </div>
            <div className="w-[60%] md:w-[50%]">
              <input
                type="number"
                id="name"
                value={customer.phone}
                placeholder="Enter Phone Number"
                onChange={(e) => {
                  setCustomer({ ...customer, phone: e.target.value });
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
                htmlFor="roleName"
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Email <span className="text-red-500">*</span>
              </label>

            </div>
            <div className="w-[60%] md:w-[50%]">
              <input
                type="email"
                id="name"
                value={customer.email}
                placeholder="Enter Email"
                onChange={(e) => {
                  setCustomer({ ...customer, email: e.target.value });
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
                htmlFor="roleName"
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Address <span className="text-red-500">*</span>
              </label>

            </div>
            <div className="w-[60%] md:w-[50%]">
              <textarea
                type="text"
                id="name"
                value={customer.address}
                placeholder="Enter Address"
                onChange={(e) => {
                  setCustomer({ ...customer, address: e.target.value });
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
                htmlFor="roleName"
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                City <span className="text-red-500">*</span>
              </label>

            </div>
            <div className="w-[60%] md:w-[50%]">
              <textarea
                type="text"
                id="city"
                value={customer.city}
                placeholder="Enter City"
                onChange={(e) => {
                  setCustomer({ ...customer, city: e.target.value });
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
                htmlFor="roleName"
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Country <span className="text-red-500">*</span>
              </label>

            </div>
            <div className="w-[60%] md:w-[50%]">
              <textarea
                type="text"
                id="country"
                value={customer.country}
                placeholder="Enter Country"
                onChange={(e) => {
                  setCustomer({ ...customer, country: e.target.value });
                  setFormErrors((prevFormErrors) => ({ ...prevFormErrors, country: "" }));
                }}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
              {formErrors.country && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
                      )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate(-1)}
              className="btn-primary mt-4 px-4 py-2 bg-[#057fc4] hover:bg-[#2d93cf] rounded-md text-white"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary mt-4 px-4 py-2 bg-[#057fc4] hover:bg-[#2d93cf] rounded-md text-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetails;
