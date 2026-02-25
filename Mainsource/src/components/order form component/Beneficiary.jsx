import React, { useState } from 'react'

const Beneficiary = ({ nextStep, prevStep, updateData }) => {
    const [beneficiary, setBeneficiary] = useState({
        name: "",
        phone: ""
    });

    const handleNext = () => {
        updateData("beneficiary", beneficiary);
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
                                Beneficiary Name <span className="text-red-500">*</span>
                            </label>

                        </div>
                        <div className="w-[60%] md:w-[50%]">
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter Beneficiary Name"
                                onChange={(e) => setBeneficiary({ ...beneficiary, name: e.target.value })}
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
                                onChange={(e) => setBeneficiary({ ...beneficiary, email: e.target.value })}
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
                                type="text"
                                id="name"
                                placeholder="Enter Phone Number"
                                onChange={(e) => setBeneficiary({ ...beneficiary, phone: e.target.value })}
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
                                City <span className="text-red-500">*</span>
                            </label>

                        </div>
                        <div className="w-[60%] md:w-[50%]">
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter City"
                                onChange={(e) => setBeneficiary({ ...beneficiary, city: e.target.value })}
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
                                Country <span className="text-red-500">*</span>
                            </label>

                        </div>
                        <div className="w-[60%] md:w-[50%]">
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter Country"
                                onChange={(e) => setBeneficiary({ ...beneficiary, country: e.target.value })}
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
                                onChange={(e) => setBeneficiary({ ...beneficiary, address: e.target.value })}
                                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                            />
                        </div>
                    </div>


                    <div className="flex justify-end gap-3 mt-4">
                        <button className="btn-primary mt-4 px-4 py-2 bg-[#057fc4] hover:bg-[#2d93cf] rounded-md text-white" onClick={prevStep}>Back</button>
                        <button className="btn-primary mt-4 px-4 py-2 bg-[#057fc4] hover:bg-[#2d93cf] rounded-md text-white" onClick={handleNext}>Next</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Beneficiary
