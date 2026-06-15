import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { User, Mail, Phone, MapPin, Award, BookOpen, Save, FileUp, ShieldCheck } from 'lucide-react';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/student/profile');
      const data = response.data.profile;
      setProfile(data);
      setPhone(data.phone || '');
      setAddress(data.address || '');
      setResumeUrl(data.resumeUrl || '');
    } catch (err) {
      setError('Failed to fetch profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/student/profile', {
        phone,
        address,
        resumeUrl
      });
      alert('Profile details updated successfully!');
      fetchProfile();
    } catch (err) {
      alert('Failed to update details: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 max-w-lg mx-auto text-center mt-10">
        {error || 'No profile records available.'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Personal Academic Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Verify your academic records and manage your contact settings and resume attachments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar & Core Details */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-lg shadow-primary-500/15">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white">{profile.name}</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded mt-1 inline-block">
              {profile.rollNumber}
            </span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-left space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Mail className="h-4 w-4 text-primary-500" />
              <span className="truncate">{profile.user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <BookOpen className="h-4 w-4 text-primary-500" />
              <span>Dept: {profile.department.name}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Award className="h-4 w-4 text-primary-500" />
              <span>Semester {profile.currentSemester} (Section {profile.currentSection})</span>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Form & Resume */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-6 transition-colors">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="h-5 w-5 text-green-500" /> Edit Contact Configurations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Mobile Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Register Number</label>
                <input
                  type="text"
                  disabled
                  value={profile.registerNumber}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Postal Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                  <textarea
                    rows="3"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Hostel Block A, Room 302, Campus."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Resume Link</label>
                <div className="relative">
                  <FileUp className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
                  <input
                    type="text"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="Paste Cloudinary PDF resume link"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-850 dark:text-slate-200 text-xs focus:outline-none focus:border-primary-500"
                  />
                </div>
                {resumeUrl && (
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    Currently linked:{' '}
                    <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline">
                      {resumeUrl}
                    </a>
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-primary-500/10 transition-all active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;
