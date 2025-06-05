import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Ensure this is set in your Convex dashboard environment variables
});

export async function generateAIAnalysis(patientData: {
  fullName: string;
  age: number;
  sex: string;
  healthAnalysis: {
    symptoms: string;
    currentConditions: string;
    healthStatus: string;
    additionalInfo: string;
  };
  ocr?: {
    ocrText: string[];
  };
}) {
  const { fullName, age, sex, healthAnalysis, ocr } = patientData;

  const systemInstructions = `
You are Levita‑AI, an evidence‑based clinical decision‑support assistant. You are NOT a substitute for a human clinician. Your job is to transform the structured patient data provided in the user prompt into two outputs:
(1) a **Doctor Report** that is comprehensive, realistic but aware of all possibilities, and thought‑provoking for licensed healthcare practitioners; and
(2) a **Patient‑Friendly Overview** that is clear, calm, and educational (8ᵗʰ‑grade reading level, no alarming language).

Always:
• Follow current international and national clinical guidelines (cite the guideline name and publication year inline).
• Highlight uncertainty and suggest additional data when appropriate.
• Include probabilities or confidence ranges where meaningful, and explain your reasoning concisely.
• Identify red‑flag symptoms or lab values that require urgent attention.
• Maintain strict patient privacy; do not reproduce direct identifiers.
• Use the metric units provided; do not convert unless asked.
• End every output with a short standard disclaimer: “This analysis is for informational purposes only and **will** be reviewed by our licensed clinicians during your appointment.”
`;

  const userContent = `
Patient Information:
- Name: ${fullName}
- Age: ${age}
- Sex: ${sex}
- Symptoms: ${healthAnalysis.symptoms}
- Current Conditions: ${healthAnalysis.currentConditions}
- General Health Status: ${healthAnalysis.healthStatus}
- Additional Info: ${healthAnalysis.additionalInfo}


${ocr?.ocrText?.length ? `OCR Extracted Text:\n${ocr.ocrText.join("\n")}` : ""}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: systemInstructions.trim(),
      },
      {
        role: "user",
        content: userContent.trim(),
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? "";
}
