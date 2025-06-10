import styles from "./PatientConsultations.module.scss";

import Text from "@/components/Shared/Text";
import { Card, CardContent } from "@/components/Shared/Card";
import Divider from "@/components/Shared/Divider/Divider";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { AIAnalysisResult } from "@/types/healthAnalysis";
import { Id } from "../../../../../convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import clsx from "clsx";

const PatientConsultations = ({
  getAIAnalysis,
  userId,
}: {
  getAIAnalysis?: AIAnalysisResult | null;
  userId: Id<"patientProfiles"> | null;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const existingConsultations = useQuery(
    api.api.consultation.getExistingConsultationRequest
      .getExistingConsultationRequest,
    userId ? { patientId: userId } : "skip"
  );

  const formatTime = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className={styles.pendingConsultations}>
        <Text
          value="My Appointments"
          textAlign="left"
          fontSize="xl"
          fontWeight="bold"
          className={styles.title}
          startAdornment={<div className={styles.icon} />}
        />
        <Card className={styles.pendingConsultationsList}>
          <CardContent>
            {existingConsultations ? (
              <div className={styles.consultationDetails}>
                <div
                  className={clsx(styles.header, styles.clickable)}
                  onClick={toggleExpand}
                >
                  <div className={styles.status}>
                    <span
                      className={`${styles.statusDot} ${styles[existingConsultations.status]}`}
                    />
                    <Text
                      value={
                        existingConsultations.status.charAt(0).toUpperCase() +
                        existingConsultations.status.slice(1)
                      }
                    />
                  </div>
                  <div className={styles.headerRight}>
                    <Text
                      value={`${formatTime(existingConsultations.createdAt)}`}
                      className={styles.time}
                    />
                    <span
                      className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ""}`}
                    >
                      ▼
                    </span>
                  </div>
                </div>

                <div
                  className={`${styles.content} ${isExpanded ? styles.expanded : ""}`}
                >
                  <Divider className={styles.divider} />

                  {existingConsultations.doctorReportPreview && (
                    <>
                      <div className={styles.overview}>
                        <Text
                          value="Patient Overview"
                          fontWeight="bold"
                          className={styles.sectionTitle}
                        />
                        <Text
                          value={
                            existingConsultations.doctorReportPreview
                              .patientOverview
                          }
                        />
                      </div>

                      <div className={styles.conclusion}>
                        <Text
                          value="Conclusion"
                          fontWeight="bold"
                          className={styles.sectionTitle}
                        />
                        <Text
                          value={
                            existingConsultations.doctorReportPreview.conclusion
                          }
                        />
                      </div>

                      <div className={styles.recommendations}>
                        <Text
                          value="Recommendations"
                          fontWeight="bold"
                          className={styles.sectionTitle}
                        />
                        <ul className={styles.recommendationList}>
                          {existingConsultations.doctorReportPreview.recommendations.map(
                            (rec, index) => (
                              <li key={index}>
                                <Text value={rec} />
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <Text value="📋" className={styles.emoji} />
                <Text value="No appointments yet" className={styles.title} />
                <Text
                  value="Start by describing your symptoms above to get connected with a healthcare professional."
                  className={styles.description}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PatientConsultations;
