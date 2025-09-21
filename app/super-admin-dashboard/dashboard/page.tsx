// app/super-admin-dashboard/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/shadcn-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  ClipboardCheck,
  TrendingUp,
  Users,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { SuperAdminDashboardLoading } from "@/components/ui/dashboard-loading";
import { SuperAdminDashboardError } from "@/components/ui/dashboard-error";

// Interface for dashboard data
interface DashboardData {
  pendingRegistrations: any[];
  approvedRestaurants: any[];
  statsData: {
    totalRestaurants: number;
    pendingRegistrations: number;
    menusCompleted: number;
    newRegistrationsThisWeek: number;
  };
}

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    pendingRegistrations: [],
    approvedRestaurants: [],
    statsData: {
      totalRestaurants: 0,
      pendingRegistrations: 0,
      menusCompleted: 0,
      newRegistrationsThisWeek: 0,
    },
  });
  const [apiTimeout, setApiTimeout] = useState(false);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    setApiTimeout(false);

    try {
      // Fetch both signup requests and dashboard stats in parallel
      const [signupResponse, statsResponse] = await Promise.all([
        fetch("/api/admin/signup-requests", {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }),
        fetch("/api/admin/dashboard-stats", {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }),
      ]);

      if (!signupResponse.ok) {
        throw new Error(
          `Signup requests HTTP ${signupResponse.status}: ${signupResponse.statusText}`
        );
      }

      if (!statsResponse.ok) {
        throw new Error(
          `Dashboard stats HTTP ${statsResponse.status}: ${statsResponse.statusText}`
        );
      }

      const signupResult = await signupResponse.json();
      const statsResult = await statsResponse.json();

      if (!signupResult.success) {
        throw new Error(
          signupResult.error || "Signup requests API request failed"
        );
      }

      if (!statsResult.success) {
        throw new Error(
          statsResult.error || "Dashboard stats API request failed"
        );
      }

      const pendingRegistrations = Array.isArray(signupResult.data)
        ? signupResult.data
        : [];

      const statsData = statsResult.data || {
        totalRestaurants: 0,
        pendingRegistrations: 0,
        activeRestaurants: 0,
        newRegistrationsThisWeek: 0,
      };

      setDashboardData({
        pendingRegistrations,
        approvedRestaurants: [],
        statsData,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch dashboard data");

      // Set empty data as fallback
      setDashboardData({
        pendingRegistrations: [],
        approvedRestaurants: [],
        statsData: {
          totalRestaurants: 0,
          pendingRegistrations: 0,
          menusCompleted: 0,
          newRegistrationsThisWeek: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchDashboardData();
  };

  const handleRegistrationClick = () => {
    router.push("/super-admin-dashboard/pending-registrations");
  };

  if (loading) {
    return <SuperAdminDashboardLoading />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Super Admin system overview and management
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <SuperAdminDashboardError message={error} onRetry={handleRetry} />
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
              Active & setup complete
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
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Menus Completed
            </CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.statsData.menusCompleted}
            </div>
            <p className="text-xs text-muted-foreground">Full menu setup</p>
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

      {/* Recent Pending Registrations - NO ACTION BUTTONS */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Pending Registrations</CardTitle>
          <p className="text-sm text-muted-foreground">
            Latest registration requests waiting for review
          </p>
        </CardHeader>
        <CardContent>
          {dashboardData.pendingRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardCheck className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pending registrations
              </h3>
              <p className="text-gray-500">
                All registration requests have been processed or there are no
                new registrations to review.
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
            <div className="space-y-4">
              {dashboardData.pendingRegistrations
                .slice(0, 5)
                .map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                    onClick={handleRegistrationClick}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {registration.business_name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {registration.business_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {registration.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="text-orange-600 border-orange-200"
                      >
                        Pending Review
                      </Badge>
                      <p className="text-xs text-gray-400">
                        {new Date(registration.created_at).toLocaleDateString()}
                      </p>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}

              {dashboardData.pendingRegistrations.length > 5 && (
                <div className="text-center pt-4 border-t">
                  <Link
                    href="/super-admin-dashboard/pending-registrations"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    View all {dashboardData.pendingRegistrations.length} pending
                    registrations →
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
