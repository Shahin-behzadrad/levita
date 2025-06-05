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

  const systemInstructions = `You are a medical assistant AI. Your job is to analyze patient information and lab results and generate a structured JSON report.

Input:
- Patient profile, symptoms, current conditions, and medications.
- OCR text from uploaded lab results (in English or Persian).
- The OCR text includes blood test values, hormone levels, urine test results, and more.

Your response must:
1. Output ONLY JSON. Do NOT wrap it with \`\`\`json or \`\`\` at all.
2. Ensure the JSON is valid and minified if possible.
3. Use the following structure exactly:

{
  "doctorReport": {
    "patientOverview": string,
    "laboratoryFindings": {
      "Complete Blood Count": string[],
      "Biochemistry": string[],
      "Other": string[]
    },
    "clinicalConsiderations": string,
    "differentialDiagnosis": string[],
    "recommendations": string[],
    "conclusion": string
  },
  "patientReport": {
    "summary": string,
    "testResults": string,
    "nextSteps": string,
    "reassurance": string
  },
  "disclaimer": string
}

Example values:
- “laboratoryFindings” entries should be like: "WBC: 6.9 x10^3/μL (Normal)"
- All lists should be proper JSON arrays.
- Use clear English, and summarize Persian OCR content in English.

Important:
- Again, DO NOT use triple backticks like \`\`\`json in your output.
- Just return clean JSON only.

Begin now.`;

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

  const content = completion.choices[0]?.message?.content ?? "";
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("Failed to parse AI response as JSON:", content);
    return null;
  }
}
