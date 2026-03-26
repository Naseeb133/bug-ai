import { Moon, Sun, Trash2, RotateCcw, Shield, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

  const items = [
    {
      onClick: toggleTheme,
      icon: theme === 'dark' ? Moon : Sun,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      title: 'Appearance',
      subtitle: `${theme === 'dark' ? 'Dark' : 'Light'} mode`,
      trailing: (
        <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${theme === 'dark' ? 'bg-primary' : 'bg-muted'}`}>
          <div className={`w-5 h-5 rounded-full bg-primary-foreground transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      ),
    },
    {
      onClick: handleClearHistory,
      icon: Trash2,
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      title: 'Clear Sighting History',
      subtitle: 'Delete all saved identifications',
    },
    {
      onClick: () => {},
      icon: RotateCcw,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      title: 'Restore Purchases',
      subtitle: isPro() ? 'Pro plan active' : 'Restore your Pro subscription',
    },
    {
      onClick: () => {},
      icon: Shield,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      title: 'Privacy Policy',
      subtitle: 'Read our privacy terms',
      trailing: <ExternalLink size={14} className="text-muted-foreground" />,
    },
  ];

  return (
    <div className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-24">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground mb-6">Manage your Bug AI preferences</p>
      </motion.div>

      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={item.onClick}
            className="glass-card rounded-[1.25rem] p-4 flex items-center gap-3 w-full text-left transition-all hover:border-primary/30"
          >
            <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center`}>
              <item.icon size={16} className={item.iconColor} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.subtitle}</p>
            </div>
            {item.trailing}
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-2 mt-10"
      >
        <BugLogo size="sm" />
        <p className="text-[11px] text-muted-foreground">Version 1.0.0</p>
      </motion.div>
    </div>
  );
}
