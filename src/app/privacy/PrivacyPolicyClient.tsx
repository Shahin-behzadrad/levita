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

export default function PrivacyPolicyClient() {
  return (
    <div className="container max-w-4xl mx-auto py-8 mt-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          <CardDescription>Last updated: March 15, 2024</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Personal information (name, email address, age, sex)</li>
              <li>Health-related information you choose to share</li>
              <li>Lab results and medical documents you upload</li>
              <li>Usage data and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide and improve our AI health analysis services</li>
              <li>Personalize your experience</li>
              <li>Communicate with you about our services</li>
              <li>Ensure the security of our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information. However, no method of
              transmission over the Internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
          </section>

          <div className="pt-6">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
