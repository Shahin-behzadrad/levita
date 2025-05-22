import MainPage from "@/components/MainPage/MainPage";
import Footer from "../components/Footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAL - Home",
  description: "Welcome to SAL - Your AI-powered health analysis platform",
  keywords: ["health", "AI", "analysis", "wellness"],
};

export default async function HomeServerComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainPage />
    </div>
  );
}
