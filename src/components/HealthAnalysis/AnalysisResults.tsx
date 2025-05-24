import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  UserCheck,
  Activity,
  Pill,
  Heart,
  Clock,
  Target,
  Info,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const AnalysisResults = ({ result }: any) => {
  if (Object.keys(result).length === 0) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Health Suggestions</h1>
        <p className="text-gray-600">
          Personalized recommendations based on your health result
        </p>
      </div>

      {/* Medical Disclaimer */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Medical Disclaimer:</strong> This information is for
          educational purposes only and should not replace professional medical
          advice. Always consult with a healthcare provider before making any
          medical decisions.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Potential Issues */}
        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Potential Health Issues
            </CardTitle>
            <CardDescription>
              Possible conditions based on your symptoms and result
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result?.potentialIssues?.map((issue: any, index: any) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{issue.issue}</h4>
                  <Badge
                    variant="outline"
                    className={getSeverityColor(issue.severity)}
                  >
                    {issue.severity}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{issue.recommendation}</p>
                {index < result?.potentialIssues?.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Specialists */}
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <UserCheck className="h-5 w-5" />
              Recommended Specialists
            </CardTitle>
            <CardDescription>
              Healthcare professionals you should consider consulting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result?.recommendedSpecialists?.map(
              (specialist: any, index: any) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      {specialist.specialty}
                    </h4>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(specialist.priority)}
                    >
                      {specialist.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{specialist.reason}</p>
                  {index < result?.recommendedSpecialists?.length - 1 && (
                    <Separator />
                  )}
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Recommended Activities */}
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Activity className="h-5 w-5" />
              Recommended Activities
            </CardTitle>
            <CardDescription>
              Activities to support your recovery and well-being
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result?.recommendedActivities?.map((activity: any, index: any) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    {activity.activity}
                  </h4>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {activity.frequency}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{activity.benefits}</p>
                {index < result?.recommendedActivities?.length - 1 && (
                  <Separator />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medication Suggestions */}
        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Pill className="h-5 w-5" />
              Medication Suggestions
            </CardTitle>
            <CardDescription>
              Over-the-counter medications that may help with symptoms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result?.medicationSuggestions?.map(
              (medication: any, index: any) => (
                <div key={index} className="space-y-3">
                  <div>
                    <Link
                      href={medication.source}
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-500" />
                      <h4 className="font-medium text-gray-900 hover:text-gray-600">
                        {medication.name}
                      </h4>
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {medication.purpose}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Dosage
                        </p>
                        <p className="text-sm text-gray-600">
                          {medication.dosage}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Important
                        </p>
                        <p className="text-sm text-gray-600">
                          {medication.disclaimer}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < result?.medicationSuggestions?.length - 1 && (
                    <Separator />
                  )}
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lifestyle Changes */}
      <Card className="border-teal-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-teal-800">
            <Heart className="h-5 w-5" />
            Lifestyle Changes
          </CardTitle>
          <CardDescription>
            Long-term changes to support your overall health and recovery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result?.lifestyleChanges?.map((change: any, index: any) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-gray-900">{change.change}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Impact: </span>
                  <span className="text-gray-600">{change.impact}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    How to implement:{" "}
                  </span>
                  <span className="text-gray-600">{change.implementation}</span>
                </div>
              </div>
              {index < result?.lifestyleChanges?.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Footer Disclaimer */}
      <div className="text-center text-sm text-gray-500 pt-4">
        <p>
          Generated suggestions • Always consult with healthcare professionals
          for medical advice
        </p>
      </div>
    </div>
  );
};

export default AnalysisResults;
