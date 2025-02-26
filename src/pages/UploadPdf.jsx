import { useState } from 'react';

const UploadPdf = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-cyan-500 p-6 rounded-2xl shadow-lg w-80 text-center">
          <h1 className="text-lg font-semibold">Upload your PDFs</h1>
          <div className="mt-4 flex items-center space-x-2">
            <input 
              type="file" 
              accept=".pdf" 
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
            <span>{selectedFile ? selectedFile.name : "No file chosen"}</span>
          </div>
          {!selectedFile && <p className="mt-2 text-red-500">No files uploaded</p>}
          <br/>
          <button className="btn btn-soft btn-Secondary">Submit Files</button>
      </div>
    </div>
  );
};

export default UploadPdf;