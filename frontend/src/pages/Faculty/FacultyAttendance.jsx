import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, CheckSquare, Users, Save, CheckCircle2 } from 'lucide-react';

const FacultyAttendance = () => {
  const [searchParams] = useSearchParams();
  const [classes, setClasses] = useState([]);
  
  // Selection States
  const [selectedClassId, setSelectedClassId] = useState(''); // FacultySubject ID
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [period, setPeriod] = useState('1');

  // Students & Logs States
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { [studentId]: 'PRESENT' | 'ABSENT' }
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/faculty/classes');
      setClasses(response.data.classes);
      
      // Auto-select if query params exist
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
      const studentsList = response.data.students;
      setStudents(studentsList);

      // Default all to PRESENT
      const initialAttendance = {};
      studentsList.forEach(s => {
        initialAttendance[s.id] = 'PRESENT';
      });
      setAttendance(initialAttendance);
    } catch (err) {
      alert('Failed to load students list.');
    } finally {
      setLoadingStudents(false);
    }
  };

  const toggleStatus = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    }));
  };

  const handleSelectAll = (status) => {
    const updated = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setAttendance(updated);
  };

  const handleSaveAttendance = async () => {
    if (students.length === 0) return;

    const selectedClass = classes.find(c => c.id === selectedClassId);
    if (!selectedClass) return;

    const payload = {
      date,
      period,
      subjectId: selectedClass.subjectId,
      students: students.map(s => ({
        studentId: s.id,
        status: attendance[s.id]
      }))
    };

    setSaving(true);
    try {
      await api.post('/faculty/attendance', payload);
      alert('Attendance saved successfully!');
    } catch (err) {
      alert('Failed to save attendance: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Attendance Register</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Record student session attendance and update daily records.</p>
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
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Session Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-250 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Session Hour (Period)</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-250 text-xs focus:outline-none"
            >
              {[1,2,3,4,5,6,7,8].map(h => (
                <option key={h} value={h}>Period {h}</option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={handleSaveAttendance}
              disabled={saving || students.length === 0}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary-500/10 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Submit Attendance'}
            </button>
          </div>

        </div>
      </div>

      {/* Student Checklist list */}
      {selectedClassId && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-500" /> Students Roll List ({students.length})
            </h3>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleSelectAll('PRESENT')}
                className="px-3.5 py-1.5 bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold rounded-lg"
              >
                Mark All Present
              </button>
              <button
                onClick={() => handleSelectAll('ABSENT')}
                className="px-3.5 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold rounded-lg"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {loadingStudents ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600" />
            </div>
          ) : students.length === 0 ? (
            <p className="text-center text-slate-500 py-6">No students found matching this criteria.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => {
                const isPresent = attendance[student.id] === 'PRESENT';
                return (
                  <div 
                    key={student.id}
                    onClick={() => toggleStatus(student.id)}
                    className={`p-4 border rounded-2xl cursor-pointer flex items-center justify-between transition-all select-none ${
                      isPresent 
                        ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/35' 
                        : 'bg-red-500/5 border-red-500/20 hover:border-red-500/35'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{student.name}</h4>
                      <p className="text-slate-400 font-mono text-[10px] mt-0.5">{student.rollNumber}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isPresent 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {attendance[student.id]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default FacultyAttendance;
