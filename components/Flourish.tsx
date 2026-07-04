/** Woodcut-style ornamental divider — an illuminated-manuscript flourish. */
export function Flourish({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`} aria-hidden>
      <svg viewBox="0 0 240 24" className="h-4 w-56 text-ink/50" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M8 12h78" />
        <path d="M86 12c6-6 12-6 18 0s12 6 18 0 12-6 18 0 12 6 18 0" />
        <path d="M154 12h78" />
        <path d="M120 12l-6-6M120 12l6-6M120 12l-6 6M120 12l6 6" />
        <circle cx="120" cy="12" r="2.4" fill="currentColor" stroke="none" />
        <circle cx="8" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="232" cy="12" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
}
