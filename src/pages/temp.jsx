const [loading, setLoading] = useState(false);
const [minPickupTime, setMinPickupTime] = useState("");
await fetchPendingTime();
    if (
      !order.copyNumber ||
      !order.printType ||
      !order.colorOption ||
      !order.totalNoOfPages ||
      !order.requiredBefore
    ) {
      alert("Please complete all print settings before proceeding.");
      return;
    }
    if (order.requiredBefore && order.requiredBefore < minPickupTime) {
      alert(`Please select a valid future time after ${minPickupTime}`);
      return;
    }
  
    const fetchPendingTime = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("print-user"));
    
        if (!user || !user.token) {
          toast.error("You need to log in first!");
          return;
        }
        const response = await fetch(
          "http://localhost:5001/api/orders/pending-time",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = await response.json();

        const additionalTime = data.totalEstimatedTime; // Pending orders' estimated time
        const now = new Date();
        now.setMinutes(now.getMinutes() + Math.round(additionalTime / 60)+Math.round(order.estimatedTime / 60)+2);

        const newHours = now.getHours().toString().padStart(2, "0");
        const newMinutes = now.getMinutes().toString().padStart(2, "0");

        setMinPickupTime(`${newHours}:${newMinutes}`);
      } catch (error) {
        console.error("Error fetching estimated time:", error);
      }
      setLoading(false);
    };
    fetchPendingTime();

    
            {/* Pick Up Time */}
            <div>
              <Label className="mb-2">Pick-up Time or Required Before</Label>
              <Input
                type="time"
                value={order.requiredBefore || ""}
                onChange={(e) =>
                  updateOrder({ requiredBefore: e.target.value })
                }
              />
            </div>

    // console.log(minPickupTime)