import { Crown, Zap, Bug, Wifi, History, MessageCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import DrBuzz from '@/components/DrBuzz';
import { isPro, setPro } from '@/lib/store';
import { useState } from 'react';

function getLocalPrice() {
  try {
    const lang = navigator.language || '';
    if (lang.startsWith('hi') || lang.includes('IN')) {
      return { monthly: '₹249', annual: '₹1,999', annualSub: '₹167/mo', currency: 'INR' };
    }
  } catch {}
  return { monthly: '$4.99', annual: '$39.99', annualSub: '$3.33/mo', currency: 'USD' };
}

const features = [
  { icon: Bug, text: 'Unlimited identifications' },
  { icon: Wifi, text: 'Offline common insects' },
  { icon: Zap, text: 'Sound identification' },
  { icon: History, text: 'Full sighting history' },
  { icon: MessageCircle, text: 'AI chat about bugs' },
];

export default function UpgradePage() {
  const [proActive, setProActive] = useState(isPro());
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');
  const price = getLocalPrice();

  const handleUpgrade = () => {
    setPro(true);
    setProActive(true);
  };

  if (proActive) {
    return (
      <div className="relative z-10 max-w-lg mx-auto px-4 pt-10 pb-20 flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 rounded-[1.25rem] btn-gradient flex items-center justify-center"
        >
          <Crown size={32} className="text-primary-foreground" />
        </motion.div>
        <h1 className="text-2xl font-bold">You're on Pro! 🎉</h1>
        <p className="text-sm text-muted-foreground text-center">
          Enjoy unlimited bug identifications, offline mode, and AI chat.
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 mb-8 ambient-glow"
      >
        <DrBuzz size="md" />
        <h1 className="text-2xl font-bold">Upgrade to Pro</h1>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Unlock unlimited identifications and premium features.
        </p>
      </motion.div>

      {/* Plan toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex glass-card rounded-[1.25rem] p-1 mb-6"
      >
        {(['monthly', 'annual'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPlan(p)}
            className={`flex-1 py-2.5 rounded-[1rem] text-sm font-medium transition-all ${
              plan === p ? 'btn-gradient text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            {p === 'monthly' ? 'Monthly' : 'Annual'}
            {p === 'annual' && <span className="ml-1 text-[10px] opacity-80">Save 33%</span>}
          </button>
        ))}
      </motion.div>

      {/* Price */}
      <motion.div
        key={plan}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-strong rounded-[1.25rem] p-6 mb-6 text-center"
      >
        <p className="text-4xl font-bold text-gradient">
          {plan === 'monthly' ? price.monthly : price.annual}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {plan === 'monthly' ? 'per month' : `per year (${price.annualSub})`}
        </p>
      </motion.div>

      {/* Features */}
      <div className="flex flex-col gap-3 mb-8">
        {features.map(({ icon: Icon, text }, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon size={16} className="text-primary" />
            </div>
            <span className="text-sm">{text}</span>
            <Check size={14} className="text-primary ml-auto" />
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleUpgrade}
        className="w-full py-3.5 rounded-[1.25rem] btn-gradient text-primary-foreground font-semibold text-sm"
      >
        Start Pro — {plan === 'monthly' ? price.monthly : price.annual}
      </motion.button>
      <p className="text-[11px] text-muted-foreground text-center mt-3">
        Cancel anytime. No questions asked.
      </p>
    </div>
  );
}
