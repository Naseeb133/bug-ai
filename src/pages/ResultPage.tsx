import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Leaf, Lightbulb, Bug, BookmarkPlus, AlertTriangle, Check, Home } from 'lucide-react';
import { saveSighting, type Sighting } from '@/lib/store';
import { useState } from 'react';
import { toast } from 'sonner';

const SAFETY_CONFIG: Record<string, { color: string; bg: string; icon: typeof Shield }> = {
  harmless: { color: 'text-primary', bg: 'bg-primary/10', icon: Check },
  beneficial: { color: 'text-primary', bg: 'bg-primary/10', icon: Leaf },
  pest: { color: 'text-warning', bg: 'bg-warning/10', icon: Bug },
  venomous: { color: 'text-destructive', bg: 'bg-destructive/10', icon: AlertTriangle },
  dangerous: { color: 'text-destructive', bg: 'bg-destructive/10', icon: AlertTriangle },
};

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sighting, isNew } = (location.state as { sighting: Sighting; isNew?: boolean }) || {};
  const [saved, setSaved] = useState(false);

  if (!sighting) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <button onClick={() => navigate('/')} className="text-primary text-sm">Go Home</button>
      </div>
    );
  }

  const safety = SAFETY_CONFIG[sighting.safety] || SAFETY_CONFIG.harmless;
  const SafetyIcon = safety.icon;

  const handleSave = () => {
    saveSighting(sighting);
    setSaved(true);
    toast.success('Saved to My Sightings!');
  };

  return (
    <div className="max-w-lg mx-auto pb-24">
      {/* Bug image */}
      <div className="relative w-full h-64">
        <img src={sighting.imageUrl} alt={sighting.species} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="px-4 -mt-10 relative z-10">
        {/* Species info */}
        <motion.div
          initial={isNew ? { opacity: 0, y: 20 } : {}}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface glow-border rounded-2xl p-5 mb-4"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold">{sighting.species}</h1>
              <p className="text-xs text-muted-foreground italic">{sighting.scientificName}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{sighting.confidence}%</p>
              <p className="text-[10px] text-muted-foreground">confidence</p>
            </div>
          </div>

          {/* Safety badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${safety.bg} ${safety.color}`}>
            <SafetyIcon size={14} />
            {sighting.safety.charAt(0).toUpperCase() + sighting.safety.slice(1)}
          </div>
        </motion.div>

        {/* Sections */}
        <Section icon={Shield} title="Bite / Sting Risk" delay={0.1}>
          <p className="text-sm text-muted-foreground">{sighting.biteRisk}</p>
        </Section>

        <Section icon={Leaf} title="Ecological Role" delay={0.15}>
          <p className="text-sm text-muted-foreground">{sighting.ecologicalRole}</p>
        </Section>

        <Section icon={Lightbulb} title="Fun Facts" delay={0.2}>
          <ul className="space-y-1.5">
            {sighting.funFacts.map((f, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary mt-0.5">•</span>
                {f}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Bug} title="Eco-Friendly Removal" delay={0.25}>
          <p className="text-sm text-muted-foreground">{sighting.removalTips}</p>
        </Section>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-6">
          {isNew && !saved && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl bg-pro-gradient text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2"
            >
              <BookmarkPlus size={16} />
              Save to My Sightings
            </motion.button>
          )}
          {saved && (
            <div className="w-full py-3.5 rounded-2xl bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center gap-2">
              <Check size={16} />
              Saved!
            </div>
          )}
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-2xl bg-surface glow-border text-foreground text-sm font-medium flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Identify Another Bug
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, delay = 0, children }: { icon: typeof Shield; title: string; delay?: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-surface glow-border rounded-2xl p-4 mb-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={14} className="text-primary" />
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
