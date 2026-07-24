export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Four-point star / sparkle */}
      <path
        d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z"
        fill="currentColor"
      />
      {/* Subtle inner highlight */}
      <circle cx="12" cy="11" r="2.5" fill="white" opacity="0.6" />
    </svg>
  );
}
