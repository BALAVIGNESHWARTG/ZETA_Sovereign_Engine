import { NextResponse } from 'next/server';
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

// pdf-parse v3 exports PDFParse class — not a default function
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PDFParse } = require('pdf-parse');

// ─── Zod Schema: 30+ Dimension ATS Evaluation ───────────────────────────────
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    overallScore: z.number().min(0).max(100).describe("Final ATS score out of 100"),
    grade: z.enum(["S", "A", "B", "C", "D", "F"]).describe("Letter grade (S=Elite, A=Strong, B=Good, C=Average, D=Weak, F=Fail)"),

    // ── Section 1: Contact & Identity ──
    contactScore: z.number().min(0).max(100).describe("Score for contact section completeness"),
    hasPhone: z.boolean().describe("Resume has a phone number"),
    hasEmail: z.boolean().describe("Resume has a professional email"),
    hasLinkedIn: z.boolean().describe("Resume has a LinkedIn URL"),
    hasGitHub: z.boolean().describe("Resume has a GitHub URL"),
    hasPortfolio: z.boolean().describe("Resume has a portfolio or website URL"),

    // ── Section 2: Work Experience ──
    experienceScore: z.number().min(0).max(100).describe("Score for work experience quality"),
    yearsOfExperience: z.number().describe("Estimated total years of work experience"),
    hasQuantifiedAchievements: z.boolean().describe("Uses numbers/percentages to quantify achievements (e.g. 'increased sales by 40%')"),
    usesActionVerbs: z.boolean().describe("Begins bullet points with strong action verbs (Led, Built, Reduced, etc.)"),
    experienceBulletQuality: z.enum(["excellent", "good", "fair", "poor"]).describe("Overall quality of experience bullet points"),

    // ── Section 3: Skills & Keywords ──
    skillsScore: z.number().min(0).max(100).describe("Score for technical skills section"),
    technicalSkills: z.array(z.string()).describe("List of all detected technical skills (languages, frameworks, tools, platforms)"),
    softSkills: z.array(z.string()).describe("List of detected soft skills"),
    missingCriticalKeywords: z.array(z.string()).describe("Top 5 missing keywords critical for tech roles"),
    keywordDensity: z.enum(["optimal", "too_sparse", "keyword_stuffed"]).describe("Assessment of keyword density throughout resume"),

    // ── Section 4: Education ──
    educationScore: z.number().min(0).max(100).describe("Score for education section"),
    highestDegree: z.string().describe("Highest academic degree detected (e.g. B.Tech, M.S., Ph.D, MBA)"),
    hasRelevantCertifications: z.boolean().describe("Has relevant professional certifications (AWS, GCP, Azure, PMP, etc.)"),

    // ── Section 5: ATS Parsing Mechanics ──
    atsParsingScore: z.number().min(0).max(100).describe("Score for ATS-friendliness of formatting"),
    hasClearSections: z.boolean().describe("Resume has clearly labeled section headers (Experience, Skills, Education)"),
    usesAtsCompatibleFormat: z.boolean().describe("Uses simple formatting without tables, columns, graphics, headers/footers (ATS-safe)"),
    hasNoRenderingIssues: z.boolean().describe("No special characters or encoding issues that would break ATS parsing"),
    resumeLength: z.enum(["too_short", "ideal_1_page", "ideal_2_page", "too_long"]).describe("Resume length assessment"),

    // ── Section 6: Impact & Differentiation ──
    impactScore: z.number().min(0).max(100).describe("Score for how strongly the candidate differentiates themselves"),
    hasProjectsSection: z.boolean().describe("Resume includes a projects section"),
    hasOpenSourceContributions: z.boolean().describe("Mentions open source contributions"),
    hasAwardsOrRecognition: z.boolean().describe("Mentions awards, hackathon wins, or recognition"),

    // ── Section 7: Job Alignment (30+ Test Cases) ──
    jobAlignmentScore: z.number().min(0).max(100).describe("How well the resume is positioned for general tech roles (SDE/Data/AI/DevOps)"),
    targetRoleFit: z.enum(["Software Engineer", "Data Scientist", "DevOps/Cloud Engineer", "AI/ML Engineer", "Full Stack Developer", "Backend Developer", "Frontend Developer", "Unclear"]).describe("The tech role this resume is best suited for"),
    seniorityFit: z.enum(["Intern", "Junior (0-2 yrs)", "Mid-Level (2-5 yrs)", "Senior (5-8 yrs)", "Staff/Principal (8+ yrs)"]).describe("Seniority level this resume targets"),

    // ── Final Outputs ──
    topStrengths: z.array(z.string()).min(3).describe("Top 3 things the candidate is doing RIGHT"),
    criticalWeaknesses: z.array(z.string()).min(3).describe("Top 3 critical issues that will cause ATS rejection or recruiter bounce"),
    priorityActions: z.array(z.string()).min(3).describe("Top 3 specific, actionable improvements to make IMMEDIATELY"),
    verdict: z.string().describe("A single, blunt, professional 2-sentence verdict from an elite technical recruiter's perspective"),
  })
);

