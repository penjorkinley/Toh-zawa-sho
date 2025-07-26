// components/restaurant-details-modal/registration-detail-modal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/shadcn-button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  X,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface PendingRegistration {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  location: string;
  submittedDate: string;
  licenseDocument: string;
  coverPhoto?: string;
  logo?: string;
  description: string;
  openingHours: {
    days: string[];
    openTime: string;
    closeTime: string;
  };
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
  const [showConfirmDialog, setShowConfirmDialog] = useState<
    "approve" | "reject" | null
  >(null);

  if (!registration) return null;

  const handleApprove = () => {
    onApprove(registration.id);
    setShowConfirmDialog(null);
    onClose();
  };

  const handleReject = () => {
    onReject(registration.id);
    setShowConfirmDialog(null);
    onClose();
  };

  return (
    <>
      {/* Main Detail Modal */}
      <Dialog open={isOpen && !showConfirmDialog} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Registration Details - {registration.businessName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 p-2">
            {/* Business Images */}
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
                    <p className="font-medium">{registration.businessName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Owner Name
                    </h4>
                    <p>{registration.ownerName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Business Type
                    </h4>
                    <Badge variant="outline" className="mt-1">
                      {registration.businessType}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Email
                    </h4>
                    <p>{registration.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Phone
                    </h4>
                    <p>{registration.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Submitted Date
                    </h4>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <p className="text-sm">{registration.submittedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium border-b pb-2">Location</h3>
              <p className="bg-muted p-3 rounded-lg">{registration.location}</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium border-b pb-2">Description</h3>
              <p className="bg-muted p-3 rounded-lg text-sm leading-relaxed">
                {registration.description}
              </p>
            </div>

            {/* Opening Hours */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium border-b pb-2">
                Operating Hours
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Operating Days
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {registration.openingHours.days.map((day) => (
                        <Badge
                          key={day}
                          variant="secondary"
                          className="text-xs"
                        >
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Operating Hours
                    </h4>
                    <p className="text-sm font-medium">
                      {registration.openingHours.openTime} -{" "}
                      {registration.openingHours.closeTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* License Document */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium border-b pb-2">
                License Document
              </h3>
              <div className="bg-muted p-4 rounded-lg">
                <Button variant="outline" className="w-full md:w-auto">
                  <FileText className="h-4 w-4 mr-2" />
                  View License Document
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Click to open and verify the business license
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              variant="destructive"
              className="flex-1 h-12 text-base font-medium"
              onClick={() => setShowConfirmDialog("reject")}
            >
              <X className="h-5 w-5 mr-2" />
              Reject Registration
            </Button>
            <Button
              className="flex-1 h-12 text-base font-medium bg-green-600 hover:bg-green-700"
              onClick={() => setShowConfirmDialog("approve")}
            >
              <Check className="h-5 w-5 mr-2" />
              Approve Registration
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog === "approve"}
        onOpenChange={() => setShowConfirmDialog(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Approve Registration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to approve the registration for{" "}
              <strong>{registration.businessName}</strong>?
            </p>
            <p className="text-sm text-muted-foreground">
              This will activate their account and they will be able to access
              the platform.
            </p>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmDialog(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
              >
                <Check className="h-4 w-4 mr-2" />
                Yes, Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog === "reject"}
        onOpenChange={() => setShowConfirmDialog(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Reject Registration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to reject the registration for{" "}
              <strong>{registration.businessName}</strong>?
            </p>
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              ⚠️ This action cannot be undone. The applicant will be notified of
              the rejection.
            </p>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmDialog(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReject}
              >
                <X className="h-4 w-4 mr-2" />
                Yes, Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
