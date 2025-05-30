import { Card, CardContent, CardHeader } from "@/components/Shared/Card";
import { Button } from "@/components/Shared/Button/Button";
import { MapPin, Phone, Mail, Calendar, Clock, Award } from "lucide-react";
import Image from "next/image";
import doctorImage from "../../../../public/DUMMY_DR_PROFILE.webp";
import styles from "./page.module.scss";

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
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Doctor's Profile Card */}
        <Card className={styles.profileCard}>
          <CardContent className={styles.profileContent}>
            <div className={styles.profileSection}>
              <div className={styles.imageContainer}>
                <Image
                  src={doctorImage}
                  alt={doctorData["dr-smith"].name}
                  fill
                  className={styles.profileImage}
                />
              </div>
              <div className={styles.profileInfo}>
                <h1 className={styles.profileName}>
                  {doctorData["dr-smith"].name}
                </h1>
                <p className={styles.profileSpecialty}>
                  {doctorData["dr-smith"].specialty}
                </p>
              </div>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <MapPin className={styles.contactIcon} />
                  <span className={styles.contactText}>
                    {doctorData["dr-smith"].address}
                  </span>
                </div>
                <div className={styles.contactItem}>
                  <Phone className={styles.contactIcon} />
                  <span className={styles.contactText}>
                    {doctorData["dr-smith"].phone}
                  </span>
                </div>
                <div className={styles.contactItem}>
                  <Mail className={styles.contactIcon} />
                  <span className={styles.contactText}>
                    {doctorData["dr-smith"].email}
                  </span>
                </div>
              </div>
              <Button className={styles.scheduleButton}>
                Schedule Appointment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Doctor's Information */}
        <div className={styles.infoSection}>
          {/* Biography */}
          <Card>
            <CardHeader title="Biography" />
            <CardContent>
              <p className={styles.biography}>
                {doctorData["dr-smith"].biography}
              </p>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader title="Education" />
            <CardContent>
              <ul className={styles.educationList}>
                {doctorData["dr-smith"].education.map((edu, index) => (
                  <li key={index} className={styles.listItem}>
                    <Award className={styles.listIcon} />
                    <span className={styles.listText}>{edu}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader title="Certifications" />
            <CardContent>
              <ul className={styles.certificationList}>
                {doctorData["dr-smith"].certifications.map((cert, index) => (
                  <li key={index} className={styles.listItem}>
                    <Award className={styles.listIcon} />
                    <span className={styles.listText}>{cert}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader title="Availability" />
            <CardContent>
              <div className={styles.availabilitySection}>
                <div className={styles.availabilityItem}>
                  <Calendar className={styles.availabilityIcon} />
                  <span className={styles.availabilityText}>
                    {doctorData["dr-smith"].availability.days}
                  </span>
                </div>
                <div className={styles.availabilityItem}>
                  <Clock className={styles.availabilityIcon} />
                  <span className={styles.availabilityText}>
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
