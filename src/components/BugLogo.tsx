import { Bug } from 'lucide-react';

export default function BugLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 24, md: 40, lg: 56 };
  const textSizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' };

  return (
    <div className="flex items-center gap-2">
      <div className="glow-md rounded-xl bg-primary/10 p-2">
        <Bug size={sizes[size]} className="text-primary" />
      </div>
      <span className={`${textSizes[size]} font-bold tracking-tight`}>
        Bug <span className="text-gradient">AI</span>
      </span>
    </div>
  );
}
