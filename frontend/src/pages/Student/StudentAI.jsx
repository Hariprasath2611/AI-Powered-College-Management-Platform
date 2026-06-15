import React, { useState } from 'react';
import api from '../../services/api';
import { 
  Cpu, Sparkles, Award, FileText, Send, CheckCircle2, 
  HelpCircle, ChevronRight, BookOpen, AlertCircle, MessageSquare
} from 'lucide-react';

const StudentAI = () => {
  const [activeTab, setActiveTab] = useState('resume');

  // Resume State
  const [resumeText, setResumeText] = useState('');
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [analyzingResume, setAnalyzingResume] = useState(false);

  // Interview State
  const [jobTitle, setJobTitle] = useState('Full Stack Developer');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionIndex]: string }
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [interviewResult, setInterviewResult] = useState(null);
  const [loadingInterview, setLoadingInterview] = useState(false);
  const [submittingAnswers, setSubmittingAnswers] = useState(false);

  // Career State
  const [careerRecommendation, setCareerRecommendation] = useState(null);
  const [loadingCareer, setLoadingCareer] = useState(false);

  // Resume Handler
  const handleAnalyzeResume = async (e) => {
    e.preventDefault();
    setAnalyzingResume(true);
    try {
      const response = await api.post('/ai/resume/analyze', { resumeText });
      setResumeAnalysis(response.data.analysis);
    } catch (err) {
      alert('Failed to analyze resume: ' + err.message);
    } finally {
      setAnalyzingResume(false);
    }
  };

  // Interview Handlers
  const handleStartInterview = async () => {
    setLoadingInterview(true);
    try {
      const response = await api.post('/ai/interview/start', { jobTitle });
      setQuestions(response.data.questions);
      setInterviewStarted(true);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setCurrentAnswer('');
      setInterviewResult(null);
    } catch (err) {
      alert('Failed to initialize interview: ' + err.message);
    } finally {
      setLoadingInterview(false);
    }
  };

  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) return;
    setAnswers({
      ...answers,
      [currentQuestionIndex]: currentAnswer
    });
    setCurrentAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitInterview = async () => {
    // Record final answer
    const finalAnswers = {
      ...answers,
      [currentQuestionIndex]: currentAnswer
    };
    
    // Map to API structure
    const formattedAnswers = questions.map((q, idx) => ({
      question: q.question,
      answer: finalAnswers[idx] || ''
    }));

    setSubmittingAnswers(true);
    try {
      const response = await api.post('/ai/interview/submit', {
        jobTitle,
        questions,
        answers: formattedAnswers
      });
      setInterviewResult(response.data.record);
    } catch (err) {
      alert('Failed to evaluate interview answers: ' + err.message);
    } finally {
      setSubmittingAnswers(false);
    }
  };

  // Career Handler
  const handleGetCareerRecommendations = async () => {
    setLoadingCareer(true);
    try {
      const response = await api.get('/ai/career/recommend');
      setCareerRecommendation(response.data.recommendation);
    } catch (err) {
      alert('Failed to compile recommendations: ' + err.message);
    } finally {
      setLoadingCareer(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-primary-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Aegis AI Assistant Center</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Access AI-Powered career roadmaps, ATS parser scoring systems, and interactive job mock interviews.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('resume')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'resume' 
              ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          ATS Resume Analyzer
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'interview' 
              ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Mock Interview Simulator
        </button>
        <button
          onClick={() => setActiveTab('career')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'career' 
              ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Career Roadmaps
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        
        {/* RESUME ANALYZER TAB */}
        {activeTab === 'resume' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form Column */}
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
                <FileText className="h-5 w-5 text-primary-500" /> Resume Text Input
              </h3>
              <p className="text-xs text-slate-400">Paste your resume content below. In production, this matches your uploaded PDF files text structure.</p>
              
              <form onSubmit={handleAnalyzeResume} className="space-y-4">
                <textarea
                  required
                  rows="10"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your Resume details, experience, skills, education here..."
                  className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={analyzingResume}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary-500/10 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Cpu className="h-4 w-4" />
                  {analyzingResume ? 'Analyzing ATS Score...' : 'Analyze ATS Score'}
                </button>
              </form>
            </div>

            {/* Analysis Results Column */}
            <div className="lg:col-span-2 space-y-6">
              {!resumeAnalysis ? (
                <div className="h-full min-h-[300px] bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl border-dashed flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <Cpu className="h-10 w-10 text-slate-300 mb-3 animate-pulse" />
                  <h4 className="font-bold text-sm">No analysis logged yet</h4>
                  <p className="text-xs max-w-xs mt-1">Submit your resume text on the sidebar form to generate ATS reports.</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 transition-colors">
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="h-5 w-5 text-indigo-500" /> ATS Compatibility Report
                  </h3>

                  {/* Scores grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ATS Score</span>
                      <strong className={`text-4xl font-black ${getScoreColor(resumeAnalysis.atsScore)}`}>
                        {resumeAnalysis.atsScore}%
                      </strong>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Industry Readiness</span>
                      <strong className={`text-4xl font-black ${getScoreColor(resumeAnalysis.readinessScore)}`}>
                        {resumeAnalysis.readinessScore}%
                      </strong>
                    </div>
                  </div>

                  {/* Skill Gaps */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected Skill Gaps</h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeAnalysis.skillGap.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-xs font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions list */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Improvement Suggestions</h4>
                    <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-350">
                      {resumeAnalysis.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MOCK INTERVIEW SIMULATOR TAB */}
        {activeTab === 'interview' && (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors">
            {!interviewStarted ? (
              <div className="text-center py-10 space-y-6">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg">AI Mock Interview Simulator</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                    Test your response scripts! Choose your target role and undergo a mock interview session composed of standard HR and technical questions.
                  </p>
                </div>

                <div className="flex max-w-sm mx-auto gap-2">
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Front End Developer"
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-primary-500"
                  />
                  <button
                    onClick={handleStartInterview}
                    disabled={loadingInterview}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-lg shadow-primary-500/10 active:scale-[0.98]"
                  >
                    {loadingInterview ? 'Configuring...' : 'Start Session'}
                  </button>
                </div>
              </div>
            ) : interviewResult ? (
              /* Interview Results Page */
              <div className="space-y-6">
                <h3 className="font-extrabold text-base flex items-center gap-1.5">
                  <CheckCircle2 className="h-5 w-5 text-green-500" /> Evaluation Report
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Communication Score</span>
                    <strong className={`text-3xl font-black ${getScoreColor(interviewResult.communicationScore)}`}>
                      {interviewResult.communicationScore}/100
                    </strong>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Confidence Score</span>
                    <strong className={`text-3xl font-black ${getScoreColor(interviewResult.confidenceScore)}`}>
                      {interviewResult.confidenceScore}/100
                    </strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interviewer Assessment</h4>
                  <p className="text-slate-600 dark:text-slate-350 text-xs leading-relaxed">
                    {interviewResult.feedback}
                  </p>
                </div>

                <button
                  onClick={() => setInterviewStarted(false)}
                  className="w-full py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-all"
                >
                  Close Session Report
                </button>
              </div>
            ) : (
              /* Active Interview Question Card */
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Role: {jobTitle}
                  </span>
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>

                {/* Question Text */}
                <div className="p-5 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl">
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-[9px] font-bold rounded uppercase tracking-wider">
                    {questions[currentQuestionIndex]?.type} Category
                  </span>
                  <p className="font-extrabold text-base mt-2 text-slate-800 dark:text-white">
                    {questions[currentQuestionIndex]?.question}
                  </p>
                </div>

                {/* Textarea Answer */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Your Response Answer</label>
                  <textarea
                    rows="6"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer as you would speak it to the recruiter..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-850 dark:text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>

                {/* Navigation Button */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setInterviewStarted(false)}
                    className="text-xs font-bold text-red-500 hover:underline"
                  >
                    Abort Interview
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      disabled={!currentAnswer.trim()}
                      className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-lg shadow-primary-500/10 disabled:opacity-50"
                    >
                      Next Question
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitInterview}
                      disabled={submittingAnswers || !currentAnswer.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-lg shadow-green-500/10 disabled:opacity-50"
                    >
                      {submittingAnswers ? 'Evaluating...' : 'Submit Final Answers'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CAREER RECOMMENDATION TAB */}
        {activeTab === 'career' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors text-center space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-base">AI Career Advisor Recommendation System</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
                  Generate personal roadmap tracks based on your enrolled department, current semester, and logged test exam marks.
                </p>
              </div>

              <button
                onClick={handleGetCareerRecommendations}
                disabled={loadingCareer}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary-500/10 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loadingCareer ? 'Compiling Roadmaps...' : 'Generate Career Roadmaps'}
              </button>
            </div>

            {/* Recommendation Cards */}
            {careerRecommendation && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Career Paths & Jobs */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Award className="h-5 w-5 text-amber-500" /> Recommended Job Roles
                  </h4>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Paths</span>
                    <div className="flex flex-wrap gap-2">
                      {careerRecommendation.careerPaths.map((path, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-primary-500/10 text-primary-500 dark:text-primary-400 rounded-lg text-xs font-semibold">
                          {path}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Job Titles Suggestions</span>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-350">
                      {careerRecommendation.jobSuggestions.map((job, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{job}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Learning Roadmap Steps */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                    <BookOpen className="h-5 w-5 text-indigo-500" /> Tech Stack Learning Roadmap
                  </h4>

                  <ul className="space-y-3.5 text-xs text-slate-650 dark:text-slate-350">
                    {careerRecommendation.learningRoadmap.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="h-5 w-5 bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded-md flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="leading-normal">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default StudentAI;
