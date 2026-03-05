import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { useLocation } from "react-router-dom";
import Mobile_Sidebar from "../Mobile_Sidebar";
const Customer_detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { path } = location.state || {};
  console.log("Received ID from location.state:", location.state);
  const id = path || {};
  console.log("Extracted ID:", id);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  const storedDetalis = localStorage.getItem("cargouser");
  const parsedDetails = JSON.parse(storedDetalis);
  const createdBy = parsedDetails.id;

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
    customerCountry: "",
    customerPostcode: "",

    beneficiaryName: "",
    beneficiaryEmail: "",
    beneficiaryPhone: "",
    beneficiaryAddress: "",
    beneficiaryCity: "",
    beneficiaryCountry: "",
    beneficiaryPostcode: "",

    piece_number: "",
    description: "",
    piece_details: [],
    tracking_number: "",
    cargo_mode: "",
    packed: "",

    created_by: createdBy,
    tracking_number: ""
  });

  const [pieceData, setPieceData] = useState([]);

  // Validation functions
  const validateForm = () => {
    const errors = {};

    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const addressRegex = /^[A-Za-z0-9\s,.-]+$/;
    const cityCountryRegex = /^[A-Za-z\s]+$/;

    if (!formData.customerName?.trim()) {
      errors.customerName = "Customer name is required";
    } else if (!nameRegex.test(formData.customerName)) {
      errors.customerName = "Name must contain only alphabets";
    }

    if (!formData.customerPhone?.trim()) {
      errors.customerPhone = "Customer phone is required";
    } else if (!phoneRegex.test(formData.customerPhone)) {
      errors.customerPhone = "Phone must be 10 digits";
    }

    if (!formData.customerEmail?.trim()) {
      errors.customerEmail = "Customer email is required";
    }

    if (!formData.customerAddress?.trim()) {
      errors.customerAddress = "Customer address is required";
    } else if (!addressRegex.test(formData.customerAddress)) {
      errors.customerAddress = "Invalid address format";
    }

    if (!formData.customerCity?.trim()) {
      errors.customerCity = "Customer city is required";
    } else if (!cityCountryRegex.test(formData.customerCity)) {
      errors.customerCity = "City must contain only alphabets";
    }

    if (!formData.customerCountry?.trim()) {
      errors.customerCountry = "Customer country is required";
    } else if (!cityCountryRegex.test(formData.customerCountry)) {
      errors.customerCountry = "Country must contain only alphabets";
    }

    if (!formData.beneficiaryName?.trim()) {
      errors.beneficiaryName = "Beneficiary name is required";
    } else if (!nameRegex.test(formData.beneficiaryName)) {
      errors.beneficiaryName = "Name must contain only alphabets";
    }

    if (!formData.beneficiaryPhone?.trim()) {
      errors.beneficiaryPhone = "Beneficiary phone is required";
    }

    if (!formData.beneficiaryEmail?.trim()) {
      errors.beneficiaryEmail = "Beneficiary email is required";
    }

    if (!formData.beneficiaryAddress?.trim()) {
      errors.beneficiaryAddress = "Beneficiary address is required";
    } else if (!addressRegex.test(formData.beneficiaryAddress)) {
      errors.beneficiaryAddress = "Invalid address format";
    }

    if (!formData.beneficiaryCity?.trim()) {
      errors.beneficiaryCity = "Beneficiary city is required";
    } else if (!cityCountryRegex.test(formData.beneficiaryCity)) {
      errors.beneficiaryCity = "City must contain only alphabets";
    }

    if (!formData.beneficiaryCountry?.trim()) {
      errors.beneficiaryCountry = "Beneficiary country is required";
    } else if (!cityCountryRegex.test(formData.beneficiaryCountry)) {
      errors.beneficiaryCountry = "Country must contain only alphabets";
    }

    if (!formData.piece_number?.trim()) {
      errors.piece_number = "Piece number is required";
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.cargo_mode) {
      errors.cargo_mode = "Cargo mode is required";
    }

    if (!formData.packed) {
      errors.packed = "Packed status is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchCustomerData = async () => {
    setFetchLoading(true);
    try {
      const response = await axiosInstance.get(`api/customers/view-customers/${id}`);
      console.log("API response for customer data:", response);
      if (response.data?.success) {
        const data = response.data.data;
        setFormData({
          customerName: data.customerName || "",
          customerEmail: data.customerEmail || "",
          customerPhone: data.customerPhone || "",
          customerAddress: data.customerAddress || "",
          customerCity: data.customerCity || "",
          customerCountry: data.customerCountry || "",
          customerPostcode: data.customerPostcode || "",

          beneficiaryName: data.beneficiaryName || "",
          beneficiaryEmail: data.beneficiaryEmail || "",
          beneficiaryPhone: data.beneficiaryPhone || "",
          beneficiaryAddress: data.beneficiaryAddress || "",
          beneficiaryCity: data.beneficiaryCity || "",
          beneficiaryCountry: data.beneficiaryCountry || "",
          beneficiaryPostcode: data.beneficiaryPostcode || "",

          piece_number: data.piece_number || "",
          description: data.description || "",
          piece_details: data.piece_details || [],

          cargo_mode: data.cargo_mode || "",
          packed: data.packed || "",

          created_by: data.created_by || createdBy,
          tracking_number: data.tracking_number || ""
        });

        if (data.piece_details && Array.isArray(data.piece_details)) {
          setPieceData(data.piece_details);
        }
      } else {
        toast.error("Failed to fetch customer data");
        navigate("/order");
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Failed to fetch customer data");
      navigate("/order");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  const handlePieceNumberChange = (e) => {
    const value = e.target.value;
    const newPieceNumber = parseInt(value) || 0;

    setFormData(prev => ({ ...prev, piece_number: value }));

    if (newPieceNumber > 0) {
      if (formData.piece_details && formData.piece_details.length > 0) {
        if (newPieceNumber > formData.piece_details.length) {
          const additionalPieces = Array(newPieceNumber - formData.piece_details.length)
            .fill(null)
            .map(() => ({
              weight: "",
              length: "",
              width: "",
              height: "",
            }));
          setPieceData([...formData.piece_details, ...additionalPieces]);
        } else if (newPieceNumber < formData.piece_details.length) {
          setPieceData(formData.piece_details.slice(0, newPieceNumber));
        } else {
          setPieceData(formData.piece_details);
        }
      } else if (pieceData.length > 0) {
        if (newPieceNumber > pieceData.length) {
          const additionalPieces = Array(newPieceNumber - pieceData.length)
            .fill(null)
            .map(() => ({
              weight: "",
              length: "",
              width: "",
              height: "",
            }));
          setPieceData([...pieceData, ...additionalPieces]);
        } else if (newPieceNumber < pieceData.length) {
          setPieceData(pieceData.slice(0, newPieceNumber));
        }
      } else {
        const newPieceData = Array(newPieceNumber)
          .fill(null)
          .map(() => ({
            weight: "",
            length: "",
            width: "",
            height: "",
          }));
        setPieceData(newPieceData);
      }
    } else {
      setPieceData([]);
    }
  };

  const handlePieceDataChange = (index, field, value) => {
    const updatedPieceData = [...pieceData];
    updatedPieceData[index] = {
      ...updatedPieceData[index],
      [field]: value
    };
    setPieceData(updatedPieceData);
    setFormData(prev => ({ ...prev, piece_details: updatedPieceData }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleRadioChange = (value) => {
    setFormData(prev => ({ ...prev, packed: value }));
    setFormErrors(prev => ({ ...prev, packed: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      piece_details: pieceData
    };
    setFormData(updatedFormData);

    if (!validateForm()) return;

    if (parseInt(formData.piece_number) > 0) {
      const isValid = pieceData.every(piece =>
        piece.weight && piece.length && piece.width && piece.height
      );

      if (!isValid) {
        toast.error("Please fill all piece dimensions");
        return;
      }
    }

    try {
      setLoading(true);

      const apiData = {
        ...updatedFormData,
        piece_details: pieceData
      };

      const response = await axiosInstance.put(`api/customers/edit-customers/${id}`, apiData);

      if (response.data?.success) {
        toast.success("Customer updated successfully");
        navigate("/order");
      } else {
        toast.error(response.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating customer:", err);
      toast.error(err.response?.data?.message || "Error updating customer");
    } finally {
      setLoading(false);
    }
  };

  // if (fetchLoading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#057fc4] mx-auto"></div>
  //         <p className="mt-4 text-gray-600">Loading customer data...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="p-2 md:p-4 gap-3 w-full min-h-screen bg-white rounded-xl shadow">
      <Mobile_Sidebar />
      <div className="flex gap-2  ms-5 items-center">
        <p
          className="text-sm text-gray-500"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </p>
        <p>{">"}</p>

        <p className="text-sm md:text-md text-[#057fc4]">Order Form</p>
      </div>
      <div className="flex justify-between items-center ms-5  mt-1 md:mt-3 ">
        <h1 className="text-xl md:text-2xl font-bold text-[#057fc4]">Edit Order Form</h1>
        <button
          onClick={() =>
            navigate(-1)
          }
          className="md:mb-4 bg-[#057fc4] text-md text-white px-3 md:px-4 py-2 rounded-2xl"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="gap-3 flex flex-col w-full bg-white rounded-xl shadow p-6">
        <div className="flex flex-wrap md:flex-nowrap w-full gap-3">
          {/* Customer Section */}
          <div className="w-full md:w-[50%] p-4 border border-[#057fc4] rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 text-[#057fc4]">Shipper Details</h3>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Name <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  placeholder="Enter Name"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
                {formErrors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.customerName}</p>
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
                  name="customerEmail"
                  value={formData.customerEmail}
                  placeholder="Enter Email"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
                {formErrors.customerEmail && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.customerEmail}</p>
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
                  name="customerPhone"
                  value={formData.customerPhone}
                  placeholder="Enter Phone Number"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
                {formErrors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.customerPhone}</p>
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
                  name="customerAddress"
                  value={formData.customerAddress}
                  placeholder="Enter Address"
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
                {formErrors.customerAddress && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.customerAddress}</p>
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
                  name="customerCity"
                  value={formData.customerCity}
                  placeholder="Enter City"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
                {formErrors.customerCity && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.customerCity}</p>
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
                  name="customerCountry"
                  value={formData.customerCountry}
                  placeholder="Enter Country"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
                {formErrors.customerCountry && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.customerCountry}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  PostCode
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="number"
                  name="customerPostcode"
                  value={formData.customerPostcode}
                  placeholder="Enter PostCode"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
              </div>
            </div>
          </div>

          {/* Beneficiary Section */}
          <div className="w-full md:w-[50%] p-4 border border-[#057fc4] rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 text-[#057fc4]">Consignee Details</h3>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Name <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="text"
                  name="beneficiaryName"
                  value={formData.beneficiaryName}
                  placeholder="Enter Name"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
                {formErrors.beneficiaryName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.beneficiaryName}</p>
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
                  name="beneficiaryEmail"
                  value={formData.beneficiaryEmail}
                  placeholder="Enter Email"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
                {formErrors.beneficiaryEmail && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.beneficiaryEmail}</p>
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
                  name="beneficiaryPhone"
                  value={formData.beneficiaryPhone}
                  placeholder="Enter Phone"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
                {formErrors.beneficiaryPhone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.beneficiaryPhone}</p>
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
                  name="beneficiaryAddress"
                  value={formData.beneficiaryAddress}
                  placeholder="Enter Address"
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
                {formErrors.beneficiaryAddress && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.beneficiaryAddress}</p>
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
                  name="beneficiaryCity"
                  value={formData.beneficiaryCity}
                  placeholder="Enter City"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
                {formErrors.beneficiaryCity && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.beneficiaryCity}</p>
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
                  name="beneficiaryCountry"
                  value={formData.beneficiaryCountry}
                  placeholder="Enter Country"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
                {formErrors.beneficiaryCountry && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.beneficiaryCountry}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  PostCode
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="number"
                  name="beneficiaryPostcode"
                  value={formData.beneficiaryPostcode}
                  placeholder="Enter PostCode"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap w-full gap-3">
          {/* Parcel Section */}
          <div className="w-full p-4 border border-[#057fc4] rounded-xl shadow ">
            <h3 className="text-lg font-semibold mb-2 md:mb-4 text-[#057fc4]">Parcel Details</h3>

            <div className="mt-2 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Piece Number <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="number"
                  name="piece_number"
                  value={formData.piece_number}
                  placeholder="Enter piece number"
                  min="1"
                  onChange={handlePieceNumberChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.piece_number && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.piece_number}</p>
                )}
              </div>
            </div>

            {/* Piece details section */}
            {parseInt(formData.piece_number) > 0 && (
              <div className="mt-4">
                {Array.from({ length: parseInt(formData.piece_number) }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="mb-6 p-2 border border-gray-200 rounded-lg"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="w-full md:w-[22%]">
                          <label className="block text-[15px] md:text-md font-medium mb-2">
                            Weight <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={pieceData[index]?.weight || ""}
                            placeholder="Enter Weight"
                            onChange={(e) => handlePieceDataChange(index, 'weight', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="w-full md:w-[22%]">
                          <label className="block text-[15px] md:text-md font-medium mb-2">
                            Length <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={pieceData[index]?.length || ""}
                            placeholder="Enter Length"
                            onChange={(e) => handlePieceDataChange(index, 'length', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="w-full md:w-[22%]">
                          <label className="block text-[15px] md:text-md font-medium mb-2">
                            Width <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={pieceData[index]?.width || ""}
                            placeholder="Enter Width"
                            onChange={(e) => handlePieceDataChange(index, 'width', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="w-full md:w-[22%]">
                          <label className="block text-[15px] md:text-md font-medium mb-2">
                            Height <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={pieceData[index]?.height || ""}
                            placeholder="Enter Height"
                            onChange={(e) => handlePieceDataChange(index, 'height', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            <div className="mt-2 md:mt-4 flex flex-wrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Description <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%] h-auto">
                <textarea
                  name="description"
                  value={formData.description}
                  placeholder="Enter Description"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                  rows="3"
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Section */}
          <div className="w-full p-4 border border-[#057fc4] rounded-xl shadow ">
            <h3 className="text-lg font-semibold mb-4 text-[#057fc4]">Order Details</h3>

            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Tracking Number <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <input
                  type="text"
                  name="tracking_number"
                  value={formData.tracking_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                  placeholder="Enter Tracking Number"
                />
                {formErrors.tracking_number && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.tracking_number}</p>
                )}
              </div>
            </div>


            <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
              <div className="w-full md:w-[40%]">
                <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                  Cargo Mode <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="w-full md:w-[60%]">
                <select
                  name="cargo_mode"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
                  value={formData.cargo_mode}
                  onChange={handleInputChange}
                >
                  <option value="">Select Cargo Mode</option>
                  <option value="Air">Air</option>
                  <option value="Sea">Sea</option>
                </select>
                {formErrors.cargo_mode && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.cargo_mode}</p>
                )}
              </div>
            </div>

            <div className="mt-2 md:mt-8 flex flex-wrap md:flex-nowrap justify-between items-center">
              <label className="block text-[15px] md:text-md font-medium">
                Packed <span className="text-red-500">*</span>
              </label>
              <div className="w-full md:w-[60%]">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="packed"
                      value="Yes"
                      checked={formData.packed === "Yes"}
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
                      checked={formData.packed === "No"}
                      onChange={(e) => handleRadioChange(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    No
                  </label>
                </div>
                {formErrors.packed && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.packed}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6 bg-white md:p-4">
          <button
            type="button"
            onClick={() => navigate("/order")}
            className="px-3 md:px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-3 md:px-6 py-2 rounded-lg bg-[#057fc4] text-white hover:bg-[#046aa4] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-2 md:h-4 w-2 md:w-4 border-b-2 border-white"></div>
                Updating...
              </span>
            ) : (
              "Updated"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Customer_detail;