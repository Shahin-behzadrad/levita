import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { FileUploadSection } from "./FileUploadSection";

interface HealthAnalysisFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isAnalyzing: boolean;
}

export function HealthAnalysisForm({
  onSubmit,
  isAnalyzing,
}: HealthAnalysisFormProps) {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [healthStatus, setHealthStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("symptoms", symptoms);
    formData.append("age", age);
    formData.append("sex", sex);
    formData.append("healthStatus", healthStatus);

    if (file) {
      formData.append("labFile", file);
    }

    await onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Health Analysis</CardTitle>
        <CardDescription>
          Describe your symptoms and optionally upload lab results for AI
          analysis
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symptoms">
              Describe your symptoms or health concerns
            </Label>
            <Textarea
              id="symptoms"
              placeholder="E.g., I've had a headache for 3 days, slight fever, and a sore throat..."
              className="min-h-32"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Select value={age} onValueChange={setAge} required>
                <SelectTrigger id="age">
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-17">0-17</SelectItem>
                  <SelectItem value="18-29">18-29</SelectItem>
                  <SelectItem value="30-39">30-39</SelectItem>
                  <SelectItem value="40-49">40-49</SelectItem>
                  <SelectItem value="50-59">50-59</SelectItem>
                  <SelectItem value="60-69">60-69</SelectItem>
                  <SelectItem value="70+">70+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select value={sex} onValueChange={setSex} required>
                <SelectTrigger id="sex">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="health-status">Health Status</Label>
              <Select
                value={healthStatus}
                onValueChange={setHealthStatus}
                required
              >
                <SelectTrigger id="health-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <FileUploadSection
            onFileChange={handleFileChange}
            selectedFile={file}
          />
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Health Data"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
