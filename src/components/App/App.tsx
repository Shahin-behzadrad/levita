"use client";

import React from "react";
import { useApp } from "@/lib/AppContext";
import styles from "./App.module.scss";

import SignInClient from "@/app/(auth)/sign-in/SignInClient";
import MainPage from "../MainPage/MainPage";
import SignUpClient from "@/app/(auth)/sign-up/SignUpClient";
import { ProfileForm } from "@/app/(auth)/sign-up/ProfileForm";
import ProfileScreen from "../ProfileScreen/ProfileScreen";

export function App() {
  const { currentView, isAuthenticated, userData } = useApp();

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
      // case "consultation":
      //   return <ConsultationCard />;
      // case "health-analysis":
      //   return <HealthAnalysis />;
      // case "profile":
      //   return <ProfileScreen />;
      // case "appointments":
      //   return <Appointments />;
      // case "doctors":
      //   return <Doctors />;
      // case "learn-more":
      //   return <LearnMore />;
      // case "terms":
      //   return <Terms />;
      // case "privacy":
      //   return <Privacy />;
      default:
        return <MainPage userData={userData} />;
    }
  };

  return <div className={styles.app}>{renderContent()}</div>;
}
