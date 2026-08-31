import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Check, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onProfileUpdated: (updatedProfile: any) => void;
}

export const EditProfileModal = ({ isOpen, onClose, profile, onProfileUpdated }: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    avatar: profile?.avatar || '',
    college: profile?.college || '',
    degree: profile?.degree || '',
    graduationYear: profile?.graduationYear || '',
    currentRole: profile?.currentRole || '',
    githubUrl: profile?.githubUrl || '',
    linkedinUrl: profile?.linkedinUrl || '',
    leetcodeUrl: profile?.leetcodeUrl || '',
    codeforcesUrl: profile?.codeforcesUrl || '',
    codechefUrl: profile?.codechefUrl || '',
    gfgUrl: profile?.gfgUrl || '',
    portfolioUrl: profile?.portfolioUrl || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await api.put('/profile', formData);
      setSuccess(true);
      onProfileUpdated(res.data);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 800);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">Edit Profile & Connections</h2>
              <p className="text-xs font-semibold text-muted-foreground">Update your details and learning portfolio links</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-white/10 pb-2">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Karan Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="karan_coder"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Bio</label>
                <textarea
                  name="bio"
                  rows={2}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Passionate algorithm explorer building visualizers and mastering DS & Algo..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground resize-none"
                />
              </div>
            </div>

            {/* Academic & Professional Info */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-white/10 pb-2">
                Education & Role
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">College / Institution</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="IIT Delhi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Degree / Field</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="B.Tech Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Graduation Year</label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    placeholder="2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Current Role / Target Role</label>
                  <input
                    type="text"
                    name="currentRole"
                    value={formData.currentRole}
                    onChange={handleChange}
                    placeholder="Software Engineering Intern"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Connected Platform Links */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-white/10 pb-2">
                Connected Platforms & Profiles
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.in/in/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">LeetCode Profile URL</label>
                  <input
                    type="url"
                    name="leetcodeUrl"
                    value={formData.leetcodeUrl}
                    onChange={handleChange}
                    placeholder="https://leetcode.com/u/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Codeforces Profile URL</label>
                  <input
                    type="url"
                    name="codeforcesUrl"
                    value={formData.codeforcesUrl}
                    onChange={handleChange}
                    placeholder="https://codeforces.com/profile/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">CodeChef Profile URL</label>
                  <input
                    type="url"
                    name="codechefUrl"
                    value={formData.codechefUrl}
                    onChange={handleChange}
                    placeholder="https://codechef.com/users/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">GeeksForGeeks Profile URL</label>
                  <input
                    type="url"
                    name="gfgUrl"
                    value={formData.gfgUrl}
                    onChange={handleChange}
                    placeholder="https://geeksforgeeks.org/user/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Portfolio / Personal Website</label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  placeholder="https://myportfolio.dev"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 border border-white/10 focus:border-primary focus:outline-none text-sm text-foreground"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-white/10 font-bold text-sm text-muted-foreground hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || success}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-blue-600 text-white font-bold text-sm shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : success ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Saved!
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
