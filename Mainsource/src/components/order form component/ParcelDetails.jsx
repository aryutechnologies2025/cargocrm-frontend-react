import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const ParcelDetails = ({ nextStep, prevStep, updateData, customerId }) => {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [parcel, setParcel] = useState({
    id: "",
    piece_number: "",
    description: "",
  });
  const validateAddForm = () => {
    const errors = {};

    if (!parcel.piece_number?.trim()) {
      errors.piece_number = "Piece is required";
    }
    if (!parcel.description?.trim()) {
      errors.description = "Description is required";
    }
   
    
   

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const [pieceData, setPieceData] = useState([]);

  const handlePieceDataChange = (index, field, value) => {
    const updatedPieceData = [...pieceData];
    updatedPieceData[index] = {
      ...updatedPieceData[index],
      [field]: value
    };
    setPieceData(updatedPieceData);
  };

  const fetchParcel = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/parcels/get-new-parcel-id/${customerId}`);
      
      if (response.data?.success || response.data?.status) {
        const apiData = response.data.data || [];
        setParcel({
          id: apiData._id,
          piece_number: apiData.piece_number || "",
          description: apiData.description || "",
        });

        if (apiData.piece_details && Array.isArray(apiData.piece_details)) {
          setPieceData(apiData.piece_details);
        }
      }
    } catch (error) {
      console.error("Error fetching parcel:", error);
      toast.error("Failed to fetch parcel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchParcel();
    } else {
      setParcel({
        id: "",
        piece_number: "",
        description: "",
      });
      setPieceData([]);
    }
  }, [customerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!validateAddForm()) return;
    if(!pieceData.length) {
      toast.error("Please add at least one piece");
      return;
    }
    if (parcel.piece_number && parseInt(parcel.piece_number) > 0) {
      const isValid = pieceData.every(piece => 
        piece.weight && piece.length && piece.width && piece.height
      );
      
      if (!isValid) {
        toast.error("Please fill all piece dimensions");
        return;
      }
    }

    const pieceDetails = pieceData.map((piece) => ({
      weight: piece.weight,
      length: piece.length,
      width: piece.width,
      height: piece.height,
    }));

    try {
      const formData = {
        ...(parcel.id && { id: parcel.id }),
        customerId: customerId, // Use prop directly
        piece_number: parcel.piece_number,
        piece_details: pieceDetails,
        description: parcel.description
      };

      const response = await axiosInstance.post(
        `api/parcels/add-update-parcels`,
        formData
      );

      if (response.data?.status || response.data?.success) {
        toast.success(parcel.id ? "Parcel updated successfully" : "Parcel created successfully");
        
        updateData("parcel", response.data.data);
        nextStep({
          id: customerId, // Pass back the customerId
        });
      } else {
        toast.error("Failed to create parcel");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating parcel");
    }
  };

  const handleBack = () => {
    prevStep({ id: customerId }); // Use customerId prop directly
  };

  // Handle piece number change
  const handlePieceNumberChange = (e) => {
    const value = e.target.value;
    setParcel({ ...parcel, piece_number: value });
    
    const numPieces = parseInt(value) || 0;
    const newPieceData = Array(numPieces)
      .fill(null)
      .map(() => ({
        weight: "",
        length: "",
        width: "",
        height: "",
      }));
    setPieceData(newPieceData);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <>
      <div className="p-4 w-full min-h-screen bg-white rounded-xl shadow">
        <div className="w-full">
          <div className="mt-2 flex justify-between items-center">
            <div className="">
              <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                Piece Number
              </label>
            </div>
            <div className="w-[60%] md:w-[50%]">
              <input
                type="number"
                value={parcel.piece_number}
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

          {parcel.piece_number && parseInt(parcel.piece_number) > 0 && (
            <div className="mt-4">
              {Array.from({ length: parseInt(parcel.piece_number) }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="mb-6 p-2 border border-gray-200 rounded-lg"
                  >
                    {/* <h3 className="text-md font-semibold mb-3">
                      Piece {index + 1}
                    </h3> */}
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

          <div className="mt-2 md:mt-4 flex flex-wrap  justify-between items-center ">
            <div className="">
              <label className="block text-[15px] md:text-md font-medium mb-2 mt-3">
                Description <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="w-[100%] md:w-[80%] h-auto">
              <textarea
                value={parcel.description}
                placeholder="Enter Description"
                onChange={(e) => setParcel({ ...parcel, description: e.target.value })}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
                rows="3"
              />
              {formErrors.description && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                      )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button 
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-md text-white" 
              onClick={handleBack}
            >
              Back
            </button>
            <button 
              className="px-4 py-2 bg-[#057fc4] hover:bg-[#2d93cf] rounded-md text-white" 
              onClick={handleSubmit}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ParcelDetails;