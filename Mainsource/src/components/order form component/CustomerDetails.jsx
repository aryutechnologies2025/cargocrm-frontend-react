import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const storedDetalis = localStorage.getItem("cargouser");
  const parsedDetails = storedDetalis ? JSON.parse(storedDetalis) : null;
  const createdBy = parsedDetails?.id || "";

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
    cargo_mode: "",
    packed: "",
    
    created_by: createdBy,
    tracking_number: ""
  });

  const [pieceData, setPieceData] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [beneficiaryOptions, setBeneficiaryOptions] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState("");
  const [customerDetails, setCustomerDetails] = useState({});
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({});

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
    } else if (!phoneRegex.test(formData.beneficiaryPhone)) {
      errors.beneficiaryPhone = "Phone must be 10 digits";
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

    if (!formData.piece_number?.toString().trim()) {
      errors.piece_number = "Piece number is required";
    }

    if (!formData.description?.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.tracking_number?.trim()) {
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

  const fetchCustomerName = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/customers/get-customer-name`);
      if (response.data?.success) {
        const data = response.data.customer;
        setCustomerOptions(data || []);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async () => {
    if (!selectedCustomerId) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/customers/get-customer-details`, {
        params: {
          id: selectedCustomerId
        }
      });
      if (response.data?.success) {
        const data = response.data.customer;
        setCustomerDetails(data || {});
        
        // Auto-fill customer fields
        setFormData(prev => ({
          ...prev,
          customerName: data.name || prev.customerName,
          customerEmail: data.email || prev.customerEmail,
          customerPhone: data.phone || prev.customerPhone,
          customerAddress: data.address || prev.customerAddress,
          customerCity: data.city || prev.customerCity,
          customerCountry: data.country || prev.customerCountry,
          customerPostcode: data.postcode || prev.customerPostcode
        }));
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBeneficiaryName = async () => {
    if (!selectedCustomerId) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/customers/get-beneficiary-name`, {
        params: {
          id: selectedCustomerId
        }
      });
      if (response.data?.success) {
        const data = response.data.beneficiary;
        setBeneficiaryOptions(data || []);
      }
    } catch (error) {
      console.error("Error fetching beneficiary:", error);
      toast.error("Failed to fetch beneficiary data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBeneficiaryDetails = async () => {
    if (!selectedBeneficiaryId) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/customers/get-beneficiary-details`, {
        params: {
          id: selectedBeneficiaryId
        }
      });
      if (response.data?.success) {
        const data = response.data.beneficiary;
        setBeneficiaryDetails(data || {});
        
        // Auto-fill beneficiary fields
        setFormData(prev => ({
          ...prev,
          beneficiaryName: data.name || prev.beneficiaryName,
          beneficiaryEmail: data.email || prev.beneficiaryEmail,
          beneficiaryPhone: data.phone || prev.beneficiaryPhone,
          beneficiaryAddress: data.address || prev.beneficiaryAddress,
          beneficiaryCity: data.city || prev.beneficiaryCity,
          beneficiaryCountry: data.country || prev.beneficiaryCountry,
          beneficiaryPostcode: data.postcode || prev.beneficiaryPostcode
        }));
      }
    } catch (error) {
      console.error("Error fetching beneficiary:", error);
      toast.error("Failed to fetch beneficiary data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
    fetchCustomerName();
  }, [id]);

  useEffect(() => {
    if (selectedCustomerId) {
      fetchCustomerDetails();
      fetchBeneficiaryName();
    }
  }, [selectedCustomerId]);

  useEffect(() => {
    if (selectedBeneficiaryId) {
      fetchBeneficiaryDetails();
    }
  }, [selectedBeneficiaryId]);

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

  return (
    <form onSubmit={handleSubmit} className="p-4 gap-3 flex flex-col w-full min-h-screen bg-white rounded-xl shadow">
      <div className="flex flex-wrap md:flex-nowrap w-full gap-3">
        {/* Customer Section */}
        <div className="w-full md:w-[50%] p-4 border border-[#057fc4] rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-[#057fc4]">Shipper Details</h3>

          <div className="mt-2 md:mt-4 flex flex-wrap md:flex-nowrap justify-between items-center">
            <div className="w-full md:w-[40%]">
              <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                Customer Dropdown
              </label>
            </div>
            <div className="w-full md:w-[60%]">
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select a customer</option>
                {customerOptions.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                type="text"
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
                type="text"
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
                Consignee Dropdown
              </label>
            </div>
            <div className="w-full md:w-[60%]">
              <select
                value={selectedBeneficiaryId}
                onChange={(e) => setSelectedBeneficiaryId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={!selectedCustomerId}
              >
                <option value="">Select a beneficiary</option>
                {beneficiaryOptions.map((beneficiary) => (
                  <option key={beneficiary.id} value={beneficiary.id}>
                    {beneficiary.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                type="text"
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
                type="text"
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