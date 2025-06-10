import { Card, CardContent } from "@/components/Shared/Card";
import Button from "@/components/Shared/Button";

import styles from "./PatientHealthAnalysisForm.module.scss";
import Text from "@/components/Shared/Text";
import { useState } from "react";

const PatientHealthAnalysisForm = () => {
  const [showSymptomAnalysis, setShowSymptomAnalysis] =
    useState<boolean>(false);

  const handleStartSymptomAnalysis = () => {
    setShowSymptomAnalysis(true);
  };

  if (showSymptomAnalysis) {
    return <div>Symptom Analysis</div>;
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card} fullWidth>
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
              onClick={handleStartSymptomAnalysis}
              size="xl"
              className={styles.button}
            >
              Start Symptom Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientHealthAnalysisForm;
