"use client";

import Link from "next/link";

import type React from "react";

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

export default function HealthAnalysis() {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [healthStatus, setHealthStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("symptoms", symptoms);
      formData.append("age", age);
      formData.append("sex", sex);
      formData.append("healthStatus", healthStatus);

      if (file) {
        formData.append("labFile", file);
      }

      // Simulate AI analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        setResult(
          "Based on the symptoms and lab results provided, this could indicate a mild upper respiratory infection. " +
            "Your lab results show normal white blood cell count, which is reassuring. " +
            "Recommended actions: Rest, stay hydrated, and monitor symptoms. If fever persists for more than 3 days or " +
            "breathing difficulties occur, please consult with a healthcare professional immediately."
        );
      }, 3000);

      // In a real implementation, you would send the formData to your API
      // const response = await fetch('/api/analyze', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // setResult(data.analysis);
    } catch (error) {
      console.error("Error analyzing health data:", error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col max-w-screen-md mx-auto">
      <main className="flex-1 container py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Health Analysis</CardTitle>
            <CardDescription>
              Describe your symptoms and optionally upload lab results for AI
              analysis
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAnalyze}>
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

              <div className="space-y-2">
                <Label htmlFor="file-upload">
                  Upload Lab Results (Optional)
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, or PNG (MAX. 10MB)
                      </p>
                    </div>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {file && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
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

        {result && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                AI-generated health insights based on your information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                <h3 className="font-medium text-teal-800 mb-2">
                  Health Assessment
                </h3>
                <p className="text-gray-700">{result}</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 italic">
                  Note: This AI analysis is not a substitute for professional
                  medical advice, diagnosis, or treatment. Always seek the
                  advice of your physician or other qualified health provider
                  with any questions you may have.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Save Results
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
      <footer className="border-t bg-gray-50">
        <div className="container flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">
              © 2025 HealthAI. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
