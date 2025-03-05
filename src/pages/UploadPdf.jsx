import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function PrintOptions() {
  const { order, updateOrder } = useOrder();
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleNext = () => {
    if (!selectedFile) {
      toast.error("Please select at least one file before proceeding.");
      return;
    }

    updateOrder({
      ...order,
      file: selectedFile,
      filename: { name: selectedFile.name },
    });

    navigate("/settings");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Upload</CardTitle>
            <CardDescription>
              Upload your PDF before you can proceed to settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center">
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
              <div>
                {selectedFile ? (
                  <Badge className="bg-green-500 text-white">uploaded</Badge>
                ) : (
                  <Badge variant="destructive">No file uploaded</Badge>
                )}
              </div>
              <Button onClick={handleNext} disabled={!selectedFile}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
