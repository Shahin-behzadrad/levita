import { Card, CardContent } from "@/components/Shared/Card";
import Button from "@/components/Shared/Button";

import styles from "./PatientHealthAnalysisForm.module.scss";
import Text from "@/components/Shared/Text";
import { useState } from "react";

import { HealthAnalysis } from "@/components/HealthAnalysis/HealthAnalysisForm/healthAnalysisClient";
import { HealthAnalysisResult } from "@/components/HealthAnalysis/HealthAnalysisResult/HealthAnalysisResult";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

const PatientHealthAnalysisForm = () => {
  const [showAnalysisForm, setShowAnalysisForm] = useState<boolean>(false);

  const getAIAnalysis = useQuery(api.api.health.healthAnalysis.getAIAnalysis);

  return (
    <div className={styles.container}>
      {getAIAnalysis ? (
        <HealthAnalysisResult />
      ) : (
        <>
          {showAnalysisForm ? (
            <HealthAnalysis onCancel={() => setShowAnalysisForm(false)} />
          ) : (
            <Card className={styles.card}>
              <CardContent>
                <div className={styles.content}>
                  <div className={styles.emoji}>🩺</div>
                  <Text
                    variant="h4"
                    fontWeight="bold"
                    value="How are you feeling today?"
                  />
                  <Text
                    variant="p"
                    color="gray"
                    value="Describe your symptoms and upload lab results for AI-powered medical analysis"
                  />
                  <Button
                    variant="contained"
                    onClick={() => setShowAnalysisForm(true)}
                    size="xl"
                    className={styles.button}
                  >
                    Start Symptom Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PatientHealthAnalysisForm;
