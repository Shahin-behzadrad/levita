import styles from "./PatientConsultations.module.scss";

import Text from "@/components/Shared/Text";
import { Card, CardContent } from "@/components/Shared/Card";
import Divider from "@/components/Shared/Divider/Divider";
import { api } from "../../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import clsx from "clsx";
import { useApp } from "@/lib/AppContext";
import {
  LucideBookMarked,
  MessageSquareText,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Button from "@/components/Shared/Button";

const PatientConsultations = ({
  userId,
}: {
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
                  {existingConsultations.status === "pending" ? (
                    <div className={clsx(styles.statusDot, styles.pending)} />
                  ) : (
                    <LucideBookMarked color="var(--gray)" />
                  )}
                  <Text
                    value={existingConsultations.status}
                    fontSize="sm"
                    color="gray"
                  />
                  <ChevronDown
                    size={16}
                    color="var(--gray)"
                    className={clsx(styles.expandIcon, {
                      [styles.expanded]: isExpanded,
                    })}
                  />
                </div>
                <div className={styles.consultationHeaderRight}>
                  <div className={styles.time}>
                    <Text
                      value={formatTime(existingConsultations.createdAt)}
                      fontSize="sm"
                      color="gray"
                    />
                  </div>
                  {!isExpanded &&
                    existingConsultations.status !== "pending" && (
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
                    )}
                </div>
              </div>

              <div
                className={clsx(styles.content, {
                  [styles.expanded]: isExpanded,
                })}
              >
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

                  {existingConsultations.status !== "pending" && (
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
                  )}
                </div>
              </div>
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
