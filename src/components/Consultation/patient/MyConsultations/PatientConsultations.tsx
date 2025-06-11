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
import { Chat } from "../../Chat/Chat";
import { useApp } from "@/lib/AppContext";
import { MessageSquareText } from "lucide-react";
import Button from "@/components/Shared/Button";

const PatientConsultations = ({
  getAIAnalysis,
  userId,
}: {
  getAIAnalysis?: AIAnalysisResult | null;
  userId: Id<"patientProfiles"> | null;
}) => {
  const { setView, setActiveChatId } = useApp();
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

  const handleStartChat = (consultationId: Id<"consultations">) => {
    setActiveChatId(consultationId);
    setView("chat");
  };

  if (!existingConsultations) {
    return null;
  }

  return (
    <div className={styles.pendingConsultations}>
      <Text
        value="My Consultation"
        textAlign="left"
        fontSize="xl"
        fontWeight="bold"
        className={styles.title}
        startAdornment={<div className={styles.icon} />}
      />
      <Card>
        <CardContent className={styles.consultationsList}>
          {existingConsultations ? (
            <div className={styles.consultationItem}>
              <div
                className={clsx(styles.consultationHeader, styles.clickable)}
                onClick={toggleExpand}
              >
                <div className={styles.status}>
                  <div
                    className={clsx(
                      styles.statusDot,
                      existingConsultations.status === "pending"
                        ? styles.pending
                        : existingConsultations.status === "accepted"
                          ? styles.completed
                          : styles.cancelled
                    )}
                  />
                  <Text
                    value={existingConsultations.status}
                    fontSize="sm"
                    color="gray"
                  />
                </div>
                <div className={styles.time}>
                  <Text
                    value={formatTime(existingConsultations.createdAt)}
                    fontSize="sm"
                    color="gray"
                  />
                </div>
              </div>

              {isExpanded && (
                <>
                  <Divider />
                  <div className={styles.consultationDetails}>
                    {existingConsultations.consultationDateTime && (
                      <div className={styles.scheduledTime}>
                        <Text
                          value="Scheduled Time"
                          fontSize="sm"
                          fontWeight="medium"
                        />
                        <Text
                          value={existingConsultations.consultationDateTime}
                          fontSize="sm"
                          color="gray"
                        />
                      </div>
                    )}

                    {existingConsultations.doctorReportPreview && (
                      <div className={styles.reportPreview}>
                        <Text
                          value="Report Preview"
                          fontSize="sm"
                          fontWeight="medium"
                        />
                        <Text
                          value={
                            existingConsultations.doctorReportPreview
                              .patientOverview
                          }
                          fontSize="sm"
                          color="gray"
                        />
                      </div>
                    )}

                    <div className={styles.actions}>
                      {existingConsultations.chatStarted &&
                      !existingConsultations.chatEnded ? (
                        <Button
                          variant="contained"
                          onClick={() =>
                            handleStartChat(existingConsultations._id)
                          }
                          startIcon={<MessageSquareText />}
                        >
                          Continue Chat
                        </Button>
                      ) : !existingConsultations.chatStarted &&
                        !existingConsultations.chatEnded ? (
                        <Button
                          variant="contained"
                          onClick={() =>
                            handleStartChat(existingConsultations._id)
                          }
                          startIcon={<MessageSquareText />}
                        >
                          Join Chat
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          onClick={() =>
                            handleStartChat(existingConsultations._id)
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
          ) : (
            <div className={styles.emptyState}>
              <Text value="📋" className={styles.emoji} />
              <Text value="No Consultation Request" />
              <Text
                value="You haven't submitted any consultation requests yet."
                className={styles.description}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientConsultations;
