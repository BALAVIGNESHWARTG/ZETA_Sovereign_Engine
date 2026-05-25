"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, FileText, CheckCircle, AlertCircle, X, ChevronRight,
  Activity, Zap, ShieldAlert, User, Briefcase, BookOpen, Code2,
  Target, Star, TrendingUp, Github, Linkedin, Globe, Phone, Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ATSResult {
  overallScore: number;
  grade: "S" | "A" | "B" | "C" | "D" | "F";
  contactScore: number;
  hasPhone: boolean;
  hasEmail: boolean;
  hasLinkedIn: boolean;
  hasGitHub: boolean;
  hasPortfolio: boolean;
  experienceScore: number;
  yearsOfExperience: number;
  hasQuantifiedAchievements: boolean;
  usesActionVerbs: boolean;
  experienceBulletQuality: "excellent" | "good" | "fair" | "poor";
  skillsScore: number;
  technicalSkills: string[];
  softSkills: string[];
  missingCriticalKeywords: string[];
  keywordDensity: "optimal" | "too_sparse" | "keyword_stuffed";
  educationScore: number;
  highestDegree: string;
  hasRelevantCertifications: boolean;
  atsParsingScore: number;
  hasClearSections: boolean;
  usesAtsCompatibleFormat: boolean;
  resumeLength: "too_short" | "ideal_1_page" | "ideal_2_page" | "too_long";
  impactScore: number;
  hasProjectsSection: boolean;
  jobAlignmentScore: number;
  targetRoleFit: string;
  seniorityFit: string;
  topStrengths: string[];
  criticalWeaknesses: string[];
  priorityActions: string[];
  verdict: string;
  _meta?: { extractedChars: number; fileName: string };
}

const gradeColors: Record<string, string> = {
  S: "text-[#bd00ff] drop-shadow-[0_0_12px_#bd00ff]",
  A: "text-[#39ff14] drop-shadow-[0_0_12px_#39ff14]",
  B: "text-[#00f3ff] drop-shadow-[0_0_12px_#00f3ff]",
  C: "text-yellow-400 drop-shadow-[0_0_8px_#facc15]",
  D: "text-orange-500",
  F: "text-red-500",
};

const gradeLabel: Record<string, string> = {
  S: "ELITE", A: "STRONG", B: "GOOD", C: "AVERAGE", D: "WEAK", F: "CRITICAL",
};

