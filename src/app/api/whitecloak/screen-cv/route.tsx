// TODO (Vince) : For Checking

import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  const { interviewID, userEmail, preScreeningAnswers, cvSecretPrompt } = await request.json();
  const { db } = await connectMongoDB();
  const interviewData = await db.collection("interviews").findOne({
    interviewID,
    email: userEmail,
  });

  if (!interviewData) {
    return NextResponse.json({
      error: "CV Screening Failed",
      message: "No application found for the selected job.",
    });
  }

  const cvData = await db.collection("applicant-cv").findOne({
    email: userEmail,
  });

  if (!cvData) {
    return NextResponse.json({
      error: "CV Screening Failed",
      message: "You have not uploaded a CV for this application.",
    });
  }

  // Use career-specific prompt if provided, otherwise use global prompt
  let cvScreeningPromptText = cvSecretPrompt || "";
  
  if (!cvScreeningPromptText) {
    const cvScreeningPromptData = await db.collection("global-settings").findOne(
      {
        name: "global-settings",
      },
      {
        projection: {
          cv_screening_prompt: 1,
        },
      }
    );
    cvScreeningPromptText = cvScreeningPromptData?.cv_screening_prompt?.prompt || "";
  }

  let parsedCV = "";

  cvData.digitalCV.forEach((section) => {
    parsedCV += `${section.name}\n${section.content}\n`;
  });

  // Format pre-screening answers if provided
  let preScreeningSection = "";
  if (preScreeningAnswers) {
    preScreeningSection = "\n\nPre-Screening Questions & Answers:\n";
    
    // Get career data to map question IDs to actual questions
    const careerData = await db.collection("careers").findOne({
      _id: interviewData.careerID,
    });
    
    if (careerData?.preScreeningQuestions) {
      Object.entries(preScreeningAnswers).forEach(([key, answer]) => {
        // Extract question ID from key (format: "question_<uuid>")
        const questionId = key.replace("question_", "");
        const question = careerData.preScreeningQuestions.find(
          (q: any) => q.id === questionId
        );
        
        if (question) {
          let formattedAnswer = answer;
          
          // Format answer based on question type
          if (question.type === "checkbox" && Array.isArray(answer)) {
            formattedAnswer = answer.join(", ");
          } else if (question.type === "range" && typeof answer === "object" && answer !== null) {
            formattedAnswer = `${(answer as any).min} - ${(answer as any).max}`;
          }
          
          preScreeningSection += `Q: ${question.question}\nA: ${formattedAnswer}\n\n`;
        }
      });
    }
  }

  const screeningPrompt = `
    You are a helpful AI assistant.
    You are given a candidate's CV and a job description.
    You need to screen the candidate's CV and determine if they are a good fit for the job.

    Job Details:
      Job Title:
      ${interviewData.jobTitle}
      Job Description:
      ${interviewData.description}

    Applicant CV Information:
      Applicant Name: ${interviewData.name}

    Applicant CV:
      ${parsedCV}
    ${preScreeningSection}
    Processing Steps:
      ${cvScreeningPromptText}

    - Format your response as JSON:
      {
        "result": <Result (No Fit / Bad Fit / Good Fit / Strong Fit / Ineligible CV / Insufficient Data)>,
        "reason": <Reason>,
        "confidence": <AI Assessment Confidence (0-100)>,
        "jobFitScore": <Overall Score (0-100)>
      }

    Processing Instructions:
      - Return only the code JSON, nothing else.
      - Carefully analyze the applicant's CV and job description.
      - Be as accurate as possible.
      - Give a detailed reason for the result — be clear, concise, and specific.
      - Set result to "Ineligible CV" if the applicant's CV is not in the correct format.
      - Set result to "Insufficient Data" if the applicant's CV is missing important information.
      - Do not include any other text or comments.
      - DO NOT include \`\`\`json or \`\`\` around the response.
  `;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const completion = await openai.responses.create({
    model: "o4-mini",
    reasoning: { effort: "high" },
    input: [
      {
        role: "user",
        content: screeningPrompt,
      },
    ],
  });

  let result: any = completion.output_text;

  try {
    result = result.replace("```json", "").replace("```", "");
    result = JSON.parse(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "[Error] Invalid JSON",
    });
  }

  let screeningData: any = {
    cvStatus: result.result,
    stateClass: "state-accepted",
    cvSettingResult: null,
    cvScreeningReason: result.reason,
    currentStep: "CV Screening",
    confidence: result.confidence,
    jobFitScore: result.jobFitScore,
    updatedAt: Date.now(),
  };
  const newDate = new Date();

  screeningData.statusDate = {
    "CV Screening": newDate,
  };

  let interviewTransaction: any = null;

  const forReviewResult = ["Maybe Fit", "Insufficient Data"];
  const forDropResult = ["No Fit", "Bad Fit"];
  const forPromotionResult = ["Good Fit", "Strong Fit"];

  if (forReviewResult.includes(result.result)) {
    screeningData.currentStep = "CV Screening";
    screeningData.status = "For CV Screening";
  }

  if (forDropResult.includes(result.result)) {
    screeningData.applicationStatus = "Dropped";
    interviewTransaction = {
      interviewUID: interviewData._id.toString(),
      fromStage: "CV Screening",
      action: "Dropped",
      updatedBy: {
        name: "Jia",
      },
    };
    screeningData.applicationMetadata = {
      updatedAt: Date.now(),
      updatedBy: {
        name: "Jia",
      },
      action: "Dropped",
    };
  }

  if (forPromotionResult.includes(result.result)) {
    screeningData.currentStep = "CV Screening";
    screeningData.status = "For AI Interview";
    screeningData.statusDate = {
      ...screeningData.statusDate,
      "AI Interview": newDate,
    };
    interviewTransaction = {
      interviewUID: interviewData._id.toString(),
      fromStage: "CV Screening",
      toStage: "Pending AI Interview",
      action: "Auto-Promoted",
      updatedBy: {
        name: "Jia",
      },
    };
    screeningData.applicationMetadata = {
      updatedAt: Date.now(),
      updatedBy: {
        name: "Jia",
      },
      action: "Endorsed",
    };
  }

  if (interviewData.screeningSetting) {
    if (interviewData.screeningSetting === "Only Strong Fit") {
      if (result.result == forPromotionResult[0]) {
        screeningData.status = "For CV Screening";
      }
    }
  }

  if (result.result === "No Fit" || result.result === "Bad Fit") {
    screeningData.stateClass = "state-rejected";
    screeningData.cvSettingResult = "Failed";
  }

  // manage state class
  if (result.result === "Good Fit") {
    screeningData.stateClass = "state-good";
    screeningData.cvSettingResult = "Passed";
  }

  if (result.result === "Strong Fit") {
    screeningData.stateClass = "state-accepted";
    screeningData.cvSettingResult = "Passed";
  }

  if (
    result.result === "Ineligible CV" ||
    result.result === "Insufficient Data"
  ) {
    screeningData.stateClass = "state-rejected";
    screeningData.cvSettingResult = "Failed";
  }

  // check screening setting
  if (interviewData.screeningSetting) {
    if (interviewData.screeningSetting === "Only Strong Fit") {
      if (result.result === "Strong Fit") {
        screeningData.stateClass = "state-accepted";
        screeningData.cvSettingResult = "Passed";
        // screeningData.currentStep = "AI Interview";
        // screeningData.status = "For Interview";
      } else {
        screeningData.stateClass = "state-rejected";
        screeningData.cvSettingResult = "Failed";
        // screeningData.status = "Failed CV Screening";
      }
    }

    if (interviewData.screeningSetting === "Good Fit and above") {
      if (result.result === "Good Fit" || result.result === "Strong Fit") {
        screeningData.stateClass = "state-accepted";
        screeningData.cvSettingResult = "Passed";
        // screeningData.currentStep = "AI Interview";
        // screeningData.status = "For Interview";
      } else {
        screeningData.stateClass = "state-rejected";
        screeningData.cvSettingResult = "Failed";
        // screeningData.status = "Failed CV Screening";
      }
    }
  }

  await db
    .collection("interviews")
    .updateOne({ interviewID: interviewID }, { $set: screeningData });

  if (interviewTransaction) {
    await db.collection("interview-history").insertOne({
      ...interviewTransaction,
      createdAt: Date.now(),
    });
  }
  // Update career lastActivityAt to current date
  await db
    .collection("careers")
    .updateOne(
      { id: interviewData.id },
      { $set: { lastActivityAt: new Date() } }
    );

  return NextResponse.json(screeningData);
}
