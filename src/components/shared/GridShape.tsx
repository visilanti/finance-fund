import React from "react";

function GridSvg({ className, idPrefix = "grid1" }: { className?: string; idPrefix?: string }) {
  return (
    <svg
      width="450"
      height="254"
      viewBox="0 0 450 254"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Grid Lines with crisp white gradients */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.50555 45.1131L450 45.1132L450 44.6073L0.50555 44.6072L0.50555 45.1131Z"
        fill={`url(#${idPrefix}_linear_0)`}
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M205.546 253.529L205.546 0L205.04 0L205.04 253.529L205.546 253.529Z"
        fill={`url(#${idPrefix}_linear_1)`}
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.505546 97.2164L450 97.2165L450 96.7106L0.505546 96.7106L0.505546 97.2164Z"
        fill={`url(#${idPrefix}_linear_2)`}
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256.806 253.529L256.806 0L256.3 0L256.3 253.529L256.806 253.529Z"
        fill={`url(#${idPrefix}_linear_3)`}
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.505837 253.529L0.505859 0L0 0L0 253.529L0.505837 253.529Z"
        fill={`url(#${idPrefix}_linear_4)`}
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.505541 149.321L450 149.321L450 148.815L0.505541 148.815L0.505541 149.321Z"
        fill={`url(#${idPrefix}_linear_5)`}
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M308.066 253.529L308.066 0L307.56 0L307.56 253.529L308.066 253.529Z"
        fill={`url(#${idPrefix}_linear_6)`}
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M51.7662 253.529L51.7662 0L51.2603 0L51.2603 253.529L51.7662 253.529Z"
        fill={`url(#${idPrefix}_linear_7)`}
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.505537 201.424L450 201.424L450 200.918L0.505537 200.918L0.505537 201.424Z"
        fill={`url(#${idPrefix}_linear_8)`}
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M359.326 253.529L359.326 0L358.82 0L358.82 253.529L359.326 253.529Z"
        fill={`url(#${idPrefix}_linear_9)`}
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M103.026 253.529L103.026 0L102.52 0L102.52 253.529L103.026 253.529Z"
        fill={`url(#${idPrefix}_linear_10)`}
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M410.586 253.529L410.586 0L410.08 0L410.08 253.529L410.586 253.529Z"
        fill={`url(#${idPrefix}_linear_11)`}
        fillOpacity="0.6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M154.286 253.529L154.286 0L153.78 0L153.78 253.529L154.286 253.529Z"
        fill={`url(#${idPrefix}_linear_12)`}
        fillOpacity="0.6"
      />

      {/* Decorative Glowing Blocks */}
      <rect
        width="50.7536"
        height="51.5982"
        transform="matrix(-1 0 0 1 358.821 45.1138)"
        fill="#FFFFFF"
        fillOpacity="0.16"
      />
      <rect
        width="50.756"
        height="51.5985"
        transform="matrix(-1 0 0 1 307.559 97.2163)"
        fill="#FFFFFF"
        fillOpacity="0.16"
      />

      <defs>
        {[...Array(13)].map((_, i) => (
          <linearGradient
            key={i}
            id={`${idPrefix}_linear_${i}`}
            x1="277.872"
            y1="0"
            x2="194.87"
            y2="235.867"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
    </svg>
  );
}

export default function GridShape() {
  return (
    <>
      <div className="absolute right-0 top-0 pointer-events-none w-full max-w-[280px] xl:max-w-[480px]">
        <GridSvg className="w-full h-auto" idPrefix="top_grid" />
      </div>
      <div className="absolute bottom-0 left-0 pointer-events-none w-full max-w-[280px] rotate-180 xl:max-w-[480px]">
        <GridSvg className="w-full h-auto" idPrefix="bottom_grid" />
      </div>
    </>
  );
}