function ScoreBar({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) {
  const color = score >= 75 ? "#39ff14" : score >= 50 ? "#00f3ff" : score >= 30 ? "#facc15" : "#ef4444";
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon} {label}
        </div>
        <span className="text-sm font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}

function CheckItem({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm py-1">
      {value
        ? <CheckCircle className="h-4 w-4 text-[#39ff14] flex-shrink-0" />
        : <X className="h-4 w-4 text-red-500 flex-shrink-0" />}
      <span className={value ? "text-muted-foreground" : "text-red-400"}>{label}</span>
    </div>
  );
}

export default function ATSAnalyzer() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ATSResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFileSelection(e.dataTransfer.files[0]);
  };
  const handleFileSelection = (f: File) => {
    setError(null); setResult(null);
    if (f.type !== "application/pdf") { setError("Only PDF files are supported."); return; }
    setFile(f);
  };
  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true); setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-16 relative overflow-x-hidden pb-32">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="z-10 flex flex-col items-center w-full max-w-6xl"
      >
        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <span className="flex h-2 w-2 rounded-full bg-[#00f3ff] mr-2 animate-pulse shadow-[0_0_8px_#00f3ff]" />
          ZETA Sovereign Engine — Project 2
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-center drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          Beat the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#bd00ff] drop-shadow-[0_0_12px_#bd00ff]">ATS Algorithms.</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-2xl text-center">
          30+ professional dimensions. FAANG-grade analysis. Brutal honesty.
        </p>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="upload" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-3xl">
              <div
                className={cn("relative group cursor-pointer glass-panel rounded-3xl p-12 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300",
                  isDragging ? "border-[#00f3ff] bg-[#00f3ff]/5 shadow-[0_0_30px_rgba(0,243,255,0.2)]" : "border-border hover:border-primary/50")}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])} />
                <AnimatePresence mode="wait">
                  {!file ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center pointer-events-none">
                      <div className="h-24 w-24 rounded-full bg-secondary/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-border">
                        <UploadCloud className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">Upload your Resume</h3>
                      <p className="text-muted-foreground text-sm">Drag & drop a text-based PDF. Scanned images won&apos;t work.</p>
                    </motion.div>
                  ) : (
                    <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center w-full">
                      <div className="h-24 w-24 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <FileText className="h-12 w-12 text-[#00f3ff]" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-1 flex items-center">{file.name} <CheckCircle className="ml-3 h-6 w-6 text-[#39ff14]" /></h3>
                      <p className="text-muted-foreground text-sm mb-8">{(file.size / 1024).toFixed(0)} KB</p>
                      <div className="flex gap-4">
                        <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="px-6 py-3 rounded-full border border-border hover:bg-secondary transition-colors flex items-center font-medium">
                          <X className="mr-2 h-4 w-4" /> Remove
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} disabled={isAnalyzing}
                          className={cn("px-8 py-3 rounded-full bg-gradient-to-r from-[#00f3ff] to-blue-600 text-black font-bold transition-all hover:scale-105 flex items-center shadow-[0_0_15px_rgba(0,243,255,0.4)]", isAnalyzing && "opacity-70 cursor-not-allowed hover:scale-100")}>
                          {isAnalyzing ? (
                            <span className="flex items-center text-black">
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="mr-2 h-5 w-5 border-2 border-black border-t-transparent rounded-full" />
                              Scanning ({file.name.slice(0, 12)}...)
                            </span>
                          ) : (<>Analyze Resume <ChevronRight className="ml-2 h-5 w-5" /></>)}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {error && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-5 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive flex items-start">
                  <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">{error}</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                  <h2 className="text-3xl font-bold">ATS Report</h2>
                  {result._meta && <p className="text-muted-foreground text-sm mt-1">{result._meta.fileName} — {result._meta.extractedChars.toLocaleString()} characters extracted</p>}
                </div>
                <button onClick={() => { setResult(null); setFile(null); }} className="text-sm px-5 py-2 rounded-full border border-border hover:bg-secondary transition-colors flex items-center gap-2">
                  <X className="h-4 w-4" /> Scan Another
                </button>
              </div>

              {/* Hero Row: Score + Grade + Verdict */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Ring */}
                <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center">
                  <p className="text-muted-foreground text-xs uppercase tracking-widest mb-4 font-mono">ATS Score</p>
                  <div className="relative h-40 w-40 flex items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full -rotate-90">
                      <circle cx="80" cy="80" r="68" className="stroke-secondary fill-none" strokeWidth="10" />
                      <motion.circle cx="80" cy="80" r="68" className="fill-none" strokeWidth="10"
                        style={{ stroke: result.overallScore >= 75 ? "#39ff14" : result.overallScore >= 50 ? "#00f3ff" : result.overallScore >= 30 ? "#facc15" : "#ef4444" }}
                        strokeDasharray="427" strokeLinecap="round"
                        initial={{ strokeDashoffset: 427 }}
                        animate={{ strokeDashoffset: 427 - (427 * result.overallScore) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      />
                    </svg>
                    <div className="text-center">
                      <div className="text-4xl font-bold">{result.overallScore}</div>
                      <div className="text-xs text-muted-foreground">/100</div>
                    </div>
                  </div>
                </div>

                {/* Grade */}
                <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center">
                  <p className="text-muted-foreground text-xs uppercase tracking-widest mb-4 font-mono">Grade</p>
                  <div className={cn("text-8xl font-black font-mono", gradeColors[result.grade])}>{result.grade}</div>
                  <div className="text-sm font-mono text-muted-foreground mt-2">{gradeLabel[result.grade]}</div>
                  <div className="mt-3 px-3 py-1 rounded-full bg-secondary text-xs font-mono">
                    {result.seniorityFit} · {result.targetRoleFit}
                  </div>
                </div>

                {/* Verdict */}
                <div className="glass-panel p-8 rounded-3xl flex flex-col justify-center border-l-4 border-l-[#bd00ff]">
                  <div className="flex items-center mb-4">
                    <Activity className="h-5 w-5 text-[#bd00ff] mr-2" />
                    <h3 className="font-semibold">Recruiter Verdict</h3>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed italic border-l-2 border-border pl-4">
                    &ldquo;{result.verdict}&rdquo;
                  </p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="glass-panel p-8 rounded-3xl">
                <h3 className="font-semibold text-lg mb-6 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Score Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                  <ScoreBar label="Contact & Identity" score={result.contactScore} icon={<User className="h-4 w-4" />} />
                  <ScoreBar label="Work Experience" score={result.experienceScore} icon={<Briefcase className="h-4 w-4" />} />
                  <ScoreBar label="Skills & Keywords" score={result.skillsScore} icon={<Code2 className="h-4 w-4" />} />
                  <ScoreBar label="Education" score={result.educationScore} icon={<BookOpen className="h-4 w-4" />} />
                  <ScoreBar label="ATS Parsing Mechanics" score={result.atsParsingScore} icon={<Target className="h-4 w-4" />} />
                  <ScoreBar label="Impact & Differentiation" score={result.impactScore} icon={<Star className="h-4 w-4" />} />
                  <ScoreBar label="Job Alignment" score={result.jobAlignmentScore} icon={<Activity className="h-4 w-4" />} />
                </div>
              </div>

              {/* Checklist Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Checklist */}
                <div className="glass-panel p-6 rounded-3xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-sm"><User className="h-4 w-4 text-[#00f3ff]" /> Contact Completeness</h4>
                  <CheckItem label="Phone number" value={result.hasPhone} />
                  <CheckItem label="Professional email" value={result.hasEmail} />
                  <CheckItem label="LinkedIn profile" value={result.hasLinkedIn} />
                  <CheckItem label="GitHub profile" value={result.hasGitHub} />
                  <CheckItem label="Portfolio / Website" value={result.hasPortfolio} />
                </div>

                {/* Experience Checks */}
                <div className="glass-panel p-6 rounded-3xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-sm"><Briefcase className="h-4 w-4 text-yellow-400" /> Experience Quality</h4>
                  <CheckItem label="Quantified achievements (%, $, x)" value={result.hasQuantifiedAchievements} />
                  <CheckItem label="Strong action verbs" value={result.usesActionVerbs} />
                  <CheckItem label="Has projects section" value={result.hasProjectsSection} />
                  <CheckItem label="Relevant certifications" value={result.hasRelevantCertifications} />
                  <CheckItem label="ATS-safe formatting" value={result.usesAtsCompatibleFormat} />
                  <CheckItem label="Clear section headers" value={result.hasClearSections} />
                  <div className="mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">Years of Experience: </span>
                    <span className="text-xs font-bold text-[#00f3ff]">{result.yearsOfExperience} yrs</span>
                    <span className="ml-3 text-xs text-muted-foreground">Length: </span>
                    <span className="text-xs font-bold text-[#00f3ff]">{result.resumeLength.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                {/* Keyword Density */}
                <div className="glass-panel p-6 rounded-3xl">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-sm"><Zap className="h-4 w-4 text-[#bd00ff]" /> Keyword Intelligence</h4>
                  <p className="text-xs text-muted-foreground mb-2">Density:</p>
                  <span className={cn("text-xs font-bold px-2 py-1 rounded-full",
                    result.keywordDensity === "optimal" ? "bg-[#39ff14]/20 text-[#39ff14]" :
                    result.keywordDensity === "too_sparse" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                  )}>{result.keywordDensity.replace(/_/g, ' ')}</span>
                  <p className="text-xs text-muted-foreground mt-4 mb-2">Missing Critical Keywords:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.missingCriticalKeywords.map((kw, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-red-400 border border-destructive/30">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills Detected */}
              <div className="glass-panel p-6 rounded-3xl">
                <h4 className="font-semibold mb-4 flex items-center gap-2"><Code2 className="h-5 w-5 text-primary" /> Detected Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {result.technicalSkills.map((skill, i) => (
                    <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                      className="text-xs px-3 py-1.5 rounded-full bg-primary/15 text-[#00f3ff] border border-primary/30 font-mono">
                      {skill}
                    </motion.span>
                  ))}
                </div>
                {result.softSkills.length > 0 && (
                  <>
                    <p className="text-xs text-muted-foreground mt-4 mb-2">Soft Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.softSkills.map((skill, i) => (
                        <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground border border-border font-mono">{skill}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Bottom Action Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-3xl">
                  <div className="flex items-center mb-5 pb-4 border-b border-border">
                    <CheckCircle className="h-5 w-5 text-[#39ff14] mr-2" />
                    <h3 className="font-semibold">Top Strengths</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.topStrengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#39ff14]/20 text-[#39ff14] text-xs flex items-center justify-center font-bold">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-panel p-6 rounded-3xl border border-destructive/20">
                  <div className="flex items-center mb-5 pb-4 border-b border-border">
                    <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                    <h3 className="font-semibold">Critical Weaknesses</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.criticalWeaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 h-5 w-5 rounded-full bg-destructive/20 text-red-400 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-panel p-6 rounded-3xl border border-[#00f3ff]/20">
                  <div className="flex items-center mb-5 pb-4 border-b border-border">
                    <ShieldAlert className="h-5 w-5 text-[#00f3ff] mr-2" />
                    <h3 className="font-semibold">Priority Actions</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.priorityActions.map((a, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 h-5 w-5 rounded-full bg-[#00f3ff]/20 text-[#00f3ff] text-xs flex items-center justify-center font-bold">{i + 1}</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
