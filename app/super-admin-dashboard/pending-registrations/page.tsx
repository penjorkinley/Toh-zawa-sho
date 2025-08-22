// app/super-admin-dashboard/pending-registrations/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/shadcn-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RegistrationDetailModal from "@/components/restaurant-details-modal/registration-detail-modal";
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
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to approve this registration? This will activate their account and they will be able to access the platform."
    );

    if (!confirmed) return;

    let loadingToast: string | undefined;

    try {
      setActionLoading(id);
      setError(null);

      // Show loading toast
      loadingToast = toast.loading("Approving registration...");

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

        // Show success toast
        toast.dismiss(loadingToast);
        toast.success("Registration approved successfully!");
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

  const handleReject = async (id: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to reject this registration? This action cannot be undone and the applicant will need to reapply."
    );

    if (!confirmed) return;

    let loadingToast: string | undefined;

    try {
      setActionLoading(id);
      setError(null);

      // Show loading toast
      loadingToast = toast.loading("Rejecting registration...");

      const response = await fetch("/api/admin/signup-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: id,
          status: "rejected",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reject registration");
      }

      if (result.success) {
        // Remove from pending list
        setPendingRegistrations((prev) => prev.filter((reg) => reg.id !== id));

        // Close modal if this request was being reviewed
        if (selectedRegistration?.id === id) {
          closeModal();
        }

        // Show success toast
        toast.dismiss(loadingToast);
        toast.success("Registration rejected successfully.");
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pending Registrations
          </h1>
          <p className="text-muted-foreground">
            Review and approve restaurant registration requests
          </p>
        </div>

        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading pending registrations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Pending Registrations
        </h1>
        <p className="text-muted-foreground">
          Review and approve restaurant registration requests
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPendingRegistrations}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Registration Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-orange-600">
              {pendingRegistrations.length}
            </div>
            <span className="text-sm text-muted-foreground">
              registrations awaiting review
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pending Registrations List */}
      <div className="grid gap-4">
        {pendingRegistrations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Check className="h-8 w-8 text-green-500 mb-2" />
              <h3 className="text-lg font-semibold">All caught up!</h3>
              <p className="text-muted-foreground text-center">
                No pending registrations to review at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          pendingRegistrations.map((registration) => (
            <Card
              key={registration.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {registration.business_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {registration.business_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {registration.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {registration.phone_number}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(
                            registration.created_at
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal(registration)}
                      disabled={!!actionLoading}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>

                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(registration.id)}
                      disabled={!!actionLoading}
                    >
                      {actionLoading === registration.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-1" />
                      )}
                      Approve
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(registration.id)}
                      disabled={!!actionLoading}
                    >
                      {actionLoading === registration.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 mr-1" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Registration Detail Modal */}
      <RegistrationDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        registration={selectedRegistration}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
