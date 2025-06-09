import { App } from "@/components/App/App";
import { AppProvider } from "@/lib/AppContext";
import type { Metadata } from "next";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Levita - Your AI-powered health analysis platform",
  description: "Welcome to Levita - Your AI-powered health analysis platform",
  keywords: ["health", "AI", "analysis", "wellness"],
};

export default function Home() {
  return (
    <div className={styles.container}>
      <AppProvider>
        <App />
      </AppProvider>
    </div>
  );
}
