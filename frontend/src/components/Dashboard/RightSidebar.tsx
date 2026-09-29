'use client';

import React, { useState } from 'react';
import {
  ObservationMarker,
  VARIABLE_META,
  ModelLayerConfig,
} from '../../data/mockOceanData';
import {
  Activity,
  ExternalLink,
  Thermometer,
  Droplets,
  Wind,
  Layers,
  ChevronDown,
  Info,
  CheckCircle2,
  Download,
  Share2,
} from 'lucide-react';

interface RightSidebarProps {
  selectedObservation: ObservationMarker;
  config: ModelLayerConfig;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  selectedObservation,
  config,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'details' | 'comparison'>('profile');
  const [hoveredPoint, setHoveredPoint] = useState<{
    depth: number;
    obsVal: number;
    modVal: number;
  } | null>(null);

  const currentMeta = VARIABLE_META[config.variable];

  // Compute model vs obs difference for the currently selected variable
  const obsVal =
    config.variable === 'temperature'
      ? selectedObservation.observedValues.temperature
      : config.variable === 'salinity'
      ? selectedObservation.observedValues.salinity
      : config.variable === 'currents'
      ? selectedObservation.observedValues.currentSpeed
      : selectedObservation.observedValues.chlorophyll;

  const modVal =
    config.variable === 'temperature'
      ? selectedObservation.modelValues.temperature
      : config.variable === 'salinity'
      ? selectedObservation.modelValues.salinity
      : config.variable === 'currents'
      ? selectedObservation.modelValues.currentSpeed
      : selectedObservation.modelValues.chlorophyll;

  const diff = Math.abs(obsVal - modVal);
  const unit = currentMeta.unit;

  // SVG dimensions for Depth Profile Chart
  const svgWidth = 260;
  const svgHeight = 220;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  // Min/Max for chart axes depending on variable
  const minVal = currentMeta.min;
  const maxVal = currentMeta.max;
  const maxDepth = 1000;

  const getX = (val: number) =>
    padLeft + ((Math.max(minVal, Math.min(maxVal, val)) - minVal) / (maxVal - minVal)) * chartW;
  const getY = (d: number) => padTop + (d / maxDepth) * chartH;

  // Helper to extract variable-specific values from depthProfile
  const getPointValues = (pt: typeof selectedObservation.depthProfile[0]) => {
    if (config.variable === 'salinity') {
      return { obs: pt.observedSalinity, mod: pt.modelSalinity };
    }
    if (config.variable === 'chlorophyll') {
      return { obs: pt.observedChlorophyll, mod: pt.modelChlorophyll };
    }
    if (config.variable === 'currents') {
      return { obs: pt.observedCurrent, mod: pt.modelCurrent };
    }
    return { obs: pt.observedTemp, mod: pt.modelTemp };
  };

  // Generate SVG path for Observed and Model curves
  const obsPath = selectedObservation.depthProfile
    .map((pt, i) => {
      const v = getPointValues(pt);
      return `${i === 0 ? 'M' : 'L'} ${getX(v.obs)} ${getY(pt.depth)}`;
    })
    .join(' ');

  const modPath = selectedObservation.depthProfile
    .map((pt, i) => {
      const v = getPointValues(pt);
      return `${i === 0 ? 'M' : 'L'} ${getX(v.mod)} ${getY(pt.depth)}`;
    })
    .join(' ');

