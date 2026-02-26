import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OrderDetails = ({ prevStep, handleSubmit, customerId }) => {
  const [loading, setLoading] = useState(false);
  const [packed, setPacked] = useState({
    id: "",
    cargo_mode: "",
    packed: ""
  });
  const navigate = useNavigate();
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/orders/get-new-beneficiary-id/${customerId}`);

      if (response.data?.success || response.data?.status) {
        const apiData = response.data.data || {};
        setPacked({
          id: apiData._id || "",
          cargo_mode: apiData.cargo_mode || "",
          packed: apiData.packed || ""
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchOrder();
    }
  }, [customerId]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = {
        ...(packed.id && { id: packed.id }),
        customerId: customerId,
        cargo_mode: packed.cargo_mode,
        packed: packed.packed,
      };

      const response = await axiosInstance.post(
        `api/orders/add-update-order`,
        formData
      );

      if (response.data?.status || response.data?.success) {
        toast.success(packed.id ? "Order updated successfully" : "Order created successfully");
        handleOrderPage();
      } else {
        toast.error("Failed to create order");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating order");
    }
  };

  const handleOrderPage = () => {
    navigate("/order");
  };

  const handleBack = () => {
    prevStep({ id: customerId });
  };

  const handleRadioChange = (value) => {
    setPacked({ ...packed, packed: value });
  };

  return (
    <>
      <div className="p-4 w-full min-h-screen bg-white rounded-xl shadow">
        <div className='w-full'>
          <div className="mt-2 md:mt-4 flex justify-between items-center ">
            <div className="">
              <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                Cargo Mode <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="w-[60%] md:w-[50%]">
              <select 
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                value={packed.cargo_mode || ""}
                onChange={(e) => setPacked({ ...packed, cargo_mode: e.target.value })}
              >
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
                    checked={packed.packed === "Yes"}
                    onChange={(e) => handleRadioChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="packed"
                    value="No"
                    checked={packed.packed === "No"}
                    onChange={(e) => handleRadioChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  No
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <button 
              className="btn-primary mt-4 px-4 py-2 bg-[#057fc4] hover:bg-[#2d93cf] rounded-md text-white" 
              onClick={handleBack}
              type="button"
            >
              Back
            </button>

            <button
              className="btn-primary mt-4 px-4 py-2 bg-[#057fc4] hover:bg-[#2d93cf] rounded-md text-white"
              onClick={handleFormSubmit}
              type="button"
              disabled={loading}
            >
              {loading ? "Submitting..." : (packed.id ? "Update Order" : "Submit Order")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails;