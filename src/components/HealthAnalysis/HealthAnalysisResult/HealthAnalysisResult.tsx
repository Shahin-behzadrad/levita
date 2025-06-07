"use client";

import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Grid from "@/components/Shared/Grid/Grid";
import { Text } from "@/components/Shared/Text/Text";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useLanguage } from "@/i18n/LanguageContext";
import styles from "./HealthAnalysisResult.module.scss";
import { TriangleAlert } from "lucide-react";

export const HealthAnalysisResult = () => {
  const { messages } = useLanguage();
  const getAIAnalysis = useQuery(api.api.health.healthAnalysis.getAIAnalysis);

  if (!getAIAnalysis?.patientReport) {
    return null;
  }

  const { summary, testResults, reassurance, nextSteps } =
    getAIAnalysis.patientReport;

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          title={messages.healthAnalysis?.result}
          titleColor="true-white"
        />
        <Text
          value={messages.healthAnalysis?.lookingForPractitioner}
          color="true-white"
          textAlign="center"
          fontWeight="bold"
          fontSize="lg"
        />
        <Text
          value={messages.healthAnalysis?.willBeContacted}
          textAlign="center"
          className={styles.alertText}
          endAdornment={<TriangleAlert size={20} />}
          startAdornment={<TriangleAlert size={20} />}
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card hasBoxShadow={false}>
                <CardHeader
                  title={messages.healthAnalysis?.summary}
                  titleColor="secondary"
                />
                <CardContent>
                  <Text
                    value={summary}
                    fontSize="md"
                    color="gray"
                    fontWeight="normal"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card hasBoxShadow={false}>
                <CardHeader
                  title={messages.healthAnalysis?.testResults}
                  titleColor="secondary"
                />
                <CardContent>
                  <Text
                    value={testResults}
                    fontSize="md"
                    color="gray"
                    fontWeight="normal"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card hasBoxShadow={false}>
                <CardHeader
                  title={messages.healthAnalysis?.reassurance}
                  titleColor="secondary"
                />
                <CardContent>
                  <Text
                    value={reassurance}
                    fontSize="md"
                    color="gray"
                    fontWeight="normal"
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card hasBoxShadow={false}>
                <CardHeader
                  title={messages.healthAnalysis?.nextSteps}
                  titleColor="secondary"
                />
                <CardContent>
                  <Text
                    value={nextSteps}
                    fontSize="md"
                    color="gray"
                    fontWeight="normal"
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
