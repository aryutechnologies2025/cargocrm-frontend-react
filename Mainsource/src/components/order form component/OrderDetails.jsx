import React, { useState } from 'react'

const OrderDetails = ({ prevStep, handleSubmit }) => {
    const [packed, setPacked] = useState("");
  return (
    <>
      <div className="p-4 w-full min-h-screen bg-white rounded-xl shadow">
        <div className='w-full'>
          <div className="mt-2 md:mt-4 flex justify-between items-center ">
            <div className="">
              <label
                htmlFor="roleName"
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Cargo Mode <span className="text-red-500">*</span>
              </label>

            </div>
            <div className="w-[60%] md:w-[50%]">
              <select className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg" onChange={(e) => setBeneficiary({ ...beneficiary, name: e.target.value })}>
                <option value="">Select Cargo Mode</option>
                <option value="Air">Air</option>
                <option value="Sea">Sea</option>
              </select>
            </div>
          </div>

          <div className="mt-2 md:mt-8 flex justify-between items-center">
            <label className="block text-[15px] md:text-md font-medium">
              Packed <span className="text-red-500">*</span>
            </label>
            <div className="w-[60%] md:w-[50%]">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="packed"
                    value="Yes"
                    checked={packed === "Yes"}
                    onChange={(e) => {
                      setPacked(e.target.value);
                      // setFormErrors({ ...formErrors, packed: "" });
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="packed"
                    value="No"
                    checked={packed === "No"}
                    onChange={(e) => {
                      setPacked(e.target.value);
                      // setFormErrors({ ...formErrors, packed: "" });
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  No
                </label>
              </div>
              
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button className="btn-primary mt-4 px-4 py-2 bg-[#057fc4] hover:bg-[#2d93cf] rounded-md text-white" onClick={prevStep}>Back</button>

            <button
              className="btn-primary mt-4 px-4 py-2 bg-[#057fc4] hover:bg-[#2d93cf] rounded-md text-white"
              onClick={handleSubmit}
            >
              Submit Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails

