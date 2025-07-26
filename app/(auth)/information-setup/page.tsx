import InformationSetupForm from "@/components/auth/InformationSetupForm";
import ClientBackButton from "@/components/ui/ClientBackButton";

export default function InformationSetupPage() {
  return (
    <div className="font-poppins relative min-h-[calc(100vh-4rem)] flex flex-col py-8">
      <div className="w-full px-6 mx-auto flex-1 flex flex-col">
        <ClientBackButton />
        
        <div className="flex-1 pt-16">
          <InformationSetupForm />
        </div>
      </div>
    </div>
  );
}
