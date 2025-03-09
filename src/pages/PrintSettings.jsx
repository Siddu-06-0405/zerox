import { useOrder } from "../context/OrderContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PrintSettings = () => {
  const { order, updateOrder } = useOrder();
  const navigate = useNavigate();
  const [minPickupTime, setMinPickupTime] = useState("");
  const [loading, setLoading] = useState(false);

  
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

    // console.log(minPickupTime)

  const handleNext = async () => {
    setLoading(true);

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
    navigate("/cart");
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{order.file?.name || "No file selected"}</CardTitle>
            <CardDescription>
              Configure your print options below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* No. of Copies */}
            <div>
              <Label className="mb-2">No. of Copies</Label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    updateOrder({
                      copyNumber: Math.max(1, order.copyNumber - 1),
                    })
                  }
                >
                  <Minus size={12} />
                </Button>
                <span className="text-l font-semibold">{order.copyNumber}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    updateOrder({ copyNumber: order.copyNumber + 1 })
                  }
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Print Type */}
            <div>
              <Label className="mb-2">Print Type</Label>
              <Select
                value={order.printType}
                onValueChange={(value) => updateOrder({ printType: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Print Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single side">Single side</SelectItem>
                  <SelectItem value="Double side">Double side</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color Option */}
            <div>
              <Label className="mb-2">Color Option</Label>
              <Select
                value={order.colorOption}
                onValueChange={(value) => updateOrder({ colorOption: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Color Option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Black & White">Black & White</SelectItem>
                  <SelectItem value="Color">Color</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Page Selection</Label>
              <Select
                value={order.pageSelection}
                onValueChange={(value) => updateOrder({ pageSelection: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Page Option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  <SelectItem value="custom">Custom Pages</SelectItem>
                  <SelectItem value="odd">Odd Pages</SelectItem>
                  <SelectItem value="even">Even Pages</SelectItem>
                  <SelectItem value="range">Start & End Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Page Selection */}
            {order.pageSelection === "custom" && (
              <div>
                <Label>Enter Custom Pages (comma-separated)</Label>
                <Input
                  type="text"
                  placeholder="e.g. 1,3,5,7"
                  value={order.customPages}
                  onChange={(e) =>
                    updateOrder({ customPages: e.target.value })
                  }
                />
              </div>
            )}

            {/* Start & End Page Selection */}
            {order.pageSelection === "range" && (
              <div className="flex space-x-4">
                <div>
                  <Label>Start Page</Label>
                  <Input
                    type="number"
                    min="1"
                    value={order.startPage || ""}
                    onChange={(e) =>
                      updateOrder({ startPage: parseInt(e.target.value) || "" })
                    }
                  />
                </div>
                <div>
                  <Label>End Page</Label>
                  <Input
                    type="number"
                    min={order.startPage || 1}
                    value={order.endPage || ""}
                    onChange={(e) =>
                      updateOrder({
                        endPage: parseInt(e.target.value) || "",
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* Total Pages */}
            <div>
              <Label className="mb-2">
                Total Pages : {order.totalNoOfPages || ""}
              </Label>
            </div>

            <div>
              <Label className="mb-2">
                Estimated Time for printing your order : {order.estimatedTime/60<1?order.estimatedTime+" seconds": order.estimatedTime/60+" minutes"} 
              </Label>
            </div>
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
          </CardContent>
          <CardFooter>
          <Button onClick={handleNext} className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PrintSettings;
