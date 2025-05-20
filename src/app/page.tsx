import SalAnalyzeForm from "@/components/SalAnalyzeForm/SalAnalyzeForm";
import { SignOutButton } from "@/components/SignOutButton/SignOutButton";
import Image from "next/image";
import { Toaster } from "sonner";
import salLogo from "../../public/SAL.webp";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-b-gray-300">
        <div className="flex items-center gap-2">
          <Image src={salLogo.src} width={60} height={60} alt="sal-logo" />
          <h2 className="text-xl font-semibold text-indigo-600">
            Health Analyzer AI
          </h2>
        </div>
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
