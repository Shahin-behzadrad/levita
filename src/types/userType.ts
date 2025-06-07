import { Id } from "../../convex/_generated/dataModel";

export type UserType = {
  _id: Id<"doctorProfiles"> | Id<"patientProfiles">;
  fullName?: string;
  profileImage?: string;
  role?: string;
  age?: number;
  sex?: string;
  phoneNumber?: string;
  languages?: string[];
  specialization?: string;
  licenseNumber?: string;
  bio?: string;
};
