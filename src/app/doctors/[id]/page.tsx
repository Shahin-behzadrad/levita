import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Calendar, Clock, Award } from "lucide-react";
import Image from "next/image";
import doctorImage from "../../../../public/DUMMY_DR_PROFILE.webp";

// Dummy data for doctors
const doctorData = {
  "dr-smith": {
    id: 1,
    name: "Dr. John Smith",
    specialty: "Cardiologist",
    biography:
      "Dr. John Smith is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She completed her medical degree at Harvard Medical School and her residency at Massachusetts General Hospital. Dr. Smith specializes in preventive cardiology and has published numerous research papers on heart disease prevention.",
    address: "123 Medical Center Drive, Suite 400, Boston, MA 02114",
    phone: "(555) 123-4567",
    email: "dr.smith@healthcare.com",
    education: [
      "Harvard Medical School - MD",
      "Massachusetts General Hospital - Residency",
      "Johns Hopkins Hospital - Fellowship in Cardiology",
    ],
    certifications: [
      "Board Certified in Cardiovascular Disease",
      "American Board of Internal Medicine",
      "Advanced Cardiac Life Support (ACLS)",
    ],
    availability: {
      days: "Monday - Friday",
      hours: "9:00 AM - 5:00 PM",
    },
  },
};

export default function DoctorProfile() {
  return (
    <div className="container mx-auto py-28 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Doctor's Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-48 h-48 rounded-full overflow-hidden">
                <Image
                  src={doctorImage}
                  alt={doctorData["dr-smith"].name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  {doctorData["dr-smith"].name}
                </h1>
                <p className="text-lg text-gray-600">
                  {doctorData["dr-smith"].specialty}
                </p>
              </div>
              <div className="w-full space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm">
                    {doctorData["dr-smith"].address}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span className="text-sm">
                    {doctorData["dr-smith"].phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span className="text-sm">
                    {doctorData["dr-smith"].email}
                  </span>
                </div>
              </div>
              <Button className="w-full">Schedule Appointment</Button>
            </div>
          </CardContent>
        </Card>

        {/* Doctor's Information */}
        <div className="md:col-span-2 space-y-6">
          {/* Biography */}
          <Card>
            <CardHeader>
              <CardTitle>Biography</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {doctorData["dr-smith"].biography}
              </p>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {doctorData["dr-smith"].education.map((edu, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">{edu}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {doctorData["dr-smith"].certifications.map((cert, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">{cert}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    {doctorData["dr-smith"].availability.days}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">
                    {doctorData["dr-smith"].availability.hours}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
