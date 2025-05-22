import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import HeroActions from "../HeroActions/HeroActions";

const MainPage = () => {
  return (
    <main className="flex-1">
      <section className="w-full min-h-screen py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-teal-100 dark:from-gray-900 dark:to-teal-800 flex justify-center items-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                AI-Powered Healthcare Assistant
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 dark:text-white md:text-xl">
                Get personalized health insights based on your symptoms and lab
                results using advanced AI technology.
              </p>
            </div>
            <HeroActions />
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <CardTitle>Symptom Analysis</CardTitle>
                <CardDescription>
                  Describe your symptoms and get AI-powered insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-white">
                  Our advanced AI analyzes your symptoms and provides potential
                  causes and recommendations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lab Result Interpretation</CardTitle>
                <CardDescription>
                  Upload your lab results for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-white">
                  Get easy-to-understand explanations of your lab test results
                  and what they mean for your health.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Personalized Health Insights</CardTitle>
                <CardDescription>
                  Receive tailored health recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-white">
                  Based on your profile, symptoms, and lab results, get
                  personalized health recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainPage;
