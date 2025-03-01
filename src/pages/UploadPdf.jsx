import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

const UploadPdf = () => {
  const { order, updateOrder } = useOrder();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    if (files.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]); // Append new files
    }
  };

  // Handle file submission
  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file before submitting.");
      return;
    }

    // Update order context with selected files & count
    updateOrder({ 
      files: [...order.files, ...selectedFiles], 
      pdfCount: order.pdfCount + selectedFiles.length 
    });

    // Ensure state updates before navigating
    setTimeout(() => {
      navigate("/");
    }, 100);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-cyan-500 p-6 rounded-2xl shadow-lg w-80 text-center">
        <h1 className="text-lg font-semibold">Upload your PDFs</h1>
        <div className="mt-4 flex items-center space-x-2">
          <input 
            type="file" 
            accept=".pdf" 
            multiple // ✅ Allow multiple file selection
            onChange={handleFileChange} 
            className="hidden" 
            id="file-upload"
          />
          <label 
            htmlFor="file-upload" 
            className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          >
            Choose Files
          </label>
        </div>
        
        {/* Display selected file names */}
        <div className="mt-2">
          {selectedFiles.length > 0 ? (
            <ul className="text-sm text-gray-800">
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-red-500">No files uploaded</p>
          )}
        </div>

        <button 
          onClick={handleSubmit} 
          className="btn btn-soft btn-secondary mt-4"
        >
          Submit Files
        </button>
      </div>
    </div>
  );
};

export default UploadPdf;
