import SalAnalyzeForm from "@/components/SalAnalyzeForm/SalAnalyzeForm";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-start justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl mx-auto">
          <SalAnalyzeForm />
        </div>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
