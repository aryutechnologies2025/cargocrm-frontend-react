import React, { useRef } from "react";
import cargo from "../../assets/cargoLord_logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Pdf_details = () => {
  const pdfRef = useRef();

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

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadPDF}
        className="mb-4 bg-[#057fc4] text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>

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
                <td className="px-2 py-1">12-02-2026</td>
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
              <td className="text-start px-2 py-1">Customer Name</td>
              <td className="text-start px-2 py-1">Customer Address 1</td>
              <td className="text-start px-2 py-1">Customer Address 2</td>
              <td className="text-start px-2 py-1">Customer Address 3</td>
            </tr>
          </table>

          <table className="w-[50%] border text-start">
            <tr className="border-b bg-[#e6f2fa]">
              <th className="text-start px-2 py-1">BENEFICIARY</th>
            </tr>
            <tr className="flex flex-col">
              <td className="text-start px-2 py-1">Customer Name</td>
              <td className="text-start px-2 py-1">Customer Address 1</td>
              <td className="text-start px-2 py-1">Customer Address 2</td>
              <td className="text-start px-2 py-1">Customer Address 3</td>
            </tr>
          </table>

        </div>

        {/* TABLE */}
        <div className="w-full border bg-[#e6f2fa] font-semibold p-2">TRACKING NUMBER: #454656367</div>
        <table className="w-full border text-center">
          <thead className="bg-[#e6f2fa]">
            <tr className="text-start">
              <th className="border text-start px-2 py-1">ORDER ID</th>
              <th className="border text-start px-2 py-1">PIECE</th>
              <th className="border text-start px-2 py-1">WEIGHT</th>
              <th className="border text-start px-2 py-1">DIMENSIONS</th>
              <th className="border text-start px-2 py-1">DESCRIPTION</th>
              <th className="border text-start px-2 py-1">TOTAL PIECE</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border p-2 text-left">#cl89976</td>
              <td className="border px-2 py-1 text-start">34</td>
              <td className="border px-2 py-1 text-start">60KG</td>
              <td className="border px-2 py-1 text-start">3D</td>
              <td className="border px-2 py-1 text-start">Description notes</td>
              <td className="border px-2 py-1 text-start">70,000</td>
            </tr>
            
            {emptyRows.map((_, index) => (
              <tr key={index}>
                <td className="border h-8"></td>
                <td className="border"></td>
                <td className="border"></td>
                <td className="border"></td>
                <td className="border"></td>
                <td className="border"></td>
              </tr>
            ))}
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
          <p className="border w-full mt-2 p-7"></p>
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