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
import type * as auth from "../auth.js";
import type * as checkEmailExists from "../checkEmailExists.js";
import type * as fileStorage from "../fileStorage.js";
import type * as healthAnalysis from "../healthAnalysis.js";
import type * as http from "../http.js";
import type * as ocr from "../ocr.js";
import type * as openai from "../openai.js";
import type * as patientProfiles from "../patientProfiles.js";
import type * as profileImage from "../profileImage.js";
import type * as router from "../router.js";
import type * as userProfiles from "../userProfiles.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  checkEmailExists: typeof checkEmailExists;
  fileStorage: typeof fileStorage;
  healthAnalysis: typeof healthAnalysis;
  http: typeof http;
  ocr: typeof ocr;
  openai: typeof openai;
  patientProfiles: typeof patientProfiles;
  profileImage: typeof profileImage;
  router: typeof router;
  userProfiles: typeof userProfiles;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
