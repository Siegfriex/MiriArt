/**
 * @fileoverview 레이더 차트. 5축(density, form, completion, relevance, thinking) SVG 시각화.
 * @참조 result-detail Page, StickyContextCard, GradeInputSheet
 * @라우팅 /result/:artworkId, /chat/:sessionId
 * @상태 useState (hoveredKey)
 */

import React, { useState } from 'react';
import { RadarData } from '../../model/types';
import { STRINGS } from '../../config/strings';

interface RadarChartProps {
  data: RadarData;
  size?: number;
}

const LABELS: Record<keyof RadarData, string> = {
  density: STRINGS.RESULT_RADAR_DENSITY,
  form: STRINGS.RESULT_RADAR_FORM,
  completion: STRINGS.RESULT_RADAR_COMPLETION,
  relevance: STRINGS.RESULT_RADAR_RELEVANCE,
  thinking: STRINGS.RESULT_RADAR_THINKING,
};

const KEYS: (keyof RadarData)[] = ['density', 'form', 'completion', 'relevance', 'thinking'];

function polarToCart(angle: number, radius: number, cx: number, cy: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function buildPath(points: { x: number; y: number }[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') + ' Z';
}

/** 레이더 차트. data, size. @참조 ResultDetail, StickyContextCard, GradeInputSheet @상태 hoveredKey */
export const RadarChart: React.FC<RadarChartProps> = ({ data, size = 220 }) => {
  const [hoveredKey, setHoveredKey] = useState<keyof RadarData | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const n = KEYS.length;
  const angles = KEYS.map((_, i) => (360 / n) * i);

  // 배경 그리드 (3단계 동심 오각형)
  const gridLevels = [0.33, 0.66, 1.0];
  const gridPaths = gridLevels.map((level) => {
    const pts = angles.map((a) => polarToCart(a, maxR * level, cx, cy));
    return buildPath(pts);
  });

  // 데이터 polygon
  const dataPoints = KEYS.map((key, i) => polarToCart(angles[i], maxR * (data[key] / 100), cx, cy));
  const dataPath = buildPath(dataPoints);

  // 라벨 위치 (꼭짓점 바깥쪽)
  const labelOffset = maxR * 1.22;
  const labelPositions = KEYS.map((key, i) => ({
    key,
    ...polarToCart(angles[i], labelOffset, cx, cy),
  }));

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* 그리드 선 */}
        {gridPaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        ))}

        {/* 그리드 중심 방사선 */}
        {angles.map((angle, i) => {
          const outer = polarToCart(angle, maxR, cx, cy);
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={outer.x.toFixed(2)} y2={outer.y.toFixed(2)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}

        {/* 데이터 영역 */}
        <path
          d={dataPath}
          fill="rgba(194,249,112,0.15)"
          stroke="#C2F970"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 데이터 꼭짓점 점 */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={hoveredKey === KEYS[i] ? 5 : 3}
            fill="#C2F970"
            className="cursor-pointer transition-all duration-150"
            onMouseEnter={() => setHoveredKey(KEYS[i])}
            onMouseLeave={() => setHoveredKey(null)}
            onTouchStart={() => setHoveredKey(hoveredKey === KEYS[i] ? null : KEYS[i])}
          />
        ))}

        {/* 라벨 */}
        {labelPositions.map(({ key, x, y }) => (
          <text
            key={key}
            x={x.toFixed(2)}
            y={y.toFixed(2)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-text-mid text-[10px] font-medium select-none"
            style={{ fontSize: '10px', fill: hoveredKey === key ? '#C2F970' : '#A1A1AA' }}
          >
            {LABELS[key]}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredKey && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-dark-800 border border-white/10 rounded-lg px-3 py-1.5 text-center shadow-elevated">
            <div className="text-[10px] text-text-mid">{LABELS[hoveredKey]}</div>
            <div className="text-lg font-bold text-primary-lime">{data[hoveredKey]}</div>
          </div>
        </div>
      )}
    </div>
  );
};
