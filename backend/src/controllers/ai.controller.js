const prisma = require('../config/db');
const { OpenAI } = require('openai');

let openai = null;
try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'mock-openai-key-for-local-development') {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log("✅ OpenAI API configured successfully.");
  } else {
    console.warn("⚠️ OpenAI API key is missing or mock. AI features will run in MOCK mode.");
  }
} catch (err) {
  console.warn("⚠️ Failed to initialize OpenAI. Falling back to MOCK mode.", err.message);
}

// 1. AI Resume Analyzer
const analyzeResume = async (req, res, next) => {
  try {
    const studentId = req.user.profileId;
    const { resumeText } = req.body; 

    const contentToParse = resumeText || "Skills: JavaScript, Node.js, React.js. Experience: Built college website. Education: B.E. Computer Science.";

    let analysisResult = null;

    if (openai) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an ATS (Applicant Tracking System) algorithm. Parse the resume and return raw JSON format only with fields: atsScore (0-100), skillGap (array of strings), suggestions (array of strings), readinessScore (0-100).'
          },
          {
            role: 'user',
            content: `Analyze this resume: ${contentToParse}`
          }
        ],
        response_format: { type: "json_object" }
      });

      analysisResult = JSON.parse(response.choices[0].message.content);
    } else {
      analysisResult = {
        atsScore: 78,
        skillGap: ["Docker", "Kubernetes", "TypeScript", "CI/CD Pipelines", "System Design"],
        suggestions: [
          "Include quantitative metrics for project impact (e.g. 'Improved efficiency by 20%')",
          "Add certification sections for Cloud Technologies",
          "Ensure resume mentions familiarity with automated testing frameworks like Jest"
        ],
        readinessScore: 82
      };
    }

    // Save to DB (Stringified JSON)
    const saved = await prisma.resumeAnalysis.create({
      data: {
        studentId,
        atsScore: analysisResult.atsScore,
        skillGap: JSON.stringify(analysisResult.skillGap),
        suggestions: JSON.stringify(analysisResult.suggestions),
        readinessScore: analysisResult.readinessScore
      }
    });

    res.status(200).json({
      analysis: {
        ...saved,
        skillGap: JSON.parse(saved.skillGap),
        suggestions: JSON.parse(saved.suggestions)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. Start Interview Session (Generate Questions)
const startInterview = async (req, res, next) => {
  try {
    const { jobTitle } = req.body;

    let questions = [];

    if (openai) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Generate exactly 3 Technical questions and 2 HR questions for a mock interview. Return JSON only in format: { "questions": [ { "question": "string", "type": "HR" | "Technical" } ] }'
          },
          {
            role: 'user',
            content: `Job Title: ${jobTitle}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      questions = parsed.questions;
    } else {
      const techRole = jobTitle ? jobTitle.toLowerCase() : 'software engineer';
      if (techRole.includes('frontend') || techRole.includes('react')) {
        questions = [
          { question: "What is the difference between Virtual DOM and Shadow DOM?", type: "Technical" },
          { question: "Explain the React component lifecycle and hook dependencies.", type: "Technical" },
          { question: "How would you optimize a slow React application?", type: "Technical" },
          { question: "Tell me about a time you had to resolve a conflict with a team member.", type: "HR" },
          { question: "Why do you want to join our organization?", type: "HR" }
        ];
      } else {
        questions = [
          { question: "What are the key principles of RESTful APIs?", type: "Technical" },
          { question: "Explain how database indexing works and when to avoid it.", type: "Technical" },
          { question: "What is the event loop in Node.js and how does concurrency work?", type: "Technical" },
          { question: "Describe a complex problem you solved and how you arrived at the solution.", type: "HR" },
          { question: "Where do you see yourself in the next five years?", type: "HR" }
        ];
      }
    }

    res.status(200).json({ jobTitle, questions });
  } catch (error) {
    next(error);
  }
};

// 3. Evaluate Interview Answers
const submitInterview = async (req, res, next) => {
  try {
    const studentId = req.user.profileId;
    const { jobTitle, questions, answers } = req.body; 

    let evaluation = null;

    if (openai) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Evaluate the mock interview responses. Return JSON format only with fields: feedback (overall textual assessment), communicationScore (0-100), confidenceScore (0-100).'
          },
          {
            role: 'user',
            content: `Job: ${jobTitle}\nQuestions & Answers:\n${JSON.stringify({ questions, answers })}`
          }
        ],
        response_format: { type: "json_object" }
      });

      evaluation = JSON.parse(response.choices[0].message.content);
    } else {
      evaluation = {
        feedback: "Good attempt! Technical logic was clear and sound. However, try structuring your answers using the STAR (Situation, Task, Action, Result) method, particularly in HR situations to exhibit problem-solving confidence.",
        communicationScore: 84,
        confidenceScore: 78
      };
    }

    const record = await prisma.interviewRecord.create({
      data: {
        studentId,
        jobTitle: jobTitle || "Software Engineer",
        questions: JSON.stringify(questions),
        answers: JSON.stringify(answers),
        feedback: evaluation.feedback,
        communicationScore: evaluation.communicationScore,
        confidenceScore: evaluation.confidenceScore
      }
    });

    res.status(200).json({
      record: {
        ...record,
        questions: JSON.parse(record.questions),
        answers: JSON.parse(record.answers)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 4. AI Career Recommendation
const recommendCareer = async (req, res, next) => {
  try {
    const studentId = req.user.profileId;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { department: true }
    });

    const marks = await prisma.mark.findMany({
      where: { studentId },
      include: { subject: true }
    });

    const studentProfile = {
      department: student.department.name,
      semester: student.currentSemester,
      academicMarks: marks.map(m => ({ subject: m.subject.name, score: m.marksObtained, max: m.maxMarks }))
    };

    let recommendation = null;

    if (openai) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Provide career advice. Return JSON format only with fields: careerPaths (array of recommended paths), learningRoadmap (array of roadmap steps), jobSuggestions (array of job titles).'
          },
          {
            role: 'user',
            content: `Recommend career paths for student: ${JSON.stringify(studentProfile)}`
          }
        ],
        response_format: { type: "json_object" }
      });

      recommendation = JSON.parse(response.choices[0].message.content);
    } else {
      recommendation = {
        careerPaths: [
          "Full Stack Developer (Web & Mobile)",
          "DevOps Cloud Engineer",
          "Database Administrator / Data Engineer"
        ],
        learningRoadmap: [
          "Master JavaScript/TypeScript and Web fundamentals",
          "Learn backend web frameworks like Node.js + Express and database systems like PostgreSQL",
          "Explore cloud services (AWS or GCP) and Docker deployment containers",
          "Begin practicing Data Structures and Algorithms on platforms like LeetCode"
        ],
        jobSuggestions: [
          "Junior Full Stack Engineer",
          "Associate DevOps Architect",
          "Software Analyst"
        ]
      };
    }

    res.status(200).json({ recommendation });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeResume,
  startInterview,
  submitInterview,
  recommendCareer
};
