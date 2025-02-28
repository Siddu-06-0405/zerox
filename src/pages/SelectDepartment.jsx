import { useState } from "react";

const departments = [
  "Chemical Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
  "CSE",
  "MNC",
  "ECE",
  "ECE VLSI",
  "EEE",
];

const SelectDepartment = () => {
  const [departmentCounts, setDepartmentCounts] = useState(
    departments.reduce((acc, dept) => ({ ...acc, [dept]: 0 }), {})
  );

  const updateCount = (dept, increment) => {
    setDepartmentCounts((prev) => ({
      ...prev,
      [dept]: Math.max(0, prev[dept] + increment),
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen">
      <div className="bg-cyan-500 rounded-2xl shadow-lg p-6 text-center">
        <h1 className="font-bold text-xl mb-4">Select Department</h1>

        {departments.map((dept) => (
          <div key={dept} className="flex justify-between items-center mb-3">
            <div className="text-lg whitespace-nowrap font-semibold text-gray-700">{dept}</div>
            <div>
              <button className="btn btn-neutral m-4" onClick={() => updateCount(dept, -1)}>-</button>
              {departmentCounts[dept]}
              <button className="btn btn-neutral m-4" onClick={() => updateCount(dept, 1)}>+</button>
            </div>
          </div>
        ))}

        {/* Next Button */}
        <div className="mt-4">
          <a href="/cart">
            <button className="btn btn-neutral">Next</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SelectDepartment;
