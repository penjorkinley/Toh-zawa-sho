// app/super-admin-dashboard/restaurants/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/shadcn-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MoreHorizontal,
  Power,
  PowerOff,
  MapPin,
  Calendar,
  Filter,
  RefreshCw,
  Utensils,
  Coffee,
  ChefHat,
  Wine,
  Ban,
} from "lucide-react";
import { RestaurantsLoading } from "@/components/ui/dashboard-loading";
import { RestaurantsError } from "@/components/ui/dashboard-error";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Restaurant {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  location: string;
  registeredDate: string;
  status: "active" | "inactive" | "suspended";
  logo?: string | null;
  description?: string | null;
  coverPhoto?: string | null;
}

interface RestaurantsResponse {
  restaurants: Restaurant[];
  stats: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
}

export default function RestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
  });

  // Fetch restaurants data on component mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/restaurants", {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch restaurants");
      }

      setRestaurants(result.data.restaurants || []);
      setStats(
        result.data.stats || { total: 0, active: 0, inactive: 0, suspended: 0 }
      );
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to fetch restaurants data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id: string, newStatus: string) => {
    // Show confirmation for suspension with detailed info
    if (newStatus === "suspended") {
      const restaurant = restaurants.find((r) => r.id === id);
      const confirmed = window.confirm(
        `⚠️ SUSPEND RESTAURANT: ${restaurant?.businessName}\n\n` +
          `This action will:\n` +
          `• Immediately disable their account\n` +
          `• Prevent them from logging in\n` +
          `• Block access to their dashboard\n` +
          `• Show "Account Suspended" message on login\n\n` +
          `The restaurant owner will need to contact support.\n\n` +
          `Are you sure you want to proceed?`
      );
      if (!confirmed) return;
    }

    try {
      const response = await fetch("/api/admin/restaurants", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: id,
          newStatus: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update restaurant status");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to update restaurant status");
      }

      // Update local state
      setRestaurants((prev) =>
        prev.map((restaurant) =>
          restaurant.id === id
            ? {
                ...restaurant,
                status: newStatus as "active" | "inactive" | "suspended",
              }
            : restaurant
        )
      );

      // Recalculate stats
      const updatedRestaurants = restaurants.map((restaurant) =>
        restaurant.id === id
          ? {
              ...restaurant,
              status: newStatus as "active" | "inactive" | "suspended",
            }
          : restaurant
      );

      setStats({
        total: updatedRestaurants.length,
        active: updatedRestaurants.filter((r) => r.status === "active").length,
        inactive: updatedRestaurants.filter((r) => r.status === "inactive")
          .length,
        suspended: updatedRestaurants.filter((r) => r.status === "suspended")
          .length,
      });
    } catch (err) {
      console.error("Error updating restaurant status:", err);
      alert("Failed to update restaurant status. Please try again.");
    }
  };

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch =
        restaurant.businessName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || restaurant.status === filterStatus;
      const matchesType =
        filterType === "all" ||
        restaurant.businessType.toLowerCase() === filterType.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => a.businessName.localeCompare(b.businessName));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBusinessTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "restaurant":
        return <Utensils className="h-3 w-3" />;
      case "cafe":
        return <Coffee className="h-3 w-3" />;
      case "bakery":
        return <ChefHat className="h-3 w-3" />;
      case "bar":
        return <Wine className="h-3 w-3" />;
      default:
        return <Utensils className="h-3 w-3" />;
    }
  };

  if (loading) {
    return <RestaurantsLoading />;
  }

  if (error) {
    return <RestaurantsError message={error} onRetry={fetchRestaurants} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Restaurant Management
        </h1>
        <p className="text-muted-foreground">
          Manage all registered restaurants on the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Restaurants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.inactive}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.suspended}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by restaurant name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="cafe">Cafe</SelectItem>
                <SelectItem value="bakery">Bakery</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Restaurants List */}
      <div className="grid gap-4">
        {filteredRestaurants.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Search className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-semibold">No restaurants found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search criteria or filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRestaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={restaurant.logo || undefined} />
                      <AvatarFallback>
                        {restaurant.businessName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {restaurant.businessName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {restaurant.location}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Registered: {restaurant.registeredDate}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {getBusinessTypeIcon(restaurant.businessType)}
                          {restaurant.businessType}
                        </Badge>
                        <Badge className={getStatusColor(restaurant.status)}>
                          {restaurant.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {restaurant.status === "active" ? (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusToggle(restaurant.id, "inactive")
                              }
                              className="cursor-pointer"
                            >
                              <PowerOff className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusToggle(restaurant.id, "suspended")
                              }
                              className="cursor-pointer text-red-600"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          </>
                        ) : restaurant.status === "inactive" ? (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusToggle(restaurant.id, "active")
                              }
                              className="cursor-pointer"
                            >
                              <Power className="h-4 w-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusToggle(restaurant.id, "suspended")
                              }
                              className="cursor-pointer text-red-600"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusToggle(restaurant.id, "active")
                            }
                            className="cursor-pointer text-green-600"
                          >
                            <Power className="h-4 w-4 mr-2" />
                            Unsuspend
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
