// app/super-admin-dashboard/pending-registrations/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/shadcn-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RegistrationDetailModal from "@/components/restaurant-details-modal/registration-detail-modal";
import {
  Eye,
  Check,
  X,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
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

export default function PendingRegistrationsPage() {
  const [selectedRegistration, setSelectedRegistration] =
    useState<PendingRegistration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - replace with API calls
  const [pendingRegistrations, setPendingRegistrations] = useState<
    PendingRegistration[]
  >([
    {
      id: "1",
      businessName: "Paro Valley Restaurant",
      ownerName: "Karma Wangchuk",
      email: "karma@parovalley.bt",
      phone: "+975-17-123-456",
      businessType: "Restaurant",
      location: "Paro, Bhutan",
      submittedDate: "2024-01-15",
      licenseDocument: "/documents/license1.pdf",
      coverPhoto: "/images/restaurant1-cover.jpg",
      logo: "/images/restaurant1-logo.jpg",
      description: "Traditional Bhutanese cuisine with modern ambiance",
      openingHours: {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        openTime: "09:00 AM",
        closeTime: "10:00 PM",
      },
    },
    {
      id: "2",
      businessName: "Dragon Kitchen",
      ownerName: "Tenzin Norbu",
      email: "tenzin@dragonkitchen.bt",
      phone: "+975-17-789-012",
      businessType: "Cafe",
      location: "Thimphu, Bhutan",
      submittedDate: "2024-01-14",
      licenseDocument: "/documents/license2.pdf",
      description: "Cozy cafe serving coffee and light meals",
      openingHours: {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        openTime: "07:00 AM",
        closeTime: "09:00 PM",
      },
    },
  ]);

  const handleApprove = (id: string) => {
    setPendingRegistrations((prev) => prev.filter((reg) => reg.id !== id));
    // API call to approve registration
    console.log(`Approved registration ${id}`);
  };

  const handleReject = (id: string) => {
    setPendingRegistrations((prev) => prev.filter((reg) => reg.id !== id));
    // API call to reject registration
    console.log(`Rejected registration ${id}`);
  };

  const openModal = (registration: PendingRegistration) => {
    setSelectedRegistration(registration);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRegistration(null);
  };

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
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={registration.logo} />
                      <AvatarFallback>
                        {registration.businessName
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {registration.businessName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          by {registration.ownerName}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {registration.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {registration.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {registration.location}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {registration.businessType}
                        </Badge>
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          {registration.submittedDate}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal(registration)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>

                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(registration.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(registration.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
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
