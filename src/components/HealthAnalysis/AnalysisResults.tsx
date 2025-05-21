import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AnalysisResultsProps {
  result: string;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>
          AI-generated health insights based on your information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
          <h3 className="font-medium text-teal-800 mb-2">Health Assessment</h3>
          <p className="text-gray-700">{result}</p>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500 italic">
            Note: This AI analysis is not a substitute for professional medical
            advice, diagnosis, or treatment. Always seek the advice of your
            physician or other qualified health provider with any questions you
            may have.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Save Results
        </Button>
      </CardFooter>
    </Card>
  );
}
