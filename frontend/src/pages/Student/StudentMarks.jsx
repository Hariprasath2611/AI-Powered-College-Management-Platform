import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Award, GraduationCap, TrendingUp, HelpCircle } from 'lucide-react';

const StudentMarks = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await api.get('/student/marks');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch marks logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 max-w-lg mx-auto text-center mt-10">
        {error || 'No marks statistics available.'}
      </div>
    );
  }

  const { marksBySemester, semGpas, cgpa } = data;

  const getGradeLetter = (gradePoint) => {
    if (gradePoint === 10) return { l: 'S', c: 'text-purple-500 bg-purple-500/10 border-purple-500/20' };
    if (gradePoint === 9) return { l: 'A', c: 'text-green-500 bg-green-500/10 border-green-500/20' };
    if (gradePoint === 8) return { l: 'B', c: 'text-primary-500 bg-primary-500/10 border-primary-500/20' };
    if (gradePoint === 7) return { l: 'C', c: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    if (gradePoint === 6) return { l: 'D', c: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
    return { l: 'F', c: 'text-red-500 bg-red-500/10 border-red-500/20' };
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Academic Grade Sheet</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Verify your scores in Internal assessment sessions and end-semester examinations.</p>
        </div>
      </div>

      {/* Analytics Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-primary-500/15 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-200">Cumulative CGPA</span>
            <h2 className="text-4xl font-black">{cgpa}</h2>
            <p className="text-xs text-primary-100">Weighted average across all semesters</p>
          </div>
          <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-white">
            <GraduationCap className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Semesters list */}
      <div className="space-y-8">
        {Object.keys(marksBySemester).length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border rounded-3xl text-slate-500">
            No exam marks logged yet in this semester profile.
          </div>
        ) : (
          Object.keys(marksBySemester).map((sem) => (
            <div 
              key={sem}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Semester {sem} Grades</h3>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Exam Results</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Semester SGPA</span>
                  <span className="text-lg font-black text-primary-600 dark:text-primary-400">{semGpas[sem] || 'N/A'}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3 pl-2">Subject Code</th>
                      <th className="pb-3">Subject Title</th>
                      <th className="pb-3">Credits</th>
                      <th className="pb-3">Exam Category</th>
                      <th className="pb-3">Marks Obtained</th>
                      <th className="pb-3 text-right pr-2">Letter Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {marksBySemester[sem].map((mark) => {
                      const badge = getGradeLetter(mark.gradePoint);
                      return (
                        <tr key={mark.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 pl-2">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono font-bold">
                              {mark.subjectCode}
                            </span>
                          </td>
                          <td className="py-3.5 font-medium text-slate-800 dark:text-slate-200">{mark.subjectName}</td>
                          <td className="py-3.5 text-slate-500 dark:text-slate-400">{mark.credits} Points</td>
                          <td className="py-3.5">
                            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                              {mark.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <strong className="text-slate-800 dark:text-slate-200">{mark.marksObtained}</strong>
                            <span className="text-slate-400 text-xs"> / {mark.maxMarks}</span>
                          </td>
                          <td className="py-3.5 text-right pr-2">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${badge.c}`}>
                              {badge.l}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentMarks;
