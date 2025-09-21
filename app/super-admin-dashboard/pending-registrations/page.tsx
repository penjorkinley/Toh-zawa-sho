// app/super-admin-dashboard/pending-registrations/page.tsx - Approach 1: Auto-delete
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/shadcn-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RegistrationDetailModal from "@/components/restaurant-details-modal/registration-detail-modal";
import RejectionReasonModal from "@/components/rejection-reason-modal";
import toast from "react-hot-toast";
import {
  Eye,
  Check,
  X,
  Clock,
  Mail,
  Phone,
  Calendar,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Database interface (from your API)
interface SignupRequest {
  id: string;
  user_id: string;
  business_name: string;
  email: string;
  phone_number: string;
  business_license_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

// Modal interface (what the modal expects)
interface ModalPendingRegistration {
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

export default function PendingRegistrationsPage() {
  const [selectedRegistration, setSelectedRegistration] =
    useState<ModalPendingRegistration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingRegistrations, setPendingRegistrations] = useState<
    SignupRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Rejection modal state
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionTarget, setRejectionTarget] = useState<SignupRequest | null>(
    null
  );

  // Fetch pending registrations
  useEffect(() => {
    fetchPendingRegistrations();
  }, []);

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/signup-requests");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch requests");
      }

      if (result.success) {
        setPendingRegistrations(result.data);
      }
    } catch (err) {
      console.error("Error fetching pending registrations:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    const registration = pendingRegistrations.find((reg) => reg.id === id);
    if (!registration) return;

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to approve ${registration.business_name}'s registration? This will activate their account and send them a welcome email.`
    );

    if (!confirmed) return;

    let loadingToast: string | undefined;

    try {
      setActionLoading(id);
      setError(null);

      // Show loading toast
      loadingToast = toast.loading(
        "Approving registration and sending email..."
      );

      const response = await fetch("/api/admin/signup-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: id,
          status: "approved",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to approve registration");
      }

      if (result.success) {
        // Remove from pending list
        setPendingRegistrations((prev) => prev.filter((reg) => reg.id !== id));

        // Close modal if this request was being reviewed
        if (selectedRegistration?.id === id) {
          closeModal();
        }

        // Show success toast with email status
        toast.dismiss(loadingToast);
        if (result.emailSent) {
          toast.success("Registration approved and welcome email sent!");
        } else {
          toast.success("Registration approved! (Email notification failed)");
        }
      }
    } catch (err) {
      console.error("Error approving registration:", err);
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
      toast.error(
        err instanceof Error ? err.message : "Failed to approve registration"
      );
      setError(
        err instanceof Error ? err.message : "Failed to approve registration"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const initiateReject = (registration: SignupRequest) => {
    setRejectionTarget(registration);
    setRejectionModalOpen(true);
  };

  const handleRejectConfirm = async (rejectionReason?: string) => {
    if (!rejectionTarget) return;

    let loadingToast: string | undefined;

    try {
      setActionLoading(rejectionTarget.id);
      setError(null);

      // Show loading toast with auto-delete info
      loadingToast = toast.loading(
        "Rejecting registration, sending email, and deleting user account..."
      );

      const response = await fetch("/api/admin/signup-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: rejectionTarget.id,
          status: "rejected",
          rejectionReason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reject registration");
      }

      if (result.success) {
        // Remove from pending list
        setPendingRegistrations((prev) =>
          prev.filter((reg) => reg.id !== rejectionTarget.id)
        );

        // Close modals
        setRejectionModalOpen(false);
        setRejectionTarget(null);
        if (selectedRegistration?.id === rejectionTarget.id) {
          closeModal();
        }

        // Show success toast with comprehensive status
        toast.dismiss(loadingToast);

        let successMessage = "✅ Registration rejected";

        if (result.emailSent) {
          successMessage += ", email sent";
        }

        if (result.userDeleted) {
          successMessage +=
            ", and user deleted. They can re-register immediately!";
        } else {
          successMessage +=
            ". (User deletion failed - manual cleanup may be needed)";
        }

        toast.success(successMessage, { duration: 5000 });
      }
    } catch (err) {
      console.error("Error rejecting registration:", err);
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
      toast.error(
        err instanceof Error ? err.message : "Failed to reject registration"
      );
      setError(
        err instanceof Error ? err.message : "Failed to reject registration"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectCancel = () => {
    setRejectionModalOpen(false);
    setRejectionTarget(null);
  };

  // Transform database data to modal format
  const transformForModal = (
    dbRegistration: SignupRequest
  ): ModalPendingRegistration => {
    return {
      id: dbRegistration.id,
      businessName: dbRegistration.business_name,
      ownerName: dbRegistration.business_name + " Owner",
      email: dbRegistration.email,
      phone: dbRegistration.phone_number,
      businessType: "Restaurant",
      submittedDate: new Date(dbRegistration.created_at).toLocaleDateString(),
      licenseDocument: dbRegistration.business_license_url || "",
      coverPhoto: undefined,
      logo: undefined,
    };
  };

  const openModal = (registration: SignupRequest) => {
    const modalData = transformForModal(registration);
    setSelectedRegistration(modalData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRegistration(null);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">
            Loading pending registrations...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12 text-center">
          <div className="space-y-3">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900">
              Error Loading Data
            </h3>
            <p className="text-gray-600">{error}</p>
            <Button onClick={fetchPendingRegistrations} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pending Registrations
          </h1>
          <p className="text-gray-600">
            Review and approve new restaurant registrations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="text-sm">
            {pendingRegistrations.length} pending
          </Badge>
        </div>
      </div>

      {/* Registrations List */}
      {pendingRegistrations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-600">
              There are no pending registrations to review at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingRegistrations.map((registration) => (
            <Card
              key={registration.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                        {registration.business_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {registration.business_name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{registration.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{registration.phone_number}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(
                              registration.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal(registration)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(registration.id)}
                      disabled={!!actionLoading}
                      className="flex items-center space-x-1 text-green-600 border-green-600 hover:bg-green-50"
                    >
                      {actionLoading === registration.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      <span>Approve</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => initiateReject(registration)}
                      disabled={!!actionLoading}
                      className="flex items-center space-x-1 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      {actionLoading === registration.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span>Reject</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Registration Detail Modal */}
      {isModalOpen && selectedRegistration && (
        <RegistrationDetailModal
          registration={selectedRegistration}
          isOpen={isModalOpen}
          onClose={closeModal}
          onApprove={(id) => {
            closeModal();
            handleApprove(id);
          }}
          onReject={(id) => {
            const dbRegistration = pendingRegistrations.find(
              (reg) => reg.id === id
            );
            if (dbRegistration) {
              closeModal();
              initiateReject(dbRegistration);
            }
          }}
        />
      )}

      {/* Rejection Reason Modal */}
      <RejectionReasonModal
        isOpen={rejectionModalOpen}
        onClose={handleRejectCancel}
        onConfirm={handleRejectConfirm}
        businessName={rejectionTarget?.business_name || ""}
        loading={!!actionLoading}
      />
    </div>
  );
}