  // Export float profile as CSV
  const handleExportCSV = () => {
    const headers = ['Depth_m', 'Observed_Value', 'Model_Value', 'Variable', 'Unit', 'Float_ID'];
    const rows = selectedObservation.depthProfile.map((pt) => {
      const v = getPointValues(pt);
      return [pt.depth, v.obs, v.mod, config.variable, unit, selectedObservation.id].join(',');
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedObservation.id}_${config.variable}_profile.csv`);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    }, 150);
  };

  return (
    <aside className="w-80 h-full overflow-y-auto bg-slate-950/80 backdrop-blur-md border-l border-cyan-950/50 p-4 space-y-4 text-white text-xs select-none custom-scrollbar">
      {/* 1. INSTRUMENT IDENTITY CARD */}
      <div className="bg-slate-900/70 border border-cyan-950/70 rounded-xl p-3.5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-md animate-pulse"
              style={{
                backgroundColor:
                  selectedObservation.type === 'argo' ? '#f97316' : '#22c55e',
              }}
            />
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-100">
              Selected Observation
            </h2>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono flex items-center gap-1">
            <ExternalLink className="w-3 h-3 text-cyan-400" /> INCOIS
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-cyan-200">
              {selectedObservation.name}
            </span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700/50">
              {selectedObservation.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2.5 text-[11px] bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <div>
              <span className="text-slate-400 text-[10px] block">Location</span>
              <span className="font-mono text-cyan-300 font-medium">
                {selectedObservation.lat}°N, {selectedObservation.lon}°E
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Last Observation</span>
              <span className="font-mono text-slate-200 text-[10px]">
                {selectedObservation.lastUpdated}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Profile Depth</span>
              <span className="font-mono text-amber-300">
                {selectedObservation.profileDepth}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Sensor Battery</span>
              <span className="font-mono text-emerald-300">
                {selectedObservation.battery || '94%'} (Nominal)
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
          {(['profile', 'details', 'comparison'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1 text-center rounded-md font-medium text-[11px] capitalize transition-all ${
                activeTab === tab
                  ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. TAB CONTENT: PROFILE (Variable vs Depth Chart) */}
      {activeTab === 'profile' && (
        <div className="bg-slate-900/70 border border-cyan-950/70 rounded-xl p-3.5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-semibold text-xs text-slate-200">
              {currentMeta.shortLabel} vs Depth Profile
            </h3>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Obs
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Model
              </span>
            </div>
          </div>

          {/* SVG Profile Chart */}
          <div className="bg-slate-950/90 rounded-lg p-1 border border-slate-800 flex flex-col items-center relative">
            <svg width={svgWidth} height={svgHeight} className="overflow-visible">
              {/* Depth Grid Lines */}
              {[0, 200, 400, 600, 800, 1000].map((d) => (
                <g key={d}>
                  <line
                    x1={padLeft}
                    y1={getY(d)}
                    x2={svgWidth - padRight}
                    y2={getY(d)}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="2,2"
                  />
                  <text
                    x={padLeft - 6}
                    y={getY(d) + 3}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {d}
                  </text>
                </g>
              ))}

              {/* Variable Ticks */}
              {[0, 0.25, 0.5, 0.75, 1.0].map((ratio) => {
                const tickVal = minVal + ratio * (maxVal - minVal);
                return (
                  <g key={ratio}>
                    <line
                      x1={getX(tickVal)}
                      y1={padTop}
                      x2={getX(tickVal)}
                      y2={svgHeight - padBottom}
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray="2,2"
                    />
                    <text
                      x={getX(tickVal)}
                      y={svgHeight - padBottom + 14}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="8.5"
                      fontFamily="monospace"
                    >
                      {tickVal < 10 ? tickVal.toFixed(1) : Math.round(tickVal)}
                    </text>
                  </g>
                );
              })}

              {/* Axis Labels */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 3}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="9"
              >
                {currentMeta.label} ({unit})
              </text>
              <text
                transform={`rotate(-90) translate(-${svgHeight / 2}, 12)`}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="9"
              >
                Depth (m)
              </text>

              {/* Model Curve (Cyan) */}
              <path
                d={modPath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Observed Curve (Gold) */}
              <path
                d={obsPath}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Observed Data Points */}
              {selectedObservation.depthProfile.map((pt, i) => {
                const v = getPointValues(pt);
                return (
                  <circle
                    key={i}
                    cx={getX(v.obs)}
                    cy={getY(pt.depth)}
                    r={hoveredPoint?.depth === pt.depth ? '5' : '3'}
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="1"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() =>
                      setHoveredPoint({ depth: pt.depth, obsVal: v.obs, modVal: v.mod })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}

              {/* Current Depth Highlight Marker */}
              <line
                x1={padLeft}
                y1={getY(config.depth)}
                x2={svgWidth - padRight}
                y2={getY(config.depth)}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="3,3"
              />
            </svg>

            {/* Hover Tooltip inside chart */}
            {hoveredPoint && (
              <div className="absolute top-2 right-2 bg-slate-900/95 border border-amber-500/50 rounded px-2 py-1 text-[10px] text-amber-200 pointer-events-none shadow-lg">
                <span className="font-mono block">Depth: {hoveredPoint.depth}m</span>
                <span className="font-mono text-amber-300">
                  Obs: {hoveredPoint.obsVal.toFixed(1)} {unit}
                </span>{' '}
                |{' '}
                <span className="font-mono text-cyan-300">
                  Mod: {hoveredPoint.modVal.toFixed(1)} {unit}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-[10px] text-slate-400 font-mono">
              Red line: Active depth slice ({config.depth}m)
            </span>
            <button
              onClick={handleExportCSV}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              <Download className="w-3 h-3" /> CSV
            </button>
          </div>
        </div>
      )}

      {/* 2B. TAB CONTENT: DETAILS */}
      {activeTab === 'details' && (
        <div className="bg-slate-900/70 border border-cyan-950/70 rounded-xl p-3.5 space-y-2.5 text-[11px] shadow-xl">
          <h3 className="font-semibold text-slate-200">Instrument Diagnostics</h3>
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">WMO Identifier:</span>
              <span className="font-mono text-cyan-300">{selectedObservation.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Cycle Number:</span>
              <span className="font-mono text-slate-200">
                #{selectedObservation.cycleNumber || 142}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Transmission Mode:</span>
              <span className="font-mono text-slate-200">Iridium SBD Telemetry</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Data Center:</span>
              <span className="font-mono text-slate-200">INCOIS DAC / GDAC</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Sensor Calibration:</span>
              <span className="font-mono text-emerald-400">Sea-Bird SBE 41CP</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">QC Flag:</span>
              <span className="text-emerald-400 font-mono font-medium">
                1 (Good / Validated)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2C. TAB CONTENT: COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="bg-slate-900/70 border border-cyan-950/70 rounded-xl p-3.5 space-y-2.5 text-[11px] shadow-xl">
          <h3 className="font-semibold text-slate-200">Statistical Concordance</h3>
          <div className="space-y-2">
            <div className="bg-slate-950/80 p-2 rounded border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Correlation (R²):</span>
                <span className="font-mono text-cyan-300 font-bold">0.984</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>RMSE (Root Mean Square Error):</span>
                <span className="font-mono text-emerald-400 font-bold">0.32 {unit}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Mean Bias Deviation:</span>
                <span className="font-mono text-amber-300 font-bold">+0.14 {unit}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Numerical ROMS model closely tracks in-situ halocline & thermocline inflection points
              across the upper 400m water column.
            </p>
          </div>
        </div>
      )}

      {/* 3. THE CORE DIFFERENTIATOR: MODEL VS OBSERVATION CARD */}
      <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-cyan-500/40 rounded-xl p-3.5 space-y-3 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <h3 className="font-bold text-xs text-cyan-200">
            Model vs Observation <span className="font-normal text-slate-400">(at {config.depth} m)</span>
          </h3>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-[10px] text-cyan-400 font-medium block">Model</span>
            <span className="font-mono font-bold text-sm text-cyan-200">
              {modVal.toFixed(1)} {unit}
            </span>
          </div>

          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-[10px] text-amber-400 font-medium block">Observed</span>
            <span className="font-mono font-bold text-sm text-amber-200">
              {obsVal.toFixed(1)} {unit}
            </span>
          </div>

          <div className="bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/40">
            <span className="text-[10px] text-emerald-300 font-medium block">Difference</span>
            <span className="font-mono font-bold text-sm text-emerald-400">
              {diff.toFixed(2)} {unit}
            </span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
          <span>Alignment: 4D Nearest-Neighbor</span>
          <span className="text-emerald-400 font-medium">98.5% Accuracy</span>
        </div>
      </div>
    </aside>
  );
};
