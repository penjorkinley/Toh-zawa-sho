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
  AlertCircle,
  RefreshCw,
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
  const [apiTimeout, setApiTimeout] = useState(false);

  // Create supabase client for auth operations
  const supabase = createClientComponentClient();

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to fetch dashboard data with aggressive timeout
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    setApiTimeout(false);

    // Set a maximum timeout of 5 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("API_TIMEOUT"));
      }, 5000);
    });

    // Create the API fetch promise
    const fetchPromise = fetch("/api/admin/signup-requests", {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    try {
      // Race the fetch against the timeout
      const response = (await Promise.race([
        fetchPromise,
        timeoutPromise,
      ])) as Response;

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        } else if (response.status === 403) {
          throw new Error(
            "Access denied. You don't have permission to view this data."
          );
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          // Try to get error message from response
          try {
            const errorData = await response.json();
            throw new Error(
              errorData.error ||
                `HTTP ${response.status}: ${response.statusText}`
            );
          } catch {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        }
      }

      // Parse response
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "API request failed");
      }

      // Successfully got data
      const pendingRegistrations = Array.isArray(result.data)
        ? result.data
        : [];

      setDashboardData({
        pendingRegistrations,
        approvedRestaurants: [],
        statsData: {
          totalRestaurants: pendingRegistrations.length,
          pendingRegistrations: pendingRegistrations.length,
          activeRestaurants: 0,
          newRegistrationsThisWeek: 0,
        },
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);

      if (err instanceof Error && err.message === "API_TIMEOUT") {
        // API timed out - show static fallback data
        setApiTimeout(true);
        setError(
          "API is taking too long to respond. Showing dashboard with no pending registrations."
        );

        // Set empty data as fallback
        setDashboardData({
          pendingRegistrations: [],
          approvedRestaurants: [],
          statsData: {
            totalRestaurants: 0,
            pendingRegistrations: 0,
            activeRestaurants: 0,
            newRegistrationsThisWeek: 0,
          },
        });
      } else {
        // Other errors
        let errorMessage = "Failed to fetch dashboard data";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);

        // Still show empty data as fallback
        setDashboardData({
          pendingRegistrations: [],
          approvedRestaurants: [],
          statsData: {
            totalRestaurants: 0,
            pendingRegistrations: 0,
            activeRestaurants: 0,
            newRegistrationsThisWeek: 0,
          },
        });
      }
    } finally {
      // Always set loading to false
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
      setError(null);

      const response = await fetch("/api/admin/signup-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: id,
          status: action,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${action} registration`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || `Failed to ${action} registration`);
      }

      // Remove the registration from the list
      setDashboardData((prev) => ({
        ...prev,
        pendingRegistrations: prev.pendingRegistrations.filter(
          (reg) => reg.id !== id
        ),
        statsData: {
          ...prev.statsData,
          pendingRegistrations: prev.pendingRegistrations.length - 1,
          totalRestaurants: Math.max(0, prev.statsData.totalRestaurants - 1),
        },
      }));
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
    try {
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
    } catch {
      return "Unknown";
    }
  }

  // Manual retry function
  const handleRetry = () => {
    fetchDashboardData();
  };

  // Show loading state only initially for 5 seconds max
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          <p className="mt-2 text-sm text-gray-500">
            If this takes more than a few seconds, the API might be having
            issues.
          </p>
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
        <Card
          className={`border-red-200 ${
            apiTimeout ? "bg-yellow-50" : "bg-red-50"
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center ${
                  apiTimeout ? "text-yellow-600" : "text-red-600"
                }`}
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Restaurants
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.statsData.totalRestaurants}
            </div>
            <p className="text-xs text-muted-foreground">
              Registered restaurants
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Registrations
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.statsData.pendingRegistrations}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Restaurants
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.statsData.activeRestaurants}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.statsData.newRegistrationsThisWeek}
            </div>
            <p className="text-xs text-muted-foreground">New registrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Registrations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Pending Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {actionLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : dashboardData.pendingRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pending registrations
              </h3>
              <p className="text-gray-500">
                {apiTimeout
                  ? "Currently unable to fetch data from the server. If there are pending registrations, they will appear here once the connection is restored."
                  : "All registration requests have been processed or there are no new registrations to review."}
              </p>
              {apiTimeout && (
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="mt-4"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
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
                        {registration.business_name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {registration.email || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {registration.phone_number || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {registration.created_at
                          ? formatTimeAgo(registration.created_at)
                          : "Unknown"}
                      </td>
                      <td className="py-3 px-4">
                        {registration.business_license_url ? (
                          <a
                            href={registration.business_license_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View License
                          </a>
                        ) : (
                          <span className="text-gray-400">No license</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Button
                          onClick={() =>
                            handleRegistrationAction(
                              registration.id,
                              "approved"
                            )
                          }
                          disabled={actionLoading === registration.id}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {actionLoading === registration.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() =>
                            handleRegistrationAction(
                              registration.id,
                              "rejected"
                            )
                          }
                          disabled={actionLoading === registration.id}
                          size="sm"
                          variant="destructive"
                        >
                          {actionLoading === registration.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
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
    </div>
  );
}
