import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { BookOpen, PlusCircle, CalendarPlus, UserCheck, Users } from 'lucide-react';

const AdminAcademics = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subject Form State
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subSemester, setSubSemester] = useState('1');
  const [subCredits, setSubCredits] = useState('3');
  const [subDeptId, setSubDeptId] = useState('');
  const [savingSubject, setSavingSubject] = useState(false);

  // Allocation Form State
  const [allocFacultyId, setAllocFacultyId] = useState('');
  const [allocSubjectId, setAllocSubjectId] = useState('');
  const [allocSection, setAllocSection] = useState('A');
  const [allocYear, setAllocYear] = useState('2025-2026');
  const [savingAllocation, setSavingAllocation] = useState(false);

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    setLoading(true);
    try {
      const subResponse = await api.get('/admin/subjects');
      const deptResponse = await api.get('/admin/departments');
      const facultyResponse = await api.get('/admin/users?role=FACULTY');
      
      setSubjects(subResponse.data.subjects);
      setDepartments(deptResponse.data.departments);
      setFaculty(facultyResponse.data.users);
    } catch (err) {
      alert('Failed to load academic records.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setSavingSubject(true);
    try {
      await api.post('/admin/subjects', {
        name: subName,
        code: subCode.toUpperCase(),
        departmentId: subDeptId,
        semester: subSemester,
        credits: subCredits
      });
      alert('Subject created successfully!');
      setSubName('');
      setSubCode('');
      fetchAcademicData();
    } catch (err) {
      alert('Failed to create subject: ' + (err.response?.data?.error || err.message));
    } finally {
      setSavingSubject(false);
    }
  };

  const handleCreateAllocation = async (e) => {
    e.preventDefault();
    setSavingAllocation(true);
    try {
      // Endpoint located in faculty controller context
      await api.post('/faculty/assign-subject', {
        facultyId: allocFacultyId,
        subjectId: allocSubjectId,
        section: allocSection,
        academicYear: allocYear
      });
      alert('Subject assigned to faculty successfully!');
      setAllocFacultyId('');
      setAllocSubjectId('');
    } catch (err) {
      alert('Failed to assign subject: ' + (err.response?.data?.error || err.message));
    } finally {
      setSavingAllocation(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Curriculum & Class Allocations</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Define syllabus structures, subjects codes, and assign classes to faculty members.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CREATE SUBJECT */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleCreateSubject} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 transition-colors">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
              <PlusCircle className="h-5 w-5 text-primary-600" /> Create Subject
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Subject Code</label>
              <input
                type="text"
                required
                value={subCode}
                onChange={(e) => setSubCode(e.target.value)}
                placeholder="e.g. CS601"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 dark:text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Subject Name</label>
              <input
                type="text"
                required
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="e.g. Computer Networks"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 dark:text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Department</label>
              <select
                required
                value={subDeptId}
                onChange={(e) => setSubDeptId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-250 text-xs focus:outline-none"
              >
                <option value="">-- Choose Dept --</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Semester</label>
                <select
                  value={subSemester}
                  onChange={(e) => setSubSemester(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-250 text-xs focus:outline-none"
                >
                  {[1,2,3,4,5,6,7,8].map(s => (
                    <option key={s} value={s}>Sem {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Credits</label>
                <select
                  value={subCredits}
                  onChange={(e) => setSubCredits(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-250 text-xs focus:outline-none"
                >
                  {[1,2,3,4,5].map(c => (
                    <option key={c} value={c}>{c} Credits</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSubject}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              {savingSubject ? 'Creating...' : 'Create Subject'}
            </button>
          </form>
        </div>

        {/* ALLOCATE SUBJECT TO FACULTY */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleCreateAllocation} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 transition-colors">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
              <UserCheck className="h-5 w-5 text-indigo-500" /> Allocate Teacher
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Select Faculty</label>
              <select
                required
                value={allocFacultyId}
                onChange={(e) => setAllocFacultyId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-250 text-xs focus:outline-none"
              >
                <option value="">-- Choose Faculty --</option>
                {faculty.map(f => (
                  <option key={f.faculty?.id} value={f.faculty?.id}>{f.faculty?.name} ({f.faculty?.employeeId})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Select Subject</label>
              <select
                required
                value={allocSubjectId}
                onChange={(e) => setAllocSubjectId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-250 text-xs focus:outline-none"
              >
                <option value="">-- Choose Subject --</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Section</label>
                <input
                  type="text"
                  required
                  value={allocSection}
                  onChange={(e) => setAllocSection(e.target.value)}
                  placeholder="A"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Academic Year</label>
                <input
                  type="text"
                  required
                  value={allocYear}
                  onChange={(e) => setAllocYear(e.target.value)}
                  placeholder="2025-2026"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 text-xs focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingAllocation}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              {savingAllocation ? 'Allocating...' : 'Assign Class Section'}
            </button>
          </form>
        </div>

        {/* SUBJECTS DIRECTORY LIST */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Syllabus Subjects Directory</h3>

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
            </div>
          ) : subjects.length === 0 ? (
            <p className="text-slate-500 text-xs">No subjects created yet.</p>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {subjects.map(s => (
                <div 
                  key={s.id}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between transition-all"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{s.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Code: {s.code} | Sem {s.semester}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-primary-500">
                    {s.credits} Credits
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminAcademics;
