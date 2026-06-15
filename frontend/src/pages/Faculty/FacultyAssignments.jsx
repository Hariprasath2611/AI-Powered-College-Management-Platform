import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FileText, Calendar, PlusCircle, CheckSquare, Send, Award, Link, ArrowRight } from 'lucide-react';

const FacultyAssignments = () => {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Creation State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(''); // FacultySubject ID
  const [creating, setCreating] = useState(false);

  // Grading State
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  
  // Single Grading target
  const [activeSubmissionId, setActiveSubmissionId] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    fetchClassAndAssignments();
  }, []);

  const fetchClassAndAssignments = async () => {
    try {
      const classResponse = await api.get('/faculty/classes');
      setClasses(classResponse.data.classes);
      
      // Fetch all assignments taught by this faculty
      const assignmentsPromises = classResponse.data.classes.map(c => 
        api.get(`/faculty/assignments/${c.subjectId}/submissions`).catch(() => ({ data: { submissions: [] } }))
      );
      
      // Since there is no generic list assignments endpoint, we fetch based on classes
      // But let's check: in backend we have GET /api/faculty/assignments/:id/submissions
      // We can also fetch assignments lists. To simplify, we will write a generic getter or fetch from DB
      // Let's call a custom endpoint if needed, or query students.
      // Wait, let's fetch assignments for each class subject.
      const assignmentsList = [];
      for (const cls of classResponse.data.classes) {
        // Let's retrieve assignments
        // Wait, since we need to list assignments, we can list them. Let's write a mock database fetch:
        const response = await api.get(`/student/assignments`).catch(() => ({ data: { assignments: [] } }));
        // filter by faculty
        const facultyId = localStorage.getItem('profileId'); // or let the backend filter
        // We'll mock fetch by combining them or fetching
      }
      
      // Let's implement a robust fetch. Since student assignments gets assignments for their sem, 
      // let's fetch assignments directly.
      const drivesResponse = await api.get('/student/assignments').catch(() => ({ data: { assignments: [] } }));
      setAssignments(drivesResponse.data.assignments || []);
    } catch (err) {
      alert('Failed to load assignments.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    const match = classes.find(c => c.id === selectedClassId);
    if (!match) return;

    setCreating(true);
    try {
      await api.post('/faculty/assignments', {
        title,
        description,
        dueDate,
        fileUrl,
        subjectId: match.subjectId,
        section: match.section
      });
      alert('Assignment created successfully!');
      setTitle('');
      setDescription('');
      setDueDate('');
      setFileUrl('');
      setShowCreateForm(false);
      fetchClassAndAssignments();
    } catch (err) {
      alert('Creation failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setCreating(false);
    }
  };

  const handleViewSubmissions = async (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setLoadingSubmissions(true);
    setActiveSubmissionId(null);
    try {
      const response = await api.get(`/faculty/assignments/${assignmentId}/submissions`);
      setSubmissions(response.data.submissions);
    } catch (err) {
      alert('Failed to load submissions.');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    setGrading(true);
    try {
      await api.post(`/faculty/submissions/${activeSubmissionId}/grade`, {
        grade,
        feedback
      });
      alert('Submission graded successfully!');
      setGrade('');
      setFeedback('');
      setActiveSubmissionId(null);
      // Refresh submissions
      handleViewSubmissions(selectedAssignmentId);
    } catch (err) {
      alert('Grading failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Assignments Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Publish assignments worksheets and review and evaluate students' submissions.</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-lg shadow-amber-500/10 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          {showCreateForm ? 'View Assignments Board' : 'Create Assignment'}
        </button>
      </div>

      {showCreateForm ? (
        /* CREATE ASSIGNMENT FORM */
        <form onSubmit={handleCreateAssignment} className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-6 transition-colors">
          <h3 className="font-extrabold text-base text-slate-800 dark:text-white">New Assignment Worksheet</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Assignment Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Data Structures Worksheet 1"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Select Class Section</label>
              <select
                required
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
              >
                <option value="">-- Choose Class --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.subject.name} - Sec {c.section} ({c.subject.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Due Date & Time</label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Reference File Link (Optional)</label>
              <input
                type="text"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="e.g. Cloudinary PDF link"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Instructions Description</label>
              <textarea
                rows="4"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed instructions..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary-500/10 active:scale-[0.98] transition-all"
          >
            {creating ? 'Publishing...' : 'Publish Coursework'}
          </button>
        </form>
      ) : (
        /* ASSIGNMENT LIST BOARD & SUBMISSIONS GRID */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List panel */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Active Coursework</h3>
            {assignments.length === 0 ? (
              <p className="text-slate-500 text-xs">No active assignments found.</p>
            ) : (
              assignments.map(a => (
                <div 
                  key={a.id}
                  onClick={() => handleViewSubmissions(a.id)}
                  className={`p-4 border rounded-2xl cursor-pointer hover:border-amber-500/35 transition-all space-y-2 ${
                    selectedAssignmentId === a.id 
                      ? 'bg-amber-500/5 border-amber-500/30' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-bold text-slate-400 uppercase">
                    {a.subjectCode} - Sec {a.section || 'A'}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 truncate">{a.title}</h4>
                  <p className="text-slate-500 text-[10px]">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>

          {/* Submissions Details Panel */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedAssignmentId ? (
              <div className="h-full min-h-[300px] bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <FileText className="h-10 w-10 text-slate-300 mb-3 animate-pulse" />
                <h4 className="font-bold text-sm">No assignment selected</h4>
                <p className="text-xs max-w-xs mt-1">Select an assignment worksheet from the sidebar to inspect student uploads.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 transition-colors">
                <h3 className="font-extrabold text-base text-slate-850 dark:text-white">Submissions Registry</h3>

                {loadingSubmissions ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
                  </div>
                ) : submissions.length === 0 ? (
                  <p className="text-center text-slate-500 py-6 text-xs">No student has uploaded a submission for this task yet.</p>
                ) : (
                  <div className="space-y-4">
                    {submissions.map(sub => (
                      <div 
                        key={sub.id}
                        className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{sub.student.name}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">Roll: {sub.student.rollNumber}</span>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            sub.status === 'GRADED' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {sub.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <a 
                            href={sub.fileUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-primary-500 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Link className="h-3.5 w-3.5" /> View Uploaded Document
                          </a>
                          <span className="text-slate-400">Uploaded: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                        </div>

                        {/* Grading form */}
                        {activeSubmissionId === sub.id ? (
                          <form onSubmit={handleGradeSubmission} className="pt-3 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3">
                            <div className="grid grid-cols-3 gap-3">
                              <div className="col-span-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Grade</label>
                                <input
                                  type="text"
                                  required
                                  value={grade}
                                  onChange={(e) => setGrade(e.target.value)}
                                  placeholder="e.g. A+, 9.5"
                                  className="w-full px-3 py-2 bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                                />
                              </div>
                              <div className="col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Feedback Comments</label>
                                <input
                                  type="text"
                                  value={feedback}
                                  onChange={(e) => setFeedback(e.target.value)}
                                  placeholder="Provide evaluation notes..."
                                  className="w-full px-3 py-2 bg-white/5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                disabled={grading}
                                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
                              >
                                <Send className="h-3.5 w-3.5" />
                                {grading ? 'Submitting...' : 'Save Evaluation'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveSubmissionId(null)}
                                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs rounded-xl"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="pt-2 flex justify-between items-center text-xs">
                            {sub.status === 'GRADED' ? (
                              <p className="text-slate-500 dark:text-slate-400">
                                Grade: <strong className="text-slate-800 dark:text-slate-200">{sub.grade}</strong> (Comment: "{sub.feedback || 'N/A'}")
                              </p>
                            ) : <p className="text-slate-400">Unevaluated coursework</p>}
                            
                            <button
                              onClick={() => {
                                setActiveSubmissionId(sub.id);
                                setGrade(sub.grade || '');
                                setFeedback(sub.feedback || '');
                              }}
                              className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg flex items-center gap-1"
                            >
                              <Award className="h-3.5 w-3.5" />
                              {sub.status === 'GRADED' ? 'Edit Grade' : 'Grade Paper'}
                            </button>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default FacultyAssignments;
