"use client";

import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import Text from "@/components/Shared/Text";
import styles from "./ErrorBoundary.module.scss";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

function ErrorFallback() {
  const { messages } = useLanguage();

  return (
    <div className={styles.container}>
      <Text
        value={messages.errors.somethingWentWrong}
        variant="p"
        fontSize="lg"
      />
    </div>
  );
}
