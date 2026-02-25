import React, { useState } from "react";

const CustomerDetails = ({ nextStep, updateData }) => {

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: ""
  });


  const handleNext = () => {
    updateData("customer", customer);
    nextStep();
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
                placeholder="Enter Customer Name"
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
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
                placeholder="Enter Phone Number"
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
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
                placeholder="Enter Email"
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
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
                placeholder="Enter Address"
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleNext}
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
