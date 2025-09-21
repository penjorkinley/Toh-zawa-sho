// app/owner-dashboard/tables/page.tsx
"use client";

import { Button } from "@/components/ui/shadcn-button";
import TableCard from "@/components/table/tableCard";
import { useEffect, useState, useCallback } from "react";
import { RestaurantTable } from "@/lib/types/table-management";
import { getTables } from "@/lib/actions/table/actions";
import toast from "react-hot-toast";
import { Loader2, Plus } from "lucide-react";
import { TablesLoading } from "@/components/ui/dashboard-loading";
import { TablesError } from "@/components/ui/dashboard-error";

export default function TablesPage() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewTable, setShowNewTable] = useState(false);

  const fetchTables = useCallback(async () => {
    try {
      setError(null);
      const result = await getTables();
      if (result.success && result.tables) {
        setTables(result.tables);
      } else {
        setError(result.error || "Failed to fetch tables");
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
      setError("Failed to fetch tables");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleAddTable = () => {
    setShowNewTable(true);
  };

  const handleDeleteTable = (id: string) => {
    setTables((prevTables) => prevTables.filter((table) => table.id !== id));
  };

  const handleTableUpdate = () => {
    setShowNewTable(false);
    fetchTables();
  };

  if (isLoading) {
    return <TablesLoading />;
  }

  if (error) {
    return <TablesError message={error} onRetry={fetchTables} />;
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Table Management</h1>
          <p className="text-muted-foreground">
            Create tables and generate QR codes for your restaurant
          </p>
        </div>
        <Button
          variant="outline"
          className="border-primary text-primary"
          onClick={handleAddTable}
          disabled={showNewTable}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Table
        </Button>
      </div>

      {/* Tables List */}
      <div className="space-y-4">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onDelete={handleDeleteTable}
            onUpdate={handleTableUpdate}
          />
        ))}

        {showNewTable && <TableCard isNew onUpdate={handleTableUpdate} />}

        {!isLoading && tables.length === 0 && !showNewTable && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No tables created yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first table to generate QR codes for your
                restaurant.
              </p>
              <Button
                variant="outline"
                className="border-primary text-primary"
                onClick={handleAddTable}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Table
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {tables.length > 0 && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">How to use QR codes:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              1. Click the QR code icon on any table to generate its QR code
            </li>
            <li>2. Download the QR code image</li>
            <li>
              3. Print and place it on the physical table in your restaurant
            </li>
            <li>4. Customers can scan the QR code to view your menu</li>
          </ul>
        </div>
      )}
    </div>
  );
}
