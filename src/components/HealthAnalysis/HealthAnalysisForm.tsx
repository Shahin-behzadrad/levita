import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleX, Loader2 } from "lucide-react";
import { FileUploadSection } from "./FileUploadSection";
import Image from "next/image";

export interface userProfileData {
  age?: string | number;
  sex?: string;
  symptoms?: string[];
  generalHealthStatus?: string;
}
interface HealthAnalysisFormProps {
  onSubmit: (formData: userProfileData) => Promise<void>;
  onFileUploaded: (file: File | null) => void;
  isAnalyzing: boolean;
  userProfile?: userProfileData | null;
}

export function HealthAnalysisForm({
  onSubmit,
  isAnalyzing,
  userProfile,
  onFileUploaded,
}: HealthAnalysisFormProps) {
  const { register, handleSubmit, setValue, watch } = useForm<userProfileData>({
    defaultValues: {
      age: "",
      sex: "",
      symptoms: [""],
      generalHealthStatus: "",
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setValue("age", userProfile?.age?.toString() || "");
      setValue("sex", userProfile?.sex || "");
      setValue("symptoms", userProfile?.symptoms || []);
      setValue("generalHealthStatus", userProfile?.generalHealthStatus || "");
    }
  }, [userProfile, setValue]);

  const handleFileChange = (file: File | null) => {
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(file);
      onFileUploaded(file);
    } else {
      setFilePreview(null);
      onFileUploaded(null);
    }
  };

  const onSubmitForm = async (data: userProfileData) => {
    await onSubmit(data);
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
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symptoms">
              Describe your symptoms or health concerns
            </Label>
            <Textarea
              id="symptoms"
              placeholder="E.g., I've had a headache for 3 days, slight fever, and a sore throat..."
              className="min-h-32"
              {...register("symptoms", { required: true })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <input
                type="number"
                id="age"
                min="0"
                max="120"
                step="1"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your age"
                {...register("age", {
                  required: true,
                  min: 0,
                  max: 120,
                  valueAsNumber: true,
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select
                onValueChange={(value) => setValue("sex", value)}
                value={watch("sex")}
                required
              >
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
              <Label htmlFor="generalHealthStatus">Health Status</Label>
              <Select
                onValueChange={(value) =>
                  setValue("generalHealthStatus", value)
                }
                value={watch("generalHealthStatus")}
                required
              >
                <SelectTrigger id="generalHealthStatus">
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

          {filePreview ? (
            <div className="w-[120px] h-[120px] relative rounded-md border shadow-md">
              <CircleX
                color="red"
                className="bg-white w-7 h-7 absolute top-[-10px] right-[-10px] z-10 rounded-full shadow-md cursor-pointer hover:opacity-80"
                onClick={() => setFilePreview(null)}
              />
              <Image
                src={filePreview}
                alt="Preview"
                className="object-cover"
                fill
                sizes="50px"
              />
            </div>
          ) : (
            <FileUploadSection onFileChange={handleFileChange} />
          )}
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
