import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { Award, Sparkles, Users, Save, BarChart3 } from 'lucide-react';

const FacultyMarks = () => {
  const [searchParams] = useSearchParams();
  const [classes, setClasses] = useState([]);
  
  // Selections
  const [selectedClassId, setSelectedClassId] = useState('');
  const [examType, setExamType] = useState('INTERNAL_1');
  const [maxMarks, setMaxMarks] = useState('100');

  // Students & Grades
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({}); // { [studentId]: marksObtained }
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  // Analytics State
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/faculty/classes');
      setClasses(response.data.classes);

      const urlSubjectId = searchParams.get('subjectId');
      const urlSection = searchParams.get('section');
      if (urlSubjectId && urlSection && response.data.classes.length > 0) {
        const match = response.data.classes.find(
          c => c.subjectId === urlSubjectId && c.section === urlSection
        );
        if (match) {
          setSelectedClassId(match.id);
          loadStudentsList(match.subjectId, match.section);
        }
      }
    } catch (err) {
      alert('Failed to load assigned classes.');
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleClassChange = (classId) => {
    setSelectedClassId(classId);
    setStudents([]);
    setReport(null);
    if (!classId) return;

    const match = classes.find(c => c.id === classId);
    if (match) {
      loadStudentsList(match.subjectId, match.section);
    }
  };

  const loadStudentsList = async (subjectId, section) => {
    setLoadingStudents(true);
    try {
      const response = await api.get(`/faculty/students?subjectId=${subjectId}&section=${section}`);
      setStudents(response.data.students);

      // Pre-fill with empty values
      const initialMarks = {};
      response.data.students.forEach(s => {
        initialMarks[s.id] = '';
      });
      setMarks(initialMarks);
    } catch (err) {
      alert('Failed to load students list.');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleMarksChange = (studentId, value) => {
    setMarks({
      ...marks,
      [studentId]: value
    });
  };

  const handleSaveMarks = async () => {
    const selectedClass = classes.find(c => c.id === selectedClassId);
    if (!selectedClass) return;

    // Validate inputs
    const marksList = [];
    for (const student of students) {
      const score = marks[student.id];
      if (score === '') {
        alert(`Please input marks for ${student.name}`);
        return;
      }
      if (parseFloat(score) > parseFloat(maxMarks) || parseFloat(score) < 0) {
        alert(`Marks for ${student.name} must be between 0 and ${maxMarks}`);
        return;
      }
      marksList.push({
        studentId: student.id,
        marksObtained: parseFloat(score),
        maxMarks: parseFloat(maxMarks)
      });
    }

    setSaving(true);
    try {
      await api.post('/faculty/marks', {
        subjectId: selectedClass.subjectId,
        type: examType,
        marks: marksList
      });
      alert('Exam marks recorded successfully!');
      fetchAnalyticsReport(); // Auto-update report
    } catch (err) {
      alert('Failed to save marks: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const fetchAnalyticsReport = async () => {
    const selectedClass = classes.find(c => c.id === selectedClassId);
    if (!selectedClass) return;

    setLoadingReport(true);
    try {
      const response = await api.get(
        `/faculty/class-report?subjectId=${selectedClass.subjectId}&type=${examType}&section=${selectedClass.section}`
      );
      setReport(response.data.stats);
    } catch (err) {
      setReport(null);
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Grades & Marks Ledger</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Record student exam marks and compile class performance reports.</p>
      </div>

      {/* Filter Options */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Select Class</label>
            <select
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-250 text-xs focus:outline-none"
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
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Exam Category</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-250 text-xs focus:outline-none"
            >
              <option value="INTERNAL_1">Internal Test 1</option>
              <option value="INTERNAL_2">Internal Test 2</option>
              <option value="INTERNAL_3">Internal Test 3</option>
              <option value="SEMESTER">Semester Finals</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Max Marks</label>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-250 text-xs focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSaveMarks}
              disabled={saving || students.length === 0}
              className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-lg shadow-primary-500/10 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save Marks
            </button>
            <button
              onClick={fetchAnalyticsReport}
              disabled={students.length === 0}
              className="px-3 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              title="Get analytics reports"
            >
              <BarChart3 className="h-5 w-5" />
            </button>
          </div>

        </div>
      </div>

      {/* Analytics Report Widget */}
      {report && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-400 uppercase tracking-wider">
            <BarChart3 className="h-4.5 w-4.5 text-indigo-500" /> Class Performance Analytics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Class Average</span>
              <strong className="text-2xl font-black">{report.average} / {report.maxMarks}</strong>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Highest Score</span>
              <strong className="text-2xl font-black text-green-500">{report.highest}</strong>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lowest Score</span>
              <strong className="text-2xl font-black text-red-500">{report.lowest}</strong>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pass Percentage</span>
              <strong className="text-2xl font-black text-primary-500">{report.passPercentage}%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Students List for Marks entry */}
      {selectedClassId && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors">
          <h3 className="text-base font-extrabold mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Users className="h-5 w-5 text-amber-500" /> Students Grades Input Table ({students.length})
          </h3>

          {loadingStudents ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600" />
            </div>
          ) : students.length === 0 ? (
            <p className="text-center text-slate-500 py-6">No students found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Roll Number</th>
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Register Number</th>
                    <th className="pb-3 text-right pr-4">Marks Obtained (Out of {maxMarks})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 pl-2">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono font-bold">
                          {s.rollNumber}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{s.name}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{s.registerNumber}</td>
                      <td className="py-3 text-right pr-4">
                        <input
                          type="number"
                          required
                          value={marks[s.id]}
                          onChange={(e) => handleMarksChange(s.id, e.target.value)}
                          placeholder="0"
                          min="0"
                          max={maxMarks}
                          className="w-24 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs font-bold focus:outline-none focus:border-primary-500 inline-block"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default FacultyMarks;
