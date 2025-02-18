import LandingHeader from "@/components/header/landing-header";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`font-poppins w-screen h-screen  bg-screen`}>
      <LandingHeader />
      {children}
    </div>
  );
}
