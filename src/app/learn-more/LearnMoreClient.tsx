"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function LearnMoreClient() {
  return (
    <div className="container max-w-4xl mx-auto py-8 mt-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            About HealthAI Analysis
          </CardTitle>
          <CardDescription>
            Understanding our AI-powered health analysis service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-white mb-4">
              Our AI-powered health analysis system uses advanced machine
              learning algorithms to analyze your symptoms and health data.
              Here's how the process works:
            </p>
            <ol className="list-decimal pl-6 text-gray-600 dark:text-white space-y-2">
              <li>You provide your symptoms and health information</li>
              <li>Optionally upload lab results or medical documents</li>
              <li>
                Our AI analyzes the data using a comprehensive medical knowledge
                base
              </li>
              <li>You receive personalized insights and recommendations</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
            <p className="text-gray-600 dark:text-white mb-4">
              HealthAI uses state-of-the-art natural language processing and
              machine learning technologies to understand and analyze health
              information. Our system is trained on:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-white space-y-2">
              <li>Medical literature and research papers</li>
              <li>Clinical guidelines and best practices</li>
              <li>Patterns from anonymized health data</li>
              <li>Expert medical knowledge</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Privacy and Security
            </h2>
            <p className="text-gray-600 dark:text-white mb-4">
              We take your privacy and data security seriously. All information
              is:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-white space-y-2">
              <li>Encrypted during transmission and storage</li>
              <li>Processed in compliance with healthcare regulations</li>
              <li>Never shared with third parties without your consent</li>
              <li>Protected by strict access controls</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Important Disclaimer
            </h2>
            <p className="text-gray-600 dark:text-white mb-4">
              While our AI analysis can provide valuable insights, it is not a
              substitute for professional medical advice. Always consult with
              healthcare professionals for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-white space-y-2">
              <li>Medical diagnosis and treatment</li>
              <li>Emergency situations</li>
              <li>Serious health concerns</li>
              <li>Prescription medications</li>
            </ul>
          </section>

          <div className="pt-6 space-x-4">
            <Link href="/health-analysis">
              <Button className="dark:bg-teal-500 dark:hover:bg-teal-600">
                Try Health Analysis
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="dark:border-gray-700 dark:text-white"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
