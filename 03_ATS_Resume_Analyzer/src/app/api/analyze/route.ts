import { NextResponse } from 'next/server';
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

// ─── Zod Schema: 30+ Dimension ATS Evaluation ───────────────────────────────
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    overallScore: z.number().min(0).max(100).describe("Final ATS score out of 100"),
    grade: z.enum(["S", "A", "B", "C", "D", "F"]).describe("Letter grade (S=Elite, A=Strong, B=Good, C=Average, D=Weak, F=Fail)"),

    contactScore: z.number().min(0).max(100).describe("Score for contact section completeness"),
    hasPhone: z.boolean().describe("Resume has a phone number"),
    hasEmail: z.boolean().describe("Resume has a professional email"),
    hasLinkedIn: z.boolean().describe("Resume has a LinkedIn URL"),
    hasGitHub: z.boolean().describe("Resume has a GitHub URL"),
    hasPortfolio: z.boolean().describe("Resume has a portfolio or website URL"),

    experienceScore: z.number().min(0).max(100).describe("Score for work experience quality"),
    yearsOfExperience: z.number().describe("Estimated total years of work experience"),
    hasQuantifiedAchievements: z.boolean().describe("Uses numbers/percentages to quantify achievements"),
    usesActionVerbs: z.boolean().describe("Begins bullet points with strong action verbs"),
    experienceBulletQuality: z.enum(["excellent", "good", "fair", "poor"]).describe("Overall quality of experience bullet points"),

    skillsScore: z.number().min(0).max(100).describe("Score for technical skills section"),
    technicalSkills: z.array(z.string()).describe("List of all detected technical skills"),
    softSkills: z.array(z.string()).describe("List of detected soft skills"),
    missingCriticalKeywords: z.array(z.string()).describe("Top 5 missing keywords critical for tech roles"),
    keywordDensity: z.enum(["optimal", "too_sparse", "keyword_stuffed"]).describe("Keyword density assessment"),

    educationScore: z.number().min(0).max(100).describe("Score for education section"),
    highestDegree: z.string().describe("Highest academic degree detected"),
    hasRelevantCertifications: z.boolean().describe("Has relevant professional certifications"),

    atsParsingScore: z.number().min(0).max(100).describe("Score for ATS-friendliness of formatting"),
    hasClearSections: z.boolean().describe("Resume has clearly labeled section headers"),
    usesAtsCompatibleFormat: z.boolean().describe("Uses simple ATS-safe formatting without tables or columns"),
    hasNoRenderingIssues: z.boolean().describe("No special characters or encoding issues"),
    resumeLength: z.enum(["too_short", "ideal_1_page", "ideal_2_page", "too_long"]).describe("Resume length assessment"),

    impactScore: z.number().min(0).max(100).describe("Score for impact and differentiation"),
    hasProjectsSection: z.boolean().describe("Resume includes a projects section"),
    hasOpenSourceContributions: z.boolean().describe("Mentions open source contributions"),
    hasAwardsOrRecognition: z.boolean().describe("Mentions awards, hackathon wins, or recognition"),

    jobAlignmentScore: z.number().min(0).max(100).describe("How well positioned for general tech roles"),
    targetRoleFit: z.enum(["Software Engineer", "Data Scientist", "DevOps/Cloud Engineer", "AI/ML Engineer", "Full Stack Developer", "Backend Developer", "Frontend Developer", "Unclear"]).describe("Best suited tech role"),
    seniorityFit: z.enum(["Intern", "Junior (0-2 yrs)", "Mid-Level (2-5 yrs)", "Senior (5-8 yrs)", "Staff/Principal (8+ yrs)"]).describe("Seniority level"),

    topStrengths: z.array(z.string()).min(3).describe("Top 3 strengths"),
    criticalWeaknesses: z.array(z.string()).min(3).describe("Top 3 critical weaknesses"),
    priorityActions: z.array(z.string()).min(3).describe("Top 3 specific actionable improvements"),
    verdict: z.string().describe("A blunt 2-sentence recruiter verdict"),
  })
);

// ─── PDF Text Extraction using pdf2json ─────────────────────────────────────────
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const PDFParser = require('pdf2json');
  
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1); // 1 = text mode

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)));
    
    pdfParser.on("pdfParser_dataReady", () => {
      const fullText = pdfParser.getRawTextContent();
      if (!fullText || fullText.trim().length < 50) {
        reject(new Error(`Only ${fullText ? fullText.trim().length : 0} characters extracted. The PDF appears to be image-only or scanned.`));
      } else {
        resolve(fullText.trim());
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

// ─── Main API Handler ────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let resumeText: string;
    try {
      resumeText = await extractTextFromPDF(buffer);
    } catch (extractErr: unknown) {
      const msg = extractErr instanceof Error ? extractErr.message : 'Unknown extraction error';
      console.error("PDF Extraction Error:", msg);
      return NextResponse.json({
        error: `PDF extraction failed: ${msg}. Make sure the PDF is text-based (exported from Word, Google Docs, or Overleaf — not a scanned image or photo).`
      }, { status: 422 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Server misconfiguration: GROQ_API_KEY missing.' }, { status: 500 });
    }

    const model = new ChatGroq({
      apiKey: groqApiKey,
      model: "llama-3.3-70b-versatile",
      temperature: 0.05,
      maxTokens: 4096,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are ZETA-ATS, an elite Applicant Tracking System combined with a Senior Technical Recruiter with 15 years at FAANG companies.

You rigorously evaluate resumes across 30+ professional dimensions.

SCORING RUBRIC:
- 90-100 (S Grade): FAANG-ready, elite resume
- 75-89 (A Grade): Strong, will pass most ATS filters
- 60-74 (B Grade): Good but needs specific improvements
- 45-59 (C Grade): Average, will struggle against competition
- 30-44 (D Grade): Weak, high rejection probability
- 0-29 (F Grade): Will be filtered immediately

RULES:
- Detect technical skills precisely: languages (Python, Java, JS), frameworks (React, Django), tools (Docker, Git), cloud (AWS, GCP, Azure), databases (PostgreSQL, Redis)
- Check for quantified achievements (%, $, multipliers)
- Assess ATS compatibility (no tables, columns, images)
- Identify target role from skills pattern
- Estimate seniority from years and scope of work
- priorityActions MUST be SPECIFIC (e.g. "Add 3 GitHub project links with tech stack" NOT "Improve projects")
- OUTPUT: Valid JSON only. No markdown. No extra text.

{format_instructions}`],
      ["human", "Analyze this resume comprehensively:\n\n---\n{resume_text}\n---"],
    ]);

    const chain = prompt.pipe(model).pipe(parser);

    const result = await chain.invoke({
      resume_text: resumeText.slice(0, 12000),
      format_instructions: parser.getFormatInstructions(),
    });

    return NextResponse.json({
      ...result,
      _meta: { extractedChars: resumeText.length, fileName: file.name }
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown server error';
    console.error("ATS Analysis Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
