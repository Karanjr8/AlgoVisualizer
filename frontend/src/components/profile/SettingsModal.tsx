import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Moon, Bell, Eye } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground">Dashboard Settings</h2>
              <p className="text-xs font-semibold text-muted-foreground">Configure preferences and privacy settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background/60 border border-white/10">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-purple-400" />
                <div>
                  <span className="text-sm font-bold text-foreground block">Practice Reminders</span>
                  <span className="text-xs text-muted-foreground">Daily notification to maintain streak</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background/60 border border-white/10">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-400" />
                <div>
                  <span className="text-sm font-bold text-foreground block">Public Profile</span>
                  <span className="text-xs text-muted-foreground">Allow others to view your learning heatmap</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={publicProfile}
                onChange={() => setPublicProfile(!publicProfile)}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-background/60 border border-white/10">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-sm font-bold text-foreground block">Visualizer Sound Effects</span>
                  <span className="text-xs text-muted-foreground">Audio ticks on step-by-step executions</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={() => setSoundEffects(!soundEffects)}
                className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary via-purple-600 to-blue-600 text-white font-bold text-sm shadow-lg"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
