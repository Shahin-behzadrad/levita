import SalAnalyzeForm from "@/components/SalAnalyzeForm/SalAnalyzeForm";
import { SignOutButton } from "@/components/SignOutButton/SignOutButton";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold text-indigo-600">
          Health Analyzer AI
        </h2>
        <SignOutButton />
      </header>
      <main className="flex-1 flex items-start justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl mx-auto">
          <SalAnalyzeForm />
        </div>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
