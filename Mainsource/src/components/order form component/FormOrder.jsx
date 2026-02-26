import React, { useState } from "react";
import CustomerDetails from "./CustomerDetails";
import Beneficiary from "./Beneficiary";
import ParcelDetails from "./ParcelDetails";
import OrderDetails from "./OrderDetails";
import Mobile_Sidebar from "../Mobile_Sidebar";
import { useLocation } from "react-router-dom";
const FormOrder = () => {

    const [step, setStep] = useState(1);
    const location = useLocation();
      const {path } = location.state || {};
      console.log("location.state:", location.state);
    const [customerId, setCustomerId] = useState(path?.customerId || null);

    const [formData, setFormData] = useState({
        customer: {},
        beneficiary: {},
        parcel: {},
        order: {}
    });

    // next step
    const nextStep = ({id}) =>{ setStep((prev) => prev + 1), setCustomerId(id)};
    // const nextStep = ({id = path.customerId}) => setStep((prev) => prev + 1) || setCustomerId(id);

    // previous step
    const prevStep = ({id}) => {setStep((prev) => prev - 1),setCustomerId(id)};

    // update data
    const updateData = (section, data) => {
        setFormData((prev) => ({
            ...prev,
            [section]: data
        }));
    };

    // submit
    const handleSubmit = () => {
        console.log("Final Order Data:", formData);

        // API CALL HERE
        // axios.post("/order", formData)
    };

    return (
        <div className="p-4 w-full min-h-screen bg-white rounded-xl shadow">
            <div>
                <Mobile_Sidebar />
                <div className="flex  gap-2  md:mt-0 ms-5 items-center">
                    <p
                        className="text-sm text-gray-500"
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </p>
                    <p>{">"}</p>

                    <p className="text-sm md:text-md text-[#057fc4]">Order From</p>
                </div>

                {/* STEP HEADER */}
                {/* <div className="flex justify-between mb-6 mt-5 p-5 ">
        {[1,2,3,4].map((s)=>(
          <div key={s}
            className={`w-8 h-8 rounded-full flex items-center justify-center
            ${step>=s ? "bg-[#057fc4] text-white":"bg-gray-300"}`}>
            {s}
          </div>
        ))}
      </div> */}

                {/* STEP HEADER */}
                <div className="flex items-center justify-between mb-8 mt-5 px-5">

                    {[
                        { id: 1, label: "Customer Details" },
                        { id: 2, label: "Beneficiary" },
                        { id: 3, label: "Parcel Details" },
                        { id: 4, label: "Order Details" },
                    ].map((item, index, arr) => (
                        <React.Fragment key={item.id}>

                            {/* STEP */}
                            <div className="flex flex-col items-center flex-1">

                                {/* Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                                       ${step >= item.id
                                            ? "bg-[#057fc4] text-white"
                                            : "bg-gray-300 text-black"
                                        }`}
                                >
                                    {item.id}
                                </div>

                                {/* Title */}
                                <p
                                    className={`mt-2 text-xs md:text-sm text-center font-medium
                                     ${step >= item.id ? "text-[#057fc4]" : "text-gray-400"
                                        }`}
                                >
                                    {item.label}
                                </p>
                            </div>

                            {/* LINE BETWEEN STEPS */}
                            {index !== arr.length - 1 && (
                                <div className={`flex-1 h-[2px]
                           ${step > item.id ? "bg-[#057fc4]" : "bg-gray-300"}`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* STEP BODY */}
                {step === 1 && (
                    <CustomerDetails
                        nextStep={nextStep}
                        updateData={updateData}
                        customerId={customerId}
                    />
                )}

                {step === 2 && (
                    <Beneficiary
                        nextStep={nextStep}
                        prevStep={prevStep}
                        updateData={updateData}
                        customerId={customerId}
                    />
                )}

                {step === 3 && (
                    <ParcelDetails
                        nextStep={nextStep}
                        prevStep={prevStep}
                        updateData={updateData}
                        customerId={customerId}
                    />
                )}

                {step === 4 && (
                    <OrderDetails
                        prevStep={prevStep}
                        updateData={updateData}
                        handleSubmit={handleSubmit}
                        customerId={customerId}
                    />
                )}

            </div>
        </div>
    );
};

export default FormOrder;