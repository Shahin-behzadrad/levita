import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import HeroActions from "../HeroActions/HeroActions";

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
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-gray-500">{content}</p>
    </CardContent>
  </Card>
);

const HeroSection = () => (
  <section className="w-full min-h-screen py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-teal-100 flex justify-center items-center">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            AI-Powered Healthcare Assistant
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
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
  <section className="w-full py-12 md:py-24 lg:py-32">
    <div className="container px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
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
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
};

export default MainPage;
