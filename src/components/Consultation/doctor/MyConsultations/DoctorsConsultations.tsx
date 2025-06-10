import styles from "./DoctorsConsultations.module.scss";

import Text from "@/components/Shared/Text";
import { Card, CardContent } from "@/components/Shared/Card";
import Divider from "@/components/Shared/Divider/Divider";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "@/components/Shared/Button/Button";
import { format } from "date-fns";
import { MessageSquareText, ChevronDown } from "lucide-react";
import { useState } from "react";

const DoctorsConsultations = () => {
  const consultations = useQuery(
    api.api.consultation.getDoctorConsultations.getDoctorConsultations
  );
  const [expandedConsultations, setExpandedConsultations] = useState<
    Set<string>
  >(new Set());

  const toggleConsultation = (consultationId: string) => {
    setExpandedConsultations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(consultationId)) {
        newSet.delete(consultationId);
      } else {
        newSet.add(consultationId);
      }
      return newSet;
    });
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
          <CardContent className={styles.consultationsList}>
            {consultations && consultations.length > 0 ? (
              consultations.map((consultation, index) => {
                const isExpanded = expandedConsultations.has(consultation._id);
                return (
                  <div
                    key={consultation._id}
                    className={styles.consultationItem}
                  >
                    <div
                      className={styles.consultationHeader}
                      onClick={() => toggleConsultation(consultation._id)}
                    >
                      <div className={styles.patientInfo}>
                        <Text
                          value={
                            consultation.patient?.fullName || "Unknown Patient"
                          }
                          fontSize="lg"
                          fontWeight="bold"
                        />
                        <Text
                          value={`${consultation.patient?.age || "N/A"} years old • ${consultation.patient?.sex || "N/A"}`}
                          fontSize="sm"
                          color="gray"
                        />
                      </div>
                      <div className={styles.headerRight}>
                        <div className={styles.consultationDateTime}>
                          <Text
                            value={
                              consultation.consultationDateTime
                                ? format(
                                    new Date(consultation.consultationDateTime),
                                    "MMM dd, yyyy"
                                  )
                                : "N/A"
                            }
                            fontSize="sm"
                            fontWeight="medium"
                          />
                          <Text
                            value={
                              consultation.consultationDateTime
                                ? format(
                                    new Date(consultation.consultationDateTime),
                                    "hh:mm a"
                                  )
                                : "N/A"
                            }
                            fontSize="sm"
                            color="gray"
                          />
                        </div>
                        <ChevronDown
                          className={`${styles.chevron} ${isExpanded ? styles.expanded : ""}`}
                          size={20}
                        />
                      </div>
                    </div>

                    {isExpanded && (
                      <>
                        <div className={styles.consultationDetails}>
                          <div className={styles.overview}>
                            <Text
                              value="Patient Overview"
                              fontSize="sm"
                              fontWeight="bold"
                            />
                            <Text
                              value={
                                consultation.doctorReportPreview
                                  ?.patientOverview || "No overview available"
                              }
                              fontSize="sm"
                              color="gray"
                            />
                          </div>

                          <div className={styles.clinicalConsiderations}>
                            <Text
                              value="Clinical Considerations"
                              fontSize="sm"
                              fontWeight="bold"
                            />
                            <Text
                              value={
                                consultation.doctorReportPreview
                                  ?.clinicalConsiderations ||
                                "No clinical considerations available"
                              }
                              fontSize="sm"
                              color="gray"
                            />
                          </div>

                          <div className={styles.recommendations}>
                            <Text
                              value="Recommendations"
                              fontSize="sm"
                              fontWeight="bold"
                            />
                            <ul className={styles.recommendationsList}>
                              {consultation.doctorReportPreview?.recommendations?.map(
                                (rec, idx) => (
                                  <li key={idx}>
                                    <Text
                                      value={rec}
                                      fontSize="sm"
                                      color="gray"
                                    />
                                  </li>
                                )
                              ) || (
                                <li>
                                  <Text
                                    value="No recommendations available"
                                    fontSize="sm"
                                    color="gray"
                                  />
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        <div className={styles.actions}>
                          <Button
                            variant="contained"
                            disabled={true}
                            onClick={() => {}}
                            startIcon={<MessageSquareText />}
                          >
                            Start Chat
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <Text value="📋" className={styles.emoji} />
                <Text value="No accepted Appointments" />
                <Text
                  value="All caught up! No accepted appointment at the moment."
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

export default DoctorsConsultations;
