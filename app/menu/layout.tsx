// app/menu/layout.tsx
import React from "react";

export default function CustomerMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean layout without any navigation bars for QR-scanned mobile experience */}
      {children}
    </div>
  );
}
