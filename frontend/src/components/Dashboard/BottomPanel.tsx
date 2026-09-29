'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  ObservationMarker,
  ModelLayerConfig,
  VARIABLE_META,
  REGIONS,
  OceanRegion,
} from '../../data/mockOceanData';
import {
  Download,
  MapPin,
  Plus,
  Settings,
  Waves,
  Compass,
  Navigation,
  Calendar,
  Layers,
  FileSpreadsheet,
  X,
  Check,
  Activity,
} from 'lucide-react';

interface BottomPanelProps {
  observations: ObservationMarker[];
  selectedObservation: ObservationMarker | null;
  onSelectObservation: (obs: ObservationMarker) => void;
  config: ModelLayerConfig;
  onChangeConfig: (newConfig: Partial<ModelLayerConfig>) => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  observations,
  selectedObservation,
  onSelectObservation,
  config,
  onChangeConfig,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeModal, setActiveModal] = useState<'region' | 'layers' | 'export' | 'settings' | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Draw 2D Mini-map of Indian Ocean & Arabian Sea
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Ocean background
    ctx.fillStyle = '#031428';
    ctx.fillRect(0, 0, w, h);

    // Dynamic current vortex lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    for (let r = 20; r <= 100; r += 20) {
      ctx.beginPath();
      ctx.arc(w * 0.45, h * 0.5, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw India peninsula coastline in top right
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w * 0.65, 0);
    ctx.lineTo(w * 0.72, h * 0.25);
    ctx.lineTo(w * 0.76, h * 0.55);
    ctx.lineTo(w * 0.74, h * 0.75); // Kanyakumari
    ctx.lineTo(w * 0.85, h * 0.85);
    ctx.lineTo(w, h * 0.9);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Text labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '9px sans-serif';
    ctx.fillText('India', w * 0.8, h * 0.35);
    ctx.fillText('Arabian Sea', w * 0.15, h * 0.4);

    // Draw observation markers
    observations.forEach((obs) => {
      const mapX = ((obs.lon - 60) / 20) * (w * 0.85);
      const mapY = (1 - (obs.lat - 5) / 20) * h;
      const isSel = selectedObservation?.id === obs.id;

      // Glow ring
      ctx.fillStyle =
        obs.type === 'argo' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(34, 197, 94, 0.4)';
      ctx.beginPath();
      ctx.arc(mapX, mapY, isSel ? 8 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Dot
      ctx.fillStyle = obs.type === 'argo' ? '#f97316' : '#22c55e';
      ctx.beginPath();
      ctx.arc(mapX, mapY, isSel ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fill();

      if (isSel) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(mapX, mapY, 5.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }, [observations, selectedObservation]);

  // Click handler on 2D mini map to select closest float
  const handleMapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const w = rect.width;
    const h = rect.height;

    // Find closest marker
    let closestObs: ObservationMarker | null = null;
    let minDist = 99999;

    observations.forEach((obs) => {
      const mapX = ((obs.lon - 60) / 20) * (w * 0.85);
      const mapY = (1 - (obs.lat - 5) / 20) * h;
      const dist = Math.hypot(clickX - mapX, clickY - mapY);
      if (dist < minDist) {
        minDist = dist;
        closestObs = obs;
      }
    });

    if (closestObs !== null) {
      const selected: ObservationMarker = closestObs;
      onSelectObservation(selected);
      showToast(`Selected ${selected.name} from 2D Radar`);
    }
  };

  const handleExportData = (format: 'netcdf' | 'csv' | 'json') => {
    const filename = `INCOIS_${config.variable}_depth${config.depth}m_${Date.now()}.${format === 'netcdf' ? 'nc' : format}`;
    const mockContent = JSON.stringify(
      {
        dataset: "INCOIS ROMS Ocean Numerical Model",
        variable: config.variable,
        depth_m: config.depth,
        timestamp: "2026-08-15T12:00:00Z",
        observations_count: observations.length,
        observations: observations.map((o) => ({
          id: o.id,
          name: o.name,
          lat: o.lat,
          lon: o.lon,
          observed: o.observedValues,
          model: o.modelValues,
        })),
      },
      null,
      2
    );

    const blob = new Blob([mockContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 150);
    setActiveModal(null);
    showToast(`Exported ${filename}`);
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-48 left-1/2 transform -translate-x-1/2 bg-cyan-950/95 border border-cyan-400/80 text-cyan-200 px-4 py-2 rounded-xl text-xs shadow-2xl backdrop-blur-md z-50 flex items-center gap-2 animate-fade-in">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Bottom Panel */}
      <div className="h-44 bg-slate-950/90 backdrop-blur-md border-t border-cyan-950/60 p-3 grid grid-cols-1 md:grid-cols-4 gap-3 text-white text-xs select-none z-20">
        {/* 1. MAP VIEW (2D RADAR) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="font-semibold text-xs text-slate-200">Map View (2D Radar)</span>
            <span className="text-[10px] text-cyan-400 font-mono">Click to target</span>
          </div>
          <div className="relative flex-1 my-1 rounded-lg overflow-hidden border border-slate-800">
            <canvas
              ref={canvasRef}
              width={240}
              height={90}
              className="w-full h-full object-cover cursor-crosshair"
              onClick={handleMapClick}
              title="Click float in radar to inspect in 3D"
            />
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Argo Float
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Glider Track
            </span>
            <span className="text-cyan-400 font-mono">Live Sync</span>
          </div>
        </div>

        {/* 2. VARIABLE COMPARISON STATS */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="font-semibold text-xs text-slate-200">
              Variable Slicing ({VARIABLE_META[config.variable].shortLabel})
            </span>
            <span className="text-[10px] text-amber-300 font-mono">
              {config.depth} m Depth
            </span>
          </div>

          <div className="space-y-1.5 my-auto text-[11px]">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Model Resolution:</span>
              <span className="font-mono text-cyan-300">1/12° (≈9 km grid)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Vertical Layers:</span>
              <span className="font-mono text-cyan-300">40 Sigma Levels</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Temporal Cadence:</span>
              <span className="font-mono text-cyan-300">Hourly Assimilation</span>
            </div>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className={`h-full bg-gradient-to-r ${VARIABLE_META[config.variable].legendGradient}`}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* 3. QUICK STATS */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="font-semibold text-xs text-slate-200">Quick Stats</span>
            <span className="text-[10px] text-emerald-400 font-mono">Active Feed</span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-auto text-[11px]">
            <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-cyan-950 flex items-center justify-center text-cyan-400">
                <Waves className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">Model Vars</span>
                <span className="font-mono font-bold text-cyan-200">4 Fields</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-orange-950 flex items-center justify-center text-orange-400">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">Argo Floats</span>
                <span className="font-mono font-bold text-orange-200">1,248</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-950 flex items-center justify-center text-emerald-400">
                <Navigation className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">Gliders</span>
                <span className="font-mono font-bold text-emerald-200">86</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-950 flex items-center justify-center text-indigo-400">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block">Time Span</span>
                <span className="font-mono font-bold text-indigo-200">10-20 Aug</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. MORE OPTIONS / ACTIONS */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="font-semibold text-xs text-slate-200">More Options</span>
            <Settings className="w-3 h-3 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-1.5 my-auto">
            <button
              onClick={() => setActiveModal('export')}
              className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex items-center gap-1.5 transition-colors text-[10px]"
            >
              <Download className="w-3 h-3 text-cyan-400" />
              <span>Export Data</span>
            </button>

            <button
              onClick={() => setActiveModal('region')}
              className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex items-center gap-1.5 transition-colors text-[10px]"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Change Region</span>
            </button>

            <button
              onClick={() => setActiveModal('layers')}
              className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex items-center gap-1.5 transition-colors text-[10px]"
            >
              <Plus className="w-3 h-3 text-amber-400" />
              <span>Add Layer</span>
            </button>

            <button
              onClick={() => setActiveModal('settings')}
              className="p-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex items-center gap-1.5 transition-colors text-[10px]"
            >
              <Settings className="w-3 h-3 text-indigo-400" />
              <span>Preferences</span>
            </button>
          </div>
        </div>
      </div>

      {/* REGION SELECTION MODAL */}
      {activeModal === 'region' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/50 rounded-2xl p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-100">Select Ocean Region</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {REGIONS.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => {
                    onChangeConfig({ selectedRegionId: reg.id });
                    setActiveModal(null);
                    showToast(`Region focused: ${reg.name}`);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    config.selectedRegionId === reg.id
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs">{reg.name}</span>
                    {config.selectedRegionId === reg.id && (
                      <Check className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{reg.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EXPORT DATA MODAL */}
      {activeModal === 'export' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/50 rounded-2xl p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-slate-100">Export Ocean Dataset</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Download current depth slice ({config.depth}m) and in-situ Argo float profiles compliant
              with CF Conventions.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleExportData('netcdf')}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-cyan-400 rounded-xl text-center transition-all group"
              >
                <span className="font-bold text-xs text-cyan-300 block mb-1 group-hover:scale-105 transition-transform">
                  .NetCDF (.nc)
                </span>
                <span className="text-[10px] text-slate-500">INCOIS 3D Grid</span>
              </button>

              <button
                onClick={() => handleExportData('csv')}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-400 rounded-xl text-center transition-all group"
              >
                <span className="font-bold text-xs text-emerald-300 block mb-1 group-hover:scale-105 transition-transform">
                  .CSV Table
                </span>
                <span className="text-[10px] text-slate-500">Argo Profiles</span>
              </button>

              <button
                onClick={() => handleExportData('json')}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-400 rounded-xl text-center transition-all group"
              >
                <span className="font-bold text-xs text-amber-300 block mb-1 group-hover:scale-105 transition-transform">
                  GeoJSON
                </span>
                <span className="text-[10px] text-slate-500">GIS Features</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD LAYER MODAL */}
      {activeModal === 'layers' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/50 rounded-2xl p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">Layer Catalog</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { name: 'HF Coastal Radar Surface Currents', agency: 'INCOIS NIOT', status: 'Available' },
                { name: 'Satellite Altimetry Sea Surface Height (SSH)', agency: 'AVISO / SARAL-AltiKa', status: 'Available' },
                { name: 'Moored Buoy Network (OOM)', agency: 'MoES INCOIS', status: 'Active' },
                { name: 'Potential Fishing Zone (PFZ) Advisory', agency: 'INCOIS Marine', status: 'Integrated' },
              ].map((layer, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all"
                  onClick={() => {
                    setActiveModal(null);
                    showToast(`Added ${layer.name} layer`);
                  }}
                >
                  <div>
                    <span className="font-semibold text-xs text-slate-200 block">{layer.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{layer.agency}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Add
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS / PREFERENCES MODAL */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/50 rounded-2xl p-5 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-100">Preferences & Diagnostics</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-300">WebGL Renderer:</span>
                <span className="font-mono text-cyan-300">Three.js R186 (Hardware Accelerated)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-300">Interpolation Model:</span>
                <span className="font-mono text-emerald-300">4D Space-Time Nearest Neighbor</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-300">Target Resolution:</span>
                <span className="font-mono text-slate-200">1024 x 1024 Colormap Canvas</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-300">Standards Compliance:</span>
                <span className="font-mono text-cyan-300">CF-1.8, OGC WMS/WCS</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
