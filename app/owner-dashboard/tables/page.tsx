"use client";

import { Button } from "@/components/ui/shadcn-button";
import TableCard from "@/components/table/tableCard";
import { useState } from "react";

interface Table {
  id: string;
  tableNumber: string;
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [showNewTable, setShowNewTable] = useState(false);

  const handleAddTable = () => {
    setShowNewTable(true);
  };

  const handleDeleteTable = (id: string) => {
    setTables((tables) => tables.filter((table) => table.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          id={table.id}
          tableNumber={table.tableNumber}
          onDelete={handleDeleteTable}
        />
      ))}
      {showNewTable && (
        <TableCard isNew />
      )}
      <Button
        variant="outline"
        className="w-full border-primary text-primary"
        onClick={handleAddTable}
      >
        Add Table
      </Button>
    </div>
  );
}
