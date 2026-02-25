import React, { useState } from 'react'

const ParcelDetails = ({ nextStep, prevStep, updateData }) => {

  const [parcel, setParcel] = useState({
    weight: "",
    pieces: ""
  });
  const [pieceNo, setPieceNo] = useState("");
  const [pieceData, setPieceData] = useState([]);

  const handleNext = () => {
    updateData("parcel", parcel);
    nextStep();
  }
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
                Pieces <span className="text-red-500">*</span>
              </label>

            </div>
            <div className="w-[60%] md:w-[50%]">
              <input
                type="text"
                id="name"
                placeholder="Enter Piece"
                onChange={(e) => setParcel({ ...parcel, pieces: e.target.value })}
                className="w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#057fc4] rounded-lg"
              />
            </div>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <div className="">
              <label
                htmlFor="pieceNo"
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Piece Number
              </label>
            </div>
            <div className="w-[60%] md:w-[50%]">
              <input
                type="number"
                id="pieceNo"
                value={pieceNo}
                placeholder="Enter piece number"
                min="1"
                onChange={(e) => {
                  const value = e.target.value;
                  setPieceNo(value);
                  // Reset piece data when piece number changes
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
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {pieceNo && parseInt(pieceNo) > 0 && (
            <div className="mt-4">
              {/* Render input fields for each piece */}
              {Array.from({ length: parseInt(pieceNo) }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="mb-6 p-2 border border-gray-200 rounded-lg"
                  >
                    <h3 className="text-md font-semibold mb-3">
                      Piece {index + 1}
                    </h3>
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div className="w-full md:w-[22%]">
                        <label
                          htmlFor={`weight-${index}`}
                          className="block text-[15px] md:text-md font-medium mb-2"
                        >
                          Weight <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id={`weight-${index}`}
                          value={pieceData[index]?.weight || ""}
                          placeholder="Enter Weight"
                          onChange={(e) => handlePieceDataChange(index, 'weight', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="w-full md:w-[22%]">
                        <label
                          htmlFor={`length-${index}`}
                          className="block text-[15px] md:text-md font-medium mb-2"
                        >
                          Length <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id={`length-${index}`}
                          value={pieceData[index]?.length || ""}
                          placeholder="Enter Length"
                          onChange={(e) => handlePieceDataChange(index, 'length', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="w-full md:w-[22%]">
                        <label
                          htmlFor={`width-${index}`}
                          className="block text-[15px] md:text-md font-medium mb-2"
                        >
                          Width <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id={`width-${index}`}
                          value={pieceData[index]?.width || ""}
                          placeholder="Enter Width"
                          onChange={(e) => handlePieceDataChange(index, 'width', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="w-full md:w-[22%]">
                        <label
                          htmlFor={`height-${index}`}
                          className="block text-[15px] md:text-md font-medium mb-2"
                        >
                          Height <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id={`height-${index}`}
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


          <div className="mt-2 md:mt-4 flex justify-between items-center ">
            <div className="">
              <label
                htmlFor="roleName"
                className="block text-[15px] md:text-md font-medium mb-2 mt-3"
              >
                Description <span className="text-red-500">*</span>
              </label>

            </div>
            <div className="w-[60%] md:w-[50%]">
              <textarea
                type="text"
                id="name"
                placeholder="Enter Description"
                onChange={(e) => setParcel({ ...parcel, description: e.target.value })}
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

export default ParcelDetails
