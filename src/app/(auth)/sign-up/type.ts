export interface SignUpFormData {
  role: "doctor" | "patient";
  fullName: string;
  phoneNumber: string;
  age: number;
  sex: string;
  // Doctor-specific fields
  specialization?: string;
  licenseNumber?: string;
  languages?: string;
  bio?: string;
}
