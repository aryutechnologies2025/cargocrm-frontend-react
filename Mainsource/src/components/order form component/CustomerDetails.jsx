import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { FiSearch } from "react-icons/fi";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
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

    if(!formData.tracking_number?.trim()) {
      errors.tracking_number = "Tracking number is required";
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
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/customers/view-customers/${id}`);
      
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
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
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
    
    // Update piece_details in formData before validation
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

      let response;
      if (id) {
        // Update existing
        response = await axiosInstance.put(`api/customers/edit-customers/${id}`, apiData);
      } else {
        // Create new
        response = await axiosInstance.post("api/customers/create-customers", apiData);
      }

      if (response.data?.success) {
        toast.success(id ? "Customer updated successfully" : "Customer created successfully");
        navigate("/order");
      } else {
        toast.error(response.data?.message || "Operation failed");
      }
    } catch (err) {
      console.error("Error saving customer:", err);
      toast.error(err.response?.data?.message || "Error saving customer");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 gap-3 flex flex-col w-full min-h-screen bg-white rounded-xl shadow">
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
                className="w-full px-3 py-2 border rounded-lg"
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
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
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
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
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
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
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
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
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
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
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
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
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
                className="w-full px-3 py-2 border rounded-lg"
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
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
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
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
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
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
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
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
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
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
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
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Parcel Section */}
      <div className="w-full p-4 border border-[#057fc4] rounded-xl shadow mt-4">
        <h3 className="text-lg font-semibold mb-4 text-[#057fc4]">Parcel Details</h3>
        
        <div className="mt-2 flex justify-between items-center">
          <div className="w-[40%]">
            <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
              Piece Number <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="w-[60%] md:w-[50%]">
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
          <div className="w-[40%]">
            <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
              Description <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="w-[100%] md:w-[80%] h-auto">
            <textarea
              name="description"
              value={formData.description}
              placeholder="Enter Description"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              rows="3"
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Section */}
      <div className="w-full p-4 border border-[#057fc4] rounded-xl shadow mt-4">
        <h3 className="text-lg font-semibold mb-4 text-[#057fc4]">Order Details</h3>
        {/* tracking_number */}

        <div className="mt-2 md:mt-4 flex justify-between items-center">
          <div className="w-[40%]">
            <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
              Tracking Number <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="w-[60%] md:w-[50%]">
            <input
              type="text"
              name="tracking_number"
              value={formData.tracking_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              placeholder="Enter Tracking Number"
            />
            {formErrors.tracking_number && (
              <p className="text-red-500 text-sm mt-1">{formErrors.tracking_number}</p>
            )}
          </div>
        </div>
        <div className="mt-2 md:mt-4 flex justify-between items-center">
          <div className="w-[40%]">
            <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
              Cargo Mode <span className="text-red-500">*</span>
            </label>
          </div>
          <div className="w-[60%] md:w-[50%]">
            <select 
              name="cargo_mode"
              className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
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

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-4 bg-white p-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-[#057fc4] text-white hover:bg-[#046aa4] disabled:bg-gray-400"
        >
          {loading ? "Saving..." : (id ? "Update" : "Submit")}
        </button>
      </div>
    </form>
  );
};

export default CustomerDetails;





























// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../api/axiosInstance";
// import { toast } from "react-toastify";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FiSearch } from "react-icons/fi";
// import { InputText } from "primereact/inputtext";
// import { Dropdown } from "primereact/dropdown";

// const CustomerDetails = ({ nextStep, updateData, customerId, isView }) => {
//   console.log("CustomerDetails props:", { nextStep, updateData, customerId, isView });
//   const [selectedCustomerID, setSelectedCustomerID] = useState(null);
//   console.log("selectedCustomerID", selectedCustomerID)
//   const id = customerId || selectedCustomerID;
//   const navigate = useNavigate();
//   const storedDetalis = localStorage.getItem("cargouser");
//   const parsedDetails = JSON.parse(storedDetalis);
//   const createdBy = parsedDetails.id;
//   const [loading, setLoading] = useState(false);
//   const [formErrors, setFormErrors] = useState({});
//   const [beneficiaryErrors, setBeneficiaryErrors] = useState({});
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [customerOptions, setCustomerOptions] = useState([]);
//   console.log("customerOptions", customerOptions)
//   const [beneficiaryOptions, setBeneficiaryOptions] = useState([]);
//   console.log("beneficiaryOptions", beneficiaryOptions)

//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   console.log("selectedCustomer", selectedCustomer)
//   const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
//   const [selectedBeneficiaryID, setSelectedBeneficiaryID] = useState(null);
//   console.log("selectedBeneficiaryID", selectedBeneficiaryID)
//   const [beneficiaryAutoFill, setBeneficiaryAutoFill] = useState({});
//   console.log("beneficiaryAutoFill", beneficiaryAutoFill);
//   const [customer, setCustomer] = useState({
//     id: "",
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     city: "",
//     country: "",
//     postcode: "",
//     created_by: ""
//   });

//   const [beneficiary, setBeneficiary] = useState({
//     id: "",
//     name: "",
//     phone: "",
//     city: "",
//     email: "",
//     country: "",
//     address: "",
//     postcode: "",
//   });

//  const [mode, setMode] = useState("new");


//   const validateCustomerForm = () => {
//     const errors = {};

//     const nameRegex = /^[A-Za-z\s]+$/;
//     const phoneRegex = /^[0-9]{10}$/;
//     // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const addressRegex = /^[A-Za-z0-9\s,.-]+$/;
//     const cityCountryRegex = /^[A-Za-z\s]+$/;
//     // const postcodeRegex = /^[0-9]{10}$/;


//     if (!customer.name?.trim()) {
//       errors.name = "Name is required";
//     } else if (!nameRegex.test(customer.name)) {
//       errors.name = "Name must contain only alphabets"
//     }

//     if (!customer.phone?.trim()) {
//       errors.phone = "Phone is required";
//     } else if (!phoneRegex.test(customer.phone)) {
//       errors.phone = "Phone must be 10 digits";
//     }

//     if (!customer.email?.trim()) {
//       errors.email = "Email is required";
//     }

//     if (!customer.address?.trim()) {
//       errors.address = "Address is required";
//     } else if (!addressRegex.test(!customer.address)) {
//       errors.address = "Invalid address format"
//     }

//     if (!customer.city?.trim()) {
//       errors.city = "City is required";
//     } else if (!cityCountryRegex.test(!customer.city)) {
//       errors.city = "City must contain only alphabets"
//     }

//     if (!customer.country?.trim()) {
//       errors.country = "Country is required";
//     } else if (!cityCountryRegex.test(!customer.country)) {
//       errors.country = "Country must contain only alphabets"
//     }

//     // if (!customer.postcode?.trim()) {
//     //   errors.postcode = "PostCode is required";
//     // } 

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const validateBeneficiaryForm = () => {
//     const errors = {};

//     const nameRegex = /^[A-Za-z\s]+$/;
//     const phoneRegex = /^[0-9]{10}$/;
//     // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const addressRegex = /^[A-Za-z0-9\s,.-]+$/;
//     const cityCountryRegex = /^[A-Za-z\s]+$/;

//     if (!beneficiary.name?.trim()) {
//       errors.name = "Beneficiary name is required";
//     } else if (!nameRegex.test(!beneficiary.name)) {
//       errors.name = "Name must contain only alphabets"
//     }

//     if (!beneficiary.phone?.trim()) {
//       errors.phone = "Beneficiary phone is required";
//     }

//     if (!beneficiary.email?.trim()) {
//       errors.email = "Beneficiary email is required";
//     }

//     if (!beneficiary.address?.trim()) {
//       errors.address = "Beneficiary address is required";
//     } else if (!addressRegex.test(!!beneficiary.address)) {
//       errors.address = "Invalid address format"
//     }

//     if (!beneficiary.city?.trim()) {
//       errors.city = "Beneficiary city is required";
//     } else if (!cityCountryRegex.test(!beneficiary.city)) {
//       errors.city = "City must contain only alphabets"
//     }

//     if (!beneficiary.country?.trim()) {
//       errors.country = "Beneficiary country is required";
//     } else if (!cityCountryRegex.test(!beneficiary.country)) {
//       errors.country = "Country must contain only alphabets"
//     }

//     // if (!beneficiary.postcode?.trim()) {
//     //   errors.postcode = "Beneficiary Postcode is required";
//     // }

//     setBeneficiaryErrors(errors);
//     return Object.keys(errors).length === 0;
//   };


//   const fetchCustomerNames = async () => {
//     try {
//       const response = await axiosInstance.get(
//         "api/customers/get-customer-name"
//       );

//       console.log("response customer", response);

//       if (response.data?.success) {

//         const customer = response.data.customer;


//         const list = customer.map((data) => ({
//           label: data.name,
//           value: data._id,
//           data: data,
//         }));
       

//         // console.log("list", list);

//         setCustomerOptions(list);
//       }
//     } catch (error) {
//       console.log("Customer dropdown error", error);
//     }
//   };

//   useEffect(() => {
//     fetchCustomerNames();
//   }, []);
//   const fetchBeneficiaryNames = async (selectedCustomerID) => {
//     try {
//       const response = await axiosInstance.get(
//         "api/customers/get-beneficiary-name",{
//           params: {
//             id: selectedCustomerID
//           }
//         }
//       );

//       console.log("response beneficiary", response);

//       if (response.data?.success) {

//         const beneficiary = response.data.beneficiary;


//         const Beneficiarylist = beneficiary.map((data) => ({
//           label: data.name,
//           value: data._id,
//           data: data,
//         }));

//         // console.log("list", list);

//         setBeneficiaryOptions(Beneficiarylist);
//       }
//     } catch (error) {
//       console.log("Customer dropdown error", error);
//     }
//   };

//   useEffect(() => {
//     if (selectedCustomerID) {
//       fetchBeneficiaryNames(selectedCustomerID);
//     }
//   }, [selectedCustomerID]);

//   useEffect(() => {
//   if (customerId) {
//     setMode("new");
//   }
// }, [customerId]);

//   const handleCustomerChange = async (e) => {
//     const selected = e.value;

//     setSelectedCustomer(selected);
//     setSelectedCustomerID(selected.data.id)
//     const customerData = customerOptions.find(
//       (c) => c.value === selected
//     )?.data;

//     if (customerData) {
//       setCustomer({
//         id: customerData._id,
//         name: customerData.name,
//         email: customerData.email,
//         phone: customerData.phone,
//         address: customerData.address,
//         city: customerData.city,
//         country: customerData.country,
//         postcode: customerData.postcode,
//       });

//       fetchBeneficiaries(selected);
//     }
//   };

//   const handleBeneficiaryChange = (e) => {
//     const selected = e.value;
//     setSelectedBeneficiary(selected);
//     setSelectedBeneficiaryID(selected.data.id)

//     const beneficiaryData = beneficiaryOptions.find(
//       (b) => b.value === selected
//     )?.data;

//     if (beneficiaryData) {
//       setBeneficiary({
//         id: beneficiaryData._id,
//         name: beneficiaryData.name,
//         email: beneficiaryData.email,
//         phone: beneficiaryData.phone,
//         address: beneficiaryData.address,
//         city: beneficiaryData.city,
//         country: beneficiaryData.country,
//         postcode: beneficiaryData.postcode,
//       });
//     }
//   };

//   const fetchBeneficiaries = async () => {
//     try {
//       const response = await axiosInstance.get(
//         "/api/customers/get-beneficiary-details",
//         {
//           params: {
//             id: selectedBeneficiaryID,
//           },
//         }
//       );

//       console.log("Response beneficiary:", response.data);
//       setBeneficiaryAutoFill(response.data.beneficiary);
//       return response.data;
//     } catch (error) {
//       console.error("Beneficiary dropdown error:", error?.response?.data || error.message);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     if (selectedBeneficiaryID) {
//       fetchBeneficiaries();
//     }
//   }, [selectedBeneficiaryID]);

//   const fetchCustomer = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get(`api/customers/view-customerss/${id || selectedCustomerID}`);

//       if (response.data?.success || response.data?.status) {
//         const apiData = response.data.data || [];
//         setCustomer({
//           id: apiData._id,
//           ...apiData
//         });


//         if (apiData.beneficiaryId) {
//           fetchBeneficiary(apiData.beneficiaryId);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching customer:", error);
//       toast.error("Failed to fetch customer");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBeneficiary = async () => {
//     try {
//       const response = await axiosInstance.get(
//         `api/beneficiary/get-new-beneficiary-id/${id}`
//       );

//       console.log("response ben", response);

//       if (response.data?.success || response.data?.status) {
//         const apiData = response.data.data || [];
//         setBeneficiary({
//           id: apiData._id,
//           ...apiData,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching beneficiary:", error);
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchCustomer();
//       fetchBeneficiary();
//     }
//   }, [id]);

//   const handleCustomerSubmit = async (e) => {
//   e.preventDefault();
//   if (!validateCustomerForm()) return;

//   try {
//     // // If mode is "existing" and a customer is selected, use the selected customer's ID
//     // if (mode === "existing" && selectedCustomer) {
//     //   const selectedCustomerId = selectedCustomer.value;
      
//     //   // Create beneficiary with the selected customer ID
//     //   await handleBeneficiarySubmit(selectedCustomerId);
//     //   return;
//     // }

//     // For "new" mode or when no customer is selected, create new customer
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

//     console.log("response customer", response);

//     if (response.data?.status || response.data?.success) {
//       const customerResponseData = response.data.data;
      
//       // Create beneficiary with the newly created customer ID
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

// const handleBeneficiarySubmit = async (customerId) => {
//   if (!validateBeneficiaryForm()) return;

//   try {
//     // Prepare beneficiary data
//     let beneficiaryData = {
//       name: beneficiary.name,
//       email: beneficiary.email,
//       phone: beneficiary.phone,
//       address: beneficiary.address,
//       city: beneficiary.city,
//       country: beneficiary.country,
//       postcode: beneficiary.postcode,
//       customerId: customerId,
//       mode: mode
//     };

//     // If an existing beneficiary is selected in "existing" mode, include its ID
//     if (mode === "existing" && selectedBeneficiary) {
//       beneficiaryData.id = selectedBeneficiary.value;
//     } else if (beneficiary.id) {
//       beneficiaryData.id = beneficiary.id;
//     }

//     const response = await axiosInstance.post(
//       `api/beneficiary/add-update-beneficiary`,
//       beneficiaryData
//     );
    
//     console.log("Beneficiary add response:", response);

//     if (response.data?.status || response.data?.success) {
//       // Proceed to next step with customer ID and beneficiary ID
//       nextStep({
//         id: customerId,
//         beneficiaryId: response.data.data._id
//       });
      
//       toast.success("Beneficiary saved successfully");
//     } else {
//       toast.error("Failed to create beneficiary");
//     }
//   } catch (err) {
//     toast.error(err.response?.data?.message || "Error creating beneficiary");
//   }
// };

//   // const handleCustomerSubmit = async (e) => {
//   //   e.preventDefault();
//   //   if (!validateCustomerForm()) return;

//   //   try {
//   //     const formData = {
//   //       ...(customer.id && { id: customer.id }),
//   //       name: customer.name,
//   //       email: customer.email,
//   //       phone: customer.phone,
//   //       address: customer.address,
//   //       city: customer.city,
//   //       country: customer.country,
//   //       postcode: customer.postcode,
//   //       created_by: createdBy,
//   //       mode: mode
//   //     };

//   //     const response = await axiosInstance.post(
//   //       `api/customers/create-customerss`,
//   //       formData
//   //     );

//   //     if (response.data?.status || response.data?.success) {
//   //       const customerResponseData = response.data.data;

//   //       if (mode === "existing" && selectedCustomer) {
//   //         await handleBeneficiarySubmit(selectedCustomer.value);
//   //         return;
//   //       }
//   //       // After customer is saved, save beneficiary
//   //       await handleBeneficiarySubmit(customerResponseData._id);

//   //       if (id) {
//   //         toast.success("Customer updated successfully");
//   //       } else {
//   //         toast.success("Customer created successfully");
//   //       }
//   //     } else {
//   //       toast.error("Failed to create customer");
//   //     }
//   //   } catch (err) {
//   //     toast.error(err.response?.data?.message || "Error creating customer");
//   //   }
//   // };

//   // const handleBeneficiarySubmit = async (customerId, customerResponseData) => {
//   //   if (!validateBeneficiaryForm()) return;

//   //   try {
//   //     const formData = {
//   //       ...(beneficiary.id && { id: beneficiary.id }),
//   //       name: beneficiary.name,
//   //       email: beneficiary.email,
//   //       phone: beneficiary.phone,
//   //       address: beneficiary.address,
//   //       city: beneficiary.city,
//   //       country: beneficiary.country,
//   //       postcode: beneficiary.postcode,
//   //       customerId: customerId || customerResponseData._id,
//   //     };

//   //     const response = await axiosInstance.post(
//   //       `api/beneficiary/add-update-beneficiary`,
//   //       formData
//   //     );
//   //     console.log("Beneficiary add response:", response);


//   //     if (response.data?.status || response.data?.success) {
//   //       // Proceed to next step after both customer and beneficiary are saved
//   //       nextStep({
//   //         id: customerId,
//   //         beneficiaryId: response.data.data._id
//   //       });
//   //       if (mode === "existing" && selectedBeneficiary) {
//   //         nextStep({
//   //           id: customerId,
//   //           beneficiaryId: selectedBeneficiary.value
//   //         });
//   //         return;
//   //       }
//   //     } else {
//   //       toast.error("Failed to create beneficiary");
//   //     }
//   //   } catch (err) {
//   //     toast.error(err.response?.data?.message || "Error creating beneficiary");
//   //   }
//   // };

//   return (
//     <>
//       <div className="p-4 gap-3 flex flex-col flex-wrap md:flex-nowrap w-full min-h-screen bg-white rounded-xl shadow">

//         {/* <div className="flex justify-end">
//           <div className="relative w-full md:w-64">
//             <FiSearch
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               size={18}
//             />
//             <InputText
//               value={globalFilter}
//               onChange={(e) => setGlobalFilter(e.target.value)}
//               placeholder="Search Details"
//               className="w-full pl-10 pr-3 py-2 rounded-md text-sm border border-[#D9D9D9] 
//                focus:outline-none focus:ring-2 focus:ring-[#057fc4]"
//             />
//           </div>
//         </div> */}
//         {!isView && (
//         <div className="flex justify-between">
//           <div className="flex gap-8 mb-4">
            

//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 value="new"
//                 checked={mode === "new"}
//                 onChange={() => {
//                   setMode("new");

//                   setSelectedCustomer(null);
//                   setSelectedBeneficiary(null);

//                   setCustomer({
//                     id: "",
//                     name: "",
//                     email: "",
//                     phone: "",
//                     address: "",
//                     city: "",
//                     country: "",
//                     postcode: "",
//                   });

//                   setBeneficiary({
//                     id: "",
//                     name: "",
//                     phone: "",
//                     email: "",
//                     city: "",
//                     country: "",
//                     address: "",
//                     postcode: "",
//                   });
//                 }}
//               />
//               New
//             </label>

//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 value="existing"
//                 checked={mode === "existing"}
//                 onChange={() => {
//                   setMode("existing");
//                 }}
//               />
//               Existing
//             </label>
//           </div>
//         </div>
//         )}


//         <div className="flex flex-wrap md:flex-nowrap w-full gap-3">

//           {/* Customer Section */}
//           <div className="w-full md:w-[50%] h-1/2 p-4 border border-[#057fc4] rounded-xl shadow">
//             <h3 className="text-lg font-semibold mb-4 text-[#057fc4]">Shipper Details</h3>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   Name <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 {mode === "existing" ? (
//                   <Dropdown
//                     value={selectedCustomer}
//                     options={customerOptions}
//                     onChange={handleCustomerChange}
//                     placeholder="Select Customer"
//                     className="w-full border rounded-lg"
//                   />
//                 ) : (
//                   <input
//                     type="text"
//                     value={customer.name}
//                     placeholder="Enter Name"
//                     onChange={(e) => {
//                       setCustomer({ ...customer, name: e.target.value });
//                       setFormErrors((prev) => ({ ...prev, name: "" }));
//                     }}
//                     className="w-full px-3 py-2 border rounded-lg"
//                   />
//                 )}
//               </div>
//             </div>



//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   Email <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 <input
//                   type="email"
//                   value={customer.email}
//                   placeholder="Enter Email"
//                   onChange={(e) => {
//                     setCustomer({ ...customer, email: e.target.value });
//                     setFormErrors((prev) => ({ ...prev, email: "" }));
//                   }}
//                   className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
//                 />
//                 {formErrors.email && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   Phone Number <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 <input
//                   type="number"
//                   value={customer.phone}
//                   placeholder="Enter Phone Number"
//                   onChange={(e) => {
//                     setCustomer({ ...customer, phone: e.target.value });
//                     setFormErrors((prev) => ({ ...prev, phone: "" }));
//                   }}
//                   className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
//                 />
//                 {formErrors.phone && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   Address <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 <textarea
//                   value={customer.address}
//                   placeholder="Enter Address"
//                   onChange={(e) => {
//                     setCustomer({ ...customer, address: e.target.value });
//                     setFormErrors((prev) => ({ ...prev, address: "" }));
//                   }}
//                   className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
//                 />
//                 {formErrors.address && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   City <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 <input
//                   type="text"
//                   value={customer.city}
//                   placeholder="Enter City"
//                   onChange={(e) => {
//                     setCustomer({ ...customer, city: e.target.value });
//                     setFormErrors((prev) => ({ ...prev, city: "" }));
//                   }}
//                   className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
//                 />
//                 {formErrors.city && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   Country <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 <input
//                   type="text"
//                   value={customer.country}
//                   placeholder="Enter Country"
//                   onChange={(e) => {
//                     setCustomer({ ...customer, country: e.target.value });
//                     setFormErrors((prev) => ({ ...prev, country: "" }));
//                   }}
//                   className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
//                 />
//                 {formErrors.country && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   PostCode <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 <input
//                   type="number"
//                   value={customer.postcode}
//                   placeholder="Enter PostCode"
//                   onChange={(e) => {
//                     setCustomer({ ...customer, postcode: e.target.value });
//                     setFormErrors((prev) => ({ ...prev, postcode: "" }));
//                   }}
//                   className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
//                 />
//                 {/* {formErrors.postcode && (
//                   <p className="text-red-500 text-sm mt-1">{formErrors.postcode}</p>
//                 )} */}
//               </div>
//             </div>
//           </div>


//           {/* Beneficiary Section */}
//           <div className="w-full md:w-[50%] h-1/2 p-4 border border-[#057fc4] rounded-xl shadow">
//             <h3 className="text-lg font-semibold mb-4 text-[#057fc4]">Consingee Details</h3>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   Name <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 {mode === "existing" ? (
//                   <Dropdown
//                     value={selectedBeneficiary}
//                     options={beneficiaryOptions}
//                     onChange={handleBeneficiaryChange}
//                     placeholder="Select Beneficiary"
//                     className="w-full border rounded-lg"
//                   />
//                 ) : (
//                   <input
//                     type="text"
//                     value={beneficiary.name}
//                     placeholder="Enter Name"
//                     onChange={(e) => {
//                       setBeneficiary({ ...beneficiary, name: e.target.value });
//                       setBeneficiaryErrors((prev) => ({ ...prev, name: "" }));
//                     }}
//                     className="w-full px-3 py-2 border rounded-lg"
//                   />
//                 )}
//               </div>
//             </div>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   Email <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 <input
//                   type="email"
//                   value={beneficiary.email || beneficiaryAutoFill?.email || ""}
//                   placeholder="Enter Email"
//                   onChange={(e) => {
//                     setBeneficiary({ ...beneficiary, email: e.target.value });
//                     setBeneficiaryErrors((prev) => ({ ...prev, email: "" }));
//                   }}
//                   className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
//                 />
//                 {beneficiaryErrors.email && (
//                   <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.email}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   Phone Number <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 <input
//                   type="number"
//                   value={beneficiary.phone || beneficiaryAutoFill?.phone || ""}
//                   placeholder="Enter Phone"
//                   onChange={(e) => {
//                     setBeneficiary({ ...beneficiary, phone: e.target.value });
//                     setBeneficiaryErrors((prev) => ({ ...prev, phone: "" }));
//                   }}
//                   className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
//                 />
//                 {beneficiaryErrors.phone && (
//                   <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.phone}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   Address <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 <textarea
//                   value={beneficiary.address || beneficiaryAutoFill?.address || ""}
//                   placeholder="Enter Address"
//                   onChange={(e) => {
//                     setBeneficiary({ ...beneficiary, address: e.target.value });
//                     setBeneficiaryErrors((prev) => ({ ...prev, address: "" }));
//                   }}
//                   className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
//                 />
//                 {beneficiaryErrors.address && (
//                   <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.address}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   City <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 <input
//                   type="text"
//                   value={beneficiary.city || beneficiaryAutoFill?.city || ""}
//                   placeholder="Enter City"
//                   onChange={(e) => {
//                     setBeneficiary({ ...beneficiary, city: e.target.value });
//                     setBeneficiaryErrors((prev) => ({ ...prev, city: "" }));
//                   }}
//                   className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
//                 />
//                 {beneficiaryErrors.city && (
//                   <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.city}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   Country <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 <input
//                   type="text"
//                   value={beneficiary.country || beneficiaryAutoFill?.country || ""}
//                   placeholder="Enter Country"
//                   onChange={(e) => {
//                     setBeneficiary({ ...beneficiary, country: e.target.value });
//                     setBeneficiaryErrors((prev) => ({ ...prev, country: "" }));
//                   }}
//                   className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
//                 />
//                 {beneficiaryErrors.country && (
//                   <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.country}</p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
//               <div className="w-full md:w-[40%]">
//                 <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
//                   PostCode <span className="text-red-500">*</span>
//                 </label>
//               </div>
//               <div className="w-full md:w-[60%]">
//                 <input
//                   type="number"
//                   value={beneficiary.postcode || beneficiaryAutoFill?.postcode || ""}
//                   placeholder="Enter PostCode"
//                   onChange={(e) => {
//                     setBeneficiary({ ...beneficiary, postcode: e.target.value });
//                     setBeneficiaryErrors((prev) => ({ ...prev, postcode: "" }));
//                   }}
//                   className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
//                 />
//                 {beneficiaryErrors.postcode && (
//                   <p className="text-red-500 text-sm mt-1">{beneficiaryErrors.postcode}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-4 mt-4 bg-white p-4 ">
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
//           >
//             Back
//           </button>
//           <button
//             onClick={handleCustomerSubmit}
//             className="px-6 py-2 rounded-lg bg-[#057fc4] text-white hover:bg-[#046aa4]"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CustomerDetails;