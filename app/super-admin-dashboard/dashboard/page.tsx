"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/shadcn-button";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Store,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Interface for dashboard data
interface DashboardData {
  pendingRegistrations: any[];
  approvedRestaurants: any[];
  statsData: {
    totalRestaurants: number;
    pendingRegistrations: number;
    activeRestaurants: number;
    newRegistrationsThisWeek: number;
  };
}

export default function SuperAdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    pendingRegistrations: [],
    approvedRestaurants: [],
    statsData: {
      totalRestaurants: 0,
      pendingRegistrations: 0,
      activeRestaurants: 0,
      newRegistrationsThisWeek: 0,
    },
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Create supabase client for auth operations
  const supabase = createClientComponentClient();

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to refresh auth token
  async function refreshAuthToken() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Failed to refresh auth token:", error);
        throw error;
      }
      return data.session;
    } catch (err) {
      console.error("Auth refresh error:", err);
      throw err;
    }
  }

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Refresh auth token before making the request
      await refreshAuthToken();

      // Fetch pending registrations
      const response = await fetch("/api/admin/signup-requests", {
        // Add cache control headers to prevent stale responses
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized error specifically
          throw new Error("Unauthorized access. Please try logging in again.");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch data");
        }
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch data");
      }

      // Get pending registrations from response
      const pendingRegistrations = result.data || [];

      // Set dashboard data with what we have
      setDashboardData({
        pendingRegistrations,
        approvedRestaurants: [], // You would fetch this in a real app
        statsData: {
          totalRestaurants: pendingRegistrations.length,
          pendingRegistrations: pendingRegistrations.length,
          activeRestaurants: 0, // You would calculate this in a real app
          newRegistrationsThisWeek: 0, // You would calculate this in a real app
        },
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to handle approval/rejection of registrations
  const handleRegistrationAction = async (
    id: string,
    action: "approved" | "rejected"
  ) => {
    try {
      setActionLoading(id);

      // Refresh auth token before making the request
      await refreshAuthToken();

      const response = await fetch("/api/admin/signup-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify({
          requestId: id,
          status: action,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${action} registration`);
      }

      // Refresh dashboard data after action
      fetchDashboardData();
    } catch (err) {
      console.error(`Error with ${action} action:`, err);
      setError(
        err instanceof Error ? err.message : `Failed to ${action} registration`
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Function to format time ago
  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;

    return "just now";
  }

  // Show loading state only when loading is true, regardless of data
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your restaurant management system
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-600">
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Restaurants
                </p>
                <p className="text-3xl font-bold">
                  {dashboardData.statsData.totalRestaurants}
                </p>
              </div>
              <div className="p-2 bg-background rounded-full">
                <Store className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total registered restaurants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Approvals
                </p>
                <p className="text-3xl font-bold">
                  {dashboardData.statsData.pendingRegistrations}
                </p>
              </div>
              <div className="p-2 bg-background rounded-full">
                <ClipboardCheck className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Registrations awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Restaurants
                </p>
                <p className="text-3xl font-bold">
                  {dashboardData.statsData.activeRestaurants}
                </p>
              </div>
              <div className="p-2 bg-background rounded-full">
                <Store className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Actively operating restaurants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  New This Week
                </p>
                <p className="text-3xl font-bold">
                  {dashboardData.statsData.newRegistrationsThisWeek}
                </p>
              </div>
              <div className="p-2 bg-background rounded-full">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              New registrations in the past week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Registrations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : dashboardData.pendingRegistrations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending registrations found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-3 px-4">
                      Business Name
                    </th>
                    <th className="text-left font-medium py-3 px-4">Email</th>
                    <th className="text-left font-medium py-3 px-4">Phone</th>
                    <th className="text-left font-medium py-3 px-4">
                      Submitted
                    </th>
                    <th className="text-left font-medium py-3 px-4">License</th>
                    <th className="text-right font-medium py-3 px-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.pendingRegistrations.map((registration) => (
                    <tr
                      key={registration.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium">
                        {registration.business_name}
                      </td>
                      <td className="py-3 px-4">{registration.email}</td>
                      <td className="py-3 px-4">{registration.phone_number}</td>
                      <td className="py-3 px-4">
                        {formatTimeAgo(registration.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        {registration.business_license_url ? (
                          <a
                            href={registration.business_license_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline"
                          >
                            View
                          </a>
                        ) : (
                          "None"
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRegistrationAction(
                              registration.id,
                              "approved"
                            )
                          }
                          disabled={actionLoading === registration.id}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          {actionLoading === registration.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRegistrationAction(
                              registration.id,
                              "rejected"
                            )
                          }
                          disabled={actionLoading === registration.id}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          {actionLoading === registration.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approved Restaurants (placeholder for now) */}
      <Card>
        <CardHeader>
          <CardTitle>Approved Restaurants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No approved restaurants found.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
