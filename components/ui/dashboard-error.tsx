// components/ui/dashboard-error.tsx
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";

interface DashboardErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
}

export function DashboardError({
  title,
  message,
  onRetry,
  retryLabel = "Try Again",
  showHeader = false,
  headerTitle,
  headerSubtitle,
}: DashboardErrorProps) {
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

      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {title || "Something went wrong"}
            </h3>
            <p className="text-red-600 max-w-md">{message}</p>
          </div>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              {retryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Specific error components for common use cases
export function SuperAdminDashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <DashboardError
      showHeader={true}
      headerTitle="Dashboard"
      headerSubtitle="Super Admin system overview and management"
      title="Failed to load dashboard"
      message={message}
      onRetry={onRetry}
    />
  );
}

export function RestaurantsError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <DashboardError
      title="Failed to load restaurants"
      message={message}
      onRetry={onRetry}
    />
  );
}

export function PendingRegistrationsError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <DashboardError
      title="Failed to load pending registrations"
      message={message}
      onRetry={onRetry}
    />
  );
}

// Owner Dashboard Error Variants
export function TablesError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <DashboardError
      showHeader={true}
      headerTitle="Table Management"
      headerSubtitle="Create tables and generate QR codes for your restaurant"
      title="Failed to load tables"
      message={message}
      onRetry={onRetry}
    />
  );
}

export function MenuSetupError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <DashboardError
      showHeader={true}
      headerTitle="Menu Setup"
      headerSubtitle="Create and manage your restaurant menu"
      title="Failed to load menu"
      message={message}
      onRetry={onRetry}
    />
  );
}

export function ProfileError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <DashboardError
      showHeader={true}
      headerTitle="Restaurant Profile"
      headerSubtitle="Manage your restaurant information and settings"
      title="Failed to load profile"
      message={message}
      onRetry={onRetry}
    />
  );
}

export function OrderError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <DashboardError
      showHeader={true}
      headerTitle="Order Management"
      headerSubtitle="View and manage customer orders"
      title="Failed to load orders"
      message={message}
      onRetry={onRetry}
    />
  );
}

export function EmployeeError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <DashboardError
      showHeader={true}
      headerTitle="Employee Management"
      headerSubtitle="Manage your restaurant staff"
      title="Failed to load employees"
      message={message}
      onRetry={onRetry}
    />
  );
}
