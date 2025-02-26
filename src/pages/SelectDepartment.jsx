import { useState } from "react";

const SelectDepartment = () => {
  const [ChemicalNumber, setChemicalNumber] = useState(0);
  const [CivilNumber, setCivilNumber] = useState(0);
  const [MechanicalNumber, setMechanicalNumber] = useState(0);
  const [CseNumber, setCseNumber] = useState(0);
  const [MncNumber, setMncNumber] = useState(0);
  const [EceNumber, setEceNumber] = useState(0);
  const [VlsiNumber, setVlsiNumber] = useState(0);
  const [EeeNumber, setEeeNumber] = useState(0);
  return (
    <div className="flex justify-center items-center min-h-screen w-screen">
      <div className="bg-cyan-500 rounded-2xl shadow-lg p-6 text-center">
      <h1 className="font-bold text">Select Department</h1>
        <div className="flex justify-between items-center">
          <div className="text-lg whitespace-nowrap font-semibold text-gray-700">Chemical Engineering</div>
          <div>
              <button
                className="btn btn-neutral m-4"
                onClick={() => setChemicalNumber((prev) => prev !== 0 ? prev - 1 : prev)}
              >
                -
              </button>
              {ChemicalNumber}
              <button
                className="btn btn-neutral m-4"
                onClick={() => setChemicalNumber((prev) => prev + 1)}
              >
                +
              </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg whitespace-nowrap text-gray-700 font-semibold">Civil Engineering</div>
          <div>
              <button
                className="btn btn-neutral m-4"
                onClick={() => setCivilNumber((prev) => (prev !== 0 ? prev - 1 : prev))}
              >
                -
              </button>
              {CivilNumber}
              <button
                className="btn btn-neutral m-4"
                onClick={() => setCivilNumber((prev) => prev + 1)}
              >
                +
              </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg whitespace-nowrap text-gray-700 font-semibold">Mechanical Engineering</div>
          <div>
              <button
                className="btn btn-neutral m-4"
                onClick={() => setMechanicalNumber((prev) => (prev !== 0 ? prev - 1 : prev))}
              >
                -
              </button>
              {MechanicalNumber}
              <button
                className="btn btn-neutral m-4"
                onClick={() => setMechanicalNumber((prev) => prev + 1)}
              >
                +
              </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg whitespace-nowrap text-gray-700 font-semibold">Cse</div>
          <div>
              <button
                className="btn btn-neutral m-4"
                onClick={() => setCseNumber((prev) => (prev !== 0 ? prev - 1 : prev))}
              >
                -
              </button>
              {CseNumber}
              <button
                className="btn btn-neutral m-4"
                onClick={() => setCseNumber((prev) => prev + 1)}
              >
                +
              </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg whitespace-nowrap text-gray-700 font-semibold">mnc</div>
          <div>
              <button
                className="btn btn-neutral m-4"
                onClick={() => setMncNumber((prev) => (prev !== 0 ? prev - 1 : prev))}
              >
                -
              </button>
              {MncNumber}
              <button
                className="btn btn-neutral m-4"
                onClick={() => setMncNumber((prev) => prev + 1)}
              >
                +
              </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg whitespace-nowrap text-gray-700 font-semibold">ece</div>
          <div>
              <button
                className="btn btn-neutral m-4"
                onClick={() => setEceNumber((prev) => (prev !== 0 ? prev - 1 : prev))}
              >
                -
              </button>
              {EceNumber}
              <button
                className="btn btn-neutral m-4"
                onClick={() => setEceNumber((prev) => prev + 1)}
              >
                +
              </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg whitespace-nowrap text-gray-700 font-semibold">ece Vlsi</div>
          <div>
              <button
                className="btn btn-neutral m-4"
                onClick={() => setVlsiNumber((prev) => (prev !== 0 ? prev - 1 : prev))}
              >
                -
              </button>
              {VlsiNumber}
              <button
                className="btn btn-neutral m-4"
                onClick={() => setVlsiNumber((prev) => prev + 1)}
              >
                +
              </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg whitespace-nowrap text-gray-700 font-semibold">eee</div>
          <div>
              <button
                className="btn btn-neutral m-4"
                onClick={() => setEeeNumber((prev) => (prev !== 0 ? prev - 1 : prev))}
              >
                -
              </button>
              {EeeNumber}
              <button
                className="btn btn-neutral m-4"
                onClick={() => setEeeNumber((prev) => prev + 1)}
              >
                +
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectDepartment;