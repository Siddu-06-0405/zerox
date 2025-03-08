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

import * as pdfjsLib from "pdfjs-dist/build/pdf";

import pdfWorker from "pdfjs-dist/build/pdf.worker?url"; 
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function UploadPdf() {
  const { order, updateOrder } = useOrder();
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setLoading(true);

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async (e) => {
        const pdfData = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

        const totalPages = pdf.numPages; // ✅ Extract total pages
        setPageCount(totalPages); // ✅ Update local state

        updateOrder({
          ...order,
          file,
          filename: file.name,
          maxPage: totalPages, // ✅ Store total pages in OrderContext
          totalNoOfPages: totalPages, // ✅ Default to total pages
        });

        setLoading(false);
      };
    } catch (error) {
      console.error("Error reading PDF:", error);
      toast.error("Failed to read PDF.");
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!selectedFile) {
      toast.error("Please upload a PDF before proceeding.");
      return;
    }

    navigate("/settings");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Upload PDF</CardTitle>
            <CardDescription>
              Upload your PDF to proceed to print settings.
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
                  <Badge className="bg-green-500 text-white">
                    Uploaded ({loading ? "Loading..." : `${pageCount} pages`})
                  </Badge>
                ) : (
                  <Badge variant="destructive">No file uploaded</Badge>
                )}
              </div>
              <Button onClick={handleNext} disabled={!selectedFile || loading}>
                {loading ? "Processing..." : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
