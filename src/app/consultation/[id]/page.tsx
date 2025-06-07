"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import Text from "@/components/Shared/Text";
import Button from "@/components/Shared/Button";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { Id } from "../../../../convex/_generated/dataModel";

export default function ConsultationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const acceptConsultation = useMutation(
    api.api.consultation.acceptConsultation.acceptConsultation
  );

  const consultationDetails = useQuery(
    api.api.consultation.getConsultationDetails.getConsultationDetails,
    {
      consultationId: params.id as Id<"consultationRequests">,
    }
  );

  if (!consultationDetails) {
    return (
      <div className={styles.container}>
        <Text value="Loading..." variant="p" fontSize="lg" />
      </div>
    );
  }

  const handleAccept = async () => {
    // try {
    //   await acceptConsultation({
    //     requestId: consultationDetails._id,
    //     doctorId: "YOUR_DOCTOR_ID", // You'll need to get this from your auth context
    //   });
    //   router.push("/dashboard"); // Or wherever you want to redirect after accepting
    // } catch (error) {
    //   console.error("Error accepting consultation:", error);
    // }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          title="Consultation Request"
          subheader={`Requested on ${new Date(
            consultationDetails.createdAt
          ).toLocaleDateString()}`}
        />
        <CardContent>
          <div className={styles.section}>
            <Text
              value="Patient Overview"
              variant="h6"
              fontSize="sm"
              fontWeight="medium"
            />
            <Text
              value={consultationDetails.doctorReportPreview?.patientOverview}
              variant="p"
              fontSize="sm"
              color="gray"
            />
          </div>

          <div className={styles.section}>
            <Text
              value="Clinical Considerations"
              variant="h6"
              fontSize="sm"
              fontWeight="medium"
            />
            <Text
              value={
                consultationDetails.doctorReportPreview?.clinicalConsiderations
              }
              variant="p"
              fontSize="sm"
              color="gray"
            />
          </div>

          <div className={styles.section}>
            <Text
              value="Laboratory Findings"
              variant="h6"
              fontSize="sm"
              fontWeight="medium"
            />
            {consultationDetails.doctorReportPreview?.laboratoryFindings && (
              <div className={styles.labFindings}>
                {Object.entries(
                  consultationDetails.doctorReportPreview.laboratoryFindings
                ).map(([category, findings]) => (
                  <div key={category} className={styles.labCategory}>
                    <Text
                      value={category.replace(/_/g, " ")}
                      variant="span"
                      fontSize="sm"
                      fontWeight="medium"
                    />
                    <ul className={styles.findingsList}>
                      {findings.map((finding, index) => (
                        <li key={index}>
                          <Text value={finding} variant="span" fontSize="sm" />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.section}>
            <Text
              value="Recommendations"
              variant="h6"
              fontSize="sm"
              fontWeight="medium"
            />
            <ul className={styles.recommendationsList}>
              {consultationDetails.doctorReportPreview?.recommendations.map(
                (rec, index) => (
                  <li key={index}>
                    <Text value={rec} variant="span" fontSize="sm" />
                  </li>
                )
              )}
            </ul>
          </div>

          {consultationDetails.status === "pending" && (
            <div className={styles.actions}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAccept}
                className={styles.acceptButton}
              >
                Accept Consultation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
