import type React from "react";
import Link from "next/link";
import { Button } from "@/components/Shared/Button/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/Shared/Card";
import { Eye, EyeOff } from "lucide-react";
import TextField from "@/components/Shared/TextField";
import styles from "./AuthForm.module.scss";
import { useApp } from "@/lib/AppContext";
import Text from "../Text";
import { useIsMobile } from "@/hooks/use-mobile";

export interface AuthFormProps {
  type: "sign-in" | "sign-up";
  title: string;
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  passwordError?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  messages: {
    email: string;
    password: string;
    submit: string;
    loading: string;
    switchText: string;
    switchLink: string;
    switchUrl: string;
  };
}

export default function AuthForm({
  type,
  title,
  email,
  password,
  showPassword,
  isLoading,
  passwordError,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  messages,
}: AuthFormProps) {
  const { setView } = useApp();
  const isMobile = useIsMobile();

  const handleSwitch = () =>
    setView(type === "sign-in" ? "sign-up" : "sign-in");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text
          className={styles.headerText}
          value="Welcome to"
          fontSize={isMobile ? "lg" : "xxl"}
          variant="h4"
          noWrap
          fontWeight="bold"
          endAdornment={
            <Text
              value="Levita"
              fontSize={isMobile ? "lg" : "xxl"}
              variant="h4"
              fontWeight="bold"
              color="primary"
            />
          }
          textAlign="center"
        />
        <Text
          value="AI-powered medical consultations for better healthcare"
          textAlign="center"
          fontSize="lg"
        />
      </div>
      <Card className={styles.card}>
        <CardHeader title={title} />
        <form onSubmit={onSubmit}>
          <CardContent className={styles.content}>
            <div className={styles.formGroup}>
              <TextField
                label={messages.email}
                name="email"
                type="email"
                placeholder="m.johnson@example.com"
                required
                value={email}
                onChangeText={onEmailChange}
              />
            </div>
            <div className={styles.formGroup}>
              <div className={styles.passwordInput}>
                <TextField
                  label={messages.password}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChangeText={onPasswordChange}
                  error={!!passwordError}
                  helperText={passwordError}
                  endAdornment={
                    <Button onClick={onTogglePassword}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  }
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button
              type="submit"
              size="lg"
              variant="contained"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? messages.loading : messages.submit}
            </Button>
            <div className={styles.switchText}>
              {messages.switchText}{" "}
              <Button onClick={handleSwitch} className={styles.switchLink}>
                {messages.switchLink}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
