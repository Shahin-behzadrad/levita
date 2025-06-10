import type { Metadata } from "next";
import "../styles/globals.css";
import "../styles/_colors.scss";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { convex } from "@/lib/convexClient";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "sonner";
import styles from "./layout.module.scss";

import { LanguageProvider } from "@/i18n/LanguageContext";
import { AppProvider } from "@/lib/AppContext";

export const metadata: Metadata = {
  title: "Levita - AI-powered Health Analysis",
  description: "Your personal AI-powered health analysis platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={styles.layout}>
        <ConvexAuthProvider client={convex}>
          <AppProvider>
            <LanguageProvider>
              <Header />
              <div>{children}</div>
              <Footer />

              <Toaster
                theme="light"
                richColors
                toastOptions={{
                  style: {
                    background: "white",
                    color: "black",
                    border: "1px solid #e5e7eb",
                  },
                  className: styles.toastCustom,
                }}
              />
            </LanguageProvider>
          </AppProvider>
        </ConvexAuthProvider>
      </body>
    </html>
  );
}
