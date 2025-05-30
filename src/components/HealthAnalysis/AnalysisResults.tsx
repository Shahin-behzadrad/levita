import {
  Clock,
  Target,
  Info,
  AlertCircle,
  ExternalLink,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { searchYoutubeVideos } from "@/lib/youtube";
import { YoutubeVideo } from "@/types/youtube";
import youtubeLogo from "../../../public/youtube.webp";
import Image from "next/image";
import styles from "./AnalysisResults.module.scss";
import { Card, CardContent, CardHeader } from "../Shared/Card";
import { Button } from "../Shared/Button/Button";
import { Badge } from "../Shared/Badge/Badge";
import { Separator } from "../Shared/Separator/Separator";
import Text from "../Shared/Text";

const AnalysisResults = ({
  result,
  labFileNames,
}: {
  result: any;
  labFileNames?: string[] | null;
}) => {
  const [activityVideos, setActivityVideos] = useState<
    Record<string, YoutubeVideo>
  >({});

  useEffect(() => {
    const fetchVideos = async () => {
      if (!result?.recommendedActivities) return;

      const videos: Record<string, YoutubeVideo> = {};
      const fetchPromises = result.recommendedActivities.map(
        async (activity: { activity: string }) => {
          if (!activityVideos[activity.activity]) {
            const video = await searchYoutubeVideos(`${activity.activity}`);
            if (video) {
              videos[activity.activity] = video;
            }
          }
        }
      );

      await Promise.all(fetchPromises);
      setActivityVideos((prev) => ({ ...prev, ...videos }));
    };

    fetchVideos();
  }, [result?.recommendedActivities]);

  if (Object.keys(result).length === 0) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return styles.badgeRed;
      case "medium":
        return styles.badgeYellow;
      case "low":
        return styles.badgeGreen;
      default:
        return styles.badgeGray;
    }
  };

  const getDataSourceColor = (source: string) => {
    if (source.toLowerCase().includes("lab")) {
      return styles.badgeBlue;
    } else if (source.toLowerCase().includes("symptom")) {
      return styles.badgePurple;
    } else {
      return styles.badgeGray;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return styles.badgeRed;
      case "medium":
        return styles.badgeYellow;
      case "low":
        return styles.badgeBlue;
      default:
        return styles.badgeGray;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Health Suggestions</h1>
        <p>Personalized recommendations based on your health result</p>
      </div>

      {/* Medical Disclaimer */}
      <div className={styles.disclaimer}>
        <AlertCircle />
        <div>
          <strong>Medical Disclaimer:</strong> This information is for
          educational purposes only and should not replace professional medical
          advice. Always consult with a healthcare provider before making any
          medical decisions.
        </div>
      </div>

      {/* Lab Results Section */}
      {labFileNames && labFileNames.length > 0 && (
        <Card className={`${styles.card} ${styles.cardPurple}`}>
          <CardHeader
            title="Analyzed Lab Results"
            subheader="The following lab result files were analyzed"
            className={styles.cardHeader}
          />

          <CardContent className={styles.cardContent}>
            <div>
              {labFileNames.map((fileName, index) => (
                <div key={index}>
                  <FileText />
                  <span>{fileName}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className={styles.grid}>
        {/* Potential Issues */}
        <Card className={`${styles.card} ${styles.cardOrange}`}>
          <CardHeader
            title="Potential Health Issues"
            subheader="Possible conditions based on your symptoms and result"
            className={styles.cardHeader}
          />

          <CardContent className={styles.cardContent}>
            {result?.potentialIssues?.map((issue: any, index: any) => (
              <div key={index} className={styles.issueItem}>
                <Badge
                  variant="outline"
                  className={getDataSourceColor(issue.dataSource)}
                >
                  {issue.dataSource}
                </Badge>
                <div className={styles.issueHeader}>
                  <h4>{issue.issue}</h4>
                  <Badge
                    variant="outline"
                    className={getSeverityColor(issue.severity)}
                  >
                    {issue.severity}
                  </Badge>
                </div>
                <Text
                  value={issue.recommendation}
                  className={styles.issueDescription}
                />
                {index < result?.potentialIssues?.length - 1 && (
                  <Separator className={styles.separator} />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Specialists */}
        <Card className={`${styles.card} ${styles.cardBlue}`}>
          <CardHeader
            title="Recommended Specialists"
            subheader="Healthcare professionals you should consider consulting"
            className={styles.cardHeader}
          />
          <CardContent className={styles.cardContent}>
            {result?.recommendedSpecialists?.map(
              (specialist: any, index: any) => (
                <div key={index} className={styles.specialistItem}>
                  <div className={styles.specialistHeader}>
                    <div className={styles.specialistInfo}>
                      <Text value={specialist.specialty} />
                      <Text value={specialist.reason} />
                    </div>
                    <div className={styles.specialistActions}>
                      <Badge
                        variant="outline"
                        className={getPriorityColor(specialist.priority)}
                      >
                        {specialist.priority} priority
                      </Badge>
                      <Link href={`/doctors/1`}>
                        <Button variant="outlined" size="sm">
                          <ExternalLink />
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                  {index < result?.recommendedSpecialists?.length - 1 && (
                    <Separator className={styles.separator} />
                  )}
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Recommended Activities */}
        <Card className={`${styles.card} ${styles.cardGreen}`}>
          <CardHeader
            title="Recommended Activities"
            subheader="Activities to support your recovery and well-being"
            className={styles.cardHeader}
          />
          <CardContent className={styles.cardContent}>
            {result?.recommendedActivities?.map((activity: any, index: any) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityHeader}>
                  <h4>{activity.activity}</h4>
                  <div className={styles.activityTime}>
                    <Clock />
                    {activity.frequency}
                  </div>
                </div>
                <Text value={activity.benefits} />

                {activityVideos[activity.activity] && (
                  <Link
                    href={`https://www.youtube.com/watch?v=${activityVideos[activity.activity]?.id}`}
                    target="_blank"
                    className={styles.youtubeLink}
                  >
                    <Image
                      src={youtubeLogo}
                      alt="Youtube"
                      width={32}
                      height={32}
                    />
                    {activity.activity}
                  </Link>
                )}

                {index < result?.recommendedActivities?.length - 1 && (
                  <Separator className={styles.separator} />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medication Suggestions */}
        <Card className={`${styles.card} ${styles.cardPurple}`}>
          <CardHeader
            title="Medication Suggestions"
            subheader="Over-the-counter medications that may help with symptoms"
            className={styles.cardHeader}
          />
          <CardContent className={styles.cardContent}>
            {result?.medicationSuggestions?.map(
              (medication: any, index: any) => (
                <div key={index} className={styles.medicationItem}>
                  <div>
                    <Link
                      href={medication.source}
                      target="_blank"
                      className={styles.medicationHeader}
                    >
                      <ExternalLink />
                      <h4>{medication.name}</h4>
                    </Link>
                    <p className={styles.issueDescription}>
                      {medication.purpose}
                    </p>
                  </div>
                  <div className={styles.medicationInfo}>
                    <div className={styles.infoItem}>
                      <Target />
                      <div className={styles.infoContent}>
                        <p>Dosage</p>
                        <p>{medication.dosage}</p>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <Info />
                      <div className={styles.infoContent}>
                        <p>Important</p>
                        <p>{medication.disclaimer}</p>
                      </div>
                    </div>
                  </div>
                  {index < result?.medicationSuggestions?.length - 1 && (
                    <Separator className={styles.separator} />
                  )}
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lifestyle Changes */}
      <Card className={`${styles.card} ${styles.cardTeal}`}>
        <CardHeader
          title="Lifestyle Changes"
          subheader="Long-term changes to support your overall health and recovery"
          className={styles.cardHeader}
        />
        <CardContent className={styles.cardContent}>
          {result?.lifestyleChanges?.map((change: any, index: any) => (
            <div key={index} className={styles.issueItem}>
              <h4>{change.change}</h4>
              <div className={styles.lifestyleGrid}>
                <div>
                  <span>Impact: </span>
                  <span>{change.impact}</span>
                </div>
                <div>
                  <span>How to implement: </span>
                  <span>{change.implementation}</span>
                </div>
              </div>
              {index < result?.lifestyleChanges?.length - 1 && (
                <Separator className={styles.separator} />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer Disclaimer */}
      <div className={styles.footer}>
        <p>
          Generated suggestions • Always consult with healthcare professionals
          for medical advice
        </p>
      </div>
    </div>
  );
};

export default AnalysisResults;
