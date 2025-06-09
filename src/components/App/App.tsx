import React from "react";
import { useApp } from "@/lib/AppContext";
import MainPage from "@/components/MainPage/MainPage";
import styles from "./App.module.scss";
import SignInClient from "@/app/(auth)/sign-in/SignInClient";
import SignUpClient from "@/app/(auth)/sign-up/SignUpClient";
import { HealthAnalysis } from "../HealthAnalysis/HealthAnalysisForm/healthAnalysisClient";
import ProfileScreen from "../ProfileScreen/ProfileScreen";
import { ConsultationCard } from "../Consultation/ConsultationCard";
import { Appointments } from "../Appointments/Appointments";
import { Doctors } from "../Doctors/Doctors";
import { LearnMore } from "../LearnMore/LearnMore";
import { Terms } from "../Terms/Terms";
import { Privacy } from "../Privacy/Privacy";

export function App() {
  const { currentView, isAuthenticated } = useApp();

  const renderContent = () => {
    if (
      !isAuthenticated &&
      currentView !== "home" &&
      currentView !== "sign-in" &&
      currentView !== "sign-up"
    ) {
      return <SignInClient />;
    }

    switch (currentView) {
      case "home":
        return <MainPage />;
      case "sign-in":
        return <SignInClient />;
      case "sign-up":
        return <SignUpClient />;
      case "consultation":
        return <ConsultationCard />;
      case "health-analysis":
        return <HealthAnalysis />;
      case "profile":
        return <ProfileScreen />;
      case "appointments":
        return <Appointments />;
      case "doctors":
        return <Doctors />;
      case "learn-more":
        return <LearnMore />;
      case "terms":
        return <Terms />;
      case "privacy":
        return <Privacy />;
      default:
        return <MainPage />;
    }
  };

  return <div className={styles.app}>{renderContent()}</div>;
}
