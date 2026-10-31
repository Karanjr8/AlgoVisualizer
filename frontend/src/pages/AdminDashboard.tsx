import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  BarChart3,
  BookOpen,
  HelpCircle,
  Trash2,
  Plus,
  RefreshCw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../lib/api';

interface AdminUser {
  id: string;
  fullName?: string;
  email: string;
  username?: string;
  role: string;
  lastLogin?: string;
  currentStreak: number;
  learningHours: number;
  isEmailVerified: boolean;
  createdAt: string;
}

interface AnalyticsData {
  stats: {
    totalUsers: number;
    adminCount: number;
    regularUsers: number;
    activeUsersToday: number;
    totalAlgorithms: number;
    totalQuestions: number;
    totalCompletedTopics: number;
    totalPracticeAttempts: number;
  };
  recentUsers: Array<{
    id: string;
    fullName?: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'topics' | 'questions'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Topic form state
  const [topicName, setTopicName] = useState('');
  const [topicCategory, setTopicCategory] = useState('Sorting');
  const [topicSlug, setTopicSlug] = useState('');

  // Question form state
  const [qTitle, setQTitle] = useState('');
  const [qTopic, setQTopic] = useState('Arrays');
  const [qStatement, setQStatement] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      const [usersRes, analyticsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/analytics'),
      ]);
      setUsers(usersRes.data.users || []);
      setAnalytics(analyticsRes.data || null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      setSuccessMsg(`Updated user role to ${newRole}`);
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setSuccessMsg('User deleted successfully');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/topics', {
        name: topicName,
        slug: topicSlug || topicName.toLowerCase().replace(/\s+/g, '-'),
        category: topicCategory,
        difficulty: 'Medium',
      });
      setSuccessMsg('Topic created successfully!');
      setTopicName('');
      setTopicSlug('');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create topic');
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/questions', {
        title: qTitle,
        topic: qTopic,
        statement: qStatement,
        difficulty: 'Easy',
      });
      setSuccessMsg('Question created successfully!');
      setQTitle('');
      setQStatement('');
      fetchAdminData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create question');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-primary/10 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrator Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Administration & Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage registered users, update permissions, view real platform metrics, and manage learning content.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-foreground font-bold text-xs flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
        </button>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto p-4 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      {successMsg && (
        <div className="max-w-7xl mx-auto p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 shrink-0" /> {successMsg}
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 border-b border-border/80 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'users' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" /> Manage Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'analytics' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Platform Analytics
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'topics' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Manage Topics
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'questions' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Manage Questions
        </button>
      </div>

      {/* TAB 1: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="max-w-7xl mx-auto bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Registered Accounts Database</h2>
            <span className="text-xs text-muted-foreground">Showing real users in SQLite database</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-border/80 uppercase tracking-wider text-muted-foreground font-bold">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Streak</th>
                  <th className="p-3.5">Last Login</th>
                  <th className="p-3.5">Joined</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 font-medium">
                      <div className="font-bold text-foreground">{u.fullName || u.email.split('@')[0]}</div>
                      <div className="text-muted-foreground text-[11px] font-mono">{u.email}</div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {u.role === 'ADMIN' && <ShieldCheck className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono">{u.currentStreak || 0} days</td>
                    <td className="p-3.5 text-muted-foreground">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="p-3.5 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {u.role === 'USER' ? (
                        <button
                          onClick={() => handleUpdateRole(u.id, 'ADMIN')}
                          className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Make Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateRole(u.id, 'USER')}
                          className="px-2.5 py-1 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Make User
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PLATFORM ANALYTICS */}
      {activeTab === 'analytics' && analytics && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-lg space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Users</span>
              <div className="text-3xl font-black text-foreground">{analytics.stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">{analytics.stats.adminCount} Admins, {analytics.stats.regularUsers} Standard Users</p>
            </div>
            <div className="bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-lg space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Today</span>
              <div className="text-3xl font-black text-foreground">{analytics.stats.activeUsersToday}</div>
              <p className="text-xs text-muted-foreground">Users logged in / active today</p>
            </div>
            <div className="bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-lg space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Completed Topics</span>
              <div className="text-3xl font-black text-foreground">{analytics.stats.totalCompletedTopics}</div>
              <p className="text-xs text-muted-foreground">Total module completions recorded</p>
            </div>
            <div className="bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-5 shadow-lg space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Practice Attempts</span>
              <div className="text-3xl font-black text-foreground">{analytics.stats.totalPracticeAttempts}</div>
              <p className="text-xs text-muted-foreground">Total timed/practice sessions</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE TOPICS */}
      {activeTab === 'topics' && (
        <div className="max-w-2xl mx-auto bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl space-y-5">
          <h2 className="text-lg font-bold text-foreground">Add New Learning Topic</h2>
          <form onSubmit={handleCreateTopic} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Topic Name</label>
              <input
                type="text"
                required
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="e.g. Radix Sort"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-foreground text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Category</label>
              <select
                value={topicCategory}
                onChange={(e) => setTopicCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-foreground text-sm"
              >
                <option value="Sorting">Sorting</option>
                <option value="Searching">Searching</option>
                <option value="Graphs">Graphs</option>
                <option value="DP">Dynamic Programming</option>
                <option value="Trees">Trees</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" /> Create Topic
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: MANAGE QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="max-w-2xl mx-auto bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-6 shadow-xl space-y-5">
          <h2 className="text-lg font-bold text-foreground">Add Practice Question</h2>
          <form onSubmit={handleCreateQuestion} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Title</label>
              <input
                type="text"
                required
                value={qTitle}
                onChange={(e) => setQTitle(e.target.value)}
                placeholder="e.g. Find Kth Largest Element"
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-foreground text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Topic Category</label>
              <select
                value={qTopic}
                onChange={(e) => setQTopic(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-foreground text-sm mb-3"
              >
                <option value="Arrays">Arrays</option>
                <option value="Searching">Searching</option>
                <option value="Sorting">Sorting</option>
                <option value="Graphs">Graphs</option>
                <option value="Trees">Trees</option>
                <option value="DP">Dynamic Programming</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Problem Statement</label>
              <textarea
                required
                rows={4}
                value={qStatement}
                onChange={(e) => setQStatement(e.target.value)}
                placeholder="Write full problem description..."
                className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-foreground text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" /> Create Question
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
