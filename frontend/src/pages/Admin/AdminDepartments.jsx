import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Landmark, PlusCircle, Bookmark, Users, GraduationCap } from 'lucide-react';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/departments');
      setDepartments(response.data.departments);
    } catch (err) {
      alert('Failed to load departments.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!name || !code) return;

    setSaving(true);
    try {
      await api.post('/admin/departments', {
        name,
        code: code.toUpperCase()
      });
      alert('Department created successfully!');
      setName('');
      setCode('');
      fetchDepartments();
    } catch (err) {
      alert('Failed to create department: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Academic Departments</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Configure college branches, faculties, and track enrollment stats.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Creation Form Column */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4">
          <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
            <PlusCircle className="h-5 w-5 text-primary-600" /> New Department
          </h3>
          
          <form onSubmit={handleCreateDepartment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Branch Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CSE"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-200 text-xs focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Department Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-200 text-xs focus:outline-none focus:border-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary-500/10 transition-all"
            >
              {saving ? 'Creating...' : 'Register Department'}
            </button>
          </form>
        </div>

        {/* Display Grid Column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Active Branches</h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
            </div>
          ) : departments.length === 0 ? (
            <p className="text-slate-550 text-xs">No departments registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departments.map((dept) => (
                <div 
                  key={dept.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold text-xs">
                      {dept.code}
                    </span>
                    <Landmark className="h-5 w-5 text-primary-500" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">{dept.name}</h4>
                  
                  <div className="flex gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold uppercase">
                    <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> {dept._count.students} Students</span>
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {dept._count.faculty} Teachers</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDepartments;
