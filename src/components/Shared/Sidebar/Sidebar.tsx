import { FC, useEffect } from "react";
import Link from "next/link";
import Button from "../Button";
import { SignOutButton } from "../../SignOutButton/SignOutButton";
import { UserProfile } from "../UserProfile/UserProfile";
import styles from "./Sidebar.module.scss";
import clsx from "clsx";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userData?: {
    _id: string;
    name?: string;
  } | null;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onOpenChange, userData }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <>
      <div
        className={clsx(styles.backdrop, {
          [styles.invisible]: !isOpen,
        })}
        onClick={() => onOpenChange(false)}
      />
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
        role="complementary"
      >
        <Button size="sm" onClick={() => onOpenChange(false)}>
          <X />
        </Button>
        <div className={styles.sidebarContainer}>
          {userData?._id ? (
            <>
              <div className={styles.profileSection}>
                <UserProfile userData={userData} />
              </div>
              <div className={styles.profileSection}>
                <SignOutButton />
              </div>
            </>
          ) : (
            <div className={styles.authSection}>
              <Link href="/sign-in">
                <Button variant="outlined" onClick={() => onOpenChange(false)}>
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button onClick={() => onOpenChange(false)}>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
