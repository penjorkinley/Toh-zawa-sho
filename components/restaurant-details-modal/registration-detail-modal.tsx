// components/restaurant-details-modal/registration-detail-modal.tsx
"use client";

import { Button } from "@/components/ui/shadcn-button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Calendar, FileText, ExternalLink } from "lucide-react";

interface PendingRegistration {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  submittedDate: string;
  licenseDocument: string;
  coverPhoto?: string;
  logo?: string;
}

interface RegistrationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: PendingRegistration | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function RegistrationDetailModal({
  isOpen,
  onClose,
  registration,
  onApprove,
  onReject,
}: RegistrationDetailModalProps) {
  if (!registration) return null;

  const handleApprove = () => {
    onApprove(registration.id);
    onClose();
  };

  const handleReject = () => {
    onReject(registration.id);
    onClose();
  };

  const handleViewLicense = () => {
    if (registration.licenseDocument) {
      window.open(registration.licenseDocument, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Registration Details - {registration.businessName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Business Images - Only show if available */}
          {(registration.coverPhoto || registration.logo) && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Business Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registration.coverPhoto && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                      Cover Photo
                    </h4>
                    <img
                      src={registration.coverPhoto}
                      alt="Cover"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {registration.logo && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                      Logo
                    </h4>
                    <img
                      src={registration.logo}
                      alt="Logo"
                      className="w-32 h-32 object-cover rounded-lg border mx-auto md:mx-0"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">
              Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Business Name
                  </h4>
                  <p className="font-medium text-lg">
                    {registration.businessName}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Email Address
                  </h4>
                  <p className="font-medium">{registration.email}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Phone Number
                  </h4>
                  <p className="font-medium">{registration.phone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Business Type
                  </h4>
                  <Badge variant="outline" className="mt-1">
                    {registration.businessType}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Submitted Date
                  </h4>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {registration.submittedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* License Document */}
          {registration.licenseDocument && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium border-b pb-2">
                Business License Document
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Business License</p>
                      <p className="text-xs text-muted-foreground">
                        Click to open and verify the business license document
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewLicense}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Document
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Simple, no custom dialogs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button
            variant="destructive"
            className="flex-1 h-12 text-base font-medium"
            onClick={handleReject}
          >
            <X className="h-5 w-5 mr-2" />
            Reject Registration
          </Button>
          <Button
            className="flex-1 h-12 text-base font-medium bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
          >
            <Check className="h-5 w-5 mr-2" />
            Approve Registration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
