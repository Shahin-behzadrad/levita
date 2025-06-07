"use client";

import { use } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Text from "@/components/Shared/Text";
import Button from "@/components/Shared/Button";
import { useRouter } from "next/navigation";
import styles from "./ConsultationDetails.module.scss";
import { Clock, User, FileText, Microscope, ListChecks } from "lucide-react";

interface LaboratoryFindings {
  [category: string]: string[];
}

export default function ConsultationDetails({
  consultationId,
}: {
  consultationId: Id<"consultationRequests">;
}) {
  const router = useRouter();

  const consultation = useQuery(
    api.api.consultation.getConsultationDetails.getConsultationDetails,
    {
      consultationId,
    }
  );

  if (!consultation) {
    return (
      <div className={styles.container}>
        <Text value="Consultation not found" variant="h1" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          title="Consultation Request"
          titleFontSize={28}
          titleColor="primary"
          subheader={`Requested on ${new Date(
            consultation.createdAt
          ).toLocaleDateString()}`}
          titleStartAdornment={
            <Clock size={20} className={styles.headerIcon} />
          }
          action={
            consultation.status === "pending" ? (
              <div className={styles.statusBadge}>
                <Text value="Pending" variant="span" />
              </div>
            ) : undefined
          }
          className={styles.header}
        />

        <CardContent className={styles.content}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <User size={20} />
              <Text value="Patient Overview" variant="h6" fontWeight="medium" />
            </div>
            <div className={styles.sectionContent}>
              <Text
                value={consultation.doctorReportPreview?.patientOverview}
                variant="p"
                fontSize="sm"
              />
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FileText size={20} />
              <Text
                value="Clinical Considerations"
                variant="h6"
                fontWeight="medium"
              />
            </div>
            <div className={styles.sectionContent}>
              <Text
                value={consultation.doctorReportPreview?.clinicalConsiderations}
                variant="p"
                fontSize="sm"
              />
            </div>
          </div>

          {consultation.doctorReportPreview?.laboratoryFindings && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Microscope size={20} />
                <Text
                  value="Laboratory Findings"
                  variant="h6"
                  fontWeight="medium"
                />
              </div>
              <div className={styles.labFindings}>
                {Object.entries(
                  consultation.doctorReportPreview
                    .laboratoryFindings as LaboratoryFindings
                ).map(([category, findings]) => (
                  <div key={category} className={styles.labCategory}>
                    <Text
                      value={category.replace(/_/g, " ")}
                      fontSize="lg"
                      fontWeight="medium"
                    />
                    <ul className={styles.findingsList}>
                      {findings.map((finding: string, index: number) => (
                        <li key={index}>
                          <Text value={finding} variant="p" fontSize="sm" />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <ListChecks size={20} />
              <Text value="Recommendations" variant="h6" fontWeight="medium" />
            </div>
            <ul className={styles.recommendationsList}>
              {consultation.doctorReportPreview?.recommendations.map(
                (rec: string, index: number) => (
                  <li key={index}>
                    <Text value={rec} variant="p" fontSize="sm" />
                  </li>
                )
              )}
            </ul>
          </div>

          {consultation.status === "pending" && (
            <div className={styles.actions}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  // Handle accept consultation
                }}
                className={styles.acceptButton}
              >
                Accept Consultation
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  // Handle reject consultation
                }}
                className={styles.rejectButton}
              >
                Reject Consultation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
