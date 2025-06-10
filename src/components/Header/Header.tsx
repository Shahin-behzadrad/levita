"use client";

import { useQuery } from "convex/react";
import { Button } from "@/components/Shared/Button/Button";
import { api } from "../../../convex/_generated/api";
import { Bell, Flower, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import styles from "./Header.module.scss";
import { UserProfile } from "../Shared/UserProfile/UserProfile";
import Text from "../Shared/Text";
import Sidebar from "../Shared/Sidebar/Sidebar";
import { LanguageSwitcher } from "../Shared/LanguageSwitcher/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import Notification from "../Notification/Notification";
import { useApp } from "@/lib/AppContext";

const Header = () => {
  const userData = useQuery(api.api.profiles.userProfiles.getUserProfile);
  const { setView, currentView } = useApp();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { messages } = useLanguage();

  const isLoading = userData === undefined;

  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
        <div
          onClick={() => {
            setView("home");
          }}
          className={styles.levita}
        >
          <Text
            startAdornment={<Flower size={isMobile ? 24 : 40} />}
            fontSize={isMobile ? "md" : "lg"}
            variant={isMobile ? "h4" : "h3"}
            fontWeight="bold"
            color="primary"
            value="Levita"
          />
        </div>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingPulse}>
              <div className={styles.loadingText}>
                <div className={styles.loadingBar}></div>
              </div>
              <div className={styles.loadingAvatar}></div>
            </div>
          </div>
        ) : userData?._id ? (
          <>
            {isMobile ? (
              <>
                <div className={styles.rightSection}>
                  <LanguageSwitcher />
                  <Notification isDoctor={userData?.role === "doctor"} />
                  <Menu
                    className={styles.menuButton}
                    onClick={() => setIsSidebarOpen(true)}
                  />
                </div>
                <Sidebar
                  isOpen={isSidebarOpen}
                  onOpenChange={setIsSidebarOpen}
                  userData={userData}
                />
              </>
            ) : (
              <div className={styles.rightSection}>
                <LanguageSwitcher />
                <Notification isDoctor={userData?.role === "doctor"} />
                <UserProfile userData={userData} />
              </div>
            )}
          </>
        ) : (
          <>
            {isMobile ? (
              <>
                <div className={styles.rightSection}>
                  <LanguageSwitcher />
                  <Menu
                    className={styles.menuButton}
                    onClick={() => setIsSidebarOpen(true)}
                  />
                </div>
                <Sidebar
                  isOpen={isSidebarOpen}
                  onOpenChange={setIsSidebarOpen}
                  userData={userData}
                />
              </>
            ) : (
              <>
                {currentView !== "complete-profile" && (
                  <div className={styles.rightSection}>
                    <LanguageSwitcher />
                    <div className={styles.authButtons}>
                      <Button
                        variant="contained"
                        onClick={() => setView("sign-up")}
                      >
                        {messages.auth.signUp}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setView("sign-in")}
                      >
                        {messages.auth.signIn}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
