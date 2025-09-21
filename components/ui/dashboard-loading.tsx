// components/ui/dashboard-loading.tsx
import { Loader2 } from "lucide-react";

interface DashboardLoadingProps {
  title?: string;
  message?: string;
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  size?: "sm" | "md" | "lg";
}

export function DashboardLoading({
  title,
  message = "Loading...",
  showHeader = false,
  headerTitle,
  headerSubtitle,
  size = "md",
}: DashboardLoadingProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerPadding = showHeader ? "py-8" : "py-12";

  return (
    <div className="p-6 space-y-6">
      {showHeader && (
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {headerTitle || title}
          </h1>
          {headerSubtitle && (
            <p className="text-muted-foreground">{headerSubtitle}</p>
          )}
        </div>
      )}

      <div className={`flex items-center justify-center ${containerPadding}`}>
        <div className="flex items-center text-center">
          <Loader2
            className={`${sizeClasses[size]} animate-spin text-primary mr-3`}
          />
          <span className="text-gray-600 font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
}

// Specific loading components for common use cases
export function SuperAdminDashboardLoading() {
  return (
    <DashboardLoading
      showHeader={true}
      headerTitle="Dashboard"
      headerSubtitle="Super Admin system overview and management"
      message="Loading dashboard data..."
      size="md"
    />
  );
}

export function RestaurantsLoading() {
  return <DashboardLoading message="Loading restaurants..." size="lg" />;
}

export function PendingRegistrationsLoading() {
  return (
    <DashboardLoading message="Loading pending registrations..." size="md" />
  );
}

// Owner Dashboard Loading Variants
export function TablesLoading() {
  return (
    <DashboardLoading
      showHeader={true}
      headerTitle="Table Management"
      headerSubtitle="Create tables and generate QR codes for your restaurant"
      message="Loading tables..."
      size="md"
    />
  );
}

export function MenuSetupLoading() {
  return (
    <DashboardLoading
      showHeader={true}
      headerTitle="Menu Setup"
      headerSubtitle="Create and manage your restaurant menu"
      message="Loading menu..."
      size="md"
    />
  );
}

export function ProfileLoading() {
  return (
    <DashboardLoading
      showHeader={true}
      headerTitle="Restaurant Profile"
      headerSubtitle="Manage your restaurant information and settings"
      message="Loading profile..."
      size="md"
    />
  );
}

export function OrderLoading() {
  return (
    <DashboardLoading
      showHeader={true}
      headerTitle="Order Management"
      headerSubtitle="View and manage customer orders"
      message="Loading orders..."
      size="md"
    />
  );
}

export function EmployeeLoading() {
  return (
    <DashboardLoading
      showHeader={true}
      headerTitle="Employee Management"
      headerSubtitle="Manage your restaurant staff"
      message="Loading employees..."
      size="md"
    />
  );
}
