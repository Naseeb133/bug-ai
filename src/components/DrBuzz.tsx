import { motion } from 'framer-motion';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  thinking?: boolean;
  className?: string;
}

export default function DrBuzz({ size = 'md', thinking = false, className = '' }: Props) {
  const sizes = { sm: 48, md: 80, lg: 120 };
  const s = sizes[size];

  return (
    <motion.div
      className={`relative inline-flex ${className}`}
      animate={thinking ? { y: [0, -4, 0] } : {}}
      transition={thinking ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
    >
      <svg width={s} height={s} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="60" cy="72" rx="30" ry="28" className="fill-primary/20 stroke-primary" strokeWidth="2" />
        
        {/* Lab coat */}
        <path d="M35 65 Q35 55 45 52 L75 52 Q85 55 85 65 L85 90 Q85 95 80 95 L40 95 Q35 95 35 90 Z" className="fill-muted stroke-primary/40" strokeWidth="1.5" />
        <line x1="60" y1="52" x2="60" y2="95" className="stroke-primary/30" strokeWidth="1" />
        
        {/* Head */}
        <circle cx="60" cy="38" r="20" className="fill-primary/30 stroke-primary" strokeWidth="2" />
        
        {/* Antennae */}
        <path d="M50 20 Q45 8 38 5" className="stroke-primary" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="37" cy="4" r="3" className="fill-primary" />
        <path d="M70 20 Q75 8 82 5" className="stroke-primary" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="83" cy="4" r="3" className="fill-primary" />

        {/* Glasses */}
        <rect x="44" y="30" width="14" height="12" rx="3" className="stroke-primary" strokeWidth="2" fill="none" />
        <rect x="62" y="30" width="14" height="12" rx="3" className="stroke-primary" strokeWidth="2" fill="none" />
        <line x1="58" y1="36" x2="62" y2="36" className="stroke-primary" strokeWidth="2" />
        
        {/* Eyes behind glasses */}
        <circle cx="51" cy="36" r="2.5" className="fill-foreground" />
        <circle cx="69" cy="36" r="2.5" className="fill-foreground" />
        {thinking && (
          <>
            <circle cx="52" cy="35" r="1" className="fill-background" />
            <circle cx="70" cy="35" r="1" className="fill-background" />
          </>
        )}
        
        {/* Smile */}
        <path d="M54 46 Q60 51 66 46" className="stroke-primary" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        
        {/* Legs */}
        <line x1="40" y1="85" x2="35" y2="105" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="90" x2="60" y2="110" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
        <line x1="80" y1="85" x2="85" y2="105" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
        
        {/* Little feet */}
        <ellipse cx="34" cy="107" rx="4" ry="2" className="fill-primary/40" />
        <ellipse cx="60" cy="112" rx="4" ry="2" className="fill-primary/40" />
        <ellipse cx="86" cy="107" rx="4" ry="2" className="fill-primary/40" />
      </svg>
      
      {thinking && (
        <motion.div 
          className="absolute -top-2 -right-2 text-lg"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🔍
        </motion.div>
      )}
    </motion.div>
  );
}
