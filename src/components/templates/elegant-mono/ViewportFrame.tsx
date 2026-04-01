"use client";

function CornerOrnament({ className }: { className: string }) {
  return (
    <svg
      className={`corner-ornament ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Decorative L-shaped corner with curls */}
      <path
        d="M2 38 L2 8 C2 5 3 3 6 2 L12 2"
        stroke="#444444"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M2 38 L2 12 C2 8 4 5 8 4 L16 2"
        stroke="#333333"
        strokeWidth="0.5"
        fill="none"
      />
      {/* Small curl at the corner */}
      <circle cx="4" cy="6" r="2" stroke="#444444" strokeWidth="0.5" fill="none" />
      {/* Decorative dot */}
      <circle cx="2" cy="2" r="1.5" fill="#444444" />
      {/* Extended lines */}
      <path
        d="M14 2 L36 2"
        stroke="#333333"
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M2 14 L2 36"
        stroke="#333333"
        strokeWidth="0.5"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

export function ViewportFrame() {
  return (
    <div className="viewport-frame">
      <CornerOrnament className="top-left" />
      <CornerOrnament className="top-right" />
      <CornerOrnament className="bottom-left" />
      <CornerOrnament className="bottom-right" />
    </div>
  );
}
