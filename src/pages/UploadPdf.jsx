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
import toast from "react-hot-toast";

export default function PrintOptions() {
  const { order, updateOrder } = useOrder();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleNext = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file before proceeding.");
      return;
    }
    updateOrder({
      files: [...order.files, ...selectedFiles],
      pdfCount: order.pdfCount + selectedFiles.length,
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
                  id="picture"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
              <div>
                {selectedFiles.length > 0 ? (
                  <ul className="text-sm">
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                ) : (
                  <Badge variant="destructive">No files uploaded</Badge>
                )}
              </div>
              <Button onClick={handleNext} disabled={selectedFiles.length === 0}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
