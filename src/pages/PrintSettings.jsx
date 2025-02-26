import { useState } from "react";

const PrintSettings = () => {
  const [copyNumber, setCopyNumber] = useState(0);
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-cyan-500 p-6 rounded-2xl shadow-lg w-80 text-center">
      <button className="btn btn-neutral m-4">Upload PDF</button>
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-700">No. of Copies</div>
          <div>
              <button
                className="btn btn-neutral m-4"
                onClick={() => setCopyNumber((prev) => prev !== 0 ? prev - 1 : prev)}
              >
                -
              </button>
              {copyNumber}
              <button
                className="btn btn-neutral m-4"
                onClick={() => setCopyNumber((prev) => prev + 1)}
              >
                +
              </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg text-gray-700 font-semibold">print type</div>
          <div>
          <select className="w-full mt-1 p-2 border rounded-lg">
            <option>Single side</option>
          </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg text-gray-700 font-semibold">color option</div>
          <div>
          <select className="w-full mt-1 p-2 border rounded-lg">
            <option>black & white</option>
          </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg text-gray-700 font-semibold">required before</div>
          <div>
          <input aria-label="Time" type="time" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintSettings;