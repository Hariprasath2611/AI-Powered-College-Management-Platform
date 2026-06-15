import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Briefcase, PlusCircle, Landmark, Calendar, Award, BookOpen } from 'lucide-react';

const AdminPlacements = () => {
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Company Form State
  const [compName, setCompName] = useState('');
  const [compWebsite, setCompWebsite] = useState('');
  const [compIndustry, setCompIndustry] = useState('');
  const [compEmail, setCompEmail] = useState('');
  const [compDesc, setCompDesc] = useState('');
  const [savingCompany, setSavingCompany] = useState(false);

  // Drive Form State
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [driveDesc, setDriveDesc] = useState('');
  const [driveDate, setDriveDate] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [salary, setSalary] = useState('');
  const [savingDrive, setSavingDrive] = useState(false);

  useEffect(() => {
    fetchPlacementData();
  }, []);

  const fetchPlacementData = async () => {
    setLoading(true);
    try {
      const compResponse = await api.get('/placement/companies');
      const drivesResponse = await api.get('/placement/drives');
      setCompanies(compResponse.data.companies);
      setDrives(drivesResponse.data.drives);
    } catch (err) {
      alert('Failed to load placement data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    setSavingCompany(true);
    try {
      await api.post('/placement/companies', {
        name: compName,
        website: compWebsite,
        industry: compIndustry,
        contactEmail: compEmail,
        description: compDesc
      });
      alert('Company profile created successfully!');
      setCompName('');
      setCompWebsite('');
      setCompIndustry('');
      setCompEmail('');
      setCompDesc('');
      fetchPlacementData();
    } catch (err) {
      alert('Failed to create company: ' + (err.response?.data?.error || err.message));
    } finally {
      setSavingCompany(false);
    }
  };

  const handleScheduleDrive = async (e) => {
    e.preventDefault();
    setSavingDrive(true);
    try {
      await api.post('/placement/drives', {
        companyId: selectedCompanyId,
        jobTitle,
        description: driveDesc,
        date: driveDate,
        eligibilityCriteria: eligibility,
        salaryPackage: salary
      });
      alert('Placement drive scheduled successfully!');
      setJobTitle('');
      setDriveDesc('');
      setDriveDate('');
      setEligibility('');
      setSalary('');
      fetchPlacementData();
    } catch (err) {
      alert('Failed to schedule drive: ' + (err.response?.data?.error || err.message));
    } finally {
      setSavingDrive(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Recruitment & Job Drives Scheduler</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Register hiring partners and coordinate scheduled corporate placement drives.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD COMPANY */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleCreateCompany} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 transition-colors">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
              <Landmark className="h-5 w-5 text-primary-600" /> Add Employer
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                required
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                placeholder="e.g. Google"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 dark:text-slate-200 text-xs focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Website Link</label>
              <input
                type="url"
                value={compWebsite}
                onChange={(e) => setCompWebsite(e.target.value)}
                placeholder="https://careers.google.com"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 dark:text-slate-200 text-xs focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Industry</label>
                <input
                  type="text"
                  value={compIndustry}
                  onChange={(e) => setCompIndustry(e.target.value)}
                  placeholder="Technology"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 text-xs focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Contact Email</label>
                <input
                  type="email"
                  required
                  value={compEmail}
                  onChange={(e) => setCompEmail(e.target.value)}
                  placeholder="hr@google.com"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 text-xs focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Company Description</label>
              <textarea
                rows="2"
                value={compDesc}
                onChange={(e) => setCompDesc(e.target.value)}
                placeholder="Brief summary..."
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-200 text-xs focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingCompany}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              {savingCompany ? 'Registering...' : 'Register Company'}
            </button>
          </form>
        </div>

        {/* SCHEDULE DRIVE */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleScheduleDrive} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 transition-colors">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
              <PlusCircle className="h-5 w-5 text-indigo-500" /> Schedule Drive
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Select Company</label>
              <select
                required
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-250 text-xs focus:outline-none"
              >
                <option value="">-- Choose Company --</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Job Title</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Salary CTC Package</label>
                <input
                  type="text"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. 12 LPA"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Drive Date</label>
                <input
                  type="date"
                  required
                  value={driveDate}
                  onChange={(e) => setDriveDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Eligibility Criteria</label>
              <input
                type="text"
                required
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g. CGPA > 8.0, No standing arrears"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Job Description</label>
              <textarea
                rows="2"
                required
                value={driveDesc}
                onChange={(e) => setDriveDesc(e.target.value)}
                placeholder="Provide job details..."
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 text-xs focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingDrive}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg"
            >
              {savingDrive ? 'Scheduling...' : 'Schedule Job Drive'}
            </button>
          </form>
        </div>

        {/* SCHEDULED DRIVES DIRECTORY */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Scheduled Job Drives</h3>

          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
            </div>
          ) : drives.length === 0 ? (
            <p className="text-slate-500 text-xs">No placement drives scheduled yet.</p>
          ) : (
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {drives.map(d => (
                <div 
                  key={d.id}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 transition-colors"
                >
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-bold text-slate-400 uppercase">
                    {d.company.name}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200">{d.jobTitle}</h4>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Date: {new Date(d.date).toLocaleDateString()}</span>
                    <strong className="text-primary-500">{d.salaryPackage}</strong>
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

export default AdminPlacements;
