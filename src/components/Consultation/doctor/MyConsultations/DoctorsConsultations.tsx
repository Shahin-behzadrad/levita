import styles from "./DoctorsConsultations.module.scss";

import Text from "@/components/Shared/Text";
import { Card, CardContent } from "@/components/Shared/Card";
import Divider from "@/components/Shared/Divider/Divider";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "@/components/Shared/Button/Button";
import { format } from "date-fns";
import {
  MessageSquareText,
  ChevronDown,
  FileText,
  Download,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/AppContext";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useIsMobile } from "@/hooks/use-mobile";
import { LaboratoryFindings } from "./LaboratoryFindings/LaboratoryFindings";

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
                consultations.map((consultation) => {
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
                        <div className={styles.headerContainer}>
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
                        {!isExpanded && (
                          <div className={styles.headerActions}>
                            {consultation.chatIsActive ? (
                              <Button
                                size="sm"
                                variant="contained"
                                fullWidth={isMobile}
                                onClick={() =>
                                  handleStartChat(consultation._id)
                                }
                                startIcon={<MessageSquareText />}
                              >
                                Continue Chat
                              </Button>
                            ) : !consultation.chatIsActive ? (
                              <Button
                                size="sm"
                                variant="contained"
                                fullWidth={isMobile}
                                onClick={() =>
                                  handleStartChat(consultation._id)
                                }
                                startIcon={<MessageSquareText />}
                              >
                                Start Chat
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outlined"
                                onClick={() =>
                                  handleStartChat(consultation._id)
                                }
                                startIcon={<MessageSquareText />}
                                fullWidth={isMobile}
                              >
                                View Chat History
                              </Button>
                            )}
                          </div>
                        )}
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
                              ?.clinicalConsiderations && (
                              <div className={styles.section}>
                                <Text
                                  value="Clinical Considerations"
                                  fontSize="sm"
                                  fontWeight="medium"
                                />
                                <Text
                                  value={
                                    consultation.doctorReportPreview
                                      .clinicalConsiderations
                                  }
                                  fontSize="sm"
                                  color="gray"
                                />
                              </div>
                            )}

                            {consultation.doctorReportPreview
                              ?.differentialDiagnosis &&
                              consultation.doctorReportPreview
                                .differentialDiagnosis.length > 0 && (
                                <div className={styles.section}>
                                  <Text
                                    value="Differential Diagnosis"
                                    fontSize="sm"
                                    fontWeight="medium"
                                  />
                                  <ul className={styles.list}>
                                    {consultation.doctorReportPreview.differentialDiagnosis.map(
                                      (diagnosis, index) => (
                                        <li key={index}>
                                          <Text
                                            value={diagnosis}
                                            fontSize="sm"
                                            color="gray"
                                          />
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}

                            {consultation.doctorReportPreview
                              ?.recommendations &&
                              consultation.doctorReportPreview.recommendations
                                .length > 0 && (
                                <div className={styles.section}>
                                  <Text
                                    value="Recommendations"
                                    fontSize="sm"
                                    fontWeight="medium"
                                  />
                                  <ul className={styles.list}>
                                    {consultation.doctorReportPreview.recommendations.map(
                                      (recommendation, index) => (
                                        <li key={index}>
                                          <Text
                                            value={recommendation}
                                            fontSize="sm"
                                            color="gray"
                                          />
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}

                            {consultation.doctorReportPreview?.conclusion && (
                              <div className={styles.section}>
                                <Text
                                  value="Conclusion"
                                  fontSize="sm"
                                  fontWeight="medium"
                                />
                                <Text
                                  value={
                                    consultation.doctorReportPreview.conclusion
                                  }
                                  fontSize="sm"
                                  color="gray"
                                />
                              </div>
                            )}

                            {consultation.patient?.documents &&
                              consultation.patient.documents.length > 0 && (
                                <div className={styles.section}>
                                  <Text
                                    value="Patient Documents"
                                    fontSize="sm"
                                    fontWeight="medium"
                                  />
                                  <div className={styles.documentsList}>
                                    {consultation.patient.documents.map(
                                      (doc, index) => (
                                        <div
                                          key={index}
                                          className={styles.documentItem}
                                        >
                                          <FileText size={20} />
                                          <Button
                                            size="sm"
                                            variant="text"
                                            startIcon={<Download size={16} />}
                                            onClick={() =>
                                              window.open(doc ?? "", "_blank")
                                            }
                                          >
                                            Download
                                          </Button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                            <LaboratoryFindings
                              findings={
                                consultation.doctorReportPreview
                                  ?.laboratoryFindings
                              }
                              consultationId={consultation._id}
                              isExpanded={expandedLabFindings.has(
                                consultation._id
                              )}
                              onToggle={toggleLabFindings}
                            />

                            <div className={styles.actions}>
                              {consultation.chatIsActive ? (
                                <Button
                                  variant="contained"
                                  size="sm"
                                  fullWidth={isMobile}
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
                                  size="sm"
                                  fullWidth={isMobile}
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
                                  size="sm"
                                  fullWidth={isMobile}
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
