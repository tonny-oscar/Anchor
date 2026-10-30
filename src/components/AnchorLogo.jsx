export default function AnchorLogo({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="2.5" />
      <path d="M12 7.5V21" />
      <path d="M8 11h8" />
      <path d="M4 14c0 4 3.6 7 8 7s8-3 8-7" />
      <path d="M2.5 15.5 4 14l1.5 1.5" />
      <path d="M18.5 15.5 20 14l1.5 1.5" />
    </svg>
  );
}
