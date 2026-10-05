import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Plus,
  X,
  Save,
  FileText,
  Upload
} from 'lucide-react';
import { User, Profile } from '../types';
import { api } from '../services/api';

interface ProfilePageProps {
  currentUser: User;
  onNavigate: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onNavigate }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Editable fields
  const [resumeText, setResumeText] = useState('');
  const [education, setEducation] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getProfile();
      setProfile(data);
      setResumeText(data.resume_text || '');
      setEducation(data.education || '');
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim() || !profile) return;
    if (!profile.skills.includes(newSkillInput.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkillInput.trim()]
      });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove)
    });
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await api.updateProfile({
        skills: profile.skills,
        resume_text: resumeText,
        education
      });
      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4"></div>
        <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner & Strength Meter */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Candidate Dossier & Resume Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentUser.name}
          </h1>
          <p className="mt-1 text-sm text-blue-100">
            {currentUser.degree} • {currentUser.college} (Graduating {currentUser.graduation_year})
          </p>
        </div>

        {/* Strength Meter */}
        <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0">
          <div className="text-4xl font-black text-white">{profile.profile_strength}%</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mt-0.5">
            Profile Strength
          </div>
          <div className="mt-2 h-1.5 w-32 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div
              style={{ width: `${profile.profile_strength}%` }}
              className="h-full bg-emerald-400 rounded-full"
            ></div>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes and resume text saved successfully!</span>
        </div>
      )}

      {/* Missing Skills for Target Role & Topic Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing Skills Card */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Missing Skills for {currentUser.preferred_role}
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Identified by comparing your resume text against hiring requirements for top technology employers:
          </p>
          <div className="space-y-2 pt-1">
            {profile.missing_skills.map((skill, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs font-medium text-amber-900"
              >
                <span>{skill}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Recommended
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Interview Topics */}
        <div className="bg-white rounded-3xl p-6 border border-blue-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-blue-100">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Recommended Topics to Practice</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Drills generated based on your profile gaps to maximize technical interview conversion:
          </p>
          <div className="space-y-2 pt-1">
            {profile.recommended_topics.map((topic, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs font-medium text-blue-900"
              >
                <span>{topic}</span>
                <button
                  onClick={() => onNavigate('create')}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
                >
                  Practice →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Tag Editor */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Verified Technical Skills</h3>
            <p className="text-xs text-slate-500">Add or remove skills displayed to the AI interview engine</p>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
            {profile.skills.length} Skills Added
          </span>
        </div>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-rose-600 p-0.5"
                title="Remove skill"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {/* Add new skill input */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Add new skill (e.g. Docker, Kafka, Redis, GraphQL)"
            className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Resume Text Input (PDF Architecture Ready) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Resume Plaintext & Analysis</h3>
            <p className="text-xs text-slate-500">
              Paste your resume or bio text below. The AI extracts skills and benchmarks against job descriptions.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            PDF Upload Architecture Ready
          </span>
        </div>

        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={6}
          placeholder="Paste your resume markdown or plain text here..."
          className="w-full p-4 text-xs font-mono text-slate-800 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
        ></textarea>

        {/* Projects Preview */}
        <div className="pt-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Highlighted Projects:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.projects.map((proj, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <h5 className="text-xs font-bold text-slate-900">{proj.title}</h5>
                <p className="text-[11px] text-slate-600 leading-normal">{proj.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.tech_stack.map((t, idx) => (
                    <span key={idx} className="text-[9px] font-semibold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Profile & Recompute Readiness'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
