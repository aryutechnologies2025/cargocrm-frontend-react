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
    piece_details: [],
  });
  
  const [pieceData, setPieceData] = useState([]);
  
  console.log("parcel", parcel);
  console.log("pieceData", pieceData);
  
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
        
        // Set parcel data
        setParcel({
          id: apiData._id,
          piece_number: apiData.piece_number || "",
          description: apiData.description || "",
          piece_details: apiData.piece_details || []
        });

        // Set piece data from API
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
      // Reset when no customerId
      setParcel({
        id: "",
        piece_number: "",
        description: "",
        piece_details: []
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
        customerId: customerId,
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
          id: customerId,
        });
      } else {
        toast.error("Failed to create parcel");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating parcel");
    }
  };

  const handleBack = () => {
    prevStep({ id: customerId });
  };

  // Fixed: Handle piece number change without losing existing data
  const handlePieceNumberChange = (e) => {
    const value = e.target.value;
    const newPieceNumber = parseInt(value) || 0;
    
    // Update parcel state with new piece_number
    setParcel(prev => ({ ...prev, piece_number: value }));
    
    if (newPieceNumber > 0) {
      // Check if we have existing piece data from API or previous entries
      if (parcel.id && parcel.piece_details && parcel.piece_details.length > 0) {
        // This is an existing parcel with data
        if (newPieceNumber > parcel.piece_details.length) {
          // Need more pieces than existing - keep existing and add empty ones
          const additionalPieces = Array(newPieceNumber - parcel.piece_details.length)
            .fill(null)
            .map(() => ({
              weight: "",
              length: "",
              width: "",
              height: "",
            }));
          setPieceData([...parcel.piece_details, ...additionalPieces]);
        } else if (newPieceNumber < parcel.piece_details.length) {
          // Need fewer pieces - keep first N pieces
          setPieceData(parcel.piece_details.slice(0, newPieceNumber));
        } else {
          // Same number - keep all existing data
          setPieceData(parcel.piece_details);
        }
      } else if (pieceData.length > 0) {
        // We have some piece data but no parcel.id (maybe new parcel with some entries)
        if (newPieceNumber > pieceData.length) {
          // Add empty entries
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
          // Remove extra pieces
          setPieceData(pieceData.slice(0, newPieceNumber));
        }
      } else {
        // No existing data, create empty entries
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
      // If piece number is 0 or invalid, clear piece data
      setPieceData([]);
    }
  };

  // Add this effect to sync pieceData when parcel.piece_details changes
  useEffect(() => {
    if (parcel.id && parcel.piece_details && Array.isArray(parcel.piece_details) && parcel.piece_details.length > 0) {
      setPieceData(parcel.piece_details);
    }
  }, [parcel.id, parcel.piece_details]);

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

          {/* Piece details section */}
          {parseInt(parcel.piece_number) > 0 && (
            <div className="mt-4">
              {Array.from({ length: parseInt(parcel.piece_number) }).map(
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

          <div className="mt-2 md:mt-4 flex flex-wrap justify-between items-center ">
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