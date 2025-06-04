import MainPage from "@/components/MainPage/MainPage";
import Footer from "../components/Footer/Footer";
import type { Metadata } from "next";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Levita - Home",
  description: "Welcome to Levita - Your AI-powered health analysis platform",
  keywords: ["health", "AI", "analysis", "wellness"],
};

export default async function HomeServerComponent() {
  return (
    <div className={styles.container}>
      <MainPage />
    </div>
  );
}
