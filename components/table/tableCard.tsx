// components/table/tableCard.tsx - COMPLETE FILE WITH TEMPLATE SUPPORT
"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/shadcn-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit,
  Trash2,
  QrCode as QrCodeIcon,
  Download,
  Loader2,
} from "lucide-react";
import { RestaurantTable } from "@/lib/types/table-management";
import {
  createTable,
  updateTable,
  deleteTable,
  generateTableQRCode,
  generateTableQRCodeWithTemplate,
} from "@/lib/actions/table/actions";
import {
  generateQRCodeTemplate,
  QRTemplateData,
} from "@/lib/utils/qr-template-generator";
import FloatingLabelInput from "@/components/floating-label-input";
import toast from "react-hot-toast";

interface TableCardProps {
  table?: RestaurantTable;
  isNew?: boolean;
  onDelete?: (id: string) => void;
  onUpdate?: () => void;
}

export default function TableCard({
  table,
  isNew = false,
  onDelete,
  onUpdate,
}: TableCardProps) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [tableNumber, setTableNumber] = useState(table?.table_number || "");
  const [showQR, setShowQR] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{
    dataUrl: string;
    menuUrl: string;
  } | null>(null);
  const [templateDataUrl, setTemplateDataUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const handleSave = () => {
    if (!tableNumber.trim()) {
      toast.error("Table number is required");
      return;
    }

    startTransition(async () => {
      try {
        let result;

        if (isNew) {
          result = await createTable({
            table_number: tableNumber.trim(),
            is_active: true,
          });
        } else if (table) {
          result = await updateTable(table.id, {
            table_number: tableNumber.trim(),
          });
        }

        if (result?.success) {
          toast.success(
            isNew ? "Table created successfully" : "Table updated successfully"
          );
          setIsEditing(false);
          onUpdate?.();
        } else {
          toast.error(result?.error || "Failed to save table");
        }
      } catch (error) {
        console.error("Error saving table:", error);
        toast.error("Failed to save table");
      }
    });
  };

  const handleCancel = () => {
    setTableNumber(table?.table_number || "");
    setIsEditing(false);
    if (isNew) {
      onUpdate?.();
    }
  };

  const handleDelete = () => {
    if (!table) return;

    // Show confirmation dialog
    const confirmed = confirm(
      `Are you sure you want to delete Table ${table.table_number}? This action cannot be undone.`
    );

    if (!confirmed) return;

    startTransition(async () => {
      try {
        const result = await deleteTable(table.id);
        if (result.success) {
          toast.success("Table deleted successfully");
          onDelete?.(table.id);
        } else {
          toast.error(result.error || "Failed to delete table");
        }
      } catch (error) {
        console.error("Error deleting table:", error);
        toast.error("Failed to delete table");
      }
    });
  };

  const handleGenerateQR = async () => {
    if (!table) return;

    setIsGeneratingQR(true);
    try {
      // Use the new template-enabled function
      const result = await generateTableQRCodeWithTemplate(table.id);
      if (
        result.success &&
        result.qrCodeDataUrl &&
        result.menuUrl &&
        result.restaurantName
      ) {
        setQrCodeData({
          dataUrl: result.qrCodeDataUrl,
          menuUrl: result.menuUrl,
        });

        // Generate the beautiful template
        const templateData: QRTemplateData = {
          restaurantName: result.restaurantName || "Default Restaurant Name",
          tableNumber: table.table_number,
          qrCodeDataUrl: result.qrCodeDataUrl,
          menuUrl: result.menuUrl,
        };

        // console.log("Template data being passed:", templateData);

        try {
          const templateUrl = await generateQRCodeTemplate(templateData);
          setTemplateDataUrl(templateUrl);
        } catch (templateError) {
          console.error("Error generating template:", templateError);
          toast.error("QR generated but template creation failed");
        }

        setShowQR(true);
      } else {
        toast.error(result.error || "Failed to generate QR code");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleDownloadQR = () => {
    if (!table) return;

    try {
      const link = document.createElement("a");

      // Use template if available, otherwise fall back to basic QR
      if (templateDataUrl) {
        link.download = `${table.table_number}-menu-qr-card.png`;
        link.href = templateDataUrl;
        toast.success("QR code card downloaded successfully!");
      } else if (qrCodeData) {
        link.download = `table-${table.table_number}-qr-code.png`;
        link.href = qrCodeData.dataUrl;
        toast.success("QR code downloaded successfully");
      } else {
        toast.error("No QR code available to download");
        return;
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  if (isEditing) {
    return (
      <Card className="rounded-xl p-4 shadow-md w-full">
        <div className="flex flex-col gap-4">
          <FloatingLabelInput
            label="Table Number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
          />
          <div className="flex justify-between items-center gap-2 w-full">
            <Button
              variant="ghost"
              className="text-primary underline"
              onClick={handleGenerateQR}
              disabled={isPending || !table || isGeneratingQR}
            >
              {isGeneratingQR ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate QR"
              )}
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                className="border-primary text-primary w-20"
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="bg-primary text-white w-20"
                onClick={handleSave}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-xl p-4 shadow-md w-full">
        <div className="flex justify-between items-center w-full">
          <p className="text-lg">Table {tableNumber}</p>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleGenerateQR}
              disabled={isGeneratingQR}
            >
              {isGeneratingQR ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <QrCodeIcon className="h-4 w-4" />
              )}
              <span className="sr-only">Generate QR</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
              disabled={isPending}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Table {table?.table_number} QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            {qrCodeData ? (
              <>
                {/* Template Preview */}
                {templateDataUrl ? (
                  <div className="flex items-center justify-center border rounded-lg bg-white p-4">
                    <img
                      src={templateDataUrl}
                      alt={`QR Code Card for Table ${table?.table_number}`}
                      className="max-w-full max-h-96 object-contain"
                      style={{ maxWidth: "300px" }}
                    />
                  </div>
                ) : (
                  // Fallback to basic QR if template failed
                  <div className="w-64 h-64 flex items-center justify-center border rounded-lg">
                    <img
                      src={qrCodeData.dataUrl}
                      alt={`QR Code for Table ${table?.table_number}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div className="flex justify-center w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleDownloadQR}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Card
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-64 h-64 bg-muted flex items-center justify-center">
                <QrCodeIcon className="w-32 h-32 text-muted-foreground" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
