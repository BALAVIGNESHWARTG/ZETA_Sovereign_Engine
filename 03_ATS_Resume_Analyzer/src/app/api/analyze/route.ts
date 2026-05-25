import { NextResponse } from 'next/server';
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import pdfParse from 'pdf-parse';

// Setup Zod schema for structured output
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    score: z.number().describe("The ATS score out of 100 based on standard tech resume rules"),
    strengths: z.array(z.string()).describe("List of 3 key strengths of the resume"),
    missingKeywords: z.array(z.string()).describe("List of 3 to 5 critical missing keywords or skills for a tech role"),
    formattingIssues: z.array(z.string()).describe("List of formatting or structure issues that an ATS might struggle to parse"),
    verdict: z.string().describe("A harsh but professional 1-sentence verdict on the resume"),
  })
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to Buffer for pdf-parse
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Parse PDF Text
    let pdfText = "";
    try {
      const data = await pdfParse(buffer);
      pdfText = data.text;
    } catch (e) {
      return NextResponse.json({ error: 'Failed to extract text from PDF. It might be scanned or encrypted.' }, { status: 400 });
    }

    if (pdfText.trim().length < 50) {
      return NextResponse.json({ error: 'Not enough text extracted from PDF.' }, { status: 400 });
    }

    // Ensure Groq API Key exists
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Server configuration error: Missing GROQ_API_KEY' }, { status: 500 });
    }

    // Initialize Groq Model
    const model = new ChatGroq({
      apiKey: groqApiKey,
      modelName: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    // Create Prompt
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are an elite, highly critical enterprise Applicant Tracking System (ATS) and Senior Technical Recruiter. You brutally analyze tech resumes. Follow the formatting instructions exactly. Do not output anything other than the required JSON.\n\n{format_instructions}"],
      ["human", "Analyze the following extracted resume text and provide the ATS evaluation:\n\n{resume_text}"],
    ]);

    // Construct Chain
    const chain = prompt.pipe(model).pipe(parser);

    // Invoke Model
    const result = await chain.invoke({
      resume_text: pdfText,
      format_instructions: parser.getFormatInstructions(),
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("ATS Parsing Error:", error);
    return NextResponse.json({ error: error.message || 'An error occurred during analysis' }, { status: 500 });
  }
}
