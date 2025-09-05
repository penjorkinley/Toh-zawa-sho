// app/menu/[businessId]/[tableId]/page.tsx - FIXED VERSION
import { getPublicMenuData } from "@/lib/actions/table/actions";
import { notFound } from "next/navigation";
import CustomerMenuClient from "./client";

interface PublicMenuPageProps {
  params: Promise<{
    businessId: string;
    tableId: string;
  }>;
}

export default async function PublicMenuPage({ params }: PublicMenuPageProps) {
  // ✅ FIXED: Await params in Next.js 15
  const { businessId, tableId } = await params;

  // Fetch menu data server-side for better performance and SEO
  const result = await getPublicMenuData(businessId, tableId);

  if (!result.success || !result.data) {
    notFound();
  }

  // Pass the data to client component
  return <CustomerMenuClient menuData={result.data} />;
}

// Metadata for SEO - FIXED VERSION
export async function generateMetadata({ params }: PublicMenuPageProps) {
  // ✅ FIXED: Await params in Next.js 15
  const { businessId, tableId } = await params;

  try {
    const result = await getPublicMenuData(businessId, tableId);

    if (result.success && result.data) {
      const { restaurant, table } = result.data;
      return {
        title: `${restaurant.business_name} - Table ${table.table_number}`,
        description: `View the menu for ${restaurant.business_name} located in ${restaurant.location}. Currently serving Table ${table.table_number}.`,
        openGraph: {
          title: `${restaurant.business_name} Menu`,
          description: `Scan and order from Table ${table.table_number}`,
          images: restaurant.logo_url ? [restaurant.logo_url] : [],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: "Restaurant Menu",
    description: "View our delicious menu",
  };
}
