import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

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
  const navigate = useNavigate();
  const { order, updateOrder } = useOrder();
  const departmentCounts = order.departments || {}; // Get existing data

  const updateCount = (dept, increment) => {
    const newCount = Math.max(0, (departmentCounts[dept] || 0) + increment);
    updateOrder({ departments: { ...departmentCounts, [dept]: newCount } });
  };

  const handleNext = () => {
    updateOrder({ departments: departmentCounts });

    // Ensure state updates before navigating
    setTimeout(() => {
      navigate("/");
    }, 100); // Delay to ensure state update
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen">
      <div className="bg-cyan-500 rounded-2xl shadow-lg p-6 text-center">
        <h1 className="font-bold text-xl mb-4">Select Department</h1>

        {departments.map((dept) => (
          <div key={dept} className="flex justify-between items-center mb-3">
            <div className="text-lg font-semibold text-gray-700">{dept}</div>
            <div>
              <button className="btn btn-neutral m-4" onClick={() => updateCount(dept, -1)}>-</button>
              {departmentCounts[dept] || 0}
              <button className="btn btn-neutral m-4" onClick={() => updateCount(dept, 1)}>+</button>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <button className="btn btn-neutral" onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default SelectDepartment;
