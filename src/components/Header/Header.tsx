"use client";

import { useQuery } from "convex/react";
import { Button } from "@/components/Shared/Button/Button";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import styles from "./Header.module.scss";
import { UserProfile } from "../Shared/UserProfile/UserProfile";
import Text from "../Shared/Text";
import Sidebar from "../Shared/Sidebar/Sidebar";
import { LanguageSwitcher } from "../Shared/LanguageSwitcher/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

const Header = () => {
  const userData = useQuery(api.api.profiles.userProfiles.getUserProfile);
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { messages } = useLanguage();

  const isLoading = userData === undefined;

  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
        <div onClick={() => router.push("/")} className={styles.levita}>
          <Text
            fontSize="lg"
            variant="h3"
            fontWeight="bold"
            color="black"
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
              <div className={styles.rightSection}>
                <LanguageSwitcher />
                <div className={styles.authButtons}>
                  <Button
                    variant="contained"
                    onClick={() => router.push("/sign-up")}
                  >
                    {messages.auth.signUp}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push("/sign-in")}
                  >
                    {messages.auth.signIn}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
