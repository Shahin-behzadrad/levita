"use client";

import React from "react";
import { useApp } from "@/lib/AppContext";
import styles from "./App.module.scss";

import MainPage from "../MainPage/MainPage";
import ProfileScreen from "../ProfileScreen/ProfileScreen";
import SignInClient from "../Auth/sign-in/SignInClient";
import SignUpClient from "../Auth/sign-up/SignUpClient";
import { ProfileForm } from "../Auth/sign-up/ProfileForm";
import LoadingModal from "../LoadingModal/LoadingModal";

export function App() {
  const { currentView, isAuthenticated, userData } = useApp();

  if (userData === undefined) {
    return <LoadingModal />;
  }

  const renderContent = () => {
    if (
      !isAuthenticated &&
      currentView !== "sign-in" &&
      currentView !== "sign-up"
    ) {
      return <SignInClient />;
    }

    switch (currentView) {
      case "home":
        return <MainPage userData={userData} />;
      case "sign-in":
        return <SignInClient />;
      case "sign-up":
        return <SignUpClient />;
      case "complete-profile":
        return <ProfileForm />;
      case "profile":
        return <ProfileScreen userData={userData} />;

      default:
        return <MainPage userData={userData} />;
    }
  };

  return <div className={styles.app}>{renderContent()}</div>;
}
