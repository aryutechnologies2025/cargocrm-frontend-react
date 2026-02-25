import React, { useEffect, useRef, useState } from "react";
import cargo from "../../assets/cargoLord_logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const Pdf_details = () => {
  const pdfRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const {path} = location.state || {};
  console.log("location.state:", location.state);
  console.log("orderId:", path?.id);
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState([]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/orders/view-parcel/${path?.id}`);
      console.log("API:", response.data);
      if (response.data?.success || response.data?.status) {
        const apiData = response.data.data?.[0] || [];
        setOrder(apiData);
        setSetting(response.data?.settings?.[0] || []);
      } else {
        setOrder([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrder([]);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

const downloadPDF = async () => {
  const element = pdfRef.current;

  const canvas = await html2canvas(element, {
    scale: 2,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight =
    (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("Cargo_Receipt.pdf");
};
const emptyRows = Array.from({ length: 12 });
  return (
    <div className="p-6">

      <div className="flex justify-between">
      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadPDF}
        className="mb-4 bg-[#057fc4] text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>
      <button
        onClick={() =>
            navigate(-1)
          }
        className="mb-4 bg-[#057fc4] text-white px-4 py-2 rounded"
      >
        Back
      </button>
      </div>

      {/* PDF CONTENT */}
      <div
        ref={pdfRef}
        className="bg-white p-6 border-2 shadow-md w-[794px] mx-auto text-sm"
      >
        {/* Header */}
        <div className="flex justify-center items-center mb-4">
          <img src={cargo} alt="logo" className="h-10" />
        </div>

        {/* Receipt Details */}
        <div className="flex justify-evenly border mb-4 w-full">
          <div className="w-[60%] flex justify-center items-center">
            <h1 className="text-[24px] font-bold font-serif ">CARGO LORD RECEIPT</h1>
          </div>
          <div className="w-[40%] flex">
            <table className="flex w-full">
              <tr className="w-[50%] flex flex-col border-r border-l ">
                <td className="px-2 py-1 text-start font-semibold">Receipt Number</td>
                <td className="px-2 py-1 text-start font-semibold">Receipt Date</td>
                <td className="border-b-0 px-2 py-1 text-start font-semibold">Payment Method</td>
              </tr>
              <tr className="w-[50%] flex flex-col">
                <td className="px-2 py-1">001</td>
                <td className="px-2 py-1">{new Date().toLocaleDateString()}</td>
                <td className="border-b-0 px-2 py-1">Cash</td>
              </tr>
            </table>
          </div>
        </div>

        {/* Seller and Customer */}
        <div className="flex justify-between gap-4 mb-4">
          <table className="w-[50%] border  text-start">
            <tr className="border-b bg-[#e6f2fa]">
              <th className="text-start px-2 py-1">CUSTOMER</th>
            </tr>
            <tr className="flex flex-col">
              <td className="text-start px-2 py-1">{order?.sender?.name}</td>
              <td className="text-start px-2 py-1">{order?.sender?.address}</td>
              {/* <td className="text-start px-2 py-1">Customer Address 2</td>
              <td className="text-start px-2 py-1">Customer Address 3</td> */}
            </tr>
          </table>

          <table className="w-[50%] border text-start">
            <tr className="border-b bg-[#e6f2fa]">
              <th className="text-start px-2 py-1">BENEFICIARY</th>
            </tr>
            <tr className="flex flex-col">
              <td className="text-start px-2 py-1">{order?.beneficiary?.name}</td>
              <td className="text-start px-2 py-1">{order?.beneficiary?.address}</td>
              {/* <td className="text-start px-2 py-1">Customer Address 2</td>
              <td className="text-start px-2 py-1">Customer Address 3</td> */}
            </tr>
          </table>

        </div>

        {/* TABLE */}
        <div className="flex gap-20 w-full border bg-[#e6f2fa] font-semibold p-2">
          <div className="flex">TRACKING NUMBER: {order?.tracking_number}</div>
          <div className="flex">PIECE NO: {order?.piece_number}</div>
          <div className="flex">DESCRIPTION: {order?.description}</div>
          </div>
        <table className="w-full border text-center">
  <thead className="bg-[#e6f2fa]">
    <tr className="text-start">
      <th className="border text-start px-2 py-1">PIECE NUMBER</th>
      <th className="border text-start px-2 py-1">WEIGHT</th>
      <th className="border text-start px-2 py-1">DIMENSIONS</th>
    </tr>
  </thead>

  <tbody>
    {/* Map through piece_details */}
    {order?.piece_details?.map((piece, index) => (
      <tr key={piece._id || index}>
        <td className="border px-2 py-1 text-start">{index + 1}</td>
        <td className="border px-2 py-1 text-start">{piece.weight}KG</td>
        <td className="border px-2 py-1 text-start">
          {piece.length} x {piece.width} x {piece.height}
        </td>
      </tr>
    ))}
    
    {/* Empty rows if needed */}
    {/* {emptyRows.map((_, index) => (
      <tr key={`empty-${index}`}>
        <td className="border h-8"></td>
        <td className="border"></td>
        <td className="border"></td>
      </tr>
    ))} */}
  </tbody>
</table>

        {/* <div className="flex w-full border-r border-l">
          <div className="w-[70%] border-r">
            <p className="border-b">SUBTOTAL</p>
            <p className="border-b">Tax (10%)</p>
            <p className="bg-[#e6f2fa] font-semibold">Total</p>
          </div>
          <div className="w-[30%]">
            <p className="border-b">$300</p>
            <p className="border-b">$30</p>
            <p className="bg-[#e6f2fa] font-semibold">$330</p>
          </div>
        </div> */}


        {/* terms and condition */}
        <div className="mt-6 ">
          <p className="font-semibold">Terms & Condition</p>
          <p className="border w-full mt-2 p-7">{setting?.teamAndCondition}</p>
        </div>

        {/* Signature */}
        <div className="flex justify-end mt-10">
          <div>
            <p>____________________</p>
            <p>Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pdf_details;