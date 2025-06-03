"use client";

import { Card, CardContent, CardHeader } from "../Shared/Card";
import HeroActions from "../HeroActions/HeroActions";
import styles from "./MainPage.module.scss";
import Text from "../Shared/Text";
import { useLanguage } from "@/i18n/LanguageContext";

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

const HeroSection = () => {
  const { messages } = useLanguage();
  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div>
            <h1 className={styles.heroTitle}>{messages.hero.title}</h1>
            <p className={styles.heroDescription}>
              {messages.hero.description}
            </p>
          </div>
          <HeroActions />
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const { messages } = useLanguage();
  return (
    <section className={styles.features}>
      <div className={styles.featuresContainer}>
        <div className={styles.featuresGrid}>
          <FeatureCard
            title={messages.features.aiAnalysis}
            description={messages.features.personalizedInsights}
            content={messages.features.description}
          />
          <FeatureCard
            title={messages.features.labResults}
            description={messages.features.personalizedInsights}
            content={messages.features.description}
          />
          <FeatureCard
            title={messages.features.healthTracking}
            description={messages.features.personalizedInsights}
            content={messages.features.description}
          />
        </div>
      </div>
    </section>
  );
};

const MainPage = () => {
  return (
    <main className={styles.main}>
      <HeroSection />
      <FeaturesSection />
    </main>
  );
};

export default MainPage;
