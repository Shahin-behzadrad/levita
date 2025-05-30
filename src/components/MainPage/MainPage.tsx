import { Card, CardContent, CardHeader } from "../Shared/Card";
import HeroActions from "../HeroActions/HeroActions";
import styles from "./MainPage.module.scss";
import Text from "../Shared/Text";

const FeatureCard = ({
  title,
  description,
  content,
}: {
  title: string;
  description: string;
  content: string;
}) => (
  <Card>
    <CardHeader title={title} subheader={description} />
    <CardContent>
      <Text value={content} color="gray" />
    </CardContent>
  </Card>
);

const HeroSection = () => (
  <section className={styles.hero}>
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <div>
          <h1 className={styles.heroTitle}>AI-Powered Healthcare Assistant</h1>
          <p className={styles.heroDescription}>
            Get personalized health insights based on your symptoms and lab
            results using advanced AI technology.
          </p>
        </div>
        <HeroActions />
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className={styles.features}>
    <div className={styles.featuresContainer}>
      <div className={styles.featuresGrid}>
        <FeatureCard
          title="Symptom Analysis"
          description="Describe your symptoms and get AI-powered insights"
          content="Our advanced AI analyzes your symptoms and provides potential causes and recommendations."
        />
        <FeatureCard
          title="Lab Result Interpretation"
          description="Upload your lab results for AI analysis"
          content="Get easy-to-understand explanations of your lab test results and what they mean for your health."
        />
        <FeatureCard
          title="Personalized Health Insights"
          description="Receive tailored health recommendations"
          content="Based on your profile, symptoms, and lab results, get personalized health recommendations."
        />
      </div>
    </div>
  </section>
);

const MainPage = () => {
  return (
    <main className={styles.main}>
      <HeroSection />
      <FeaturesSection />
    </main>
  );
};

export default MainPage;
