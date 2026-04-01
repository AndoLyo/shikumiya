"use client";

interface OrnamentalDividerProps {
  width?: number;
  color?: string;
}

export function OrnamentalDivider({
  width = 200,
  color = "#444444",
}: OrnamentalDividerProps) {
  return (
    <svg
      width={width}
      height="20"
      viewBox={`0 0 ${width} 20`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="my-6"
    >
      {/* Left line */}
      <line
        x1="0"
        y1="10"
        x2={width / 2 - 16}
        y2="10"
        stroke={color}
        strokeWidth="0.5"
      />
      {/* Center diamond */}
      <path
        d={`M${width / 2} 4 L${width / 2 + 6} 10 L${width / 2} 16 L${width / 2 - 6} 10 Z`}
        stroke={color}
        strokeWidth="0.75"
        fill="none"
      />
      {/* Inner diamond */}
      <path
        d={`M${width / 2} 7 L${width / 2 + 3} 10 L${width / 2} 13 L${width / 2 - 3} 10 Z`}
        fill={color}
        opacity="0.3"
      />
      {/* Right line */}
      <line
        x1={width / 2 + 16}
        y1="10"
        x2={width}
        y2="10"
        stroke={color}
        strokeWidth="0.5"
      />
      {/* Small dots at ends */}
      <circle cx="0" cy="10" r="1" fill={color} opacity="0.5" />
      <circle cx={width} cy="10" r="1" fill={color} opacity="0.5" />
    </svg>
  );
}
