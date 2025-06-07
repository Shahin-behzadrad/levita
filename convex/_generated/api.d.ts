/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as api_ai_ocr from "../api/ai/ocr.js";
import type * as api_ai_openai from "../api/ai/openai.js";
import type * as api_auth_checkEmailExists from "../api/auth/checkEmailExists.js";
import type * as api_health_healthAnalysis from "../api/health/healthAnalysis.js";
import type * as api_profiles_patientProfiles from "../api/profiles/patientProfiles.js";
import type * as api_profiles_timeSlots from "../api/profiles/timeSlots.js";
import type * as api_profiles_userProfiles from "../api/profiles/userProfiles.js";
import type * as api_storage_fileStorage from "../api/storage/fileStorage.js";
import type * as api_storage_profileImage from "../api/storage/profileImage.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as router from "../router.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "api/ai/ocr": typeof api_ai_ocr;
  "api/ai/openai": typeof api_ai_openai;
  "api/auth/checkEmailExists": typeof api_auth_checkEmailExists;
  "api/health/healthAnalysis": typeof api_health_healthAnalysis;
  "api/profiles/patientProfiles": typeof api_profiles_patientProfiles;
  "api/profiles/timeSlots": typeof api_profiles_timeSlots;
  "api/profiles/userProfiles": typeof api_profiles_userProfiles;
  "api/storage/fileStorage": typeof api_storage_fileStorage;
  "api/storage/profileImage": typeof api_storage_profileImage;
  auth: typeof auth;
  http: typeof http;
  router: typeof router;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
