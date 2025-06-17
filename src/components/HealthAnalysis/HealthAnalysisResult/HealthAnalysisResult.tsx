"use client";

import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Grid from "@/components/Shared/Grid/Grid";
import { Text } from "@/components/Shared/Text/Text";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useLanguage } from "@/i18n/LanguageContext";
import styles from "./HealthAnalysisResult.module.scss";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const HealthAnalysisResult = () => {
  const isMobile = useIsMobile();
  const hasSubmitted = useRef(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { messages } = useLanguage();
  const getAIAnalysis = useQuery(api.api.health.healthAnalysis.getAIAnalysis);
  const patientProfile = useQuery(
    api.api.profiles.patientProfiles.getPatientProfile
  );

  const getExisting = useQuery(
    api.api.consultation.getExistingConsultationRequest
      .getExistingConsultationRequest,
    patientProfile?._id ? { patientId: patientProfile?._id } : "skip"
  );

  const safeCreateRequest = useMutation(
    api.api.consultation.createConsultationRequest.CreateConsultationRequest
  );

  useEffect(() => {
    if (
      patientProfile?._id &&
      getAIAnalysis?.doctorReport &&
      getExisting === null &&
      !hasSubmitted.current
    ) {
      hasSubmitted.current = true; // prevent second execution
      void safeCreateRequest({
        patientId: patientProfile._id,
        doctorReportPreview: getAIAnalysis.doctorReport,
      });
    }
  }, [getAIAnalysis, getExisting, patientProfile?._id]);

  if (!getAIAnalysis?.doctorReport) {
    return null;
  }

  const { summary, testResults, reassurance, nextSteps } =
    getAIAnalysis.patientReport;

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          onClick={() => setIsExpanded(!isExpanded)}
          titleStartAdornment={<div className={styles.titleIcon}>📋</div>}
          title={messages.healthAnalysis?.yourAnalysisResults}
          titleColor="black"
          titleFontSize={isMobile ? 14 : 20}
          className={styles.cardHeader}
          titleEndAdornment={
            <ChevronDown
              size={20}
              className={clsx(styles.expandIcon, {
                [styles.expanded]: isExpanded,
              })}
            />
          }
        />
        <CardContent
          className={clsx(styles.cardContent, {
            [styles.expanded]: isExpanded,
          })}
        >
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
