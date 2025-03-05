import { useOrder } from "../context/OrderContext";
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

  const handleNext = () => {
    if (
      !order.copyNumber ||
      !order.printType ||
      !order.colorOption ||
      !order.startPage ||
      !order.endPage ||
      !order.totalNoOfPages
    ) {
      alert("Please complete all print settings before proceeding.");
      return;
    }
    navigate("/cart");
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>{order.file.name}</CardTitle>
            <CardDescription>Configure your print options below.</CardDescription>
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

            {/* Start Page */}
            <div>
              <Label className="mb-2">Start Page</Label>
              <Input
                type="number"
                min="1"
                value={order.startPage || ""}
                onChange={(e) => updateOrder({ startPage: parseInt(e.target.value) || "" })}
              />
            </div>

            {/* End Page */}
            <div>
              <Label className="mb-2">End Page</Label>
              <Input
                type="number"
                min={order.startPage || 1}
                value={order.endPage || ""}
                onChange={(e) => {
                  const endPage = parseInt(e.target.value) || "";
                  updateOrder({
                    endPage,
                    totalNoOfPages: order.startPage ? endPage - order.startPage + 1 : "",
                  });
                }}
              />
            </div>

            {/* Total Pages */}
            <div>
              <Label className="mb-2">Total Pages : {order.totalNoOfPages || ""}</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleNext} className="w-full">
              Next
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PrintSettings;