"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SignInForm } from "../SignInForm/SignInForm";
import { UserProfileForm } from "../UserProfileForm/UserProfileForm";
import { HealthAnalysisDisplay } from "../HealthAnalysisDisplay/HealthAnalysisDisplay";

const SalAnalyzeForm = () => {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const userProfileQuery = useQuery(api.userProfiles.getUserProfile);
  const labResults = useQuery(api.labResults.getLabResults);

  // Get the most recent lab result
  const latestLabResult =
    labResults && labResults.length > 0 ? labResults[0] : null;

  // Ensure userProfile is null if undefined for the prop
  const userProfileForDisplay =
    userProfileQuery === undefined ? null : userProfileQuery;

  if (loggedInUser === undefined || userProfileQuery === undefined) {
    // Also wait for userProfileQuery
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <Unauthenticated>
        <div className="text-center py-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 mb-4">
            Welcome to Health Analyzer AI
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8">
            Sign in to manage your health profile and analyze lab results.
          </p>
          <div className="max-w-sm mx-auto">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        {loggedInUser && (
          <p className="text-center text-xl text-slate-700 mb-2">
            Welcome back,{" "}
            <span className="font-semibold">
              {loggedInUser?.name || loggedInUser?.email}!
            </span>
          </p>
        )}
        <UserProfileForm />

        <HealthAnalysisDisplay
          userProfile={userProfileForDisplay}
          latestLabResult={latestLabResult}
        />
      </Authenticated>
    </div>
  );
};

export default SalAnalyzeForm;
