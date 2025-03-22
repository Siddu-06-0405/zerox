import { useState, useEffect } from "react";
import { useOrder } from "../context/OrderContext"; // Import order context
import { useNavigate } from "react-router-dom"; // Import the navigation hook from React Router
import moment from "moment";

const SlotSelection = () => {
  const { order, updateOrder } = useOrder(); // Get order details and update function
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate(); // Initialize navigate function

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
    const duration = 14 * 60; // Each slot can handle up to 80 pages (15 minutes * 60 seconds)
    const timeCompleted = (slot.timeCompleted + slot.count) * 60; // Total time for orders in that slot (in seconds)
    return Math.max(0, (duration - timeCompleted) / 3); // Assuming each page takes 3 seconds
  };

  // Handle slot selection
  const handleSlotSelection = (slot) => {
    if (order.totalNoOfPages > calculateRemainingPages(slot)) {
      alert("Not enough space in this slot! Please choose another.");
      return;
    }

    // Calculate requiredBefore
    const slotStartTime = moment(slot.start); // Slot start time
    const timeCompletedInMinutes = slot.timeCompleted; // Time spent in the slot (in minutes)
    const estimatedTimeInSeconds = order.estimatedTime; // Estimated time of the order (in seconds)

    const requiredBefore = slotStartTime
      .add(timeCompletedInMinutes, "minutes")
      .add(estimatedTimeInSeconds, "seconds")
      .format("HH:mm"); // Format the result as "HH:mm"

    // Update the order's requiredBefore value
    updateOrder({ requiredBefore });

    // Navigate to the /cart page
    navigate("/cart");
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
                  : remainingPages > 0 && remainingPages>=order.totalNoOfPages
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-200 cursor-not-allowed"
              }`}
              onClick={() => handleSlotSelection(slot)}
              disabled={remainingPages === 0 || remainingPages<order.totalNoOfPages}
            >
              {moment(slot.start).format("hh:mm A")} -{" "}
              {moment(slot.end).format("hh:mm A")} <br />
              <span className="text-xs">
                {remainingPages > 0
                  ? `Available: ${remainingPages} pages`
                  : "Slot Full"}
              </span>
              <span className="text-xs">
                {slot.timeCompleted}
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