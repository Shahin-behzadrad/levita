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
import type * as api_consultation_acceptConsultation from "../api/consultation/acceptConsultation.js";
import type * as api_consultation_createConsultationRequest from "../api/consultation/createConsultationRequest.js";
import type * as api_consultation_endChat from "../api/consultation/endChat.js";
import type * as api_consultation_getChatMessages from "../api/consultation/getChatMessages.js";
import type * as api_consultation_getConsultationDetails from "../api/consultation/getConsultationDetails.js";
import type * as api_consultation_getDoctorConsultations from "../api/consultation/getDoctorConsultations.js";
import type * as api_consultation_getExistingConsultationRequest from "../api/consultation/getExistingConsultationRequest.js";
import type * as api_consultation_getPendingConsultations from "../api/consultation/getPendingConsultations.js";
import type * as api_consultation_sendMessage from "../api/consultation/sendMessage.js";
import type * as api_consultation_startChat from "../api/consultation/startChat.js";
import type * as api_consultation_uploadFile from "../api/consultation/uploadFile.js";
import type * as api_google_getGoogleToken from "../api/google/getGoogleToken.js";
import type * as api_google_storeGoogleTokens from "../api/google/storeGoogleTokens.js";
import type * as api_health_healthAnalysis from "../api/health/healthAnalysis.js";
import type * as api_profiles_doctorProfile from "../api/profiles/doctorProfile.js";
import type * as api_profiles_patientProfiles from "../api/profiles/patientProfiles.js";
import type * as api_profiles_timeSlots from "../api/profiles/timeSlots.js";
import type * as api_profiles_userProfiles from "../api/profiles/userProfiles.js";
import type * as auth from "../auth.js";
import type * as functions_internal_api_storage_fileStorage from "../functions/internal/api/storage/fileStorage.js";
import type * as functions_internal_api_storage_profileImage from "../functions/internal/api/storage/profileImage.js";
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
  "api/consultation/acceptConsultation": typeof api_consultation_acceptConsultation;
  "api/consultation/createConsultationRequest": typeof api_consultation_createConsultationRequest;
  "api/consultation/endChat": typeof api_consultation_endChat;
  "api/consultation/getChatMessages": typeof api_consultation_getChatMessages;
  "api/consultation/getConsultationDetails": typeof api_consultation_getConsultationDetails;
  "api/consultation/getDoctorConsultations": typeof api_consultation_getDoctorConsultations;
  "api/consultation/getExistingConsultationRequest": typeof api_consultation_getExistingConsultationRequest;
  "api/consultation/getPendingConsultations": typeof api_consultation_getPendingConsultations;
  "api/consultation/sendMessage": typeof api_consultation_sendMessage;
  "api/consultation/startChat": typeof api_consultation_startChat;
  "api/consultation/uploadFile": typeof api_consultation_uploadFile;
  "api/google/getGoogleToken": typeof api_google_getGoogleToken;
  "api/google/storeGoogleTokens": typeof api_google_storeGoogleTokens;
  "api/health/healthAnalysis": typeof api_health_healthAnalysis;
  "api/profiles/doctorProfile": typeof api_profiles_doctorProfile;
  "api/profiles/patientProfiles": typeof api_profiles_patientProfiles;
  "api/profiles/timeSlots": typeof api_profiles_timeSlots;
  "api/profiles/userProfiles": typeof api_profiles_userProfiles;
  auth: typeof auth;
  "functions/internal/api/storage/fileStorage": typeof functions_internal_api_storage_fileStorage;
  "functions/internal/api/storage/profileImage": typeof functions_internal_api_storage_profileImage;
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
