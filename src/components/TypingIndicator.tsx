export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-surface rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: '200ms' }} />
        <span className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: '400ms' }} />
      </div>
    </div>
  );
}
