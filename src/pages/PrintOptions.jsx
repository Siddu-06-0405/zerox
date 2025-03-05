import { useNavigate, Link } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { useOrder } from "../context/OrderContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PrintOptions() {
  const { order, updateOrder } = useOrder();
  const navigate = useNavigate();

  const handleFileUpload = () => {
    navigate("/upload");
  };

  return (  <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Upload</CardTitle>
          <CardDescription>
            upload your pdf before you can proceed to settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Print PDF Section */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Print PDF</span>
              <Button variant="outline" onClick={handleFileUpload}>
                Upload PDF
              </Button>
            </div>

            {/* Record Papers Section */}
            {/* <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Record Papers</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="p-2 rounded-full"
                  onClick={() =>
                    updateOrder({
                      recordPapers: Math.max(0, order.recordPapers - 1),
                    })
                  }
                >
                  <Minus size={16} />
                </Button>
                <span className="text-lg font-semibold">
                  {order.recordPapers}
                </span>
                <Button
                  variant="ghost"
                  className="p-2 rounded-full"
                  onClick={() =>
                    updateOrder({ recordPapers: order.recordPapers + 1 })
                  }
                >
                  <Plus size={16} />
                </Button>
            </div>  
              </div> */}

            {/* Front Papers for Records Section */}
            {/* <div className="flex items-center justify-between">
              <span className="text-lg font-medium">
                Front Papers for Records
              </span>
              <Button
                variant={order.frontPapers ? "default" : "outline"}
                onClick={() => {
                  navigate("/department");
                  updateOrder({ frontPapers: !order.frontPapers });
                }}
              >
                {order.frontPapers ? "Selected" : "Select"}
              </Button>
            </div> */}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">

          <Link to="/settings">
            <Button variant="outline">Next</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  </div>
  );
}