// ─── PDF Text Extraction ─────────────────────────────────────────────────────
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Strategy 1: Use PDFParse class (pdf-parse v3 API)
  try {
    const pdfParser = new PDFParse();
    const result = await pdfParser.lazyLoad(buffer);
    if (result && result.text && result.text.trim().length > 30) {
      return result.text.trim();
    }
  } catch (e1) {
    console.warn("Strategy 1 (lazyLoad) failed:", e1);
  }

  // Strategy 2: Try the parse method directly
  try {
    const pdfParser = new PDFParse();
    const result = await new Promise<{ text: string }>((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (data: { Pages: Array<{ Texts: Array<{ R: Array<{ T: string }> }> }> }) => {
        const text = data.Pages.map(page =>
          page.Texts.map(t => decodeURIComponent(t.R.map((r) => r.T).join(''))).join(' ')
        ).join('\n');
        resolve({ text });
      });
      pdfParser.on("pdfParser_dataError", (err: Error) => reject(err));
      pdfParser.parseBuffer(buffer);
    });
    if (result.text && result.text.trim().length > 30) {
      return result.text.trim();
    }
  } catch (e2) {
    console.warn("Strategy 2 (parseBuffer) failed:", e2);
  }

  throw new Error("All PDF extraction strategies failed. The file may be scanned, password-protected, or image-only.");
}

// ─── Main API Handler ────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Convert File → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text with multi-strategy fallback
    let resumeText: string;
    try {
      resumeText = await extractTextFromPDF(buffer);
    } catch (extractErr: unknown) {
      const msg = extractErr instanceof Error ? extractErr.message : 'Unknown extraction error';
      console.error("PDF Extraction Error:", msg);
      return NextResponse.json({
        error: `PDF text extraction failed: ${msg}. Please ensure the PDF is text-based (not a scanned image). Try exporting from Word/Google Docs as PDF.`
      }, { status: 422 });
    }

    if (resumeText.trim().length < 100) {
      return NextResponse.json({
        error: `Extracted only ${resumeText.trim().length} characters — too little to analyze. The PDF may be image-based. Try a text-based PDF exported directly from Word, Google Docs, or a LaTeX editor.`
      }, { status: 422 });
    }

    // Groq API Key check
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Server misconfiguration: GROQ_API_KEY is missing.' }, { status: 500 });
    }

    // Initialize Groq LLM
    const model = new ChatGroq({
      apiKey: groqApiKey,
      modelName: "llama-3.3-70b-versatile",
      temperature: 0.05,
      maxTokens: 4096,
    });

    // Prompt with 30+ dimension instructions
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are ZETA-ATS, the world's most advanced Applicant Tracking System combined with an elite Senior Technical Recruiter with 15 years experience at FAANG companies.

You rigorously evaluate resumes across 30+ professional dimensions covering contact completeness, work experience quality, skills and keyword alignment, education, ATS parsing mechanics, impact differentiation, and job-role alignment.

Your scoring is HARSH. A score of 85+ is exceptional. Most resumes score 40-65. Be brutally honest.

SCORING RUBRIC:
- 90-100 (S Grade): FAANG-ready, elite resume
- 75-89 (A Grade): Strong, will pass most ATS filters
- 60-74 (B Grade): Good but needs specific improvements
- 45-59 (C Grade): Average, will struggle against competition
- 30-44 (D Grade): Weak, high rejection probability
- 0-29 (F Grade): Will be filtered immediately

CRITICAL INSTRUCTIONS:
- Detect technical skills precisely: languages (Python, Java, JS), frameworks (React, Django, FastAPI), tools (Docker, Kubernetes, Git), cloud (AWS, GCP, Azure), databases (PostgreSQL, MongoDB, Redis)
- Check for quantified achievements (%, $, x improvement, user counts)
- Assess ATS compatibility: no tables, columns, headers/footers, images (these break ATS parsers)
- Identify target role from the skills and experience pattern
- Estimate seniority from years of experience and scope of work
- Your priorityActions must be SPECIFIC (e.g. "Add a Projects section with 3 GitHub links" NOT "Improve projects")

OUTPUT: Valid JSON only. No markdown. No explanations outside the JSON.

{format_instructions}`],
      ["human", `Analyze this resume text comprehensively across all 30+ dimensions:\n\n---\n{resume_text}\n---`],
    ]);

    const chain = prompt.pipe(model).pipe(parser);

    const result = await chain.invoke({
      resume_text: resumeText.slice(0, 12000), // Limit to 12k chars to stay within token limits
      format_instructions: parser.getFormatInstructions(),
    });

    // Attach extracted text length for debugging (not shown in UI)
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
