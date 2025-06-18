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
  Video,
} from "lucide-react";
import Button from "@/components/Shared/Button";
import Tooltip from "@/components/Shared/Tooltip/Tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "@/components/Shared/Image/Image";

const PatientConsultations = ({
  userId,
}: {
  userId: Id<"patientProfiles"> | null;
}) => {
  const isMobile = useIsMobile();
  const { setView, setActiveChatId } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const existingConsultations = useQuery(
    api.api.consultation.getExistingConsultationRequest
      .getExistingConsultationRequest,
    userId ? { patientId: userId } : "skip"
  );

  const doctorProfile = useQuery(
    api.api.profiles.doctorProfile.getDoctorProfileById,
    existingConsultations?.acceptedByDoctorId
      ? { doctorId: existingConsultations.acceptedByDoctorId }
      : "skip"
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

  // Helper to check if meeting can be joined
  const canJoinMeeting = (consultationDateTime: string | null | undefined) => {
    if (!consultationDateTime) return false;
    const now = new Date();
    const meetingTime = new Date(consultationDateTime);
    // Allow joining if within 10 minutes before or after the scheduled time
    return now >= new Date(meetingTime.getTime() - 10 * 60 * 1000);
  };

  // Helper to get meet link as string
  const getMeetLinkUrl = (meetLink: any) => {
    if (!meetLink) return "";
    if (typeof meetLink === "string") return meetLink;
    if (typeof meetLink === "object" && "href" in meetLink)
      return meetLink.href;
    return String(meetLink);
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
                </div>
                <div className={styles.consultationHeaderRight}>
                  <div className={styles.time}>
                    <Text
                      value={formatTime(existingConsultations.createdAt)}
                      fontSize="sm"
                      color="gray"
                    />
                  </div>
                  <ChevronDown
                    size={20}
                    color="var(--gray)"
                    className={clsx(styles.expandIcon, {
                      [styles.expanded]: isExpanded,
                    })}
                  />
                </div>
              </div>

              {!isExpanded && (
                <div className={styles.headerActions}>
                  {existingConsultations.chatIsActive && (
                    <div
                      className={clsx(styles.chatAndMeetActions, {
                        [styles.mobileActions]: isMobile,
                        [styles.mobileExpanded]: !isExpanded && isMobile,
                      })}
                    >
                      {existingConsultations.meetLink && (
                        <Tooltip
                          tooltipContent={
                            !canJoinMeeting(
                              existingConsultations.consultationDateTime
                            ) ? (
                              <Text
                                className={styles.tooltipText}
                                value="You can join the meeting 10 minutes before the scheduled time."
                              />
                            ) : null
                          }
                          open={
                            !canJoinMeeting(
                              existingConsultations.consultationDateTime
                            )
                              ? undefined
                              : false
                          }
                        >
                          <span>
                            <Button
                              size="sm"
                              fullWidth={isMobile}
                              variant="outlined"
                              startIcon={<Video size={20} />}
                              disabled={
                                !canJoinMeeting(
                                  existingConsultations.consultationDateTime
                                )
                              }
                              onClick={() => {
                                if (
                                  canJoinMeeting(
                                    existingConsultations.consultationDateTime
                                  )
                                ) {
                                  window.open(
                                    getMeetLinkUrl(
                                      existingConsultations.meetLink
                                    ),
                                    "_blank"
                                  );
                                }
                              }}
                            >
                              join meeting
                            </Button>
                          </span>
                        </Tooltip>
                      )}
                      <Button
                        size="sm"
                        variant="contained"
                        fullWidth={isMobile}
                        onClick={() =>
                          handleStartChat(existingConsultations._id)
                        }
                        startIcon={<MessageSquareText size={20} />}
                      >
                        Continue Chat
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <div
                className={clsx(styles.content, {
                  [styles.expanded]: isExpanded,
                })}
              >
                <Divider />
                <div className={styles.consultationDetails}>
                  {doctorProfile && (
                    <Card
                      hasBoxShadow={false}
                      className={styles.doctorProfileCard}
                    >
                      <CardContent className={styles.doctorProfile}>
                        <Text
                          value="Doctor Information"
                          fontSize="sm"
                          fontWeight="medium"
                        />
                        <div className={styles.doctorInfo}>
                          {doctorProfile.profileImage && (
                            <Image
                              src={doctorProfile.profileImage}
                              alt={doctorProfile.fullName}
                              width={60}
                              height={60}
                              shape="square"
                            />
                          )}
                          <div className={styles.doctorDetails}>
                            <Text
                              value={`Dr.  ${doctorProfile.fullName}`}
                              fontSize="md"
                              fontWeight="bold"
                            />
                            <Text
                              value={doctorProfile.specialization}
                              fontSize="sm"
                              color="primary"
                            />

                            <div className={styles.doctorContact}>
                              <div className={styles.contactItem}>
                                <Text
                                  value="License:"
                                  fontSize="sm"
                                  color="gray"
                                />
                                <Text
                                  value={doctorProfile.licenseNumber}
                                  fontSize="sm"
                                />
                              </div>

                              <div className={styles.contactItem}>
                                <Text
                                  value="Contact:"
                                  fontSize="sm"
                                  color="gray"
                                />
                                <Text
                                  value={doctorProfile.phoneNumber}
                                  fontSize="sm"
                                />
                              </div>
                              {doctorProfile.bio && (
                                <Text
                                  value={doctorProfile.bio}
                                  fontSize="sm"
                                  color="gray"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

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
                    {existingConsultations.chatIsActive ? (
                      <div
                        className={clsx(styles.chatAndMeetActions, {
                          [styles.mobileActions]: isMobile,
                        })}
                      >
                        {existingConsultations.meetLink && (
                          <Tooltip
                            tooltipContent={
                              !canJoinMeeting(
                                existingConsultations.consultationDateTime
                              ) ? (
                                <Text
                                  className={styles.tooltipText}
                                  value="You can join the meeting 10 minutes before the scheduled time."
                                />
                              ) : null
                            }
                            open={
                              !canJoinMeeting(
                                existingConsultations.consultationDateTime
                              )
                                ? undefined
                                : false
                            }
                          >
                            <span>
                              <Button
                                size="sm"
                                fullWidth={isMobile}
                                variant="outlined"
                                startIcon={<Video size={20} />}
                                disabled={
                                  !canJoinMeeting(
                                    existingConsultations.consultationDateTime
                                  )
                                }
                                onClick={() => {
                                  if (
                                    canJoinMeeting(
                                      existingConsultations.consultationDateTime
                                    )
                                  ) {
                                    window.open(
                                      getMeetLinkUrl(
                                        existingConsultations.meetLink
                                      ),
                                      "_blank"
                                    );
                                  }
                                }}
                              >
                                join meeting
                              </Button>
                            </span>
                          </Tooltip>
                        )}
                        <Button
                          variant="contained"
                          size="sm"
                          fullWidth={isMobile}
                          onClick={() =>
                            handleStartChat(existingConsultations._id)
                          }
                          startIcon={<MessageSquareText size={20} />}
                        >
                          Continue Chat
                        </Button>
                      </div>
                    ) : (
                      <>
                        {existingConsultations?.status !== "pending" && (
                          <Button
                            variant="outlined"
                            size="sm"
                            fullWidth={isMobile}
                            onClick={() =>
                              handleStartChat(existingConsultations._id)
                            }
                            startIcon={<MessageSquareText />}
                          >
                            View Chat History
                          </Button>
                        )}
                      </>
                    )}
                  </div>
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
