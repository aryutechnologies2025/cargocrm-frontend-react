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

  return (
    <div className="p-6">

      {/* DOWNLOAD BUTTON */}
      <button
        onClick={downloadPDF}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download PDF
      </button>

      {/* PDF CONTENT */}
      <div
        ref={pdfRef}
        className="bg-white p-6 border w-[800px] mx-auto text-sm"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-purple-700">
            CARGO RECEIPT
          </h1>

          <img src={cargo} alt="logo" className="h-12" />
        </div>

        {/* Receipt Details */}
        <div className="flex justify-between border p-3 mb-4">
          <div>
            <p>Receipt Number</p>
            <p>Receipt Date</p>
            <p>Payment Method</p>
          </div>

          <div>
            <p>001</p>
            <p>12-02-2026</p>
            <p>Cash</p>
          </div>
        </div>

        {/* Seller + Customer */}
        <div className="flex gap-4 mb-4">
          <div className="border w-1/2 p-3">
            <h3 className="font-semibold mb-2">SELLER</h3>
            <p>Cargo Lord Pvt Ltd</p>
            <p>Address Line 1</p>
            <p>Address Line 2</p>
            <p>Chennai</p>
          </div>

          <div className="border w-1/2 p-3">
            <h3 className="font-semibold mb-2">CUSTOMER</h3>
            <p>Customer Name</p>
            <p>Customer Address 1</p>
            <p>Customer Address 2</p>
            <p>India</p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full border mb-4">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Description</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Unit Price</th>
              <th className="border p-2">Subtotal</th>
              <th className="border p-2">Tax</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border p-2">Cargo Service</td>
              <td className="border p-2">3 Hours</td>
              <td className="border p-2">100</td>
              <td className="border p-2">300</td>
              <td className="border p-2">30</td>
            </tr>
          </tbody>
        </table>

        {/* Total Section */}
        <div className="text-right">
          <p>Subtotal: $300</p>
          <p>Tax (10%): $30</p>
          <p className="font-bold">Total: $330</p>
        </div>

        {/* Notes */}
        <div className="border mt-6 p-3">
          <p>Notes:</p>
        </div>

        {/* Signature */}
        <div className="flex justify-between mt-10">
          <div>
            <p>____________________</p>
            <p>Salesperson</p>
          </div>

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