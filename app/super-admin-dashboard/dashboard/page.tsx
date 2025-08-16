// app/super-admin-dashboard/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/shadcn-button";
import {
  Building2,
  UserCheck,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface DashboardStats {
  totalRestaurants: number;
  pendingRegistrations: number;
  monthlyGrowth: number;
}

interface RecentActivity {
  id: string;
  business_name: string;
  email: string;
  status: string;
  created_at: string;
  type: "registration" | "approval";
}

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRestaurants: 0,
    pendingRegistrations: 0,
    monthlyGrowth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch pending registrations count
      const pendingResponse = await fetch("/api/admin/signup-requests");
      const pendingResult = await pendingResponse.json();

      if (!pendingResponse.ok) {
        throw new Error(
          pendingResult.error || "Failed to fetch pending requests"
        );
      }

      const pendingCount = pendingResult.success
        ? pendingResult.data.length
        : 0;

      // For now, we'll use the pending data for recent activity
      // In the future, you can create separate endpoints for comprehensive stats
      const recentData: RecentActivity[] = pendingResult.success
        ? pendingResult.data.slice(0, 5).map((item: any) => ({
            id: item.id,
            business_name: item.business_name,
            email: item.email,
            status: item.status,
            created_at: item.created_at,
            type: "registration" as const,
          }))
        : [];

      setStats({
        totalRestaurants: 0, // You'll need to create an endpoint for this
        pendingRegistrations: pendingCount,
        monthlyGrowth: 0, // You'll need to calculate this from database
      });

      setRecentActivity(recentData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Toh Zawa Sho Super Admin Dashboard
          </p>
        </div>

        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Toh Zawa Sho Super Admin Dashboard
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1" />
          )}
          Refresh
        </Button>
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
                onClick={handleRefresh}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Restaurants
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRestaurants}</div>
            <p className="text-xs text-muted-foreground">
              Active restaurants on platform
            </p>
            <p className="text-xs text-orange-600 mt-1">
              * Coming soon - endpoint needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Registrations
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendingRegistrations}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
            {stats.pendingRegistrations > 0 && (
              <p className="text-xs text-orange-600 mt-1">⚡ Action required</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{stats.monthlyGrowth}%
            </div>
            <p className="text-xs text-muted-foreground">
              New registrations this month
            </p>
            <p className="text-xs text-orange-600 mt-1">
              * Coming soon - calculation needed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recent activity
              </p>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {activity.status === "pending" ? (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {activity.business_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        activity.status === "pending" ? "secondary" : "default"
                      }
                      className={
                        activity.status === "pending"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.created_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {stats.pendingRegistrations > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-800 font-medium">
                  You have {stats.pendingRegistrations} registration
                  {stats.pendingRegistrations > 1 ? "s" : ""} awaiting review
                </p>
                <p className="text-xs text-orange-600">
                  Review and approve pending restaurant applications
                </p>
              </div>
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() =>
                  (window.location.href =
                    "/super-admin-dashboard/pending-registrations")
                }
              >
                Review Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
