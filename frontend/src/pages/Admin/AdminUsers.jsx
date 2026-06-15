import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { UserPlus, Search, Edit2, Trash2, ShieldCheck, Mail, ShieldAlert } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('STUDENT'); // 'STUDENT' | 'FACULTY'

  // Modal Control
  const [showAddModal, setShowAddModal] = useState(false);
  const [isFacultyForm, setIsFacultyForm] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  
  // Student Specific
  const [registerNumber, setRegisterNumber] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [dob, setDob] = useState('');
  const [admissionYear, setAdmissionYear] = useState('2026');
  const [currentSemester, setCurrentSemester] = useState('1');
  const [currentSection, setCurrentSection] = useState('A');

  // Faculty Specific
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('Assistant Professor');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsersAndDepartments();
  }, [roleFilter]);

  const fetchUsersAndDepartments = async () => {
    setLoading(true);
    try {
      const usersResponse = await api.get(`/admin/users?role=${roleFilter}`);
      const deptsResponse = await api.get('/admin/departments');
      setUsers(usersResponse.data.users);
      setDepartments(deptsResponse.data.departments);
    } catch (err) {
      alert('Failed to load user directories.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user profile?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      alert('User deleted successfully!');
      fetchUsersAndDepartments();
    } catch (err) {
      alert('Deletion failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // In local sqlite bypass mode, we use mock firebaseUid
    const mockFirebaseUid = `mock-uid-${Math.floor(Math.random() * 100000)}`;
    let payload = {};

    if (isFacultyForm) {
      payload = {
        email,
        firebaseUid: mockFirebaseUid,
        employeeId,
        name,
        designation,
        phone,
        address,
        departmentId
      };
    } else {
      payload = {
        email,
        firebaseUid: mockFirebaseUid,
        registerNumber,
        rollNumber,
        name,
        dob,
        phone,
        address,
        admissionYear,
        currentSemester,
        currentSection,
        departmentId
      };
    }

    const endpoint = isFacultyForm ? '/admin/users/faculty' : '/admin/users/student';

    try {
      await api.post(endpoint, payload);
      alert('User registered successfully!');
      setShowAddModal(false);
      resetForm();
      fetchUsersAndDepartments();
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setName('');
    setPhone('');
    setAddress('');
    setDepartmentId('');
    setRegisterNumber('');
    setRollNumber('');
    setDob('');
    setEmployeeId('');
    setDesignation('Assistant Professor');
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Campus Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Manage active administrative, faculty, and student user accounts.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsFacultyForm(roleFilter === 'FACULTY');
            setShowAddModal(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-indigo-500 hover:from-red-500 hover:to-indigo-400 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-lg shadow-red-500/10 active:scale-[0.98] transition-all"
        >
          <UserPlus className="h-4 w-4" />
          Add User Account
        </button>
      </div>

      {/* Role Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setRoleFilter('STUDENT')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            roleFilter === 'STUDENT' 
              ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Students Registry
        </button>
        <button
          onClick={() => setRoleFilter('FACULTY')}
          className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all ${
            roleFilter === 'FACULTY' 
              ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          Faculty Directory
        </button>
      </div>

      {/* Table list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-slate-500 py-6 text-xs">No users registered in this category.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3.5 pl-2">Roll / Employee ID</th>
                  <th className="pb-3.5">Name</th>
                  <th className="pb-3.5">Email</th>
                  <th className="pb-3.5">Department</th>
                  <th className="pb-3.5">{roleFilter === 'STUDENT' ? 'Semester' : 'Designation'}</th>
                  <th className="pb-3.5 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {users.map((item) => {
                  const profile = roleFilter === 'STUDENT' ? item.student : item.faculty;
                  if (!profile) return null;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 pl-2">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono font-bold">
                          {roleFilter === 'STUDENT' ? profile.rollNumber : profile.employeeId}
                        </span>
                      </td>
                      <td className="py-3.5 font-semibold text-slate-850 dark:text-slate-200">{profile.name}</td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-450">{item.email}</td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-450">{profile.department.code}</td>
                      <td className="py-3.5 text-slate-500 dark:text-slate-450">
                        {roleFilter === 'STUDENT' ? `Semester ${profile.currentSemester} (Sec ${profile.currentSection})` : profile.designation}
                      </td>
                      <td className="py-3.5 text-right pr-2 space-x-2">
                        <button
                          onClick={() => handleDeleteUser(item.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD USER MODAL PANEL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-black mb-4 text-slate-800 dark:text-white">
              Create New {isFacultyForm ? 'Faculty Profile' : 'Student Profile'}
            </h3>

            {/* Toggle form inside modal */}
            <div className="flex gap-2 mb-4 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => { resetForm(); setIsFacultyForm(false); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${!isFacultyForm ? 'bg-white dark:bg-slate-900 shadow text-primary-500' : 'text-slate-400'}`}
              >
                Student Form
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setIsFacultyForm(true); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${isFacultyForm ? 'bg-white dark:bg-slate-900 shadow text-primary-500' : 'text-slate-400'}`}
              >
                Faculty Form
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Department</label>
                  <select
                    required
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none"
                  >
                    <option value="">-- Choose Dept --</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Address</label>
                  <textarea
                    rows="2"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter residence address"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none resize-none"
                  />
                </div>

                {isFacultyForm ? (
                  /* Faculty Fields */
                  <>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Employee ID</label>
                      <input
                        type="text"
                        required
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        placeholder="EMP102"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Designation</label>
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="Assistant Professor"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  /* Student Fields */
                  <>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Register Number</label>
                      <input
                        type="text"
                        required
                        value={registerNumber}
                        onChange={(e) => setRegisterNumber(e.target.value)}
                        placeholder="REG2026002"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Roll Number</label>
                      <input
                        type="text"
                        required
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="26CSE002"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Date of Birth</label>
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Admission Year</label>
                      <input
                        type="number"
                        required
                        value={admissionYear}
                        onChange={(e) => setAdmissionYear(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Current Semester</label>
                      <select
                        value={currentSemester}
                        onChange={(e) => setCurrentSemester(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none"
                      >
                        {[1,2,3,4,5,6,7,8].map(s => (
                          <option key={s} value={s}>Semester {s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Section</label>
                      <input
                        type="text"
                        required
                        value={currentSection}
                        onChange={(e) => setCurrentSection(e.target.value)}
                        placeholder="A"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-primary-500/10"
                >
                  {saving ? 'Registering...' : 'Register User'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
