import { Crown, Zap, ImagePlus, Infinity, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import BugLogo from '@/components/BugLogo';
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
  { icon: Infinity, text: 'Unlimited prompts' },
  { icon: Zap, text: 'Faster AI responses' },
  { icon: ImagePlus, text: 'Priority image generation' },
  { icon: Crown, text: 'Early access to new features' },
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
      <div className="max-w-lg mx-auto px-4 pt-10 pb-20 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-pro-gradient flex items-center justify-center glow-lg">
          <Crown size={32} className="text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold">You're on Pro! 🎉</h1>
        <p className="text-sm text-muted-foreground text-center">
          Enjoy unlimited prompts, faster responses, and priority image generation.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex flex-col items-center gap-4 mb-8 ambient-glow">
        <BugLogo size="md" />
        <h1 className="text-2xl font-bold">Upgrade to Pro</h1>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Unlock the full power of Bug AI with unlimited access.
        </p>
      </div>

      {/* Plan toggle */}
      <div className="flex bg-surface rounded-2xl p-1 mb-6">
        {(['monthly', 'annual'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPlan(p)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              plan === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            {p === 'monthly' ? 'Monthly' : 'Annual'}
            {p === 'annual' && (
              <span className="ml-1 text-[10px] opacity-80">Save 33%</span>
            )}
          </button>
        ))}
      </div>

      {/* Price */}
      <motion.div
        key={plan}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface glow-border glow-sm rounded-2xl p-6 mb-6 text-center"
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
        {features.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon size={16} className="text-primary" />
            </div>
            <span className="text-sm">{text}</span>
            <Check size={14} className="text-primary ml-auto" />
          </div>
        ))}
      </div>

      <button
        onClick={handleUpgrade}
        className="w-full py-3.5 rounded-2xl bg-pro-gradient text-primary-foreground font-semibold text-sm glow-md hover:glow-lg transition-shadow"
      >
        Start Pro — {plan === 'monthly' ? price.monthly : price.annual}
      </button>
      <p className="text-[11px] text-muted-foreground text-center mt-3">
        Cancel anytime. No questions asked.
      </p>
    </div>
  );
}
