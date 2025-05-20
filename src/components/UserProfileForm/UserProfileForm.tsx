import React, { useState, useEffect, FormEvent } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { FileUpload } from "../FileUpload/FileUpload";

export function UserProfileForm() {
  const userProfile = useQuery(api.userProfiles.getUserProfile);
  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);

  const [age, setAge] = useState<number | undefined>(undefined);
  const [sex, setSex] = useState<string | undefined>(undefined);
  const [symptoms, setSymptoms] = useState<string>(""); // Comma-separated
  const [generalHealthStatus, setGeneralHealthStatus] = useState<
    string | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setAge(userProfile.age);
      setSex(userProfile.sex);
      setSymptoms(userProfile.symptoms?.join(", ") || "");
      setGeneralHealthStatus(userProfile.generalHealthStatus);
    }
  }, [userProfile]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const symptomsArray = symptoms
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      await updateUserProfile({
        age: age ? Number(age) : undefined,
        sex,
        symptoms: symptomsArray.length > 0 ? symptomsArray : undefined,
        generalHealthStatus,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  if (userProfile === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        Your Health Profile
      </h2>

      <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-gray-700"
        >
          Age
        </label>
        <input
          type="number"
          id="age"
          value={age || ""}
          onChange={(e) =>
            setAge(e.target.value ? parseInt(e.target.value) : undefined)
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="sex"
          className="block text-sm font-medium text-gray-700"
        >
          Sex
        </label>
        <select
          id="sex"
          value={sex || ""}
          onChange={(e) => setSex(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="symptoms"
          className="block text-sm font-medium text-gray-700"
        >
          Symptoms (comma-separated)
        </label>
        <input
          type="text"
          id="symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., stress, can't sleep, headache"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="generalHealthStatus"
          className="block text-sm font-medium text-gray-700"
        >
          General Health Status
        </label>
        <select
          id="generalHealthStatus"
          value={generalHealthStatus || ""}
          onChange={(e) => setGeneralHealthStatus(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Status</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>

      <FileUpload />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
