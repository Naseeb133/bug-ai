import { Moon, Sun, Trash2, RotateCcw, Shield, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTheme, setTheme as saveTheme, clearSightings, isPro } from '@/lib/store';
import BugLogo from '@/components/BugLogo';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [theme, setLocalTheme] = useState<'dark' | 'light'>(getTheme());

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  const handleClearHistory = () => {
    clearSightings();
    toast.success('Sighting history cleared');
  };

  const toggleTheme = () => {
    setLocalTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h1 className="text-xl font-semibold mb-1">Settings</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage your Bug AI preferences</p>

      <div className="flex flex-col gap-2">
        <button onClick={toggleTheme} className="bg-surface rounded-2xl p-4 flex items-center gap-3 w-full text-left">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            {theme === 'dark' ? <Moon size={16} className="text-primary" /> : <Sun size={16} className="text-primary" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Appearance</p>
            <p className="text-xs text-muted-foreground">{theme === 'dark' ? 'Dark' : 'Light'} mode</p>
          </div>
          <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${theme === 'dark' ? 'bg-primary' : 'bg-muted'}`}>
            <div className={`w-5 h-5 rounded-full bg-primary-foreground transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>

        <button onClick={handleClearHistory} className="bg-surface rounded-2xl p-4 flex items-center gap-3 w-full text-left">
          <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Trash2 size={16} className="text-destructive" />
          </div>
          <div>
            <p className="text-sm font-medium">Clear Sighting History</p>
            <p className="text-xs text-muted-foreground">Delete all saved identifications</p>
          </div>
        </button>

        <button className="bg-surface rounded-2xl p-4 flex items-center gap-3 w-full text-left">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <RotateCcw size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Restore Purchases</p>
            <p className="text-xs text-muted-foreground">
              {isPro() ? 'Pro plan active' : 'Restore your Pro subscription'}
            </p>
          </div>
        </button>

        <button className="bg-surface rounded-2xl p-4 flex items-center gap-3 w-full text-left">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Privacy Policy</p>
            <p className="text-xs text-muted-foreground">Read our privacy terms</p>
          </div>
          <ExternalLink size={14} className="text-muted-foreground" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 mt-10">
        <BugLogo size="sm" />
        <p className="text-[11px] text-muted-foreground">Version 1.0.0</p>
      </div>
    </div>
  );
}
