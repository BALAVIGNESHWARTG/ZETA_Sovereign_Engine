"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle, AlertCircle, X, ChevronRight, Activity, Zap, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface ATSResult {
  score: number;
  strengths: string[];
  missingKeywords: string[];
  formattingIssues: string[];
  verdict: string;
}

export default function ATSAnalyzer() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ATSResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    setFile(selectedFile);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24 relative overflow-x-hidden pb-32">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center w-full max-w-5xl"
      >
        <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <span className="flex h-2 w-2 rounded-full bg-[#00f3ff] mr-2 animate-pulse shadow-[0_0_8px_#00f3ff]"></span>
          ZETA Sovereign Engine Project 2
        </div>
        
        {/* Neon Glow Branding Reference */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-center drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          Beat the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#bd00ff] drop-shadow-[0_0_12px_#bd00ff]">ATS Algorithms.</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-2xl text-center">
          Upload your resume and instantly see how recruiters and enterprise Applicant Tracking Systems score your profile.
        </p>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-3xl"
            >
              <div
                className={cn(
                  "relative group cursor-pointer glass-panel rounded-3xl p-12 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300",
                  isDragging ? "border-[#00f3ff] bg-[#00f3ff]/5 shadow-[0_0_30px_rgba(0,243,255,0.2)]" : "border-border hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf" 
                  onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
                />
                
                <AnimatePresence mode="wait">
                  {!file ? (
                    <motion.div 
                      key="upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center pointer-events-none"
                    >
                      <div className="h-24 w-24 rounded-full bg-secondary/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl border border-border">
                        <UploadCloud className="h-12 w-12 text-primary" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">Upload your Resume</h3>
                      <p className="text-muted-foreground text-sm">Drag and drop your PDF here, or click to browse.</p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="file"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center w-full"
                    >
                      <div className="h-24 w-24 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <FileText className="h-12 w-12 text-[#00f3ff]" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2 flex items-center">
                        {file.name}
                        <CheckCircle className="ml-3 h-6 w-6 text-[#39ff14] drop-shadow-[0_0_8px_#39ff14]" />
                      </h3>
                      <p className="text-muted-foreground text-sm mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      
                      <div className="flex gap-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setError(null);
                          }}
                          className="px-6 py-3 rounded-full border border-border hover:bg-secondary transition-colors flex items-center font-medium"
                        >
                          <X className="mr-2 h-4 w-4" /> Remove
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnalyze();
                          }}
                          disabled={isAnalyzing}
                          className={cn(
                            "px-8 py-3 rounded-full bg-gradient-to-r from-[#00f3ff] to-blue-600 text-black font-bold transition-all hover:scale-105 flex items-center shadow-[0_0_15px_rgba(0,243,255,0.4)]",
                            isAnalyzing && "opacity-70 cursor-not-allowed hover:scale-100"
                          )}
                        >
                          {isAnalyzing ? (
                            <span className="flex items-center text-white">
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                              />
                              Extracting & Scoring...
                            </span>
                          ) : (
                            <>Analyze Resume <ChevronRight className="ml-2 h-5 w-5" /></>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive flex items-start"
                >
                  <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col gap-6"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-3xl font-bold">Analysis Complete</h2>
                <button 
                  onClick={() => setResult(null)}
                  className="text-sm px-4 py-2 rounded-full border border-border hover:bg-secondary transition-colors"
                >
                  Scan Another
                </button>
              </div>

              {/* Top Row: Score & Verdict */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center border-l-4 border-l-[#00f3ff]">
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-sm mb-4">ATS Match Score</p>
                  <div className="relative h-40 w-40 flex items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" className="stroke-secondary fill-none" strokeWidth="8" />
                      <motion.circle 
                        cx="80" cy="80" r="70" 
                        className={cn("fill-none transition-all duration-1000", result.score > 75 ? "stroke-[#39ff14]" : result.score > 50 ? "stroke-yellow-400" : "stroke-destructive")} 
                        strokeWidth="8" strokeDasharray="440" strokeDashoffset={440 - (440 * result.score) / 100}
                        initial={{ strokeDashoffset: 440 }}
                        animate={{ strokeDashoffset: 440 - (440 * result.score) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="text-4xl font-bold flex items-baseline">
                      {result.score}<span className="text-lg text-muted-foreground ml-1">/100</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-8 rounded-3xl md:col-span-2 flex flex-col justify-center border-l-4 border-l-[#bd00ff]">
                  <div className="flex items-center mb-4">
                    <Activity className="h-6 w-6 text-[#bd00ff] mr-3" />
                    <h3 className="text-xl font-bold">AI Recruiter Verdict</h3>
                  </div>
                  <p className="text-lg text-foreground/90 leading-relaxed italic border-l-2 border-border pl-4">
                    "{result.verdict}"
                  </p>
                </div>
              </div>

              {/* Bottom Row: Details Bento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-3xl">
                  <div className="flex items-center mb-6 pb-4 border-b border-border">
                    <Zap className="h-5 w-5 text-yellow-400 mr-2" />
                    <h3 className="font-semibold text-lg">Key Strengths</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.strengths.map((str, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-[#39ff14] mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-destructive/20 bg-destructive/5">
                  <div className="flex items-center mb-6 pb-4 border-b border-border">
                    <AlertCircle className="h-5 w-5 text-destructive mr-2" />
                    <h3 className="font-semibold text-lg">Missing Keywords</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.missingKeywords.map((kw, i) => (
                      <li key={i} className="flex items-start">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive mr-3 mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{kw}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-6 rounded-3xl">
                  <div className="flex items-center mb-6 pb-4 border-b border-border">
                    <ShieldAlert className="h-5 w-5 text-orange-400 mr-2" />
                    <h3 className="font-semibold text-lg">Formatting Issues</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.formattingIssues.length > 0 ? (
                      result.formattingIssues.map((iss, i) => (
                        <li key={i} className="flex items-start">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mr-3 mt-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{iss}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-muted-foreground italic">No major parsing issues detected.</li>
                    )}
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
