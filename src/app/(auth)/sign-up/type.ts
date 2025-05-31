export interface SignUpFormData {
  role: "doctor" | "patient";
  name: string;
  email: string;
  password: string;
  age: number;
  sex: string;
  // Doctor-specific fields
  specialization?: string;
  // Patient-specific fields
  symptoms?: string;
  generalHealthStatus?: string;
  terms: boolean;
}
