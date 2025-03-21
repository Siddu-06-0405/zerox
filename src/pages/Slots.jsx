import { useState, useEffect } from "react";
import { useOrder } from "../context/OrderContext"; // Import order context
import moment from "moment";

const SlotSelection = () => {
  const { order } = useOrder(); // Get order details
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch("/api/orders/slots");
        const data = await response.json();
        setSlots(data);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
  }, []);

  // Function to calculate remaining pages a slot can handle
  const calculateRemainingPages = (slot) => {
    const maxPagesPerSlot = 80; // Each slot can handle up to 80 pages
    const usedPages = slot.count * 80; // Estimate based on existing orders
    return Math.max(0, maxPagesPerSlot - usedPages);
  };

  // Handle slot selection
  const handleSlotSelection = (slot) => {
    if (order.totalNoOfPages > calculateRemainingPages(slot)) {
      alert("Not enough space in this slot! Please choose another.");
      return;
    }
    setSelectedSlot(slot.start);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Select a Printing Slot</h2>
      <div className="grid grid-cols-3 gap-4">
        {slots.map((slot, index) => {
          const remainingPages = calculateRemainingPages(slot);
          return (
            <button
              key={index}
              className={`p-2 rounded-lg border text-sm ${
                selectedSlot === slot.start
                  ? "bg-blue-500 text-black"
                  : remainingPages > 0
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-200 cursor-not-allowed"
              }`}
              onClick={() => handleSlotSelection(slot)}
              disabled={remainingPages === 0}
            >
              {moment(slot.start).format("hh:mm A")} -{" "}
              {moment(slot.end).format("hh:mm A")} <br />
              <span className="text-xs">
                {remainingPages > 0
                  ? `Available: ${remainingPages} pages`
                  : "Slot Full"}
              </span>
            </button>
          );
        })}
      </div>
      {selectedSlot && (
        <p className="mt-4 text-green-700">
          Selected Slot: {moment(selectedSlot).format("hh:mm A")}
        </p>
      )}
    </div>
  );
};

export default SlotSelection;