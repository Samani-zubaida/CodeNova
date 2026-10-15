import React from 'react';

export default function CircularQueueView({
  slots = [15, 30, 45, null, null, null],
  frontIdx = 0,
  rearIdx = 2,
  capacity = 6
}) {
  const radius = 130;
  const centerX = 200;
  const centerY = 190;

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-6">
      <div className="relative w-[400px] h-[380px] flex items-center justify-center">
        <svg className="w-full h-full overflow-visible">
          {/* Circular Track Ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#5C4E49"
            strokeWidth="4"
            strokeDasharray="8 6"
            className="opacity-40"
          />

          {/* Slots arranged in true radial orbit */}
          {slots.map((val, idx) => {
            const angle = (2 * Math.PI * idx) / capacity - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const isFront = idx === frontIdx;
            const isRear = idx === rearIdx;

            return (
              <g key={idx} className="transition-all duration-300">
                {/* Connecting spoke to center */}
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke="#5C4E49"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                  className="opacity-30"
                />

                {/* Outer active pulse ring */}
                {(isFront || isRear) && (
                  <circle
                    cx={x}
                    cy={y}
                    r="32"
                    fill="none"
                    stroke={isFront ? "#AB526B" : "#C5CEAE"}
                    strokeWidth="2"
                    opacity="0.8"
                  >
                    <animate attributeName="r" values="28;36;28" dur="1.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Main Slot Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="26"
                  fill={val !== null ? (isFront ? "#AB526B" : isRear ? "#5C4E49" : "#423834") : "rgba(51, 25, 33, 0.4)"}
                  stroke={isFront ? "#F0E2A4" : isRear ? "#C5CEAE" : "#5C4E49"}
                  strokeWidth="2.5"
                  className="shadow-xl"
                />

                {/* Slot Value */}
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fill={val !== null ? "#ffffff" : "#BCA297"}
                  fontSize={val !== null ? "14" : "11"}
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {val !== null ? val : 'ø'}
                </text>

                {/* Slot Index Tag */}
                <text
                  x={x}
                  y={y - 32}
                  textAnchor="middle"
                  fill="#BCA297"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  [{idx}]
                </text>

                {/* Pointer Badges */}
                {isFront && (
                  <text
                    x={x}
                    y={y + 40}
                    textAnchor="middle"
                    fill="#AB526B"
                    fontSize="9"
                    fontWeight="900"
                    fontFamily="monospace"
                  >
                    ▲ FRONT
                  </text>
                )}
                {isRear && (
                  <text
                    x={x}
                    y={y + (isFront ? 50 : 40)}
                    textAnchor="middle"
                    fill="#C5CEAE"
                    fontSize="9"
                    fontWeight="900"
                    fontFamily="monospace"
                  >
                    ▲ REAR
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Center Ring HUD */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/95 dark:bg-[#331921]/95 border-2 border-[#EBE0D3] dark:border-[#5C4E49] shadow-2xl flex flex-col items-center justify-center text-center p-2 backdrop-blur-md">
          <span className="text-[9px] font-mono uppercase tracking-wider text-[#BCA297]">Circular HUD</span>
          <span className="text-xs font-mono font-extrabold text-[#AB526B] dark:text-[#F0E2A4]">
            (i + 1) % {capacity}
          </span>
          <span className="text-[10px] font-mono text-gray-500 dark:text-[#BCA297] mt-1">
            Front: <strong>{frontIdx}</strong> | Rear: <strong>{rearIdx}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
