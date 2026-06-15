import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FileText, Calendar, Link, Send, CheckCircle2, AlertCircle, FileUp } from 'lucide-react';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitUrl, setSubmitUrl] = useState({}); // Stores URL text per assignment ID
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/student/assignments');
      setAssignments(response.data.assignments);
    } catch (err) {
      setError('Failed to fetch assignments.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, assignmentId) => {
    e.preventDefault();
    const fileUrl = submitUrl[assignmentId];
    if (!fileUrl) return;

    setSubmittingId(assignmentId);
    try {
      await api.post('/student/assignments/submit', {
        assignmentId,
        fileUrl
      });
      alert('Assignment submitted successfully!');
      fetchAssignments(); // Refresh status
    } catch (err) {
      alert('Submission failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmittingId(null);
    }
  };

  const handleUrlChange = (assignmentId, value) => {
    setSubmitUrl({
      ...submitUrl,
      [assignmentId]: value
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 max-w-lg mx-auto text-center mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Assignments Board</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Submit your papers and download reference documents assigned by faculty.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {assignments.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 border rounded-3xl text-slate-500">
            No assignments assigned to your section at this time.
          </div>
        ) : (
          assignments.map((task) => {
            const isOverdue = new Date(task.dueDate) < new Date() && task.status === 'PENDING';
            return (
              <div 
                key={task.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-[10px] font-bold rounded uppercase tracking-wider">
                        {task.subjectCode}
                      </span>
                      <h3 className="font-extrabold text-base mt-2 text-slate-800 dark:text-slate-200">{task.title}</h3>
                      <p className="text-slate-400 text-xs mt-0.5">Subject: {task.subjectName}</p>
                    </div>

                    {/* Status Badge */}
                    {task.status === 'GRADED' ? (
                      <span className="px-2.5 py-1 bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Graded: {task.submission.grade}
                      </span>
                    ) : task.status === 'SUBMITTED' ? (
                      <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Submitted
                      </span>
                    ) : isOverdue ? (
                      <span className="px-2.5 py-1 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Overdue
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Pending
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-4 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 mt-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> 
                      Due: {new Date(task.dueDate).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {task.fileUrl && (
                      <a 
                        href={task.fileUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary-500 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Link className="h-3.5 w-3.5" /> Download Materials
                      </a>
                    )}
                  </div>
                </div>

                {/* Submissions Section */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                  {task.status === 'GRADED' ? (
                    <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-green-500 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="h-4 w-4" /> Evaluated Grade
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 text-xs">
                        Grade Awarded: <strong className="text-sm">{task.submission.grade}</strong>
                      </p>
                      {task.submission.feedback && (
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                          Feedback: "{task.submission.feedback}"
                        </p>
                      )}
                    </div>
                  ) : task.status === 'SUBMITTED' ? (
                    <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl space-y-2">
                      <p className="text-slate-400 text-xs">
                        Submitted Attachment:{' '}
                        <a 
                          href={task.submission.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary-500 hover:underline truncate inline-block max-w-[200px] align-bottom ml-1 font-semibold"
                        >
                          View Document Link
                        </a>
                      </p>
                      
                      {/* Re-submit option */}
                      <form onSubmit={(e) => handleSubmit(e, task.id)} className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          value={submitUrl[task.id] || ''}
                          onChange={(e) => handleUrlChange(task.id, e.target.value)}
                          placeholder="Update document URL to resubmit"
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 dark:border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500"
                        />
                        <button
                          type="submit"
                          className="p-2 bg-primary-600 hover:bg-primary-500 rounded-xl text-white transition-all"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  ) : (
                    <form onSubmit={(e) => handleSubmit(e, task.id)} className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Submit Assignment</label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <FileUp className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            value={submitUrl[task.id] || ''}
                            onChange={(e) => handleUrlChange(task.id, e.target.value)}
                            placeholder="Enter PDF/DOC document link or file path"
                            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 dark:border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-primary-500"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submittingId === task.id}
                          className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-primary-500/10"
                        >
                          <Send className="h-3.5 w-3.5" />
                          {submittingId === task.id ? 'Submitting...' : 'Upload'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;
