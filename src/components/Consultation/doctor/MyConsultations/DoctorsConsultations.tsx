import styles from "./DoctorsConsultations.module.scss";

import Text from "@/components/Shared/Text";
import { Card, CardContent } from "@/components/Shared/Card";
import Divider from "@/components/Shared/Divider/Divider";
import { api } from "../../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Button } from "@/components/Shared/Button/Button";
import { format } from "date-fns";
import { MessageSquareText, ChevronDown, Microscope } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useIsMobile } from "@/hooks/use-mobile";

const DoctorsConsultations = () => {
  const isMobile = useIsMobile();
  const { setView, setActiveChatId } = useApp();
  const consultations = useQuery(
    api.api.consultation.getDoctorConsultations.getDoctorConsultations
  );

  const [expandedConsultations, setExpandedConsultations] = useState<
    Set<string>
  >(new Set());
  const [expandedLabFindings, setExpandedLabFindings] = useState<Set<string>>(
    new Set()
  );

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

  const toggleLabFindings = (consultationId: string) => {
    setExpandedLabFindings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(consultationId)) {
        newSet.delete(consultationId);
      } else {
        newSet.add(consultationId);
      }
      return newSet;
    });
  };

  const handleStartChat = (consultationId: Id<"consultations">) => {
    setActiveChatId(consultationId);
    setView("chat");
  };

  const renderLabFindings = (findings: any, consultationId: string) => {
    if (
      !findings ||
      (!findings.Biochemistry?.length &&
        !findings.Complete_Blood_Count?.length &&
        !findings.Other?.length)
    ) {
      return (
        <Text
          value="No laboratory findings available"
          fontSize="sm"
          color="gray"
        />
      );
    }

    const isExpanded = expandedLabFindings.has(consultationId);

    return (
      <div className={styles.laboratoryFindings}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleLabFindings(consultationId)}
        >
          <Microscope size={20} />
          <Text value="Laboratory Findings" fontSize="sm" fontWeight="medium" />
          <ChevronDown
            className={`${styles.chevron} ${isExpanded ? styles.expanded : ""}`}
            size={20}
          />
        </div>
        {isExpanded && (
          <div className={styles.labFindings}>
            {findings.Biochemistry?.length > 0 && (
              <div className={styles.labSection}>
                <Text
                  value="Biochemistry"
                  fontSize="sm"
                  fontWeight="bold"
                  className={styles.labSectionTitle}
                />
                <div className={styles.labResults}>
                  {findings.Biochemistry.map((result: string, idx: number) => (
                    <div key={idx} className={styles.labResult}>
                      <Text value={result} fontSize="sm" color="gray" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {findings.Complete_Blood_Count?.length > 0 && (
              <div className={styles.labSection}>
                <Text
                  value="Complete Blood Count"
                  fontSize="sm"
                  fontWeight="bold"
                  className={styles.labSectionTitle}
                />
                <div className={styles.labResults}>
                  {findings.Complete_Blood_Count.map(
                    (result: string, idx: number) => (
                      <div key={idx} className={styles.labResult}>
                        <Text value={result} fontSize="sm" color="gray" />
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {findings.Other?.length > 0 && (
              <div className={styles.labSection}>
                <Text
                  value="Other Tests"
                  fontSize="sm"
                  fontWeight="bold"
                  className={styles.labSectionTitle}
                />
                <div className={styles.labResults}>
                  {findings.Other.map((result: string, idx: number) => (
                    <div key={idx} className={styles.labResult}>
                      <Text value={result} fontSize="sm" color="gray" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!consultations) {
    return null;
  }

  return (
    <>
      <div className={styles.container}>
        <Text
          value="My Appointments"
          textAlign="left"
          fontSize="xl"
          fontWeight="bold"
          className={styles.title}
          startAdornment={<div className={styles.icon} />}
        />
        <Card>
          <CardContent>
            <div className={styles.consultationsList}>
              {consultations.length > 0 ? (
                consultations.map((consultation, index) => {
                  const isExpanded = expandedConsultations.has(
                    consultation._id
                  );

                  return (
                    <div
                      key={consultation._id}
                      id={`consultation-${consultation._id}`}
                      className={styles.consultationItem}
                    >
                      <div
                        className={styles.consultationHeader}
                        onClick={() => toggleConsultation(consultation._id)}
                      >
                        <div className={styles.headerLeft}>
                          <Text
                            value={
                              consultation.patient?.fullName ??
                              "Unknown Patient"
                            }
                            fontSize="md"
                            fontWeight="medium"
                          />
                          <div className={styles.status}>
                            <div
                              className={`${styles.statusDot} ${
                                consultation.status === "pending"
                                  ? styles.pending
                                  : consultation.status === "accepted"
                                    ? styles.completed
                                    : styles.cancelled
                              }`}
                            />
                            <Text
                              value={consultation.status}
                              fontSize="sm"
                              color="gray"
                            />
                          </div>
                        </div>

                        <div className={styles.headerRight}>
                          <div className={styles.consultationDateTime}>
                            <Text
                              value={
                                consultation.consultationDateTime
                                  ? format(
                                      new Date(
                                        consultation.consultationDateTime
                                      ),
                                      "MMM dd, yyyy"
                                    )
                                  : "N/A"
                              }
                              fontSize={isMobile ? "xs" : "sm"}
                              fontWeight="medium"
                            />
                            <Text
                              value={
                                consultation.consultationDateTime
                                  ? format(
                                      new Date(
                                        consultation.consultationDateTime
                                      ),
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
                          <Divider className={styles.divider} />
                          <div className={styles.consultationDetails}>
                            <div className={styles.patientInfo}>
                              <Text
                                value="Patient Information"
                                fontSize="sm"
                                fontWeight="medium"
                              />
                              <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                  <Text
                                    value="Name:"
                                    fontSize="sm"
                                    color="gray"
                                  />
                                  <Text
                                    value={
                                      consultation.patient?.fullName ?? "N/A"
                                    }
                                    fontSize="sm"
                                  />
                                </div>
                                <div className={styles.infoItem}>
                                  <Text
                                    value="Age:"
                                    fontSize="sm"
                                    color="gray"
                                  />
                                  <Text
                                    value={
                                      consultation.patient?.age.toString() ??
                                      "N/A"
                                    }
                                    fontSize="sm"
                                  />
                                </div>
                                <div className={styles.infoItem}>
                                  <Text
                                    value="Sex:"
                                    fontSize="sm"
                                    color="gray"
                                  />
                                  <Text
                                    value={consultation.patient?.sex ?? "N/A"}
                                    fontSize="sm"
                                  />
                                </div>
                              </div>
                            </div>

                            {consultation.doctorReportPreview && (
                              <div className={styles.overview}>
                                <Text
                                  value="Report Preview"
                                  fontSize="sm"
                                  fontWeight="medium"
                                />
                                <Text
                                  value={
                                    consultation.doctorReportPreview
                                      .patientOverview
                                  }
                                  fontSize="sm"
                                  color="gray"
                                />
                              </div>
                            )}

                            {consultation.doctorReportPreview
                              ?.laboratoryFindings &&
                              renderLabFindings(
                                consultation.doctorReportPreview
                                  .laboratoryFindings,
                                consultation._id
                              )}

                            <div className={styles.actions}>
                              {consultation.chatIsActive ? (
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    handleStartChat(consultation._id)
                                  }
                                  startIcon={<MessageSquareText />}
                                >
                                  Continue Chat
                                </Button>
                              ) : !consultation.chatIsActive ? (
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    handleStartChat(consultation._id)
                                  }
                                  startIcon={<MessageSquareText />}
                                >
                                  Start Chat
                                </Button>
                              ) : (
                                <Button
                                  variant="outlined"
                                  onClick={() =>
                                    handleStartChat(consultation._id)
                                  }
                                  startIcon={<MessageSquareText />}
                                >
                                  View Chat History
                                </Button>
                              )}
                            </div>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DoctorsConsultations;
